const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/dermanlar/test",
});
for (const k of [
  "window",
  "document",
  "HTMLElement",
  "Node",
  "Event",
  "localStorage",
])
  global[k] = dom.window[k];
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.self = dom.window;
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client");
let auth = { user: { id: "73" }, isAuthenticated: true, isLoading: false },
  calls = [],
  pending = [],
  failure = false;
const origLoad = Module._load,
  origResolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...a) {
  return origResolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...a,
  );
};
Module._load = function (r, p, ...a) {
  if (r.endsWith(".module.css"))
    return { __esModule: true, default: new Proxy({}, { get: (_, k) => k }) };
  if (r === "@/context/AuthContext") return { useAuth: () => auth };
  if (r === "@/api/healthRecord")
    return {
      healthApi: {
        families: async () => [
          {
            id: 1,
            name: "Family",
            role: "VIEWER",
            members: [
              { id: 1, fullName: "Member One" },
              { id: 2, fullName: "Member Two" },
            ],
          },
        ],
      },
    };
  if (r === "@/api/medicines")
    return {
      checkMedicineAllergies: (id, memberId, signal) => {
        calls.push({ id, memberId, signal });
        return new Promise((resolve, reject) =>
          pending.push({ resolve, reject }),
        );
      },
    };
  return origLoad.call(this, r, p, ...a);
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
const model = require("../src/components/medicines/model.ts");
const Check = require("../src/components/medicines/AllergyCheck.tsx").default;
let root;
async function flush(fn = () => {}) {
  await React.act(async () => {
    fn();
    await new Promise((r) => setTimeout(r, 5));
  });
}
async function mount() {
  root = createRoot(document.querySelector("#root"));
  await flush(() =>
    root.render(React.createElement(Check, { medicineId: 12 })),
  );
  await flush();
}
afterEach(async () => {
  if (root) await flush(() => root.unmount());
  root = null;
  calls = [];
  pending = [];
  localStorage.clear();
  auth = { user: { id: "73" }, isAuthenticated: true, isLoading: false };
});
test("null prices never become zero; real zero retained; ascending null-last sorting", () => {
  assert.equal(model.price(null), "qiymət yoxdur");
  assert.match(model.price(0), /0,00/);
  assert.deepEqual([null, 6, 1.1, null, 0].sort(model.priceOrder), [
    0,
    1.1,
    6,
    null,
    null,
  ]);
  assert.equal(model.saving(6, 1.1), 4.9);
  assert.equal(model.saving(null, 1), null);
  assert.equal(model.saving(1, 6), null);
});
test("Azerbaijani comparisons and JSON-LD preserve names and prevent script injection", () => {
  assert.equal(model.azCompare("İbuprofen", "ibuprofen"), 0);
  const d = {
    name: "İbuprofen </script>",
    slug: "Case-hMdm",
    active_ingredient: "İbuprofen",
    prescription_status: "Reseptsiz",
    prices: [],
  };
  const schema = model.drugSchema(d);
  assert.equal(schema.name, d.name);
  assert.match(schema.url, /Case-hMdm$/);
  assert.equal(schema.prescriptionStatus, "https://schema.org/OTC");
  assert.ok(!model.safeJsonLd(schema).includes("</script>"));
  assert.equal(model.lowestPrice(d), null);
});
test("guests never fetch private checks", async () => {
  auth = { user: null, isAuthenticated: false, isLoading: false };
  await mount();
  assert.equal(calls.length, 0);
  assert.match(document.body.textContent, /daxil olun/);
});
test("saved member verified against families; invalid selection never checked", async () => {
  localStorage.setItem("azdoc.member.73", "999");
  await mount();
  assert.equal(calls.length, 0);
  assert.equal(document.querySelector("select").value, "");
});
test("critical and class warnings, member switch cancellation and no false-safe state", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  assert.equal(calls[0].memberId, 1);
  await flush(() =>
    pending[0].resolve([
      {
        medicineName: "Test",
        allergen: "Penicillin",
        critical: true,
        severity: "LIFE_THREATENING",
        basis: "CLASS",
      },
    ]),
  );
  assert.match(
    document.querySelector("[role=alert]").textContent,
    /həyati təhlükə/,
  );
  assert.match(document.body.textContent, /Dərman sinfinə/);
  assert.match(document.body.textContent, /əvəz etmir/);
  await flush(() => {
    const s = document.querySelector("select");
    s.value = "2";
    s.dispatchEvent(new Event("change", { bubbles: true }));
  });
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(calls[1].memberId, 2);
  assert.ok(!document.body.textContent.includes("Penicillin"));
  assert.equal(localStorage.getItem("azdoc.member.73"), "2");
  await flush(() => pending[1].reject(new Error("offline")));
  assert.match(document.body.textContent, /qiymətləndirilə bilmədi/);
  assert.ok(!document.body.textContent.includes("uyğunluq tapılmadı"));
});
test("late responses for previous member do not overwrite current warning", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  await flush(() => {
    const s = document.querySelector("select");
    s.value = "2";
    s.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await flush(() =>
    pending[0].resolve([
      {
        medicineName: "Old",
        allergen: "OLD ALLERGEN",
        critical: true,
        basis: "INGREDIENT",
        severity: "SEVERE",
      },
    ]),
  );
  assert.ok(!document.body.textContent.includes("OLD ALLERGEN"));
  await flush(() => pending[1].resolve([]));
  assert.match(document.body.textContent, /Member Two/);
  assert.match(document.body.textContent, /təhlükəsizliyinə zəmanət deyil/);
});
test("authenticated allergy endpoint carries JWT, member ID and abort signal", async () => {
  const axiosClient = require("../src/api/axios.ts").default;
  const { checkMedicineAllergies } = require("../src/api/medicines.ts");
  const previous = axiosClient.defaults.adapter;
  localStorage.setItem("token", "test-token");
  const controller = new AbortController();
  axiosClient.defaults.adapter = async (config) => {
    assert.equal(config.url, "/medicines/12/allergy-check");
    assert.equal(config.params.memberId, 2);
    assert.equal(config.headers.Authorization, "Bearer test-token");
    assert.equal(config.signal, controller.signal);
    return { data: [], status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    assert.deepEqual(
      await checkMedicineAllergies(12, 2, controller.signal),
      [],
    );
  } finally {
    axiosClient.defaults.adapter = previous;
  }
});
