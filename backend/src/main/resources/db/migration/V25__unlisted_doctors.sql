-- A listing that can be booked but is not advertised.
--
-- Needed to exercise the booking flow on production without putting a
-- fabricated doctor in front of anybody. active = 0 would have hidden it, but
-- it also makes a listing unbookable, which is the opposite of what a test
-- listing is for. So the two questions are separated: active is whether the
-- listing works at all, unlisted is whether we show it to people.
--
-- Nothing else changes for it - it is reachable by its own link and books like
-- any other, it simply never appears in search, the specialty counts the
-- assistant is given, or the sitemap.

ALTER TABLE doctor
    ADD COLUMN unlisted BOOLEAN NOT NULL DEFAULT FALSE AFTER active;

-- The clinic the test listing sits in, named so nobody could mistake it.
INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'azdoc daxili test klinikasi' AS name,
    'azdoc-test-clinic' AS slug,
    'Test unvani' AS address,
    'Baki' AS city,
    NULL AS phone,
    'Internal test clinic. Not a real place.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'azdoc-test-clinic');

INSERT INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     languages, verification, verified_at, source, accepts_bookings, active,
     unlisted, created_at, updated_at)
SELECT * FROM (SELECT
    'Test Hekim (azdoc daxili test)' AS full_name,
    'azdoc-test-hekim' AS slug,
    'general-practice' AS specialty_code,
    'Bu hesab yalniz test ucundur' AS qualifications,
    NULL AS years_experience,
    'Bu real hekim deyil. Randevu axininin yoxlanilmasi ucun yaradilmis daxili test hesabidir.' AS bio,
    'az,en,ru' AS languages,
    'VERIFIED' AS verification,
    NOW() AS verified_at,
    'azdoc-internal-test' AS source,
    1 AS accepts_bookings,
    1 AS active,
    1 AS unlisted,
    NOW() AS created_at, NOW() AS updated_at) AS d
WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE slug = 'azdoc-test-hekim');

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id FROM doctor d, clinic c
WHERE d.slug = 'azdoc-test-hekim' AND c.slug = 'azdoc-test-clinic'
  AND NOT EXISTS (SELECT 1 FROM doctor_clinic dc
                  WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

-- Monday to Friday, 09:00-13:00 and 14:00-17:00, in 20 minute slots.
INSERT INTO doctor_availability (doctor_id, clinic_id, day_of_week, start_time, end_time, slot_minutes, active)
SELECT d.id, c.id, day.n, t.start_time, t.end_time, 20, 1
FROM doctor d
JOIN clinic c ON c.slug = 'azdoc-test-clinic'
JOIN (SELECT 1 AS n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5) AS day
JOIN (SELECT '09:00:00' AS start_time, '13:00:00' AS end_time
      UNION SELECT '14:00:00', '17:00:00') AS t
WHERE d.slug = 'azdoc-test-hekim'
  AND NOT EXISTS (SELECT 1 FROM doctor_availability a WHERE a.doctor_id = d.id);
