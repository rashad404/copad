-- The 52 doctors Saglam Aile publishes, from its own directory.
--
-- Read from saglamaile.az on 2026-09-19, in Azerbaijani. The fourth source,
-- and the first that is not a single building.
--
-- The total is 52 and two sources agree once one of them is corrected. The
-- listing page carries 52 profiles; the sitemap carries 53, and the extra one,
-- hacer-simsek, returns 404 from the site itself. It is a doctor who has left
-- and whose sitemap entry was never removed, so the page is right and the
-- sitemap is stale. Nothing else differs between them.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- Five clinics, not one. Saglam Aile runs five branches and each doctor's
-- profile names the branch they work at, and two of those branches are not in
-- Baku: ten of these doctors work in Ganja and one in Sumqayit. Attaching all
-- 52 to a single Baku clinic would tell somebody in Ganja that their doctor is
-- 350km away, and would answer a Baku city filter with eleven doctors who are
-- not there. So the branches are separate clinic rows with their own cities
-- and addresses, and each doctor is attached to the one that employs them.
--
-- The organisation is already in this database as a laboratory, from V31,
-- carrying its price list. That row is in a different table and is left
-- exactly as it is; the clinic slugs here start with the same saglam-aile so
-- the two are recognisable as the same business later.
--
-- What is not recorded, and why:
--
--   - qualifications stays NULL for all 52. This source publishes one combined
--     "Haqqinda" career list per doctor, running from their first degree to
--     their current post, and does not separate education from employment.
--     Splitting it by guessing which lines are which would invent a distinction
--     the hospital did not make, so the list is kept whole in the biography.
--   - Consulting hours. Every profile publishes a weekly timetable, and the
--     site itself warns underneath that it can change. A stale timetable in
--     front of a patient is worse than none, and nothing here can take a
--     booking anyway.
--
-- Two doctors have no portrait: their profiles carry a stock icon of a
-- generic doctor rather than a photograph, and shipping that as if it were
-- their likeness would be a small lie. Their cards fall back to initials.
-- The other 50 portraits are ours.
--
-- years_experience is years since the earliest entry in each career list,
-- which in all 52 is the medical degree.
--
-- Data only.

-- A child and adolescent psychiatrist is a physician, which the existing
-- child-psychology code is not; they treat different things and a parent is
-- sent to one or the other deliberately.
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('child-psychiatry','Uşaq və yeniyetmə psixiatriyası','Child and Adolescent Psychiatry','Детская и подростковая психиатрия',1,'psych',113);

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Ailə - Nərimanov filialı' AS name, 'saglam-aile-nerimanov' AS slug,
  'Əhməd Rəcəbli küçəsi 3/10, AZ1075, Bakı' AS address, 'Nərimanov' AS district, 'Bakı' AS city,
  '+994 12 910' AS phone, 'Sağlam Ailə Tibb Mərkəzinin Nərimanov filialı. Siyahı saglamaile.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-aile-nerimanov');

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Ailə - 28 May filialı' AS name, 'saglam-aile-28-may' AS slug,
  'Rəşid Behbudov küçəsi 56, AZ1014, Bakı' AS address, 'Nəsimi' AS district, 'Bakı' AS city,
  '+994 12 910' AS phone, 'Sağlam Ailə Tibb Mərkəzinin 28 May filialı. Siyahı saglamaile.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-aile-28-may');

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Ailə - Mikrorayon filialı' AS name, 'saglam-aile-mikrorayon' AS slug,
  'Asif Məhərrəmov küçəsi 156C, AZ1102, Bakı' AS address, 'Bakı' AS city,
  '+994 12 910' AS phone, 'Sağlam Ailə Tibb Mərkəzinin Mikrorayon filialı. Siyahı saglamaile.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-aile-mikrorayon');

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Ailə - Gəncə filialı' AS name, 'saglam-aile-gence' AS slug,
  'Azərbaycan bayrağı küçəsi, Gəncə' AS address, 'Gəncə' AS city,
  '+994 22 310' AS phone, 'Sağlam Ailə Tibb Mərkəzinin Gəncə filialı. Siyahı saglamaile.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-aile-gence');

INSERT INTO clinic (name, slug, address, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT 'Sağlam Ailə - Sumqayıt filialı' AS name, 'saglam-aile-sumqayit' AS slug,
  'Cəfər Cabbarlı küçəsi 46, AZ5007, Sumqayıt' AS address, 'Sumqayıt' AS city,
  '+994 12 910' AS phone, 'Sağlam Ailə Tibb Mərkəzinin Sumqayıt filialı. Siyahı saglamaile.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
  1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'saglam-aile-sumqayit');

SET @clinic_id = (SELECT id FROM clinic WHERE slug = 'saglam-aile-nerimanov');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Aqil Cəfərov', 'aqil-ceferov', 'radiology', NULL, 14, 'Haqqında: 2025-bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı/ Şüa diaqnostikası üzrə həkim; 2013-2017 - Rezidentura/ Azərbaycan Tibb Universiteti/Şüa diaqnostikası; 2006-2012 - Azərbaycan Tibb Universiteti/ Hərbi-həkim.', '/doctor-photos/aqil-ceferov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Aynur Quliyeva', 'aynur-quliyeva', 'ophthalmology', NULL, 23, 'Haqqında: 2014 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim oftalmoloq; 2014 Sertifikasiya. Oftalmologiya; 2012 AMEA A.İ.Qarayev adına Fiziologiya İnstitutu / Elmi işçi; 2007 - 2009 ABU tibb mərkəzi/ Həkim oftalmoloq; 2004 - 2007 Bakı şəhər göz xəstəxanası / Həkim oftalmoloq; 2003 - 2004 İnternatura / Akademik Mir-Qasımov adına Respublika klinik xəstəxanası / Həkim oftalmoloq; 1997 - 2003 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/aynur-quliyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Aynur Salxayeva', 'aynur-salxayeva', 'endocrinology', NULL, 21, 'Haqqında: 2019 - bugünədək Sağlam Ailə Tibb Mərkəzi/ Həkim - endokrinoloq; 2016 - Sankt - Peterburq şəhərində Otto adına Akuşer və Ginekologiya İnstitutu/ Endokrin və ginekologiya üzrə ixtisaslaşma; 2015 - Sertifikasiya, Endokrinologiya; 2009 - İstanbul Universitetinin tibb fakültəsi/ Endokrinologiya; 2006 - bugünədək Medilüks klinikası/ Həkim - endokrinoloq; 2005 - 2006 - İnternatura, F. Əfəndiyev adına 4 saylı Klinik xəstəxana/ Endokrinologiya; 1999 - 2005 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/aynur-salxayeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Aytən Sadıqova', 'ayten-sadiqova', 'radiology', NULL, 25, 'Haqqında: 2024 - bugünədək - Sağlam Ailə Tibb Mərkəzi/ Şüa diaqnostika üzrə həkim; 2011 - bugünədək - İntermed Plyus diaqnostika mərkəzi/ Şüa diaqnostika üzrə həkim; 2003 - 2006 - Ağcabədi rayon mərkəzi xəstəxanası/ Şüa diaqnostika üzrə həkim; 2001 - 2002 - İnternatura - M.N. Qədirli adına Mərkəzi Hövzə Xəstəxanası/ Funksional - diaqnostik; 1996 - 2001 - N. Nərimanov adına Azərbaycan Tibb Universiteti, Tibbi biologiya.', '/doctor-photos/ayten-sadiqova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Azad Əkbərzadə', 'azad-ekberzade', 'pediatric-endocrinology', NULL, 20, 'Haqqında: 2020 - bugünədək - Sağlam Ailə Tibb Mərkəzi, Həkim - Uşaq endokrinoloqu; 2017 - 2020 - HB Güvən klinikası/ Həkim - pediatr; 2014-2017 - Marmara Üniversitesi Tıp Fakültesi, Uşaq endokrinoloqu; 2009 - 2014 - Marmara Üniversitesi Tıp Fakültesi, Pediatriya; 2006-2007 - İnternatura/ Azərbaycan Tibb Universiteti / Həkim - pediatr; 2000 - 2006 - Azərbaycan Tibb Universiteti/ Pediatriya.', '/doctor-photos/azad-ekberzade.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Cəbrayıl Sultanov', 'cebrayil-sultanov', 'dentistry', NULL, 16, 'Haqqında: 2016 - bugünədək Müasir Diaqnostika Klinikası / Həkim stomatoloq; 2016 Denta Med MMC / Həkim stomatoloq; 2014 - 2015 Star Med MMC / Həkim stomatoloq; 2010 - 2011 İnternatura / 3 saylı şəhər poliklinikası / Həkim stomatoloq; 2005 - 2010 Azərbaycan Tibb Universiteti / Stomatologiya.', '/doctor-photos/cebrayil-sultanov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Ceyhun Cəfərov', 'ceyhun-ceferov', 'child-psychiatry', NULL, 13, 'Haqqında: 2020 - bugünədək Sağlam Ailə Tibb Mərkəzi / Uşaq ve Yeniyetmə Psixiyatrı; 2017 - 2022 - Maltepe ve Kurtköy Ersoy Xestexanaları- Uşaq ve Yeniyetme Şöbesi Uzman Hekim /İstanbul; 2016 - 2017 - Medicana Çamlıca Xestexanası -Uşaq ve Yeniyetme Şöbesi Uzman Hekim/İstanbul; 2013 - 2016 - Fatih Üniversiteti Tibb Fakülteti -Uşaq ve Yeniyetme Kafedrası Yardımcı Dosent /İstanbul; 2012 - İstanbul Üniversiteti Tibb Fakülteti Uşaq ve Yeniyetme Psixiyatriyası Kafedrası / Uzmanlıq; 2008 - 2013 - Ondokuz Mayıs Üniversiteti Tibb Fakülteti / Çocuk ve ergen ruh sağlığı ve hastalıkları.', '/doctor-photos/ceyhun-ceferov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Ceyhun İslamov', 'ceyhun-islamov', 'cardiology', NULL, 20, 'Haqqında: 2024 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim kardioloq; 2022 - bugünədək Pirallahı Tibb Mərkəzi/ Həkim-kardioloq; 2022 - Synergy Medical/ Həkim-kardioloq; 2021 - Cəlilabad Rayon Mərkəzi Xəstəxanasının poliklinikası/Həkim-kardioloq; 2019 - 2020 - Bakı Dəmir Yolu Xəstəxanası/ Həkim-kardioloq; 2019 - Təbriz Med/ Həkim-kardioloq; 2018 - 2019 - Baku City Hospital/ Həkim-kardioloq; 2014 - 2018 - Azfen birgə müəssisəsi/ Sahə həkimi; 2006 - 2007 - İnternatura/ C. Abdullayev adına ET Kardiologiya İnstitutu/ Həkim-kardioloq; 2000 - 2006 - Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/ceyhun-islamov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Davud Eyvazov', 'davud-eyvazov', 'neurology', NULL, 16, 'Haqqında: 2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/Həkim-nevropatoloq; 2021-2022 - Sağlık Bilimleri Üniversitesi/ Nevrologiya ixtisası üzrə tam kursu bitirmiş; 2011-2015 - Rezidentura/ Azərbaycan Tibb Universiteti/ Nevrologiya; 2004-2010 - Azərbaycan Tibb Universiteti/Hərbi-həkim.', '/doctor-photos/davud-eyvazov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Elnurə Əlimirzəyeva', 'elnure-elimirzeyeva', 'radiology', NULL, 23, 'Haqqında: bugünədək Sağlam Ailə Tibb Mərkəzi / Şüa diaqnostika üzrə həkim / Rentgenoloq; 2011 Sertifikasiya, Şüa diaqnostika; 2011 Atatürk Eğitim ve Araştırma hastanesi / Radyoloji kliniği Praktiv və uyğulamalı Eğitimi; 2005 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu / Şüa diaqnostika / Rentgenologiya üzrə kurs; 2003 - 2004 İnternatura / Sumqayıt şəhəri 1 saylı Şəhər Xəstəxanası / Həkim terapevt; 1997 - 2003 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/elnure-elimirzeyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Emil Həsənov', 'emil-hesenov', 'endocrinology', NULL, 1, 'Haqqında: • 2025-bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim - endokrinoloq • 2021-bugünədək Gəncə şəhər hərbi hospitalı/ Həkim-endokrinoloq • 2017-2021 - Rezidentura/ Azərbaycan Tibb Universiteti / Endokrinologiya • 2009-2015 - Bakalavr/ Azərbaycan Tibb Universiteti / Hərbi həkim işi.', '/doctor-photos/emil-hesenov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Əminə Yusifova', 'emine-yusifova', 'pediatrics', NULL, 29, 'Haqqında: 2025-bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim-pediatr; 2024-bugünədək - Gəncə Şəhər Birləşmiş Xəstəxanası PHŞ-Uşaq xəstəxanası/ Təcili və təxirəsalınmaz tibbi yardım üzrə həkim; 2023-2024 - Qobustan Rayon Mərkəzi Xəstəxanası PHŞ/ Ailə həkimi - pediatr; 1997-1998 - İnternatura/ Respublika Uşaq Klinik Xəstəxanası/ Pediatr; 1991-1997 - Azərbaycan Tibb Universiteti / Pediatriya.', NULL, 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Etibar Süleymanov', 'etibar-suleymanov', 'internal-medicine', NULL, 32, 'Haqqında: 2017 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim terapevt; 2010 N saylı hərbi hissə yoluxucu xəstəliklər bölməsi / Baş ordinator; 1998 - 2017 N saylı hərbi hissə / Yoluxucu xəstəliklət bölməsi / İnfeksionist; 1996 - 1998 N saylı hərbi hissə / Səyyat tibbi qrup bölməsi / Həkim terapevt; 1995 - 1996 Sumqayıt şəhəri 2 saylı xəstəxana / Həkim terapevt; 1994 - 1995 İnternatura / Bakı şəhəri 1 saylı şəhər klinik xəstəxana / Həkim terapevt; 1994-1995 Sumqayıt şəhəri Bərpa müalicə mərkəzi / Həkim terapevt; 1991 - 1994 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnistutu / Travmatoloq kafedrası / Tibb qardaşı; 1988 - 1994 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/etibar-suleymanov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Gülnar Verdiyeva', 'gulnar-verdiyeva', 'neurology', NULL, 15, 'Haqqında: 2020 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim-nevropatoloq; 2017 - 2020 - Artromed Tibb mərkəzi/ Həkim nevroloq; 2012 - 2016 - Rezidentura, Kliniki Tibbi Mərkəz/ Nevrologiya; 2005 - 2011 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/gulnar-verdiyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Günay Hacızadə', 'gunay-hacizade', 'pediatrics', NULL, 15, 'Haqqında: 2020 - Sağlam Ailə Tibb Mərkəzi, Həkim pediatr; 2019-bugünədək - Oksigen Klinik xəstəxanası/ Həkim-neonatoloq; 2016 - 2019 - Doktorantura/ K. Fərəcova adına Elmi-tətqiqat Pediatriya İnstitutu/ Həkim - pediatr; 2011 - 2015 Rezidentura/ K. Fərəcova adına Elmi-tətqiqat Pediatriya İnstitutu/ Həkim - pediatr; 2005 - 2011 Azərbaycan Tibb Universiteti/ Pediatriya.', '/doctor-photos/gunay-hacizade.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Gunel Bayramova', 'gunel-bayramova', 'radiology', NULL, 18, 'Haqqında: 05.05.2023 - bugünədək - Sağlam Ailə Tibb Mərkəzi / Şüa diaqnostika üzrə həkim; 18.04.2023 - Sertifikasiya Şəhadətnaməsi; 03.04.2018 - bugünədək - 18 №li Birləşmiş Şəhər Xəstəxanası / Şüa diaqnostika üzrə həkim; 2012-2018 - Kliniki Tibbi Mərkəz / Şüa diaqnostika ixtisası üzrə rezidentura; 2008-2009 - Ə.D.Məlikov adına 6 saylı Birləşmiş Şəhər Xəstəxanası / Həkim-terapevt; 2002-2008 - Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/gunel-bayramova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('İlham İgidov', 'ilham-igidov', 'dermatology', NULL, 33, 'Haqqında: 2010 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim dermatoveneroloq; 2012 Sertifikasiya, Dermatovenerologiya üzrə; 2008 - bugünədək Respublika Dəri Zöhrəvi Dispanseri, Həkim Dermatoveneroloq; 1997 - 2008 Respublika Dəri Zöhrəvi Dispanseri, Baş həkim müavini; 1995 - 1997 Bakı şəhər Dəri Zöhrəvi Dispanseri, Həkim Dermatoveneroloq; 1994 - 1995 Bakı şəhəri 8 №li poliklinika, Həkim Dermatoveneroloq; 1993 - 1994 İnternatura, Respublika Dəri Zöhrəvi dispanseri; 1987 - 1993 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/ilham-igidov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('İlqar Mikayılzadə', 'ilqar-mikayilzade', 'urology', NULL, 17, 'Haqqında: 01.02.2023 - tarixinədək Sağlam Ailə Tibb Mərkəzi / Həkim uroloq; 25.08.2022 - 15.12.2022 - "Unikal-A" MMC / Həkim-uroloq; 01.12.2020 - 22.01.2022 - "HB Guven" MMC / Həkim-uroloq; 26.07.2021 - 10.08.2022 - Necmettin Erbakan Üniversitesi Meram Tıp fakültesi üroloji ana bilim dalı / Üroloji eğitim; 14.10.2020 - ci il tarixində - Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu Sertifikasiya Şəhadətnaməsi / Həkim-uroloq; 2004 - 2009 - Azərbaycan Tibb Universiteti / Tibbi profilaktika.', '/doctor-photos/ilqar-mikayilzade.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Kəmalə Qardaşəliyeva', 'kemale-qardaseliyeva', 'ent', NULL, 28, 'Haqqında: 2014 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim otorinolarinqoloq; 2014 Vitamed Tibb Mərkəzi / Həkim otorinolarinqoloq; 2011 - 2014 Şəfa Tibb Mərkəzi / Həkim otorinolarinqoloq; 1999 - 2005 Azərbaycan Respublikası Səhiyyə Nazirliyində nəznində tibb müəssisəsi / Həkim otorinolarinqoloq; 1998 - 1999 İnternatura / M.Qasımov adına Respublika Klinik Xəstəxanası / LOR şöbəsi; 1992 - 1998 Azərbaycan Tibb Universiteti / 2ci Müalicə profilaktika.', '/doctor-photos/kemale-qardaseliyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Kəmalə Rüstəmova', 'kemale-rustemova', 'pediatrics', NULL, 17, 'Haqqında: 2018 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim pediatr; 2016 - bugünədək Zirə Müalicə Diaqnostika Mərkəzi, Pediatr - neonatoloq; 2011 - 2016 Rezidentura. K.Y. Fərəcova adına Elmi Tətqiqat Pediatriya İnstitutu; 2009 - 2010 İnternatura. Sumqayıt Şəhər Uşaq Xəstəxanası, Həkim pediatr; 2003 - 2009 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/kemale-rustemova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Kənan Əhmədov', 'kenan-ehmedov', 'dermatology', NULL, 22, 'Haqqında: 2022 - bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı / Həkim-dermatoloq; 2022 - bugünədək - 3 Saylı Uşaq Dəri-Zöhrəvi Dispanseri / Dəri-Zöhrəvi həkim; 2019 - bugünədək - "Vitiliqo Psoriaz Mərkəzi" MMC / Həkim-dermatoloq; 2017 - 2018 - A.H. Group MMC / Həkim-dermatoloq; 04/04/2018 - Sertifikasiya Şəhadətnaməsi, № AH 028991 / Dermatovenerologiya ixtisası; 2004 - 2005 Respublika Dəri-Zöhrəvi Dispanseri Xəstəxanası / Həkim- dermatovneroloq ixtisası üzrə internatura pilləsini bitirmiş; 1998 - 2004 Azərbaycan Tibb Universiteti / Müalicə ixtisası üzrə bakalavr pilləsini bitirmiş.', '/doctor-photos/kenan-ehmedov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Könül Eyvazova', 'konul-eyvazova', 'obstetrics-gynecology', NULL, 23, 'Haqqında: 2009 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim mama ginekoloq; 2014 - bugünədək Müasir diaqnostika Klinikası; 2008 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, Mamalıq və ginekologiya üzrə; 2003 - 2004 İnternatura, A.T. Abbasov adına Şəhər Onkoloji dispanseri; 1997 - 2003 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/konul-eyvazova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Könül Qürbətova', 'konul-qurbetova', 'radiology', NULL, 22, 'Haqqında: 2020 - bugünədək - Sağlam Ailə Tibb Mərkəzi/ Şüa diaqnostika üzrə həkim; 2008 - bugünədək Lanset cərrahlıq klinikası/ Şüa diaqnostika üzrə həkim; 2005 - 2008 - Odlar Yurdu Universiteti/ Baş laborant; 2004 - 2005 - İnternatura - M.N. Qədirli adına Mərkəzi Hövzə Xəstəxanası/ Funksional - diaqnostik; 1998 - 2004 - N. Nərimanov adına Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/konul-qurbetova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Ləman Sultanova', 'leman-sultanova', 'pediatric-endocrinology', NULL, 20, 'Haqqında: 2022 - bugünədək Sağlam Ailə Ultralab klinikası / Həkim-endokrinoloq; 2015 - 2022 - Azərbaycan Tibb Universiteti / Dissertant (davam edir); 2008 - 2010 - Diabet mərkəzi / Həkim endokrinoloq; 2006 - 2007 - Sumqayıt Şəhər Uşaq Poliklinikası / Həkim interna; 2000 - 2006 - Azərbaycan Tibb Universiteti Pediatriya.', '/doctor-photos/leman-sultanova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Leyla Paşayeva', 'leyla-pasayeva', 'dentistry', NULL, 9, 'Haqqında: 2024 - bugünədək Müasir Diaqnostika klinikası/ Həkim-stomatoloq; 2021-2023 - Moskva şəhəri "M-vito" MMC/ Həkim-stomatoloq; 2020-2021 - Dental update klinikası/ Həkim-stomatoloq; 2016 - Kurs - Ondokuz Mayıs Üniversitesi/ Oral cərrahiyyə kafedrası; 2012-2017 - Azərbaycan Tibb Universiteti/ Stomatologiya.', '/doctor-photos/leyla-pasayeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Leyla Qaraqaşova', 'leyla-qaraqasova', 'ent', NULL, 28, 'Haqqında: 2015 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim Otolarinqoloq; 2014 Sertifikasiya; 2014 - bugünədək Bakı Sağlamlıq Mərkəzi / Həkim Otolarinqoloq; 2000 - 2004 F.Əfəndiyev adına 4 saylı klinik xəstəxana / Həkim Otolarinqoloq; 1999 - 2000 F.Əfəndiyev adına 4 saylı klinik xəstəxana təcili təxirə salınmaz yardım üzrə növbətçi həkim; 1998 - 1999 İnternatura / F.A.Əfəndiyev adına 4 № li şəhər klinik xəstəxanası; 1992 - 1998 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/leyla-qaraqasova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Mehri Məmməd-zadə', 'mehri-memmed-zade', 'endocrinology', NULL, 22, 'Haqqında: 2024 - bugünədək Sağlam Ailə Tİbb Mərkəzi, Həkim endokrinoloq; 2020 - bugünədək Görüş tibb mərkəzi/ Həkim-endokrinoloq; 2019-2020 - Nərgiz med tibb mərkəzi/ Həkim-endokrinoloq; 2018-2019 - Sağlam Ailə Tİbb Mərkəzi, Həkim endokrinoloq; 2016-2018 - Hayat Clinic/ Həkim-endokrinoloq; 2013-2016 - AzərTürkMed Hospital/ Həkim-endokrinoloq; 2004 - 2005 - İnternatura/ F. Əfəndiyev adına 4 saylı şəhər klinik xəstəxanası/ Həkim-endokrinoloq; 1998-2004 - Azərbaycan Tibb Universiteti/ Müalicə işi.', '/doctor-photos/mehri-memmed-zade.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Mina Qocayeva', 'mina-qocayeva', 'pediatrics', NULL, 32, 'Haqqında: 2019 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Həkim-pediatr; 2017 - bugünədək - Gəncə şəhər 2 nömrəli Birləşmiş Uşaq Xəstəxanası/ Həkim-pediatr; 2014 - 2016 -Gəncə Müalicə Diaqnostika Mərkəzi/ Həkim - neonatoloq; 1996 - 2014 - Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim-pediatr; 1994 - 1995 - İnternatura/ Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim-pediatr; 1988 - 1994 - Azərbaycan Tibb Universiteti / Pediatriya.', '/doctor-photos/mina-qocayeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Nabat Ağayeva', 'nabat-agayeva', 'pediatric-endocrinology', NULL, 18, 'Haqqında: 2022 - bugünədək Sağlam Ailə Ultralab klinikası / Həkim-endokrinoloq; 2021 - 2022 - K.Y.Fərəcov adına Elmi-Tədqiqat İnstitutu / Həkim-endokrinoloq; 2009 - 2021 - 6 Saylı Şəhər Klinik Uşaq Xəstəxanası / Həkim-endokrinoloq; 2008 - 2009 - 6 Saylı Şəhər Klinik Uşaq Xəstəxanası / İnternatura; 2001 - 2008 - Azərbaycan Tibb Universiteti / Pediatriya.', '/doctor-photos/nabat-agayeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Nərgiz Qürbətova', 'nergiz-qurbetova', 'obstetrics-gynecology', NULL, 24, 'Haqqında: 2022 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Mama-ginekoloq; 2012 - bugünədək Turan klinikası / Həkim-ginekoloq; 2007 - 2012 - Xəzər klinikası / Həkim-ginekoloq; 2006 - 2008 - 4 Saylı qadın məsləhətxanası / Ginekoloq; 2002 - 2003 - Azərsutikinti / Həkim-interna; 12.04.2021 - № AH 039405 Sertifikasiya Şəhadətnaməsi / Mamalıq-ginekologiya; 2003-2005 - (ordinatura) Sibir Dövlət Tibb Universiteti / Həkim-ginekoloq ixtisası üzrə tam kursu bitirmiş; 1996-2002 - Azərbaycan Tibb Universiteti / Müalicə işi ixtisası üzrə bakalavr pilləsini bitirmiş.', '/doctor-photos/nergiz-qurbetova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Olqa Akçurina', 'olqa-akcurina', 'obstetrics-gynecology', NULL, 48, 'Haqqında: 2010 - bugünədək Sağlam Ailə Tibb Mərkəzi / həkim mama ginekoloq; 2012 Sertifikasiya / mama ginekoloq üzrə; 1995 Ailə Sağlamlıq Mərkəzi / həkim mama ginekoloq; 1985 Ailə və nigah məsləhətxanası / həkim mama ginekoloq; 1979 - 1985 Nasosnu adına sahə xəstəxanası / həkim mama ginekoloq; 1978 - 1979 Doğum evi / həkim mama ginekoloq; 1978 - 1979 İnternatura Qazaxıstan Tibb Universiteti; 1972 - 1978 Aktyubin Dövlət Tibb Universiteti / müalicə işi.', '/doctor-photos/olqa-akcurina.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Oqtay Kazımov', 'oqtay-kazimov', 'radiology', NULL, 32, 'Haqqında: bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim; 2014 Sertifikasiya, Şüa diaqnostika üzrə; Turan Klinikası, Şüa diaqnostika üzrə həkim; 2004 - 2013 Səuidi Ərəbistan Arar Central Hospital Cərrahi şöbə, Şüa diqnostika üzrə; 1996 - 2004 Sumqayıt Şəhər Polis İdarəsi nəznində tibb idarəsi, Həkim cərrah; 1995 - 1996 Daxili İşlər Nazirliyi Tibbi idarəsi, Həkim cərrah; 1994 - 1995 İnternatura. ARSN Məhkəmə Tibbi Ekspertiza və Patoloji Anatomiya Birliyi; 1988 - 1994 Azərbaycan Tibb Universiteti.', '/doctor-photos/oqtay-kazimov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Regina Nemətova', 'regina-nemetova', 'pediatrics', NULL, 15, 'Haqqında: 2024 - bugünədək Sağlam Ailə Ultralab klinikası / Baş həkim/ Həkim-pediatr; 2023-2024 - K.Fərəcova adına Elmi Tədqiqat İnstitutu/ Neoanatologiya şöbəsinin müdiri; 2022 - 2023 - Sağlam Ailə Ultralab klinikası / Həkim-pediatr; 2022 - 2023 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Həkim-neonatoloq; 2018 - 2021 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Anesteziologiya, reanimasiya və intensiv terapiya şöbəsinin müdiri; 2017 - 2018 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Doktorantura; 2011 - 2016 - Rezidentura/ K.Fərəcova adına Elmi Tədqiqat İnstitutu / Həkim pediatr; 2005 - 2011 - Azərbaycan Tibb Universiteti / Pediatriya.', '/doctor-photos/regina-nemetova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Rəna Vəkilova-Hodniçak', 'rena-vekilova-hodnicak', 'endocrinology', NULL, 32, 'Haqqında: 2024 - bugünədək Ultralab Tİbb Mərkəzi, Həkim endokrinoloq; 2013 - bugünədək "Yaşam" tibb mərkəzi/ Həkim-endokrinoloq; 2003-2013 - Səhhət klinikası/ Həkim-endokrinoloq; 2001-2003 - Xəzər Qayğıkeşlik Lahiyəsi/ Tibbi koordinator; 1999-2001 - Elmi-Tətqiqat Ağciyər Xəstəlikləri İnstitutu, Həkim endokrinoloq; 1998-1999 - Western medical/ Həkim; 1995-1997- Ordinatura/ Azərbaycan Tibb Universiteti/ Həkim-endokrinoloq; 1994-1995 - İnternatura/ F. Əfəndiyev adına 4 saylı şəhər klinik xəstəxanası/ Həkim-endokrinoloq; 1988-1994 - Azərbaycan Tibb Universiteti/ Müalicə işi.', '/doctor-photos/rena-vekilova-hodnicak.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Şahnaz Rüstəmova', 'sahnaz-rustemova', 'gastroenterology', NULL, 1, 'Haqqında: 1998 - 2004 Azərbaycan Tibb Universiteti / Müalicə işi; 2004 - 2005 Mirqasım adına Respublika Klinik Xəstəxanasında internatura keçmişdir və həkim - qastroentroloq intern vəzifəsində çalışmışdır; 2006 -2009 Neftçala Rayon Mərkəzi xəstəxanasında həkim - terapevt vəzifəsində çalışmışdır; 2016 -2020 Baku Health Medicial Klinikasında həkim - qastroenteroloq vəzifəsində çalışmışdır; 2020 - 2025 "Səmra N " MMC -yə məxsus "Nəbz " Tibb Mərkəzində həkim - qastroenteroloq vəzifəsində çalışmışdır; 2025 - bugünədək Sağlam Ailə Tibb Mərkəzi / həkim - qastroenteroloq.', '/doctor-photos/sahnaz-rustemova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Samir Eybətov', 'samir-eybetov', 'anesthesiology', NULL, 25, 'Haqqında: 2023 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim - anestezioloq; 22.07.2002 - 08.09.2022 - Neyrocərrahiyə Xəstəxanası / Həkim anestezioloq - reanimatoloq; 01.08.2001 - 01.08.2002 - M.Nağıyev adına Bakı şəhər KYTYX / Həkim - intern; 01.08.2001 - 30.06.2002 - M.Nağıyev adına Təcili Tibbi Yardım Xəstəxanası / Anestezioloq-reanimatoloq ixtisası üzrə internatura pilləsini bitirmiş; 1995 - 2001 - N.Nərimanov adına Azərbaycan Tibb Universiteti / Həkim-pediatr ixtisası üzrə bakalavr pilləsini bitirmiş.', '/doctor-photos/samir-eybetov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Şəfa Məmmədova', 'sefa-memmedova', 'internal-medicine', NULL, 41, 'Haqqında: 2017 - bugünədək Sağlam Ailə Tibb Mərkəzi / Terapevt; 2015 Sertifikasiya şəhadətnaməsi / Terapiya üzrə; 2004 - 2016 Həyat Klinikası / Baş həkim / terapevt; 1986 - 2004 Qubadlı rayon Xanlıq kənd xəstəxanası / Baş həkim; 1985 - 1986 Akademik M.Qasımov adına Respublika Klinik Xəstəxanası / Terapiya üzrə; 1979 - 1985 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/sefa-memmedova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Şəfəq Allahyarova', 'sefeq-allahyarova', 'internal-medicine', NULL, 31, 'Haqqında: 2018 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim terapevt; 2016 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu; 1998 - bugünədək 1 saylı Bakı Dəmiryol Poliklinikası / Sahə həkimi; 1996 - 1997 İnternatura. Azərsutikinti Xəstəxanası / Həkim terapevt; 1989 - 1995 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/sefeq-allahyarova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Səidə Mustafayeva', 'seide-mustafayeva', 'ophthalmology', NULL, 3, 'Haqqında: • 2019 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim - oftalmoloq • 1982 - 2023 - Gəncə ş. Göz xəstəxanası/ Uşaq şöbəsinin şöbə müdiri/ Həkim oftalmoloq • 1976 - 1982 - Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim - oftalmoloq • 1975 - 1976 - İnternatura-Mərkəzi birləşmiş şəhər xəstəxanası/ Həkim - oftalmoloq • 1969 - 1975 - Azərbaycan Tibb Universiteti / Pediatriya.', NULL, 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Südabə Quliyeva', 'sudabe-quliyeva', 'radiology', NULL, 47, 'Haqqında: 2017 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim; 2016 Sertifikasiya, Şüa diaqnostika üzrə; 1991 - 2016 1 nömrəli Doğum evi, Şüa diaqnostika üzrə həkim; 1989 - 1991 1 nömrəli Doğum evi, Həkim mama ginekoloq; 1989 Sumqayıt şəhər poliklinası, Sahə həkimi; 1985 - 1989 Ordinatura, Pulmonologiya üzrə; 1984 - 1985 Kirov rayonu 1 nömrəli poliklinası, Həkim pulmonoloq; 1982 - 1984 8 saylı tibb mərkəzi, Həkim terapevt; 1980 - 1982 Naxçıvan Muxtar Respublikası Bədən Tərbiyə Dispanseri, Sahə həkimi; 1979 - 1980 İnternatura, Əfəndiyev adına 4 nömrəli şəhər xəstəxanası, Terapiya üzrə; 1973 - 1979 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/sudabe-quliyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('t.e.d. Rafiq Hüseynzadə', 't-e-d-rafiq-huseynzade', 'urology', NULL, 24, 'Haqqında: 2019 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim- uroloq; 2003 - bugünədək Azərbaycan Tibb Universiteti, Urologiya kafedrası/ Assistent; 2018 - 2019 Ege Universitesi Tıp fakültesi Uroloji Anabilim Dalı/ Genel Uroloji, Endouroloji və Androloji kurs; 2017 - 2018 Sağlam Ailə Tibb Mərkəzi / Həkim- uroloq; 2009 - Tibb Elmləri namizədi; 2005 - 2008 - Aspirantura, Azərbaycan Tibb Universiteti / Urologiya; 2003 - 2005 - Ordinatura, Azərbaycan Tibb Universiteti / Urologiya; 2002 - 2003 - İnternatura / A. T. Abbasov ad. Şəhər Onkoloji dispanser/ Uşaq onkoloqu; 2000 - 2002 ET Travmotologiya və Ortopediya İnstututu/ Tibb qardaşı; 1996 - 2002 Azərbaycan Tibb Universiteti / Həkim-pediatr.', '/doctor-photos/t-e-d-rafiq-huseynzade.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('t.e.n. Əli İbrahimov', 't-e-n-eli-ibrahimov', 'endocrinology', NULL, 44, 'Haqqında: 2008 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim endokrinoloq; 2007 - Azərbaycan Tibb Universiteti, Dosent; 1990 - 2007 Azərbaycan Tibb Universitetinin Daxili xəstəliklər kafedrası, Assistent; 1990 Tibb Elmləri Namizədi, Azərbaycan Tibb Universiteti, Daxili xəstəliklər kafedrası; 1987 - 1990 Azərbaycan Tibb Universiteti daxili xəstəxanası , Aspirant; 1984 - 1987 Sumqayıt şəhər Bərpa müalicə xəstəxana intensiv terapiya; 1983 - 1984 Sumqayıt şəhər 1saylı poliknika , Sahə həkimi; 1982 - 1983 İnternatura. Sumqayıt şəhər 1 № poliknika; 1976 - 1982 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/t-e-n-eli-ibrahimov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('t.e.n. Elmira Mayılova', 't-e-n-elmira-mayilova', 'ophthalmology', NULL, 37, 'Haqqında: 2012 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim oftalmoloq; 2010 Türkiyə İstanbul Lazile kursu / ESCRS Qış konfransı; 2009 Hindistan / Fakoemulsifikasıya kursu; 2008 - bugünədək Modern Hospital / Həkim oftalmoloq; 2005 - 2007 Rusiya Diplomdan sonraki Tibb Akademiyası / Həkim oftalmoloq; 2001 - 2004 Caspian Compassion Project göz klinikası / Həkim oftalmoloq; 2001 Tibb Elmləri Namizədi / Alimlik dərəcəsi; 1994 - 1996 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu / Göz Xəstəlikləri kafedrası / Həkim oftalmoloq; 1992 - 2001 Milli Təhlükəsizlik Nazirliyi Hərbi Hospitalı / Həkim oftalmoloq; 1992 - 1994 Klinik Ordinatura / Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu; 1990 - 1992 Göz Xəstəxanası / Həkim oftalmoloq; 1989 - 1990 Göz Xəstəlikləri İnstitutu / Həkim oftalmoloq; 1983 - 1989 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/t-e-n-elmira-mayilova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('t.f.d. Azər Məlikov', 't-f-d-azer-melikov', 'cardiology', NULL, 34, 'Haqqında: 2018 - bugünədək Sağlam Ailə tibb mərkəzi, həkim kardioloq; 2017 Avropa Kardiologiya Cəmiyyəti, Professional üzvlük; 2015 Azərbaycan Respublikası Prezident yanında Ali Attestasiya Komissiyası, Fəlsəfə doktoru elmi dərəcəsi; 2015 - 2018 Avrasiya Hospitalı, Həkim kardioloq; 2014 Sertifikasiya, Kardiologiya üzrə; 2013 - 2014 Müasir Diaqnostika Klinkası, Həkim kardioloq; 2011 - 2013 Salyan Mərkəzi Rayon Xəstəxanası, Kardiologiya şöbəsinin müdiri; 2010 - 2017 Salyan Mərkəzi Rayon Xəstəxanası, Həkim kardioloq; 2004 - 2007 Medical İnternational Relife, Həkim kardioloq, EXOKQ mütəxəsisi; 1993 - 2010 Salyan Rayonlarası Kardioloji Dispanseri, Həkim kardioloq; 1992 - 1993 İnternatura, Salyan Rayon Mərkəzi Xəstəxanası, Kardiologiya; 1986 - 1988 Sovet ordusunda həqiqi hərbi xidmət; 1984 - 1992 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/t-f-d-azer-melikov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Ülvi Cabbarov', 'ulvi-cabbarov', 'nephrology', NULL, 10, 'Haqqında: 2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim-nefroloq; 2018-2022 - Rezidentura/ Azərbaycan Tibb Universiteti/ Nefrologiya; 2010-2016 - Azərbaycan Tibb Universiteti/ Hərbi həkim işi.', '/doctor-photos/ulvi-cabbarov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Uzm. Dr. Tərlan Abbasov', 'uzm-dr-terlan-abbasov', 'internal-medicine', NULL, 33, 'Haqqında: 2019 - bugünədək Sağlam Ailə tibb mərkəzi / Həkim terapevt; 2019 Sertifikasita / Terapiya üzrə; 2002 - 2006 Gülhane Askeri Tıp Akademisi / Daxili xəstəliklər uzmanı; 1998 - 2019 Silahlı Qüvvələrin Baş Klinik Hospitalı / Qastroenterologiya bölməsi; 1993 - 1994 İnternatura / F. Əfəndiyev adına 4 saylı Klinik xəstəxana / Həkim terapevt; 1987 - 1993 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/uzm-dr-terlan-abbasov.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Vasif Hacıyev', 'vasif-haciyev', 'radiology', NULL, 1, 'Haqqında: • 2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Baş həkim/ Şüa diaqnostikası üzrə həkim • 2023-2024 - Approlab Gəncə/ Həkim radioloq • 2022 - Gəncə Memorial Hospital/ Həkim radioloq • 2017-2022 - Synergy Medical/ Şüa diaqnostikası üzrə həkim • 2015-2017 - Bərdə Müalicə Diaqnostika Mərkəzi/ Şüa diaqnostikası üzrə həkim • 2014-2015 - Naftalan müalicə sağlamlıq mərkəzi/ Həkim-rentgenoloq • 2010-2013 - Çinar hotel&spa Naftalan filialı/ Həkim-rentgenoloq • 2000-2010 - Mingəçevir Mərkəzi xəstəxana/ Həkim-rentgenoloq • 1999-2000 - İnternatura - Mingəçevir Mərkəzi xəstəxana/ Şüa diaqnostikası üzrə həkim • 1993-1999- Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/vasif-haciyev.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Vəfa Eldar', 'vefa-eldar', 'radiology', NULL, 25, 'Haqqında: 2018 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim; 2016 Sertifikasiya, Şüa diaqnostika üzrə; 2016 - 2018 Effekt - Digital MMC, Şüa diaqnostika üzrə həkim; 2015 - 2016 Nigar Klinkası, Şüa diaqnostika üzrə həkim; 2010 - 2011 Ə.Əliyev adına ADHTİ, şüa diaqnostika üzrə təkmilləşdirmə kursu; 2004 - 2012 Sağlam Ailə Tibb Mərkəzi, Həkim funksional diaqnostika; 2001 - 2002 İnternatura , Ə.F.Qarayev adına 2 saylı klinik uşaq xəstəxanası, Funksional diaqnostika üzrə həkim; 1995 - 2001 Azərbaycan Tibb Universiteti, Həkim pediatr.', '/doctor-photos/vefa-eldar.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Xana Əliyeva', 'xana-eliyeva', 'cardiology', NULL, 25, 'Haqqında: 2020 - bugünədək Sağlam Ailə Tibb Mərkəzində / Həkim - kardioloq; 2015 - 2015 - Astoriya Tibb Mərkəzi / Həkim - kardioloq; 2009 - 2014 - VM Endokrinologiya Diabet və Metabolizm Mərkəzi / Həkim - kardioloq; 2007 - 2007 - Moskva Federal Agentliyinin Dövlət Elmi Tədqiqat Profilaktik Tibb Mərkəzi / Həkim-kardioloq; 2003 - 2007- Rusiya Elmi-İstehsalat Kompleksin Kardioloji Mərkəzin A.L. Myasnikov adına Klinik Kardiologiya İnstitutu / Həkim-kardioloq; 2003 - 2007 - RF SN Rusiya kardioloji elmi-istehsalat kompleksi / Kardioloq ixtisası üzrə aspirantura pilləsini bitirmiş; 1995 - 2001 - Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/xana-eliyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Xanım Əhmədova', 'xanim-ehmedova', 'pediatrics', NULL, 24, 'Haqqında: 2004 - bugünədək Sağlam Ailə Tibb Mərkəzi; 2014 Sertifikasiya, Pediatriya üzrə; 2014 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu; 2002 - 2003 İnternatura. K.Y. Fərəcov adına Elmi Tədqiqat Pediatriya İnstitutu; 1996 - 2002 Azərbaycan Tibb Universiteti, Pediatriya.', '/doctor-photos/xanim-ehmedova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Xuraman Cəfərova', 'xuraman-ceferova', 'hematology', NULL, 1, 'Haqqında: • 2025 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim hematoloq • 2024 Sertifikasiya / Hematologiya üzrə • 2010 - 2011 İnternatura / Mərkəzi Klinika / Həkim Hematoloq • 2004 - 2010 Azərbaycan Tibb Universiteti / Müalicə işi.', '/doctor-photos/xuraman-ceferova.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW()),
    ('Zemfira Hacıyeva', 'zemfira-haciyeva', 'radiology', NULL, 46, 'Haqqında: 2010 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim; 2014 - bugünədək Müasir Diaqnostika Klinikası, Şüa diaqnostika üzrə həkim; 2014 Sertifikasiya, Şüa diaqnostika üzrə; 2010 - Qaragözova MMC-nin Tibb Mərkəzi, Şüa diaqnostika üzrə həkim; 2007 - 2009 Kəlbəcər Mərkəzi Rayon Xəstəxanası, Şüa diaqnostika üzrə həkim; 2006 Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdimə İnstitutu, Ultrasəs müayinəsi kursu; 2006 - 2007 Kəlbəcər Mərkəzi Rayon Xəstəxanası, Sahə həkimi; 1996 - 2003 Gülüstan Koorporativi, Həkim terapevt; 1990 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya üzrə kurs; 1987 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya üzrə kurs; 1986 - 1996 N saylı Tibb Məntəqəsi, Həkim terapevt; 1983 - 1986 N saylı Tibb Məntəqəsi, Həkim infeksonist / terapevt; 1980 - 1981 İnternatura. Ak.Mirqasımov adına Respublika Klinik Xəstəxanası, Həkim terapevt; 1974 - 1980 Azərbaycan Tibb Universiteti, Müalicə işi.', '/doctor-photos/zemfira-haciyeva.webp', 'az', 'UNCLAIMED', 'saglamaile.az', 0, 1, NOW(), NOW())
;

-- Each doctor to the branch that employs them, by name rather than in bulk,
-- because for once the source says which building each one works in.
CREATE TEMPORARY TABLE saglam_aile_branch (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO saglam_aile_branch (doctor_slug, clinic_slug) VALUES
    ('aqil-ceferov', 'saglam-aile-gence'),
    ('aynur-quliyeva', 'saglam-aile-nerimanov'),
    ('aynur-salxayeva', 'saglam-aile-nerimanov'),
    ('ayten-sadiqova', 'saglam-aile-nerimanov'),
    ('azad-ekberzade', 'saglam-aile-nerimanov'),
    ('cebrayil-sultanov', 'saglam-aile-28-may'),
    ('ceyhun-ceferov', 'saglam-aile-nerimanov'),
    ('ceyhun-islamov', 'saglam-aile-nerimanov'),
    ('davud-eyvazov', 'saglam-aile-gence'),
    ('elnure-elimirzeyeva', 'saglam-aile-nerimanov'),
    ('emil-hesenov', 'saglam-aile-gence'),
    ('emine-yusifova', 'saglam-aile-gence'),
    ('etibar-suleymanov', 'saglam-aile-nerimanov'),
    ('gulnar-verdiyeva', 'saglam-aile-nerimanov'),
    ('gunay-hacizade', 'saglam-aile-nerimanov'),
    ('gunel-bayramova', 'saglam-aile-nerimanov'),
    ('ilham-igidov', 'saglam-aile-nerimanov'),
    ('ilqar-mikayilzade', 'saglam-aile-nerimanov'),
    ('kemale-qardaseliyeva', 'saglam-aile-nerimanov'),
    ('kemale-rustemova', 'saglam-aile-nerimanov'),
    ('kenan-ehmedov', 'saglam-aile-gence'),
    ('konul-eyvazova', 'saglam-aile-nerimanov'),
    ('konul-qurbetova', 'saglam-aile-nerimanov'),
    ('leman-sultanova', 'saglam-aile-mikrorayon'),
    ('leyla-pasayeva', 'saglam-aile-28-may'),
    ('leyla-qaraqasova', 'saglam-aile-nerimanov'),
    ('mehri-memmed-zade', 'saglam-aile-nerimanov'),
    ('mina-qocayeva', 'saglam-aile-gence'),
    ('nabat-agayeva', 'saglam-aile-mikrorayon'),
    ('nergiz-qurbetova', 'saglam-aile-gence'),
    ('olqa-akcurina', 'saglam-aile-28-may'),
    ('oqtay-kazimov', 'saglam-aile-nerimanov'),
    ('regina-nemetova', 'saglam-aile-mikrorayon'),
    ('rena-vekilova-hodnicak', 'saglam-aile-mikrorayon'),
    ('sahnaz-rustemova', 'saglam-aile-nerimanov'),
    ('samir-eybetov', 'saglam-aile-nerimanov'),
    ('sefa-memmedova', 'saglam-aile-nerimanov'),
    ('sefeq-allahyarova', 'saglam-aile-nerimanov'),
    ('seide-mustafayeva', 'saglam-aile-gence'),
    ('sudabe-quliyeva', 'saglam-aile-sumqayit'),
    ('t-e-d-rafiq-huseynzade', 'saglam-aile-nerimanov'),
    ('t-e-n-eli-ibrahimov', 'saglam-aile-28-may'),
    ('t-e-n-elmira-mayilova', 'saglam-aile-nerimanov'),
    ('t-f-d-azer-melikov', 'saglam-aile-nerimanov'),
    ('ulvi-cabbarov', 'saglam-aile-gence'),
    ('uzm-dr-terlan-abbasov', 'saglam-aile-nerimanov'),
    ('vasif-haciyev', 'saglam-aile-gence'),
    ('vefa-eldar', 'saglam-aile-28-may'),
    ('xana-eliyeva', 'saglam-aile-28-may'),
    ('xanim-ehmedova', 'saglam-aile-nerimanov'),
    ('xuraman-ceferova', 'saglam-aile-nerimanov'),
    ('zemfira-haciyeva', 'saglam-aile-nerimanov')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM saglam_aile_branch b
JOIN doctor d ON d.slug = b.doctor_slug AND d.source = 'saglamaile.az'
JOIN clinic c ON c.slug = b.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE saglam_aile_branch;
