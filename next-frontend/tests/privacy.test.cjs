const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM("", { url: "http://localhost/profile/privacy" });
global.window = dom.window;
global.localStorage = dom.window.localStorage;
const resolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...args) {
  return resolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...args,
  );
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = (m, f) =>
    m._compile(
      ts.transpileModule(fs.readFileSync(f, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2022,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
        },
      }).outputText,
      f,
    );
const api = require("../src/api/axios.ts").default;
const {
  privacyApi,
  saveRegistrationConsents,
  privacyError,
} = require("../src/api/privacy.ts");
const { AxiosError } = require("axios");
let calls = [],
  noOp = false;
api.defaults.adapter = async (config) => {
  calls.push(config);
  const type =
    config.url.split("/").pop() === "consent"
      ? JSON.parse(config.data).type
      : config.url.split("/").pop();
  const active = config.method === "post";
  return {
    data: {
      policyVersion: "v1",
      consents: noOp
        ? []
        : [
            {
              type,
              active,
              grantedAt: active ? "2026-09-07T09:00:00" : null,
              withdrawnAt: active ? null : "2026-09-07T10:00:00",
            },
          ],
    },
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
};
afterEach(() => {
  calls = [];
  noOp = false;
  localStorage.clear();
});
test("sign-up can store records and decline AI without ever granting AI consent", async () => {
  localStorage.setItem("token", "jwt");
  await saveRegistrationConsents(true, false);
  assert.equal(calls[0].method, "delete");
  assert.equal(calls[0].url, "/account/consent/CROSS_BORDER_AI");
  assert.equal(calls[1].method, "post");
  assert.deepEqual(JSON.parse(calls[1].data), { type: "RECORD_STORAGE" });
  assert.ok(calls.every((c) => c.headers.Authorization === "Bearer jwt"));
});
test("both consent purposes may be declined and retried without granting either", async () => {
  await saveRegistrationConsents(false, false);
  await saveRegistrationConsents(false, false);
  assert.ok(calls.every((c) => c.method === "delete"));
  assert.equal(calls.length, 4);
});
test("a legacy backend no-op refusal is not reported as a saved choice", async () => {
  noOp = true;
  await assert.rejects(saveRegistrationConsents(true, false));
  assert.equal(calls.length, 1);
});
test("grants and guardian withdrawals retain their member scope", async () => {
  await privacyApi.grant("GUARDIAN", 7);
  await privacyApi.withdraw("GUARDIAN", 7);
  assert.deepEqual(JSON.parse(calls[0].data), {
    type: "GUARDIAN",
    familyMemberId: 7,
  });
  assert.deepEqual(calls[1].params, { familyMemberId: 7 });
});
test("export uses authenticated binary fetch and deletion sends password in request body", async () => {
  localStorage.setItem("token", "jwt");
  const c = new AbortController();
  await privacyApi.export(12, c.signal);
  await privacyApi.deleteMember(12);
  await privacyApi.deleteAccount("test-password");
  assert.equal(calls[0].url, "/members/12/export.zip");
  assert.equal(calls[0].responseType, "blob");
  assert.equal(calls[0].signal, c.signal);
  assert.equal(calls[1].url, "/members/12/data");
  assert.equal(calls[1].method, "delete");
  assert.equal(calls[2].url, "/account");
  assert.deepEqual(JSON.parse(calls[2].data), { password: "test-password" });
  assert.ok(calls.every((c) => c.headers.Authorization === "Bearer jwt"));
});
test("readable 403 messages survive JSON blob downloads and ordinary API errors", async () => {
  for (const data of [
    { message: "Permission denied" },
    new Blob([JSON.stringify({ message: "Permission denied" })], {
      type: "application/json",
    }),
  ]) {
    const error = new AxiosError("Request failed", "403", {}, null, {
      status: 403,
      data,
    });
    assert.equal(await privacyError(error, "fallback"), "Permission denied");
  }
  const error = new AxiosError("Request failed", "500", {}, null, {
    status: 500,
    data: new Blob(["<html>proxy failure</html>"], { type: "text/html" }),
  });
  assert.equal(await privacyError(error, "fallback"), "fallback");
});
test("privacy copy covers AZ EN RU and uses plain punctuation", () => {
  const copy = require("../src/components/privacy/copy.json");
  for (const lang of ["az", "en", "ru"]) {
    assert.deepEqual(
      Object.keys(copy[lang]).sort(),
      Object.keys(copy.az).sort(),
    );
    assert.ok(
      Object.values(copy[lang]).every(
        (s) => s && !/[\u2013\u2014\u2018\u2019\u201c\u201d\u2026]/u.test(s),
      ),
    );
    const policy = require(`../src/translations/${lang}.json`).privacy;
    assert.ok(policy.transfer.description.includes("OpenAI"));
    assert.ok(policy.retention.description.includes("90"));
  }
});
