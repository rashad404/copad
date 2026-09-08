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
  await context.addInitScript(() => {
    sessionStorage.setItem("auth_token", "test-only-token");
    localStorage.setItem("i18nextLng", "en");
    localStorage.setItem("azdoc.member.fixture", "11");
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await installFixtures(page);
  const calls = [];
  let listing = null;
  let hours = [];
  let away = [];
  const tag = { id: 5, name: "Test topic", slug: "test-topic" };
  const post = {
    id: 1,
    slug: "test-article",
    title: "Test article",
    summary: "<p>A useful introduction.</p>",
    content:
      '<h2>Reading your report</h2><p>This is <strong>sample text</strong>.</p><ul><li>First point</li><li>Second point</li></ul><p><a href="/dermanlar">Medicine catalogue</a></p>',
    author: { name: "Test author" },
    publishedAt: "2026-09-08T12:00:00",
    readingTimeMinutes: 3,
    tags: [tag],
    featuredImage: null,
  };
  await page.route(
    /\/(?:api|dev-api)\/(?:blog|tags|doctor\/|members\/11\/documents\/1\/content)/,
    async (route) => {
      const req = route.request(),
        url = new URL(req.url()),
        p = url.pathname.replace(/^\/(?:api|dev-api)/, "");
      let body;
      try {
        body = req.postDataJSON();
      } catch {}
      calls.push({ p, method: req.method(), body, headers: req.headers() });
      let data;
      if (p === "/blog" || p === "/blog/search" || p === "/blog/tag/test-topic")
        data = { content: [post], totalPages: 1, totalElements: 1, number: 0 };
      else if (p === "/blog/test-article") data = post;
      else if (p === "/tags/top") data = [tag];
      else if (p === "/tags/test-topic") data = tag;
      else if (p === "/doctor/me") {
        if (req.method() === "PUT") listing = { ...listing, ...body };
        data = listing;
      } else if (p === "/doctor/claim") {
        listing = {
          id: 4,
          slug: "fixture-doctor",
          fullName: "Test Doctor",
          verification: "PENDING",
          acceptsBookings: false,
          bio: "",
          qualifications: "",
          consultationFee: null,
          languages: ["az"],
        };
        data = listing;
      } else if (p === "/doctor/me/availability") {
        if (req.method() === "POST") hours.push({ ...body, id: 1 });
        data = hours;
      } else if (p === "/doctor/me/availability/1") {
        hours = [];
        data = {};
      } else if (p === "/doctor/me/time-off") {
        if (req.method() === "POST") away.push({ ...body, id: 1 });
        data = away;
      } else if (p === "/doctor/me/bookings") data = [];
      else if (p.endsWith("/content"))
        return route.fulfill({
          contentType: "image/png",
          body: Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
            "base64",
          ),
        });
      else throw Error("Unhandled parity fixture " + p);
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify(data),
      });
    },
  );
  const tab = (n) => page.getByRole("tab", { name: n, exact: true }),
    button = (n) => page.getByRole("button", { name: n, exact: true }),
    text = (n) => page.getByText(n, { exact: true }).filter({ visible: true });
  try {
    await page.goto("http://127.0.0.1:3003", { waitUntil: "networkidle" });
    await tab("Account").click();
    await button("Articles").click();
    await button("Test article").click();
    await text("Reading your report").waitFor();
    await text("First point").waitFor();
    await text("Test author - 8 Sept 2026 - 3 min read").count();
    await page.getByText("Medicine catalogue", { exact: true }).click();
    await text("Search examples").waitFor();
    await tab("Account").waitFor();
    await button("Back").click();
    await button("Test topic").click();
    await page
      .getByRole("heading", { name: "Test topic", exact: true })
      .waitFor();
    assert.ok(calls.some((c) => c.p === "/blog/tag/test-topic"));
    await button("Back").click();
    await button("Back").click();
    await button("Back").click();
    await button("Doctor panel").click();
    await text("This account has no doctor profile").waitFor();
    await page
      .getByRole("textbox", { name: "Search by name", exact: true })
      .fill("Test Doctor");
    await button("Search").click();
    await button("This is me").click();
    await page
      .getByRole("textbox", {
        name: "Something that shows this is you",
        exact: true,
      })
      .fill("Synthetic claim evidence");
    await button("Send claim").click();
    await text("Claim under review").waitFor();
    assert.equal(calls.find((c) => c.p === "/doctor/claim").body.doctorId, 4);
    await page
      .getByRole("textbox", { name: "About you", exact: true })
      .fill("Updated test biography");
    await button("Save").click();
    await text("Saved").waitFor();
    assert.equal(
      calls.find((c) => c.p === "/doctor/me" && c.method === "PUT").body.bio,
      "Updated test biography",
    );
    assert.equal(
      calls.find((c) => c.p === "/doctor/me" && c.method === "PUT").body
        .verification,
      undefined,
    );
    // Working hours, with separate time-off action. No implicit bookings toggle.
    await button("Add").first().click();
    await text("09:00 - 13:00, 20 min").waitFor();
    assert.equal(
      calls.find(
        (c) => c.p === "/doctor/me/availability" && c.method === "POST",
      ).body.dayOfWeek,
      1,
    );
    await tab("Records").click();
    await tab("Documents").click();
    await button("View document").click();
    await page.getByRole("img").filter({ visible: true }).waitFor();
    assert.equal(
      calls.find((c) => c.p.endsWith("/documents/1/content")).headers
        .authorization,
      "Bearer test-only-token",
    );
    await tab("Account").waitFor();
    assert.deepEqual(errors, []);
    console.log(
      "PASS: native articles and internal links, tag discovery, doctor claim under review, profile editing, schedule creation, authenticated inline document viewer",
    );
  } catch (e) {
    await page.screenshot({ path: "/tmp/azdoc-native-pages-failure.png" });
    throw e;
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
