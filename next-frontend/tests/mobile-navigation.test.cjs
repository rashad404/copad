const { test, afterEach } = require("node:test");
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
  "KeyboardEvent",
])
  global[key] = dom.window[key];
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client");
let authenticated = false,
  doctor = false,
  pathname = "/health-record",
  logoutCalls = 0,
  resized;
window.matchMedia = () => ({
  matches: false,
  addEventListener: (_, callback) => {
    resized = callback;
  },
  removeEventListener: () => {},
});
Object.defineProperty(HTMLElement.prototype, "getClientRects", {
  value() {
    return this.closest(".desktopNav, .desktopLanguage, .account") ||
      this.matches(".login, .backdrop")
      ? []
      : [{ width: 100 }];
  },
});
const load = Module._load,
  resolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...args) {
  return resolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...args,
  );
};
Module._load = function (r, p, ...args) {
  if (r.endsWith(".module.css"))
    return {
      __esModule: true,
      default: new Proxy({}, { get: (_, key) => key }),
    };
  if (r === "next/link")
    return {
      __esModule: true,
      default: ({ children, onClick, ...props }) =>
        React.createElement(
          "a",
          {
            ...props,
            onClick: (event) => {
              event.preventDefault();
              onClick?.(event);
            },
          },
          children,
        ),
    };
  if (r === "next/navigation") return { usePathname: () => pathname };
  if (r === "next/font/google")
    return { Manrope: () => ({ className: "font" }) };
  if (r === "@/utils/useHydrated") return { useHydrated: () => true };
  if (r === "@/context/AuthContext")
    return {
      useAuth: () => ({
        isAuthenticated: authenticated,
        user: authenticated ? { id: 1 } : null,
        logout: async () => {
          logoutCalls++;
        },
      }),
    };
  if (r === "@/components/booking/useDoctorListing")
    return { useDoctorListing: () => doctor };
  if (r === "react-i18next")
    return { useTranslation: () => ({ i18n: { language: "en" } }) };
  if (r === "@/components/brand/BrandLogo")
    return {
      __esModule: true,
      default: ({ onClick }) =>
        React.createElement("a", { href: "/", onClick }, "azdoc"),
    };
  if (r === "@/components/LanguageSwitcher")
    return {
      __esModule: true,
      default: () =>
        React.createElement("button", { "aria-haspopup": "listbox" }, "EN"),
    };
  return load.call(this, r, p, ...args);
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
const Header = require("../src/components/navigation/SiteHeader.tsx").default;
let root;
const click = async (element) =>
  React.act(() =>
    element.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true }),
    ),
  );
const key = async (element, key, shiftKey = false) =>
  React.act(() =>
    element.dispatchEvent(
      new KeyboardEvent("keydown", {
        key,
        shiftKey,
        bubbles: true,
        cancelable: true,
      }),
    ),
  );
const toggle = () =>
  document.querySelector('[aria-controls="site-mobile-navigation"]');
async function mount() {
  root = createRoot(document.getElementById("root"));
  await React.act(() =>
    root.render(
      React.createElement(
        "div",
        null,
        React.createElement(Header),
        React.createElement("main", { id: "background" }, "Page"),
      ),
    ),
  );
  await click(toggle());
}
afterEach(async () => {
  if (root) await React.act(() => root.unmount());
  root = null;
  authenticated = false;
  doctor = false;
  pathname = "/health-record";
  logoutCalls = 0;
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
});
test("outside click closes the menu, restores focus, scrolling and background access", async () => {
  document.body.style.overflow = "auto";
  await mount();
  assert.equal(document.documentElement.style.overflow, "hidden");
  assert.equal(document.getElementById("background").inert, true);
  assert.equal(
    document.querySelector("header").getAttribute("aria-modal"),
    "true",
  );
  await click(document.querySelector(".backdrop"));
  assert.equal(document.getElementById("site-mobile-navigation"), null);
  assert.equal(document.activeElement, toggle());
  assert.equal(document.body.style.overflow, "auto");
  assert.notEqual(document.getElementById("background").inert, true);
});
test("signed-in tools precede account and language, with one active destination and a conditional doctor panel", async () => {
  authenticated = true;
  await mount();
  const menu = document.getElementById("site-mobile-navigation");
  assert.deepEqual(
    [...menu.querySelectorAll("a")].map((a) => a.getAttribute("href")),
    [
      "/chat",
      "/health-record",
      "/randevularim",
      "/analizlerim",
      "/hekimler",
      "/laboratoriyalar",
      "/dermanlar",
      "/dashboard",
      "/profile",
      "/profile/privacy",
    ],
  );
  assert.equal(
    menu.querySelector("[aria-current=page]").getAttribute("href"),
    "/health-record",
  );
  assert.ok(
    menu
      .querySelector(".mobileLanguage")
      .previousElementSibling.textContent.includes("Privacy"),
  );
  doctor = true;
  await React.act(() =>
    root.render(
      React.createElement(
        "div",
        null,
        React.createElement(Header),
        React.createElement("main", { id: "background" }, "Page"),
      ),
    ),
  );
  assert.ok(
    document.querySelector('#site-mobile-navigation a[href="/hekim-panel"]'),
  );
});
test("visitors see public tools and real sign-in and registration links", async () => {
  await mount();
  assert.deepEqual(
    [...document.querySelectorAll("#site-mobile-navigation a")].map((a) =>
      a.getAttribute("href"),
    ),
    [
      "/chat",
      "/hekimler",
      "/laboratoriyalar",
      "/dermanlar",
      "/login",
      "/register",
    ],
  );
});
test("Escape, menu toggle and selecting a destination each close the menu", async () => {
  await mount();
  await key(toggle(), "Escape");
  assert.equal(document.getElementById("site-mobile-navigation"), null);
  assert.equal(document.activeElement, toggle());
  await click(toggle());
  await click(toggle());
  assert.equal(document.getElementById("site-mobile-navigation"), null);
  await click(toggle());
  await click(document.querySelector("#site-mobile-navigation a"));
  assert.equal(document.getElementById("site-mobile-navigation"), null);
});
test("keyboard focus loops within the open header and menu", async () => {
  await mount();
  const first = document.querySelector("header a"),
    last = document.querySelector(".mobileLanguage button");
  last.focus();
  await key(last, "Tab");
  assert.equal(document.activeElement, first);
  await key(first, "Tab", true);
  assert.equal(document.activeElement, last);
});
test("unmount restores scroll state instead of leaving the page locked", async () => {
  await mount();
  await React.act(() => root.unmount());
  root = null;
  assert.equal(document.documentElement.style.overflow, "");
  assert.equal(document.body.style.overflow, "");
});
