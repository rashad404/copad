const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  ts = require("typescript"),
  Module = require("node:module");
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
const { syncReadings, InterruptedSync } = require("../src/health/sync.ts");
const {
  syncInstant,
  firstSyncDate,
  validSample,
  canSyncBinding,
} = require("../src/health/model.ts");
const { healthConnectSamples } = require("../src/health/healthConnectModel.ts");
const now = new Date("2026-09-08T12:00:00Z");
const sample = (id, at = "2026-09-08T10:00:00Z", overrides = {}) => ({
  type: "WEIGHT",
  value: 70,
  unit: "kg",
  sourceRef: String(id),
  measuredAt: at,
  ...overrides,
});
const response = (accepted, other = {}) => ({
  accepted,
  alreadyHad: 0,
  skippedManual: 0,
  rejected: 0,
  syncedThrough: "2026-09-08T10:00:00",
  maxBatch: 500,
  ...other,
});
const run = (samples, send, extra = {}) =>
  syncReadings({
    source: { read: async () => ({ samples, notSent: 0 }) },
    cursor: "2026-09-08T00:00:00",
    signal: new AbortController().signal,
    now,
    send,
    ...extra,
  });
test("sync pages at 500, follows a smaller returned limit and counts every outcome", async () => {
  const sizes = [];
  const result = await run(
    Array.from({ length: 1100 }, (_, i) => sample(i)),
    async (batch) => {
      sizes.push(batch.length);
      return response(batch.length - 3, {
        alreadyHad: 1,
        skippedManual: 1,
        rejected: 1,
        maxBatch: 200,
      });
    },
  );
  assert.deepEqual(sizes, [500, 200, 200, 200]);
  assert.deepEqual(
    [
      result.accepted,
      result.alreadyHad,
      result.skippedManual,
      result.rejected,
      result.complete,
    ],
    [1088, 4, 4, 4, true],
  );
});
test("sync resumes from UTC cursor and interleaves types chronologically before sending", async () => {
  const reads = [],
    sent = [];
  await syncReadings({
    source: {
      read: async (from, to) => {
        reads.push([from.toISOString(), to.toISOString()]);
        return {
          samples: [
            sample("late", "2026-09-08T11:00:00Z"),
            sample("early", "2026-09-08T10:00:00Z", { type: "HEIGHT" }),
          ],
          notSent: 0,
        };
      },
    },
    cursor: "2026-09-08T09:00:00",
    signal: new AbortController().signal,
    now,
    send: async (batch) => {
      sent.push(...batch);
      return response(batch.length);
    },
  });
  assert.equal(reads[0][0], "2026-09-08T09:00:00.000Z");
  assert.deepEqual(
    sent.map((s) => s.sourceRef),
    ["early", "late"],
  );
  assert.equal(firstSyncDate(now).toISOString(), "2026-08-09T12:00:00.000Z");
});
test("future readings, missing native IDs, BMI and invalid values are never sent", async () => {
  let sent = [];
  const result = await run(
    [
      sample("valid"),
      sample("future", "2026-09-09T10:00:00Z"),
      sample(""),
      sample("bmi", undefined, { type: "BMI" }),
      sample("nan", undefined, { value: NaN }),
    ],
    async (batch) => {
      sent = batch;
      return response(batch.length);
    },
  );
  assert.equal(result.notSent, 4);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].sourceRef, "valid");
});
test("an interrupted upload preserves precise completed counts and does not claim completion", async () => {
  let requests = 0;
  const progress = [];
  await assert.rejects(
    run(
      Array.from({ length: 600 }, (_, i) => sample(i)),
      async (batch) => {
        if (++requests === 2) throw Error("offline");
        return response(batch.length - 1, { skippedManual: 1 });
      },
      { onProgress: async (totals) => progress.push(totals) },
    ),
    (error) => {
      assert.ok(error instanceof InterruptedSync);
      assert.equal(error.outcome.accepted, 499);
      assert.equal(error.outcome.skippedManual, 1);
      assert.equal(error.outcome.complete, false);
      return true;
    },
  );
  assert.equal(progress.length, 1);
});
test("invalid server counts are rejected atomically, and cancellation prevents uploads", async () => {
  await assert.rejects(
    run([sample(1)], async () => response(1, { rejected: 1 })),
    (e) => e.outcome.accepted === 0,
  );
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(
    run(
      [sample(1)],
      async () => {
        assert.fail("must not upload");
      },
      { signal: controller.signal },
    ),
  );
});
test("no data is an explicit zero-count result; an invalid cursor never restarts all history", async () => {
  const result = await run([], async () => assert.fail("no empty writes"));
  assert.equal(result.complete, true);
  assert.equal(result.accepted, 0);
  await assert.rejects(
    run([], async () => assert.fail(), { cursor: "not-a-date" }),
    (e) => e.cause.message === "INVALID_SYNC_CURSOR",
  );
});
test("Health Connect preserves native IDs and converts platform unit fields without computing BMI", () => {
  const weight = healthConnectSamples({
    recordType: "Weight",
    metadata: { id: "native-uuid" },
    time: now.toISOString(),
    weight: { inKilograms: 72 },
  })[0];
  assert.equal(weight.sourceRef, "native-uuid");
  assert.equal(weight.unit, "kg");
  assert.equal(weight.value, 72);
  const height = healthConnectSamples({
    recordType: "Height",
    metadata: { id: "height-uuid" },
    time: now.toISOString(),
    height: { inMeters: 1.8 },
  })[0];
  assert.equal(height.value, 180);
  assert.equal(height.unit, "cm");
});
test("compound Android IDs stop before upload rather than silently losing blood pressure or heart rate samples", async () => {
  const bp = healthConnectSamples({
    recordType: "BloodPressure",
    metadata: { id: "native-pair-id" },
    time: "2026-09-08T10:00:00Z",
    systolic: { inMillimetersOfMercury: 120 },
    diastolic: { inMillimetersOfMercury: 80 },
  });
  assert.deepEqual(
    bp.map((s) => s.sourceRef),
    ["native-pair-id", "native-pair-id"],
  );
  await assert.rejects(
    run(bp, async () => assert.fail("must not lose half a pair")),
    (e) => e.cause.message === "HEALTH_SOURCE_ID_COLLISION",
  );
  const hr = healthConnectSamples({
    recordType: "HeartRate",
    metadata: { id: "series-id" },
    samples: [
      { time: "2026-09-08T10:00:00Z", beatsPerMinute: 70 },
      { time: "2026-09-08T10:00:01Z", beatsPerMinute: 71 },
    ],
  });
  await assert.rejects(
    run(hr, async () => assert.fail("must not lose series")),
    (e) => e.cause.message === "HEALTH_SOURCE_ID_COLLISION",
  );
});
test("only a writable own-member binding is eligible for phone data", () => {
  assert.equal(canSyncBinding(11, [11, 12], true, true), true);
  assert.equal(canSyncBinding(11, [11, 12], false, true), false);
  assert.equal(canSyncBinding(11, [11, 12], true, false), false);
  assert.equal(canSyncBinding(99, [11, 12], true, true), false);
});
test("health copy and native permission descriptions have AZ, EN, RU without decorative punctuation", () => {
  const copy = require("../src/copy/healthSync.json");
  for (const language of ["az", "en", "ru"]) {
    assert.deepEqual(
      Object.keys(copy[language]).sort(),
      Object.keys(copy.az).sort(),
    );
    assert.doesNotMatch(
      JSON.stringify(copy[language]),
      /[\u2013\u2014\u2018\u2019\u201c\u201d\u2026]/,
    );
    assert.ok(
      require(`../locales/${language}.json`).ios.NSHealthShareUsageDescription,
    );
  }
});
test("HealthKit adapter requests read only, pages native anchors and converts fraction to percent", async () => {
  const original = Module._load,
    queries = [],
    authorizations = [];
  let denied = false;
  const hk = {
    isHealthDataAvailable: async () => true,
    requestAuthorization: async (read, write) => {
      authorizations.push({ read, write });
      return true;
    },
    queryQuantitySamplesWithAnchor: async (type, options) => {
      queries.push({ type, options });
      if (denied)
        return { samples: [], deletedSamples: [], newAnchor: "empty" };
      const s = (uuid, quantity) => ({
        uuid,
        quantity,
        startDate: new Date("2026-09-08T10:00:00Z"),
      });
      if (type === "bodyMass")
        return {
          samples: options.anchor
            ? [s("last-weight", 70)]
            : Array.from({ length: 500 }, (_, i) => s(`hk-${i}`, 70)),
          deletedSamples: [],
          newAnchor: options.anchor ? "end" : "next",
        };
      if (type === "oxygenSaturation")
        return {
          samples: [s("oxygen-id", 0.97)],
          deletedSamples: [],
          newAnchor: "end",
        };
      return { samples: [], deletedSamples: [], newAnchor: "end" };
    },
  };
  Module._load = function (id, ...args) {
    if (id === "@kingstinct/react-native-healthkit")
      return {
        __esModule: true,
        default: hk,
        HKQuantityTypeIdentifier: new Proxy({}, { get: (_, key) => key }),
      };
    if (id === "react-native")
      return { Linking: { openSettings: async () => {} } };
    return original.call(this, id, ...args);
  };
  try {
    const device = require("../src/health/deviceHealth.ios.ts").default;
    const permission = await device.request();
    assert.equal(permission.requested, true);
    assert.equal(permission.limited, true);
    assert.deepEqual(authorizations[0].write, []);
    assert.equal(authorizations[0].read.length, 10);
    const result = await device.read(
      new Date("2026-09-08T00:00:00Z"),
      now,
      new AbortController().signal,
    );
    assert.equal(result.samples.length, 502);
    assert.equal(
      result.samples.find((s) => s.type === "OXYGEN_SATURATION").value,
      97,
    );
    assert.equal(result.samples[0].sourceRef, "hk-0");
    assert.equal(queries[1].options.anchor, "next");
    denied = true;
    assert.deepEqual(
      await device.read(
        new Date("2026-09-08T00:00:00Z"),
        now,
        new AbortController().signal,
      ),
      { samples: [], notSent: 0 },
    );
  } finally {
    Module._load = original;
  }
});
test("Health Connect refusal does not connect, and revoked access does not become a silent success", async () => {
  const original = Module._load;
  Module._load = function (id, ...args) {
    if (id === "react-native-health-connect")
      return {
        SdkAvailabilityStatus: { SDK_AVAILABLE: 3 },
        getSdkStatus: async () => 3,
        initialize: async () => true,
        requestPermission: async () => [],
        getGrantedPermissions: async () => [],
      };
    return original.call(this, id, ...args);
  };
  try {
    const device = require("../src/health/deviceHealth.android.ts").default;
    assert.deepEqual(await device.request(), {
      requested: false,
      limited: true,
    });
    await assert.rejects(
      device.read(
        new Date("2026-09-08T00:00:00Z"),
        now,
        new AbortController().signal,
      ),
      { message: "HEALTH_PERMISSION_DENIED" },
    );
  } finally {
    Module._load = original;
  }
});
test("Health Connect follows page tokens for permitted types and keeps platform IDs", async () => {
  const original = Module._load,
    requests = [];
  const permissions = [{ accessType: "read", recordType: "Weight" }];
  const hc = {
    SdkAvailabilityStatus: { SDK_AVAILABLE: 3 },
    getSdkStatus: async () => 3,
    initialize: async () => true,
    requestPermission: async () => permissions,
    getGrantedPermissions: async () => permissions,
    readRecords: async (type, options) => {
      requests.push({ type, options });
      return {
        records: [
          {
            metadata: {
              id: options.pageToken ? "second-native-id" : "first-native-id",
            },
            time: "2026-09-08T10:00:00Z",
            weight: { inKilograms: 70 },
          },
        ],
        pageToken: options.pageToken ? undefined : "next-page",
      };
    },
  };
  Module._load = function (id, ...args) {
    if (id === "react-native-health-connect") return hc;
    return original.call(this, id, ...args);
  };
  try {
    delete require.cache[
      require.resolve("../src/health/deviceHealth.android.ts")
    ];
    const device = require("../src/health/deviceHealth.android.ts").default;
    assert.deepEqual(await device.request(), {
      requested: true,
      limited: true,
    });
    const result = await device.read(
      new Date("2026-09-08T00:00:00Z"),
      now,
      new AbortController().signal,
    );
    assert.deepEqual(
      result.samples.map((s) => s.sourceRef),
      ["first-native-id", "second-native-id"],
    );
    assert.deepEqual(
      requests.map((r) => r.type),
      ["Weight", "Weight"],
    );
    assert.equal(requests[0].options.pageSize, 500);
    assert.equal(requests[1].options.pageToken, "next-page");
    permissions[0].recordType = "HeartRate";
    hc.readRecords = async () => ({
      records: [
        {
          metadata: { id: "multi-day-series" },
          samples: [
            { time: "2026-09-07T10:00:00Z", beatsPerMinute: 70 },
            { time: "2026-09-08T10:00:00Z", beatsPerMinute: 72 },
          ],
        },
      ],
    });
    await assert.rejects(
      device.read(
        new Date("2026-09-08T00:00:00Z"),
        now,
        new AbortController().signal,
      ),
      { message: "HEALTH_SOURCE_ID_COLLISION" },
    );
  } finally {
    Module._load = original;
  }
});
