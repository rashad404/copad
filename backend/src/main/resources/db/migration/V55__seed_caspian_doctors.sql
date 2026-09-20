-- The 52 doctors Caspian International Hospital publishes, as 49 new listings
-- and three additions to doctors already here.
--
-- Read from cih.az on 2026-09-20, in Azerbaijani. The ninth source.
--
-- The count is 52 and two of the hospital's own pages agree exactly: the
-- doctors page and the departments page carry the same 52 profiles, with
-- nothing on either side the other lacks. The site publishes no sitemap at
-- all, and its WordPress API does not expose the post type, so those two lists
-- are the whole of the evidence and they are consistent.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- Three of them already work somewhere this directory lists, and the match is
-- not a coincidence of names: Faxri Quliyev and Vugar Fiqarov are at
-- Respublika Diaqnostika Merkezi with the same universities and the same
-- graduation years down to the pair of them, and Kamila Huseynova is at
-- Referans, both listings showing RUDN in Moscow finishing in 1998. They get a
-- second clinic rather than a second listing.
--
-- Three more names match somebody already here and are other people. This
-- Aynur Mammadova is a radiologist and sonographer; the one at Referans is a
-- cardiologist. This Gunel Babayeva is an ENT surgeon; the one at Referans is
-- a radiologist. This Nigar Mehdiyeva qualified in 2007; the oncologist of
-- that name at the medical university qualified in 1999. Only the first needed
-- a suffixed slug.
--
-- Half of them have no portrait: the hospital publishes a photograph for 27 of
-- the 52 on its listing page and none at all on the profile pages, so 25 of
-- these listings fall back to initials. Nothing was invented to fill the gap.
--
-- The profiles are unusually complete otherwise. Fifty-one publish their
-- education and forty-nine their career, many with courses, seminars and
-- papers besides, and all of it is kept as headed sections.
--
-- Data only.

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'Caspian International Hospital' AS name, 'caspian-international-hospital' AS slug,
    'Badamdar, 1-ci yaşayış massivi 31, Bakı' AS address, 'Səbail' AS district, 'Bakı' AS city,
    '+994 12 502 50 16' AS phone,
    'Caspian International Hospital, Bakı. Siyahı xəstəxananın cih.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'caspian-international-hospital');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Dr. Aidə Əliyeva', 'dr-aide-eliyeva', 'neonatology', '2004 Azərbaycan Tibb Universiteti | 2004-2005 Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu, İnternatura', 22, 'Neanotoloq, pediatr.

İş təcrübəsi:
2013-2018 Silahlı Qüvvələrin Baş Klinik Hospitalı, neonatoloq- pediatr
2018 - i.k Caspian International Hospital, Neonatoloq - pediatr', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Almaz İsmayılova', 'dr-almaz-ismayilova', 'pediatrics', '1992-1998 Azərbaycan Dövlət Tibb Universiteti, həkim-pediatr | 1998-1999 Fərəcova adına Elmi Tədqiqat Pediatriyya İnstitutu', 28, 'Pediatr.

İş təcrübəsi:
2003-2004 Mərkəzi klinika, neonatologiya şöbəsi
2004 -2014 Mərkəzi Dəmiryol xəstəxanası, həkim neonatoloq
2014-2015 Vital Doğum evi
2015-2017 İstanbul şəhəri Gaziosmanpaşa Hastanesi,Yenidoğulmaşların reanimasiya və intensiv terapiya şöbəsi
2018 - i.k Caspian İnternational Hospital, pediatr-neonatoloq', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Arzu Şıxhəmzəyeva', 'dr-arzu-sixhemzeyeva', 'neonatology', '1995-2001 Azərbaycan Tibb Universiteti', 25, 'Neonatoloq, pediatr.

İş təcrübəsi:
2001 - 2002 6 saylı Uşaq klinik Xəstəxana, İnternatura
2013 - 2018 Silahlı Qüvvələrin Baş Klinik Hospitalı, Neonatoloq- pediatr
2014 - 2015 Baku Medikal Plaza
2015 - i.k Caspian International Hospital, Neonatoloq - pediatr', '/doctor-photos/dr-arzu-sixhemzeyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Asif Qaranizadə', 'dr-asif-qaranizade', 'general-surgery', '1998 Azərbaycan Tibb Universiteti | 1998 Milli Onkologiya Mərkəzi, internatura', 28, 'Ümumi cərrah.

İş təcrübəsi:
1999 Rusiya Diplomdansonrakı Tibb Akademiyası nəzdində ümumi cərrahiyə ixtisası üzrə sertifikasiya', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Aynur Məmmədova', 'dr-aynur-memmedova-cih', 'radiology', '1994-2000 Azərbaycan Dövlət Tibb Universiteti, müalicə-profilaktika fakultəsi | 2000-2001 Respublika Diaqnostika Mərkəzində internatura keçərək "Şüa diaqnostikası həkimi`` ixtisası almış', 26, 'Radioloq,Ultrasonoqraf.

İş təcrübəsi:
2003-2012 Elmi Tədqiqat Mamalıq və Ginekologiya İnstitutunda elmi işçi vəzifəsində çalışaraq, ultrasəs müayinəsi həkimi kimi praktik fəaliyyətlə məşğul olmuşdur.
2012-2017 Caspian İnternational Hospital
2017 Mərkəzi Gömrük Hospital
2017-2020 Az.Tibb.Univ.Tədris Cərrahiyyə klinikalarında ultrasəs müayinəsi həkimi kmi çalışıb.
2020-i.k Caspian İnternational Hospital

Təlimlər:
2003-2004 Türkiyə Cumhuriyyəti "Hacettepe Üniversitesi Radyoloji Anabilim Dalı"nda 6 aylıq radiologiya üzrə kurs.
2008 Hacettepe Üniv Kadın Doğum Anabilim Dalı"nda 3 aylıq "Fetomaternal Tıbb" kurs.', '/doctor-photos/dr-aynur-memmedova-cih.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Cahid İsayev', 'dr-cahid-isayev', 'cardiology', '2004 Azərbaycan Tibb Universiteti | 2004 Elmi Tədqiqat Kardiologiya İnstitutu, Internatura', 22, 'Kardioloq.

İş təcrübəsi:
2008 Mərkəzi Neftçilər Xəstəxanası
2014 - i.k. Caspian İnternational Hospital, Daxili Xəstəliklər Şöbəsinin müdiri

Təlimlər:
2013 - 2014 Avstriya, Vyana şəhəri, AKH klinikası - kardiologiya üzrə təkmilləşmə', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Emil Əlizadə', 'dr-emil-elizade', 'dermatology', '2004 Azərbaycan Tibb Universiteti | 2004 - 2005 Respublika Dəri-Zöhrəvi Dispanseri, İnternatura', 22, 'Dermatoveneroloq.

İş təcrübəsi:
2007 - 2015 Baki 2 saylı Dəmir Yol Poliklinikası, Dermatoveneroloq
2013 - 2016 Şəfa Müalicəvi Diaqnostik Mərkəzi, Dermatoveneroloq
2014 - 2015 Salutem Dermatoloji Klinikası, Dermatoveneroloq
2016 - i.k. Caspian International Hospital, Dermatoveneroloq

Təlimlər:
2014 - 2015 Russiyanin Moskva şəhərində keçirilən «Dəri xəstəliklərinin lazer üsulu ilə müalicəsi» elmi və praktik seminarlar', '/doctor-photos/dr-emil-elizade.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Fərid Useynov', 'dr-ferid-useynov', 'laboratory', '2006-2011 Azərbaycan Tibb Universiteti, Tibb Biologiya fakultəsi | 2014-2016 Azərbaycan Tibb Universiteti, Tədris Terapevtik Klinikası, Laboratoriya İşi/ Rezidentura', 15, 'Laboratoriya şöbəsinin müdiri.

İş təcrübəsi:
2012-2016 Şəfa" Müalicə Diaqnostika Mərkəzi, Həkim Laborant
2013-2014 Modern Hospital, Həkim Laborant
2014-2016 Azərbaycan Tibb Universiteti, Tədris Terapevtik Klinika, Rezident- Həkim laborant
2016-2018 Referans Klinik Laboratoriya Mərkəzi, Mütəxəssis Həkim laborant
2018-2018 Zəfəran Hospital , Mütəxəssis Həkim laborant
2018 i.k. Caspian İnternational Hospital, Laboratoriya Müdiri', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Fəridə Hüseynli', 'dr-feride-huseynli', 'obstetrics-gynecology', '1974 - 1980 Azərbaycan Tibb Universiteti | 1980 - 1981 Bakı şəhər 5 saylı klinik xəstəxanası, İnternatura | 1988 - 1990 Elmi Tədqiqat Mamalıq və Ginekologiya institutu, Mama-Ginekologiya ixtisası üzrə ordinatura', 46, 'Mama-ginekoloq.

İş təcrübəsi:
1990 - 2011 Elmi Tədqiqat Mamalıq və Ginekologiya institutu, Elmi işçi

Təlimlər:
1988 Elmi Tədqiqat Mamalıq və Ginekologiya institutu, kurs', '/doctor-photos/dr-feride-huseynli.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Flora Quliyeva', 'dr-flora-quliyeva', 'radiology', '1972-1982 Naxçıvan şəhər 5 saylı orta məktəbi | 1983-1989 ADTU-nun müalicə fakultəsi | 1989-1990 Naxçıvan şəhər respublika xəstəxanasında internatura', 44, 'Radioloq (USM).', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Güləbətin Göyüşova', 'dr-gulebetin-goyusova', 'obstetrics-gynecology', '2006-2012 Azərbaycan Tibb Universiteti, Müalicə-profilaktika fakültəsi | 2012-2019 Mərkəzi Klinika , Mama-ginekologiya ixtisasi üzrə rezidentura | 2019 Ankara Tibb Universiteti, Cebeci Xəstəxanasi Perinatologiya və Doğuş şöbəsi kurs', 14, 'Mama-ginekoloq.

İş təcrübəsi:
2019-i.k Caspian İnternationl Hospital', '/doctor-photos/dr-gulebetin-goyusova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Günay Rəhimli', 'dr-gunay-rehimli', 'obstetrics-gynecology', '2006-2012 Azərbaycan Tibb Universitetinin Müalicə işi fakültəsi', 14, 'Mama Ginekoloq.

İş təcrübəsi:
2015-2020 Azərbaycan Tibb Universiteti Tədris Cərrahiyyə klinikası II Mama ginekologiya şöbəsində həkim-rezident vəzifəsində çalışmışdır.
2021i.k Caspian International Hospital - Mama-Ginekoloq

Kurslar:
2017 "Laparoscopic Surgery in gynecology" praktik kurslarında iştirak etmişdir.

İştirak etdiyi seminarlar:
2016 ``Ginekoloji problemlərə və riskli hamiləliklərə müasir yanaşma``
2018 ``Ultrasəs müayinəsi zamanı döldə olan qüsurların aşkarlanması və identifikasiyası``
2021 ``Döldəki qüsurların prenatal diaqnostikası və bətndaxili invaziv müdaxilələr``

Məruzəçi olduğu seminarlar:
2016 "Doğuşdan sonrakı dövrdə fizioloji bərpa və zahılara qulluq qaydaları"
2017 "Endometriozun müasir təsnifatı, diaqnostikası və müalicəsi"
2018 "Hamilələrdə rezus izoimmunizasiya, müayinə, profilaktika və müalicəsində yeniliklər"
2019 "Sidik saxlamazlıq, növləri, müayinə və müalicəsi``', '/doctor-photos/dr-gunay-rehimli.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Günel Axundova', 'dr-gunel-axundova', 'endocrinology', '2006 Azərbaycan Tibb Universiteti, Müalicə işi fakultəsi | 2007 Bakı Endokrinoloji Dispanserində İnternatura', 20, 'Endokrinoloq.

İş təcrübəsi:
2007 Bakı Dəmir Yol Xəstəxanası, Həkim-endokrinoloq
2010 - 2013 İnternation xəstəxanası, Həkim-endokrinoloq
2013 - 2015 İntermed klinikası, Həkim-endokrinoloq
2015 - i.k. Caspian International Hospitalda həkim-endokrinoloq olaraq çalışır

Təlimlər:
2011 Azərbaycan Endokrinoloqlar Elmi Cəmiyyəti, Diabet və Metobolizm mərkəzində kurs
2017 Əziz Əliyev adına Azərbaycan Həkimlərin Təkmilləşdirmə İnstitutunda kurs', '/doctor-photos/dr-gunel-axundova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Heyran Hüseynova', 'dr-heyran-huseynova', 'obstetrics-gynecology', '2005 Azərbaycan Tibb Universiteti | 2006 Bakı şəhər 5 nömrəli şəhər Klinik Xəstəxanası, Ümumi cərrahiyyə ixtisası üzrə internatura | 2009 - 2011 Rusiya Federasiyasi Sankt-Peterburq şəhəri, Diplomdansonrakı təhsil üzrə Tibb Akademiyası, Mama-ginekologiya ixtisasi üzrə klinik ordinatura', 21, 'Mama-ginekoloq.

İş təcrübəsi:
2003 International SOS Klinikası, həkim köməkçisi
2010 - 2012 Özəl "EKO Bezopasnost" klinikası, Mama-ginekoloq

Təlimlər:
2012 - 2013 Kolposkopiya və USM üzrə müxtəlif kurslar
2012 - 2013 Fransa, Klermont-Ferrand ş., Laparoskopiya kursu
2012 - 2013 Türkiyə, Ankara ş., Qazi Universiteti, Süni mayalanma və sonsuzluq üzrə kurs', '/doctor-photos/dr-heyran-huseynova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. İradə Dadaşova', 'dr-irade-dadasova', 'neonatology', '1996-2002 Azərbaycan Tibb Universiteti', 24, 'Neonatoloq-Pediatr.

İş təcrübəsi:
2002-2003 Kübra Fərəcova adına Elmi Tədqiqat Pediatriya İnstitutu və Musa Nağıyev adına Təcili Tibbi Yardım xəstəxanasında - internatura.
2004-2021 Kübra Fərəcova adına Elmi Tədqiqat Pediatriya İnstitutunda Pediatr- Reanimatoloq vəzifəsində çalışmışdır.
2017 Caspian International Hospital klinikasında Neonatoloq - Pediatr vəzifəsində çalışır.', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Lamiyə Məmmədova', 'dr-lamiye-memmedova', 'obstetrics-gynecology', '2002-2008 Azərbaycan tibb universiteti, müalicə işi fakultəsi | 2008-2009 Akademik Topçubaşov adina Elmi Cərahiyyə institu, internatura | 2009-2011 Azərbaycan Tibb Universitetinin 1mamalıq-ginekoloqiya kafedrası, kliniki ordinator', 18, 'Mama-Ginekoloq.

İş təcrübəsi:
2011-2012 Almaniya, Münhen şəhəri, Bogenhaus klinikasinda həkim mama-ginekoloq
2012-2015 Nigar klinikasinda həkim mama-ginekoloq
2015-2018 İnternational Medikal center 1 klinikası, həkim mama-ginekoloq
2018 Caspian İnternational Hospital, həkim mama-ginekoloq', '/doctor-photos/dr-lamiye-memmedova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Mətanət Əliyeva', 'dr-metanet-eliyeva', 'general-surgery', '2001-2007 Müalicə profilaktika fakultəsi. | 2007-2008 Ə. D. Məlikov adına 6 saylı Birləşmiş Şəhər Xəstəxanası İnternatura', 19, 'Həkim-Cərrah.

İş təcrübəsi:
2008-2018 İmişli Mərkəzi Rayon Xəstəxanası, Həkim-cərrah
2019-i.k Caspian İnternational Hospital da Həkim Cərrah kimi fəaliyyət göstərir.

Təlimlər:
2015 İsrael, Tel-Aviv, Top Assuta və İxilov klinikası Cərrahi kurs.
2015 Ə.Əliyev ad. Azərbaycan Həkimlərin Təkmilləşdirmə İnstitutu kurs.', '/doctor-photos/dr-metanet-eliyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Mirvari Mehdiyeva', 'dr-mirvari-mehdiyeva', 'obstetrics-gynecology', '1977 - 1983 Azərbaycan Tibb Universiteti | 1984 - 1985 Mirqasımov adına Respublika klinik xəstəxanası, İnternatura', 43, 'Mama-ginekoloq.

İş təcrübəsi:
1984 - 1988 Belarusiya, Minsk şəhəri, Təcili Yardım Ginekologiya şöbəsi, Mama-ginekoloq
1988 - 2000 Bakı şəhəri, 2 saylı dogum evi, Mama-ginekoloq
2000 - 2013 Elmi Tədqiqat Mamalıq və Ginekologiya institutu
2013 - i.k. Caspian İnternational Hospital, Mama-ginekoloq', '/doctor-photos/dr-mirvari-mehdiyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Naidə İsmayılova', 'dr-naide-ismayilova', 'obstetrics-gynecology', '2001 Azərbaycan Tibb Universitetinin Müalicə işi fakultəsi | 2001-2003 Rusiya Federasiyası, Moskva səhəri "İ.M.Seçenov" adına Tibb Akademiyasında mama-ginekologiya üzrə klinik ordinatura .', 25, 'Mama-Ginekoloq.

İş təcrübəsi:
2001-2002 Rusiya Federasiyası Moskva səhəri 27 saylı doğum evi.
2002-2003 Rusiya Federasiyası Moskva şəhəri 33 saylı klinik xəstəxanası.
2003-2004 Rusiya Federasiyası Moskva səhəri 40 saylı klinik xəstəxanasında mama-ginekoloq.
2004-2013 Azərbaycan,Bakı,Elmi Tədqiqat Mamalıq və Ginekologiya İnstitutunda mama-ginekoloq
2014 i.k. Mərkəzi Gömrük Hospitalda mama-ginekoloq
2018 i.k. Caspian İnternational Hospital

Təlimlər:
2004 Rusiya Federasiyası Moskva səhərin 40saylı klinik xəstəxanasında endoskopiya üzrə kurslar, qadın xəstəlikləri və qadın cərrahiyəsi üzrə yüksək ixtisas təlimi
2007 Türkiyə, Ankara şəhərində "Reproduktiv Səhiyyə Xidmətlərində və Komunikasiyada kütləvi informasiya vasitələrin metodları" mövzusunda praktik təhsil kursu.', '/doctor-photos/dr-naide-ismayilova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Nərmin Quliyeva', 'dr-nermin-quliyeva', 'radiology', '2005-2011 ATU, I MPF | 2011-2015 Milli Onkologiya Mərkəzi,Şüa-diaqnostika ixtisası üzrə rezidentura təhsili | 2010 İstanbul tibb universiteti,Çapa xəstəxanası, radiologiya şöbəsi kurs | 2015 Almaniya Türingen əyaləti,Greiz şəhər xəstəxanası,radiologiya şöbəsi kurs', 15, 'Radioloq.

İş təcrübəsi:
2016-2018 Modern hospital, Radioloq
2017-2019 Stimul hospital, Radioloq
2019-i.k Caspian İnternational Hospital, Radioloq', '/doctor-photos/dr-nermin-quliyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Nigar Əlizadə', 'dr-nigar-elizade', 'obstetrics-gynecology', '2005-2011 Azərbaycan Tibb Universiteti | 2011-2016 Elmi Tədqiqat Mamalıq - Ginekoloqiya İnstutu rezidentura təhsili', 15, 'Mama - ginekoloq.

İş təcrübəsi:
2015 Ankara Ataturk Eğitim Araştırma xəstəxanası
2017 BŞX - da ginekoloq
2017. i.k. Caspian İnternational Hospital, mama -ginekoloq

Təlimlər:
2013 "Actual problems of modern perinatology" simpozium
2014 Ovulyasiya induksiyası və USM ilə təqibi kursu
2015 "Teorik ve praktik uygulamalı histeroskopi & laparoskopi kursu" Ankara,Turkiyə
2015 "Mamalıqda təkmilləşdirilmiş təxirəsalınmaz yardım" üzrə təlim
2017 "Basic OB-GYN ultrasound" kurs
2018 IV Azerbaijan-German-Turkish medical congres və s.', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Nigar Mehdiyeva', 'dr-nigar-mehdiyeva', 'radiology', '2000-2007 Azərbaycan Tibb Universiteti', 19, 'Həkim- Radioloq.

İş təcrübəsi:
2007-2008 Bakı Dəmiryol Xəstəxanası, Həkim- Radioloq
2008-2009 Milli Onkologiya Mərkəzi
2009-2010 K.Y.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu
2014-2016 Leyla Shixlinskaya Klinikası, Həkim - Radioloq
2018-i.k Caspian İnternational Hospitalda, Həkim-Radioloq

Kurslar:
2010-2011 Gaziosmanpaşa Universitesinde kurs
2012 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, təkmilləşmə kursu.', '/doctor-photos/dr-nigar-mehdiyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Ruslan Qasımov', 'dr-ruslan-qasimov', 'anesthesiology', '1995-2001 Azərbaycan Tibb Universitetində Pediatriya fakultəsindən məzun olmuşdur. | 2001-2002 M.Nağıyev adına TTYX-da Anesteziologiya və Reanimasiya şöbəsində internatura kursunu bitirmişdir.', 25, 'Anestezioloq-reanimatoloq.

İş təcrübəsi:
2003-2005 1 Saylı Şəhər Klinik Xəstəxanasında (Semaşko) ümumi reanimasiya şöbəsində həkim-reanimatloloq vəzifəsində çalışmışdır.
2005-2010 Mərkəzi Neftçilər Xəstəxanasında həkim-reanimatoloq vəzifəsində fəaliyyətini davam etdirmişdir.
2005-2016 LHS Klinikasında ``Anesteziologiya və Reanimasiya`` şəbəsində anestezioloq-reanimatoloq vəzifəsində çalışmışdır.
2013-2016 LHS Klinikasında ``Anesteziologiya və Reanimasiya`` şəbəsinin müdiri vəzifəsində işləmişdir.
2016-2017 Grand Hospitalda ``Reanimasiya`` şöbəsinin müdiri və müalicə işləri üzrə müdir müavini vəzifəsində işləmişdir.
2017-2018 Səudiyyə Ərəbistanının Aljouf vilayətində yerləşən Prince Mutaib Bin Abdulaziz Hospitalda İCU həkim-spesialist vəzifəsində çalışmışdır.', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Ruziyyə Mirzəyeva', 'dr-ruziyye-mirzeyeva', 'obstetrics-gynecology', '2007 Rusiya, Uzaq Şərq Dövlət Tibb Universiteti | 2007 - 2009 Rusiya, Uzaq Şərq Dövlət Tibb Universiteti, Klinik ordinatura', 19, 'Mama-ginekoloq.

İş təcrübəsi:
2009 - 2013 Biləsuvar şəhəri, doğum evi, Mama-ginekoloq
2013 - i.k. Caspian International Hospital, Mama-ginekoloq

Təlimlər:
2010 Moskva, Mama-ginekologiya və Perinatalogiya Elmi Tədqiqat Mərkəzi, Endoskopik əməliyyat kursları', '/doctor-photos/dr-ruziyye-mirzeyeva.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Şəhla Abbasova', 'dr-sehla-abbasova', 'internal-medicine', '1987 Azərbaycan Tibb Universiteti | 1987 - 1988 Gəncə şəhəri, 1 saylı Tibbi Sanitar hissə, İnternatura', 39, 'Terapevt.

İş təcrübəsi:
1988 - 1998 Gəncə şəhəri, Müharibə və Əmək veteranları poliklinikası, Terapevt
1998 - 2004 Gəncə şəhəri, 2 saylı Tibbi Sanitar hissə, Terapevt
2004 - 2006 Gəncə şəhəri, 3 saylı poliklinika, Terapevt
2006 - 2017 Bakı, «MediLux» klinikası, Terapevt
2017 - i.k. Caspian International Hospital, Terapevt

Təlimlər:
1998 Sankt-Peterburq, Diplomdansonrakı Təhsil Akademiyası, təkmilləşmə kursu
2001 Sankt-Peterburq, Diplomdansonrakı Təhsil Akademiyası, təkmilləşmə kursu
2006 Sankt-Peterburq, Diplomdansonrakı Təhsil Akademiyası, təkmilləşmə kursu', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Şəhla Hüseynova', 'dr-sehla-huseynova', 'obstetrics-gynecology', '2003-2009 Azərbaycan Tibb Universiteti, müalicə profilaktika fakultəsi. | 2009-2010 Sankt Peterburq Diplomdan sonrakı Təhsil Tibb Akademiyasında internatura', 17, 'Mama Ginekoloq.

İş təcrübəsi:
2013-2014 Qusar rayonu OKİ klinikası, mama-ginekoloq.
2014-2016 Xaçmaz rayon Qadın məsləhətxanası, mama-ginekoloq.
2016-2019 N.Tusi adına klinika, mama-ginekoloq.
2019-i.k Caspian İnternational Hospital, mama-ginekoloq.

Kurslar:
2012 D.O.Otta adına institutun reproduktologiya kafedrasında 6 aylıq kurs', '/doctor-photos/dr-sehla-huseynova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Sevil Rəhimova', 'dr-sevil-rehimova', 'obstetrics-gynecology', '1991 Qazaxıstan Respublikası, Alma-Ata Dövlət Tibb Universiteti | 1992 - 1993 Alma-Ata, 5 nömrəli doğum evi, İnternatura', 35, 'Mama-ginekoloq.

İş təcrübəsi:
1993 - 2000 Alma-Ata Perinatal Mərkəzi, Mama-ginekoloq
2000 - 2013 Elmi Tədqiqat Mamaliq və Ginekologiya İnstitutu, Mama-ginekoloq, Qəbul şöbəsinin müdiri
2013 - i.k. Caspian International Hospital, Mama-ginekoloq', '/doctor-photos/dr-sevil-rehimova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Sevinc İbrahimova', 'dr-sevinc-ibrahimova', 'laboratory', '1989-1994 Bakı Dövlət Universiteti', 32, 'Həkim-laborant.

İş təcrübəsi:
1994-2006 Naxçıvan şəh.,"Ana və uşaq" reabilitasiya mərkəzi, Həkim-laborant
2006-2013 Naxçıvan şəh.,"Doğum mərkəzi", Həkim-laborant
2013 i.k. Caspian İnternational Hospital, Həkim-laborant

Kurslar:
1994 Ə.Əliyev adına Həkim Təkmilləşdirmə İnstitutu,ixtisas dəyişmə,kliniki laborator diaqnostika ixtisası üzrə həkim-laborant
2016 Laborator diaqnostika inkişafının yeni tendensiyaları seminarı
2017 SYSMEX UX2000 idrar sisteminin eğitimi
2017 Her Yönü ile İdrar analizi sempozyumu', '/doctor-photos/dr-sevinc-ibrahimova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Sevinc Kərimova', 'dr-sevinc-kerimova', 'radiology', '1998 - 2004 Azərbaycan Tibb Universiteti | 2004 - 2005 M.N.Qədirli adına Mərkəzi Hövzə xəstəxanasında funksional-diaqnostika ixtisasi üzrə internatura .', 22, 'Radioloq (USM).

İş təcrübəsi:
2006 - 2011 İntermed Tibb Mərkəzi
2013 - 2017 Caspian İnternational Hospital
2017 - 2018 Mərkəzi Gömrük Hospitalı
2018 - i.k Caspian İnternational Hospitalda fəaliyyətini davam etdirir.

Təlimlər:
2016 Kiev, Ukrayna.
2016 Krakow, Polşa.
2016 Roma, İtaliya
2017 Bakı, Azərbaycan.
2017 Vyana, Avstriya
2017 Bakı, Azərbaycan.
2018 Bakı, Azərbaycan
2018 Lvov, Ukrayna', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Tatyana Jdanova', 'dr-tatyana-jdanova', 'obstetrics-gynecology', '1981 Azərbaycan Tibb Universiteti | 1981 - 1982 5 nömrəli doğum evi, İnternatura', 45, 'Mama-ginekoloq.

İş təcrübəsi:
1983 - 1986 Baki, 6 nömrəli doğum evi, Mama-ginekoloq
1986 - 2013 Mamalıq və ginekologiya institutu, Hamiləlik patologiyası şöbəsinin müdiri
2013 - i.k. Caspian International Hospital, Mama-ginekoloq

Təlimlər:
1987 Moskva şəhəri, Genetika İnstitutu, Prenatal Diaqnostika kursu', '/doctor-photos/dr-tatyana-jdanova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Təmail İbadov', 'dr-temail-ibadov', 'anesthesiology', '2000 - ci il Azərbaycan Tibb Universitetinin Müalicə-profilaktika fakultəsi. | 2001 - ci il Lənkəran Mərkəzi Klinik Xəstəxanasında İnternatura. | 2003-2005 Rusiya Dövlət Tibb Akademiyasında kliniki tibbi ordinatura.', 26, 'Anestezioloq-reanimatoloq.

İş təcrübəsi:
2006-2011 City Hospital, Anesteziologiya və reanimasiya şöbəsinin müdiri.
2013- i.k Caspian International Hospitalda Anesteziologiya və reanimasiya şöbəsinin müdiri vəzifəsində çalışır.

Təlimlər:
2009 İstanbul Universitetinin, İstanbul tibb fakultəsinin xəstəxanası.', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Tural Tanrıverdizadə', 'dr-tural-tanriverdizade', 'neurology', '2011 Azərbaycan Tibb Universiteti | 2013 - 2016 Türkiyə Cumhuriyətinin Dokuz Eylül Universiteti Nevrologiya şöbəsinin Sağlıq Bilimləri İnstitunun Clinical Neuroscience (Kliniki Nevrobilimlər) bölümü üzrə Master -pre PhD (Yüksək ixtisas)', 15, 'Nevroloq.

İş təcrübəsi:
2010 Azərbaycan , Biləcəri Dəmir Yol xəstəxanasının Efferent terapiya şöbəsinin köməkçi həkimi
2013 - 2016 Dokuz Eylül Üniversiteti Nevroloji bölümü Nevrootologiya- nevrooftalmologiya poliklinikasında və stasionarında baş assistent həkim
2016 Medera Hospitalda Həkim - Nevroloq

Təlimlər:
2013 Türkiyə Nevroloji Dərnəyinin Nevrootologiya - nevrooftalmologiya simpoziumu
2014 TND 50. Bəynəlmiləl Nevrologiya Konfransı
2015 Başkənt Üniversiteti, Psixiologiya Bölümü, Şüur və Hüdudlari: W.James, S.Freud, S.T.Coleridge, A.Huxley qış məktəbi konfransı
2015 Türkiyə Nevroloji Dərnəyinin Nevrootologiya - nevrooftalmologiya simpoziumu
2015 TND 51. Bəynəlmiləl Nevrologiya Konfransı
2016 Multipl Skleroz araştirmalari Dərnəyi, Daginiq sklerozda fiziki əlilliyin ölçülməsi simpoziumu

Elmi iş və məqalələr:
2011 ATU- nun Tələbə Elmi Cəmiyyətinin 79. Elmi Konfransında ``Qaraciyər Transplantasiyası Əməliyyatindan sonra xəstələrin yaşam göstəricisi `` mövzusunda çıxışa görə , Qalib Diplomu
2016 Journal of the Neurological Sciences , "Selective impairment of horizontal vestibulo-ocular reflexes in acute Wernicke''s encephalopathy"
2016 Jun 15;365:167-8. doi: 10.1016/j.jns.2016.04.013. Epub 2016 Apr 14 ; www.ncbi.nlm.nih.gov/pubmed/27206900
2016 Jun 15;365:167-8. doi: 10.1016/j.jns.2016.04.013. Epub 2016 Apr 14 ; www.ncbi.nlm.nih.gov/pubmed/27206900-- Acta Neurol Belg DOI 10.1007/s13760-016-0628-z , "Room tilt illusion: a symptom of both peripheral and central vestibular disorders. " www.ncbi.nlm.nih.gov/pubmed/27015958
2016 "Xroniki İnflamatuvar Demiyelinizan Polinevropatiyada Vestibülookulyar Sistemin Video Head Impulse Test ile İncələnməsi" mövzusunda tezis-elmi iş müdafiəsi tez.yok.gov.tr/UlusalTezMerkezi/tezlerim.jsp
2017 eNeurologicalSci 7 (2017) 7-8, "Convergence spasm due to aquaporin-positive neuromyelitis optica spectrum disorder "; http://dx.doi.org/10.1016/j.ensci.2017.03.001.
2017 -- Turkish Archives of Otorhinolaryngology, " Comparison of Audiological Findings in Patients with Vestibular Migraine and Migraine " DOI: 10.5152/tao.2017.2609, www.turkarchotorhinolaryngol.org web', '/doctor-photos/dr-tural-tanriverdizade.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Türkan Məmmədova', 'dr-turkan-memmedova', 'obstetrics-gynecology', '2013 İstanbul Universiteti Tibb fakültəsi qadın doğum bölümündə praktika | 2011-2016 ATU TCK Ginekologiya ixtisası üzrə Rezidentura təhsili | 2005-2011 Azərbaycan Tibb Universiteti, müalicə-profilaktika fakultəsi', 15, 'Mama-Ginekoloq.

İş təcrübəsi:
2017 Caspian Hospital - Mama-Ginekoloq
2017 14Nli BSX-da ginekoloq', '/doctor-photos/dr-turkan-memmedova.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Ülviyyə Əhmədova', 'dr-ulviyye-ehmedova', 'anesthesiology', '2012 Azərbaycan Tibb Universiteti, Pediatriya fakültəsi | 2015 Azərbaycan Tibb Universiteti, Anesteziologiya və reanimatologiya ixtisası üzrə rezidentura', 14, 'Anestezioloq və reanimatoloq.

İş təcrübəsi:
2015 - 2017 Azərbaycan Tibb Universitetinin Tədris Terapevtik Klinikası, anestezioloq və reanimatoloq
2017 Avrasiya Hospital, anestezioloq
2017 Caspian International Hospital, Anestezioloq və reanimatoloq

Təlimlər:
2009 Ankara Tibb Fakültəsi , Cebeci Xəstəxanası, geriatriya
2011 İstanbul Özel Avicenna Xəstəxanası, yenidoğulmuşların reanimasiyası
2014 Erciyes Universiteti, anesteziologiya ve reanimatologiya', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Xalidə Məmmədova', 'dr-xalide-memmedova', 'obstetrics-gynecology', '1972 Azərbaycan Tibb Universiteti', 54, 'Doğum və Zahılıq şöbəsinin müdiri.

İş təcrübəsi:
1975-1986 N6 Doğum evi, mama-ginekoloq
1977-2000 Mamalıq-Ginekoloqiya İnstutu, Cərrahi ginekoloqiya şöbəsinin müdiri.
2000-2013 Ə. Şıxlinskaya klinikası, mamalıq-ginekoloqiya şöbəsinin şöbə müdiri.
2013-2018 Caspian İnternational Hospital, mamalıq-ginekologiya şöbəsinin müdiri.
2017 "Mərkəzi Gömrük" xəstəxanası, mama-ginekoloq, cərrah

Kurslar:
- Əziz Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, mamalıq və ginekologiya ixtisasları üzrə kurslar.
1987 Rusiya, Moskva, Mamalıq, Ginekologiya və Perintologiya Elmi-Tədqiqat Mərkəzi, endoskopik əməliyyatlar üzrə kurslar. Nəticəsi:Azərbaycanın ilk endoskopisti (laparoskopiya və historoskopiya)', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Dr. Xəyalə Tahirova', 'dr-xeyale-tahirova', 'neurology', '2002 Azərbaycan Tibb Universiteti, Pediatriya fakultəsi | 2003 Uşaq Nevroloji Xəstəxanası, İnternatura', 24, 'Nevroloq.

İş təcrübəsi:
2005 - 2011 Daxili İşlər Nazirliyinin Hərbi Hospitalı
2010 - 2011 "Origami" uşaq və gənclərin reablitasiyası mərkəzi
2011 - 2014 Loğman klinikası
2014 - 2016 Dövlət Təhlükəsizlik Xidmətinin Hərbi Hospitalı
2017 - i.k. Caspian International Hospital

Təlimlər:
2008 SAVA CONSULT, «Teambuilding»
2010 Ə.Əliyev ad.Azərbaycan Dövlət Həkimləri Təkmilləşmə İnstitutu nevrologiya kafedrası, Beynəlxalq mütəxəssislərin iştirakı ilə Azərbaycan nevroloqlarının dördüncü konfransı.
2011 Ə. Əliyev ad. Azərbaycan Dövlət Həkimləri Təkmilləşmə İnstitutu nevrologiya kafedrası, Nevrologiya üzrə ümumi təkmilləşmə kursu
2017 Almaniya Federativ Respublikası Sankt Elizabeth Hospital, Hospitasion mövzulu konfrans', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Mütəx. Dr. Lalə Həsənova', 'mutex-dr-lale-hesenova', 'neurology', '2011 Azərbaycan Tibb Universiteti | 2015 Azərbaycan Tibb Universitetinin Tədris Terapevtik Klinikası, rezidentura', 15, 'Nevroloq.

İş təcrübəsi:
2015 Caspian International Hospital, nevroloq

Təlimlər:
2012 Bakı, Uluslararası Acil Tıp Sempozyumu
2012 Bakı, "Sinir sisteminin çox yayılmış xəstəlikləri" mövzusunda Azərbaycan Nevroloqlar Assosiasiyasının Konfransı
2012 Bakı, Azərbaycan Nevroloqlar Assosiasiyasının V Konfransı
2013 Bakı, Azərbaycan Tibb Universiteti rezidentlərinin I Elmi-təcrübi Konfransı (I ATUREK)
2013 Bakı, Ümummilli lider Heydər Əliyevin 90 illik yubileyinə həsr olunmuş "Xəstəxanadaxili infeksiyalar, antibiotiklərə rezistentlik, dezinfeksiya, antiseptika və sterilizasiya problemləri" simpoziumu
2013 Bakı, "Terapevtik Tədris Məktəbi" mühazirə tsikli
2014 Bakı, Azərbaycan Tibb Universiteti rezidentlərinin II Elmi-təcrübi Konfransı (II ATUREK)
2014 Bakı, Avropa Nöroloji Akademiyası ``Regional Tədris Kursu``
2014 Georgia, Bakuriani, ILAE / CEA-GLAE 6, Klinik Epileptologiya üzrə Qafqaz Yay Məktəbi
2015 Türkiyə, Ankara, Ankara Epilepsi Gecesi
2015 Türkiyə Respublikasının Ankara Universitetinin İbni Sina xəstəxanasının Nevrologiya şöbəsində, o cümlədən Hacettepe Universitetinin Tibb fakultəsinin Nevrologiya şöbəsində nevrologiya üzrə ixtisasartırma kursları', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Mütəx. Dr. Ülkər Əliyeva', 'mutex-dr-ulker-eliyeva', 'gastroenterology', '2011 Azərbaycan Tibb Universiteti | 2011 - 2015 ATU, Tədris Terapevtik Klinika, Rezidentura', 15, 'Qastroenteroloq.

İş təcrübəsi:
2015 - 2016 Tovuz rayonu, Hemodializ və Diaqnostika mərkəzi, Qastroenteroloq
2015 - 2016 Caspian International Hospital, Qastroenteroloq

Təlimlər:
05/2013 ATU rezidentlərinin I elmi-təcrübi konfransı (Məruzə : Vilson xəstəliyi)
04/2014 ATU rezidentlərinin II elmi-təcrübi konfransı (Məruzə: Hemodializdə olan xroniki B hepatitli xəstənin Telbuvidinlə müalicəsi)
09/2014 XIII Beynəlxalq Avrasiya Tibb Konqresi
10/2014 Terapiyanın aktual problemləri - elmi praktik seminar
04/2015 Azərbaycan - Alman - Türk Tibb Konqesi
04/2015 Azerbaijan-German-Turkish Medical Congress for surgery, oncology and gastroenterology - completion of the workshops on Endoscopy
05/2015 ATU rezidentlərinin III elmi-təcrübi konfransı (Məruzə: Diafraqmal yırtığı olan xəstələrdə qastroezofageal reflyuks xəstəliyinin rast gəlinməsi)
10/2016 II Azərbaycan - Türkiyə ortaq Hepatoloji kursu
02/2017 I Bakı Endoskopiya Forumu', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Op. Dr. Günel Babayeva', 'op-dr-gunel-babayeva', 'ent', '2006 - 2012 Azərbaycan Tibb Universiteti, Müalicə - profilaktika fakültəsi | 2013 - 2017 ATU, Otolarinqologiya kafedrası, rezidentura təhsili', 14, 'Otolarinqoloq (LOR).

İş təcrübəsi:
2013 - 2017 ATU Tədris Cərrahiyyə Klinikası, Otolarinqologiya kafedrası, həkim rezident
2017 - i. k. Caspian International Hospital, mütəxəssis-otolarinqoloq

Təlimlər:
2013 Bakı, Endoskopik Sinus və Kəllə Əsası Cərrahiyyəsi
2014 T.C. Sağlık Bakanlığı Ankara Eğitim ve Araştırma Hastanesi, Ankara, Türkiye
2014 Bakı, Yaxın Avrasiya Afrika Qulaq-Burun-Boğaz Cəmiyyətinin (NERAS), Beynəlxalq Konqresi
2015 37-ci Türk Ulusal Kulak Burun Boğaz ve Baş Boyun Cerrahisi Kongresi, Antalya, Türkiye
2015 Transsfenoidal Hipofizektomi Sonuçlarımız, Türkiyе
2016 Stapes agenezisi. 38 Türk Ulusal Kulak Burun Boğaz ve Baş Boyun Cerra-hisi Kongresi, Antalya, Türkiye
2016 Koklear implantasyon cerrahisi uygulanan 41 hastanın analizi. 38 Türk Ulu-sal Kulak Burun Boğaz ve Baş Boyun Cerrahisi Kongresi, Antalya, Türkiye', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('T. ü. E. D Prof. Emin Cavadov', 't-u-e-d-prof-emin-cavadov', 'general-surgery', '1985 Azərbaycan Tibb Universiteti | 1988 - 1991 Aspirantura təhsili | 2009 - 2011 Moskva, Doktorantura', 41, 'Ümumi cərrah, koloproktoloq.

İş təcrübəsi:
1990 - i.k. Akademik M. A. Topçubaşov adına Elmi-Cərrahiyyə Mərkəzi, cərrah-koloproktoloq
2014 - i.k. Caspian International Hospital, cərrah-koloproktoloq', '/doctor-photos/t-u-e-d-prof-emin-cavadov.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('T.ü.f.d. Bəxtiyar Zeynalov', 't-u-f-d-bextiyar-zeynalov', 'neonatology', '1995 Azərbaycan Tibb Universitetinin Pediatriya fakultəsi | 1995 Elmi-Tədqiqat Pediatriya İnstitutu, internatura | 1997-1999 Rusiyada, Sankt Peterburq Dövlət Pediatriya Tibb Akademiyasında anesteziya və intensiv terapiya üzrə klinik ordinatura', 31, 'Neontalogiya şöbəsinin müdiri.

İş təcrübəsi:
1998-2006 Rusiya, Sankt-Peterburq, 1 və 17 nömrəli Şəhər Uşaq Xəstəxanası, Neonatal reanimasiya bölməsi
2002-2006 Rusiya, Sankt-Peterburq, Pediatrik Akademiyada Neonatal Pediatriya və Anesteziologiya Reanimasiya kafedrasında müəllim
2006-2009 Yaponiya, Tokio, Uşaqların sağlamlığı, inkişafı və mühafizəsi üzrə Milli Mərkəz, PICU, NICU
2009-2011 Yaponiya, Nagano, Nagano prefektural Uşaq xəstəxanası, NICU
2011-2016 Leyla Şıxlinskaya klinikası
2017- i.k Caspian İnternational Hospital, Neonatoloq-reanimatoloq və pediatr', '/doctor-photos/t-u-f-d-bextiyar-zeynalov.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('T. ü. F. D Vəfa Hüseynzadə', 't-u-f-d-vefa-huseynzade', 'obstetrics-gynecology', '2000 Azərbaycan Tibb Universiteti | 2000 - 2001 Elmi-Tədqiqat Mamalıq və Ginekoloqiya İnstitutu, İnternatura', 26, 'Mama-ginekoloq.

İş təcrübəsi:
2001 Elmi-Tədqiqat Mamalıq və Ginekologiya İnstitutu, Mama-ginekoloq
2013 Caspian International Hospital, Mama-ginekoloq

Təlimlər:
2011 Fransa, Klermon-Ferrand şəhəri, CICE təcrübə kursu
2013 Əziz Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, ixtisas artırma kursu
2014 Fransa, Strasburq şəhəri, IRCAD təcrübə kursu

Elmi iş və məqalələr:
2009 ``Abdominal doğuşun müasir aspektləri`` mövzusunda namizədlik dissertasiyasının müdafiəsi', '/doctor-photos/t-u-f-d-vefa-huseynzade.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzm. Dr. Aydın Talışınskiy', 'uzm-dr-aydin-talisinskiy', 'ent', '1996 - 2002 M. V. Lomonosov adına Moskva Dövlət Universiteti | 2003 - 2008 Türkiyə, İzmir, Dokuz Eylül Universiteti, Qulaq, burun, boğaz və baş - boyun cərrahiyyəsi kafedrası', 24, 'Qulaq, burun, boğaz həkimi.

İş təcrübəsi:
1996 - 2002 Moskva, Kreml Xəstəxanası (Rusiya Federasiyası Prezidenti yanında Mərkəzi Klinik Xəstəxana)
2002 Türkiyə, İzmir, Egey Universiteti Xəstəxanası
2003 - 2008 Türkiyə, İzmir, Dokuz Eylül Universiteti Xəstəxanası
2008 - 2009 Mərkəzi Klinik Xəstəxana, Bakı
2009 - 2011 Leyla Şıxlinskaya Klinikası, Bakı
2011 Bakı, "Medical Plaza"
2012 Prezident yanında Xüsusi Tibb Xidmətinin Xüsusi Müalicə Sağlamlıq Kompleksi
2013 Caspian International Hospital

Təlimlər:
1998 Emergency First Aid developed by the İnstitue of Continuing Education (Texas, USA)
1998 American Health Alliance, Moskva
2001 2nd World Congress of Otorhinolaryngologic Allergy Endoscopy and Laser Surgery, Afina, Yunanıstan
2004 20th Congress of the European Rhinologic Society and 23rd Congress of İSİAN, İstanbul
2005 Türk Kulak Burun Boğaz ve Baş Boyun Cerrahisi Derneği, 3. Akademik Toplantı, İzmir
2005 XVIII IFOS ENT World Congress, Roma, Italiya
2005 International Conference Series in Otolaryngolgoy, Rescent
2005 Advances In Rhinoplasty and Facial Plastic Surgery, İzmir
2005 11th Congress of the International Rhinologic Society, Sidney, Avstraliya
2006 Kadavra Uygulamalı Endoskopik Sinüs Cerrahisi Kursu, İzmir
2007 3rd Baha Workshop, İzmir
2007 "Otolojide Güncel Başlıklar" konulu KBB Günleri, Çeşmə
2007 Orta Kulak ve Kafa Tabanı Cerrahisi, kadavra uygulamalı kurs, Heidelberg, Almanya
2007 4. Koklear İmplantasyon Otoloji-Nörotoloji, Odyoloji Kongresi, İzmir
2008 3. Kadavra Uygulamalı Endoskopik Sinüs Cerrahisi Kursu, İzmir
2008 4.Ulusal Rinoloji Kongresi, Antalya
2009 IFOS - XIX ENT World Congress, Sao-Paolo, Braziliya
2013 - 2014 A. İ. Kolomiyçenko adına Kiyev Elmi-Tədqiqat Otolarinqologiya İnstitutu, Ukrayna
2015 Şiraz Universiteti, Rinologiya və Fasiyal Plastik Cərrahiyyə, İran', '/doctor-photos/uzm-dr-aydin-talisinskiy.webp', 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzm. Dr. Aytən Quliyeva', 'uzm-dr-ayten-quliyeva', 'pediatrics', '1999-2005 Azərbaycan Dövlət Tibb Universiteti, Müalicə işi fakultəsi | 2014-2019 Ankara Üniversiteti Tibb Fakültəsi, Uşaq Sağlamlığı və Xəstəlikləri uzmanlıq təhsili', 21, 'Həkim-Pediatr.

İş təcrübəsi:
2021 Caspian İnternational Hospital , həkim-pediatr

Konfrans və seminarlar:
2015 Aprel 4-cü PUADER Kongresi Antalya
2014 Dekabr Neonatal Resursitasiya Programı Ankara
2016 Oktyabr "Çocuklarda İleri Yaşam Desteği Kursu" Ankara
2017 Mart "Otoinflamatuar Hastalıklar Sempozyumu" Ankara
2017 Oktyabr "14. Çocuk Yoğun Bakım ve Acil Tıp Kongresi" Adana
2018 Aprel "Çocuk Hekiminin Bir Günü" telim toplantısı Kıbrıs
2018 noyabr "62.Türkiye Milli Pediatri Kongresi" Antalya
2018 noyabr "Yenidoğan Uygulamalarına Güncel Yaklaşım Kursu" Antalya
2019 Mart "IX Kistik Fibrozis Sempozyumu" Ankara', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzm. Dr. Cahid Şahbazov', 'uzm-dr-cahid-sahbazov', 'ophthalmology', '1998 Azərbaycan Tibb Universitetinin Müalicə -profilaktika fakultəsi | 2005 Ege Universiteti , "Göz hastalıkları" Şöbəsində uzmanlıq təhsili almışdır', 28, 'Cərrah Oftalmoloq.

İş təcrübəsi:
2011-2015 Mərkəzi Neftçilər Xəstəxanası, oftalmoloq
2015-2018 Oksigen klinikası, cərrah oftalmoloq
2018 - i.k Caspian İnternational Hospital, cərrah oftalmoloq

Sertifikatlar:
2013 ESCRS Glaucoma Day held in Amsterdam, The Netherlands
2013 XXXI Congress of the EUROPEAN SOCIETY of CATARACT and REFRACTİVE SURGEONS, Amsterdam, The Netherlands', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzm.Dr. Nurlan Hüseynov', 'uzm-dr-nurlan-huseynov', 'internal-medicine', '2008 - 2014 Azərbaycan Tibb Universiteti, Müalicə işi fakültəsi | 2017 - 2021 Uzmanlıq təhsili,Bezmialem Vakıf Universitesi, İç hastalıkları Anabilim Dalı,İstanbul, Türkiyə', 12, 'Daxili Xəstəliklər Uzmanı.

İş təcrübəsi:
2015-2016 Türkiyə Cumhuriyyəti, Bursa şəhəri, Uludağ Universiteti, Beyin və sinir cərrahiyyəsi şöbəsi
2022 Caspian İnternational Hospital, Daxili Xəstəliklər Uzmanı

Konfrans və seminarlar:
2017 iyul Avropa hematoloji onkoloji kongresi (EHOC) , Istanbul Türkiyə
2018 fevral Uludağ iç hastaliklari kongresi . Bursa .Türkiye
2019 sentyabr 1. Diyabet gunleri . İzmir .Türkiyə
2020 sentyabr 2. Diyabet gunleri . İstanbul .Türkiyə
2018 iyul Çapa romatoloji günleri , İstanbul, Türkiye
2019 iyun Çapa romatoloji günleri , İstanbul, Türkiye
2022 iyul Çapa romatoloji günleri, İstanbul, Türkiye
2022 sentyabr V. Romatoloji sempozyumu , İstanbul, Türkiye', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzm. Dr. Rəşad Sultan', 'uzm-dr-resad-sultan', 'obstetrics-gynecology', '1999 Azərbaycan Tibb Univeristeti (fərqlənmə diplomu ilə) | 1999 - 2000 Bakı şəhəri, Azərsutikinti xəsətəxanası, Ümumi Cərrahiyə üzrə internatura | 2004 - 2009 Türkiyə, İstanbul Universiteti, Cərrahpaşa Tibb Fakültəsi, Mamalıq-ginekologiya kafedrası, uzmanlıq təhsili', 27, 'Ginekologiya şöbəsinin müdiri.

İş təcrübəsi:
2000 - 2002 Azərbaycan Respublikası Silahlı Qüvvələri, Hərbi həkim (ehtiyatda olan tibb xidməti baş-leytenantı)
2009 - 2011 Mərkəzi Klinika, Mama-ginekoloq
2011 - 2014 HB-Güvən Klinikası, Mama-ginekoloq
2014 - 2016 Bakı Sağlamlıq Mərkəzi, Mama-ginekoloq
2016 - i.k. Caspian International Hospital, Mama-ginekoloq', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzman Dr. Fazil Zeynalov', 'uzman-dr-fazil-zeynalov', 'radiology', '1995-2001 Azərbaycan Tibb Universitetinin Müalicə -profilaktika fakultəsi | 2014-2018 Ankara Atatürk Eğitim ve Araştırma Hastanesi, Radioloqiya uzmanlıq təhsili', 25, 'Radioloq.

İş təcrübəsi:
2002-2004 Azərbaycan Respublikası Silahlı Qüvvələri, Hərbi həkim
2006-2014 International SOS(GİM), Bakı- Həkim
2018-2019 Visart Tibbi Görüntüleme Merkezi, Ankara-Radioloq
2019-2019 Medisis Hastanesi, Ankara-Radioloq
10.2019-i.k Caspian İnternational Hospital-Radioloq

Sertifikatlar:
2018 European Diploma İn Radiology', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW()),
    ('Uzman Dr. Rəşad Sadıqov', 'uzman-dr-resad-sadiqov', 'pediatric-surgery', '2008-2014 Azərbaycan Tibb Universiteti | 2016-2021 İstanbul Şişli Hamidiye Etfal Xəstəxanası', 12, 'Uşaq Cərrahı.

Kurslar:
2016 2-ci Türk Pediatriya Birliyi Gənc pediatrlar Konqresi, İstanbul
2017 28-ci Avropa Pediatrik Urologiya Konqresi, Barcelona
2019 Yeni doğulmuşların reanimasiya proqramı, İstanbul
2021 38-ci Milli Uşaq Cərrahiyyəsi Konqresi, Antalya', NULL, 'az', 'UNCLAIMED', 'cih.az', 0, 1, NOW(), NOW())
;

-- The 49 new listings, plus the three doctors already here who also work at
-- this hospital and now show both.
CREATE TEMPORARY TABLE cih_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO cih_placement (doctor_slug, clinic_slug) VALUES
    ('dr-aide-eliyeva', 'caspian-international-hospital'),
    ('dr-almaz-ismayilova', 'caspian-international-hospital'),
    ('dr-arzu-sixhemzeyeva', 'caspian-international-hospital'),
    ('dr-asif-qaranizade', 'caspian-international-hospital'),
    ('dr-aynur-memmedova-cih', 'caspian-international-hospital'),
    ('dr-cahid-isayev', 'caspian-international-hospital'),
    ('dr-emil-elizade', 'caspian-international-hospital'),
    ('dr-ferid-useynov', 'caspian-international-hospital'),
    ('dr-feride-huseynli', 'caspian-international-hospital'),
    ('dr-flora-quliyeva', 'caspian-international-hospital'),
    ('dr-gulebetin-goyusova', 'caspian-international-hospital'),
    ('dr-gunay-rehimli', 'caspian-international-hospital'),
    ('dr-gunel-axundova', 'caspian-international-hospital'),
    ('dr-heyran-huseynova', 'caspian-international-hospital'),
    ('dr-irade-dadasova', 'caspian-international-hospital'),
    ('dr-kamile-huseynova', 'caspian-international-hospital'),
    ('dr-lamiye-memmedova', 'caspian-international-hospital'),
    ('dr-metanet-eliyeva', 'caspian-international-hospital'),
    ('dr-mirvari-mehdiyeva', 'caspian-international-hospital'),
    ('dr-naide-ismayilova', 'caspian-international-hospital'),
    ('dr-nermin-quliyeva', 'caspian-international-hospital'),
    ('dr-nigar-elizade', 'caspian-international-hospital'),
    ('dr-nigar-mehdiyeva', 'caspian-international-hospital'),
    ('dr-ruslan-qasimov', 'caspian-international-hospital'),
    ('dr-ruziyye-mirzeyeva', 'caspian-international-hospital'),
    ('dr-sehla-abbasova', 'caspian-international-hospital'),
    ('dr-sehla-huseynova', 'caspian-international-hospital'),
    ('dr-sevil-rehimova', 'caspian-international-hospital'),
    ('dr-sevinc-ibrahimova', 'caspian-international-hospital'),
    ('dr-sevinc-kerimova', 'caspian-international-hospital'),
    ('dr-tatyana-jdanova', 'caspian-international-hospital'),
    ('dr-temail-ibadov', 'caspian-international-hospital'),
    ('dr-tural-tanriverdizade', 'caspian-international-hospital'),
    ('dr-turkan-memmedova', 'caspian-international-hospital'),
    ('dr-ulviyye-ehmedova', 'caspian-international-hospital'),
    ('dr-xalide-memmedova', 'caspian-international-hospital'),
    ('dr-xeyale-tahirova', 'caspian-international-hospital'),
    ('fexri-quliyev', 'caspian-international-hospital'),
    ('mutex-dr-lale-hesenova', 'caspian-international-hospital'),
    ('mutex-dr-ulker-eliyeva', 'caspian-international-hospital'),
    ('op-dr-gunel-babayeva', 'caspian-international-hospital'),
    ('t-u-e-d-prof-emin-cavadov', 'caspian-international-hospital'),
    ('t-u-f-d-bextiyar-zeynalov', 'caspian-international-hospital'),
    ('t-u-f-d-vefa-huseynzade', 'caspian-international-hospital'),
    ('uzm-dr-aydin-talisinskiy', 'caspian-international-hospital'),
    ('uzm-dr-ayten-quliyeva', 'caspian-international-hospital'),
    ('uzm-dr-cahid-sahbazov', 'caspian-international-hospital'),
    ('uzm-dr-nurlan-huseynov', 'caspian-international-hospital'),
    ('uzm-dr-resad-sultan', 'caspian-international-hospital'),
    ('uzman-dr-fazil-zeynalov', 'caspian-international-hospital'),
    ('uzman-dr-resad-sadiqov', 'caspian-international-hospital'),
    ('vuqar-fiqarov', 'caspian-international-hospital')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM cih_placement p
JOIN doctor d ON d.slug = p.doctor_slug
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE cih_placement;
