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
  if (r === "next/image")
    return {
      __esModule: true,
      default: ({ fill, priority, quality, ...props }) =>
        React.createElement("img", props),
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
test("one example carries the selected appointment time through to the visit and clears sharing when it changes", async () => {
  await mount();
  await click(document.querySelector(".demoAction"));
  assert.equal(
    document.querySelector("#journey-step-1").getAttribute("aria-pressed"),
    "true",
  );
  await click(button(".times button", "11:30"));
  assert.match(document.querySelector(".timeStatus").textContent, /11:30/);
  await click(document.querySelector(".demoAction"));
  assert.match(document.querySelector(".confirmation").textContent, /11:30/);
  await click(document.querySelector(".share input"));
  assert.equal(document.querySelector(".share input").checked, true);
  await click(document.querySelector("#journey-step-1"));
  await click(button(".times button", "14:00"));
  await click(document.querySelector(".demoAction"));
  assert.equal(document.querySelector(".share input").checked, false);
  assert.match(document.querySelector(".confirmation").textContent, /14:00/);
  assert.match(document.querySelector(".visitNote").textContent, /14:00/);
  assert.equal(
    document.querySelector(".demoAction").getAttribute("href"),
    "/hekimler",
  );
});
test("family stories are local examples and main actions reach real product routes", async () => {
  const previousFetch = global.fetch;
  let requests = 0;
  global.fetch = () => {
    requests++;
    throw new Error("Example cannot issue requests");
  };
  try {
    await mount();
    await click(document.querySelector("#family-child"));
    assert.equal(
      document.querySelector("#family-child").getAttribute("aria-pressed"),
      "true",
    );
    assert.match(
      document.querySelector("#family-story").textContent,
      /child's/,
    );
    await click(document.querySelector("#journey-step-2"));
    await click(document.querySelector(".share input"));
    assert.equal(requests, 0);
    assert.match(
      document.querySelector(".demoCaption").textContent,
      /fictional/,
    );
    assert.equal(
      document.querySelector(".hero .primary").getAttribute("href"),
      "/chat",
    );
    assert.equal(
      document.querySelector(".familyCopy > a").getAttribute("href"),
      "/register",
    );
    assert.ok(document.querySelector('a[href="/dermanlar"]'));
    assert.ok(document.querySelector('a[href="/health-record"]'));
  } finally {
    global.fetch = previousFetch;
  }
});
test("signed-in shortcuts open the account while public examples contain no actual patient details", async () => {
  authenticated = true;
  await mount();
  assert.deepEqual(
    [...document.querySelectorAll(".returning a")].map((a) =>
      a.getAttribute("href"),
    ),
    ["/chat", "/health-record", "/randevularim"],
  );
  assert.equal(
    document.querySelector(".familyCopy > a").getAttribute("href"),
    "/health-record",
  );
  assert.doesNotMatch(
    document.querySelector("main").textContent,
    /PRIVATE PATIENT/,
  );
});
test("the initial page uses its server locale and every language includes copy and descriptive photo text", () => {
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
      copy[locale].heroLine1 + copy[locale].heroLine2 + copy[locale].heroLine3,
    );
    assert.equal(document.querySelector(".home").lang, locale);
    assert.equal(document.querySelectorAll("main img").length, 2);
    for (const image of document.querySelectorAll("main img"))
      assert.ok(image.alt);
  }
});
