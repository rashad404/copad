const { test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs"),
  Module = require("node:module"),
  ts = require("typescript");
const originalLoad = Module._load;
Module._load = function (name, ...rest) {
  if (name === "react-native-url-polyfill") return { URL };
  return originalLoad.call(this, name, ...rest);
};
require.extensions[".ts"] = (module, file) =>
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
const {
  encodeVerifier,
  base64url,
  authCallback,
  createGoogleSignIn,
  AUTH_WINDOW_MS,
} = require("../src/core/googleProtocol.ts");
const hash = async (value) =>
  crypto.createHash("sha256").update(value).digest("base64");
const credentials = {
  token: "synthetic-token",
  fullName: "Test Person",
  email: "test@example.invalid",
};
function fixture(overrides = {}) {
  const calls = { starts: [], exchanges: [], dismissed: 0 };
  const deps = {
    randomBytes: async (count) => crypto.randomBytes(count),
    sha256Base64: hash,
    open: async (url, callback) => {
      calls.starts.push({ url, callback });
      return { type: "success", url: `${callback}?code=one-use-code` };
    },
    dismiss: () => calls.dismissed++,
    exchange: async (body, signal) => {
      calls.exchanges.push({ ...body });
      assert.equal(signal.aborted, false);
      return credentials;
    },
    ...overrides,
  };
  return { calls, deps, signIn: createGoogleSignIn(deps) };
}
const start = (f, variant = "preview", signal = new AbortController().signal) =>
  f.signIn(variant, signal);
const flush = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};

test("PKCE matches RFC 7636 and encodes native random bytes without padding", async () => {
  const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
  assert.equal(
    base64url(await hash(verifier)),
    "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  );
  for (const length of [32, 33, 34, 64]) {
    const bytes = crypto.randomBytes(length);
    assert.equal(encodeVerifier(bytes), bytes.toString("base64url"));
  }
});

test("preview and release use exact callbacks, HTTPS and original verifier for one exchange", async () => {
  for (const variant of ["preview", "release"]) {
    const f = fixture();
    assert.deepEqual(await start(f, variant), {
      status: "success",
      credentials,
    });
    assert.equal(f.calls.exchanges.length, 1);
    const url = new URL(f.calls.starts[0].url),
      body = f.calls.exchanges[0];
    assert.equal(
      url.origin + url.pathname,
      "https://azdoc.ai/api/auth/native/start",
    );
    assert.equal(url.searchParams.get("variant"), variant);
    assert.equal(f.calls.starts[0].callback, authCallback(variant));
    assert.match(body.verifier, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(
      url.searchParams.get("challenge"),
      base64url(await hash(body.verifier)),
    );
    assert.equal(body.code, "one-use-code");
    assert.equal(f.calls.dismissed, 0);
  }
});

test("busy, malformed callbacks and unexpected return URLs never exchange a code", async () => {
  for (const url of [
    "azdoc-preview://login/callback?error=busy",
    "azdoc-preview://login/callback?code=a&error=busy",
    "azdoc://login/callback?code=a",
    "https://login/callback?code=a",
    "azdoc-preview://other/callback?code=a",
    "azdoc-preview://login/other?code=a",
    "azdoc-preview://user@login/callback?code=a",
    "azdoc-preview://login/callback?code=a&code=b",
    "azdoc-preview://login/callback?code=",
    "azdoc-preview://login/callback",
    "azdoc-preview://login/callback?code=a#extra",
    "not-a-url",
  ]) {
    const f = fixture({ open: async () => ({ type: "success", url }) });
    assert.deepEqual(await start(f), { status: "retry" });
    assert.equal(f.calls.exchanges.length, 0);
  }
});

test("all exchange failures use the same result, with no automatic retry or reused verifier", async () => {
  for (const failure of [
    new Error("network"),
    { response: { status: 401, data: "expired" } },
    { response: { status: 401, data: "wrong verifier" } },
  ]) {
    let bodies = [];
    const f = fixture({
      exchange: async (body) => {
        bodies.push(body);
        throw failure;
      },
    });
    assert.deepEqual(await start(f), { status: "retry" });
    assert.equal(bodies.length, 1);
    assert.deepEqual(await start(f), { status: "retry" });
    assert.equal(bodies.length, 2);
    assert.notEqual(bodies[0].verifier, bodies[1].verifier);
    assert.notEqual(f.calls.starts[0].url, f.calls.starts[1].url);
  }
});

test("cancel and dismiss are quiet; malformed responses and OS failure are retryable", async () => {
  for (const type of ["cancel", "dismiss"]) {
    const f = fixture({ open: async () => ({ type }) });
    assert.deepEqual(await start(f), { status: "cancelled" });
    assert.equal(f.calls.exchanges.length, 0);
  }
  for (const data of [null, {}, { token: "" }, { token: "token" }]) {
    const f = fixture({ exchange: async () => data });
    assert.deepEqual(await start(f), { status: "retry" });
  }
  const f = fixture({
    open: async () => {
      throw Error("OS failed");
    },
  });
  assert.deepEqual(await start(f), { status: "retry" });
});

test("concurrent taps open only one browser; leaving screen prevents a late exchange", async () => {
  let finish,
    opened = 0;
  const f = fixture({
    open: async () => {
      opened++;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  const controller = new AbortController();
  const first = start(f, "preview", controller.signal);
  await flush();
  assert.deepEqual(await start(f), { status: "retry" });
  assert.equal(opened, 1);
  controller.abort();
  assert.deepEqual(await first, { status: "cancelled" });
  assert.equal(f.calls.dismissed, 1);
  finish({ type: "success", url: "azdoc-preview://login/callback?code=late" });
  await flush();
  assert.equal(f.calls.exchanges.length, 0);
});

test("five minute deadline closes browser and discards a late callback", async (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let finish;
  const f = fixture({
    open: async () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  const pending = start(f);
  await flush();
  t.mock.timers.tick(AUTH_WINDOW_MS);
  assert.deepEqual(await pending, { status: "retry" });
  assert.equal(f.calls.dismissed, 1);
  finish({ type: "success", url: "azdoc-preview://login/callback?code=late" });
  await flush();
  assert.equal(f.calls.exchanges.length, 0);
});

test("aborting during exchange discards a late successful response", async () => {
  let finish, exchangeSignal;
  const f = fixture({
    exchange: async (_, signal) => {
      exchangeSignal = signal;
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
  });
  const controller = new AbortController();
  const pending = start(f, "preview", controller.signal);
  await flush();
  controller.abort();
  assert.deepEqual(await pending, { status: "cancelled" });
  assert.equal(exchangeSignal.aborted, true);
  finish(credentials);
  await flush();
});
