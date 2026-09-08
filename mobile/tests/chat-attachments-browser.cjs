const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const { installFixtures } = require("./browser-fixtures.cjs");
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.BROWSER_EXECUTABLE,
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  await context.addInitScript(() => localStorage.setItem("i18nextLng", "en"));
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const calls = await installFixtures(page);
  let categorySeen = false;
  await page.route(/\/(?:api|dev-api)\/v2\/messages\//, async (route) => {
    const req = route.request(),
      path = new URL(req.url()).pathname;
    if (path.endsWith("/files/batch")) {
      assert.equal(req.headers()["x-guest-session-id"], "fixture-session");
      assert.match(req.postData(), /name="category"/);
      categorySeen = true;
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ batchId: "batch-1" }),
      });
    }
    if (path.endsWith("/status"))
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ status: "partial", progressPercentage: 100 }),
      });
    if (path.endsWith("/files"))
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify([
          {
            fileId: "file-1",
            filename: "first.txt",
            fileType: "text/plain",
            fileSize: 7,
          },
        ]),
      });
    throw Error("Unhandled attachment fixture");
  });
  try {
    await page.goto("http://127.0.0.1:3003", { waitUntil: "networkidle" });
    await page.getByRole("tab", { name: "Chat", exact: true }).click();
    await page
      .getByRole("button", { name: "Attach file", exact: true })
      .click();
    const chosen = page.waitForEvent("filechooser");
    await page
      .getByRole("button", { name: "Choose files", exact: true })
      .click();
    await (
      await chosen
    ).setFiles([
      {
        name: "first.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("example"),
      },
      {
        name: "second.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("example"),
      },
    ]);
    await page
      .getByRole("button", { name: "Upload files", exact: true })
      .click();
    await page.getByText(/1 of 2 files attached/).waitFor();
    assert.ok(categorySeen);
    await page.getByRole("button", { name: "Done", exact: true }).click();
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.getByText("first.txt - 7 B", { exact: true }).waitFor();
    const sent = calls.find(
      (c) => c.path.includes("/guest/chat/") && c.method === "POST",
    );
    assert.deepEqual(sent.body.fileIds, ["file-1"]);
    assert.equal(sent.body.message, "");
    assert.equal(sent.query.memberId, undefined);
    console.log(
      "PASS: categorized multiple attachments, partial result disclosure, file-only message and retained sent-file details",
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
