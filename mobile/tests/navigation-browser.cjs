const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { installFixtures } = require("./browser-fixtures.cjs");
const visible = (page, text) =>
  page
    .getByText(text, { exact: true })
    .and(page.locator(':not([aria-hidden="true"] *)'))
    .filter({ visible: true });
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE || undefined,
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(() => {
    sessionStorage.setItem("auth_token", "test-only-token");
    localStorage.setItem("azdoc.member.fixture", "11");
    localStorage.setItem("i18nextLng", "en");
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await installFixtures(page);
  const tab = (name) => page.getByRole("tab", { name, exact: true });
  async function shell() {
    const brand = visible(page, "azdoc");
    await brand.waitFor();
    const top = await brand.boundingBox();
    assert.ok(top.y >= 0 && top.y < 110, "Brand stays at the top");
    for (const name of ["Home", "Chat", "Records", "Services", "Account"]) {
      await tab(name).waitFor();
      const box = await tab(name).boundingBox();
      assert.ok(
        box.y >= 740 && box.y + box.height <= 845,
        "Tab stays at the bottom",
      );
    }
  }
  try {
    await page.goto("http://127.0.0.1:3003", { waitUntil: "networkidle" });
    await tab("Services").click();
    await page.getByRole("button", { name: "Medicines", exact: true }).click();
    const search = page.getByRole("textbox", {
      name: "Search by name",
      exact: true,
    });
    await search.fill("test medicine");
    await shell();
    await tab("Account").click();
    await page
      .getByRole("button", { name: "Personal information", exact: true })
      .click();
    await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
    await shell();
    await tab("Services").click();
    assert.equal(await search.inputValue(), "test medicine");
    await page
      .getByRole("button", { name: "View details", exact: true })
      .click();
    await page
      .getByText(/This is advisory and does not replace a doctor or pharmacist/)
      .filter({ visible: true })
      .waitFor();
    await shell();
    await tab("Account").click();
    await page.getByRole("button", { name: "Edit", exact: true }).waitFor();
    await tab("Services").click();
    await page
      .getByText(/This is advisory and does not replace a doctor or pharmacist/)
      .filter({ visible: true })
      .waitFor();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    assert.equal(await search.inputValue(), "test medicine");
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await page
      .getByRole("button", { name: "Laboratories", exact: true })
      .click();
    await shell();
    await page
      .getByRole("button", { name: "View details", exact: true })
      .click();
    await visible(page, "Test laboratoriyası").waitFor();
    await shell();
    const before = await visible(page, "azdoc").boundingBox();
    await page.mouse.move(220, 570);
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(300);
    const after = await visible(page, "azdoc").boundingBox();
    assert.equal(after.y, before.y);
    await shell();
    await page.screenshot({
      path: "/tmp/azdoc-mobile-persistent-navigation.png",
    });
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await page.getByRole("button", { name: "Doctors", exact: true }).click();
    await page
      .getByRole("button", { name: "View details", exact: true })
      .click();
    await page
      .getByText("Listing unconfirmed", { exact: false })
      .filter({ visible: true })
      .waitFor();
    await shell();
    assert.deepEqual(errors, []);
    console.log(
      "PASS: persistent brand and five tabs, independent tab history, preserved search, back navigation and pinned chrome while scrolling.",
    );
  } catch (error) {
    await page.screenshot({ path: "/tmp/azdoc-navigation-failure.png" });
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
