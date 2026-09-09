const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  Module = require("node:module"),
  ts = require("typescript");
global.__DEV__ = false;
const saved = new Map();
const crypto = require("node:crypto");
let variant = "preview";
const browserStarts = [];

const originalLoad = Module._load;
Module._load = function (name, ...rest) {
  if (name === "react-native-url-polyfill") return { URL };
  if (name === "expo-constants")
    return { expoConfig: { extra: { nativeAuthVariant: variant } } };
  if (name === "expo-crypto")
    return {
      getRandomBytesAsync: async (count) => crypto.randomBytes(count),
      CryptoDigestAlgorithm: { SHA256: "SHA-256" },
      CryptoEncoding: { BASE64: "base64" },
      digestStringAsync: async (algorithm, value, options) => {
        assert.equal(algorithm, "SHA-256");
        assert.equal(options.encoding, "base64");
        return crypto.createHash("sha256").update(value).digest("base64");
      },
    };
  if (name === "expo-web-browser")
    return {
      openAuthSessionAsync: async (url, callback) => {
        browserStarts.push({ url, callback });
        return { type: "success", url: callback + "?code=synthetic-code" };
      },
      dismissAuthSession: () => {},
    };
  if (name === "react-native") return { Platform: { OS: "ios" } };
  if (name === "expo-secure-store")
    return {
      getItemAsync: async (key) => saved.get(key) || null,
      setItemAsync: async (key, value) => saved.set(key, value),
      deleteItemAsync: async (key) => saved.delete(key),
    };
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
function backend(url) {
  process.env.EXPO_PUBLIC_API_URL = url;
  for (const file of [
    "../src/core/environment.ts",
    "../src/core/storage.ts",
    "../src/core/api.ts",
  ])
    delete require.cache[require.resolve(file)];
  return {
    ...require("../src/core/environment.ts"),
    ...require("../src/core/storage.ts"),
    api: require("../src/core/api.ts").default,
  };
}
test("native production and dev sessions, consents and cached scopes stay separate", async () => {
  saved.set("auth_token", "unscoped-old-token");
  const dev = backend("http://100.89.150.50:8002/api");
  assert.equal(await dev.tokenStore.get(), null);
  await dev.tokenStore.set("dev-token");
  await dev.pendingConsentStore.set({
    email: "test@example.invalid",
    storage: true,
    ai: false,
  });
  const prod = backend("https://azdoc.ai/api");
  assert.equal(await prod.tokenStore.get(), null);
  assert.equal(await prod.pendingConsentStore.get(), null);
  await prod.tokenStore.set("production-token");
  for (const key of [
    "auth_token",
    "azdoc.member.1",
    "chat-1-1",
    "azdoc.health.binding.1",
    "azdoc.health.report.1",
  ]) {
    assert.notEqual(dev.environmentKey(key), prod.environmentKey(key));
    assert.match(prod.environmentKey(key), /^[A-Za-z0-9_.-]+$/);
  }
  const requests = [];
  for (const instance of [dev, prod]) {
    instance.api.defaults.adapter = async (config) => {
      requests.push({
        baseURL: config.baseURL,
        token: config.headers.Authorization,
      });
      return { data: {}, status: 200, statusText: "OK", headers: {}, config };
    };
    await instance.api.get("/user/me");
  }
  assert.deepEqual(requests, [
    { baseURL: "http://100.89.150.50:8002/api", token: "Bearer dev-token" },
    { baseURL: "https://azdoc.ai/api", token: "Bearer production-token" },
  ]);
  await prod.tokenStore.clear();
  assert.equal(await prod.tokenStore.get(), null);
  assert.equal(await dev.tokenStore.get(), "dev-token");
  assert.equal((await dev.pendingConsentStore.get()).ai, false);
});

test("native adapter uses configured app scheme and unauthenticated production exchange only", async () => {
  const axios = require("axios");
  const adapter = axios.defaults.adapter;
  const requests = [];
  axios.defaults.adapter = async (config) => {
    requests.push(config);
    return {
      data: {
        token: "google-token",
        fullName: "Test",
        email: "test@example.invalid",
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };
  try {
    for (variant of ["preview", "release"]) {
      const prod = backend("https://azdoc.ai/api");
      await prod.tokenStore.set("existing-account-token");
      delete require.cache[require.resolve("../src/core/nativeGoogle.ts")];
      const google = require("../src/core/nativeGoogle.ts");
      assert.equal(google.googleSignInAvailable, true);
      assert.equal(
        (await google.nativeGoogleSignIn(new AbortController().signal)).status,
        "success",
      );
      const request = requests.at(-1),
        browser = browserStarts.at(-1);
      assert.equal(
        browser.callback,
        variant === "preview"
          ? "azdoc-preview://login/callback"
          : "azdoc://login/callback",
      );
      assert.equal(request.baseURL, "https://azdoc.ai/api");
      assert.equal(request.url, "/auth/native/exchange");
      assert.equal(request.headers.Authorization, undefined);
      const body = JSON.parse(request.data);
      assert.deepEqual(Object.keys(body).sort(), ["code", "verifier"]);
      assert.equal(
        new URL(browser.url).searchParams.get("challenge"),
        crypto.createHash("sha256").update(body.verifier).digest("base64url"),
      );
      assert.equal(await prod.tokenStore.get(), "existing-account-token");
      assert.ok(![...saved.values()].includes(body.verifier));
    }
    backend("http://100.89.150.50:8002/api");
    delete require.cache[require.resolve("../src/core/nativeGoogle.ts")];
    const dev = require("../src/core/nativeGoogle.ts");
    assert.equal(dev.googleSignInAvailable, false);
    const count = requests.length;
    assert.deepEqual(
      await dev.nativeGoogleSignIn(new AbortController().signal),
      { status: "retry" },
    );
    assert.equal(requests.length, count);
  } finally {
    axios.defaults.adapter = adapter;
  }
});
