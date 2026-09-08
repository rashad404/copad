const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost/" });
for (const key of [
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "Event",
])
  global[key] = dom.window[key];
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client");
const load = Module._load,
  resolve = Module._resolveFilename;
let calls = 0,
  status = 502,
  current,
  root;
Module._resolveFilename = function (r, p, ...a) {
  return resolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...a,
  );
};
Module._load = function (r, p, ...a) {
  if (r === "@/api")
    return {
      __esModule: true,
      default: {
        get: async () => {
          calls++;
          if (status) {
            const error = new Error("Unavailable");
            error.isAxiosError = true;
            error.response = status === "network" ? undefined : { status };
            throw error;
          }
          return { data: { id: "test-user", name: "Test", role: "USER" } };
        },
      },
    };
  return load.call(this, r, p, ...a);
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
const { AuthProvider, useAuth } = require("../src/context/AuthContext.tsx");
function ReadAuth() {
  current = useAuth();
  return null;
}
async function mount() {
  localStorage.setItem("token", "example-session");
  root = createRoot(document.getElementById("root"));
  await React.act(async () =>
    root.render(
      React.createElement(AuthProvider, null, React.createElement(ReadAuth)),
    ),
  );
}
afterEach(async () => {
  if (root) await React.act(() => root.unmount());
  root = null;
  localStorage.clear();
  sessionStorage.clear();
  document.cookie = "auth_token=;max-age=0";
  calls = 0;
  status = 502;
});
test("a 502 keeps the token, clears stale verification and recovers on focus without re-login", async () => {
  sessionStorage.setItem("auth_verified", "true");
  await mount();
  assert.equal(localStorage.getItem("token"), "example-session");
  assert.match(document.cookie, /auth_token=example-session/);
  assert.equal(sessionStorage.getItem("auth_verified"), null);
  assert.equal(current.isLoading, false);
  assert.equal(current.isAuthenticated, false);
  status = 0;
  await React.act(async () => window.dispatchEvent(new Event("focus")));
  assert.equal(calls, 2);
  assert.equal(current.isAuthenticated, true);
  assert.equal(current.user.id, "test-user");
  await React.act(async () => window.dispatchEvent(new Event("focus")));
  assert.equal(calls, 2);
});
test("an offline account check can recover on reconnect and stops listening after unmount", async () => {
  status = "network";
  await mount();
  assert.equal(localStorage.getItem("token"), "example-session");
  status = 0;
  await React.act(async () => window.dispatchEvent(new Event("online")));
  assert.equal(current.isAuthenticated, true);
  await React.act(() => root.unmount());
  root = null;
  await React.act(async () => window.dispatchEvent(new Event("online")));
  assert.equal(calls, 2);
});
for (const rejected of [401, 403])
  test(`a ${rejected} removes rejected credentials and does not retry`, async () => {
    status = rejected;
    await mount();
    assert.equal(localStorage.getItem("token"), null);
    assert.doesNotMatch(document.cookie, /auth_token/);
    await React.act(async () => window.dispatchEvent(new Event("focus")));
    assert.equal(calls, 1);
  });
