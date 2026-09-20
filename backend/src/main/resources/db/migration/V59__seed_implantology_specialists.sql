-- 156 implantologists, from a published list of specialists in Azerbaijan.
--
-- Read on 2026-09-20. The thirteenth and last of the sources in the working
-- list, and unlike the other twelve it is not a hospital publishing its own
-- staff - it is a list of dentists who practise across the country, most of
-- them with no employer recorded against them at all.
--
-- That shapes what is taken. Names, the specialty, a length of service where
-- one is stated, a portrait where one exists, and the languages each doctor
-- works in. Nothing else survives the reading:
--
--   - The biography is dropped for every one of them. There is one sentence,
--     rewritten per doctor, and it exists to send the reader somewhere else.
--     It is advertising, not a biography, and it is not repeated here.
--   - A rating and a review count are published for each. They are somebody
--     else's numbers, gathered somewhere we cannot see, and a star rating
--     carried over without its reviews is a claim with nothing behind it.
--   - "verified" is set on 163 of the 164. It is their word, about their own
--     checks, and it has no bearing on ours: every row below is UNCLAIMED.
--
-- 164 entries become 156 doctors:
--
--   - Four people are listed twice, once with a practice and once without.
--     Each is one row here, keeping the practice.
--   - Four are already in this directory from a hospital's own page, with a
--     biography, their education and a photograph behind them: Cabrayil
--     Sultanov at Saglam Aile, Elcin Asadov at Merkezi Klinika, Rauf Babayev
--     at the Customs Hospital, and Perviz Isayev, who founded SNN Medical and
--     is listed there. A second listing would say less about each of them than
--     the one they already have.
--
-- Two more names match a doctor already here and are other people: this Perviz
-- Cafarov is an implantologist and the one at Liv Bona Dea is a cardiologist,
-- and this Ramin Aliyev is an implantologist where Referans lists an emergency
-- physician.
--
-- 118 of the 156 name no practice, and they are attached to no clinic at all
-- rather than to an invented one. The consequence is worth stating: a doctor
-- with no clinic has no city, because the city belongs to the clinic record,
-- so these listings answer a search by name or by specialty but not by city.
-- The 38 who do name a practice get it, as 33 clinic rows carrying the name
-- and the city and nothing else, because nothing else is published.
--
-- Data only.

-- Implantology, rather than filing 156 implantologists under general
-- dentistry. It is what somebody missing a tooth actually searches for.
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('implantology','İmplantologiya','Dental Implantology','Имплантология',1,'general',120);

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT '8 Nömrəli poliklinika' AS name, '8-nomreli-poliklinika' AS slug, 'Bakı' AS city,
  '8 Nömrəli poliklinika, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = '8-nomreli-poliklinika');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Art&Smile Dental Clinic' AS name, 'art-smile-dental-clinic' AS slug, 'Bakı' AS city,
  'Art&Smile Dental Clinic, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'art-smile-dental-clinic');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Artefatto' AS name, 'artefatto' AS slug, 'Bakı' AS city,
  'Artefatto, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'artefatto');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Azdent' AS name, 'azdent' AS slug, 'Bakı' AS city,
  'Azdent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'azdent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Birdent' AS name, 'birdent' AS slug, 'Bakı' AS city,
  'Birdent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'birdent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'DTX Hospital - Stomatologiya şöbəsi' AS name, 'dtx-hospital-stomatologiya-sobesi' AS slug, 'Bakı' AS city,
  'DTX Hospital - Stomatologiya şöbəsi, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'dtx-hospital-stomatologiya-sobesi');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Dental Oasis' AS name, 'dental-oasis' AS slug, 'Bakı' AS city,
  'Dental Oasis, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'dental-oasis');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Dentopia' AS name, 'dentopia' AS slug, 'Bakı' AS city,
  'Dentopia, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'dentopia');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Diamond' AS name, 'diamond' AS slug, 'Bakı' AS city,
  'Diamond, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'diamond');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Digital Dental Studio' AS name, 'digital-dental-studio' AS slug, 'Bakı' AS city,
  'Digital Dental Studio, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'digital-dental-studio');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Doctor Yaqubov' AS name, 'doctor-yaqubov' AS slug, 'Bakı' AS city,
  'Doctor Yaqubov, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'doctor-yaqubov');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Dəniz' AS name, 'deniz' AS slug, 'Bakı' AS city,
  'Dəniz, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'deniz');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Ege Hospital' AS name, 'ege-hospital' AS slug, 'Bakı' AS city,
  'Ege Hospital, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'ege-hospital');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Estetik Diş' AS name, 'estetik-dis' AS slug, 'Bakı' AS city,
  'Estetik Diş, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'estetik-dis');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Family Clinic' AS name, 'family-clinic' AS slug, 'Bakı' AS city,
  'Family Clinic, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'family-clinic');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Funda' AS name, 'funda' AS slug, 'Bakı' AS city,
  'Funda, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'funda');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Gəncə Dental' AS name, 'gence-dental' AS slug, 'Gəncə' AS city,
  'Gəncə Dental, Gəncə. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'gence-dental');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Megadent' AS name, 'megadent' AS slug, 'Bakı' AS city,
  'Megadent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'megadent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Mirvari Diş' AS name, 'mirvari-dis' AS slug, 'Bakı' AS city,
  'Mirvari Diş, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'mirvari-dis');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Only Dent' AS name, 'only-dent' AS slug, 'Bakı' AS city,
  'Only Dent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'only-dent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Piccasa' AS name, 'piccasa' AS slug, 'Bakı' AS city,
  'Piccasa, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'piccasa');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Premium' AS name, 'premium' AS slug, 'Bakı' AS city,
  'Premium, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'premium');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Pro implant' AS name, 'pro-implant' AS slug, 'Bakı' AS city,
  'Pro implant, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'pro-implant');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Profclinic' AS name, 'profclinic' AS slug, 'Bakı' AS city,
  'Profclinic, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'profclinic');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Diş' AS name, 'saglam-dis' AS slug, 'Bakı' AS city,
  'Sağlam Diş, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-dis');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam diş' AS name, 'saglam-dis-2' AS slug, 'Bakı' AS city,
  'Sağlam diş, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-dis-2');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sky Clinic' AS name, 'sky-clinic' AS slug, 'Bakı' AS city,
  'Sky Clinic, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'sky-clinic');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Smile by Dr. Bakhtiyar' AS name, 'smile-by-dr-bakhtiyar' AS slug, 'Bakı' AS city,
  'Smile by Dr. Bakhtiyar, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'smile-by-dr-bakhtiyar');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sorridi' AS name, 'sorridi' AS slug, 'Bakı' AS city,
  'Sorridi, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'sorridi');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'UM Dent' AS name, 'um-dent' AS slug, 'Bakı' AS city,
  'UM Dent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'um-dent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'UzmanDent' AS name, 'uzmandent' AS slug, 'Bakı' AS city,
  'UzmanDent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'uzmandent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'VA Dent' AS name, 'va-dent' AS slug, 'Bakı' AS city,
  'VA Dent, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'va-dent');

INSERT INTO clinic (name, slug, city, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'West Hospital' AS name, 'west-hospital' AS slug, 'Bakı' AS city,
  'West Hospital, Bakı. Stomatoloji praktika.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'west-hospital');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Abbas Rüstəmov', 'abbas-rustemov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Abülfəz Xəlilov', 'abulfez-xelilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Afa Ağazadə', 'afa-agazade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Akif Quliyev', 'akif-quliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Anar Kərimov', 'anar-kerimov', 'implantology', NULL, 20, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Anar Əmiraslanov', 'anar-emiraslanov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Anar Əsədov', 'anar-esedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Aqil Əliyev', 'aqil-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Asif Daşdəmirov', 'asif-dasdemirov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Asim Abbasov', 'asim-abbasov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Aslan Məmmədov', 'aslan-memmedov', 'implantology', NULL, NULL, NULL, '/doctor-photos/aslan-memmedov.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Asəf', 'asef', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Azad', 'azad', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Azər Aydınoğlu', 'azer-aydinoglu', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Azər Hüseynov', 'azer-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Azər İsmayılov', 'azer-ismayilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Bəhruz Həsənov', 'behruz-hesenov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Bəhruz Məmmədov', 'behruz-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Bəhruz İsmayılov', 'behruz-ismayilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Bəxtiyar Əliyev', 'bextiyar-eliyev', 'implantology', NULL, 17, NULL, '/doctor-photos/bextiyar-eliyev.webp', 'en', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Bəylər Məmməd', 'beyler-memmed', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Cahid Məmmədov', 'cahid-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Cavid Əhmədbəyli', 'cavid-ehmedbeyli', 'implantology', NULL, 21, NULL, '/doctor-photos/cavid-ehmedbeyli.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Dilqəm İsmayılov', 'dilqem-ismayilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Eldar Fərəcov', 'eldar-ferecov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elmir İbrahimov', 'elmir-ibrahimov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elnur Ağaverdiyev', 'elnur-agaverdiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elnur Həsənli', 'elnur-hesenli', 'implantology', NULL, NULL, NULL, '/doctor-photos/elnur-hesenli.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elsever Süleymanov', 'elsever-suleymanov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elxan Teyyubov', 'elxan-teyyubov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elçin Abdullayev', 'elcin-abdullayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elşad Qarayev', 'elsad-qarayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Elşən Şahbazov', 'elsen-sahbazov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Emil İmanov', 'emil-imanov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Etibar Əliyev', 'etibar-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Etimad Seyidov', 'etimad-seyidov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fariz Məmmədov', 'fariz-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fariz Ovçuyev', 'fariz-ovcuyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fariz Səfərov', 'fariz-seferov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fuad Bünyatov', 'fuad-bunyatov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fuad Manafov', 'fuad-manafov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərhad İskəndərov', 'ferhad-iskenderov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərid Fətiyev', 'ferid-fetiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərid Səfərəliyev', 'ferid-sefereliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərid İbadov', 'ferid-ibadov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərman Həsənov', 'ferman-hesenov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fərqanə İbadova', 'ferqane-ibadova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Fəxrəddin Şamıyev', 'fexreddin-samiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Gündüz Yaqubov', 'gunduz-yaqubov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Günel Namazova', 'gunel-namazova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Günəş Məmmədova', 'gunes-memmedova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Hikmət Baxışov', 'hikmet-baxisov', 'implantology', NULL, 18, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Hüseyn Hüseynzadə', 'huseyn-huseynzade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Həmid Mədətov', 'hemid-medetov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Kamal Mehrəliyev', 'kamal-mehreliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Kamil İsayev', 'kamil-isayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Kəmaləddin Babayev', 'kemaleddin-babayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Kənan Xəlilov', 'kenan-xelilov', 'implantology', NULL, NULL, NULL, '/doctor-photos/kenan-xelilov.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Kərim Hacıyev', 'kerim-haciyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Mamed Nağıyev', 'mamed-nagiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Murad Həsənəliyev', 'murad-heseneliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Musa Hüseynov', 'musa-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Mövsüm Rəştiyev', 'movsum-restiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Məhərrəm Təhməz', 'meherrem-tehmez', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Məsud Murad', 'mesud-murad', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Mətləb Ələsov', 'metleb-elesov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nadir Səmədov', 'nadir-semedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Naile Ismayilova', 'naile-ismayilova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nicat Məmmədov', 'nicat-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nicat Qurbanov', 'nicat-qurbanov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nicat İbrahimov', 'nicat-ibrahimov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nigar Qasımlı', 'nigar-qasimli', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nihad Əliyev', 'nihad-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Niyaməddin Babayev', 'niyameddin-babayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nizami Əliyev', 'nizami-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nurlan Əliyev', 'nurlan-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nurəddin Məmmədov', 'nureddin-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Nərgiz Ramazanova', 'nergiz-ramazanova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Pərviz Cəfərov', 'perviz-ceferov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Pərviz Hüseynov', 'perviz-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Pərviz Əliyev', 'perviz-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Qadir Zeynalov', 'qadir-zeynalov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Qədir Rüstəmov', 'qedir-rustemov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rafiq İbrahimov', 'rafiq-ibrahimov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramil Eyvazov', 'ramil-eyvazov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramil Usubov', 'ramil-usubov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramin Ağayev', 'ramin-agayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramin Dadaşlı', 'ramin-dadasli', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramin Şıxəliyev', 'ramin-sixeliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ramin Əliyev', 'ramin-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rauf Cavadov', 'rauf-cavadov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rauf Şahmuradov', 'rauf-sahmuradov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Raul Lələkişizadə', 'raul-lelekisizade', 'implantology', NULL, NULL, NULL, '/doctor-photos/raul-lelekisizade.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Roman Məhərrəmov', 'roman-meherremov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rövşən İsmayılov', 'rovsen-ismayilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rövşən Əbilov', 'rovsen-ebilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rüfət Hüseynli', 'rufet-huseynli', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rüfət Əliyev', 'rufet-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rüstəm Ağazadə', 'rustem-agazade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəhman Məmmədov', 'rehman-memmedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəsul Nəsrəddinov', 'resul-nesreddinov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəsul Zeitman', 'resul-zeitman', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəşad Məmmədzadə', 'resad-memmedzade', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəşad Qafarov', 'resad-qafarov', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəşad Əliyev', 'resad-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Rəşid Məmmədzadə', 'resid-memmedzade', 'implantology', NULL, 19, NULL, '/doctor-photos/resid-memmedzade.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Sahib Bilalzadə', 'sahib-bilalzade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Samir Verdiyev', 'samir-verdiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Seymur Kazımov', 'seymur-kazimov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Seymur Mirzəliyev', 'seymur-mirzeliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Səfərəli Vəzirov', 'sefereli-vezirov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Səməd Babayev', 'semed-babayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Səxavət Məmmədzadə', 'sexavet-memmedzade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Tamerlan', 'tamerlan', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Toğrul Abdullayev', 'togrul-abdullayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Toğrul Əliyev', 'togrul-eliyev', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Tural Mehdiyev', 'tural-mehdiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Ulduzə İsgəndərova', 'ulduze-isgenderova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vahid Vahidzadə', 'vahid-vahidzade', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüqar Pənahov', 'vuqar-penahov', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüqar Qarayev', 'vuqar-qarayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüqar Qasımov', 'vuqar-qasimov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüqar Quliyev', 'vuqar-quliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüqar Qurbanov', 'vuqar-qurbanov', 'implantology', NULL, 17, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüsal Abbasov', 'vusal-abbasov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Vüsal Xanmirzəyev', 'vusal-xanmirzeyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Xaliq Hüseynov', 'xaliq-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Xatir Məlikli', 'xatir-melikli', 'implantology', NULL, 31, NULL, '/doctor-photos/xatir-melikli.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Xəqani Hüseynov', 'xeqani-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Xəyal Səmədova', 'xeyal-semedova', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Yaşar Ağayev', 'yasar-agayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Zamiq Nəsirli', 'zamiq-nesirli', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Zaur Aliyev', 'zaur-aliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Zaur Hacıyev', 'zaur-haciyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Zaur Rzayev', 'zaur-rzayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İbrahim Abdullayev', 'ibrahim-abdullayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İbrahim Əliyev', 'ibrahim-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İkram Sadıqov', 'ikram-sadiqov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlham Abdullayev', 'ilham-abdullayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlham Güləliyev', 'ilham-guleliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlham Quliyev', 'ilham-quliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlkin Adıgözəlov', 'ilkin-adigozelov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlqar Qacar', 'ilqar-qacar', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İlqar Əbilov', 'ilqar-ebilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İmran Hüseynov', 'imran-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İsgəndər Hüseynov', 'isgender-huseynov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İslam Səmədov', 'islam-semedov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İsmayıl Quliyev', 'ismayil-quliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('İsmayıl İsmayılov', 'ismayil-ismayilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Şahid Bəkirov', 'sahid-bekirov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Şahin Tağıyev', 'sahin-tagiyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Şəmsi Abdullayev', 'semsi-abdullayev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Əbülfət Xəlilov', 'ebulfet-xelilov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Əli Əliyev', 'eli-eliyev', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Əsgər Bağırov', 'esger-bagirov', 'implantology', NULL, NULL, NULL, NULL, 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW()),
    ('Əzəmət Əmirov', 'ezemet-emirov', 'implantology', NULL, NULL, NULL, '/doctor-photos/ezemet-emirov.webp', 'az', 'UNCLAIMED', 'implant.az', 0, 1, NOW(), NOW())
;

-- Only the 38 who name where they work.
CREATE TEMPORARY TABLE implant_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO implant_placement (doctor_slug, clinic_slug) VALUES
    ('afa-agazade', 'sorridi'),
    ('anar-kerimov', 'artefatto'),
    ('aslan-memmedov', 'piccasa'),
    ('asef', 'diamond'),
    ('azad', '8-nomreli-poliklinika'),
    ('azer-aydinoglu', 'west-hospital'),
    ('azer-huseynov', 'profclinic'),
    ('azer-ismayilov', 'premium'),
    ('bextiyar-eliyev', 'smile-by-dr-bakhtiyar'),
    ('cavid-ehmedbeyli', 'estetik-dis'),
    ('dilqem-ismayilov', 'sky-clinic'),
    ('elsever-suleymanov', 'estetik-dis'),
    ('elcin-abdullayev', 'ege-hospital'),
    ('emil-imanov', 'pro-implant'),
    ('fariz-memmedov', 'dtx-hospital-stomatologiya-sobesi'),
    ('ferqane-ibadova', 'saglam-dis'),
    ('gunduz-yaqubov', 'doctor-yaqubov'),
    ('hikmet-baxisov', 'azdent'),
    ('kenan-xelilov', 'digital-dental-studio'),
    ('rufet-huseynli', 'mirvari-dis'),
    ('resad-qafarov', 'dentopia'),
    ('resid-memmedzade', 'art-smile-dental-clinic'),
    ('sahib-bilalzade', 'megadent'),
    ('samir-verdiyev', 'gence-dental'),
    ('sexavet-memmedzade', 'uzmandent'),
    ('tamerlan', 'saglam-dis'),
    ('togrul-abdullayev', 'only-dent'),
    ('togrul-eliyev', 'funda'),
    ('vahid-vahidzade', 'saglam-dis-2'),
    ('vuqar-penahov', 'sky-clinic'),
    ('vuqar-quliyev', 'va-dent'),
    ('vusal-abbasov', 'dental-oasis'),
    ('xatir-melikli', 'azdent'),
    ('xeqani-huseynov', 'estetik-dis'),
    ('ibrahim-eliyev', 'family-clinic'),
    ('islam-semedov', 'um-dent'),
    ('ismayil-quliyev', 'deniz'),
    ('ezemet-emirov', 'birdent')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM implant_placement p
JOIN doctor d ON d.slug = p.doctor_slug AND d.source = 'implant.az'
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE implant_placement;
