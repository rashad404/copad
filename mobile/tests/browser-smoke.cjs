const { chromium } = require("playwright");
const { installFixtures } = require("./browser-fixtures.cjs");
const assert = require("node:assert/strict");
const visibleText = (page, text, options) =>
  page.getByText(text, options).filter({ visible: true });
let currentPage;
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
    localStorage.setItem("i18nextLng", "az");
  });
  const page = await context.newPage();
  currentPage = page;
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const calls = await installFixtures(page);
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3003", {
    waitUntil: "networkidle",
    timeout: 90000,
  });

  await visibleText(page, "Qeydlər", { exact: true }).click();
  await visibleText(page, "66.1 lb", { exact: true }).waitFor();
  assert.match(await page.locator("body").innerText(), /Penicillin/);
  await page
    .getByRole("tab", { name: "Analiz nəticələri", exact: true })
    .click();
  await visibleText(page, "Yoxlama gözləyir: 9.4 g/dL", {
    exact: true,
  }).waitFor();
  await page
    .getByRole("button", { name: "Qəbul etməzdən əvvəl düzəlt", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Rəqəmlə nəticə", exact: true })
    .fill("9.8");
  await page.getByRole("button", { name: "Yadda saxla", exact: true }).click();
  await visibleText(page, "Hemoqlobin: 9.8 g/dL", { exact: true }).waitFor();
  assert.equal(
    calls.find((r) => r.path.endsWith("/lab-results/20/confirm")).body.value,
    9.8,
  );
  await page
    .getByRole("button", { name: "Nəticəni əl ilə daxil et", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "Analizin adı *", exact: true })
    .fill("Test qualitative");
  await page
    .getByRole("textbox", { name: "Sözlə nəticə (məs. neqativ)", exact: true })
    .fill("neqativ");
  await page.getByRole("button", { name: "Yadda saxla", exact: true }).click();
  await visibleText(page, "Test qualitative: neqativ", {
    exact: true,
  }).waitFor();
  const manual = calls.find(
    (r) => r.method === "POST" && r.path.endsWith("/documents/lab-results"),
  );
  assert.equal(manual.body.valueText, "neqativ");
  assert.equal(manual.body.referenceLow, null);
  await page.screenshot({
    path: "/tmp/azdoc-mobile-records.png",
    fullPage: true,
  });
  await visibleText(page, "Söhbət", { exact: true }).click();
  await page
    .getByRole("textbox", { name: "Mesaj", exact: true })
    .fill("urgent test");
  await page.getByRole("button", { name: "Göndər", exact: true }).click();
  await visibleText(page, "Təcili tibbi yardım", { exact: true }).waitFor();
  assert.equal(
    calls.find((r) => r.method === "POST" && /^\/guest\/chat\//.test(r.path))
      .query.memberId,
    "11",
  );
  await page
    .getByRole("textbox", { name: "Mesaj", exact: true })
    .fill("ordinary test");
  await page.getByRole("button", { name: "Göndər", exact: true }).click();
  await page.getByRole("textbox", { name: "Mesaj", exact: true }).evaluate(
    (el) =>
      new Promise((resolve) => {
        const timer = setInterval(() => {
          if (el.value === "") {
            clearInterval(timer);
            resolve();
          }
        }, 50);
      }),
  );
  await visibleText(page, "Təcili tibbi yardım", { exact: true }).waitFor();
  await page.screenshot({ path: "/tmp/azdoc-mobile-chat.png", fullPage: true });
  await visibleText(page, "Xidmətlər", { exact: true }).click();
  await page.getByRole("button", { name: /Laboratoriyalar/ }).click();
  await page.getByRole("button", { name: "Ətraflı bax", exact: true }).click();
  await page.getByRole("button", { name: "Seç", exact: true }).first().click();
  await page
    .getByRole("button", { name: "Nümunə harada götürülsün?", exact: true })
    .click();
  await page.getByRole("radio", { name: "Evdə", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Ünvan", exact: true })
    .fill("Test address 12");
  await page
    .getByRole("textbox", { name: "Əlaqə nömrəsi", exact: true })
    .fill("0501234567");
  await page
    .getByRole("button", { name: "Sorğunu göndər", exact: true })
    .click();
  await visibleText(page, "Sorğunuz göndərildi", { exact: true }).waitFor();
  await visibleText(page, "8 saat ac qalın.", { exact: true }).waitFor();
  assert.deepEqual(
    calls.find((r) => r.method === "POST" && r.path.endsWith("/lab-orders"))
      .body,
    {
      labId: 7,
      testIds: [1],
      collection: "HOME",
      address: "Test address 12",
      contactPhone: "0501234567",
    },
  );
  await page.screenshot({
    path: "/tmp/azdoc-mobile-lab-confirmation.png",
    fullPage: true,
  });
  assert.deepEqual(errors, []);
  console.log(
    "PASS: member-scoped records, corrections, manual qualitative lab entry, grounded chat, persistent emergency notice, home collection order and preparation confirmation",
  );
  await context.close();
  const pcopy = require("../src/copy/privacy.json");
  async function session(options = {}) {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
    });
    await context.addInitScript(
      ({ signedIn, language, pending }) => {
        if (signedIn) sessionStorage.setItem("auth_token", "test-only-token");
        localStorage.setItem("azdoc.member.fixture", "11");
        localStorage.setItem("i18nextLng", language);
        if (pending)
          sessionStorage.setItem(
            "pending_registration_consents",
            JSON.stringify(pending),
          );
      },
      {
        signedIn: options.signedIn !== false,
        language: options.language || "en",
        pending: options.pending,
      },
    );
    const page = await context.newPage();
    currentPage = page;
    page.setDefaultTimeout(15000);
    page.on("pageerror", (e) => errors.push(e.message));
    const calls = await installFixtures(page, options);
    await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3003", {
      waitUntil: "networkidle",
    });
    await visibleText(
      page,
      options.language === "ru"
        ? "Ваше здоровье сегодня"
        : options.signedIn === false
          ? "For you and your family"
          : "Your health, today",
      { exact: true },
    ).waitFor();
    return { context, page, calls };
  }
  {
    const { context, page, calls } = await session({ signedIn: false });
    await visibleText(page, "Account", { exact: true }).click();
    await page
      .getByRole("button", { name: "Sign in / Create account", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Create an account", exact: true })
      .click();
    await page
      .getByRole("textbox", { name: "Full name", exact: true })
      .fill("Test user");
    await page
      .getByRole("textbox", { name: "Email", exact: true })
      .fill("test@example.invalid");
    await page
      .getByRole("textbox", { name: "Password", exact: true })
      .fill("fixture-password");
    await page
      .getByRole("switch", { name: pcopy.en.storageConsent, exact: true })
      .click();
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await visibleText(page, "Your health, today", { exact: true }).waitFor();
    assert.deepEqual(
      calls
        .filter((r) => r.path.startsWith("/account/consent"))
        .map((r) => ({
          method: r.method,
          type: r.body?.type || r.path.split("/").pop(),
        })),
      [
        { method: "DELETE", type: "CROSS_BORDER_AI" },
        { method: "POST", type: "RECORD_STORAGE" },
      ],
    );
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("pending_registration_consents"),
      ),
      null,
    );
    await context.close();
    console.log(
      "PASS: registration allows refusing AI consent and stores choices with JWT",
    );
  }
  {
    const { context, page, calls } = await session();
    await visibleText(page, "Services", { exact: true }).click();
    await page.getByRole("button", { name: /Doctors/ }).click();
    await page
      .getByRole("button", { name: "View details", exact: true })
      .click();
    await visibleText(page, /Listing unconfirmed/).waitFor();
    await page.getByRole("button", { name: /09:00.*Test Clinic/ }).click();
    await page
      .getByRole("button", { name: "Request appointment", exact: true })
      .click();
    await visibleText(page, /Request sent. Awaiting confirmation./).waitFor();
    const booking = calls.find(
      (r) => r.method === "POST" && r.path.endsWith("/bookings"),
    );
    assert.equal(booking.path, "/members/11/bookings");
    assert.equal(booking.body.shareRecord, false);
    await page
      .getByRole("button", { name: "My appointments", exact: true })
      .click();
    await visibleText(page, "Test Doctor", { exact: true }).waitFor();
    await page.screenshot({
      path: "/tmp/azdoc-mobile-appointments.png",
      fullPage: true,
    });
    await context.close();
    console.log(
      "PASS: unconfirmed doctor listing, explicit appointment request and no record sharing by default",
    );
  }
  {
    const { context, page, calls } = await session();
    await visibleText(page, "Services", { exact: true }).click();
    await page.getByRole("button", { name: /Medicines/ }).click();
    await page
      .getByRole("button", { name: "View details", exact: true })
      .click();
    const warning = visibleText(
      page,
      /This is advisory and does not replace a doctor or pharmacist/,
    );
    await warning.waitFor();
    const text = await warning.textContent();
    assert.match(text, /life-threatening/i);
    assert.match(text, /pharmacist/i);
    await visibleText(page, /4.90/).waitFor();
    assert.equal(
      calls.find((r) => r.path.endsWith("/allergy-check")).query.memberId,
      "11",
    );
    await context.close();
    console.log(
      "PASS: medicine savings, missing price and member-specific allergy warning",
    );
  }
  {
    const { context, page, calls } = await session({ viewer: true });
    await visibleText(page, "Records", { exact: true }).click();
    await visibleText(page, "66.1 lb", { exact: true }).waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Edit member", exact: true })
        .count(),
      0,
    );
    await page.getByRole("tab", { name: "Lab results", exact: true }).click();
    await visibleText(page, /Awaiting review: 9.4/).waitFor();
    assert.equal(
      await page
        .getByRole("button", {
          name: /Accept|Correct before|Enter result manually|Reject/,
        })
        .count(),
      0,
    );
    await page.getByRole("tab", { name: "Documents", exact: true }).click();
    await visibleText(page, "Test scanned report", { exact: true }).waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: /Upload|Delete|Enter result manually/ })
        .count(),
      0,
    );
    assert.equal(
      calls.filter((r) => ["POST", "PUT", "DELETE"].includes(r.method)).length,
      0,
    );
    await context.close();
    console.log(
      "PASS: VIEWER reads proposals/documents without any write controls",
    );
  }
  {
    const { context, page, calls } = await session({
      consents: [
        {
          type: "CROSS_BORDER_AI",
          active: true,
          familyMemberId: null,
          grantedAt: "2026-09-08T09:00:00",
          policyVersion: "v1",
        },
      ],
    });
    await visibleText(page, "Account", { exact: true }).click();
    await page
      .getByRole("button", { name: "Privacy and consent", exact: true })
      .click();
    await page
      .getByRole("button", { name: pcopy.en.withdraw, exact: true })
      .click();
    await visibleText(page, pcopy.en.aiWarning, { exact: true }).waitFor();
    await page
      .getByRole("button", { name: pcopy.en.confirm, exact: true })
      .click();
    await page
      .getByRole("button", { name: pcopy.en.deleteAccount, exact: true })
      .click();
    await page
      .getByRole("switch", { name: pcopy.en.acknowledge, exact: true })
      .click();
    await page
      .getByRole("textbox", { name: pcopy.en.password, exact: true })
      .fill("wrong-password");
    await page
      .getByRole("button", { name: pcopy.en.confirm, exact: true })
      .click();
    await visibleText(page, "Incorrect password", { exact: true }).waitFor();
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem("auth_token")),
      "test-only-token",
    );
    await page
      .getByRole("textbox", { name: pcopy.en.password, exact: true })
      .fill("correct-password");
    await page
      .getByRole("button", { name: pcopy.en.confirm, exact: true })
      .click();
    await page
      .getByText(/Your account was deleted. Records removed:/)
      .waitFor();
    assert.match(
      await page.locator("body").innerText(),
      /documents: 3.*labResults: 12/,
    );
    assert.equal(
      await page.evaluate(() => sessionStorage.getItem("auth_token")),
      null,
    );
    assert.equal(
      await visibleText(page, "Penicillin", { exact: false }).count(),
      0,
    );
    await context.close();
    console.log(
      "PASS: withdrawal warning, incorrect-password error, account deletion receipt and session cleanup",
    );
  }
  {
    const { context, page, calls } = await session({
      pending: { email: "test@example.invalid", storage: true, ai: false },
    });
    await visibleText(page, "Chat", { exact: true }).click();
    await page
      .getByText("Complete your consent choices before using chat.", {
        exact: true,
      })
      .waitFor();
    assert.equal(calls.filter((r) => r.path.startsWith("/guest/")).length, 0);
    await page
      .getByRole("button", { name: "Complete choices", exact: true })
      .click();
    assert.equal(
      await page
        .getByRole("switch", { name: pcopy.en.storageConsent, exact: true })
        .isChecked(),
      true,
    );
    assert.equal(
      await page
        .getByRole("switch", { name: pcopy.en.aiConsent, exact: true })
        .isChecked(),
      false,
    );
    await page
      .getByRole("button", { name: pcopy.en.retryChoices, exact: true })
      .click();
    await visibleText(page, "Your health, today", { exact: true }).waitFor();
    assert.equal(calls.filter((r) => r.path === "/auth/register").length, 0);
    await context.close();
    console.log(
      "PASS: interrupted consent setup resumes safely without registering twice",
    );
  }
  {
    const { context, page } = await session({ language: "ru" });
    await visibleText(page, "Аккаунт", { exact: true }).click();
    await page
      .getByRole("button", { name: "Личные данные", exact: true })
      .click();
    await page.getByRole("button", { name: "Изменить", exact: true }).click();
    await page
      .getByRole("textbox", { name: "Имя и фамилия *", exact: true })
      .fill("Updated test user");
    await page.getByRole("button", { name: "Сохранить", exact: true }).click();
    await visibleText(page, "Изменения сохранены.", { exact: true }).waitFor();
    await page.screenshot({
      path: "/tmp/azdoc-mobile-russian.png",
      fullPage: true,
    });
    await context.close();
    console.log("PASS: Russian profile and editable personal information");
  }
  {
    const { context, page, calls } = await session();
    await visibleText(page, "Account", { exact: true }).click();
    await page
      .getByRole("button", { name: "Privacy and consent", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Who viewed the record", exact: true })
      .click();
    await visibleText(page, "Recent Doctor", { exact: true }).waitFor();
    const content = await page.locator("body").innerText();
    assert.ok(
      content.indexOf("Recent Doctor") < content.indexOf("Earlier Doctor"),
    );
    assert.ok(
      calls.some((r) => r.path === "/members/11/bookings/record-access"),
    );
    await page
      .getByRole("button", { name: "Family member", exact: true })
      .click();
    await page.getByRole("radio", { name: "Test Leyla", exact: true }).click();
    await visibleText(
      page,
      "No doctor has opened this person's shared record.",
      { exact: true },
    ).waitFor();
    assert.equal(
      await visibleText(page, "Recent Doctor", { exact: true }).count(),
      0,
    );
    await page.screenshot({ path: "/tmp/azdoc-mobile-record-access.png" });
    await context.close();
    console.log(
      "PASS: record access order, member isolation and honest empty state",
    );
  }
  {
    const { context, page, calls } = await session({ viewer: true });
    await visibleText(page, "Records", { exact: true }).click();
    await page
      .getByRole("button", { name: "Connected sources", exact: true })
      .click();
    await visibleText(page, "Test phone", { exact: true }).waitFor();
    await visibleText(page, "You have read-only access to this record.", {
      exact: true,
    }).waitFor();
    assert.equal(
      await page
        .getByRole("button", { name: "Disconnect", exact: true })
        .count(),
      0,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Connect this phone", exact: true })
        .count(),
      0,
    );
    assert.equal(
      calls.filter((r) => r.method === "POST" && r.path.includes("health-sync"))
        .length,
      0,
    );
    await page.screenshot({ path: "/tmp/azdoc-mobile-connected-sources.png" });
    await context.close();
    console.log(
      "PASS: source list is usable without native health and VIEWER cannot write",
    );
  }
  assert.deepEqual(errors, []);
  await browser.close();
})().catch(async (e) => {
  if (currentPage) {
    console.error("TEST SCREEN", await currentPage.locator("body").innerText());
    await currentPage.screenshot({
      path: "/tmp/azdoc-mobile-test-failure.png",
    });
  }
  console.error(e);
  process.exit(1);
});
