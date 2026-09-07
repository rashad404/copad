const { test, afterEach } = require("node:test"),
  assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { NextRequest } = require("next/server");
const source = path.resolve(__dirname, "../src/app/dev-api/[...path]/route.ts");
const mod = new Module(source, module);
mod.filename = source;
mod.paths = module.paths;
mod._compile(
  ts.transpileModule(fs.readFileSync(source, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  source,
);
const proxy = mod.exports,
  fetchBefore = global.fetch,
  modeBefore = process.env.NODE_ENV,
  targetBefore = process.env.DEV_API_PROXY_TARGET;
function setup() {
  process.env.NODE_ENV = "development";
  process.env.DEV_API_PROXY_TARGET = "http://localhost:8002/api";
}
function request(method = "POST", options = {}) {
  return new NextRequest("http://localhost:3003/dev-api/members/7/documents", {
    method,
    ...options,
  });
}
afterEach(() => {
  global.fetch = fetchBefore;
  if (modeBefore === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = modeBefore;
  if (targetBefore === undefined) delete process.env.DEV_API_PROXY_TARGET;
  else process.env.DEV_API_PROXY_TARGET = targetBefore;
});
test("multipart bytes, boundary, JWT and metadata survive the development proxy", async () => {
  setup();
  const bytes = Uint8Array.from([0, 255, 13, 10, 128, 35]),
    data = new FormData();
  data.set(
    "file",
    new Blob([bytes], { type: "application/pdf" }),
    "analiz.pdf",
  );
  data.set("documentType", "LAB_RESULT");
  data.set("title", "Analiz cavabı");
  global.fetch = async (url, init) => {
    assert.equal(String(url), "http://localhost:8002/api/members/7/documents");
    assert.equal(init.headers.get("authorization"), "Bearer test-token");
    const form = await new Request(url, init).formData();
    assert.deepEqual(
      new Uint8Array(await form.get("file").arrayBuffer()),
      bytes,
    );
    assert.equal(form.get("documentType"), "LAB_RESULT");
    assert.equal(form.get("title"), "Analiz cavabı");
    return Response.json(
      { id: 9, extractionStatus: "PENDING" },
      { status: 201 },
    );
  };
  const r = await proxy.POST(
    request("POST", {
      headers: { Authorization: "Bearer test-token" },
      body: data,
    }),
  );
  assert.equal(r.status, 201);
  assert.equal((await r.json()).extractionStatus, "PENDING");
});
test("empty successful deletes stay 204 rather than becoming 502", async () => {
  setup();
  global.fetch = async () => ({
    status: 204,
    headers: new Headers(),
    body: new ReadableStream({
      start(c) {
        c.close();
      },
    }),
  });
  const r = await proxy.DELETE(request("DELETE"));
  assert.equal(r.status, 204);
  assert.equal(await r.text(), "");
});
test("urgent response headers and guest-session header survive the bridge", async () => {
  setup();
  global.fetch = async (url, init) => {
    assert.equal(init.headers.get("x-guest-session-id"), "session");
    return new Response("answer", {
      headers: {
        "X-Urgent": "true",
        "X-Emergency-Number": "103",
        "X-Urgent-Categories": "trouble breathing",
      },
    });
  };
  const r = await proxy.POST(
    request("POST", {
      headers: { "X-Guest-Session-Id": "session" },
      body: "{}",
    }),
  );
  assert.equal(r.headers.get("x-urgent"), "true");
  assert.equal(r.headers.get("x-emergency-number"), "103");
  assert.equal(r.headers.get("x-urgent-categories"), "trouble breathing");
});
test("readable backend validation messages are preserved", async () => {
  setup();
  global.fetch = async () =>
    Response.json({ message: "Unsupported document type" }, { status: 400 });
  const r = await proxy.POST(request("POST", { body: "x" }));
  assert.equal(r.status, 400);
  assert.equal((await r.json()).message, "Unsupported document type");
});
test("empty size rejection becomes a readable upload error", async () => {
  setup();
  global.fetch = async () => new Response(null, { status: 413 });
  const r = await proxy.POST(request("POST", { body: "x" }));
  assert.equal(r.status, 413);
  assert.match((await r.json()).message, /upload exceeds/);
});
