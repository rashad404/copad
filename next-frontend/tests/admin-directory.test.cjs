const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/admin",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLSelectElement",
  "HTMLTextAreaElement",
  "HTMLFormElement",
  "HTMLButtonElement",
  "Node",
  "NodeFilter",
  "Element",
  "Event",
  "MouseEvent",
  "MutationObserver",
  "localStorage",
  "FormData",
  "File",
])
  global[key] = dom.window[key];
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client");
const originalResolve = Module._resolveFilename,
  originalLoad = Module._load;
let navigated;
Module._resolveFilename = function (r, p, ...args) {
  return originalResolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...args,
  );
};
Module._load = function (r, p, ...args) {
  if (r === "next/navigation")
    return {
      useRouter: () => ({
        push: (path) => {
          navigated = path;
        },
      }),
    };
  if (r === "./RichTextEditor")
    return {
      __esModule: true,
      default: ({ value, onChange, disabled, id }) =>
        React.createElement("textarea", {
          id,
          value,
          disabled,
          onChange: (e) => onChange(e.target.value),
        }),
    };
  return originalLoad.call(this, r, p, ...args);
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
const Clinics = require("../src/app/admin/clinics/page.tsx").default;
const Doctors = require("../src/app/admin/doctors/page.tsx").default;
const {
  clinicPayload,
  doctorPayload,
} = require("../src/components/admin/directory/config.tsx");
let root,
  requests = [],
  fail = false;
const clinic = {
  id: 1,
  name: "Central clinic",
  slug: "central-clinic",
  city: "Baku",
  active: true,
  latitude: null,
  longitude: null,
};
const doctor = {
  id: 1,
  fullName: "Doctor Example",
  slug: "doctor-example",
  specialtyCode: "general",
  verification: "UNCLAIMED",
  verifiedAt: null,
  active: true,
  acceptsBookings: false,
  languages: ["az"],
  clinicIds: [26],
  consultationFee: null,
};
api.defaults.adapter = async (config) => {
  requests.push(config);
  if (fail && config.method !== "get")
    throw Object.assign(new Error("Server rejected change"), {
      isAxiosError: true,
      response: { status: 400, data: { message: "Review the supplied data" } },
    });
  let data;
  if (config.url === "/admin/specialties")
    data = [{ id: 1, code: "general", name: "General", isActive: true }];
  else if (config.url === "/admin/clinics")
    data = {
      content:
        config.params?.page === 1
          ? [{ ...clinic, id: 26, name: "Second-page clinic" }]
          : [clinic],
      totalPages: 2,
      totalElements: 26,
      number: config.params?.page ?? 0,
      size: 25,
    };
  else
    data = {
      content: [doctor],
      totalPages: 1,
      totalElements: 1,
      number: 0,
      size: 25,
    };
  return { data, status: 200, statusText: "OK", headers: {}, config };
};
const flush = () => new Promise((resolve) => setTimeout(resolve, 20));
async function mount(Component, props = {}) {
  root = createRoot(document.getElementById("root"));
  await React.act(async () => {
    root.render(React.createElement(Component, props));
    await flush();
  });
}
async function click(el) {
  assert.ok(el, "Expected clickable element");
  await React.act(async () => {
    el.click();
    await flush();
  });
}
const button = (text) =>
  [...document.querySelectorAll("button")].find(
    (el) => el.textContent.trim() === text,
  );
async function change(el, value) {
  await React.act(async () => {
    const proto =
      el instanceof HTMLSelectElement
        ? HTMLSelectElement.prototype
        : el instanceof HTMLTextAreaElement
          ? HTMLTextAreaElement.prototype
          : HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
    el.dispatchEvent(
      new Event(el instanceof HTMLSelectElement ? "change" : "input", {
        bubbles: true,
      }),
    );
    await flush();
  });
}
async function submit() {
  await React.act(async () => {
    document
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    await flush();
  });
}

afterEach(async () => {
  if (root)
    await React.act(async () => {
      root.unmount();
      await flush();
    });
  root = null;
  requests = [];
  fail = false;
  localStorage.clear();
  document.body.innerHTML = '<div id="root"></div>';
  window.confirm = () => true;
});
const input = (selector, value) =>
  change(document.querySelector(selector), value);
test("clinic CRUD payload excludes its generated slug; doctor edits exclude verification", () => {
  const c = clinicPayload({
    ...clinic,
    name: "  Clinic  ",
    latitude: 0,
    longitude: "",
    id: 8,
  });
  assert.equal(c.name, "Clinic");
  assert.equal(c.latitude, 0);
  assert.equal(c.longitude, null);
  assert.ok(!("slug" in c));
  assert.ok(!("id" in c));
  const d = doctorPayload({
    ...doctor,
    verification: "VERIFIED",
    verifiedAt: "2026-09-07",
    consultationFee: "",
  });
  assert.equal(d.consultationFee, null);
  assert.ok(!("verification" in d));
  assert.ok(!("verifiedAt" in d));
  assert.equal(d.acceptsBookings, false);
});
test("clinic form shows generated slug read-only and accepts absent coordinates", async () => {
  await mount(Clinics);
  await click(button("Edit"));
  assert.equal(document.querySelector("input#field-slug"), null);
  assert.match(
    document.querySelector("#field-slug").textContent,
    /central-clinic/,
  );
  await submit();
  const req = requests.find((r) => r.method === "put");
  assert.equal(req.url, "/admin/clinics/1");
  assert.equal(JSON.parse(req.data).latitude, null);
});
test("new doctors default to unclaimed and bookings off; complete clinic choices retain numeric IDs", async () => {
  await mount(Doctors);
  await click(button("New doctor"));
  assert.equal(document.querySelector("#field-acceptsBookings").checked, false);
  assert.equal(document.querySelector("#field-active").checked, true);
  assert.equal(document.querySelector("select#field-verification"), null);
  assert.match(
    document.querySelector("#field-verification").textContent,
    /UNCLAIMED/,
  );
  assert.ok(
    [...document.querySelector("#field-clinicIds").options].some(
      (o) => o.value === "26",
    ),
  );
  assert.ok(
    requests.some((r) => r.url === "/admin/clinics" && r.params.page === 1),
  );
  await input("#field-fullName", "A new doctor");
  await React.act(async () => {
    const field = document.querySelector("#field-clinicIds");
    field.options[1].selected = true;
    field.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();
  });
  await submit();
  const req = requests.find(
    (r) => r.method === "post" && r.url === "/admin/doctors",
  );
  const body = JSON.parse(req.data);
  assert.deepEqual(body.clinicIds, [26]);
  assert.equal(body.acceptsBookings, false);
  assert.ok(!("verification" in body));
});
test("unclaimed state is neutral and verification requires an explicit review through its endpoint", async () => {
  await mount(Doctors);
  const badge = [...document.querySelectorAll("tbody span")].find(
    (e) => e.textContent === "UNCLAIMED",
  );
  assert.ok(badge);
  assert.doesNotMatch(badge.className, /emerald|green/);
  await click(button("Review verification"));
  await input("#field-verification", "VERIFIED");
  await submit();
  assert.ok(!requests.some((r) => r.method === "post"));
  assert.match(
    document.body.textContent,
    /Confirm that this decision is supported/,
  );
  await click(document.querySelector("#field-acknowledged"));
  await input("#field-note", "License checked against register");
  await submit();
  const req = requests.find((r) => r.method === "post");
  assert.equal(req.url, "/admin/doctors/1/verification");
  assert.deepEqual(JSON.parse(req.data), {
    verification: "VERIFIED",
    note: "License checked against register",
  });
  assert.ok(!requests.some((r) => r.method === "put"));
});
test("enabling bookings requires confirmation and cancellation never saves", async () => {
  await mount(Doctors);
  await click(button("Edit"));
  await click(document.querySelector("#field-acceptsBookings"));
  let confirmation = "";
  window.confirm = (message) => {
    confirmation = message;
    return false;
  };
  await submit();
  assert.match(confirmation, /actually be fulfilled/);
  assert.ok(!requests.some((r) => r.method === "put"));
  assert.match(document.body.textContent, /Bookings were not enabled/);
});
test("server filters use the doctor endpoint and mutations retain readable errors and form values", async () => {
  await mount(Doctors);
  await React.act(async () => {
    const select = document.querySelectorAll("select")[1];
    select.value = "PENDING";
    select.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();
  });
  assert.ok(
    requests.some(
      (r) =>
        r.url === "/admin/doctors" &&
        r.params.verification === "PENDING" &&
        r.params.page === 0,
    ),
  );
  await click(button("Edit"));
  fail = true;
  await input("#field-fullName", "Retained name");
  await submit();
  assert.match(document.body.textContent, /Review the supplied data/);
  assert.equal(
    document.querySelector("#field-fullName").value,
    "Retained name",
  );
});
