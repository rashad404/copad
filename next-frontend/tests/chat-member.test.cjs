const { test, afterEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const { JSDOM } = require("jsdom");
const dom = new JSDOM('<div id="root"></div>', {
  url: "http://localhost/chat",
  pretendToBeVisual: true,
});
for (const k of [
  "window",
  "document",
  "HTMLElement",
  "HTMLTextAreaElement",
  "Node",
  "Event",
  "localStorage",
  "sessionStorage",
  "MutationObserver",
])
  global[k] = dom.window[k];
global.self = dom.window;
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
global.IS_REACT_ACT_ENVIRONMENT = true;
const React = require("react"),
  { createRoot } = require("react-dom/client");
let auth = { user: { id: "73" }, isAuthenticated: true, isLoading: false },
  language = "en",
  requests = [],
  familyFailure = false,
  newChatFails = false;
let responseHeaders = {};
const families = [
  {
    id: 1,
    name: "Family",
    role: "VIEWER",
    members: [
      { id: 1, fullName: "Ayan", relationship: "CHILD" },
      { id: 2, fullName: "Leyla", relationship: "SELF" },
    ],
  },
];
const origLoad = Module._load,
  origResolve = Module._resolveFilename;
const translation = { t: (k) => k, i18n: { language: "az" } };
Module._resolveFilename = function (r, p, ...a) {
  return origResolve.call(
    this,
    r.startsWith("@/") ? path.join(__dirname, "../src", r.slice(2)) : r,
    p,
    ...a,
  );
};
Module._load = function (r, p, ...a) {
  if (r === "@/context/AuthContext") return { useAuth: () => auth };
  if (
    r === "@/components/public/ProductLayout" ||
    r === "./public/ProductLayout"
  )
    return { usePublicCopy: () => (en, az) => (language === "az" ? az : en) };
  if (r === "react-i18next") return { useTranslation: () => translation };
  if (r === "@/i18n") return { __esModule: true, default: { language: "az" } };
  if (r === "@/utils/analytics") return { track: () => {} };
  if (r === "@/api/healthRecord")
    return {
      healthApi: {
        families: async () => {
          if (familyFailure) throw Error("offline");
          return families;
        },
      },
    };
  if (r === "@/utils/resolveGuestSession")
    return {
      resolveGuestSession: async () => ({
        sessionId: "session",
        isNew: false,
        data: {
          data: {
            chats: [
              {
                id: "chat",
                title: "Test chat",
                timestamp: new Date().toISOString(),
                messages: [],
              },
            ],
          },
        },
      }),
    };
  if (r === "@/utils/guestSession")
    return { getGuestSessionId: () => null, setGuestSessionId: () => {} };
  if (r === "@/api")
    return {
      __esModule: true,
      default: {
        post: async () => {
          if (newChatFails) throw Error("offline");
          return { data: { chatId: "new-chat" } };
        },
        put: async () => ({}),
        get: async () => ({ data: { chats: [] } }),
      },
    };
  if (["./ChatSidebar", "./FileAttachmentPreview"].includes(r))
    return { __esModule: true, default: () => null };
  if (r === "./MultiFileUpload") return { MultiFileUpload: () => null };
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
const api = require("../src/api/axios.ts").default;
api.defaults.adapter = async (config) => {
  requests.push(config);
  return {
    data: "Test answer",
    status: 200,
    statusText: "OK",
    headers: responseHeaders,
    config,
  };
};
const { ChatProvider, useChat } = require("../src/context/ChatContext.tsx");
const GuestChat = require("../src/components/GuestChat.tsx").default;
let root, chat;
function Probe() {
  chat = useChat();
  return React.createElement(GuestChat);
}
async function flush(fn = () => {}) {
  await React.act(async () => {
    await fn();
    await new Promise((r) => setTimeout(r, 10));
  });
}
async function mount() {
  root = createRoot(document.querySelector("#root"));
  await flush(() =>
    root.render(
      React.createElement(ChatProvider, null, React.createElement(Probe)),
    ),
  );
  await flush();
}
async function submit(text) {
  await flush(() => {
    const el = document.querySelector("textarea");
    Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    ).set.call(el, text);
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await flush(() =>
    document
      .querySelector("form")
      .dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })),
  );
}
afterEach(async () => {
  if (root) await flush(() => root.unmount());
  root = null;
  localStorage.clear();
  sessionStorage.clear();
  responseHeaders = {};
  requests = [];
  familyFailure = false;
  newChatFails = false;
  language = "en";
  auth = { user: { id: "73" }, isAuthenticated: true, isLoading: false };
});
test("UI sends selected health member, JWT, language and query specialty; notice appears once", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  localStorage.setItem("token", "test-token");
  await mount();
  assert.equal(document.querySelector("#chat-member").value, "1");
  assert.match(document.body.textContent, /About Ayan/);
  await submit("Ear pain");
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "/guest/chat/session/chat");
  assert.equal(requests[0].params.memberId, 1);
  assert.equal(requests[0].params.specialty, "general");
  assert.equal(requests[0].headers.Authorization, "Bearer test-token");
  assert.equal(JSON.parse(requests[0].data).language, "az");
  assert.equal(document.querySelectorAll(".public-composer-note").length, 1);
  assert.match(
    document.querySelector(".public-composer-note").textContent,
    /Emergency: 103/,
  );
});
test("AZ notice and no selected member omit memberId", async () => {
  language = "az";
  await mount();
  await submit("Question");
  assert.ok(!("memberId" in requests[0].params));
  assert.equal(
    document.querySelector(".public-composer-note").textContent,
    "Yalnız məlumat üçündür. Həkimi əvəz etmir - vacib məsələləri həkiminizlə dəqiqləşdirin. Təcili hallarda 103.",
  );
});
test("signed-out and loading-auth callers cannot attach a member even through context", async () => {
  auth = { user: null, isAuthenticated: false, isLoading: false };
  await mount();
  assert.equal(document.querySelector("#chat-member"), null);
  await flush(() => chat.sendMessage("chat", "Question", ["file-1"], [], 1));
  assert.ok(!("memberId" in requests[0].params));
  assert.deepEqual(JSON.parse(requests[0].data).fileIds, ["file-1"]);
  auth = { user: { id: "73" }, isAuthenticated: true, isLoading: true };
  await flush(() =>
    root.render(
      React.createElement(ChatProvider, null, React.createElement(Probe)),
    ),
  );
  await flush(() => chat.sendMessage("chat", "Question", [], [], 1));
  assert.ok(!("memberId" in requests[1].params));
});
test("inaccessible stored member never attaches a member", async () => {
  localStorage.setItem("azdoc.member.73", "999");
  await mount();
  await submit("Question");
  assert.ok(!("memberId" in requests[0].params));
  assert.equal(document.querySelector("#chat-member").value, "");
});
test("switching a member after sending starts fresh and persists selection", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  await submit("First question");
  await flush(() => {
    const select = document.querySelector("#chat-member");
    select.value = "2";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  assert.equal(chat.selectedChatId, "new-chat");
  assert.equal(localStorage.getItem("azdoc.member.73"), "2");
  assert.match(document.body.textContent, /About Leyla/);
  await submit("Second question");
  assert.equal(requests[1].url, "/guest/chat/session/new-chat");
  assert.equal(requests[1].params.memberId, 2);
});
test("failed family load offers retry without attaching saved member", async () => {
  familyFailure = true;
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  assert.match(document.body.textContent, /Reload members/);
  await submit("Question");
  assert.ok(!("memberId" in requests[0].params));
  familyFailure = false;
  await flush(() =>
    document.querySelector(".public-chat-member button").click(),
  );
  assert.equal(document.querySelector("#chat-member").value, "1");
});
test("failed fresh conversation preserves original member", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  await submit("First question");
  newChatFails = true;
  const old = console.error;
  console.error = () => {};
  try {
    await flush(() => {
      const select = document.querySelector("#chat-member");
      select.value = "2";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
  } finally {
    console.error = old;
  }
  assert.equal(document.querySelector("#chat-member").value, "1");
  assert.equal(localStorage.getItem("azdoc.member.73"), "1");
  assert.match(document.body.textContent, /Member unchanged/);
  assert.equal(chat.selectedChatId, "chat");
});
test("clearing the member starts an ungrounded conversation", async () => {
  localStorage.setItem("azdoc.member.73", "1");
  await mount();
  await submit("First question");
  await flush(() => {
    const select = document.querySelector("#chat-member");
    select.value = "";
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
  await submit("General question");
  assert.ok(!("memberId" in requests[1].params));
  assert.equal(localStorage.getItem("azdoc.member.73"), "");
});

test("urgent response shows a persistent banner across ordinary replies and reloads, scoped to chat", async () => {
  responseHeaders = { "X-Urgent": "true", "X-Urgent-Categories": "possible heart attack; trouble breathing", "X-Emergency-Number": "112" };
  await mount(); await submit("Urgent message");
  assert.equal(document.querySelector('.public-emergency-notice a').getAttribute('href'), 'tel:112');
  assert.equal(document.querySelectorAll('.public-emergency-notice').length, 1);
  responseHeaders = {}; await submit("Follow-up");
  assert.ok(document.querySelector('.public-emergency-notice'));
  await flush(() => root.unmount()); root = null; await mount();
  assert.ok(document.querySelector('.public-emergency-notice'));
  await flush(() => chat.createNewChat());
  assert.equal(document.querySelector('.public-emergency-notice'), null);
  await flush(() => chat.setSelectedChatId('chat'));
  assert.ok(document.querySelector('.public-emergency-notice'));
});
test("ordinary responses have no emergency banner; urgent AZ response shows supplied number", async () => {
  language = 'az'; await mount(); await submit('Ordinary message');
  assert.equal(document.querySelector('.public-emergency-notice'), null);
  responseHeaders = { 'x-urgent': 'true', 'x-emergency-number': '103', 'x-urgent-categories': 'trouble breathing' };
  await submit('Urgent message');
  assert.match(document.querySelector('.public-emergency-notice').textContent, /Təcili tibbi yardım/);
  assert.equal(document.querySelector('.public-emergency-notice a').getAttribute('href'), 'tel:103');
  assert.equal(document.querySelector('.public-emergency-notice button'), null);
});
