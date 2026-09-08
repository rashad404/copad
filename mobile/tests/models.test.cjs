const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  Module = require("node:module"),
  ts = require("typescript");
global.__DEV__ = true;
const memory = new Map();
global.sessionStorage = {
  getItem: (k) => memory.get(k) || null,
  setItem: (k, v) => memory.set(k, v),
  removeItem: (k) => memory.delete(k),
};
const load = Module._load;
Module._load = function (r, p, ...args) {
  if (r === "react-native") return { Platform: { OS: "web" } };
  if (r === "expo-secure-store")
    return {
      getItemAsync: async (k) => memory.get(k) || null,
      setItemAsync: async (k, v) => memory.set(k, v),
      deleteItemAsync: async (k) => memory.delete(k),
    };
  return load.call(this, r, p, ...args);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = (module, file) =>
    module._compile(
      ts.transpileModule(fs.readFileSync(file, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2020,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
      }).outputText,
      file,
    );
const { decimal, calendarDate } = require("../src/core/validation.ts");
const record = require("../src/api/recordModel.ts");
const labs = require("../src/api/labModel.ts");
const { urgencyFromHeaders } = require("../src/api/chatUrgency.ts");
const { pendingConsentStore, tokenStore } = require("../src/core/storage.ts");
const api = require("../src/core/api.ts").default;
const originalAdapter = api.defaults.adapter;
afterEach(() => {
  memory.clear();
  api.defaults.adapter = originalAdapter;
});
test("decimal input accepts local separators but rejects blank and non-numeric values", () => {
  assert.equal(decimal("9,4"), 9.4);
  assert.equal(decimal("0"), 0);
  assert.equal(decimal("-2.5"), -2.5);
  for (const v of ["", null, "9,4,2", "0x10", "Infinity"])
    assert.ok(Number.isNaN(decimal(v)));
  assert.deepEqual(
    record.formPayload(
      [{ key: "value", type: "number", label: ["Value", "Göstərici"] }],
      { value: "9,4" },
    ),
    { value: 9.4 },
  );
});
test("calendar dates reject impossible dates and preserve leap days", () => {
  assert.equal(calendarDate("2024-02-29"), true);
  assert.equal(calendarDate("2025-02-29"), false);
  assert.equal(calendarDate("2026-02-30"), false);
  assert.equal(calendarDate("2026-09-08"), true);
});
test("VIEWER and missing permissions cannot write; entered units remain visible", () => {
  assert.equal(record.canWrite("OWNER"), true);
  assert.equal(record.canWrite("ADULT"), true);
  assert.equal(record.canWrite("VIEWER"), false);
  assert.equal(record.canWrite(undefined), false);
  assert.deepEqual(
    record.enteredReading({
      value: 30,
      unit: "kg",
      valueEntered: 66.1,
      unitEntered: "lb",
    }),
    { value: 66.1, unit: "lb" },
  );
  assert.deepEqual(
    record.enteredReading({
      value: 0,
      unit: "C",
      valueEntered: 32,
      unitEntered: "F",
    }),
    { value: 32, unit: "F" },
  );
});
test("lab requests omit unused contact fields and never turn missing prices into zero", () => {
  const tests = [
    { id: 1, price: 12.1 },
    { id: 2, price: null },
  ];
  assert.deepEqual(labs.basketTotal(tests, "HOME", 5), {
    known: 17.1,
    complete: false,
  });
  assert.deepEqual(
    labs.orderRequest(
      7,
      [tests[0], tests[0]],
      "LAB",
      "old address",
      "old phone",
    ),
    { labId: 7, testIds: [1], collection: "LAB" },
  );
  assert.deepEqual(labs.orderRequest(7, tests, "HOME", " Bakı ", " 050 "), {
    labId: 7,
    testIds: [1, 2],
    collection: "HOME",
    address: "Bakı",
    contactPhone: "050",
  });
  assert.equal(labs.money(null, "az", "unknown"), "unknown");
  assert.equal(labs.cancellable("SAMPLE_COLLECTED"), false);
});
test("urgency requires the explicit header and restricts emergency dial targets", () => {
  assert.equal(urgencyFromHeaders({}), null);
  assert.equal(urgencyFromHeaders({ "X-Urgent": "false" }), null);
  assert.deepEqual(
    urgencyFromHeaders({
      "X-Urgent": "true",
      "X-Emergency-Number": "112",
      "X-Urgent-Categories": "one; two",
    }),
    { number: "112", categories: ["one", "two"] },
  );
  assert.equal(
    urgencyFromHeaders({
      "X-Urgent": "true",
      "X-Emergency-Number": "tel:999999",
    }).number,
    "103",
  );
});
test("pending consent choices preserve a refusal across app reloads", async () => {
  await pendingConsentStore.set({
    email: "test@example.invalid",
    storage: true,
    ai: false,
  });
  assert.deepEqual(await pendingConsentStore.get(), {
    email: "test@example.invalid",
    storage: true,
    ai: false,
  });
  await pendingConsentStore.clear();
  assert.equal(await pendingConsentStore.get(), null);
});
test("registration stores refusals first and never grants AI consent when unchecked", async () => {
  const calls = [],
    consents = [];
  await tokenStore.set("fixture-token");
  api.defaults.adapter = async (config) => {
    const body = config.data ? JSON.parse(config.data) : {};
    const type = body.type || config.url.split("/").pop();
    calls.push({
      method: config.method,
      type,
      auth: config.headers.Authorization,
    });
    consents.push({
      type,
      active: config.method === "post",
      withdrawnAt: config.method === "delete" ? "2026-09-08" : null,
    });
    return {
      data: { policyVersion: "v1", consents },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  await require("../src/api/privacy.ts").saveRegistrationConsents(true, false);
  assert.deepEqual(calls, [
    { method: "delete", type: "CROSS_BORDER_AI", auth: "Bearer fixture-token" },
    { method: "post", type: "RECORD_STORAGE", auth: "Bearer fixture-token" },
  ]);
});
test("grounded chat follows the deployed contract and signed-out calls omit memberId", async () => {
  const calls = [];
  api.defaults.adapter = async (config) => {
    calls.push(config);
    return {
      data: "reply",
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  const { postChatMessage } = require("../src/api/chatMessage.ts");
  await postChatMessage("session", "chat", "question", "az", [], 11);
  await postChatMessage("guest", "chat", "question", "ru", []);
  assert.equal(calls[0].url, "/guest/chat/session/chat");
  assert.deepEqual(calls[0].params, { specialty: "general", memberId: 11 });
  assert.deepEqual(calls[1].params, { specialty: "general" });
});
test("all native labels have Russian copy instead of silent English fallbacks", () => {
  const ru = require("../src/copy/public.ru.json"),
    missing = [];
  function scan(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = require("node:path").join(dir, item.name);
      if (item.isDirectory()) scan(file);
      else if (/\.tsx?$/.test(file)) {
        const tree = ts.createSourceFile(
          file,
          fs.readFileSync(file, "utf8"),
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        );
        function walk(n) {
          let pair;
          if (
            ts.isCallExpression(n) &&
            n.expression.getText(tree) === "c" &&
            n.arguments.length === 2 &&
            n.arguments.every(ts.isStringLiteral)
          )
            pair = n.arguments;
          if (
            ts.isPropertyAssignment(n) &&
            n.name.getText(tree) === "label" &&
            ts.isArrayLiteralExpression(n.initializer) &&
            n.initializer.elements.length === 2 &&
            n.initializer.elements.every(ts.isStringLiteral)
          )
            pair = n.initializer.elements;
          if (pair && !ru[pair[0].text]) missing.push(pair[0].text);
          ts.forEachChild(n, walk);
        }
        walk(tree);
      }
    }
  }
  scan(require("node:path").join(__dirname, "../src"));
  assert.deepEqual([...new Set(missing)], []);
  for (const name of ["labs", "privacy"]) {
    const copy = require(`../src/copy/${name}.json`);
    for (const language of ["az", "en", "ru"]) {
      assert.deepEqual(Object.keys(copy[language]), Object.keys(copy.az));
      assert.doesNotMatch(
        JSON.stringify(copy[language]),
        /[\u2010-\u201f\u2026]/,
      );
    }
  }
});
