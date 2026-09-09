// Synthetic data used only by browser tests. No requests are sent to the backend.
exports.installFixtures = async (page, options = {}) => {
  const calls = [];
  const member = {
    id: 11,
    familyId: 1,
    fullName: "Test Ayan",
    ageYears: 7,
    ageMonths: 84,
    dateOfBirth: "2019-01-01",
    minor: true,
    self: false,
    bloodType: "A+",
    correctedAgeMonths: null,
  };
  const other = { ...member, id: 12, fullName: "Test Leyla", minor: false };
  const labTests = [
    {
      id: 1,
      code: "HGB",
      name: "Hemoqlobin",
      sampleType: "Qan",
      analyteKey: "hemoglobin",
      price: 12.1,
      turnaroundHours: 24,
      preparation: "8 saat ac qalın.",
    },
    {
      id: 2,
      code: "CRP",
      name: "CRP",
      sampleType: "Qan",
      analyteKey: "crp",
      price: null,
      turnaroundHours: 48,
      preparation: null,
    },
  ];
  const lab = {
    id: 7,
    slug: "fixture-lab",
    name: "Test laboratoriyası",
    city: "Bakı",
    district: "Nəsimi",
    address: "Test ünvanı 12",
    phone: "+994121234567",
    homeCollection: true,
    homeCollectionFee: 5,
    testCount: 2,
    tests: labTests,
  };
  const doctor = {
    id: 4,
    slug: "fixture-doctor",
    fullName: "Test Doctor",
    specialtyCode: "general",
    qualifications: "Test qualification",
    bio: "Fixture only",
    yearsExperience: 10,
    languages: ["az", "ru"],
    consultationFee: 30,
    verification: "UNCLAIMED",
    acceptsBookings: true,
    clinics: [
      {
        id: 2,
        slug: "fixture-clinic",
        name: "Test Clinic",
        city: "Bakı",
        phone: "+994121234567",
        address: "Test address",
      },
    ],
  };
  const pending = {
    id: 20,
    documentId: 1,
    source: "EXTRACTED",
    analyte: "Hemoqlobin",
    analyteKey: "hemoglobin",
    value: 9.4,
    valueText: null,
    displayValue: "9.4",
    unit: "g/dL",
    referenceLabel: "12 - 16",
    referenceLow: 12,
    referenceHigh: 16,
    abnormalFlag: "LOW",
    collectedAt: "2026-09-01T09:00:00",
    confirmed: false,
  };
  let labResults = [
      {
        ...pending,
        id: 21,
        value: 13.1,
        displayValue: "13.1",
        confirmed: true,
        source: "MANUAL",
        abnormalFlag: "NORMAL",
      },
    ],
    pendingLabs = [pending],
    meds = [
      {
        id: 30,
        name: "Test medicine",
        doseAmount: null,
        doseUnit: null,
        doseLabel: null,
        frequency: null,
        route: null,
        startedOn: null,
        endedOn: null,
        prescriber: null,
        sourceDocumentId: 1,
        confirmed: false,
      },
    ],
    orders = [],
    bookings = [],
    consents = options.consents || [],
    chats = [];
  const responsePage = (content) => ({
    content,
    totalElements: content.length,
    totalPages: 1,
    number: 0,
  });
  await page.route(
    (url) => /^\/(?:dev-)?api\//.test(url.pathname),
    async (route) => {
      const request = route.request(),
        url = new URL(request.url()),
        path = url.pathname.replace(/^\/(?:dev-)?api/, ""),
        method = request.method();
      let body;
      try {
        body = request.postDataJSON();
      } catch {
        body = request.postData();
      }
      calls.push({
        path,
        method,
        body,
        query: Object.fromEntries(url.searchParams),
        authorization: request.headers().authorization,
      });
      let data,
        status = 200,
        headers = {};
      if (method === "OPTIONS") {
        await route.fulfill({
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-headers": "*",
            "access-control-allow-methods": "*",
          },
        });
        return;
      }
      if (path === "/user/me")
        data = {
          id: "fixture",
          name: "Test user",
          email: "test@example.invalid",
        };
      else if (path === "/auth/login" || path === "/auth/register")
        data = "test-only-token";
      else if (path === "/profile")
        data = {
          name: "Test user",
          email: "test@example.invalid",
          medicalProfile: { bloodType: "A+" },
          ...(method === "PUT" ? body : {}),
        };
      else if (path === "/families")
        data = [
          {
            id: 1,
            name: "Test family",
            role: options.viewer ? "VIEWER" : "OWNER",
            members: [member, other],
          },
        ];
      else if (path === "/labs") data = responsePage([lab]);
      else if (path === "/labs/fixture-lab") data = lab;
      else if (path === "/labs/fixture-lab/tests")
        data = labTests.filter(
          (t) =>
            !url.searchParams.get("q") ||
            t.name.includes(url.searchParams.get("q")),
        );
      else if (path === "/doctors/specialties")
        data = [{ code: "general", name: "Terapevt" }];
      else if (path === "/doctors") data = responsePage([doctor]);
      else if (path === "/doctors/fixture-doctor") data = doctor;
      else if (path === "/doctors/4/slots")
        data = [
          {
            startsAt: "2026-09-15T09:00:00",
            endsAt: "2026-09-15T09:30:00",
            clinicId: 2,
          },
        ];
      else if (path === "/medicines")
        data = [
          {
            id: 8,
            slug: "fixture-medicine",
            name: "Test medicine",
            activeIngredient: "Ingredient",
            lowestPrice: 6,
            priceCount: 2,
          },
        ];
      else if (path === "/medicines/fixture-medicine")
        data = {
          id: 8,
          slug: "fixture-medicine",
          name: "Test medicine",
          active_ingredient: "Ingredient",
          manufacturer: "Fixture manufacturer",
          prescription_status: "Reseptlə",
          prices: [
            { tradeName: "Brand A", retailPrice: 6 },
            { tradeName: "Brand B", retailPrice: null },
          ],
          alternatives: [
            {
              id: 9,
              slug: "alternative",
              name: "Test alternative",
              lowestPrice: 1.1,
            },
          ],
        };
      else if (path === "/medicines/8/allergy-check")
        data = [
          {
            medicineName: "Test medicine",
            allergen: "Penicillin",
            severity: "LIFE_THREATENING",
            critical: true,
            basis: "CLASS",
          },
        ];
      else if (path === "/account/consent") {
        if (method === "POST")
          consents = [
            ...consents.filter(
              (c) =>
                c.type !== body.type ||
                c.familyMemberId !== (body.familyMemberId || null),
            ),
            {
              type: body.type,
              familyMemberId: body.familyMemberId || null,
              active: true,
              policyVersion: "v1",
              grantedAt: "2026-09-08T09:00:00",
              withdrawnAt: null,
            },
          ];
        data = { policyVersion: "v1", consents };
      } else if (path.startsWith("/account/consent/")) {
        const type = path.split("/").pop();
        consents = [
          ...consents.filter((c) => c.type !== type),
          {
            type,
            active: false,
            policyVersion: "v1",
            familyMemberId: null,
            grantedAt: null,
            withdrawnAt: "2026-09-08T09:00:00",
          },
        ];
        data = { policyVersion: "v1", consents };
      } else if (path === "/account" && method === "DELETE") {
        if (body.password !== "correct-password") {
          status = 403;
          data = { message: "Incorrect password" };
        } else
          data = { deleted: true, removed: { documents: 3, labResults: 12 } };
      } else if (path === "/guest/start")
        data = { sessionId: "fixture-session" };
      else if (path === "/guest/session/fixture-session") data = { chats };
      else if (path === "/guest/chats/fixture-session" && method === "POST") {
        data = {
          id: String(chats.length + 1),
          title: "Test conversation",
          messages: [],
        };
        chats.push(data);
      } else if (
        /^\/guest\/chat\/fixture-session\/\d+$/.test(path) &&
        method === "POST"
      ) {
        data = { response: "Test answer" };
        if (body.message.includes("urgent"))
          headers = {
            "x-urgent": "true",
            "x-urgent-categories": "trouble breathing",
            "x-emergency-number": "103",
          };
      } else if (path.endsWith("/documents/lab-results/pending"))
        data = pendingLabs;
      else if (path.endsWith("/documents/medications/pending")) data = meds;
      else if (path.endsWith("/documents/lab-results/20/confirm")) {
        labResults.push({
          ...pending,
          ...body,
          confirmed: true,
          displayValue: String(body.value ?? pending.value),
        });
        pendingLabs = [];
        data = labResults.at(-1);
      } else if (path.endsWith("/documents/lab-results")) {
        if (method === "POST") {
          data = {
            ...body,
            id: 50,
            source: "MANUAL",
            confirmed: true,
            analyteKey: "manual",
            displayValue: String(body.value ?? body.valueText),
          };
          labResults.push(data);
        } else data = labResults;
      } else if (path.includes("/documents/lab-results/series/"))
        data = labResults;
      else if (path.endsWith("/documents/medications/30/confirm")) {
        meds = [];
        data = { ...body, id: 30, confirmed: true };
      } else if (path.endsWith("/documents"))
        data = [
          {
            id: 1,
            title: "Test scanned report",
            documentType: "LAB_RESULT",
            documentDate: "2026-09-01",
            createdAt: "2026-09-01T09:00:00",
            contentType: "application/pdf",
            extractionStatus: "SKIPPED",
          },
        ];
      else if (path.endsWith("/lab-orders")) {
        if (method === "POST") {
          data = {
            ...body,
            id: 60,
            labName: lab.name,
            labPhone: lab.phone,
            status: "REQUESTED",
            totalPrice: 17.1,
            items: labTests
              .filter((t) => body.testIds.includes(t.id))
              .map((t) => ({
                id: t.id,
                name: t.name,
                price: t.price,
                resultReady: false,
              })),
          };
          orders = [data];
        } else data = path.includes("/12/") ? [] : orders;
      } else if (path.endsWith("/lab-orders/60/cancel")) {
        orders = [{ ...orders[0], status: "CANCELLED" }];
        data = orders[0];
      } else if (path.endsWith("/bookings/record-access")) {
        data = path.includes("/12/")
          ? []
          : [
              {
                id: 1,
                doctorName: "Earlier Doctor",
                doctorSlug: null,
                bookingId: 8,
                accessedAt: "2026-09-01T09:00:00",
              },
              {
                id: 2,
                doctorName: "Recent Doctor",
                doctorSlug: "fixture-doctor",
                bookingId: 9,
                accessedAt: "2026-09-08T09:00:00",
              },
            ];
      } else if (path.endsWith("/health-sync")) {
        data = [
          {
            id: 1,
            provider: "APPLE_HEALTH",
            deviceLabel: "Test phone",
            enabled: true,
            syncedThrough: null,
            lastSyncAt: null,
          },
        ];
      } else if (path.endsWith("/bookings")) {
        if (method === "POST") {
          data = {
            ...body,
            id: 70,
            doctorName: doctor.fullName,
            status: "REQUESTED",
            endsAt: "2026-09-15T09:30:00",
            sharedRecord: body.shareRecord,
          };
          bookings = [data];
        } else data = path.includes("/12/") ? [] : bookings;
      } else if (path.endsWith("/bookings/70/cancel")) {
        bookings = [{ ...bookings[0], status: "CANCELLED" }];
        data = bookings[0];
      } else if (path.endsWith("/allergies"))
        data = [
          {
            id: 1,
            allergen: "Penicillin",
            critical: true,
            severity: "LIFE_THREATENING",
            active: true,
          },
        ];
      else if (path.endsWith("/vitals/latest"))
        data = {
          WEIGHT: {
            id: 1,
            vitalType: "WEIGHT",
            value: 30,
            unit: "kg",
            valueEntered: 66.1,
            unitEntered: "lb",
            measuredAt: "2026-09-08T09:00:00",
            abnormalFlag: "NORMAL",
          },
        };
      else if (path.includes("/vitals/series/"))
        data = [
          {
            id: 1,
            vitalType: "WEIGHT",
            value: 30,
            unit: "kg",
            valueEntered: 66.1,
            unitEntered: "lb",
            measuredAt: "2026-09-08T09:00:00",
            abnormalFlag: "NORMAL",
          },
        ];
      else if (path.endsWith("/vitals/trends")) data = [];
      else if (path.endsWith("/timeline"))
        data = [
          {
            type: "MEDICATION_STOPPED",
            recordId: 1,
            occurredAt: "2026-09-01T00:00:00",
            title: "Test medicine",
            detail: "Stopped",
            notable: false,
          },
        ];
      else if (
        path.endsWith("/history") ||
        path.endsWith("/conditions") ||
        path.endsWith("/medications") ||
        path.endsWith("/immunizations")
      )
        data = [];
      else {
        status = 404;
        data = { message: `No fixture for ${method} ${path}` };
      }
      await route.fulfill({
        status,
        headers: {
          "content-type": "application/json",
          "access-control-allow-origin": "*",
          "access-control-expose-headers":
            "X-Urgent, X-Urgent-Categories, X-Emergency-Number",
          ...headers,
        },
        body: JSON.stringify(data),
      });
    },
  );
  return calls;
};
