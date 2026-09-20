-- The doctors Sahhat Klinikasi publishes: 24 new listings, and a second
-- hospital for one doctor already here.
--
-- Read from sahhat.az on 2026-09-20, in Azerbaijani. The eleventh source, and
-- the first that simply states its own total: its API answers with
-- {"total": 27}, and walking its three pages of ten, ten and seven returns
-- exactly those 27 ids. No counting by hand was needed.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- Three of the 27 are also listed at OKI Hospital, which this directory took
-- on the same day, with the same specialty each time. They were found only
-- because the check ran against the imports waiting to go out as well as
-- against production; against production alone all three looked new.
--
--   - Ilham Kerimov is listed here as a radiologist who trained in Germany,
--     and at OKI as "Facharzt radioloq" - the German specialist title. Two
--     sources saying the same uncommon thing about a man of the same name and
--     specialty is enough. He is one listing at two hospitals.
--   - Farida Nasirli and Azina Karimova match OKI on name and specialty and
--     nothing else, because OKI publishes no education at all. They are not
--     listed from here. They remain in the directory through OKI, so no
--     patient loses them, and nobody's credentials land on a stranger.
--
-- This source publishes a written paragraph about each doctor rather than a
-- list of dates - where they trained, what they treat - so the biography is
-- that paragraph, with its opening line of consulting hours removed for the
-- reason those are left out everywhere else.
--
-- Eight of the 27 have no department set in the API; their specialty is taken
-- from the page title and keywords the clinic wrote for each of them, which
-- name it plainly. Nothing was guessed.
--
-- Every portrait here is served as application/octet-stream, which is how 23
-- of them were briefly refused as "not an image" by a downloader that believed
-- the header instead of the file.
--
-- Data only.

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'Səhhət Klinikası' AS name, 'sehhet-klinikasi' AS slug,
    'Qara Qarayev prospekti 103, Bakı' AS address, 'Bakı' AS city,
    '+994 12 447 85 55' AS phone,
    'Səhhət Klinikası, Bakı. Siyahı klinikanın sahhat.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'sehhet-klinikasi');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Aida Əliyeva', 'aida-eliyeva', 'ophthalmology', NULL, NULL, 'Oftalmologiya.

Aida Əliyeva - 30 ildən artıq təcrübəyə malik oftalmoloqdur. O, göz xəstəliklərinin diaqnostika və müalicəsində ixtisaslaşır, həmçinin profilaktik müayinələr və görmə problemlərinin erkən aşkarlanması ilə məşğuldur.', '/doctor-photos/aida-eliyeva.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Anjelika Terentyeva', 'anjelika-terentyeva', 'dermatology', NULL, NULL, 'Dermatologiya.

Anjelika Terentyeva - dəri və cinsi yolla keçən xəstəliklərin diaqnostikası və müalicəsi üzrə ixtisaslaşmış dermatoveneroloqdur. O, həm müalicəvi, həm də estetik dermatologiya sahəsində təcrübəyə malikdir.', '/doctor-photos/anjelika-terentyeva.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Cahid Rəhimov', 'cahid-rehimov', 'gastroenterology', NULL, NULL, 'Cahid Rəhimov - həzm orqanlarının endoskopik diaqnostikası və müalicəsində 35 ildən artıq təcrübəyə malik mütəxəssisdir. O, mədə-bağırsaq sisteminin xəstəliklərinin erkən aşkarlanması və profilaktikasına yönəlmişdir.', '/doctor-photos/cahid-rehimov.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Elmira Osmanova', 'elmira-osmanova', 'gastroenterology', NULL, NULL, 'Qastroenterologiya.

Elmira Osmanova - 40 ildən artıq təcrübəyə malik yüksək ixtisaslı qastroenteroloqdur. O, həzm sistemi xəstəliklərinin diaqnostikası və müalicəsində ixtisaslaşmışdır. Müxtəlif klinikalarda çalışaraq, həm terapevt, həm də funksional diaqnostika üzrə geniş təcrübə qazanmışdır.', '/doctor-photos/elmira-osmanova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Elmira Zeynalova', 'elmira-zeynalova', 'ent', NULL, NULL, 'Otorinolarinqologiya (LOR).

Elmira Zeynalova - otorinolarinqologiya sahəsində təcrübəli həkimdir. Qulaq, burun və boğaz xəstəliklərinin diaqnostika və müalicəsində ixtisaslaşmış, profilaktik və terapevtik yanaşmalar tətbiq edir.', '/doctor-photos/elmira-zeynalova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Etibar Nəsibov', 'etibar-nesibov', 'radiology', NULL, NULL, 'Ultrasəs diaqnostikası.

Etibar Nəsibov - uzunillik təcrübəyə malik radioloqdur. O, rentgen və digər şüa diaqnostikası üsulları vasitəsilə xəstəliklərin vaxtında aşkarlanmasına və düzgün diaqnozun qoyulmasına kömək edir.', '/doctor-photos/etibar-nesibov.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Fatimə Tağıyeva', 'fatime-tagiyeva', 'radiology', NULL, NULL, 'Ultrasəs diaqnostikası.

Fatimə Tağıyeva - şüa diaqnostikası və neyrosonoqrafiya sahəsində təcrübəli radioloqdur. Müxtəlif xəstəliklərin erkən aşkarlanmasında və diaqnostikasında yüksək peşəkarlığı ilə seçilir.', '/doctor-photos/fatime-tagiyeva.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Firəngiz Ramazanova', 'firengiz-ramazanova', 'laboratory', NULL, NULL, 'Klinikanın laboratoriyası.

Firəngiz Ramazanova - laborator diaqnostika və sanitariya sahəsində uzunillik təcrübəyə malik həkim-laborantdır. Analizlərin keyfiyyətli aparılması və nəticələrin düzgün təhlilində dəqiqliyi ilə seçilir.', '/doctor-photos/firengiz-ramazanova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Flora Yusufova', 'flora-yusufova', 'cardiology', NULL, NULL, 'Kardiologiya.

Flora Yusufova - uzun illərin təcrübəsinə malik kardioloqdur. O, ürək-damar xəstəliklərinin profilaktikası, diaqnostikası və müalicəsində müasir yanaşmaları tətbiq edir. Peşəkar fəaliyyətində hər bir pasiyentin sağlamlığını və rifahını ön planda tutur. Dəqiqlik, diqqət və pasiyentə fərdi yanaşma onun əsas prinsipləridir.', '/doctor-photos/flora-yusufova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Hicran Məlikova', 'hicran-melikova', 'gastroenterology', NULL, NULL, 'Hicran Məlikova - endoskopiya və qastroenterologiya sahəsində 30 ildən artıq təcrübəyə malik həkimdir. Həzm sistemi xəstəliklərinin erkən diaqnostikası və endoskopik müalicəsində ixtisaslaşır.', '/doctor-photos/hicran-melikova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Həqiqət Zülfüqarova', 'heqiqet-zulfuqarova', 'cardiology', NULL, NULL, 'Həqiqət Zülfüqarova 1975-ci ildə Azərbaycan Tibb Universitetini pediatriya ixtisası üzrə bitirib. Daha sonra 1976-cı ildə internatura, 1984-cü ildə isə K.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutunda ordinatura təhsili alıb. 1987-1996-cı illər ərzində Əziz Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda kardiologiya, funksional diaqnostika, fizioterapiya və kliniki kardiologiya üzrə bir sıra ixtisasartırma kurslarını keçib. Uzunillik təcrübəyə malik olan Həqiqət xanım ürək-damar və revmatoloji xəstəliklərin diaqnostika və müalicəsində yüksək peşəkarlığı ilə tanınır. O, pasiyentlərinə fərdi yanaşma və kompleks tibbi yardım göstərməyi prioritet sayır.', '/doctor-photos/heqiqet-zulfuqarova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Leyla Cəfərova', 'leyla-ceferova', 'neurology', NULL, NULL, 'Nevrologiya.

Leyla Cəfərova - 20 ildən artıq təcrübəyə malik nevroloqdur. O, sinir sistemi xəstəliklərinin diaqnostika və müalicəsində, həmçinin migren, onurğa və damar patologiyalarında ixtisaslaşıb.', '/doctor-photos/leyla-ceferova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Namiq Quliyev', 'namiq-quliyev', 'orthopedics', NULL, NULL, 'Namiq Quliyev - travmatologiya və ortopediya sahəsində ixtisaslaşmış həkimdir. Oynaqların endoprotezlənməsi, artroskopiya və ortopedik reabilitasiya üzrə geniş təcrübəyə malikdir.', '/doctor-photos/namiq-quliyev.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Nurlan Quliyev', 'nurlan-quliyev', 'urology', NULL, NULL, 'Urologiya.

Nurlan Quliyev - uroloji xəstəliklərin diaqnostika və müalicəsində ixtisaslaşmış həkimdir. Kişi reproduktiv sistemi, böyrək və sidik yolları xəstəliklərinin müasir üsullarla müalicəsində təcrübəyə malikdir.', '/doctor-photos/nurlan-quliyev.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Ofeliya Kərimova', 'ofeliya-kerimova', 'radiology', NULL, NULL, 'Ofeliya Kərimova - müasir şüa diaqnostikası sahəsində ixtisaslaşmış həkim-radioloqdur. Həzm, tənəffüs və sinir sistemlərinin diaqnostikasında dəqiq və peşəkar yanaşması ilə seçilir.', '/doctor-photos/ofeliya-kerimova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Rahilə Əliyeva', 'rahile-eliyeva', 'physiotherapy', NULL, NULL, 'Rahilə Əliyeva - fizioterapiya və tibbi bərpa sahəsində ixtisaslaşmış həkimdir. Müxtəlif travmalardan, sinir və əzələ xəstəliklərindən sonra bərpa prosesinin təşkili və müalicəvi fiziki metodlarla terapiya üzrə təcrübəyə malikdir.', '/doctor-photos/rahile-eliyeva.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Rəhimova Gülnara', 'rehimova-gulnara', 'endocrinology', NULL, NULL, 'Rəhimova Gülnara Rəcəb qızı - yüksək təcrübəyə malik həkim-terapevt və endokrinologiya sahəsində uzun illər çalışmış mütəxəssisdir.
1985-ci ildə Azərbaycan Tibb Universitetini bitirmiş, daha sonra Gəncə Mərkəzi Xəstəxanasında internatura keçmişdir.

Həkim uzun illər Səudiyyə Ərəbistanının "Kral Fahad İxtisaslaşmış Xəstəxanası"nda təcili yardım, diabet və endokrinologiya mərkəzində çalışmışdır.
Diabetin idarə olunması, insulin terapiyası, metabolik pozğunluqlar və xroniki xəstəliklərin müalicəsində geniş praktik təcrübəyə malikdir.

Hazırda "Səhhət Klinikası"nda həkim-terapevt kimi fəaliyyət göstərir.', '/doctor-photos/rehimova-gulnara.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Səidə Əlixanova', 'seide-elixanova', 'obstetrics-gynecology', NULL, NULL, 'Ginekologiya.

Səidə Əlixanova - mamalıq və ginekologiya sahəsində 20 ildən artıq təcrübəyə malik həkimdir. Həmçinin "Səhhət" klinikasının sığorta şöbəsinə rəhbərlik edir.', '/doctor-photos/seide-elixanova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Vüsalə Orucova', 'vusale-orucova', 'ophthalmology', NULL, NULL, 'Oftalmologiya.

Vüsalə Orucova - oftalmologiya sahəsində 20 ildən artıq təcrübəyə malik mütəxəssisdir. Göz xəstəliklərinin diaqnostika və müalicəsində yüksək dəqiqlik və peşəkarlıqla çalışır.', '/doctor-photos/vusale-orucova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Xalidə Nadirova', 'xalide-nadirova', 'ent', NULL, NULL, 'Otorinolarinqologiya (LOR).

Xalidə Nadirova - otorinolarinqologiya sahəsində 30 ildən çox təcrübəyə malik yüksək ixtisaslı həkimdir. O, qulaq, burun və boğaz xəstəliklərinin diaqnostikası və müalicəsində geniş təcrübəyə sahibdir, həmçinin təxirəsalınmaz LOR hallarında müasir yanaşmalar tətbiq edir.', '/doctor-photos/xalide-nadirova.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Yana Lyalyakina', 'yana-lyalyakina', 'laboratory', NULL, NULL, 'Klinikanın laboratoriyası.

Yana Lyalyakina - laborator diaqnostika, immunologiya və bakteriologiya sahəsində təcrübəli mütəxəssisdir. Klinik analizlərin dəqiq aparılması və nəticələrin peşəkar təhlili ilə seçilir.', '/doctor-photos/yana-lyalyakina.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('İlham Qasımov', 'ilham-qasimov', 'pediatrics', NULL, NULL, 'Pediatriya.

İlham Qasımov - uşaq sağlamlığının qorunması və xəstəliklərin profilaktikası sahəsində təcrübəli pediatrdır. O, uşaqlarda ümumi inkişaf, immunitet və sağlam həyat tərzinin formalaşdırılmasına xüsusi diqqət yetirir.', '/doctor-photos/ilham-qasimov.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('İntiqam Abbasov', 'intiqam-abbasov', 'general-surgery', NULL, NULL, 'Cərrahiyyə.

İntiqam Abbasov - ümumi cərrahiyyə sahəsində uzunillik təcrübəyə malik həkimdir. Müxtəlif əməliyyat və terapevtik prosedurların icrasında ixtisaslaşmış, xəstələrin bərpası və reabilitasiyası üzrə yüksək peşəkarlıq nümayiş etdirir.', '/doctor-photos/intiqam-abbasov.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW()),
    ('Əminə Əliyeva', 'emine-eliyeva', 'laboratory', NULL, NULL, 'Klinikanın laboratoriyası.

Əminə Əliyeva - laborator diaqnostika sahəsində təcrübəli həkimdir. Müxtəlif analizlərin dəqiqliklə aparılması və nəticələrin klinik təhlilində peşəkarlığı ilə seçilir.', '/doctor-photos/emine-eliyeva.webp', 'az', 'UNCLAIMED', 'sahhat.az', 0, 1, NOW(), NOW())
;

-- The 24 new listings, plus Ilham Kerimov, who is already here from OKI.
CREATE TEMPORARY TABLE sehhet_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO sehhet_placement (doctor_slug, clinic_slug) VALUES
    ('aida-eliyeva', 'sehhet-klinikasi'),
    ('anjelika-terentyeva', 'sehhet-klinikasi'),
    ('cahid-rehimov', 'sehhet-klinikasi'),
    ('elmira-osmanova', 'sehhet-klinikasi'),
    ('elmira-zeynalova', 'sehhet-klinikasi'),
    ('etibar-nesibov', 'sehhet-klinikasi'),
    ('fatime-tagiyeva', 'sehhet-klinikasi'),
    ('firengiz-ramazanova', 'sehhet-klinikasi'),
    ('flora-yusufova', 'sehhet-klinikasi'),
    ('hicran-melikova', 'sehhet-klinikasi'),
    ('heqiqet-zulfuqarova', 'sehhet-klinikasi'),
    ('leyla-ceferova', 'sehhet-klinikasi'),
    ('namiq-quliyev', 'sehhet-klinikasi'),
    ('nurlan-quliyev', 'sehhet-klinikasi'),
    ('ofeliya-kerimova', 'sehhet-klinikasi'),
    ('rahile-eliyeva', 'sehhet-klinikasi'),
    ('rehimova-gulnara', 'sehhet-klinikasi'),
    ('seide-elixanova', 'sehhet-klinikasi'),
    ('vusale-orucova', 'sehhet-klinikasi'),
    ('xalide-nadirova', 'sehhet-klinikasi'),
    ('yana-lyalyakina', 'sehhet-klinikasi'),
    ('dr-ilham-kerimov', 'sehhet-klinikasi'),
    ('ilham-qasimov', 'sehhet-klinikasi'),
    ('intiqam-abbasov', 'sehhet-klinikasi'),
    ('emine-eliyeva', 'sehhet-klinikasi')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM sehhet_placement p
JOIN doctor d ON d.slug = p.doctor_slug
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE sehhet_placement;
