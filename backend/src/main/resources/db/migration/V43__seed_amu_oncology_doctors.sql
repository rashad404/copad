-- The twelve doctors the ATU Oncology Clinic publishes, from its own directory.
--
-- Read from oncology.amu.edu.az on 2026-09-19, in Azerbaijani, which is the
-- only language that site publishes profiles in. The clinic belongs to
-- Azerbaijan Medical University and is the second hospital in this directory.
--
-- The total is twelve and was established rather than assumed, which is the
-- lesson V39 cost: the "Bizim hekimler" list carries twelve profiles at
-- /az/pages/66/doctor/<id>, the ids run 2 to 15 with 1, 4 and 8 absent, and
-- every filter combination the page offers - five departments, two specialties
-- - adds back up to exactly those twelve. Probing the missing ids returns the
-- empty list rather than a profile, so they are gaps in the site's own
-- numbering and not doctors we failed to read.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0: the listing repeats what the clinic already publishes,
-- it does not assert that we checked anything, and it cannot take an
-- appointment nobody is watching. A doctor who claims their listing goes to
-- PENDING and is reviewed like any other claim.
--
-- What was left out, on purpose:
--
--   - Party membership. Five of these profiles list "Yeni Azerbaycan
--     Partiyasi" under memberships. It is published, and it is not medical;
--     repeating a political affiliation beside ESMO and NCCN on a health
--     directory would read as a statement we have no business making. Every
--     scientific and professional membership is kept.
--   - Bibliographies. The profiles carry publication lists running to fifteen
--     entries; they are a researcher's CV, not something a patient choosing a
--     doctor can use. Education, posts held and clinical training are kept.
--   - The clinic's department staff pages, which list a further twenty-five or
--     so people - including head nurses and laboratory assistants - as plain
--     names with no profile, no department-level specialty and no photograph.
--     Separating the doctors from the rest of the staff there needs a decision
--     this migration should not make quietly.
--
-- Three doctors have no portrait because their profiles carry the site's own
-- "no photo" placeholder, and one - Indira Seferova - has a photograph and a
-- name and nothing else at all. Two more publish no education, so their
-- experience is recorded and years_experience stays NULL rather than guessed.
-- Everywhere else years_experience is years since the first medical degree
-- ended, the same rule the 112 existing rows were built with.
--
-- Data only.

-- Onkoloq-mammoloq is how this clinic describes two of its doctors, and it is
-- what a woman looking for a breast specialist here actually searches for.
-- Mapping it onto the existing breast-surgery code would assert surgery the
-- source does not claim, and mapping it onto oncology would lose the one
-- distinction the clinic bothered to draw.
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('mammology','Mammologiya','Mammology','Маммология',1,'general',110);

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'Azərbaycan Tibb Universitetinin Onkoloji Klinikası' AS name,
    'atu-onkoloji-klinika' AS slug,
    'S. Vurğun küçəsi 208, Bakı' AS address,
    'Bakı' AS city,
    '+994 12 541 59 76' AS phone,
    'Azərbaycan Tibb Universitetinin Onkoloji Klinikası, Bakı. Siyahı klinikanın oncology.amu.edu.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'atu-onkoloji-klinika');

SET @clinic_id = (SELECT id FROM clinic WHERE slug = 'atu-onkoloji-klinika');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Abuzər Qazıyev', 'abuzer-qaziyev', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1983-1989) | KTTYX - İnternatura (1989-1990) | N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutunun Onkologiya kafedrası - Aspirantura (1992-1995) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Doktorant (1999-2004)', 37, 'İş təcrübəsi: Həkim-cərrah, 1 saylı Sumqayıt şəhər poliklinikası (1990-1992); Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1995-2005); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2010); Professor, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2010-hal- hazıradək); Tədris hissə müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2010); Dekan, Azərbaycan Tibb Universitetinin I müalicə-profilaktika fakultəsi (2011-2016); Tədris və elmi işlər üzrə müavin, Azərbaycan Tibb Universitetinin Onkoloji klinikası (2016-hal- hazıradək); Tədris hissə müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2016-hal- hazıradək). Üzvlük: Azərbaycan Onkoloqlar Cəmiyyəti.', NULL, 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Əhliman Əmiraslanov', 'ehliman-emiraslanov', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1965-1971) | SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi Eksperimental və Kliniki Onkologiya İnstitutu - Aspirant (1974-1977)', 55, 'İş təcrübəsi: Tibb qardaşı, Kliniki Onkoloji xəstəxana (1970-1971); Həkim-ordinator, şöbə müdiri, Kliniki Onkoloji xəstəxana (1971-1974); Kiçik elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, reabilitasiya şöbəsi (1977-1979); Kiçik elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1979-1981); Aparıcı elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1987-1989); Baş elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1989-1994); Rektor, Azərbaycan Tibb Universiteti (1992-2015); Kafedra müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1993-hal-hazıradək); Direktor, Azərbaycan Tibb Universitetinin Onkoloji klinikası (2007-hal-hazıradək); "Bioloji elmlər" bölməsinin akdemik katibi, Azərbaycan Milli Elmlər Akademiyası (2007-hal-hazıradək); Milli Məclisin deputatı, Milli Məclisin Səhiyyə Komitəsinin sədri, Azərbaycan Respublikası Milli Məclisi (2015-hal-hazıradək). Üzvlük: Azərbaycan Milli Elmlər Akademiyasının akademiki; Azərbaycan Milli Elmlər Akademiyası "Boloji elmlər" bölməsinin akademik-katibi; UNESKO xətti üzrə "Bioetika, Elmi biliklərin VI texnologiyaların etikası" Azərbaycan Milli Komitəsinin sədr müavini; Avropa Tibbi-Onkologiya Cəmiyyətinin həqiqi üzvü; Dünya Azərbaycanlılarının III qurultayında Dünya Azərbaycanlılarının Əlaqələndirilmə Şurasının üzvü; Azərbaycan Respublikasının Prezidenti yanında Bilik Fondunun Himayəçilik Şurasının üzvü; UNESKO-nun eksperti; Türkdilli Ölkələrin Parlament Assambleyasının Parlamentlərarası Komissiyasının (TÜRKPA) sədri; Müstəqil Dövlətlər Birliyinin iştirakçı dövlətlərinin Parlamentlərarası Assambleya şurasının üzvü; Ümumdünya Ortoped-Travmatoloq və Onkoloqlar Assosiasiyasının üzvü; Yunanıstan, Çexiya, Macarıstan Onkoloqlar Cəmiyyətlərinin üzvü; Avropa Bərpa Cərrahlığı Assosiasiyasının fəxri üzvü; Amerika Klinik Onkologiya Cəmiyyətinin aktiv üzvü; RF Təbiət Elmləri Akademiyasının üzvü; Polşa Tibb Elmlər Akademiyasının həqiqi üzvü; Rusiya Tibb Elmlər Akademiyasının həqiqi üzvü; Rusiya Elmlər Akademiyasının xarici üzvü.', '/doctor-photos/ehliman-emiraslanov.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Əkbər Mirzə oğlu İbrahimov', 'ekber-mirze-oglu-ibrahimov', 'oncology', NULL, NULL, 'İş təcrübəsi: Uzmanlıq, Hacettepe Universiteti (2012-2017); baş laborant, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2018 - 2025); Asissent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2025 hal-hazıradək).', '/doctor-photos/ekber-mirze-oglu-ibrahimov.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Elçin Hüseynov', 'elcin-huseynov', 'oncology', 'Azərbaycan Tibb Universiteti - Onkoloq (1994-2000)', 26, 'İş təcrübəsi: Assistent, Azərbaycan Tibb.Univ. Onkologiya kafedrası assistenti (2000-dən hal-hazıra qədər). Təlimlər: Ixtisaslaşma kursu (2009); İxtisaslaşma kursu (2011). Üzvlük: Avropa Tibbi Onkoloqlar Cəmiyyətinin üzvü (ESMO).', NULL, 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Elnur İbrahimov', 'elnur-ibrahimov', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1979-1985) | Bakı şəhəri Təcili yardım stansiyası - Internatura kursu (1985-1986) | N.N. Bloxin adına Ümumittifaq Onkoloji Elmi Mərkəzi - Klinik ordinator (1989-1991) | N.N. Bloxin adına Ümumittifaq Onkoloji Elmi Mərkəzi - Dissertant (1991-1992)', 41, 'İş təcrübəsi: Terapevd-onkoloq, Sabirabad rayon Mərkəzi Xəstəxanası (1986-1989); Kişik elmi işçi, Milli Onkologiya Mərkəzi (1992-1993); Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1993-2005); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-hal-hazıradək); II cərrahiyyə şöbəsinin dayaq-hərəkət bölməsinin müdiri, ATU-nun Onkoloji klinikası (2007 hal-hazıradək). Üzvlük: ESMO; Azərbaycan Onkoloqlar Cəmiyyəti; Azərbaycan Travmatoloq və ortopedlər Assosiasiyası; Sarkomaların öyrənilməsinə dair Şərqi Avropa Qrupu.', NULL, 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('İndira Adil qızı Səfərova', 'indira-adil-qizi-seferova', 'mammology', NULL, NULL, NULL, '/doctor-photos/indira-adil-qizi-seferova.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Namiq Əmirəliyev', 'namiq-emireliyev', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1978-1984) | Ümumittifaq Elmi Onkologiya Mərkəzi - Klinik ordinator (1988-1990) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası N.N. Bloxin adına Rusiya Onkoloji Elmi Mərkəzi - Doktorant (1998-2002)', 42, 'İş təcrübəsi: Həkim-interna, Bakı şəhər Onkoloji Dispanseri (1984-1985); Onkoloq-cərrah, Şamaxı rayon Mərkəzi Xəstəxanası (1985-1988); Klinik ordinator, Ümumittifaq Elmi Onkologiya Mərkəzi, baş və boyun şöbəsi (1988-1990); Baş laborant, Azərbaycan Dövlət Təkmilləşdirmə İnstitutu, Onkologiya kursu ilə cərrahiyyə kafedrası (1991-1992); Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1992-2002); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2003-2008); Professor, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2008-hal-hazıradək). Təlimlər: Qırtlaq xərçənginin orqansaxlayıcı müalicəsi (1999-2000); Baş və boyun xərçənginin rekonstruktiv plastik cərrahiyyəsi (2001-2002); Baş-boyun rekonstruktiv-plastik cərrahiyyəsi (2005); Ağız boşluğu və qırtlaq xərçənginin cərrahi müalicəsi (2011); Ağız boşluğu xərçənginin plastik cərrahiyyəsi (2015); Baş-boyun şişlərinin mikrocərrahi təlim kursu (2015). Üzvlük: İnternational Federatiov of Head and Neck Oncologic (İFHNOS); Euroasian Society of Head and Neck Oncology.', '/doctor-photos/namiq-emireliyev.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Nəsimi Qasımov', 'nesimi-qasimov', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1968-1974) | Zaqafqaziya Komsomol məktəbi - Komsomol işi (1972-1976) | N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutunun Onkologiya kafedrası və Ümumittifaq Onkoloji Mərkəzin ümumi onkologiya şöbəsi - Onkologiya ixtisası üzrə dissertantura (1981-1984) | Azərbaycan Marksizm, Leninizm Universiteti - Siyasi bilimlər (1985-1987) | Bakı Ali partiya məktəbi - Təkmilləşmə (1987-1988)', 52, 'İş təcrübəsi: Baş laborant, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu, Onkologiya kafedrası (1974-1976); Assistent, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu Onkologiya kafedrası (1976-1988); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1988-hal-hazıradək); Universitet Partiya Təşkilatının katibinin müavini, katibi, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutunun partiya təşkilatı. (1987-1992); Tədris şöbə müdiri, Azərbaycan Tibb Universiteti (1992-hal-hazıradək); Baş həkim, ATU-nun Onkoloji klinikası (2007-hal hazıradək). Təlimlər: İxtisasartırma, Onkologiyanın müasir problemləri (1980); İxtisasartırma, Onkologiyanın müasir problemləri (1990). Üzvlük: Azərbaycan Onkoloqlar Cəmiyyəti, 1974-cü ildən etibarən; ESMO-nun üzvü 2008-ci ildən etibarən.', '/doctor-photos/nesimi-qasimov.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Nigar Mehdiyeva', 'nigar-mehdiyeva', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1993-1999) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Klinik ordinator (1999-2001) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Aspirant (2001-2005) | N.N. Bloxin adına Rusiya Onkoloji Elmi Mərkəzi - Stajer (2002-2004)', 27, 'İş təcrübəsi: Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2006-2010); II cərrahiyyə şöbəsinin müdiri, bölmə rəhbəri, ATU-nun Onkoloji klinikası (2007 hal-hazıradək); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2010 hal-hazıradək). Təlimlər: Süd vəzisinin onkoplastikası və rekonstruktiv cərrahiyyəsi (16-23.11.2015); Реконструктивная пластика молочной железы (9-11.03.2016). Üzvlük: NCCN; ESMO.', '/doctor-photos/nigar-mehdiyeva.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Tamara Quliyeva', 'tamara-quliyeva', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1991-1997) | A.T. Abbasov adına şəhər Onkoloji Dispanseri - Internatura (1997-1998) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Klinik ordinatura (1998-2000) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Aspirantura (2001-2005)', 29, 'İş təcrübəsi: Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2015); Şöbə müdiri, ATU-nun Onkoloji klinikası (2010 hal-hazıradək); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2012 hal-hazıradək). Təlimlər: İxtisasartırma kursu (15.06-15.08.2015); Реконструктивная пластика молочной железы (01-31.03.2016).', '/doctor-photos/tamara-quliyeva.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Vəliyeva Vəfa', 'veliyeva-vefa', 'mammology', 'Azərbaycan Tibb Universiteti - Onkoloq (1996-2002)', 24, 'İş təcrübəsi: Həkim, ATU-nun Onkoloji klinikası (2002-dən hal-hazıra qədər). Təlimlər: Gənc həkimlərin forumu (2012); Memecerahiyyesi kursu (2015); Memekanserinde yeni yaklaşmalar (2016); ESMO (2016); Onkoplastikavə mammaplastika kursu (2017); Seviyye III Rekanstruktivmemekansericerrahisi (2017); Süd vəzin onkoplastik və rekonstruktiv cərrahiyyəsi kursu (10.03-31.03.2018); Breastanbul (11.10-13.10.2018); Meme hakkında her şey - süd vəzin plastikasına aid konfrans (01.03-04.03.2018); Meme kanserinde yeni yaklaşmalar (12.01-14.01.2019); Moscow Breast meeting (07.02-09.02.2019).', '/doctor-photos/veliyeva-vefa.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW()),
    ('Yasər Hətəmov', 'yaser-hetemov', 'oncology', 'N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu - Müalicə işi (1987-1993) | Azərbaycan Tibb Universitetinin Onkologiya kafedrası - Dissertant (1996-2000)', 33, 'İş təcrübəsi: Həkim-interna, A.T. Abbasov adına Bakı Şəhər Onkoloji Dispanseri (1993-1994); Baş laborant, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1994-1997); Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1997-2015); Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2015-hal-hazıradək).', '/doctor-photos/yaser-hetemov.webp', 'az', 'UNCLAIMED', 'oncology.amu.edu.az', 0, 1, NOW(), NOW())
;

-- Attach them to the clinic, as V22 and V39 did for Liv Bona Dea.
INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, @clinic_id FROM doctor d
WHERE d.source = 'oncology.amu.edu.az'
  AND @clinic_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM doctor_clinic dc
      WHERE dc.doctor_id = d.id AND dc.clinic_id = @clinic_id);
