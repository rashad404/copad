// Explicit local-only integration check. Creates and deletes one synthetic account.
// Never targets production, accepts real credentials, or prints clinical payloads.
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs"),
  ts = require("typescript");
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = (module, file) =>
    module._compile(
      ts.transpileModule(fs.readFileSync(file, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          esModuleInterop: true,
        },
      }).outputText,
      file,
    );
const { syncReadings } = require("../src/health/sync.ts");
const { healthConnectSamples } = require("../src/health/healthConnectModel.ts");
if (process.env.AZDOC_LOCAL_INTEGRATION !== "1")
  throw Error(
    "Set AZDOC_LOCAL_INTEGRATION=1 only for the local development backend.",
  );
const base = "http://127.0.0.1:8002/api";
let token;
const password = crypto.randomBytes(24).toString("hex");
async function request(path, method = "GET", body) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok)
    throw Error(
      `Local integration request failed: ${method} ${path.replace(/\d+/g, ":id")} (${response.status})`,
    );
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
(async () => {
  try {
    token = await request("/auth/register", "POST", {
      name: "Codex synthetic sync check",
      email: `codex-sync-${crypto.randomUUID()}@example.invalid`,
      password,
    });
    assert.equal(typeof token, "string");
    await request("/account/consent", "POST", { type: "RECORD_STORAGE" });
    const families = await request("/families");
    const member = families.flatMap((f) => f.members).find((m) => m.self);
    assert.ok(member, "A synthetic account should have its own member");
    const path = `/members/${member.id}/health-sync`;
    await request(path + "/connect", "POST", {
      provider: "HEALTH_CONNECT",
      deviceLabel: "Synthetic integration fixture",
    });
    const now = new Date(),
      at = new Date(now.getTime() - 24 * 3600000);
    const pairId = crypto.randomUUID(),
      seriesId = crypto.randomUUID();
    const bp = healthConnectSamples({
      recordType: "BloodPressure",
      metadata: { id: pairId },
      time: at.toISOString(),
      systolic: { inMillimetersOfMercury: 120 },
      diastolic: { inMillimetersOfMercury: 80 },
    });
    const hr = healthConnectSamples({
      recordType: "HeartRate",
      metadata: { id: seriesId },
      samples: [0, 1, 2].map((i) => ({
        time: new Date(at.getTime() + i * 1000).toISOString(),
        beatsPerMinute: 70 + i,
      })),
    });
    const options = {
      source: { read: async () => ({ samples: [...bp, ...hr], notSent: 0 }) },
      cursor: new Date(at.getTime() - 1000).toISOString(),
      now,
      signal: new AbortController().signal,
      send: (samples) =>
        request(path, "POST", { provider: "HEALTH_CONNECT", samples }),
    };
    const first = await syncReadings(options);
    assert.deepEqual(
      [first.accepted, first.alreadyHad, first.skippedManual, first.rejected],
      [5, 0, 0, 0],
    );
    const second = await syncReadings(options);
    assert.deepEqual(
      [
        second.accepted,
        second.alreadyHad,
        second.skippedManual,
        second.rejected,
      ],
      [0, 5, 0, 0],
    );
    for (const [type, count] of [
      ["BLOOD_PRESSURE_SYSTOLIC", 1],
      ["BLOOD_PRESSURE_DIASTOLIC", 1],
      ["PULSE", 3],
    ]) {
      const rows = await request(`/members/${member.id}/vitals/series/${type}`);
      assert.equal(rows.length, count);
      // The API need not expose sourceRef. Source identity is verified by the resend counts.
    }
    console.log(
      "PASS: local backend stored both BP values and all three heart-rate samples; all five resends were duplicates.",
    );
  } finally {
    if (token) {
      await request("/account", "DELETE", { password });
      token = undefined;
      console.log("PASS: synthetic account and records removed.");
    }
  }
})().catch((error) => {
  console.error(
    error instanceof assert.AssertionError
      ? "FAIL: local sync contract assertion at " +
          error.stack
            .split("\n")
            .find((line) => line.includes("health-sync-local.cjs:"))
            .trim()
      : error.message,
  );
  process.exitCode = 1;
});
