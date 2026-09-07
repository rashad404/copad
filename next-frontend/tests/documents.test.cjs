const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/health-record",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "HTMLInputElement",
  "HTMLSelectElement",
  "HTMLFormElement",
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
Module._resolveFilename = function (r, p, ...args) {
  return originalResolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...args,
  );
};
Module._load = function (r, p, ...args) {
  if (r.endsWith(".css"))
    return new Proxy(
      {},
      { get: (_, k) => (k === "__esModule" ? false : String(k)) },
    );
  if (r === "@/components/public/ProductLayout")
    return { usePublicCopy: () => (en, az) => (language === "az" ? az : en) };
  if (r === "react-i18next")
    return { useTranslation: () => ({ i18n: { language }, t: (k) => k }) };
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
const docsApi = require("../src/api/documents.ts").documentsApi;
const Workspace =
  require("../src/components/health/documents/DocumentWorkspace.tsx").default;
const Review =
  require("../src/components/health/documents/ProposalReview.tsx").default;
const Viewer =
  require("../src/components/health/documents/DocumentViewer.tsx").default;
const Upload =
  require("../src/components/health/documents/UploadDocument.tsx").default;
const {
  referenceBand,
  confirmedLabs,
  sortedDocuments,
} = require("../src/components/health/documents/model.ts");
const {
  AnalyteChart,
} = require("../src/components/health/documents/LabTrend.tsx");
let root,
  requests = [],
  language = "en",
  fail = false,
  pendingContent,
  pendingManual,
  saved = 0,
  timer;
const blobs = [],
  revoked = [];
URL.createObjectURL = (blob) => {
  blobs.push(blob);
  return "blob:test-" + blobs.length;
};
URL.revokeObjectURL = (url) => revoked.push(url);
const doc = {
  id: 8,
  title: "Original report",
  documentType: "LAB_RESULT",
  documentDate: "2026-01-01",
  provider: null,
  contentType: "application/pdf",
  sizeBytes: 1024,
  extractionStatus: "COMPLETED",
  createdAt: "2026-01-02",
};
const lab = {
  source: "EXTRACTED",
  referenceLow: 10,
  referenceHigh: 100,
  id: 11,
  documentId: 8,
  analyte: "Ferritin proposal",
  analyteKey: "ferritin",
  value: 900,
  unit: "ng/mL",
  displayValue: "900 ng/mL",
  referenceLabel: "10 - 100",
  abnormalFlag: "HIGH",
  abnormal: true,
  collectedAt: "2026-01-01T10:00:00",
  confirmed: false,
};
const confirmed = {
  ...lab,
  id: 12,
  analyte: "Ferritin confirmed",
  value: 50,
  displayValue: "50 ng/mL",
  confirmed: true,
};
const med = {
  id: 21,
  sourceDocumentId: 8,
  name: "Medicine proposal",
  doseAmount: null,
  doseUnit: null,
  doseLabel: null,
  frequency: null,
  route: null,
  startedOn: null,
  endedOn: null,
  prescriber: null,
  confirmed: false,
};
let documents = [doc];
api.defaults.adapter = async (config) => {
  requests.push(config);
  let data = [];
  if (config.url.endsWith("/content")) {
    if (pendingContent) return pendingContent(config);
    data = new Blob(["%PDF-1.4 original"], { type: "application/pdf" });
  } else if (config.method === "post" && config.url.endsWith("/lab-results")) {
    if (pendingManual) await pendingManual;
    if (fail)
      throw {
        isAxiosError: true,
        response: {
          status: 400,
          data: { message: "Please check the laboratory value." },
        },
      };
    data = {
      ...confirmed,
      ...JSON.parse(config.data),
      id: 33,
      source: "MANUAL",
      confirmed: true,
      abnormalFlag: null,
    };
  } else if (config.method === "post" && config.url.endsWith("/confirm")) {
    if (fail)
      throw {
        isAxiosError: true,
        response: { data: { message: "Value rejected by server" } },
      };
    data = { ...lab, confirmed: true };
  } else if (config.method === "post" && config.url.endsWith("/documents")) {
    if (fail)
      throw {
        isAxiosError: true,
        response: { data: { message: "Unsupported document type" } },
      };
    data = { ...doc, extractionStatus: "PENDING" };
  } else if (config.url.endsWith("/documents")) data = documents;
  else if (config.url.endsWith("/lab-results/pending")) data = [lab];
  else if (config.url.endsWith("/medications/pending")) data = [med];
  else if (config.url.includes("/lab-results")) data = [lab, confirmed];
  return { data, status: 200, statusText: "OK", headers: {}, config };
};
async function flush(fn = () => {}) {
  await React.act(async () => {
    await fn();
    await new Promise((r) => setTimeout(r, 12));
  });
}
async function mount(element) {
  root = createRoot(document.querySelector("#root"));
  await flush(() => root.render(element));
  await flush();
}
async function click(text) {
  const b = [...document.querySelectorAll("button")].find(
    (b) => b.textContent === text,
  );
  assert.ok(b, "button " + text);
  await flush(() => b.click());
}
async function submit() {
  await flush(() =>
    document
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
}
function input(name, value) {
  const el = document.querySelector(`[name="${name}"]`);
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
}
const props = {
  memberId: 1,
  tab: "labs",
  write: true,
  onChanged: () => saved++,
  onManual: () => {},
};
afterEach(async () => {
  if (root) await flush(() => root.unmount());
  root = null;
  requests = [];
  language = "en";
  fail = false;
  pendingContent = null;
  pendingManual = null;
  saved = 0;
  documents = [doc];
  localStorage.clear();
  clearTimeout(timer);
});
test("VIEWER sees unconfirmed proposals, gaps and originals but no write controls", async () => {
  await mount(
    React.createElement(Workspace, {
      ...props,
      write: false,
      tab: "prescription-review",
    }),
  );
  assert.match(document.body.textContent, /Unconfirmed extraction/);
  assert.ok(
    (document.body.textContent.match(/Not provided/g) || []).length >= 6,
  );
  assert.ok(
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent === "Open original",
    ),
  );
  assert.ok(
    ![...document.querySelectorAll("button")].some((b) =>
      /Accept|Correct|Reject|Upload|Delete/.test(b.textContent),
    ),
  );
  await click("Open original");
  assert.match(document.querySelector("iframe").src, /^blob:/);
});
test("unconfirmed values are excluded from confirmed tables and charts even if series returns them", async () => {
  await mount(React.createElement(Workspace, props));
  assert.match(
    document.querySelector('[data-proposal-id="11"]').textContent,
    /900 ng\/mL/,
  );
  for (const table of document.querySelectorAll("table"))
    assert.doesNotMatch(table.textContent, /900/);
  assert.equal(document.querySelectorAll("svg circle").length, 1);
  assert.match(
    document.querySelector("svg circle title").textContent,
    /50 ng\/mL/,
  );
});
test("correction sends numeric value and unit before confirming with JWT; 400 preserves edits", async () => {
  localStorage.setItem("token", "review-token");
  fail = true;
  await mount(
    React.createElement(Review, {
      memberId: 7,
      proposal: { kind: "lab", row: lab },
      action: "edit",
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
  input("value", "90");
  input("unit", "ug/L");
  await submit();
  const req = requests.find((r) => r.method === "post");
  assert.equal(req.url, "/members/7/documents/lab-results/11/confirm");
  assert.deepEqual(JSON.parse(req.data), { value: 90, unit: "ug/L" });
  assert.equal(req.headers.Authorization, "Bearer review-token");
  assert.match(document.body.textContent, /Value rejected by server/);
  assert.equal(document.querySelector("[name=value]").value, "90");
  assert.equal(saved, 0);
  fail = false;
  await submit();
  assert.equal(saved, 1);
});
test("clearing an existing correction is blocked instead of silently retaining the wrong dose", async () => {
  await mount(
    React.createElement(Review, {
      memberId: 1,
      proposal: {
        kind: "medication",
        row: { ...med, doseAmount: 500, doseLabel: "500 mg", doseUnit: "mg" },
      },
      action: "edit",
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
  input("doseAmount", "");
  await submit();
  assert.match(document.body.textContent, /cannot be cleared/);
  assert.equal(requests.length, 0);
});
test("reject uses member-scoped delete and does not delete original document", async () => {
  await mount(
    React.createElement(Review, {
      memberId: 4,
      proposal: { kind: "medication", row: med },
      action: "reject",
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
  await submit();
  assert.equal(requests[0].url, "/members/4/documents/medications/21");
  assert.equal(requests[0].method, "delete");
  assert.equal(saved, 1);
});
test("viewer fetches blob with JWT and revokes URLs; late member response cannot appear", async () => {
  localStorage.setItem("token", "document-token");
  let resolve;
  pendingContent = (config) =>
    new Promise((r) => {
      resolve = () =>
        r({
          data: new Blob(["old"], { type: "application/pdf" }),
          status: 200,
          headers: {},
          config,
        });
    });
  await mount(
    React.createElement(Viewer, {
      key: 1,
      memberId: 1,
      document: doc,
      onClose: () => {},
    }),
  );
  const old = requests[0];
  pendingContent = null;
  pendingManual = null;
  await flush(() =>
    root.render(
      React.createElement(Viewer, {
        key: 2,
        memberId: 2,
        document: { ...doc, id: 9 },
        onClose: () => {},
      }),
    ),
  );
  await flush();
  const current = document.querySelector("iframe").src;
  await flush(resolve);
  assert.equal(document.querySelector("iframe").src, current);
  assert.ok(old.signal.aborted);
  assert.equal(old.headers.Authorization, "Bearer document-token");
  assert.equal(old.responseType, "blob");
  await flush(() => root.unmount());
  root = null;
  assert.ok(revoked.includes(current));
});
test("SKIPPED is saved, FAILED offers manual entry and read-only hides deletion", async () => {
  documents = [
    { ...doc, extractionStatus: "SKIPPED" },
    { ...doc, id: 9, extractionStatus: "FAILED" },
  ];
  await mount(React.createElement(Workspace, { ...props, tab: "documents" }));
  assert.match(document.body.textContent, /File saved, but no readable text/);
  assert.match(document.body.textContent, /File saved, but reading failed/);
  assert.ok(
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent === "Add a record manually",
    ),
  );
  assert.equal(document.querySelectorAll("[role=alert]").length, 0);
});
test("numeric reference bands are conservative; confirmed charts do not mix units", async () => {
  assert.deepEqual(referenceBand("10 - 100"), [10, 100]);
  assert.equal(referenceBand("negative"), null);
  assert.equal(referenceBand("< 10"), null);
  assert.equal(referenceBand("age 2 - 5"), null);
  assert.equal(referenceBand("100 - 10"), null);
  assert.deepEqual(confirmedLabs([lab, confirmed]), [confirmed]);
  await mount(
    React.createElement(AnalyteChart, {
      unit: "ng/mL",
      rows: [
        lab,
        confirmed,
        { ...confirmed, id: 13, unit: "mg/L", value: 999 },
      ],
    }),
  );
  assert.equal(document.querySelectorAll("circle").length, 1);
  assert.equal(
    sortedDocuments([
      { ...doc, id: 2, documentDate: null },
      { ...doc, id: 1 },
    ])[0].id,
    1,
  );
});
test("upload is multipart and duplicate response is accepted; readable 400 reaches user", async () => {
  await mount(
    React.createElement(Upload, {
      memberId: 3,
      initialType: "PRESCRIPTION",
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
  const NativeFormData = global.FormData;
  global.FormData = class extends NativeFormData {
    constructor(form) {
      super(form);
      if (form)
        this.set(
          "file",
          new File(["report"], "report.pdf", { type: "application/pdf" }),
        );
    }
  };
  try {
    fail = true;
    await submit();
    assert.match(document.body.textContent, /Unsupported document type/);
    fail = false;
    await submit();
    assert.equal(saved, 1);
    const req = requests.find((r) => r.method === "post");
    assert.equal(req.url, "/members/3/documents");
    assert.equal(req.data.get("documentType"), "PRESCRIPTION");
    assert.equal(req.data.has("documentDate"), false);
  } finally {
    global.FormData = NativeFormData;
  }
});

test("pending extraction polls to completion without blocking another upload, then stops polling", async () => {
  documents = [{ ...doc, extractionStatus: "PENDING" }];
  await mount(React.createElement(Workspace, { ...props, tab: "documents" }));
  assert.match(document.body.textContent, /Reading the document/);
  assert.equal(
    [...document.querySelectorAll("button")].find(
      (b) => b.textContent === "Upload document",
    ).disabled,
    false,
  );
  documents = [{ ...doc, extractionStatus: "COMPLETED" }];
  await flush(() => new Promise((resolve) => setTimeout(resolve, 4100)));
  assert.match(document.body.textContent, /File read/);
  const reads = requests.filter(
    (r) => r.method === "get" && r.url.endsWith("/documents"),
  ).length;
  await flush(() => new Promise((resolve) => setTimeout(resolve, 4100)));
  assert.equal(
    requests.filter((r) => r.method === "get" && r.url.endsWith("/documents"))
      .length,
    reads,
  );
});
test("read-only documents expose opening but no upload, delete or manual entry", async () => {
  documents = [{ ...doc, extractionStatus: "FAILED" }];
  await mount(
    React.createElement(Workspace, {
      ...props,
      tab: "documents",
      write: false,
    }),
  );
  assert.ok(
    [...document.querySelectorAll("button")].some(
      (b) => b.textContent === "Open",
    ),
  );
  assert.ok(
    ![...document.querySelectorAll("button")].some((b) =>
      /Upload|Delete|manually/.test(b.textContent),
    ),
  );
});
test("oversized uploads are rejected locally without losing selected form fields", async () => {
  await mount(
    React.createElement(Upload, {
      memberId: 3,
      initialType: "LAB_RESULT",
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
  input("title", "My report");
  const NativeFormData = global.FormData;
  global.FormData = class extends NativeFormData {
    constructor(form) {
      super(form);
    }
    get(key) {
      if (key === "file") {
        const file = new File(["x"], "large.pdf", { type: "application/pdf" });
        Object.defineProperty(file, "size", { value: 25 * 1024 * 1024 + 1 });
        return file;
      }
      return super.get(key);
    }
  };
  try {
    await submit();
    assert.match(document.body.textContent, /exceeds 25 MB/);
    assert.equal(requests.length, 0);
    assert.equal(document.querySelector("[name=title]").value, "My report");
  } finally {
    global.FormData = NativeFormData;
  }
});
test("AZ proposals retain the unconfirmed label and explicit missing dose", async () => {
  language = "az";
  await mount(
    React.createElement(Workspace, { ...props, tab: "prescription-review" }),
  );
  assert.match(
    document.querySelector("[data-proposal-id]").textContent,
    /Oxunub, təsdiqlənməyib/,
  );
  assert.match(
    document.querySelector("[data-proposal-id]").textContent,
    /DozaGöstərilməyib/,
  );
});

const ManualLabEntry =
  require("../src/components/health/documents/ManualLabEntry.tsx").default;
const {
  LabSource,
} = require("../src/components/health/documents/LabSource.tsx");
const {
  labReferenceBand,
} = require("../src/components/health/documents/model.ts");
async function controlledInput(name, value) {
  await flush(() => {
    const el = document.querySelector(`[name="${name}"]`);
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    ).set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
}
async function manualMount(memberId = 1) {
  await mount(
    React.createElement(ManualLabEntry, {
      memberId,
      onClose: () => {},
      onSaved: () => saved++,
    }),
  );
}
test("manual numeric zero is saved with JWT, no invented range or flag, and no confirmation request", async () => {
  localStorage.setItem("token", "manual-token");
  await manualMount();
  await controlledInput("analyte", "Hemoglobin");
  await controlledInput("value", "0");
  await submit();
  const request = requests.find((r) => r.method === "post");
  assert.equal(request.url, "/members/1/documents/lab-results");
  assert.equal(request.headers.Authorization, "Bearer manual-token");
  const body = JSON.parse(request.data);
  assert.equal(body.value, 0);
  assert.equal(body.valueText, null);
  assert.equal(body.referenceLow, null);
  assert.equal(body.referenceHigh, null);
  assert.equal(body.referenceLabel, null);
  assert.equal(body.collectedAt, null);
  assert.ok(!("abnormalFlag" in body));
  assert.ok(!("confirmed" in body));
  assert.equal(saved, 1);
  assert.ok(!requests.some((r) => r.url.endsWith("/confirm")));
});
test("manual qualitative value and original units/date are preserved", async () => {
  await manualMount();
  await controlledInput("analyte", "Urine protein");
  await flush(() => {
    const select = document.querySelector("select");
    Object.getOwnPropertyDescriptor(
      HTMLSelectElement.prototype,
      "value",
    ).set.call(select, "text");
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await controlledInput("valueText", "trace");
  await controlledInput("unit", "mg/dL");
  await controlledInput("collectedAt", "2026-09-01T09:00");
  await submit();
  const body = JSON.parse(requests.find((r) => r.method === "post").data);
  assert.equal(body.value, null);
  assert.equal(body.valueText, "trace");
  assert.equal(body.unit, "mg/dL");
  assert.equal(body.collectedAt, "2026-09-01T09:00:00");
});
test("manual required fields validate and readable 400 preserves the entry for correction", async () => {
  await manualMount();
  await submit();
  assert.match(document.body.textContent, /Enter the test name/);
  assert.equal(requests.length, 0);
  await controlledInput("analyte", "Hemoglobin");
  await submit();
  assert.match(document.body.textContent, /Enter a numeric or text result/);
  assert.equal(requests.length, 0);
  await controlledInput("value", "9.4");
  await controlledInput("referenceLow", "12");
  await controlledInput("referenceHigh", "16");
  fail = true;
  await submit();
  assert.match(document.body.textContent, /Please check the laboratory value/);
  assert.equal(document.querySelector("[name=value]").value, "9.4");
  assert.equal(saved, 0);
  fail = false;
  await submit();
  assert.equal(saved, 1);
  const body = JSON.parse(requests.at(-1).data);
  assert.equal(body.referenceLow, 12);
  assert.equal(body.referenceHigh, 16);
  assert.ok(!("abnormalFlag" in body));
});
test("manual entry opens from unreadable documents and the general labs screen; VIEWER has neither", async () => {
  documents = [{ ...doc, extractionStatus: "SKIPPED" }];
  await mount(React.createElement(Workspace, { ...props, tab: "documents" }));
  await click("Add a record manually");
  assert.ok(document.querySelector("[name=analyte]"));
  await flush(() => root.unmount());
  root = null;
  await mount(React.createElement(Workspace, props));
  await click("Enter a lab result");
  assert.ok(document.querySelector("[name=analyte]"));
  await flush(() => root.unmount());
  root = null;
  await mount(React.createElement(Workspace, { ...props, write: false }));
  assert.ok(
    ![...document.querySelectorAll("button")].some(
      (b) => b.textContent === "Enter a lab result",
    ),
  );
});
test("switching members during a pending manual save cannot update the next member UI", async () => {
  let finish;
  pendingManual = new Promise((resolve) => (finish = resolve));
  await manualMount();
  await controlledInput("analyte", "Hemoglobin");
  await controlledInput("value", "9.4");
  await submit();
  await flush(() =>
    root.render(
      React.createElement(ManualLabEntry, {
        key: 2,
        memberId: 2,
        onClose: () => {},
        onSaved: () => saved++,
      }),
    ),
  );
  await flush(() => finish());
  assert.equal(saved, 0);
  assert.equal(document.querySelector("[name=analyte]").value, "");
});
test("source labels distinguish manual, extracted confirmed, pending and unknown provenance", async () => {
  await mount(
    React.createElement(
      "div",
      null,
      ...[
        { source: "MANUAL", confirmed: true },
        { source: "EXTRACTED", confirmed: true },
        { source: "EXTRACTED", confirmed: false },
        { source: undefined, confirmed: true },
      ].map((row, index) =>
        React.createElement(LabSource, { key: index, row }),
      ),
    ),
  );
  for (const text of [
    "Manually entered",
    "Read from document, confirmed",
    "Read from document, unconfirmed",
    "Source unavailable",
  ])
    assert.match(document.body.textContent, new RegExp(text));
});
test("lab chart sources and explicit laboratory bounds survive without an invented interval", async () => {
  assert.deepEqual(
    labReferenceBand({
      referenceLow: 12,
      referenceHigh: 16,
      referenceLabel: "Adult range",
    }),
    [12, 16],
  );
  assert.equal(
    labReferenceBand({
      referenceLow: null,
      referenceHigh: null,
      referenceLabel: null,
    }),
    null,
  );
  assert.equal(
    labReferenceBand({
      referenceLow: 12,
      referenceHigh: null,
      referenceLabel: "12 - 16",
    }),
    null,
  );
  await mount(
    React.createElement(AnalyteChart, {
      unit: "ng/mL",
      rows: [
        { ...confirmed, source: "MANUAL" },
        {
          ...confirmed,
          id: 13,
          source: "EXTRACTED",
          collectedAt: "2024-02-02",
        },
      ],
    }),
  );
  const points = [...document.querySelectorAll("circle")];
  assert.equal(points.length, 2);
  const manualPoint = points.find((p) =>
      p.textContent.includes("Manually entered"),
    ),
    extractedPoint = points.find((p) =>
      p.textContent.includes("Read from document, confirmed"),
    );
  assert.equal(manualPoint.getAttribute("fill"), "white");
  assert.notEqual(extractedPoint.getAttribute("fill"), "white");
});
