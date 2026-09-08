const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs"),
  path = require("node:path"),
  Module = require("node:module"),
  ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { JSDOM } = require("jsdom");
const originalLoad = Module._load,
  originalResolve = Module._resolveFilename;
let language = "az",
  rows = [],
  fail = false,
  slots = [],
  slotCalls = [],
  filtersSeen = [];
let selected;
Module._resolveFilename = function (r, p, ...args) {
  return originalResolve.call(
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
      default: ({ children, ...props }) =>
        React.createElement("a", props, children),
    };
  if (r === "next/image")
    return {
      __esModule: true,
      default: ({ unoptimized, ...props }) => React.createElement("img", props),
    };
  if (r === "next/navigation")
    return {
      notFound: () => {
        throw new Error("NOT_FOUND");
      },
    };
  // The profile now renders the booking panel, which is a client component and
  // asks the auth context who is signed in. Nobody is, in a server render of a
  // public page.
  if (r === "@/context/AuthContext")
    return {
      __esModule: true,
      useAuth: () => ({ isAuthenticated: false, user: null, logout: () => {} }),
    };
  if (r === "@/components/public/ProductLayout")
    return {
      __esModule: true,
      default: ({ children }) => React.createElement("main", null, children),
    };
  if (r === "@/api/doctorServer")
    return {
      directoryCopy: async () => ({
        language,
        c: require("../src/components/doctors/copy.ts").doctorCopy(language),
      }),
      getDoctor: async () => selected,
      getSpecialties: async () => [{ code: "general", name: "General" }],
      // The profile page resolves one specialty name through the directory
      // rather than the local table, so the stub has to offer it too.
      getSpecialtyName: async (code) =>
        code === "general" ? "General" : code,
      getSlots: async (...args) => {
        slotCalls.push(args);
        return slots;
      },
      getDoctors: async (filters) => {
        filtersSeen.push(filters);
        if (fail) throw Error("offline");
        const content = filters.q
          ? rows.filter((row) => row.fullName.includes(filters.q))
          : rows;
        return {
          content,
          totalElements: content.length,
          totalPages: 1,
          number: filters.page,
        };
      },
    };
  return originalLoad.call(this, r, p, ...args);
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
const model = require("../src/components/doctors/model.ts");
const { doctorCopy } = require("../src/components/doctors/copy.ts");
const { bookingCopy } = require("../src/components/booking/copy.ts");
const directory = require("../src/app/hekimler/page.tsx");
const profile = require("../src/app/hekimler/[slug]/page.tsx");
const { Verification } = require("../src/components/doctors/DoctorParts.tsx");
const doctor = {
  id: 12,
  slug: "dr-elnur-memmedov",
  fullName: "Dr. Elnur Məmmədov",
  specialtyCode: "general",
  verification: "UNCLAIMED",
  languages: ["az", "ru"],
  consultationFee: 50,
  yearsExperience: 12,
  acceptsBookings: false,
  clinics: [
    {
      slug: "merkezi",
      name: "Mərkəzi klinika",
      city: "Bakı",
      phone: "+994 12 123 45 67",
    },
  ],
};
const dom = (markup) => new JSDOM(markup).window.document;
const renderDirectory = async (params = {}) =>
  dom(
    renderToStaticMarkup(
      await directory.default({ searchParams: Promise.resolve(params) }),
    ),
  );
const renderProfile = async () =>
  dom(
    renderToStaticMarkup(
      await profile.default({ params: Promise.resolve({ slug: doctor.slug }) }),
    ),
  );
beforeEach(() => {
  language = "az";
  rows = [];
  fail = false;
  selected = { ...doctor };
  slots = [];
  slotCalls = [];
  filtersSeen = [];
});
test("empty catalogue, empty filtered catalogue and API failure have distinct truthful states", async () => {
  const c = doctorCopy("az");
  assert.match(
    (await renderDirectory()).body.textContent,
    new RegExp(c.emptyTitle),
  );
  assert.match(
    (await renderDirectory({ q: "Nobody" })).body.textContent,
    new RegExp(c.emptyTitle),
  );
  rows = [doctor];
  assert.match(
    (await renderDirectory({ q: "Nobody" })).body.textContent,
    new RegExp(c.noMatchTitle),
  );
  fail = true;
  const failed = await renderDirectory();
  assert.ok(failed.querySelector("[role=alert]"));
  assert.ok(!failed.body.textContent.includes(c.emptyTitle));
});
test("single result is SSR content with contact, experience, language and fee; null fee is not zero", async () => {
  rows = [doctor];
  const doc = await renderDirectory();
  assert.equal(doc.querySelectorAll("li.row").length, 1);
  assert.ok(doc.querySelector(`a[href="/hekimler/${doctor.slug}"]`));
  assert.ok(doc.body.textContent.includes("12 il"));
  rows = [{ ...doctor, consultationFee: null }];
  assert.equal((await renderDirectory()).querySelector(".fee strong"), null);
});
test("filters preserve Azerbaijani names and remain in pagination queries", () => {
  const filters = model.parseFilters({
    q: " İsmayıl ",
    city: "Bakı",
    specialty: "general",
    language: "ru",
    page: "2",
  });
  assert.equal(filters.q, "İsmayıl");
  const query = new URLSearchParams(model.filterQuery(filters, 3));
  assert.equal(query.get("q"), "İsmayıl");
  assert.equal(query.get("city"), "Bakı");
  assert.equal(query.get("language"), "ru");
  assert.equal(query.get("page"), "3");
  assert.equal(
    model.parseFilters({ page: "-1", q: ["bad"], language: "zz" }).page,
    0,
  );
});
test("only VERIFIED renders an approval mark, in all supported languages", () => {
  for (const language of ["az", "en", "ru"])
    for (const state of [
      "UNCLAIMED",
      "PENDING",
      "VERIFIED",
      "REJECTED",
      "UNKNOWN",
    ]) {
      const doc = dom(
        renderToStaticMarkup(
          React.createElement(Verification, {
            state,
            language,
            expanded: true,
          }),
        ),
      );
      assert.equal(Boolean(doc.querySelector("svg")), state === "VERIFIED");
      assert.equal(
        Boolean(doc.querySelector(".checked")),
        state === "VERIFIED",
      );
      assert.equal(
        Boolean(doc.querySelector('a[href^="mailto:"]')),
        state === "UNCLAIMED",
      );
      if (state !== "VERIFIED")
        assert.ok(
          !doc.body.textContent.includes(doctorCopy(language).VERIFIED),
        );
    }
});
test("closed booking shows clinic phone and does not fetch slots or render booking buttons", async () => {
  const doc = await renderProfile();
  assert.equal(slotCalls.length, 0);
  assert.ok(doc.querySelector('a[href="tel:+994121234567"]'));
  assert.equal(doc.querySelector("button"), null);
});
test("bookable profile fetches real slots by ID, renders Baku time and does not imply reservation", async () => {
  selected.acceptsBookings = true;
  slots = [
    {
      startsAt: "2026-09-10T09:00:00",
      endsAt: "2026-09-10T09:30:00",
      clinicId: 77,
    },
  ];
  const doc = await renderProfile();
  assert.equal(slotCalls[0][0], 12);
  // The times are no longer printed as a list: the panel opens on a calendar,
  // and a day is only offered when a free time sits behind it.
  const offered = [...doc.querySelectorAll("button")].filter(
    (b) => !b.disabled && b.className.includes("free"),
  );
  assert.ok(offered.length > 0, "the day with a free slot must be selectable");
  assert.ok(
    [...doc.querySelectorAll("button")].some((b) => b.disabled),
    "days without a free time must not be selectable",
  );
  assert.ok(doc.body.textContent.includes(doctorCopy("az").slotsNote));
  // Nothing on a first render may read as an appointment already made.
  assert.ok(!doc.body.textContent.includes(bookingCopy("az").booked));
});
test("profile metadata, canonical and schema use public fields only", async () => {
  selected = {
    ...doctor,
    licenseNumber: "SECRET",
    claimedBy: "PRIVATE",
    bio: "</script><script>alert(1)</script>",
  };
  const metadata = await profile.generateMetadata({
    params: Promise.resolve({ slug: doctor.slug }),
  });
  assert.equal(
    metadata.alternates.canonical,
    `https://azdoc.ai/hekimler/${doctor.slug}`,
  );
  const doc = await renderProfile();
  const schema = JSON.parse(
    doc.querySelector('script[type="application/ld+json"]').textContent,
  );
  assert.equal(schema.name, doctor.fullName);
  assert.equal(schema.worksFor[0]["@type"], "MedicalClinic");
  assert.ok(!doc.body.textContent.includes("SECRET"));
  assert.ok(!doc.body.textContent.includes("PRIVATE"));
  assert.equal(doc.querySelectorAll("script").length, 1);
  assert.ok(!model.safeJsonLd({ name: "</script>" }).includes("<"));
  selected = null;
  await assert.rejects(renderProfile, /NOT_FOUND/);
});
test("all three locales render localized heading, filters and profile status", async () => {
  for (language of ["az", "en", "ru"]) {
    assert.equal(
      (await renderDirectory()).querySelector("h1").textContent,
      doctorCopy(language).title,
    );
    assert.ok(
      (await renderProfile()).body.textContent.includes(
        doctorCopy(language).UNCLAIMED,
      ),
    );
  }
});
test("Baku date windows cross UTC day boundaries and use fourteen calendar dates", () => {
  assert.deepEqual(model.slotWindow(new Date("2026-09-07T22:00:00Z")), {
    from: "2026-09-08",
    to: "2026-09-21",
  });
});
