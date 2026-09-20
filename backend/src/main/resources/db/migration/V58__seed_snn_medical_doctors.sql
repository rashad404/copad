-- The 11 dentists SNN Medical publishes.
--
-- Read from snn.az on 2026-09-20, in Azerbaijani. The twelfth source, and the
-- first that is a dental practice rather than a hospital.
--
-- The count is 11 and four readings of the page agree: the portrait files, the
-- alt text on them, the name-and-role pairs in the rendered list, and the
-- eleven profile URLs. Nothing paginates and nothing is hidden behind a
-- filter.
--
-- Every one of them is recorded under dentistry. That needs saying, because
-- one of them is listed as "Terapevt" and another as "Ortoped Terapevt", which
-- read as internal medicine and orthopaedics anywhere else in this directory.
-- In a dental practice they are the therapeutic and prosthetic dentists, and
-- filing them under internal medicine would send somebody with chest pain to a
-- man who fills teeth.
--
-- The practice has two branches, on Cavadxan kucesi and Fuad Ibrahimbeyov
-- kucesi, and its site never says which doctor works at which. Rather than
-- split them on a guess, there is one clinic row carrying the main branch's
-- address, and the second branch is named in the description. Both are in
-- Baku, so no city filter is affected either way.
--
-- Namiq Ahmadov shares a name with a neurosurgeon already in this directory,
-- at OKI Hospital. A dentist and a neurosurgeon are not the same man.
--
-- None of these doctors asked to be here. Every row is UNCLAIMED with
-- accepts_bookings = 0.
--
-- The profiles carry a written biography and the universities attended, so
-- both are kept. No length of service is published anywhere, so
-- years_experience is NULL throughout.
--
-- Data only.

INSERT INTO clinic (name, slug, address, district, city, phone, description, active, created_at, updated_at)
SELECT * FROM (SELECT
    'SNN Medical' AS name, 'snn-medical' AS slug,
    'Cavadxan küçəsi 31C, Nəsimi, Bakı' AS address, 'Nəsimi' AS district, 'Bakı' AS city,
    '+994 99 313 25 64' AS phone,
    'SNN Medical stomatoloji klinikası, Bakı. İki filialı var: Memar Əcəmi (Cavadxan küçəsi 31C) və Nizami (Fuad İbrahimbəyov küçəsi 20A). Siyahı klinikanın snn.az saytındakı həkim kataloqu əsasında hazırlanıb.' AS description,
    1 AS active, NOW() AS created_at, NOW() AS updated_at) AS c
WHERE NOT EXISTS (SELECT 1 FROM clinic WHERE slug = 'snn-medical');

-- INSERT IGNORE, not ON DUPLICATE KEY: MariaDB on production does not take
-- the row-alias form, and a slug that somehow already exists should be left
-- alone rather than overwritten by a scrape.
INSERT IGNORE INTO doctor
    (full_name, slug, specialty_code, qualifications, years_experience, bio,
     photo_url, languages, verification, source, accepts_bookings, active, created_at, updated_at)
VALUES
    ('Anar Yaqublu', 'anar-yaqublu', 'dentistry', 'Azərbaycan Tibb Universiteti', NULL, 'Paradontoloq.

Həkim haqqında:
Doktor stomatoloq-parodontoloq Anar Yaqublu
2015-2020-ci illərdə
Azərbaycan Tibb Universitetinin Stomatologiya Fakültəsində
tam ali təhsil almışdır. Təhsil müddətinin sonunda o, stomatologiya sahəsində geniş nəzəri və praktik biliklər qazanmışdır.
2020-2023-cü illərdə
Azərbaycan Tibb Universitetində Parodontologiya üzrə rezidentura təhsili
almış və bu sahədə dərin ixtisaslaşmışdır.
2022-ci ildə Türkiyənin paytaxtı
Ankara şəhərində, Gazi Universiteti Klinikası
nda Parodontologiya üzrə
rotasiya proqramı
keçmişdir.
2023-2024-cü illərdə Parodontoloji
kurikulum proqramını
uğurla tamamlamış, 2025-ci ildə isə
European Federation of Periodontology, Vienna
konfransında iştirak etmişdir.
Dr. Anar Yaqublu həm
Azərbaycan, həm də Avropa Parodontoloqları Cəmiyyətlərinin
fəal üzvüdür.
2021-ci ildən etibarən
SNN Medical Klinikasının Memar Əcəmi filialında estetik stomatoloq-parodontoloq
kimi fəaliyyət göstərir. Həkim, pasiyentlərin estetik və funksional gülümsəməsini təmin etmək üçün müasir texnologiyalardan, yüksək keyfiyyətli materiallardan və fərdi yanaşmadan istifadə edir.
🦷
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/anar-yaqublu.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Fərəc Həsənov', 'ferec-hesenov', 'dentistry', 'Ukrayna Xarkov Milli Tibb Universiteti', NULL, 'Ortoped-implantoloq.

Həkim haqqında:
Həkim stomatoloq Fərəc Həsənov
2011-ci ildə
Ukraynanın Xarkov Milli Tibb Universitetinin Stomatologiya fakültəsinə
qəbul olmuş və 2016-cı ildə həmin universiteti uğurla bitirmişdir.
Peşəkar inkişafını davamlı olaraq davam etdirən Dr. Fərəc Həsənov 2018-ci ildə İsveçrənin
Zurix şəhərində "SISCON" implantoloji kursunu
tamamlamışdır. 2019-cu ildə isə İsrailin
Aşdod şəhərində keçirilən "MIS - Make it Simple"
kursunda təhsil almışdır.
2020-ci ildə Azərbaycan İmplantoloqlar Birliyinin təqdim etdiyi
"Anterior Restoration Master Class"
və
"Anterior dişlərin estetik restavrasiyası"
kurslarını bitirmişdir. Həmin ildə həmçinin Almaniyada təşkil olunan
IVOCLAR kursu
və Türkiyədə keçirilən
ITI - International Team for Implantology
implantoloji kursunda iştirak etmişdir.
2021-ci ildə Dubayda keçirilən beynəlxalq
Stomatoloji sərgidə
iştirak etmişdir. 2022-ci ildən etibarən
ITI - International Team for Implantology
üzvüdür, 2023-cü ildən isə
Azərbaycan Parodontologiya Cəmiyyətinin
üzvüdür.
2017-ci ildən etibarən
SNN MEDICAL VİP filialında həkim stomatoloq
kimi fəaliyyət göstərir. Dr. Fərəc Həsənov, müasir implantoloji, estetik və funksional stomatologiya sahəsində pasiyentlərə fərdi yanaşma ilə yüksək keyfiyyətli müalicələr təqdim edir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/ferec-hesenov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Namiq Əhmədov', 'namiq-ehmedov', 'dentistry', 'Gürcüstan Respublikası, Tbilisi Humanitar Universiteti', NULL, 'Ortoped Terapevt.

Həkim haqqında:
Həkim Stomatoloq Namiq Əhmədov
2015-2020-ci illərdə
Gürcüstan Respublikası, Tiflis şəhəri, Tiflis Humanitar Universiteti
nin stomatologiya fakültəsində ali təhsil almışdır. Universiteti bitirdikdən sonra Tiflis şəhərində yerləşən
"NEW DENT" klinikasında
terapevtik və cərrahi stomatologiya üzrə rezidentura təhsilini davam etdirmiş və paralel olaraq
həkim-rezident
kimi fəaliyyət göstərmişdir.
2023-cü ildə Azərbaycana qayıdaraq
"NB Dental" klinikasında
həkim stomatoloq kimi çalışmışdır. 2024-cü ilin fevral ayından etibarən
Dr Pərviz İsayevin təsis etdiyi SNN Medical
stomatoloji klinikasında həkim stomatoloq ortoped kimi fəaliyyət göstərir.
Namiq Əhmədov həm Azərbaycanda, həm də ölkə xaricində keçirilən stomatoloji seminar və konfranslarda müntəzəm iştirak edir, stomatologiya sahəsində baş verən yenilikləri yaxından izləyir. Həkim pasientlərə
cərrahiyə, terapevtik və ortopedik xidmətləri
"SNN Medical"ın Nizami filialında təqdim edir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/namiq-ehmedov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Nərmin İsayeva', 'nermin-isayeva', 'dentistry', 'Ukrayna Xarkov Milli Tibb Universiteti | Estetik stomatologiya, uşaq stomatologiyası | 2013-2018', 8, 'Terapevt.

Həkim haqqında:
Həkim-stomatoloq Nərmin İsayeva
2012-ci ildə orta təhsilini Almaniyada tamamlamışdır. 2013-cü ildə
Ukraynanın Xarkov Milli Tibb Universitetinin Stomatologiya fakültəsinə
qəbul olunmuş və 2018-ci ildə universiteti uğurla bitirmişdir.
2015-2018-ci illər ərzində Ukrayna, İsveçrə və Azərbaycanda keçirilən müxtəlif stomatoloji kurs və təlimlərdə iştirak etmiş, peşəkar bilik və bacarıqlarını daim təkmilləşdirmişdir. 2018-ci ildə
"Este Perio"
"Dentsply Sirona"
və
"LM Arte"
tərəfindən təşkil olunan ixtisasartırma kurslarını müvəffəqiyyətlə tamamlamışdır.
Hal-hazırda Dr. Nərmin İsayeva
SNN Medical
stomatoloji klinikasında həkim-stomatoloq kimi fəaliyyət göstərir. 2025-ci ildə
Birləşmiş Ərəb Əmirliklərində keçirilən "AEEDC Dubai"
beynəlxalq stomatologiya konfransında iştirak edərək, dünya stomatologiyasında tətbiq olunan ən son yenilik və texnologiyalarla yaxından tanış olmuşdur.
Dr. Nərmin İsayeva həm böyüklər, həm də uşaq stomatologiyası sahəsində peşəkar xidmət göstərir və pasiyentlərə fərdi yanaşma, yüksək keyfiyyətli estetik və funksional stomatoloji xidmətlər təqdim edir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/nermin-isayeva.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Nəsrəddin İsayev', 'nesreddin-isayev', 'dentistry', 'Ukrayna, Xarkov Milli Tibb Universiteti', NULL, 'Paradontoloq.

Həkim haqqında:
əkim Stomatoloq Nəsrəddin İsayev
2014-cü ildə orta təhsilini Bakı şəhərində başa vurmuşdur. Eyni ildə
Ukraynanın Xarkov Milli Tibb Universiteti, Stomatologiya fakültəsi
nə qəbul olub və 2018-ci ildə universiteti bitirmişdir.
2018-ci ildə İsveçrənin Zürix şəhərində
"SİSCON" implantoloji kursu
2019-cu ildə İsrailin Aşdod şəhərində təşkil olunan
"MIS - Make it Simple" kursu
və 2020-ci ildə Azərbaycan İmplantoloqlar Birliyinin təqdim etdiyi
"Anterior Restoration Master Class" və "Anterior dişlərin estetik restavrasiyası" kursları
nı bitirmişdir.
2020-ci ildə Almaniyada keçirilən
İVOCLAR kursu
eyni il Türkiyədə təşkil olunan
ITI - International Team for Implantology
implantoloji kursunda təhsil almışdır. 2021-ci ildə Dubayda keçirilən stomatoloji sərgidə iştirak etmiş, 2022-ci ildən etibarən isə
ITI - International Team of Implantology
üzvüdür. 2023-cü ildən
Azərbaycan Parodontologiya Cəmiyyətinin
üzvüdür.
2025 və 2026-cı illərdə Birləşmiş Ərəb Əmirliklərində keçirilən
AEEDC Dubai beynəlxalq stomatologiya konfranslarında
iştirak etmiş və dünya stomatologiyasındakı ən son yeniliklərlə yaxından tanış olmuşdur.
2019-cu ildən
SNN MEDICAL VİP filialında
həkim stomatoloq kimi fəaliyyətə başlamışdır. 2022-ci ildən etibarən
SNN MEDICAL Memar Əcəmi filialının direktoru
olaraq çalışır.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/nesreddin-isayev.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Pərviz İsayev', 'perviz-isayev', 'dentistry', 'Azərbaycan Dövlət Tibb Universiteti', NULL, 'Ortoped-İmplantoloq.

Həkim haqqında:
SNN Medical Stomatoloji Klinikasının Təsisçisi və Baş Həkimi - Həkim-Stomatoloq Pərviz İsayev
Pərviz İsayev 1991-ci ildə Azərbaycan Dövlət Tibb Universitetini fərqlənmə diplomu ilə bitirmişdir. 2000-ci ildən etibarən Bakı şəhərində fərdi stomatoloq kimi fəaliyyət göstərmişdir.
2005-ci ildə SNN Medical stomatoloji klinikasını təsis etmiş və bu günə qədər baş həkim vəzifəsində çalışır. Onun rəhbərliyi altında klinika yüksək keyfiyyətli stomatoloji xidmətlər təqdim edir və pasiyent məmnuniyyətini prioritet olaraq saxlayır.
2009-cu ildən etibarən Pərviz İsayev Avropa, Asiya və Amerika qitələrində keçirilən beynəlxalq forum və konfranslarda fəxri qonaq qismində iştirak etmiş, stomatologiya sahəsindəki ən son yeniliklər və texnologiyalarla yaxından tanış olmuşdur. O, 2009-cu ildə Pekində, 2010-cu ildə İsveçrədə, 2015-ci ildə Los-Ancelesdə, 2019-cu ildə Ukraynada və Almaniyada, 2020-ci ildə İsraildə, eləcə də 2021-ci ildə Cənubi Koreyada keçirilən beynəlxalq konfransların iştirakçısı olmuşdur.
2011-ci ildən etibarən Almaniyanın Köln şəhərində keçirilən Dünya Stomatologiya Sərgisinin daimi iştirakçısıdır. 2012-ci ildən "ITI" (International Team for Implantology) təşkilatının üzvüdür.
2020-ci ildə SNN Medical stomatoloji klinikasının ikinci filialını təsis etmişdir. 2025 və 2026-cı illərdə Birləşmiş Ərəb Əmirliklərində keçirilən AEEDC Dubai beynəlxalq stomatologiya konfranslarında iştirak etmiş, dünya stomatologiyasındakı ən son yeniliklərdən geniş məlumat əldə etmişdir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/perviz-isayev.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Ramil Sərdarov', 'ramil-serdarov', 'dentistry', 'Azərbaycan Tibb Universiteti', NULL, 'Ortoped-Terapevt.

Həkim haqqında:
Dr. Stomatoloq Ramil Sərdarov
1999-2004-cü illərdə
Azərbaycan Tibb Universitetinin Stomatologiya fakültəsində
ali təhsil almışdır. 2004-2007-ci illərdə klinik internatura və ordinaturanı
Rusiyanın Moskva şəhərində yerləşən "Российский Университет Дружбы Народов"
universitetində keçmişdir.
Həkim-stomatoloq Ramil Sərdarov daha sonra Azərbaycanda fəaliyyət göstərən özəl stomatoloji mərkəzdə 2008-2009-cu illərdə həkim-stomatoloq kimi fəaliyyətə başlamışdır. 2009-cu ildən etibarən Ramil Sərdarov Rusiyada bir çox özəl stomatoloji klinikalarda həkim-stomatoloq ortoped kimi çalışmışdır:
2009-2010
Intel Med (Moskva, Rusiya)
2010-2011
Medical Life (Bakı, Azərbaycan)
2011-2013
Intel Med (Moskva, Rusiya)
2014-2016
Premium Dental (Bakı, Azərbaycan)
2016-2018
Neodent S (Bakı, Azərbaycan)
2018-2021
Dental World B.İ (Bakı, Azərbaycan)
2022-2024-cü illərdə Ramil Sərdarov Bakı şəhərində fəaliyyət göstərən bir neçə özəl klinikada həkim-stomatoloq ortoped kimi çalışmışdır. 2024-cü ilin aprel ayından etibarən isə
SNN Medical stomatoloji klinikalar şəbəkəsinin Memar Əcəmi filialında həkim-stomatoloq ortoped-terapevt
kimi fəaliyyət göstərir.
Dr. Ramil Sərdarov Avropa və Asiyada keçirilən stomatoloji konfranslarda müntəzəm iştirakçıdır və dünya stomatologiyasındakı yeniliklərdən daim xəbərdardır.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/ramil-serdarov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Vüsal Xəlilov', 'vusal-xelilov', 'dentistry', 'Azərbaycan Tibb Universiteti', NULL, 'Ortodont.

Həkim haqqında:
Həkim stomatoloq Vüsal Xəlilov
2011-ci ildə
Azərbaycan Tibb Universiteti, Stomatologiya fakültəsi
nə daxil olmuş və 2016-cı ildə həmin universiteti bitirmişdir. Təhsil müddətində praktiki biliklərini artırmaq üçün 2013-cü ildən etibarən
Azərbaycan Tibb Universitetinin Tədris Stomatoloji Klinikasında
fəaliyyətə başlamışdır.
2016-cı ildən bir sıra özəl stomatoloji klinikalarda həkim stomatoloq kimi fəaliyyət göstərmişdir. 2020-ci ildən etibarən
SNN Medical
stomatoloji klinikasında çalışır. 2021-ci ilin may ayında
Həkimləri Təkmilləşdirmə İnstitutunda
sertifikasiyadan uğurla keçmişdir.
2013-cü ildən bu günə qədər həm Azərbaycanda, həm də xarici ölkələrdə keçirilən çoxsaylı konfrans, seminar və kurslarda fəal iştirak etmişdir. O, Türkiyə, Almaniya, Rusiya və İsraildə təşkil olunan beynəlxalq implantologiya konfranslarında iştirak etmiş, həmçinin 2018-ci ildə Bakıda keçirilən
İmplantoloqların Beynəlxalq Xəzər Konfransı
nın iştirakçısı olmuşdur.
Həkim Vüsal Xəlilov bu konfranslar və təlimlərdə qazandığı bilik və təcrübəni:
estetik diş restavrasiyasında
ortodontiyanın təməl prinsiplərində
müasir endodontiya prosedurlarında
implantologiyada
fəal şəkildə tətbiq edir. Pasiyentlərə fərdi yanaşması, diqqətli və professional xidmət göstərməsi ilə seçilir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/vusal-xelilov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Xəyalə Hacıyeva', 'xeyale-haciyeva', 'dentistry', 'Azərbaycan Tibb Universiteti', NULL, 'Ortodont.

Həkim haqqında:
Həkim-stomatoloq Xəyalə Əfəndi qızı Hacıyeva
1980-ci ildə Bakıda anadan olmuşdur. 1986-1997-ci illərdə məktəb illərində bir sıra fənlər üzrə rayon və şəhər olimpiadalarının qalibi olmuşdur. 1997-ci ildə orta məktəbi əla qiymətlərlə bitirmiş və yüksək qəbul nəticəsi ilə
Azərbaycan Tibb Universitetinin Stomatologiya fakültəsinə
daxil olmuşdur.
1997-2002-ci illərdə universitet illərində
Tələbə Elmi Cəmiyyətinin Ən Yaxşı Tələbə-Elmi Tədqiqatçısı
adına layiq görülmüşdür. 2002-ci ildə ATU-ni əla qiymətlərlə bitirmiş, 2002-2003-cü illərdə
1 saylı şəhər Stomatoloji poliklinikasında internaturanı
keçmiş və
Ümumi həkim-stomatoloq ixtisasına
yiyələnmişdir.
Xəyalə Hacıyeva stomatologiyanın bütün sahələri üzrə həm uşaq, həm də böyüklər üçün peşəkar qəbul icra edir. Peşəkarlığını artırmaq məqsədilə ölkədaxili və ölkəxarici bir çox kurs və təlimlərdə iştirak etmişdir:
Dr. Filippo Santarkanjelo - "Diş kanallarının təkrar müalicəsi"
Dt. Dr. Gulcan Şahin - "Uşaq pasiyentlərdə klinik endodonti"
Dr. Cabbar Həsənov - "A-Z dental implantoloji kursu"
Prof. Dr. Erhan Çömlekoğlu - "Oklüzyon və temporomandibulyar eklem problemləri"
Doç. Dr. Enis Güray - "Mənim ortodontiyam"
Dr. Samir Kərimov - "Anterior və posterior dişlərin estetik və funksional restavrasiyası"
Dr. Mendosa Yelena - "Estetik restavrasiyalarda səhvlərin işlənməsi"
Vinir və qapaqlar, Elaynerlərlə ortodontik müalicə, Pitts protokolu, Ortodontiyada mikroimplantlar və s.
2020-ci ildən etibarən
SNN Medical klinikasının Memar Əcəmi filialında
fəaliyyət göstərir və pasiyentlərinə yüksək keyfiyyətli estetik və funksional stomatoloji xidmətlər təqdim edir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/xeyale-haciyeva.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Ülfət Məmmədov', 'ulfet-memmedov', 'dentistry', 'Türkiyə Cumhuriyyəti, Erciyes Universiteti', NULL, 'Implantoloq.

Həkim haqqında:
Uzman Stomatoloq Ülfət Məmmədov
2008-ci ildə
Azərbaycan Tibb Universiteti, Stomatologiya fakültəsinə
daxil olmuş və 2013-cü ildə məzun olmuşdur. 2013-2016-cı illərdə
Azərbaycan Tibb Universitetində rezidentura təhsili
alaraq "həkim-mütəxəssis" adını qazanmışdır.
2014-2015-ci illərdə "Öğrenci Değişim" proqramı ilə rezidentura təhsilinin bir hissəsini
Türkiyə Cumhuriyyəti, Kayseri şəhəri, Erciyes Universiteti
ndə tamamlamışdır. 2016-2017-ci illərdə Bakı şəhəri
26 saylı Birləşmiş Şəhər Xəstəxanası
nda həkim-stomatoloq kimi fəaliyyət göstərmişdir.
2017-2018-ci illərdə
Türkiyə Cumhuriyyəti, İstanbul Universitetində
staj keçmişdir. 2018-2022-ci illərdə Türkiyənin
Trabzon şəhəri, Karadeniz Teknik Universitetində
"dişəti xəstəlikləri müalicəsi, cərrahiyəsi və implantologiya (parodontologiya)" üzrə uzmanlıq təhsilini tamamlayaraq
"Uzman Diş Həkimi"
adını almışdır.
2022-ci ildən etibarən
SNN Medical Əcəmi klinikasında Uzman Stomatoloq
kimi fəaliyyət göstərir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/ulfet-memmedov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW()),
    ('Əjdər İbrahimov', 'ejder-ibrahimov', 'dentistry', 'Türkiyə, Ankara Miadent klinikasında 3 aylıq restovrativ və endodontiya üzrə praktiki kurs | 3 ay | Azərbaycan Tibb Universiteti | Stomatologiya | 2008-2009 | Ukrayna, Xarkov Dövlət Tibb Universiteti | Stomatologiya | 2009-2014', 12, 'Ortodont.

Həkim haqqında:
Dr. stomatoloq-ortodont Əjdər İbrahimov
2008-ci ildə
Azərbaycan Tibb Universitetinə
qəbul olmuşdur. Daha sonra 2009-cu ildə
Xarkov Dövlət Tibb Universitetinə
daxil olmuş və 2014-cü ildə həmin universiteti uğurla bitirmişdir.
Peşəkar inkişafını daim davam etdirən Dr. Əjdər İbrahimov 2011-ci ildə Odessa şəhərində stomatologiyada
allerqoloji hallar üzrə kursu
tamamlamışdır. Həmin ildə o
SafeSiders®️ və The Endo-Express®️ EDS (USA)
endodontik kurslarını da bitirmişdir.
2013-cü ildə
RECIPROC və MTWO
endodontik kurslarında iştirak etmişdir. 2016-cı ildə Türkiyənin Ankara şəhərində yerləşən
Miadent klinikasında
3 aylıq
restavrativ və endodontiya
üzrə praktiki kurs keçmişdir. Eyni ildə 3 aylıq
Latviya stomatoloji implantasiya kursunun
iştirakçısı olmuşdur.
2017-ci ildə
Astra Tech implant sistemi
üzrə kursda iştirak etmiş, həmçinin
VII Beynəlxalq Xəzər Konfransı
və
EstePerio konfransının
iştirakçısı olmuşdur. 2018-ci ildə
III Beynəlxalq Parodontologiya və Estetik Stomatologiya Konqresi
ndə iştirak etmişdir.
2019-cu ildə BƏƏ-nin Dubay şəhərində keçirilən beynəlxalq stomatologiya sərgisində və elmi mühazirələrdə iştirak etmişdir.
2022-ci ildə
dijital ortodontiya və şəffaf kappalarla müalicə
kursunu tamamlamışdır. Həmin ildən etibarən
"ITI" - International Team for Implantology
təşkilatının üzvüdür. 2023-cü ildə Türkiyənin Antalya şəhərində keçirilən
ITI tədbirinin iştirakçısı
olmuşdur.
2023-cü ildə
Estetik restavrasiya (Quintessence, Bora Korkut)
kursunu tamamlamış, həmçinin
funksional ortopediya və gicgah-çənə oynağı problemləri
üzrə Dr. Teymur Məmmədov tərəfindən keçirilən kursda iştirak etmişdir.
Dr. Əjdər İbrahimov 2016-cı ildən etibarən
SNN Medical stomatoloji klinikasında aparıcı həkim ortodont
kimi fəaliyyət göstərir. O, müasir ortodontik müalicə metodlarından istifadə edərək pasiyentlərə həm funksional, həm də estetik baxımdan ideal nəticələr təqdim edir.
SNN MEDICAL - Sağlamlığınıza Ailə Qayğısı', '/doctor-photos/ejder-ibrahimov.webp', 'az', 'UNCLAIMED', 'snn.az', 0, 1, NOW(), NOW())
;

CREATE TEMPORARY TABLE snn_placement (doctor_slug VARCHAR(255), clinic_slug VARCHAR(255));
INSERT INTO snn_placement (doctor_slug, clinic_slug) VALUES
    ('anar-yaqublu', 'snn-medical'),
    ('ferec-hesenov', 'snn-medical'),
    ('namiq-ehmedov', 'snn-medical'),
    ('nermin-isayeva', 'snn-medical'),
    ('nesreddin-isayev', 'snn-medical'),
    ('perviz-isayev', 'snn-medical'),
    ('ramil-serdarov', 'snn-medical'),
    ('vusal-xelilov', 'snn-medical'),
    ('xeyale-haciyeva', 'snn-medical'),
    ('ulfet-memmedov', 'snn-medical'),
    ('ejder-ibrahimov', 'snn-medical')
;

INSERT INTO doctor_clinic (doctor_id, clinic_id)
SELECT d.id, c.id
FROM snn_placement p
JOIN doctor d ON d.slug = p.doctor_slug AND d.source = 'snn.az'
JOIN clinic c ON c.slug = p.clinic_slug
WHERE NOT EXISTS (
    SELECT 1 FROM doctor_clinic dc
    WHERE dc.doctor_id = d.id AND dc.clinic_id = c.id);

DROP TEMPORARY TABLE snn_placement;
