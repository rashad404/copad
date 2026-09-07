const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const root = path.join(__dirname, "../src");
const resolve = Module._resolveFilename;
Module._resolveFilename = function (r, p, ...a) {
  return resolve.call(
    this,
    r.startsWith("@/") ? path.join(root, r.slice(2)) : r,
    p,
    ...a,
  );
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
const az = require("../src/translations/az.json"),
  ru = require("../src/translations/ru.json"),
  publicRu = require("../src/translations/public.ru.json");
function flat(value, prefix = "") {
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, value]) =>
      typeof value === "object"
        ? Object.entries(flat(value, prefix + key + "."))
        : [[prefix + key, value]],
    ),
  );
}
test("Russian covers every Azerbaijani resource key and preserves interpolation variables", () => {
  const A = flat(az),
    R = flat(ru);
  for (const [key, value] of Object.entries(A)) {
    assert.equal(typeof R[key], "string", key);
    assert.ok(R[key].trim(), key);
    assert.deepEqual(
      [...R[key].matchAll(/{{(.*?)}}/g)].map((m) => m[1]).sort(),
      [...value.matchAll(/{{(.*?)}}/g)].map((m) => m[1]).sort(),
      key,
    );
  }
  for (const value of Object.values(R))
    assert.ok(
      !/[\u2013\u2014\u2018\u2019\u201c\u201d\u2026]/.test(value),
      value,
    );
});
test("homepage, navigation and auth have complete Russian dictionaries", () => {
  for (const folder of ["home", "navigation"]) {
    const data = require(`../src/components/${folder}/translations.json`);
    assert.deepEqual(Object.keys(data.ru).sort(), Object.keys(data.az).sort());
    for (const value of Object.values(data.ru)) assert.ok(value.trim());
  }
  const { authCopy } = require("../src/components/auth/copy.ts");
  assert.deepEqual(
    Object.keys(authCopy.ru).sort(),
    Object.keys(authCopy.az).sort(),
  );
});
test("public inline copy cannot silently fall back to English in Russian", () => {
  const missing = [];
  function visit(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) visit(full);
      else if (/\.(tsx|ts)$/.test(file)) {
        const source = ts.createSourceFile(
          full,
          fs.readFileSync(full, "utf8"),
          ts.ScriptTarget.Latest,
          true,
        );
        function walk(n) {
          if (
            ts.isCallExpression(n) &&
            n.expression.getText(source) === "c" &&
            n.arguments.length === 2 &&
            ts.isStringLiteral(n.arguments[0]) &&
            ts.isStringLiteral(n.arguments[1]) &&
            !publicRu[n.arguments[0].text]
          )
            missing.push(n.arguments[0].text);
          ts.forEachChild(n, walk);
        }
        walk(source);
      }
    }
  }
  visit(root);
  assert.deepEqual(missing, []);
});
test("Russian resolves registered patient text instead of English fallback; a visitor lands in Azerbaijani", async () => {
  const i18n = require("../src/i18n.ts").default;
  // Where a visitor lands, for an Azerbaijani service. English remains the
  // fallback for a missing key, which is a different question.
  assert.equal(i18n.options.lng, "az");
  assert.deepEqual(i18n.options.fallbackLng, ["en"]);
  await i18n.changeLanguage("ru-RU");
  assert.equal(i18n.resolvedLanguage, "ru");
  assert.equal(i18n.t("profile.medicalInfo.allergies"), "Аллергии");
  assert.equal(
    i18n.t("profile.medicalInfo.medications"),
    "Принимаемые лекарства",
  );
  assert.ok(
    !i18n
      .t("auth.login.secure_description", { agentName: "azdoc" })
      .includes("{{"),
  );
});
test("only AZ, EN and RU can be persisted as site languages", () => {
  const {
    SUPPORTED_LANGUAGES,
    supportedLanguage,
    DEFAULT_SITE_LANGUAGE,
  } = require("../src/utils/languages.ts");
  assert.deepEqual(SUPPORTED_LANGUAGES, ["az", "en", "ru"]);
  // The residual case only: a browser asking for a language we do not have.
  // A Russian or English browser is honoured before this is reached.
  assert.equal(DEFAULT_SITE_LANGUAGE, "az");
  for (const lang of ["tr", "es", "pt", "ar", "zh", "hi"])
    assert.equal(supportedLanguage(lang), undefined);
  assert.equal(supportedLanguage("ru-RU"), "ru");
  assert.equal(supportedLanguage("AZ-az"), "az");
  const { resolveBlogLanguage } = require("../src/utils/blogLanguage.ts");
  assert.equal(resolveBlogLanguage(undefined, "i18nextLng=ru"), "ru");
  assert.equal(resolveBlogLanguage(undefined, "i18nextLng=tr"), "az");
  assert.equal(resolveBlogLanguage(undefined, ""), "az");
});
test("catalogue translations preserve unknown prices and advisory medical wording", () => {
  const { medicineCopy } = require("../src/components/medicines/copy.ts");
  const mc = medicineCopy("ru");
  assert.equal(mc("qiymət yoxdur"), "цена не указана");
  assert.equal(
    mc("Təsiredici maddə qeyd edilməyib"),
    "Действующее вещество не указано",
  );
  assert.match(mc("Ciddi allergiya - həyati təhlükə riski"), /угроза жизни/);
  const messages = require("../src/translations/medicines.json");
  assert.ok(
    Object.values(messages).some((m) =>
      m.ru.includes("не заменяет оценку врача или фармацевта"),
    ),
  );
});
