const { test, after, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const Module = require("node:module");
const ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost/health-record", pretendToBeVisual: true },
);
for (const name of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLSelectElement",
  "HTMLTextAreaElement",
  "Node",
  "NodeFilter",
  "MutationObserver",
  "Event",
  "MouseEvent",
  "KeyboardEvent",
  "getComputedStyle",
  "localStorage",
  "Element",
])
  global[name] =
    name === "getComputedStyle"
      ? dom.window.getComputedStyle.bind(dom.window)
      : dom.window[name];
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
global.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react");
const { createRoot } = require("react-dom/client");
const { act } = React;
const axios = require("axios");
const user = { id: 73, name: "Test account" };
const translation = {
  i18n: { language: "en", resolvedLanguage: "en" },
  t: (key) => key,
};
let role = "OWNER";
let pendingCondition;
let failVital = false;
let submittedVital;
const members = [
  {
    id: 1,
    familyId: 10,
    fullName: "Member One",
    relationship: "CHILD",
    dateOfBirth: "2025-01-01",
    biologicalSex: "FEMALE",
    bloodType: "O+",
    ageYears: 1,
    ageMonths: 15,
    correctedAgeMonths: 13,
    gestationalAgeWeeks: 32,
    minor: true,
    self: false,
  },
  {
    id: 2,
    familyId: 10,
    fullName: "Member Two",
    relationship: "SELF",
    ageYears: 30,
    ageMonths: 360,
    minor: false,
    self: true,
  },
];
const readings = [
  {
    id: 1,
    vitalType: "WEIGHT",
    value: 70,
    unit: "kg",
    valueEntered: 154,
    unitEntered: "lb",
    measuredAt: "2026-01-01T10:00:00",
    abnormalFlag: "NORMAL",
  },
  {
    id: 2,
    vitalType: "WEIGHT",
    value: 71,
    unit: "kg",
    valueEntered: 71,
    unitEntered: "kg",
    measuredAt: "2026-02-01T10:00:00",
    abnormalFlag: "NORMAL",
  },
  {
    id: 3,
    vitalType: "WEIGHT",
    value: 72,
    unit: "kg",
    valueEntered: 158,
    unitEntered: "lb",
    measuredAt: "2026-03-01T10:00:00",
    abnormalFlag: "HIGH",
  },
];
const api = {
  families: async () => [{ id: 10, name: "Test family", role, members }],
  list: async (id, kind) => {
    if (id === 1 && kind === "conditions" && pendingCondition)
      return pendingCondition;
    if (kind === "conditions")
      return [{ id: id * 10, label: `Condition for ${id}`, status: "ACTIVE" }];
    if (kind === "allergies" && id === 1)
      return [
        {
          id: 5,
          allergen: "Critical test allergen",
          critical: true,
          active: true,
          severity: "LIFE_THREATENING",
          reaction: "Recorded reaction",
        },
      ];
    return [];
  },
  latest: async () => ({ WEIGHT: readings[2] }),
  series: async () => readings,
  trends: async () => [
    { type: "WEIGHT", direction: "RISING", changePercent: 2.8, readings: 3 },
  ],
  history: async () => [],
  addVital: async (id, body) => {
    submittedVital = { id, body };
    if (failVital)
      throw new axios.AxiosError(
        "Bad request",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        { status: 400, data: { message: "Unrecognised unit: banana" } },
      );
    return { id: 99, ...body };
  },
  save: async () => ({ id: 99 }),
  remove: async () => {},
  addMember: async () => {},
  updateMember: async () => {},
  deleteMember: async () => {},
};
const rootDir = path.resolve(__dirname, "../src");
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return originalResolve.call(
    this,
    request.startsWith("@/") ? path.join(rootDir, request.slice(2)) : request,
    parent,
    ...args,
  );
};
Module._load = function (request, parent, ...args) {
  if (request.endsWith(".module.css"))
    return {
      __esModule: true,
      default: new Proxy({}, { get: (_, key) => String(key) }),
    };
  if (request === "@/api/healthRecord") return { healthApi: api };
  if (request === "@/context/AuthContext")
    return {
      useAuth: () => ({ user, isAuthenticated: true, isLoading: false }),
    };
  if (request === "@/components/ProtectedRoute")
    return { __esModule: true, default: ({ children }) => children };
  if (request === "@/components/public/ProductLayout")
    return {
      __esModule: true,
      default: ({ children }) => React.createElement("div", null, children),
      usePublicCopy: () => (en) => en,
    };
  if (request === "react-i18next") return { useTranslation: () => translation };
  return originalLoad.call(this, request, parent, ...args);
};
for (const extension of [".ts", ".tsx"])
  require.extensions[extension] = (module, filename) => {
    const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText;
    module._compile(output, filename);
  };
const HealthRecordPage =
  require("../src/components/health/HealthRecordPage.tsx").default;
let root;
async function flush(fn = () => {}) {
  await act(async () => {
    fn();
    await new Promise((r) => setTimeout(r, 25));
  });
}
async function mount(selected = 1) {
  role = role || "OWNER";
  localStorage.clear();
  localStorage.setItem("azdoc.member.73", String(selected));
  root = createRoot(document.getElementById("root"));
  await flush(() => root.render(React.createElement(HealthRecordPage)));
  await flush();
}
async function unmount() {
  if (root) {
    await flush(() => root.unmount());
    root = null;
  }
  pendingCondition = null;
  failVital = false;
}
const button = (text) =>
  [...document.querySelectorAll("button")].find(
    (b) => b.textContent.trim() === text,
  );
const tab = (name) =>
  [...document.querySelectorAll("[role=tab]")].find(
    (b) => b.textContent === name,
  );
async function click(element) {
  assert.ok(element);
  await flush(() => element.click());
}
async function select(element, value) {
  await flush(() => {
    element.value = value;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}
async function input(element, value) {
  await flush(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
function field(text) {
  const label = [...document.querySelectorAll("label")].find((l) =>
    l.textContent.trim().startsWith(text),
  );
  assert.ok(label, `Missing field ${text}`);
  return document.getElementById(label.htmlFor);
}

test("VIEWER sees critical allergy and corrected age, with no write actions", async () => {
  role = "VIEWER";
  await mount();
  assert.match(document.body.textContent, /Critical test allergen/);
  assert.match(document.body.textContent, /Life-threatening/);
  assert.match(document.body.textContent, /Corrected age: 13 months/);
  assert.equal(button("Add member"), undefined);
  assert.equal(button("Edit member"), undefined);
  await click(tab("Allergies"));
  assert.equal(button("Add record"), undefined);
  assert.equal(button("Edit"), undefined);
  await click(tab("Vitals"));
  assert.equal(button("Add measurement"), undefined);
  await unmount();
});

test("switching member drops old allergies and ignores a late response for the previous person", async () => {
  role = "OWNER";
  let resolveOld;
  pendingCondition = new Promise((resolve) => {
    resolveOld = resolve;
  });
  await mount();
  await select(document.getElementById("health-member"), "2");
  await click(tab("Conditions"));
  assert.match(document.body.textContent, /Condition for 2/);
  assert.doesNotMatch(document.body.textContent, /Critical test allergen/);
  await flush(() =>
    resolveOld([{ id: 10, label: "Late previous member condition" }]),
  );
  assert.doesNotMatch(
    document.body.textContent,
    /Late previous member condition/,
  );
  assert.equal(localStorage.getItem("azdoc.member.73"), "2");
  await unmount();
});

test("charts keep mixed entered units separate while the table keeps all readings", async () => {
  role = "OWNER";
  await mount();
  await click(tab("Vitals"));
  assert.equal(document.querySelectorAll("circle[role=button]").length, 2);
  assert.match(document.querySelector("table").textContent, /154/);
  assert.match(document.querySelector("table").textContent, /71/);
  assert.match(document.querySelector("table").textContent, /158/);
  await select(field("Show entered unit"), "kg");
  assert.equal(document.querySelectorAll("circle[role=button]").length, 1);
  assert.match(document.querySelector(".selectedReading").textContent, /71 kg/);
  await unmount();
});

test("failed vital save keeps input and shows the exact API validation message", async () => {
  role = "OWNER";
  failVital = true;
  await mount();
  await click(tab("Vitals"));
  await click(button("Add measurement"));
  await input(field("Value"), "155");
  await input(field("Unit"), "banana");
  const form = document.querySelector("[role=dialog] form");
  assert.ok(form);
  await flush(() =>
    form.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true }),
    ),
  );
  assert.match(
    document.querySelector("[role=dialog]").textContent,
    /Unrecognised unit: banana/,
  );
  assert.equal(field("Value").value, "155");
  assert.equal(field("Unit").value, "banana");
  assert.deepEqual(submittedVital.body.value, 155);
  assert.equal(submittedVital.id, 1);
  assert.equal(submittedVital.body.unit, "banana");
  await click(button("Cancel"));
  await unmount();
});

afterEach(unmount);
after(async () => {
  await unmount();
  dom.window.close();
});
