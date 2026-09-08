const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { installFixtures } = require("./browser-fixtures.cjs");
const medicines = require("../src/copy/website/medicines.json");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE,
    headless: true,
  });
  try {
    for (const lang of ["az", "en", "ru"]) {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
      });
      await context.addInitScript((lang) => {
        localStorage.setItem("i18nextLng", lang);
      }, lang);
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const calls = await installFixtures(page);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("http://127.0.0.1:3003", { waitUntil: "networkidle" });
      const w = (key) => (lang === "az" ? key : medicines[key][lang]);
      await page
        .getByRole("tab", {
          name: { az: "Xidmətlər", en: "Services", ru: "Услуги" }[lang],
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: { az: "Dərmanlar", en: "Medicines", ru: "Лекарства" }[lang],
          exact: true,
        })
        .click();
      await page.getByText(w("Axtarış nümunələri"), { exact: true }).waitFor();
      assert.equal(
        calls.filter((c) => c.path === "/medicines").length,
        0,
        "Opening medicines must not search an empty query",
      );
      for (const name of [
        "Parasetamol",
        "İbuprofen",
        "Diklofenak",
        "Amoksisillin",
        "Azitromisin",
        "Omeprazol",
        "Pantoprazol",
        "Amlodipin",
        "Metformin",
        "Loratadin",
        "Setirizin",
        "Rosuvastatin",
      ])
        assert.equal(
          await page.getByRole("button", { name, exact: true }).count(),
          1,
        );
      const input = page.getByRole("textbox", {
        name: w("Dərman və ya təsiredici maddə"),
        exact: true,
      });
      await input.fill("İ");
      await page.getByRole("button", { name: w("Axtar"), exact: true }).click();
      assert.equal(
        calls.filter((c) => c.path === "/medicines").length,
        0,
        "A one-letter query is guidance, not empty results",
      );
      await page
        .getByRole("button", { name: "İbuprofen", exact: true })
        .click();
      await page
        .getByRole("button", { name: "Test medicine", exact: true })
        .waitFor();
      assert.equal(
        calls.find((c) => c.path === "/medicines").query.q,
        "İbuprofen",
      );
      assert.equal(
        calls.find((c) => c.path === "/medicines").query.limit,
        "50",
      );
      await page
        .getByRole("button", { name: "Test medicine", exact: true })
        .click();
      await page.getByText("Fixture manufacturer", { exact: true }).waitFor();
      await page
        .getByText(
          w(
            "Qablaşdırma qiyməti fərqidir; eyni doza üzrə hesablanmış qənaət deyil.",
          ),
          { exact: true },
        )
        .waitFor();
      assert.equal(
        calls.filter((c) => c.path.endsWith("/allergy-check")).length,
        0,
        "No private allergy checks signed out",
      );
      await page.screenshot({ path: `/tmp/azdoc-parity-medicine-${lang}.png` });
      await page
        .getByRole("tab", {
          name: { az: "Hesab", en: "Account", ru: "Аккаунт" }[lang],
          exact: true,
        })
        .click();
      await page
        .getByRole("button", {
          name: {
            az: "Məxfilik siyasəti",
            en: "Privacy policy",
            ru: "Политика конфиденциальности",
          }[lang],
          exact: true,
        })
        .click();
      const dict = require(`../src/copy/website/${lang}.json`);
      await page
        .getByText(dict.privacy.transfer.title, { exact: true })
        .waitFor();
      await page
        .getByRole("tab", {
          name: { az: "Hesab", en: "Account", ru: "Аккаунт" }[lang],
          exact: true,
        })
        .waitFor();
      assert.deepEqual(errors, []);
      await context.close();
      console.log(
        `PASS ${lang}: search-first medicines, all examples, unchanged dotted I, 50 results, full comparison and native privacy page`,
      );
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
