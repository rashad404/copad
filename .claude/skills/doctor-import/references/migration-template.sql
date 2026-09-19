-- <What this adds, in one line.>
--
-- <Where the list came from, and the date it was read. How the total was
-- established: the number the hospital states, or how the profiles were
-- counted. Say it plainly enough that somebody re-reading the source in a year
-- can tell whether it has changed.>
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0: the listing repeats what <the source> already
-- publishes, it does not assert that we checked anything, and it cannot take
-- an appointment nobody is watching. A doctor who claims their listing goes to
-- PENDING and is reviewed like any other claim.
--
-- <Anything deliberately left NULL, and why. Anything left out of the import
-- altogether - administrative staff, a department that is not medical, a
-- profile with no name. A specialty that mapped imperfectly.>
--
-- Data only.

-- Departments this source has that the taxonomy did not, so no listing lands
-- without a translated name. Delete this block if every code already exists.
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('<code>','<Azərbaycanca>','<English>','<Русский>',1,'general',<sort_order>);

-- The clinic. Guarded on the slug so re-running changes nothing.
INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    '<Clinic name as it calls itself>' AS name,
    '<clinic-slug>' AS slug,
    '<street address>' AS address,
    'Bakı' AS city,
    '<phone>' AS phone,
    '<One line. Where the listing came from.>' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = '<clinic-slug>');

SET @clinic_id = (SELECT id FROM clinic WHERE slug = '<clinic-slug>');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take the
-- row-alias form, and a slug that somehow already exists should be left alone
-- rather than overwritten by a scrape.
--
-- Apostrophes inside Azerbaijani text are doubled. One unescaped apostrophe
-- ends the string and fails the whole migration on deploy.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('<Uzm.Dr. AD SOYAD>', '<ad-soyad>', '<specialty-code>', '<education | joined | with pipes>', <years or NULL>, '<Fəaliyyət sahələri: ... İş təcrübəsi: ...>', '/doctor-photos/<ad-soyad>.webp', 'az', 'UNCLAIMED', '<domain>', 0, 1, NOW(), NOW()),
    ('<...>', '<...>', '<...>', NULL, NULL, NULL, '/doctor-photos/<...>.webp', 'az', 'UNCLAIMED', '<domain>', 0, 1, NOW(), NOW())
;

-- Attach them to the clinic.
INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, @clinic_id FROM doctor d
WHERE d.source = '<domain>'
  AND @clinic_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM doctor_clinic dc
      WHERE dc.doctor_id = d.id AND dc.clinic_id = @clinic_id);
