import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const source = readFileSync(
  new URL("../src/utils/resolveGuestSession.ts", import.meta.url),
  "utf8",
);
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { resolveGuestSession } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);

function setup(load, start = async () => "new-session") {
  const persisted = [];
  let starts = 0;
  return {
    persisted,
    starts: () => starts,
    deps: {
      load,
      start: () => {
        starts++;
        return start();
      },
      persist: (id) => persisted.push(id),
      isMissing: (error) => error.status === 404,
    },
  };
}

test("retains a valid saved session and its conversations", async () => {
  const data = { chats: [{ id: "existing-chat" }] };
  const state = setup(async () => data);
  assert.deepEqual(await resolveGuestSession("saved-session", state.deps), {
    sessionId: "saved-session",
    data,
    isNew: false,
  });
  assert.equal(state.starts(), 0);
  assert.deepEqual(state.persisted, []);
});

test("replaces a missing session before creating its first chat", async () => {
  const state = setup(async () => {
    throw { status: 404 };
  });
  assert.deepEqual(await resolveGuestSession("expired-session", state.deps), {
    sessionId: "new-session",
    data: null,
    isNew: true,
  });
  assert.equal(state.starts(), 1);
  assert.deepEqual(state.persisted, ["new-session"]);
});

for (const status of [undefined, 401, 403, 429, 500]) {
  test(`does not replace saved conversations on ${status ?? "network"} failure`, async () => {
    const error = { status };
    const state = setup(async () => {
      throw error;
    });
    await assert.rejects(
      resolveGuestSession("saved-session", state.deps),
      (e) => e === error,
    );
    assert.equal(state.starts(), 0);
    assert.deepEqual(state.persisted, []);
  });
}

test("starts and persists a session for a first-time visitor", async () => {
  const state = setup(async () => {
    throw new Error("Unexpected load");
  });
  const result = await resolveGuestSession(null, state.deps);
  assert.equal(result.sessionId, "new-session");
  assert.deepEqual(state.persisted, ["new-session"]);
});

test("does not overwrite storage if replacement creation fails", async () => {
  const state = setup(
    async () => {
      throw { status: 404 };
    },
    async () => {
      throw new Error("Offline");
    },
  );
  await assert.rejects(
    resolveGuestSession("saved-session", state.deps),
    /Offline/,
  );
  assert.deepEqual(state.persisted, []);
});

test("rejects an empty new session ID without overwriting storage", async () => {
  const state = setup(
    async () => null,
    async () => "",
  );
  await assert.rejects(
    resolveGuestSession(null, state.deps),
    /could not be created/,
  );
  assert.deepEqual(state.persisted, []);
});
