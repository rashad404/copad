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
const Tags = require("../src/app/admin/tags/page.tsx").default;
const Users = require("../src/app/admin/users/page.tsx").default;
const Posts = require("../src/app/admin/posts/page.tsx").default;
const Editor = require("../src/components/admin/PostEditor.tsx").default;
const Usage = require("../src/app/admin/usage/page.tsx").default;
const {
  costPerCall,
  usd,
  validateUsage,
} = require("../src/components/admin/usage.ts");
const { useResource } = require("../src/components/admin/useResource.ts");
let root,
  requests = [],
  failMutation = false,
  usageStatus = 200,
  usageOverride,
  deferredUsage,
  deferredImage;
let tags = [
  { id: 1, name: "test", slug: "test", postCount: 0 },
  { id: 2, name: "Health", slug: "health", postCount: 7 },
];
const payload = {
  dailyLimitUsd: 25,
  spentTodayUsd: 0.0069,
  totals: { calls: 122, tokens: 48213, costUsd: 2.07 },
  daily: [{ date: "2026-09-07", calls: 12, tokens: 4210, costUsd: 0.65 }],
  byModel: [{ model: "o3", calls: 118, tokens: 47000, costUsd: 2.01 }],
};
const post = {
  id: 12,
  title: "Existing article",
  summary: "A complete summary",
  content: "<p>Actual article content</p>",
  featuredImage: "https://example.com/image.png",
  language: "tr",
  tags: [{ id: 2, name: "Health" }],
  published: false,
  slug: "existing-article",
  createdAt: "2026-09-07",
};
function apiError(status, message) {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: { status, data: { message } },
  });
}
api.defaults.adapter = async (config) => {
  const data =
    typeof config.data === "string" ? JSON.parse(config.data) : config.data;
  requests.push({
    url: config.url,
    method: config.method,
    data,
    params: config.params,
    auth: config.headers.Authorization,
  });
  if (config.method !== "get" && failMutation)
    throw apiError(400, "This name is already used.");
  let response;
  if (config.url === "/admin/usage") {
    if (deferredUsage) await deferredUsage;
    if (usageStatus !== 200) throw apiError(usageStatus, "Service unavailable");
    response = usageOverride ?? payload;
  } else if (config.url === "/upload/image") {
    if (deferredImage) await deferredImage;
    response = { original: "https://example.com/new-image.png" };
  } else if (config.url === "/admin/blog/tags") {
    if (config.method === "post") {
      const tag = { id: 3, name: data.name, slug: "new-tag", postCount: 0 };
      tags.push(tag);
      response = tag;
    } else response = [...tags];
  } else if (/\/admin\/blog\/tags\/\d+$/.test(config.url)) {
    const id = Number(config.url.split("/").pop());
    if (config.method === "delete") tags = tags.filter((tag) => tag.id !== id);
    if (config.method === "put")
      tags = tags.map((tag) =>
        tag.id === id ? { ...tag, name: data.name, slug: "renamed" } : tag,
      );
    response = tags.find((tag) => tag.id === id);
  } else if (config.url.startsWith("/admin/users?")) {
    const page = Number(
      new URL(config.url, "http://localhost").searchParams.get("page"),
    );
    response = {
      content: [
        {
          id: page + 1,
          name: `User ${page + 1}`,
          email: `user${page + 1}@test.local`,
          roles: ["USER"],
        },
      ],
      number: page,
      totalPages: 2,
      totalElements: 21,
    };
  } else if (config.url.startsWith("/admin/blog/posts?"))
    response = { content: [post], totalPages: 1, totalElements: 1, number: 0 };
  else if (config.url === "/admin/blog/posts/12") response = post;
  else if (config.url === "/admin/blog/posts") response = { ...post, ...data };
  return { data: response, status: 200, statusText: "OK", headers: {}, config };
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
  if (root) {
    await React.act(async () => {
      root.unmount();
      await flush();
    });
    root = null;
  }
  requests = [];
  failMutation = false;
  usageStatus = 200;
  usageOverride = undefined;
  deferredUsage = undefined;
  deferredImage = undefined;
  navigated = undefined;
  tags = [
    { id: 1, name: "test", slug: "test", postCount: 0 },
    { id: 2, name: "Health", slug: "health", postCount: 7 },
  ];
  document.body.innerHTML = '<div id="root"></div>';
  localStorage.clear();
});

test("tag count is displayed as supplied, delete explains attachments and cancellation does not write", async () => {
  await mount(Tags);
  const rows = [...document.querySelectorAll("tbody tr")];
  assert.match(rows[0].textContent, /testtest0/);
  let confirmation;
  window.confirm = (message) => {
    confirmation = message;
    return false;
  };
  await click(
    [...rows[1].querySelectorAll("button")].find(
      (el) => el.textContent === "Delete",
    ),
  );
  assert.match(confirmation, /7 posts are attached/);
  assert.equal(requests.filter((r) => r.method === "delete").length, 0);
  window.confirm = () => true;
  await click(
    [...rows[1].querySelectorAll("button")].find(
      (el) => el.textContent === "Delete",
    ),
  );
  assert.ok(
    requests.some(
      (r) => r.url === "/admin/blog/tags/2" && r.method === "delete",
    ),
  );
  assert.equal(document.querySelectorAll("tbody tr").length, 1);
});

test("tag rename uses admin PUT, validates whitespace, preserves edits on API failure and retries", async () => {
  localStorage.setItem("token", "fixture");
  await mount(Tags);
  await click(button("Rename"));
  await change(document.getElementById("field-name"), "   ");
  await submit();
  assert.match(document.body.textContent, /Name is required/);
  assert.ok(!requests.some((r) => r.method === "put"));
  await change(document.getElementById("field-name"), "Better name");
  failMutation = true;
  await submit();
  assert.match(document.body.textContent, /This name is already used/);
  assert.equal(document.getElementById("field-name").value, "Better name");
  failMutation = false;
  await submit();
  assert.equal(document.querySelector("form"), null);
  const write = requests.find((r) => r.method === "put");
  assert.equal(write.url, "/admin/blog/tags/1");
  assert.deepEqual(write.data, { name: "Better name" });
  assert.equal(write.auth, "Bearer fixture");
});

test("tag create uses the admin endpoint", async () => {
  await mount(Tags);
  await click(button("New tag"));
  await change(document.getElementById("field-name"), "New topic");
  await submit();
  assert.ok(
    requests.some(
      (r) =>
        r.url === "/admin/blog/tags" &&
        r.method === "post" &&
        r.data.name === "New topic",
    ),
  );
  assert.match(document.body.textContent, /New topic/);
});

test("user pagination loads the next server page and role form sends only the supported role", async () => {
  await mount(Users);
  await click(button("Next"));
  assert.match(document.body.textContent, /User 2/);
  await click(button("Edit role"));
  await change(document.getElementById("field-role"), "ADMIN");
  await submit();
  assert.ok(
    requests.some(
      (r) =>
        r.method === "put" &&
        r.url === "/admin/users/2/role" &&
        r.data.role === "ADMIN",
    ),
  );
  assert.ok(!document.body.textContent.includes("Activate"));
});

test("posts bulk delete calls the backend after count confirmation", async () => {
  await mount(Posts);
  await click(button("Select this page"));
  let confirmation;
  window.confirm = (text) => {
    confirmation = text;
    return true;
  };
  await click(button("Delete selected (1)"));
  assert.match(confirmation, /Delete 1 selected posts/);
  assert.ok(
    requests.some(
      (r) =>
        r.url === "/admin/blog/posts/bulk-delete" &&
        r.method === "post" &&
        r.data.ids[0] === 12,
    ),
  );
});

test("editing a post preserves language, HTML and draft state and sends tagNames, never ignored tag IDs or slug", async () => {
  await mount(Editor, { id: 12 });
  await submit();
  const write = requests.find((r) => r.method === "put");
  assert.deepEqual(write.data, {
    title: post.title,
    summary: post.summary,
    content: post.content,
    featuredImage: post.featuredImage,
    tagNames: ["Health"],
    published: false,
    language: "tr",
  });
  assert.equal(navigated, "/admin/posts");
});

test("usage formatting preserves fractional-cent averages and handles zero calls", () => {
  assert.equal(usd(0.0069), "$0.01");
  assert.equal(costPerCall(0.0069, 122), "$0.000057");
  assert.equal(costPerCall(0.0000001, 100), "< $0.000001");
  assert.equal(costPerCall(0, 0), "-");
  assert.throws(
    () => validateUsage({ ...payload, totals: { calls: 3, tokens: 2 } }),
    /incomplete/,
  );
  assert.throws(
    () => validateUsage({ ...payload, spentTodayUsd: NaN }),
    /incomplete/,
  );
});

test("usage renders contract totals, daily data and per-model cost, and changes the requested period", async () => {
  await mount(Usage);
  assert.match(document.body.textContent, /\$0\.01/);
  assert.match(document.body.textContent, /\$25\.00/);
  assert.match(document.body.textContent, /48,213/);
  assert.match(document.body.textContent, /o3/);
  assert.match(document.body.textContent, /2026-09-07/);
  assert.match(document.body.textContent, /\$0\.017034/);
  await change(document.querySelector("select"), "7");
  assert.equal(requests.at(-1).params.days, 7);
});

test("usage warns on an exact ceiling hit and an exceeded ceiling", async () => {
  usageOverride = { ...payload, spentTodayUsd: 25 };
  await mount(Usage);
  assert.match(
    document.querySelector('[role="alert"]').textContent,
    /Daily ceiling reached/,
  );
  usageOverride = { ...payload, spentTodayUsd: 27 };
  await click(button("Refresh"));
  assert.match(
    document.querySelector('[role="alert"]').textContent,
    /Daily ceiling reached/,
  );
  assert.equal(
    document.querySelector('[role="meter"]').getAttribute("aria-valuenow"),
    "25",
  );
});

test("usage failure never presents stale healthy totals, and retry recovers", async () => {
  await mount(Usage);
  usageStatus = 404;
  await click(button("Refresh"));
  assert.match(
    document.querySelector('[role="alert"]').textContent,
    /remaining budget are unknown/,
  );
  assert.ok(!document.body.textContent.includes("$25.00"));
  usageStatus = 200;
  await click(button("Try again"));
  assert.match(document.body.textContent, /\$25\.00/);
});

test("empty usage is explicit and does not divide by zero", async () => {
  usageOverride = {
    ...payload,
    totals: { calls: 0, tokens: 0, costUsd: 0 },
    daily: [],
    byModel: [],
  };
  await mount(Usage);
  assert.match(document.body.textContent, /No model usage recorded/);
  assert.match(document.body.textContent, /No daily usage recorded/);
  assert.ok(!/NaN|Infinity/.test(document.body.textContent));
});

test("resource loading ignores an obsolete request", async () => {
  let finishFirst;
  const first = () =>
    new Promise((resolve) => {
      finishFirst = resolve;
    });
  const second = async () => "Latest";
  function Probe({ fetcher }) {
    const state = useResource(fetcher);
    return React.createElement("p", null, state.data);
  }
  await mount(Probe, { fetcher: first });
  await React.act(async () => {
    root.render(React.createElement(Probe, { fetcher: second }));
    await flush();
  });
  await React.act(async () => {
    finishFirst("Obsolete");
    await flush();
  });
  assert.equal(document.body.textContent, "Latest");
});

test("post validation rejects empty rich text and saving remains blocked during image upload", async () => {
  await mount(Editor, { id: 12 });
  await change(document.getElementById("field-content"), "<p>&nbsp;</p>");
  await submit();
  assert.match(document.body.textContent, /Write the post content/);
  assert.ok(!requests.some((r) => r.method === "put"));
  await change(document.getElementById("field-content"), post.content);
  let complete;
  deferredImage = new Promise((resolve) => {
    complete = resolve;
  });
  const fileInput = document.querySelector('input[type="file"]');
  Object.defineProperty(fileInput, "files", {
    value: [new File(["image"], "image.png", { type: "image/png" })],
    configurable: true,
  });
  await React.act(async () => {
    fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    await flush();
  });
  assert.equal(button("Save changes").disabled, true);
  await submit();
  assert.ok(!requests.some((r) => r.method === "put"));
  await React.act(async () => {
    complete();
    await flush();
  });
  assert.equal(button("Save changes").disabled, false);
  await submit();
  assert.equal(
    requests.find((r) => r.method === "put").data.featuredImage,
    "https://example.com/new-image.png",
  );
});

test("new post sends an explicit published flag and selected content language", async () => {
  await mount(Editor);
  await change(document.getElementById("field-title"), "A new article");
  await change(
    document.getElementById("field-summary"),
    "A complete summary for this article.",
  );
  await change(
    document.getElementById("field-content"),
    "<p>Complete article text.</p>",
  );
  await change(
    document.getElementById("field-featuredImage"),
    "https://example.com/article.png",
  );
  await change(document.getElementById("field-language"), "en");
  await click(document.getElementById("field-published"));
  await submit();
  const request = requests.find(
    (r) => r.method === "post" && r.url === "/admin/blog/posts",
  );
  assert.equal(request.data.published, true);
  assert.equal(request.data.language, "en");
  assert.deepEqual(request.data.tagNames, []);
});
