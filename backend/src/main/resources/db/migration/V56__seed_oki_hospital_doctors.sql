-- The 37 doctors OKI Hospital publishes that this directory can list.
--
-- Read from okihospital.az on 2026-09-20, in Azerbaijani. The tenth source,
-- and the first outside the Baku-Ganja-Sumqayit belt: OKI is in Qusar, in the
-- north, and no listing here reached that city before.
--
-- The count is 41 published, and finding that took a second look. Half the
-- profiles live at /doctor-dr-<name> and half at /dr-<name>, so a scan for the
-- first pattern returns 23 and looks complete. Three readings of the page
-- agree on 41 once both are counted: the card blocks, the links, and the name
-- headings, with nothing in any one of them the other two lack.
--
-- Of the 41:
--
--   - 37 are listed here.
--   - Three are not, and are named so the decision is not invisible: Esmira
--     Hasanzada, Hamzat Cigarov and Lala Huseynova each share a name and a
--     specialty with a doctor already in this directory. OKI publishes no
--     education at all, so unlike Caspian - where matching universities and
--     graduation years settled it - there is no way to tell one doctor working
--     at two hospitals from two people sharing a name. Listing them would
--     either duplicate a person or attribute one doctor's credentials to
--     another, and both are worse than waiting.
--   - One is a pharmacist, Provizor, and does not belong in a doctor listing.
--
-- Vaqif Abdullayev is listed although a doctor of that name is already here:
-- this one is a dermatologist, and the one at Yeni Klinika is a
-- physiotherapist who qualified in 2024. Different people, plainly.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- This source publishes less than any other: a name, a role and a photograph.
-- There is no education and no career, so qualifications and years_experience
-- are NULL for all 37 and the biography holds the role as the hospital states
-- it. What it does publish for every one of them is a portrait.
--
-- Consulting hours appear on each profile and are not imported, for the same
-- reason they were left out of Saglam Aile: a timetable goes stale and nothing
-- here can take a booking.
--
-- One listing carries no specialty: Dr. Tamara Babayeva is a
-- "Hakim-koordinator", a doctor whose stated role is coordination, so nothing
-- is asserted about what she practises.
--
-- Data only.

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'OKİ Hospital' AS name, 'oki-hospital' AS slug,
    'F. Musayev küçəsi 27, Qusar' AS address, 'Qusar' AS city,
    '+994 50 597 16 47' AS phone,
    'OKİ Hospital, Qusar. Siyahı xəstəxananın okihospital.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'oki-hospital');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Dr. Afər Allahverdiyev', 'dr-afer-allahverdiyev', 'neurosurgery', NULL, NULL, 'Məsləhətçi-neyrocərrah.', '/doctor-photos/dr-afer-allahverdiyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Aqşin İsayev', 'dr-aqsin-isayev', 'anesthesiology', NULL, NULL, 'Anestezioloq-reanimatoloq.', '/doctor-photos/dr-aqsin-isayev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Araz Cəfərov', 'dr-araz-ceferov', 'orthopedics', NULL, NULL, 'Travmatoloq-ortoped, konsultant.', '/doctor-photos/dr-araz-ceferov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Arzu Vahidoğlu', 'dr-arzu-vahidoglu', 'cardiovascular-surgery', NULL, NULL, 'Ürək-damar cərrahı.', '/doctor-photos/dr-arzu-vahidoglu.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Azər Şahbazov', 'dr-azer-sahbazov', 'general-surgery', NULL, NULL, 'Cərrah.', '/doctor-photos/dr-azer-sahbazov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Cəmil Xalfayev', 'dr-cemil-xalfayev', 'neurology', NULL, NULL, 'Nevroloq, məsləhətçi.', '/doctor-photos/dr-cemil-xalfayev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Elman İbrahimov', 'dr-elman-ibrahimov', 'gastroenterology', NULL, NULL, 'Qastroenteroloq endoskopist, məsləhətçi.', '/doctor-photos/dr-elman-ibrahimov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Elmir Süleymanov', 'dr-elmir-suleymanov', 'orthopedics', NULL, NULL, 'Travmatoloq-ortoped.', '/doctor-photos/dr-elmir-suleymanov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Elçin Hacıyev', 'dr-elcin-haciyev', 'internal-medicine', NULL, NULL, 'Sığorta şöbəsinin müdiri, terapevt.', '/doctor-photos/dr-elcin-haciyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Fəridə Nəsirli', 'dr-feride-nesirli', 'endocrinology', NULL, NULL, 'Endokrinoloq, konsultant.', '/doctor-photos/dr-feride-nesirli.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Fəxrəddin Abdullayev', 'dr-fexreddin-abdullayev', 'internal-medicine', NULL, NULL, 'Terapevt.', '/doctor-photos/dr-fexreddin-abdullayev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Kamal Atakişiyev', 'dr-kamal-atakisiyev', 'radiology', NULL, NULL, 'Radioloq.', '/doctor-photos/dr-kamal-atakisiyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Mübariz Murtuzov', 'dr-mubariz-murtuzov', 'neurology', NULL, NULL, 'Nevroloq.', '/doctor-photos/dr-mubariz-murtuzov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Mübariz Qəhrəmanov', 'dr-mubariz-qehremanov', 'ophthalmology', NULL, NULL, 'Cərrah oftalmoloq, konsultant.', '/doctor-photos/dr-mubariz-qehremanov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Namiq Əhmədov', 'dr-namiq-ehmedov', 'neurosurgery', NULL, NULL, 'Neyrocərrah.', '/doctor-photos/dr-namiq-ehmedov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Nicat Muştaqov', 'dr-nicat-mustaqov', 'neurosurgery', NULL, NULL, 'Neyrocərrah.', '/doctor-photos/dr-nicat-mustaqov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Niyaməddin Əliyev', 'dr-niyameddin-eliyev', 'urology', NULL, NULL, 'Uroloq.', '/doctor-photos/dr-niyameddin-eliyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Nizami Rüstəmov', 'dr-nizami-rustemov', 'ent', NULL, NULL, 'Otorinolarinqoloq.', '/doctor-photos/dr-nizami-rustemov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Qardaşxan Məmmədov', 'dr-qardasxan-memmedov', 'urology', NULL, NULL, 'Uroloq, məsləhətçi.', '/doctor-photos/dr-qardasxan-memmedov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Rafiq Dəmirçalov', 'dr-rafiq-demircalov', 'ent', NULL, NULL, 'Otorinolarinqoloq.', '/doctor-photos/dr-rafiq-demircalov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Rafiq Xankişiyev', 'dr-rafiq-xankisiyev', 'anesthesiology', NULL, NULL, 'Anestezioloq-reanimatoloq.', '/doctor-photos/dr-rafiq-xankisiyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Ramil Əliyev', 'dr-ramil-eliyev', 'cardiovascular-surgery', NULL, NULL, 'Kardiocərrah.', '/doctor-photos/dr-ramil-eliyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Sənan Təhməzov', 'dr-senan-tehmezov', 'cardiology', NULL, NULL, 'İnvaziv kardioloq.', '/doctor-photos/dr-senan-tehmezov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Tamara Babayeva', 'dr-tamara-babayeva', NULL, NULL, NULL, 'Həkim-koordinator.', '/doctor-photos/dr-tamara-babayeva.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Tamerlan Şirinov', 'dr-tamerlan-sirinov', 'internal-medicine', NULL, NULL, 'Terapevt.', '/doctor-photos/dr-tamerlan-sirinov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Təyyar Əliyev', 'dr-teyyar-eliyev', 'dermatology', NULL, NULL, 'Məsləhətçi-dermatoloq.', '/doctor-photos/dr-teyyar-eliyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Vaqif Abdullayev', 'dr-vaqif-abdullayev', 'dermatology', NULL, NULL, 'Dermatologist.', '/doctor-photos/dr-vaqif-abdullayev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Vüsal Hacıbəyov', 'dr-vusal-hacibeyov', 'dentistry', NULL, NULL, 'Stomatoloq.', '/doctor-photos/dr-vusal-hacibeyov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Xanım Naqdəliyeva', 'dr-xanim-naqdeliyeva', 'laboratory', NULL, NULL, 'Həkim-laborant.', '/doctor-photos/dr-xanim-naqdeliyeva.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Zamin Bayramov', 'dr-zamin-bayramov', 'ophthalmology', NULL, NULL, 'Məsləhətçi, oftalmoloq.', '/doctor-photos/dr-zamin-bayramov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Ülkər Hüseynzadə', 'dr-ulker-huseynzade', 'gastroenterology', NULL, NULL, 'Qastroenteroloq-endoskopist.', '/doctor-photos/dr-ulker-huseynzade.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. İlham Kərimov', 'dr-ilham-kerimov', 'radiology', NULL, NULL, 'Baş həkim, Facharzt radioloq, Radiologiya şöbəsinin müdiri.', '/doctor-photos/dr-ilham-kerimov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. İradə İbramxəlilova', 'dr-irade-ibramxelilova', 'rheumatology', NULL, NULL, 'Revmatoloq.', '/doctor-photos/dr-irade-ibramxelilova.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. İsmayıl Aşurov', 'dr-ismayil-asurov', 'general-surgery', NULL, NULL, 'Ümumi cərrah.', '/doctor-photos/dr-ismayil-asurov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. İsmayıl Daşdiyev', 'dr-ismayil-dasdiyev', 'radiology', NULL, NULL, 'Radioloq (MRT, KT).', '/doctor-photos/dr-ismayil-dasdiyev.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Şəfiyulla Ağalarov', 'dr-sefiyulla-agalarov', 'pediatrics', NULL, NULL, 'Pediatr.', '/doctor-photos/dr-sefiyulla-agalarov.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW()),
    ('Dr. Əzinə Kərimova', 'dr-ezine-kerimova', 'obstetrics-gynecology', NULL, NULL, 'Ginekoloq.', '/doctor-photos/dr-ezine-kerimova.webp', 'az', 'UNCLAIMED', 'okihospital.az', 0, 1, NOW(), NOW())
;

CREATE TEMPORARY TABLE oki_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO oki_placement (doctor_slug, clinic_slug) VALUES
    ('dr-afer-allahverdiyev', 'oki-hospital'),
    ('dr-aqsin-isayev', 'oki-hospital'),
    ('dr-araz-ceferov', 'oki-hospital'),
    ('dr-arzu-vahidoglu', 'oki-hospital'),
    ('dr-azer-sahbazov', 'oki-hospital'),
    ('dr-cemil-xalfayev', 'oki-hospital'),
    ('dr-elman-ibrahimov', 'oki-hospital'),
    ('dr-elmir-suleymanov', 'oki-hospital'),
    ('dr-elcin-haciyev', 'oki-hospital'),
    ('dr-feride-nesirli', 'oki-hospital'),
    ('dr-fexreddin-abdullayev', 'oki-hospital'),
    ('dr-kamal-atakisiyev', 'oki-hospital'),
    ('dr-mubariz-murtuzov', 'oki-hospital'),
    ('dr-mubariz-qehremanov', 'oki-hospital'),
    ('dr-namiq-ehmedov', 'oki-hospital'),
    ('dr-nicat-mustaqov', 'oki-hospital'),
    ('dr-niyameddin-eliyev', 'oki-hospital'),
    ('dr-nizami-rustemov', 'oki-hospital'),
    ('dr-qardasxan-memmedov', 'oki-hospital'),
    ('dr-rafiq-demircalov', 'oki-hospital'),
    ('dr-rafiq-xankisiyev', 'oki-hospital'),
    ('dr-ramil-eliyev', 'oki-hospital'),
    ('dr-senan-tehmezov', 'oki-hospital'),
    ('dr-tamara-babayeva', 'oki-hospital'),
    ('dr-tamerlan-sirinov', 'oki-hospital'),
    ('dr-teyyar-eliyev', 'oki-hospital'),
    ('dr-vaqif-abdullayev', 'oki-hospital'),
    ('dr-vusal-hacibeyov', 'oki-hospital'),
    ('dr-xanim-naqdeliyeva', 'oki-hospital'),
    ('dr-zamin-bayramov', 'oki-hospital'),
    ('dr-ulker-huseynzade', 'oki-hospital'),
    ('dr-ilham-kerimov', 'oki-hospital'),
    ('dr-irade-ibramxelilova', 'oki-hospital'),
    ('dr-ismayil-asurov', 'oki-hospital'),
    ('dr-ismayil-dasdiyev', 'oki-hospital'),
    ('dr-sefiyulla-agalarov', 'oki-hospital'),
    ('dr-ezine-kerimova', 'oki-hospital')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM oki_placement p
JOIN doctor d ON d.slug = p.doctor_slug AND d.source = 'okihospital.az'
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE oki_placement;
