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
let language = "en",
  authenticated = false,
  hydrated = true,
  root;
const load = Module._load,
  resolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...a) {
  return resolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...a,
  );
};
Module._load = function (r, p, ...a) {
  if (r.endsWith(".module.css"))
    return {
      __esModule: true,
      default: new Proxy({}, { get: (_, key) => key }),
    };
  if (r === "next/link")
    return {
      __esModule: true,
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    };
  if (r === "@/utils/useHydrated") return { useHydrated: () => hydrated };
  if (r === "@/context/AuthContext")
    return {
      useAuth: () => ({
        isAuthenticated: authenticated,
        user: authenticated ? { id: 99, name: "PRIVATE PATIENT" } : null,
      }),
    };
  if (r === "react-i18next")
    return { useTranslation: () => ({ i18n: { language } }) };
  if (
    r === "@/components/navigation/SiteHeader" ||
    r === "@/components/public/SiteFooter"
  )
    return { __esModule: true, default: () => null };
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
const Home = require("../src/components/home/HomePage.tsx").default;
const copy = require("../src/components/home/translations.json");
async function mount() {
  root = createRoot(document.getElementById("root"));
  await React.act(() => root.render(React.createElement(Home)));
}
async function click(el) {
  assert.ok(el);
  await React.act(() =>
    el.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    ),
  );
}
const button = (selector, text) =>
  [...document.querySelectorAll(selector)].find((el) =>
    el.textContent.includes(text),
  );
afterEach(async () => {
  if (root) await React.act(() => root.unmount());
  root = null;
  language = "en";
  authenticated = false;
  hydrated = true;
});
test("changing a member updates the answer, records, chart, PDF and appointment without retaining sharing consent", async () => {
  await mount();
  await click(button("#demo .demoSteps button", "Record"));
  assert.match(document.querySelector("#demo .labValue").textContent, /13.2/);
  await click(button("#care .timeChoices button", "11:30"));
  await click(document.querySelector("#care input[type=checkbox]"));
  assert.equal(document.querySelector("#care input").checked, true);
  await click(button("#demo .members button", "Ayan"));
  assert.match(document.querySelector("#demo .labValue").textContent, /12.4/);
  assert.match(
    document.querySelector("#demo .recordFacts").textContent,
    /Pollen/,
  );
  assert.doesNotMatch(
    document.querySelector("#demo .recordFacts").textContent,
    /Penicillin/,
  );
  assert.match(
    document.querySelector("#family .familyIdentity").textContent,
    /Ayan/,
  );
  assert.match(
    document.querySelector("#family svg[role=img]").getAttribute("aria-label"),
    /12, 12.1, 12.5, 12.4/,
  );
  assert.match(
    document.querySelector("#care .summarySheet").textContent,
    /Ayan/,
  );
  assert.match(
    document.querySelector("#care .summarySheet").textContent,
    /12.4/,
  );
  assert.match(
    document.querySelector("#care .visitPerson").textContent,
    /Ayan/,
  );
  assert.equal(document.querySelector("#care input").checked, false);
  assert.equal(
    document.querySelector("#care .timeChoices [aria-pressed=true]")
      .textContent,
    "10:00",
  );
  await click(button("#demo .demoSteps button", "Answer"));
  assert.match(
    document.querySelector("#demo .answer").textContent,
    /Ayan's blood test/,
  );
  await click(button("#family .members button", "Rauf"));
  assert.match(
    document.querySelector("#demo .answer").textContent,
    /Rauf's blood test/,
  );
  assert.match(
    document.querySelector("#family .familyFacts").textContent,
    /Hypertension/,
  );
  await click(button("#demo .demoSteps button", "Visit"));
  assert.match(
    document.querySelector("#demo .summarySheet").textContent,
    /Rauf/,
  );
  assert.match(
    document.querySelector("#demo .summarySheet").textContent,
    /14.1/,
  );
});
test("sample controls stay local while the real calls to action and medicine search use product routes", async () => {
  const originalFetch = global.fetch;
  let requests = 0;
  global.fetch = () => {
    requests++;
    throw new Error("Example must not send requests");
  };
  try {
    await mount();
    await click(button("#demo .demoSteps button", "Visit"));
    await click(button("#care .timeChoices button", "14:00"));
    await click(document.querySelector("#care input"));
    assert.equal(requests, 0);
    assert.match(
      document.querySelector("#demo").textContent,
      /do not change your records or create an appointment/,
    );
    assert.equal(
      document.querySelector(".hero .primary").getAttribute("href"),
      "/chat",
    );
    assert.equal(
      document.querySelector(".hero .textLink").getAttribute("href"),
      "/register",
    );
    assert.equal(
      document.querySelector(".careIntro .primary").getAttribute("href"),
      "/hekimler",
    );
    const form = document.querySelector(".medicineSearch");
    assert.equal(form.getAttribute("method"), "get");
    assert.equal(form.getAttribute("action"), "/dermanlar");
    assert.equal(form.querySelector("input").name, "q");
  } finally {
    global.fetch = originalFetch;
  }
});
test("signed-in visitors get account shortcuts while examples contain no real patient data", async () => {
  authenticated = true;
  await mount();
  assert.deepEqual(
    [...document.querySelectorAll(".returning a")].map((a) =>
      a.getAttribute("href"),
    ),
    ["/chat", "/health-record", "/randevularim"],
  );
  assert.equal(
    document.querySelector(".hero .textLink").getAttribute("href"),
    "/health-record",
  );
  assert.equal(
    document.querySelector(".closing a").getAttribute("href"),
    "/health-record",
  );
  assert.doesNotMatch(
    document.querySelector("main").textContent,
    /PRIVATE PATIENT/,
  );
});
test("initial HTML follows the server locale before hydration and all three languages cover the same text", () => {
  hydrated = false;
  language = "az";
  for (const locale of ["az", "en", "ru"]) {
    assert.deepEqual(
      Object.keys(copy[locale]).sort(),
      Object.keys(copy.az).sort(),
    );
    for (const value of Object.values(copy[locale]))
      assert.ok(
        value.trim() &&
          !/[\u2013\u2014\u2018\u2019\u201c\u201d\u2026]/.test(value),
        value,
      );
    const html = renderToStaticMarkup(
      React.createElement(Home, { initialLanguage: locale }),
    );
    const document = new JSDOM(html).window.document;
    assert.equal(
      document.querySelector("h1").textContent,
      copy[locale].heroLine1 + copy[locale].heroLine2,
    );
    assert.equal(document.querySelector(".home").lang, locale);
    assert.match(
      document.querySelector(".priceRow strong").textContent,
      locale === "en" ? /6\.00/ : /6,00/,
    );
  }
});
