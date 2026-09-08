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
let timelineFailure = false;
let timelineEmpty = false;
let pendingTimeline;
let pendingPdf;
let pdfFailure = false;
let pdfCalls = [];
let timelineCalls = [];
const pdfBytes = new Blob(["%PDF-1.4 Azərbaycan: Əə Şş Ğğ İı"], {
  type: "application/pdf",
});
const downloaded = [];
const objectBlobs = [];
const revoked = [];
URL.createObjectURL = (blob) => {
  objectBlobs.push(blob);
  return "blob:test-" + objectBlobs.length;
};
URL.revokeObjectURL = (url) => revoked.push(url);
const originalAnchorClick = dom.window.HTMLAnchorElement.prototype.click;
dom.window.HTMLAnchorElement.prototype.click = function () {
  if (this.download) {
    downloaded.push({ href: this.href, name: this.download });
    return;
  }
  return originalAnchorClick.call(this);
};
const events = [
  {
    type: "MEDICATION_STOPPED",
    recordId: 12,
    occurredAt: "2024-03-01T00:00:00",
    title: "Medication event",
    detail: "Stopped",
    severity: null,
    notable: false,
  },
  {
    type: "ALLERGY",
    recordId: 13,
    occurredAt: "2024-02-01T00:00:00",
    title: "Notable timeline allergy",
    detail: "Severe reaction",
    severity: "LIFE_THREATENING",
    notable: true,
  },
  {
    type: "MEDICATION_STARTED",
    recordId: 12,
    occurredAt: "2024-01-03T00:00:00",
    title: "Medication event",
    detail: "500 mg",
    severity: null,
    notable: false,
  },
];

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
  timeline: async (id, signal) => {
    timelineCalls.push({ id, signal });
    if (id === 1 && pendingTimeline) return pendingTimeline;
    if (timelineFailure) throw new Error("Offline");
    if (timelineEmpty) return [];
    return id === 1 ? events : [{ ...events[0], title: "Second member event" }];
  },
  summaryPdf: async (id, signal) => {
    pdfCalls.push({ id, signal });
    if (pendingPdf) return pendingPdf;
    if (pdfFailure)
      throw new axios.AxiosError(
        "Denied",
        "ERR_BAD_REQUEST",
        undefined,
        undefined,
        {
          status: 403,
          data: new Blob(
            [JSON.stringify({ message: "Summary access denied" })],
            { type: "application/json" },
          ),
        },
      );
    return pdfBytes;
  },
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
  timelineFailure = false;
  timelineEmpty = false;
  pendingTimeline = null;
  pendingPdf = null;
  pdfFailure = false;
  pdfCalls = [];
  timelineCalls = [];
  downloaded.length = 0;
  objectBlobs.length = 0;
  revoked.length = 0;
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

test("timeline preserves clinical order, notable styling and both medication lifecycle events", async () => {
  role = "VIEWER";
  await mount();
  await click(tab("Timeline"));
  const rows = [...document.querySelectorAll(".timelineList>li")];
  assert.equal(rows.length, 3);
  assert.match(rows[0].textContent, /Medication stopped/);
  // Day first, in English too: the site is read in Azerbaijan, where every
  // other language it offers writes the day before the month.
  assert.match(rows[0].textContent, /1 Mar 2024/);
  assert.match(rows[2].textContent, /Medication started/);
  assert.match(rows[2].textContent, /500 mg/);
  assert.ok(rows[1].classList.contains("notableEvent"));
  assert.match(rows[1].textContent, /Life-threatening/);
  assert.match(rows[1].textContent, /Notable event/);
  assert.match(
    document.body.textContent,
    /Only abnormal vital readings appear here/,
  );
  assert.equal(timelineCalls[0].id, 1);
  await click(button("View all vitals"));
  assert.equal(tab("Vitals").getAttribute("aria-selected"), "true");
});
test("timeline supports empty, failure and retry states", async () => {
  timelineFailure = true;
  await mount();
  await click(tab("Timeline"));
  assert.match(document.body.textContent, /Could not load the timeline/);
  timelineFailure = false;
  timelineEmpty = true;
  await click(button("Retry"));
  assert.match(document.body.textContent, /No clinical events yet/);
});
test("timeline cancels the prior member request and never displays its late response", async () => {
  let resolve;
  pendingTimeline = new Promise((r) => (resolve = r));
  await mount();
  await click(tab("Timeline"));
  const oldSignal = timelineCalls[0].signal;
  await select(document.getElementById("health-member"), "2");
  await click(tab("Timeline"));
  assert.equal(oldSignal.aborted, true);
  await flush(() => resolve(events));
  assert.match(
    document.querySelector(".timelineList").textContent,
    /Second member event/,
  );
  assert.doesNotMatch(
    document.querySelector(".timelineList").textContent,
    /Notable timeline allergy/,
  );
});
test("VIEWER can download the selected member PDF with unchanged Unicode bytes", async () => {
  role = "VIEWER";
  await mount();
  await click(button("Download summary"));
  assert.equal(pdfCalls[0].id, 1);
  assert.equal(downloaded.length, 1);
  assert.equal(downloaded[0].name, "azdoc-summary-1.pdf");
  assert.equal(objectBlobs[0], pdfBytes);
  assert.match(await objectBlobs[0].text(), /Azərbaycan: Əə Şş Ğğ İı/);
  assert.match(document.body.textContent, /Download started/);
  const url = downloaded[0].href;
  await flush(() => root.unmount());
  root = null;
  assert.ok(revoked.includes(url));
});
test("failed PDF shows the blob API error and permits a retry", async () => {
  pdfFailure = true;
  await mount();
  await click(button("Download summary"));
  assert.match(document.body.textContent, /Summary access denied/);
  assert.equal(downloaded.length, 0);
  pdfFailure = false;
  await click(button("Download summary"));
  assert.equal(downloaded.length, 1);
});
test("pending summary prevents duplicate downloads and is cancelled on member change", async () => {
  let resolve;
  pendingPdf = new Promise((r) => (resolve = r));
  await mount();
  const download = button("Download summary");
  await flush(() => {
    download.click();
    download.click();
  });
  assert.equal(pdfCalls.length, 1);
  assert.ok(button("Preparing summary...").disabled);
  const oldSignal = pdfCalls[0].signal;
  await select(document.getElementById("health-member"), "2");
  assert.equal(oldSignal.aborted, true);
  await flush(() => resolve(pdfBytes));
  assert.equal(downloaded.length, 0);
  assert.ok(button("Download summary"));
});

afterEach(unmount);
after(async () => {
  await unmount();
  dom.window.close();
});
