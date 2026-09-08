const { test, beforeEach, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
for (const key of [
  "window",
  "document",
  "HTMLElement",
  "Node",
  "Event",
  "MouseEvent",
])
  global[key] = dom.window[key];
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client"),
  { renderToStaticMarkup } = require("react-dom/server");
const testRows = [
  {
    id: 1,
    code: "HGB",
    name: "Hemoqlobin",
    analyteKey: "hgb",
    sampleType: "Qan",
    price: 12.1,
    turnaroundHours: 24,
    preparation: "8 saat ac qalın.",
  },
  {
    id: 2,
    code: "CRP",
    name: "CRP",
    analyteKey: "crp",
    sampleType: null,
    price: null,
    turnaroundHours: null,
    preparation: null,
  },
];
const lab = {
  id: 7,
  slug: "test-lab",
  name: "Test laboratoriyası",
  city: "Bakı",
  district: "Nəsimi",
  address: "Test ünvanı",
  phone: "+994 12 123 45 67",
  homeCollection: true,
  homeCollectionFee: 5,
  testCount: 2,
  tests: testRows,
};
const person = { id: 11, fullName: "Ayan" };
let language,
  auth,
  memberState,
  directory,
  orders,
  calls,
  apiError,
  root,
  selectedLab,
  familyError,
  orderFailure,
  createPending;
const originalLoad = Module._load,
  originalResolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...args) {
  return originalResolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...args,
  );
};
const reply = () => ({
  id: 40,
  labId: 7,
  labName: lab.name,
  labPhone: lab.phone,
  status: "REQUESTED",
  collection: "HOME",
  address: "Bakı 12",
  contactPhone: "0501234567",
  preferredAt: null,
  totalPrice: 18,
  note: null,
  cancelledAt: null,
  completedAt: null,
  items: [{ id: 100, name: "Hemoqlobin", price: 13, resultReady: false }],
});
Module._load = function (r, p, ...args) {
  if (r.endsWith(".module.css"))
    return { __esModule: true, default: new Proxy({}, { get: (_, k) => k }) };
  if (r === "next/link")
    return {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    };
  if (r === "next/navigation")
    return {
      notFound: () => {
        throw Error("NOT_FOUND");
      },
    };
  if (r === "@/context/AuthContext") return { useAuth: () => auth };
  if (r === "react-i18next")
    return { useTranslation: () => ({ i18n: { language } }) };
  if (r === "@/components/public/ProductLayout")
    return {
      __esModule: true,
      default: ({ children }) => React.createElement("main", null, children),
    };
  if (r === "@/components/health/useChatMember")
    return { useChatMember: () => memberState };
  if (r === "@/api/healthRecord")
    return {
      healthApi: {
        families: async () => {
          if (familyError) throw Error("offline");
          return memberState.families;
        },
      },
    };
  if (r === "@/api/labs")
    return {
      labApi: {
        tests: async (slug, q, lang) => {
          calls.push(["tests", slug, q, lang]);
          return testRows.filter((t) => !q || t.name.includes(q));
        },
        create: async (id, body) => {
          calls.push(["create", id, body]);
          if (apiError) throw { response: { data: { message: apiError } } };
          return createPending ? await createPending : reply();
        },
        orders: async (id) => {
          calls.push(["orders", id]);
          if (id === orderFailure) throw Error("offline");
          return orders;
        },
        cancel: async (member, id) => {
          calls.push(["cancel", member, id]);
          if (apiError) throw { response: { data: { message: apiError } } };
          return {
            ...reply(),
            id,
            status: "CANCELLED",
            cancelledAt: "2026-09-08T09:00:00",
          };
        },
      },
    };
  if (r === "@/api/labServer")
    return {
      laboratoryCopy: async () => ({
        language,
        c: require("../src/components/labs/copy.ts").labCopy(language),
      }),
      getLabs: async (filters) => {
        if (directory === null) throw Error("offline");
        return {
          content: filters.q
            ? directory.filter((l) => l.name.includes(filters.q))
            : directory,
          totalElements: directory.length,
          totalPages: 1,
          number: filters.page,
        };
      },
      getLab: async () => selectedLab,
    };
  return originalLoad.call(this, r, p, ...args);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = (module, file) =>
    module._compile(
      ts.transpileModule(fs.readFileSync(file, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
          esModuleInterop: true,
          target: ts.ScriptTarget.ES2020,
        },
      }).outputText,
      file,
    );
const model = require("../src/components/labs/model.ts");
const Catalogue = require("../src/components/labs/LabCatalogue.tsx").default;
const Orders = require("../src/components/labs/LabOrders.tsx").default;
const Directory = require("../src/app/laboratoriyalar/page.tsx");
const Detail = require("../src/app/laboratoriyalar/[slug]/page.tsx");
const copy = require("../src/components/labs/translations.json");
const text = () => document.body.textContent;
const button = (label) =>
  [...document.querySelectorAll("button")].find((b) => b.textContent === label);
const click = async (el) => {
  assert.ok(el, "control exists");
  await React.act(async () =>
    el.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    ),
  );
};
const change = async (el, value) =>
  React.act(async () => {
    Object.getOwnPropertyDescriptor(
      dom.window.HTMLInputElement.prototype,
      "value",
    ).set.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
async function mount(component = Catalogue) {
  root = createRoot(document.getElementById("root"));
  await React.act(async () =>
    root.render(
      React.createElement(component, { lab, initialLanguage: language }),
    ),
  );
}
const rerender = () =>
  React.act(async () =>
    root.render(
      React.createElement(Catalogue, { lab, initialLanguage: language }),
    ),
  );
beforeEach(() => {
  language = "az";
  auth = { isAuthenticated: true, isLoading: false, user: { id: "owner" } };
  memberState = {
    signedIn: true,
    member: person,
    loading: false,
    error: false,
    families: [{ id: 3, name: "Ailə", role: "OWNER", members: [person] }],
    select: () => {},
    retry: () => {},
  };
  directory = [lab];
  selectedLab = lab;
  orders = [reply()];
  calls = [];
  apiError = null;
  familyError = false;
  orderFailure = null;
  createPending = null;
});
afterEach(async () => {
  if (root) await React.act(async () => root.unmount());
  root = null;
});
test("basket preserves unknown prices and cents; HOME payload includes only its required fields", () => {
  assert.deepEqual(model.basketTotal(testRows, "HOME", 5), {
    known: 17.1,
    complete: false,
  });
  assert.deepEqual(model.basketTotal([testRows[0]], "LAB", null), {
    known: 12.1,
    complete: true,
  });
  assert.equal(model.money(null, "az", "unknown"), "unknown");
  assert.equal(model.money(0, "az", "unknown"), "0,00 AZN");
  assert.deepEqual(
    model.orderRequest(
      7,
      [testRows[0], testRows[0]],
      "LAB",
      "old address",
      "old phone",
    ),
    { labId: 7, testIds: [1], collection: "LAB" },
  );
  assert.deepEqual(
    model.orderRequest(7, [testRows[0]], "HOME", " Bakı ", " 050 "),
    {
      labId: 7,
      testIds: [1],
      collection: "HOME",
      address: "Bakı",
      contactPhone: "050",
    },
  );
  assert.equal(model.cancellable("SAMPLE_COLLECTED"), false);
  assert.equal(model.terminal("REQUESTED"), false);
  assert.match(model.preferredTime("2026-09-08T09:30:00", "az"), /sentyabr/);
});
test("filters preserve Azerbaijani text and reject invalid page numbers", () => {
  const f = model.parseFilters({
    q: " İmmun ",
    city: "Bakı",
    homeCollection: "true",
    page: "-3",
  });
  assert.equal(f.page, 0);
  assert.equal(new URLSearchParams(model.filterQuery(f, 2)).get("q"), "İmmun");
  assert.equal(f.homeCollection, true);
});
test("directory SSR, filters, empty and unavailable states have meaningful content and canonical metadata", async () => {
  const props = { searchParams: Promise.resolve({}) };
  let html = renderToStaticMarkup(await Directory.default(props));
  assert.match(html, /Test laboratoriyası/);
  assert.match(html, /name="city"/);
  assert.match(html, /name="homeCollection"/);
  const metadata = await Directory.generateMetadata(props);
  assert.equal(
    metadata.alternates.canonical,
    "https://azdoc.ai/laboratoriyalar",
  );
  assert.equal(
    (
      await Directory.generateMetadata({
        searchParams: Promise.resolve({ city: "Bakı" }),
      })
    ).robots.index,
    false,
  );
  directory = [];
  html = renderToStaticMarkup(await Directory.default(props));
  assert.match(html, /Laboratoriyalar əlavə olunur/);
  directory = null;
  html = renderToStaticMarkup(await Directory.default(props));
  assert.match(html, /role="alert"/);
  assert.doesNotMatch(html, /Laboratoriyalar əlavə olunur/);
});
test("profile SSR includes tests and preparation before hydration, canonical and a real 404", async () => {
  auth = { isAuthenticated: false, isLoading: true, user: null };
  const props = { params: Promise.resolve({ slug: lab.slug }) };
  const html = renderToStaticMarkup(await Detail.default(props));
  assert.match(html, /Hemoqlobin/);
  assert.match(html, /8 saat ac qalın/);
  assert.match(html, /Qiymət qeyd edilməyib/);
  assert.equal(
    (await Detail.generateMetadata(props)).alternates.canonical,
    "https://azdoc.ai/laboratoriyalar/test-lab",
  );
  selectedLab = null;
  await assert.rejects(Detail.default(props), /NOT_FOUND/);
});
test("search preserves selected tests; HOME requires only address and phone; confirmation uses snapshot prices and preparation", async () => {
  await mount();
  await click(document.querySelector('[aria-label="Seç: Hemoqlobin"]'));
  await change(document.querySelector("input[type=search]"), "CRP");
  await click(button(copy.az.search));
  assert.match(document.querySelector("aside").textContent, /Hemoqlobin/);
  await click(document.querySelector("input[value=HOME]"));
  assert.equal(document.querySelectorAll("input[required]").length, 2);
  assert.equal(
    document.querySelector('input[autocomplete="street-address"]').required,
    true,
  );
  assert.equal(document.querySelector("input[type=tel]").required, true);
  await change(
    document.querySelector('input[autocomplete="street-address"]'),
    "Bakı 12",
  );
  await change(document.querySelector("input[type=tel]"), "0501234567");
  await click(button(copy.az.submit));
  assert.deepEqual(
    calls.find((c) => c[0] === "create"),
    [
      "create",
      11,
      {
        labId: 7,
        testIds: [1],
        collection: "HOME",
        address: "Bakı 12",
        contactPhone: "0501234567",
      },
    ],
  );
  assert.match(text(), /Sorğunuz göndərildi/);
  assert.match(text(), /8 saat ac qalın/);
  assert.match(text(), /18,00 AZN/);
  assert.match(text(), /Laboratoriya qəbul etdiyini ayrıca təsdiqləməlidir/);
});
test("a readable 400 preserves the basket for correction; LAB does not ask for contact details", async () => {
  apiError = "This test is no longer available";
  await mount();
  await click(document.querySelector('[aria-label="Seç: Hemoqlobin"]'));
  assert.equal(document.querySelector("input[type=tel]"), null);
  await click(button(copy.az.submit));
  assert.match(text(), /This test is no longer available/);
  assert.match(document.querySelector("aside").textContent, /Hemoqlobin/);
  assert.deepEqual(calls.find((c) => c[0] === "create")[2], {
    labId: 7,
    testIds: [1],
    collection: "LAB",
  });
});
test("VIEWER and signed-out users have no ordering controls", async () => {
  memberState.families[0].role = "VIEWER";
  await mount();
  assert.equal(button(copy.az.submit), undefined);
  assert.equal(document.querySelector("input[value=HOME]"), null);
  auth = { isAuthenticated: false, isLoading: false, user: null };
  memberState.signedIn = false;
  await rerender();
  assert.equal(button(copy.az.submit), undefined);
  assert.match(text(), /Sorğu göndərmək üçün hesabınıza daxil olun/);
});
test("all order statuses, member, stored prices and guarded cancellation render correctly", async () => {
  orders = [
    reply(),
    { ...reply(), id: 41, status: "SAMPLE_COLLECTED" },
    {
      ...reply(),
      id: 42,
      status: "COMPLETED",
      completedAt: "2026-09-08T09:00:00",
    },
  ];
  await mount(Orders);
  assert.match(text(), /Ayan/);
  assert.match(text(), /18,00 AZN/);
  assert.equal(
    [...document.querySelectorAll("button")].filter(
      (b) => b.textContent === copy.az.cancel,
    ).length,
    1,
  );
  await click(button(copy.az.cancel));
  assert.equal(
    calls.some((c) => c[0] === "cancel"),
    false,
  );
  await click(button(copy.az.cancel));
  assert.deepEqual(
    calls.find((c) => c[0] === "cancel"),
    ["cancel", 11, 40],
  );
  assert.match(text(), /Ləğv edilib/);
});
test("VIEWER cannot cancel and a failed member fetch never reads as no orders", async () => {
  memberState.families[0].role = "VIEWER";
  await mount(Orders);
  assert.equal(button(copy.az.cancel), undefined);
  await React.act(async () => root.unmount());
  root = null;
  familyError = true;
  await mount(Orders);
  assert.match(text(), /Sifarişləri yükləmək mümkün olmadı/);
  assert.doesNotMatch(text(), /Hələ analiz sifarişiniz yoxdur/);
});
test("partial family failures are disclosed without hiding the successfully loaded orders", async () => {
  memberState.families[0].members.push({ id: 12, fullName: "Other member" });
  orderFailure = 12;
  await mount(Orders);
  assert.match(text(), /Bəzi ailə üzvlərinin sifarişləri yüklənmədi/);
  assert.match(text(), /Test laboratoriyası/);
});
test("all three languages cover the same UI and contain no typographic punctuation", () => {
  for (const lang of ["az", "en", "ru"]) {
    assert.deepEqual(Object.keys(copy[lang]), Object.keys(copy.az));
    assert.doesNotMatch(JSON.stringify(copy[lang]), /[\u2010-\u201f\u2026]/);
  }
});

test("a pending request cannot be submitted twice or expose a confirmation after account change", async () => {
  let resolve;
  createPending = new Promise((done) => {
    resolve = done;
  });
  await mount();
  await click(document.querySelector('[aria-label="Seç: Hemoqlobin"]'));
  await click(button(copy.az.submit));
  const submit = button(copy.az.submitting);
  assert.equal(submit.disabled, true);
  await click(submit);
  assert.equal(calls.filter((call) => call[0] === "create").length, 1);
  auth = {
    isAuthenticated: true,
    isLoading: false,
    user: { id: "another-account" },
  };
  await rerender();
  await React.act(async () => {
    resolve(reply());
  });
  assert.doesNotMatch(text(), /Sorğunuz göndərildi/);
});

test("API calls use the contract paths, locale, JSON body and existing JWT client", async () => {
  global.localStorage = window.localStorage;
  localStorage.setItem("token", "test-only-token");
  const client = require("../src/api/axios.ts").default;
  const originalAdapter = client.defaults.adapter;
  const requests = [];
  client.defaults.adapter = async (config) => {
    requests.push(config);
    return { data: [], status: 200, statusText: "OK", headers: {}, config };
  };
  try {
    const actual = require("../src/api/labs.ts").labApi;
    await actual.tests("İ-lab", "İmmun", "ru");
    await actual.orders(11);
    await actual.create(11, { labId: 7, testIds: [1], collection: "LAB" });
    await actual.cancel(11, 40);
    assert.equal(requests[0].url, "/labs/%C4%B0-lab/tests");
    assert.deepEqual(requests[0].params, { q: "İmmun", lang: "ru" });
    assert.equal(requests[1].url, "/members/11/lab-orders");
    assert.equal(requests[2].method, "post");
    assert.deepEqual(JSON.parse(requests[2].data), {
      labId: 7,
      testIds: [1],
      collection: "LAB",
    });
    assert.equal(requests[3].url, "/members/11/lab-orders/40/cancel");
    for (const request of requests)
      assert.equal(request.headers.Authorization, "Bearer test-only-token");
  } finally {
    client.defaults.adapter = originalAdapter;
    localStorage.removeItem("token");
  }
});
