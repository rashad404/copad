import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import axios from "axios";
const require = createRequire(import.meta.url);
function compile(path) {
  return ts.transpileModule(
    readFileSync(new URL(path, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    },
  ).outputText;
}
function dataModule(source) {
  return `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`;
}
const axiosUrl = pathToFileURL(
  require.resolve("axios").replace("/dist/node/axios.cjs", "/index.js"),
).href;
const model = await import(
  dataModule(
    compile("../src/components/health/model.ts").replace(
      /from ['"]axios['"]/g,
      `from '${axiosUrl}'`,
    ),
  )
);

test("read-only and unknown roles cannot write", () => {
  for (const role of ["VIEWER", undefined, "ADMIN", ""])
    assert.equal(model.canWrite(role), false);
  for (const role of ["OWNER", "ADULT"])
    assert.equal(model.canWrite(role), true);
});
test("displays entered values and units rather than canonical conversions", () => {
  assert.deepEqual(
    model.enteredReading({
      value: 70.3068,
      unit: "kg",
      valueEntered: 155,
      unitEntered: "lb",
    }),
    { value: 155, unit: "lb" },
  );
  assert.deepEqual(
    model.enteredReading({
      value: 37,
      unit: "C",
      valueEntered: 98.6,
      unitEntered: "F",
    }),
    { value: 98.6, unit: "F" },
  );
  assert.deepEqual(
    model.enteredReading({
      value: 5.55,
      unit: "mmol/L",
      valueEntered: 100,
      unitEntered: "mg/dL",
    }),
    { value: 100, unit: "mg/dL" },
  );
  assert.deepEqual(
    model.enteredReading({
      value: 3,
      unit: "kg",
      valueEntered: 0,
      unitEntered: "g",
    }),
    { value: 0, unit: "g" },
  );
});
test("falls back to canonical units only when entered data is absent", () => {
  assert.deepEqual(
    model.enteredReading({
      value: 22,
      unit: "kg/m2",
      valueEntered: null,
      unitEntered: null,
    }),
    { value: 22, unit: "kg/m2" },
  );
});
test("surfaces readable API 400 validation messages", () => {
  const error = new axios.AxiosError(
    "Request failed",
    "ERR_BAD_REQUEST",
    undefined,
    undefined,
    { status: 400, data: { message: "Unrecognised unit 'banana' for WEIGHT" } },
  );
  assert.equal(
    model.readableError(error, "Fallback"),
    "Unrecognised unit 'banana' for WEIGHT",
  );
  error.response.data = "Measurement is outside the allowed range";
  assert.equal(
    model.readableError(error, "Fallback"),
    "Measurement is outside the allowed range",
  );
  error.response.data = "<html>Gateway failed</html>";
  assert.equal(model.readableError(error, "Fallback"), "Fallback");
});
test("clinical payloads preserve false and zero, convert optional blanks to null, exclude response-only flags", () => {
  const fields = model.recordDefinitions.allergies.fields;
  const values = {
    allergen: " Latex ",
    allergenType: "LATEX",
    active: false,
    severity: "UNKNOWN",
    reaction: "",
    onsetDate: "",
    notes: "",
    critical: true,
    id: 999,
  };
  const payload = model.formPayload(fields, values);
  assert.equal(payload.allergen, "Latex");
  assert.equal(payload.active, false);
  assert.equal(payload.reaction, null);
  assert.equal("critical" in payload, false);
  assert.equal("id" in payload, false);
  const dose = model.formPayload(model.recordDefinitions.medications.fields, {
    name: "Example",
    doseAmount: "0",
    active: true,
  });
  assert.equal(dose.doseAmount, 0);
});
test("critical flags have explicit labels in both languages", () => {
  const en = (a) => a,
    az = (_, a) => a;
  assert.equal(model.enumLabel("CRITICAL_HIGH", en), "Critically high");
  assert.equal(model.enumLabel("CRITICAL_LOW", az), "Kritik dərəcədə aşağı");
  assert.equal(model.enumLabel("LIFE_THREATENING", en), "Life-threatening");
});

const requests = [];
globalThis.__healthRecordTestApi = axios.create({
  adapter: async (config) => {
    requests.push(config);
    return { status: 200, statusText: "OK", headers: {}, config, data: [] };
  },
});
const apiSource = compile("../src/api/healthRecord.ts").replace(
  /import api from ['"]\.\/axios['"];?/,
  "const api=globalThis.__healthRecordTestApi;",
);
const { healthApi } = await import(dataModule(apiSource));
test("routes all record operations to the selected member and correct entry", async () => {
  for (const kind of [
    "conditions",
    "allergies",
    "medications",
    "immunizations",
  ]) {
    await healthApi.list(42, kind);
    assert.equal(requests.at(-1).url, `/members/42/${kind}`);
    await healthApi.save(42, kind, { notes: "x" });
    assert.equal(requests.at(-1).method, "post");
    await healthApi.save(42, kind, { notes: "x" }, 19);
    assert.equal(requests.at(-1).url, `/members/42/${kind}/19`);
    assert.equal(requests.at(-1).method, "put");
    await healthApi.remove(42, kind, 19);
    assert.equal(requests.at(-1).url, `/members/42/${kind}/19`);
    assert.equal(requests.at(-1).method, "delete");
  }
});
test("sends the entered vital without client-side conversion", async () => {
  await healthApi.addVital(42, {
    vitalType: "TEMPERATURE",
    value: 98.6,
    unit: "F",
  });
  assert.equal(requests.at(-1).url, "/members/42/vitals");
  assert.deepEqual(JSON.parse(requests.at(-1).data), {
    vitalType: "TEMPERATURE",
    value: 98.6,
    unit: "F",
  });
});
test("uses member-scoped series, trend window and audit endpoints", async () => {
  const controller = new AbortController();
  await healthApi.series(42, "WEIGHT", controller.signal);
  assert.equal(requests.at(-1).url, "/members/42/vitals/series/WEIGHT");
  assert.equal(requests.at(-1).signal, controller.signal);
  await healthApi.trends(42, 90);
  assert.deepEqual(requests.at(-1).params, { windowDays: 90 });
  await healthApi.history(42);
  assert.equal(requests.at(-1).url, "/members/42/history");
});

test("timeline requests the selected member and explicit 100-event limit", async () => {
  const controller = new AbortController();
  await healthApi.timeline(42, controller.signal);
  assert.equal(requests.at(-1).url, "/members/42/timeline");
  assert.deepEqual(requests.at(-1).params, { limit: 100 });
  assert.equal(requests.at(-1).signal, controller.signal);
});
test("summary uses the API client with blob response type and a cancellation signal", async () => {
  const controller = new AbortController();
  await healthApi.summaryPdf(42, controller.signal);
  assert.equal(requests.at(-1).url, "/members/42/summary.pdf");
  assert.equal(requests.at(-1).responseType, "blob");
  assert.equal(requests.at(-1).headers.Accept, "application/pdf");
  assert.equal(requests.at(-1).signal, controller.signal);
});

test("PDF request carries the stored JWT through the real shared Axios interceptor", async () => {
  const originalWindow = globalThis.window;
  const originalStorage = globalThis.localStorage;
  const originalApi = globalThis.__healthRecordTestApi;
  try {
    globalThis.window = {};
    globalThis.localStorage = {
      getItem: (key) => (key === "token" ? "synthetic-test-jwt" : null),
    };
    const baseStub = dataModule(
      'export const resolveApiBaseUrl=()=>"http://unused.test/api";',
    );
    const clientSource = compile("../src/api/axios.ts")
      .replace(/from ['"]axios['"]/g, `from '${axiosUrl}'`)
      .replace(/from ['"]\.\/apiBase['"]/g, `from '${baseStub}'`);
    const { default: client } = await import(dataModule(clientSource));
    let captured;
    client.defaults.adapter = async (config) => {
      captured = config;
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: new Blob(["%PDF"], { type: "application/pdf" }),
      };
    };
    globalThis.__healthRecordTestApi = client;
    const { healthApi: authenticatedApi } = await import(
      dataModule(apiSource + "\n// authenticated client test")
    );
    await authenticatedApi.summaryPdf(42);
    assert.equal(captured.headers.Authorization, "Bearer synthetic-test-jwt");
    assert.equal(captured.headers.Accept, "application/pdf");
    assert.equal(captured.responseType, "blob");
    assert.equal(captured.url, "/members/42/summary.pdf");
  } finally {
    globalThis.window = originalWindow;
    if (originalStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = originalStorage;
    globalThis.__healthRecordTestApi = originalApi;
  }
});
