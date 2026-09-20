-- The 95 doctors MediClub publishes across its four Baku clinics.
--
-- Read from mediclub.az on 2026-09-19, in Azerbaijani. The sixth source.
--
-- The count is 95 and two independent readings of the site agree. Every card
-- on the directory page carries its clinic as a CSS class, and those tally to
-- 53 at the Poliklinika, 26 at the Hospital, 12 at KIDS and 9 at Dental; the
-- four clinic pages list exactly the same numbers. Five doctors work at two
-- clinics, which is why the placements come to 100 and the people to 95.
--
-- MediClub Ganja is offered in the site's own clinic filter and has no doctors
-- anywhere on the site - not on the directory, not on its clinic page. That is
-- the company's own state rather than a gap in what was read, so it gets no
-- clinic row until somebody is published there.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- This source publishes less about a doctor than any so far. There is no
-- education, no biography, no list of conferences - the page title says as
-- much, promising only length of service, the year they joined, and the
-- clinic. So qualifications is NULL for all 95, and the biography holds their
-- stated role, their specialty and the year they started here. What it does
-- publish plainly is experience, as a number of years, for every one of them.
--
-- Five doctors have no portrait. Their profiles carry the site's red
-- silhouette placeholder rather than a photograph, and the JPEG conversion of
-- it looks like any other image until it is opened, so it was caught by
-- reading the files rather than by fetching them. Their cards fall back to
-- initials. The other 90 portraits are ours, upscaled from 269x382, which is
-- the largest this site stores.
--
-- Three doctors carry a specialty code the site's own filter does not define,
-- spec-17. All three work at MediClub Dental and their profiles read
-- "Hekim-stomatoloq", so they are dentists. One listing has no specialty at
-- all: she is the hospital's general manager and heads its laboratory
-- department, so she is recorded under laboratory medicine, which is never
-- offered for booking.
--
-- Data only.

-- Industrial medicine is a department here, staffed by doctors who examine
-- employees rather than patients who chose them. It belongs in a complete
-- listing and nobody books it, like pathology.
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('occupational-medicine','Sənaye təbabəti','Occupational Medicine','Медицина труда',0,NULL,117);

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'MediClub Poliklinika' AS name, 'mediclub-poliklinika' AS slug, 'Üzeyir Hacıbəyli 119, Səbail, Bakı, AZ1010' AS address,
  'Səbail' AS district, 'Bakı' AS city, '(012) 497 09 11' AS phone,
  'MediClub Poliklinika. Siyahı klinikanın mediclub.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'mediclub-poliklinika');

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'MediClub Hospital' AS name, 'mediclub-hospital' AS slug, 'İslam Səfərli 33, Yasamal, Bakı, AZ1009' AS address,
  'Yasamal' AS district, 'Bakı' AS city, '(012) 310 09 11' AS phone,
  'MediClub Hospital. Siyahı klinikanın mediclub.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'mediclub-hospital');

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'MediClub KIDS Uşaq Poliklinikası' AS name, 'mediclub-kids' AS slug, 'İzzət Nəbiyev 30A, Səbail, Bakı, AZ1002' AS address,
  'Səbail' AS district, 'Bakı' AS city, '(012) 525 09 19' AS phone,
  'MediClub KIDS Uşaq Poliklinikası. Siyahı klinikanın mediclub.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'mediclub-kids');

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'MediClub Dental Stomatoloji Klinikası' AS name, 'mediclub-dental' AS slug, 'İzzət Nəbiyev 28A, Səbail, Bakı, AZ1073' AS address,
  'Səbail' AS district, 'Bakı' AS city, '(012) 497 11 41' AS phone,
  'MediClub Dental Stomatoloji Klinikası. Siyahı klinikanın mediclub.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'mediclub-dental');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Abbasova Günel Bayram', 'abbasova-gu-nel-bayram', 'laboratory', NULL, 17, 'Həkim-laborant. MediClub-da 2017-ci ildən çalışır.', '/doctor-photos/abbasova-gu-nel-bayram.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Abdullayev Vüqar Sahib', 'abdullayev-vuqar-sahib', 'emergency-medicine', NULL, 29, 'Təcili yardım üzrə baş mütəxəssis. Reanimasiya və təcili yardım həkimi. MediClub-da 2002-ci ildən çalışır.', '/doctor-photos/abdullayev-vuqar-sahib.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Abdullayeva Nəzakət Kamal', 'abdullayeva-nezaket-kamal', 'general-surgery', NULL, 38, 'Həkim-proktoloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/abdullayeva-nezaket-kamal.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Abdullayeva Ülviyyə Abdulla', 'abdullayeva-ulviyye-abdulla', 'obstetrics-gynecology', NULL, 26, 'Tibb üzrə fəlsəfə doktoru. Həkim-mama-ginekoloq. MediClub-da 2023-ci ildən çalışır.', '/doctor-photos/abdullayeva-ulviyye-abdulla.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Allahverdiyeva Sevinc Vahid', 'allahverdiyeva-sevinc-vahid', 'neurology', NULL, 15, 'Həkim-nevroloq. MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/allahverdiyeva-sevinc-vahid.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Axvərdiyeva Fidan Etibar', 'axverdiyeva-fidan-etibar', 'pediatrics', NULL, 5, 'Həkim-pediatr. MediClub-da 2025-ci ildən çalışır.', '/doctor-photos/axverdiyeva-fidan-etibar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Babayev Mireldar Seyidağa', 'babayev-mireldar-seyidaga', 'hematology', NULL, 50, 'Həkim-hematoloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/babayev-mireldar-seyidaga.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Babayeva Elnarə Baratxan', 'babayeva-elnare-baratxan', 'laboratory', NULL, 15, 'Həkim-laborant. MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/babayeva-elnare-baratxan.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Bağırov Ramin Xalıq', 'bagirov-ramin-xaliq', 'gastroenterology', NULL, 22, 'Həkin-endoskopist. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/bagirov-ramin-xaliq.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Bağıyev Ruslan Elman', 'bagiyev-ruslan-elman', 'emergency-medicine', NULL, 14, 'Təcili yardım xidmətinin həkimi. MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/bagiyev-ruslan-elman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Bayramova Samirə Şahzadə', 'bayramova-samire-sahzade', 'emergency-medicine', NULL, 23, 'Təcili yardım xidmətinin həkimi. MediClub-da 2018-ci ildən çalışır.', '/doctor-photos/bayramova-samire-sahzade.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Cahanqoşa Cavad Qurban', 'cahanqos-a-cavad-qurban', 'emergency-medicine', NULL, 24, 'Təcili yardım xidmətinin həkimi. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/cahanqos-a-cavad-qurban.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Cəfər Nərminə Haqverdi', 'cefer-nermine-haqverdi', 'pediatrics', NULL, 35, 'Həkim-pediatr. MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/cefer-nermine-haqverdi.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Cəfərova Lalə Rafiq', 'ceferova-lale-rafiq', 'pediatrics', NULL, 35, 'Pediatriya şöbəsinin rəhbəri. Həkim-pediatr. MediClub-da 2007-ci ildən çalışır.', '/doctor-photos/ceferova-lale-rafiq.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Cəmilov Rüfət Rüstəm', 'cemilov-rufet-rustem', 'cardiology', NULL, 23, 'Həkim-kardioloq. MediClub-da 2003-ci ildən çalışır.', '/doctor-photos/cemilov-rufet-rustem.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Deskubes Violetta Vladimirovna', 'deskubes-violetta-vladimirovna', 'radiology', NULL, 37, 'Funksional diaqnostika həkimi (rentqenoloq), Funksional diaqnostika həkimi (USM). Funksional diaqnostika həkimi (rentqenoloq). MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/deskubes-violetta-vladimirovna.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əhədova Arasta Ağabala', 'ehedova-arasta-agabala', 'occupational-medicine', NULL, 7, 'Sənaye təbabəti şöbəsinin həkimi. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/ehedova-arasta-agabala.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əhmədova Aytən Tahir', 'ehmedova-ayten-tahir', 'internal-medicine', NULL, 11, 'Həkim-terapevt. MediClub-da 2022-ci ildən çalışır.', '/doctor-photos/ehmedova-ayten-tahir.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əkbərova Günay Vəli', 'ekberova-gunay-veli', 'gastroenterology', NULL, 30, 'Həkim-qastroenteroloq. MediClub-da 2013-ci ildən çalışır.', '/doctor-photos/ekberova-gunay-veli.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əkbərova Nərmin Mehman', 'ekberova-nermin-mehman', 'dentistry', NULL, 5, 'Həkim-stomatoloq. spec-17. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/ekberova-nermin-mehman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əliyev Şamil Telman', 'eliyev-samil-telman', 'radiology', NULL, 18, 'Funksional diaqnostika həkimi. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/eliyev-samil-telman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əliyeva Nərgiz Valeh', 'eliyeva-nergiz-valeh', 'pediatrics', NULL, 11, 'Həkim-pediatr. MediClub-da 2022-ci ildən çalışır.', '/doctor-photos/eliyeva-nergiz-valeh.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əliyeva Yeganə İmaməli', 'eliyeva-yegane-imameli', 'pediatrics', NULL, 49, 'Həkim-pediatr. MediClub-da 2003-ci ildən çalışır.', '/doctor-photos/eliyeva-yegane-imameli.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əmiraslanova İlhamə Telman', 'emiraslanova-ilhame-telman', 'gastroenterology', NULL, 39, 'Tibb üzrə fəlsəfə doktoru. Həkim-qastroenteroloq-hepatoloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/emiraslanova-ilhame-telman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Ərzrumi Şəhla Abbasağa', 'erzrumi-sehla-abbasaga', 'pediatric-intensive-care', NULL, 36, 'Həkim-pediatr-reanimatoloq. MediClub-da 2008-ci ildən çalışır.', '/doctor-photos/erzrumi-sehla-abbasaga.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əsgərli Aysel Etibar', 'esgerli-aysel-etibar', 'laboratory', NULL, 4, 'Həkim-laborant. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/esgerli-aysel-etibar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Əzimova Nigar Kamran', 'ezimova-nigar-kamran', 'radiology', NULL, 23, 'MediClub Poliklinikanın baş həkimi, Tibb üzrə fəlsəfə doktoru. Funksional diaqnostika həkimi. MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/ezimova-nigar-kamran.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Hacıyeva Nəsibə Əbülfəz', 'haciyeva-nesibe-ebulfez', 'endocrinology', NULL, 9, 'Həkim-endokrinoloq. MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/haciyeva-nesibe-ebulfez.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Həmidov Rifah Ramazan', 'hemidov-rifah-ramazan', NULL, NULL, 10, 'Stasionar şöbənin həkimi. MediClub-da 2026-ci ildən çalışır.', NULL, 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Həmidova Jalə Ələddin', 'hemidova-jale-eleddin', 'occupational-medicine', NULL, 9, 'Sənaye təbabəti şöbəsinin həkimi. MediClub-da 2025-ci ildən çalışır.', '/doctor-photos/hemidova-jale-eleddin.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Həmidova Viktoriya Leonidovna', 'hemidova-viktoriya-leonidovna', 'radiology', NULL, 43, 'Funksional diaqnostika həkimi (rentqenoloq). MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/hemidova-viktoriya-leonidovna.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Hüseynova Aynur Tacirovna', 'hu-seynova-aynur-tacirovna', 'laboratory', NULL, 17, 'Həkim-laborant. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/hu-seynova-aynur-tacirovna.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Hüseynova Səadət Yaqub', 'huseynova-seadet-yaqub', 'pediatrics', NULL, 24, 'Həkim-pediatr. MediClub-da 2023-ci ildən çalışır.', '/doctor-photos/huseynova-seadet-yaqub.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Hüseynova Tamara Hafiz', 'huseynova-tamara-hafiz', 'endocrinology', NULL, 18, 'Həkim-endokrinoloq. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/huseynova-tamara-hafiz.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İbrahimov Turan Elşən', 'ibrahimov-turan-elsen', 'emergency-medicine', NULL, 1, 'Təcili yardım xidmətinin həkimi. MediClub-da 2025-ci ildən çalışır.', '/doctor-photos/ibrahimov-turan-elsen.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İbrahimova Nigar İbrahim', 'ibrahimova-nigar-ibrahim', 'emergency-medicine', NULL, 30, 'Təcili yardım xidmətinin həkimi-pediatrı. MediClub-da 2018-ci ildən çalışır.', '/doctor-photos/ibrahimova-nigar-ibrahim.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İbrahimova Tahirə Tahir', 'ibrahimova-tahire-tahir', 'pediatrics', NULL, 47, 'Həkim-pediatr. MediClub-da 2012-ci ildən çalışır.', '/doctor-photos/ibrahimova-tahire-tahir.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İbrahimova Zemfira Allahverdi', 'ibrahimova-zemfira-allahverdi', 'radiology', NULL, 35, 'Funksional diaqnostika həkimi (USM). MediClub-da 2007-ci ildən çalışır.', '/doctor-photos/ibrahimova-zemfira-allahverdi.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İbrahimova Zemfira Məmməd', 'ibrahimova-zemfira-memmed', 'radiology', NULL, 24, 'Funksional diaqnostika həkimi (USM). MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/ibrahimova-zemfira-memmed.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İçkovskiy Oleq', 'ickovskiy-oleq', 'dentistry', NULL, 35, 'Həkim-stomatoloq (cərrah, implantoloq). MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/ickovskiy-oleq.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İdrisova Səbinə Elbrus', 'idrisova-sebine-elbrus', 'internal-medicine', NULL, 25, 'Həkim-terapevt. MediClub-da 2019-ci ildən çalışır.', '/doctor-photos/idrisova-sebine-elbrus.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İmanov Kənan İslam', 'imanov-kenan-islam', 'urology', NULL, 21, 'Həkim-uroloq. MediClub-da 2015-ci ildən çalışır.', '/doctor-photos/imanov-kenan-islam.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İsayeva Vəfa Atif', 'isayeva-vefa-atif', 'ent', NULL, 26, 'Həkim-otorinolarinqoloq. MediClub-da 2009-ci ildən çalışır.', '/doctor-photos/isayeva-vefa-atif.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İsmayılov Vüqar Azər', 'ismayilov-vuqar-azer', 'dentistry', NULL, 13, 'Həkim-stomatoloq (ortodont). MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/ismayilov-vuqar-azer.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('İsmayılova Günay İsmayıl', 'ismayilova-gunay-ismayil', 'cardiology', NULL, 19, 'Həkim-kardioloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/ismayilova-gunay-ismayil.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Keberlinskaya Nigar Kamal', 'keberlinskaya-nigar-kamal', 'emergency-medicine', NULL, 31, 'Təcili yardım xidmətinin həkimi-pediatrı. MediClub-da 2009-ci ildən çalışır.', '/doctor-photos/keberlinskaya-nigar-kamal.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Korobkо Alena', 'korobk-alena', 'dermatology', NULL, 19, 'Həkim-dermatoloq-kosmetoloq. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/korobk-alena.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Mahmudov Mətin İftixar', 'mahmudov-metin-iftixar', 'emergency-medicine', NULL, 12, 'Təcili yardım xidmətinin həkimi. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/mahmudov-metin-iftixar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədov Şəhriyar Etibar', 'memmedov-sehriyar-etibar', 'emergency-medicine', NULL, 18, 'Təcili yardım xidmətinin həkimi-pediatrı. MediClub-da 2014-ci ildən çalışır.', '/doctor-photos/memmedov-sehriyar-etibar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədova Aytən Şahin', 'memmedova-ayten-sahin', 'pediatrics', NULL, 27, 'Həkim-pediatr. MediClub-da 2013-ci ildən çalışır.', '/doctor-photos/memmedova-ayten-sahin.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədova Kəmalə Rüfət', 'memmedova-kemale-rufet', 'dentistry', NULL, 13, 'Həkim-stomatoloq (terapevt, ortoped, uşaq stomatoloqu). MediClub-da 2018-ci ildən çalışır.', '/doctor-photos/memmedova-kemale-rufet.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədova Tünzalə Novruz', 'memmedova-tunzale-novruz', 'mammology', NULL, 18, 'Həkim-mammoloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/memmedova-tunzale-novruz.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədova Vüsalə Zakir', 'memmedova-vusale-zakir', 'emergency-medicine', NULL, 13, 'Təcili yardım xidmətinin həkimi-pediatrı. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/memmedova-vusale-zakir.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Məmmədova Xəyalə Elman', 'memmedova-xeyale-elman', 'dermatology', NULL, 9, 'Həkim-dermatoloq. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/memmedova-xeyale-elman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Mir-Hüseynov Elçin Oqtay', 'mir-huseynov-elcin-oqtay', 'dentistry', NULL, 29, 'Azərbaycan Respublikasının əməkdar həkimi. spec-17. MediClub-da 2005-ci ildən çalışır.', '/doctor-photos/mir-huseynov-elcin-oqtay.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Miskərli Murad Eldar', 'miskerli-murad-eldar', 'anesthesiology', NULL, 18, 'Həkim-anestezioloq-reanimatoloq. MediClub-da 2026-ci ildən çalışır.', NULL, 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Musayev Umud Musa', 'musayev-umud-musa', 'pediatric-surgery', NULL, 22, 'Həkim uşaq-cərrahı. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/musayev-umud-musa.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Müseyibova Kəmalə Fəxrəddin', 'museyibova-kemale-fexreddin', 'dentistry', NULL, 30, 'Həkim-stomatoloq (terapevt, uşaq stomatoloqu). MediClub-da 2007-ci ildən çalışır.', '/doctor-photos/museyibova-kemale-fexreddin.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nadirov Namiq Səfqulu', 'nadirov-namiq-sefqulu', 'orthopedics', NULL, 45, 'Həkim-travmatoloq. MediClub-da 2007-ci ildən çalışır.', '/doctor-photos/nadirov-namiq-sefqulu.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Namazova Kəmalə Novruz', 'namazova-kemale-novruz', 'anesthesiology', NULL, 25, 'Həkim-anestezioloq-reanimatoloq. MediClub-da 2018-ci ildən çalışır.', '/doctor-photos/namazova-kemale-novruz.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nəbiyeva Şəfəq Fazil', 'nebiyeva-sefeq-fazil', 'laboratory', NULL, 30, 'Həkim-laborant, bakterioloq. MediClub-da 2008-ci ildən çalışır.', '/doctor-photos/nebiyeva-sefeq-fazil.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nəcəfbəyli Nigar Valid', 'necefbeyli-nigar-valid', 'neurosurgery', NULL, 15, 'Neyrocərrah, həkim-nevroloq, kliniki psixoloq. MediClub-da 2023-ci ildən çalışır.', '/doctor-photos/necefbeyli-nigar-valid.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nəsibova Esmira Mirzə', 'nesibova-esmira-mirze', 'anesthesiology', NULL, 40, 'Həkim-anestezioloq-reanimatoloq. MediClub-da 2024-ci ildən çalışır.', NULL, 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nəzirov Rüfət Balaqardaş', 'nezirov-rufet-balaqardas', 'general-surgery', NULL, 21, 'Həkim-cərrah. MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/nezirov-rufet-balaqardas.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Novruzova Aynur Valeh', 'novruzova-aynur-valeh', 'ophthalmology', NULL, 29, 'Həkim-oftalmoloq. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/novruzova-aynur-valeh.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Novruzova Gövhər Sərxan', 'novruzova-go-vher-serxan', 'laboratory', NULL, 39, 'Həkim-laborant. MediClub-da 2012-ci ildən çalışır.', '/doctor-photos/novruzova-go-vher-serxan.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Nuriyeva Kəmalə Aqil', 'nuriyeva-kemale-aqil', 'pediatrics', NULL, 26, 'Həkim-pediatr, Təcili yardım xidmətinin həkimi-pediatrı. Həkim-pediatr. MediClub-da 2011-ci ildən çalışır.', '/doctor-photos/nuriyeva-kemale-aqil.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Obeydat İnas Vail', 'obeydat-inas-vail', 'dentistry', NULL, 5, 'Həkim-stomatoloq. spec-17. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/obeydat-inas-vail.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Qaralova Sevinc Asbandiyar', 'qaralova-sevinc-asbandiyar', 'laboratory', NULL, 34, 'Həkim-laborant. MediClub-da 1999-ci ildən çalışır.', '/doctor-photos/qaralova-sevinc-asbandiyar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Qarayeva Nənəqız Qəhraman', 'qarayeva-neneqiz-qehraman', 'laboratory', NULL, 21, 'Həkim-laborant. MediClub-da 2015-ci ildən çalışır.', '/doctor-photos/qarayeva-neneqiz-qehraman.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Qasımova Sevinc Həmidağa', 'qasimova-sevinc-hemidaga', 'laboratory', NULL, 28, 'MediClub Hospitalın baş meneceri, MediClub Laboratoriyasının şöbə müdiri. MediClub-da 2015-ci ildən çalışır.', '/doctor-photos/qasimova-sevinc-hemidaga.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Qədirova Elvira Şahmar', 'qedirova-elvira-sahmar', 'obstetrics-gynecology', NULL, 24, 'Həkim-mama-ginekoloq. MediClub-da 2016-ci ildən çalışır.', '/doctor-photos/qedirova-elvira-sahmar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Quliyeva Suğra Ağasəlim', 'quliyeva-sugra-agaselim', 'neurology', NULL, 12, 'Həkim-nevroloq. MediClub-da 2017-ci ildən çalışır.', '/doctor-photos/quliyeva-sugra-agaselim.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Quliyeva Ülviyyə Nizami', 'quliyeva-ulviyye-nizami', 'neurology', NULL, 18, 'Həkim-nevroloq. MediClub-da 2015-ci ildən çalışır.', '/doctor-photos/quliyeva-ulviyye-nizami.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Ramazanova Nərgiz Fuad', 'ramazanova-nergiz-fuad', 'dentistry', NULL, 16, 'MediClub Dental stomatoloji klinikasının baş meneceri. Həkim-stomatoloq (cərrah). MediClub-da 2024-ci ildən çalışır.', NULL, 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rəfizadə Sevda Kərim', 'refizade-sevda-kerim', 'internal-medicine', NULL, 37, 'Həkim-terapevt. MediClub-da 2007-ci ildən çalışır.', '/doctor-photos/refizade-sevda-kerim.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rəhimov Orxan Mehdi', 'rehimov-orxan-mehdi', 'dentistry', NULL, 19, 'Həkim-stomatoloq (cərrah, ortoped, implantoloq). MediClub-da 2025-ci ildən çalışır.', '/doctor-photos/rehimov-orxan-mehdi.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rəhmətov Kamin Kamal', 'rehmetov-kamin-kamal', 'emergency-medicine', NULL, 9, 'Təcili yardım xidmətinin həkimi. MediClub-da 2022-ci ildən çalışır.', '/doctor-photos/rehmetov-kamin-kamal.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rəsulova Samirə Şahzadə', 'resulova-samire-sahzade', 'laboratory', NULL, 17, 'Həkim-laborant. MediClub-da 2010-ci ildən çalışır.', '/doctor-photos/resulova-samire-sahzade.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rüstəmli Nərmin Mobil', 'rustemli-nermin-mobil', 'anesthesiology', NULL, 8, 'Həkim-anestezioloq-reanimatoloq. MediClub-da 2022-ci ildən çalışır.', '/doctor-photos/rustemli-nermin-mobil.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rüstəmov Həsrət Qurbanəli', 'rustemov-hesret-qurbaneli', 'emergency-medicine', NULL, 22, 'Təcili yardım xidmətinin həkimi. MediClub-da 2018-ci ildən çalışır.', '/doctor-photos/rustemov-hesret-qurbaneli.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Rzayeva Könül Aydın', 'rzayeva-konul-aydin', 'occupational-medicine', NULL, 30, 'Sənaye təbabəti şöbəsinin profilaktik müayinələr üzrə aparıcı mütəxəssis. MediClub-da 1998-ci ildən çalışır.', '/doctor-photos/rzayeva-konul-aydin.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Salahov Yaşar Adil', 'salahov-yasar-adil', 'ent', NULL, 31, 'Həkim-otorinolarinqoloq. MediClub-da 2009-ci ildən çalışır.', '/doctor-photos/salahov-yasar-adil.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Salamov Tale Akif', 'salamov-tale-akif', 'radiology', NULL, 22, 'Funksional diaqnostika həkimi (USM). MediClub-da 2010-ci ildən çalışır.', '/doctor-photos/salamov-tale-akif.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Səfərov Elbrus Mehrac', 'seferov-elbrus-mehrac', 'emergency-medicine', NULL, 21, 'Təcili yardım xidmətinin həkimi. MediClub-da 2020-ci ildən çalışır.', NULL, 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Səfərova İradə Zülfüqar', 'seferova-i-rade-zu-lfu-qar', 'ophthalmology', NULL, 50, 'Həkim-oftalmoloq. MediClub-da 2021-ci ildən çalışır.', '/doctor-photos/seferova-i-rade-zu-lfu-qar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Səmədli Fərhad Əlövsət', 'semedli-ferhad-elovset', 'cardiology', NULL, 22, 'Həkim-kardioloq. MediClub-da 2015-ci ildən çalışır.', '/doctor-photos/semedli-ferhad-elovset.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Şərifzadə Lalə Namiq', 'serifzade-lale-namiq', 'obstetrics-gynecology', NULL, 32, 'Həkim-ginekoloq. MediClub-da 2024-ci ildən çalışır.', '/doctor-photos/serifzade-lale-namiq.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Vəliyeva Günay Azər', 'veliyeva-gunay-azer', 'laboratory', NULL, 11, 'Həkim-laborant. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/veliyeva-gunay-azer.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Xanməmmədova Səidə Qiyas', 'xanmemmedova-seide-qiyas', 'pediatrics', NULL, 35, 'Həkim-pediatr. MediClub-da 2022-ci ildən çalışır.', '/doctor-photos/xanmemmedova-seide-qiyas.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Xasiyev Arif İsfəndiyar', 'xasiyev-arif-isfendiyar', 'anesthesiology', NULL, 44, 'Həkim-anestezioloq-reanimatoloq. MediClub-da 2002-ci ildən çalışır.', '/doctor-photos/xasiyev-arif-isfendiyar.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Yusibova Günel Nadir', 'yusibova-gunel-nadir', 'laboratory', NULL, 11, 'Həkim-laborant. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/yusibova-gunel-nadir.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Yusifov Fuad Sabir', 'yusifov-fuad-sabir', 'emergency-medicine', NULL, 25, 'Təcili yardım xidmətinin həkimi. MediClub-da 2020-ci ildən çalışır.', '/doctor-photos/yusifov-fuad-sabir.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Zeynalov Bəxtiyar Fəxrəddin', 'zeynalov-bextiyar-fexreddin', 'pediatrics', NULL, 31, 'MediClub KIDS uşaq klinikasının baş həkimi, Tibb elmləri doktoru. Həkim-pediatr. MediClub-da 2026-ci ildən çalışır.', '/doctor-photos/zeynalov-bextiyar-fexreddin.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW()),
    ('Zeynalova Rəna Səlim', 'zeynalova-rena-selim', 'pediatrics', NULL, 44, 'Həkim-pediatr. MediClub-da 2001-ci ildən çalışır.', '/doctor-photos/zeynalova-rena-selim.webp', 'az', 'UNCLAIMED', 'mediclub.az', 0, 1, NOW(), NOW())
;

-- Five of these doctors hold clinics at two of the four sites.
CREATE TEMPORARY TABLE mediclub_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO mediclub_placement (doctor_slug, clinic_slug) VALUES
    ('abbasova-gu-nel-bayram', 'mediclub-hospital'),
    ('abdullayev-vuqar-sahib', 'mediclub-poliklinika'),
    ('abdullayeva-nezaket-kamal', 'mediclub-poliklinika'),
    ('abdullayeva-ulviyye-abdulla', 'mediclub-poliklinika'),
    ('allahverdiyeva-sevinc-vahid', 'mediclub-poliklinika'),
    ('axverdiyeva-fidan-etibar', 'mediclub-kids'),
    ('babayev-mireldar-seyidaga', 'mediclub-poliklinika'),
    ('babayeva-elnare-baratxan', 'mediclub-kids'),
    ('bagirov-ramin-xaliq', 'mediclub-hospital'),
    ('bagiyev-ruslan-elman', 'mediclub-poliklinika'),
    ('bayramova-samire-sahzade', 'mediclub-poliklinika'),
    ('cahanqos-a-cavad-qurban', 'mediclub-poliklinika'),
    ('cefer-nermine-haqverdi', 'mediclub-kids'),
    ('ceferova-lale-rafiq', 'mediclub-hospital'),
    ('cemilov-rufet-rustem', 'mediclub-poliklinika'),
    ('deskubes-violetta-vladimirovna', 'mediclub-poliklinika'),
    ('ehedova-arasta-agabala', 'mediclub-poliklinika'),
    ('ehmedova-ayten-tahir', 'mediclub-poliklinika'),
    ('ekberova-gunay-veli', 'mediclub-poliklinika'),
    ('ekberova-nermin-mehman', 'mediclub-dental'),
    ('eliyev-samil-telman', 'mediclub-hospital'),
    ('eliyeva-nergiz-valeh', 'mediclub-kids'),
    ('eliyeva-yegane-imameli', 'mediclub-kids'),
    ('emiraslanova-ilhame-telman', 'mediclub-poliklinika'),
    ('erzrumi-sehla-abbasaga', 'mediclub-hospital'),
    ('esgerli-aysel-etibar', 'mediclub-hospital'),
    ('ezimova-nigar-kamran', 'mediclub-poliklinika'),
    ('haciyeva-nesibe-ebulfez', 'mediclub-poliklinika'),
    ('hemidov-rifah-ramazan', 'mediclub-hospital'),
    ('hemidova-jale-eleddin', 'mediclub-poliklinika'),
    ('hemidova-viktoriya-leonidovna', 'mediclub-poliklinika'),
    ('hu-seynova-aynur-tacirovna', 'mediclub-hospital'),
    ('huseynova-seadet-yaqub', 'mediclub-hospital'),
    ('huseynova-tamara-hafiz', 'mediclub-poliklinika'),
    ('ibrahimov-turan-elsen', 'mediclub-poliklinika'),
    ('ibrahimova-nigar-ibrahim', 'mediclub-poliklinika'),
    ('ibrahimova-tahire-tahir', 'mediclub-hospital'),
    ('ibrahimova-zemfira-allahverdi', 'mediclub-poliklinika'),
    ('ibrahimova-zemfira-memmed', 'mediclub-poliklinika'),
    ('ibrahimova-zemfira-memmed', 'mediclub-hospital'),
    ('ickovskiy-oleq', 'mediclub-dental'),
    ('idrisova-sebine-elbrus', 'mediclub-poliklinika'),
    ('imanov-kenan-islam', 'mediclub-poliklinika'),
    ('isayeva-vefa-atif', 'mediclub-poliklinika'),
    ('isayeva-vefa-atif', 'mediclub-kids'),
    ('ismayilov-vuqar-azer', 'mediclub-dental'),
    ('ismayilova-gunay-ismayil', 'mediclub-poliklinika'),
    ('keberlinskaya-nigar-kamal', 'mediclub-poliklinika'),
    ('korobk-alena', 'mediclub-poliklinika'),
    ('mahmudov-metin-iftixar', 'mediclub-poliklinika'),
    ('memmedov-sehriyar-etibar', 'mediclub-poliklinika'),
    ('memmedova-ayten-sahin', 'mediclub-kids'),
    ('memmedova-kemale-rufet', 'mediclub-dental'),
    ('memmedova-tunzale-novruz', 'mediclub-poliklinika'),
    ('memmedova-vusale-zakir', 'mediclub-poliklinika'),
    ('memmedova-xeyale-elman', 'mediclub-poliklinika'),
    ('mir-huseynov-elcin-oqtay', 'mediclub-dental'),
    ('miskerli-murad-eldar', 'mediclub-hospital'),
    ('musayev-umud-musa', 'mediclub-poliklinika'),
    ('musayev-umud-musa', 'mediclub-hospital'),
    ('museyibova-kemale-fexreddin', 'mediclub-dental'),
    ('nadirov-namiq-sefqulu', 'mediclub-poliklinika'),
    ('namazova-kemale-novruz', 'mediclub-hospital'),
    ('nebiyeva-sefeq-fazil', 'mediclub-hospital'),
    ('necefbeyli-nigar-valid', 'mediclub-poliklinika'),
    ('nesibova-esmira-mirze', 'mediclub-hospital'),
    ('nezirov-rufet-balaqardas', 'mediclub-poliklinika'),
    ('nezirov-rufet-balaqardas', 'mediclub-hospital'),
    ('novruzova-aynur-valeh', 'mediclub-poliklinika'),
    ('novruzova-go-vher-serxan', 'mediclub-hospital'),
    ('nuriyeva-kemale-aqil', 'mediclub-poliklinika'),
    ('obeydat-inas-vail', 'mediclub-dental'),
    ('qaralova-sevinc-asbandiyar', 'mediclub-hospital'),
    ('qarayeva-neneqiz-qehraman', 'mediclub-hospital'),
    ('qasimova-sevinc-hemidaga', 'mediclub-hospital'),
    ('qedirova-elvira-sahmar', 'mediclub-poliklinika'),
    ('quliyeva-sugra-agaselim', 'mediclub-poliklinika'),
    ('quliyeva-sugra-agaselim', 'mediclub-kids'),
    ('quliyeva-ulviyye-nizami', 'mediclub-kids'),
    ('ramazanova-nergiz-fuad', 'mediclub-dental'),
    ('refizade-sevda-kerim', 'mediclub-poliklinika'),
    ('rehimov-orxan-mehdi', 'mediclub-dental'),
    ('rehmetov-kamin-kamal', 'mediclub-poliklinika'),
    ('resulova-samire-sahzade', 'mediclub-hospital'),
    ('rustemli-nermin-mobil', 'mediclub-hospital'),
    ('rustemov-hesret-qurbaneli', 'mediclub-poliklinika'),
    ('rzayeva-konul-aydin', 'mediclub-poliklinika'),
    ('salahov-yasar-adil', 'mediclub-poliklinika'),
    ('salamov-tale-akif', 'mediclub-poliklinika'),
    ('seferov-elbrus-mehrac', 'mediclub-poliklinika'),
    ('seferova-i-rade-zu-lfu-qar', 'mediclub-poliklinika'),
    ('semedli-ferhad-elovset', 'mediclub-poliklinika'),
    ('serifzade-lale-namiq', 'mediclub-poliklinika'),
    ('veliyeva-gunay-azer', 'mediclub-hospital'),
    ('xanmemmedova-seide-qiyas', 'mediclub-kids'),
    ('xasiyev-arif-isfendiyar', 'mediclub-hospital'),
    ('yusibova-gunel-nadir', 'mediclub-hospital'),
    ('yusifov-fuad-sabir', 'mediclub-poliklinika'),
    ('zeynalov-bextiyar-fexreddin', 'mediclub-kids'),
    ('zeynalova-rena-selim', 'mediclub-kids')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM mediclub_placement p
JOIN doctor d ON d.slug = p.doctor_slug AND d.source = 'mediclub.az'
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE mediclub_placement;
