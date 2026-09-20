-- Give the imported biographies their line breaks back.
--
-- Every seed from V43 onward built a doctor's biography as sections - what
-- they treat, where they have worked, which courses they hold - and separated
-- them with newlines. None of those newlines reached the database. The routine
-- that escaped the text for SQL normalised whitespace with a single
-- \\s+ -> " " substitution, which collapses a newline as readily as a double
-- space, so every career arrived as one paragraph strung together with
-- semicolons.
--
-- The display was never the problem: .prose has carried white-space: pre-line
-- since the directory was built. The breaks were lost before they were stored.
--
-- This rewrites the biography of every listing those seeds created, from the
-- same source text, with each section headed and each entry on its own line.
-- Nothing else about the rows changes, and no listing gains or loses a fact.
-- Rows whose biography somebody has since edited by hand are not protected,
-- because none exist: every one of these is an UNCLAIMED import.


UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2017-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'abbasova-gu-nel-bayram';
UPDATE doctor SET bio = 'Təcili yardım üzrə baş mütəxəssis.
Reanimasiya və təcili yardım həkimi.
MediClub-da 2002-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'abdullayev-vuqar-sahib';
UPDATE doctor SET bio = 'Həkim-proktoloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'abdullayeva-nezaket-kamal';
UPDATE doctor SET bio = 'Tibb üzrə fəlsəfə doktoru.
Həkim-mama-ginekoloq.
MediClub-da 2023-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'abdullayeva-ulviyye-abdulla';
UPDATE doctor SET bio = 'İş təcrübəsi:
Həkim-cərrah, 1 saylı Sumqayıt şəhər poliklinikası (1990-1992)
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1995-2005)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2010)
Professor, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2010-hal- hazıradək)
Tədris hissə müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2010)
Dekan, Azərbaycan Tibb Universitetinin I müalicə-profilaktika fakultəsi (2011-2016)
Tədris və elmi işlər üzrə müavin, Azərbaycan Tibb Universitetinin Onkoloji klinikası (2016-hal- hazıradək)
Tədris hissə müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2016-hal- hazıradək)

Üzvlük:
Azərbaycan Onkoloqlar Cəmiyyəti', updated_at = NOW() WHERE slug = 'abuzer-qaziyev';
UPDATE doctor SET bio = 'Şöbə: Fizioterapiya və Tibbi Reabilitasiya

İş təcrübəsi:
1998-2001 Dövlət tibb məssisələrində fizioterapevt-reabilitoloq kimi fəaliyyət göstərib
2004-2005 Səudiyyə Ərəbistanı Al-Jouf Hospitalı
2011-2013 Dövlət tibb müəssisələrində fizioterapevt-reabilitoloq kimi fəaliyyət göstərib
2012 "Danaşpital" Rəabilitasiya Mərkəzi, Vyana, Avstriya
2015- ci ildən Mərkəzi Gömrük Hospitalı, fizioterapevt-reabilitoloq

Lisenziya və sertifikatlar:
2004-2005 Fizioterapiya üzrə təlim, Səudiyyə Ərəbistanı
2010 Tibbi sığorta üzrə təlim, "Standard İnsurance"
2011 Ə.Əliyev ad.Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Fizioterapiya üzrə təlim kursları
2012 Fizioterapiya və bərpa üzrə təlim kursları, Donaşpital" reabilitasiya klinikasi, Avstriya, Vyana
2015 Fizioterapiya ve reabilitasiya kursları, Avstriya, Zalsburq
2018 Fizioterapiya üzrə konqres, Türkiyə, Antalya
2018 Reabilitasiya üzrə konqres, Türkiyə, Sivas', updated_at = NOW() WHERE slug = 'afet-cendirli';
UPDATE doctor SET bio = 'İnvaziv - radioloq.

İş təcrübəsi:
2011-2012 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2012-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir', updated_at = NOW() WHERE slug = 'agakisi-yehyayev';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.

İş təcrübəsi:
2002-2006 Naxçıvan şəhər Respublika Xəstəxanasında anestezioloq-reanimatoloq vəzifəsində çalışıb.
2004-2005 cəbhə bölgəsində N saylı hərbi hissədə tibb məntəqə rəisi - həkim kimi zabit olaraq həqiqi hərbi xidmətdə olub.
2006-cı ildən bu günə kimi Bakı şəhər Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyasında anestezioloq-reanimatoloq vəzifəsində çalışır.
2021- dən Respublika Diaqnostika Mərkəzində Təcili və təxirəsalınmaz tibbi yardım üzrə həkim, şöbə müdiri.
2013 ildə "Kayseri şeher Devlet Hastanesinde Yoğun bakım unitesində" kurs keçmişdir.', updated_at = NOW() WHERE slug = 'akif-mir-seyid';
UPDATE doctor SET bio = 'Həkim-nevroloq.
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'allahverdiyeva-sevinc-vahid';
UPDATE doctor SET bio = 'Nevroloq-neyrofizioloq.
Elmi dərəcə: Tibb üzrə fəlsəfə doktoru

İş təcrübəsi:
1996-2008 Respublika Diaqnostika Mərkəzində Neyrofiziologiya laboratoriyasında (EEQ, EXO EEQ) kabinetində çalışmışdır
2008-2013 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2011- 2021 Kliniki Tibbi Mərkəzdə (Semaşko xəstəxanası) radiologiya şöbəsində həkim-nevroloq- EEQ-ma kabinetində çalışmşdır.
2013-cü ildən bu günə qədər RDM-də həkim-nevroloq-EEQ , ENMQ, Çağırılmış potensiasllar üzrə mütəxəssis kimi çalışır.', updated_at = NOW() WHERE slug = 'almaz-seferova';
UPDATE doctor SET bio = 'Şöbə: Uşaq Cərrahiyyəsi

İş təcrübəsi:
2025 Mərkəzi Gömrük Hospitalında Cərrahiyyə şöbəsində uşaq cərrahı

Lisenziya və sertifikatlar:
2022 "Uşaqlarda vezikouretral refluks xəstəliyində yanaşı uroloji problemlərin və xroniki qəbizliyin proqnoza təsiri" mövzusunda elmi iş
2022 Mərkəzi Gömrük Hospitalı, Elmi-Təcrübi və Tədris Mərkəzi, "Orqan və toxuma transplantasiyasında beyin ölümü diaqnozunun aktual aspektləri" konfransı
2023 Mərkəzi Gömrük Hospitalı, Elmi-Təcrübi və Tədris Mərkəzi "Ana və uşaq sağlamlığı - mövcud problemlərə müasir baxış konfransı"
2023 European Pediatric Surgeons Association, "Pediatric Endoscopic Surgery Masterclass & Workshop" masterklası
2024 Azərbaycan FETAL Araşdırma Qrupu, "Cərrahi korreksiya olunan bilan gastrointestinal anomaliyalar" konfransı
2025 Azərbaycan Pediatriya Cəmiyyəti, "Uşaqlarda sidik yolları infeksiyalarının cərrahi səbəbləri" seminarı', updated_at = NOW() WHERE slug = 'alsan-pasazade';
UPDATE doctor SET bio = 'Travmatoloq-ortoped.
Elmi dərəcə: Tibb elmləri namizədi

İş təcrübəsi:
1989-1998 Elmi-Tədqiqat Travmatologiya və Ortopediya İnstitutu (Travmatoloq-Ortoped)
2001-2006 Mərkəzi Kliniki Xəstəxana
2006-2015 City Hospital
2015-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'altay-ceferov';
UPDATE doctor SET bio = 'Ürək-damar cərrahı.
Elmi dərəcə: Uzman

İş təcrübəsi:
2002-2003 Ankara Gülhanə Hərbi Tibb Akademiyasının Təcili Tibbi Yardım şöbəsində və Samsun şəhərində Səhra Səhiyyə Məktəbində həkim kimi çalışıb
2003-2005 illərdə aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2010-2011 Ankara Başkent Universiteti Ürək-damar Cərrahiyyəsi Klinikasında 9 ay Ürək köçürülməsi və Pediatrik ürək cərrahiyyəsi bölmələrində fəal olaraq çalışıb
2011-2012 Ankara Gülhanə Hərbi Tibb Akademiyası Ürək-damar Cərrahiyyəsi Klinikasında işləyib
2012-2013 Ankara şəhərində yerləşən Kavaklıdere Umut Xəstəxanasında (Umut Kalp Merkezi) uzman kardiocərrah kimi fəaliyyət göstərib
2013-2018 illərdə aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
Respublika Diaqnostika Mərkəzi Bakı Ürək Mərkəzi Ürək-damar Cərrahiyyəsi şöbəsinin müdiri vəzifəsində çalışır - 2019-cu ildən bu günədək.
Mükafatları:
Azərbaycan Respublikası "Qüsursuz xidmətə görə" 3-cü dərəcəli medal.
İcra etdiyi əməliyyatlar:
Minimal İnvaziv qapaq əməliyyatı
By pass
Full Arterial By pass əməliyyatı
Ürəyin işemik xəstəliyi zamanı koronar arteriyalarda şuntlama əməliyyatı
Anadangəlmə ürək qüsurlarının cərrahi üsulla aradan qaldırılması
Ürəyin işemik xəstəliyi zamanı koronar şuntlama əməliyyatı - ürəyi dayandırmadan, çalışan ürəkdə əməliyyat
Ürək qapaqlarının təmiri və protezləşdirilməsi əməliyyatı
Kiçik kəsikdən minimal invaziv ürək əməliyyatları
Ürək dəstək cihazlarının (süni ürək) implantasiyası
Ritm problemlərinin cərrahi ablasiya üsulu ilə aradan qaldırılması
Periferik arteriya və venalarda cərrahi əməliyyatlar
Lazer və yapışdırma üsulu ilə varis problemlərinin aradan qaldırılması
Ağciyər və periferik damarlarda olan trombların əridilməsi əməliyyatı.', updated_at = NOW() WHERE slug = 'anar-emrah';
UPDATE doctor SET bio = 'Anestezioloq - reanimatoloq.

İş təcrübəsi:
2001-2018 illərdə aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2018-ci ildən bu günədək Respublika Diaqnostika Mərkəzində Reanimasiya şöbəsinin müdiri vəzifəsində çalışır', updated_at = NOW() WHERE slug = 'aneta-sefereliyeva';
UPDATE doctor SET bio = 'Haqqında:
2025-bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı/ Şüa diaqnostikası üzrə həkim
2013-2017 - Rezidentura/ Azərbaycan Tibb Universiteti/Şüa diaqnostikası
2006-2012 - Azərbaycan Tibb Universiteti/ Hərbi-həkim', updated_at = NOW() WHERE slug = 'aqil-ceferov';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.

İş təcrübəsi:
Hal-hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'araz-suleymanov';
UPDATE doctor SET bio = 'Şöbə: Nevrologiya

İş təcrübəsi:
2015-2019 Türkiyə Cumhuriyyəti Dokuz Eylül Universiteti Tibb fakültəsi - Nevrologiya şöbəsi - rezident
2019- Özəl Doğuş Xəstəxanası, Akhisar,Manisa- Uzman Nevroloq
2020-cu ildən Mərkəzi Gömrük Hospitalı, nevrologiya şöbəsi, həkim-nevropatoloq kimi çalışır.
Nailiyyətlər və Üstünlüklər
2016: Böyüme Göstərən Hemorragik Bulbus Kavernomu
2017: Oraq Hücreyrə Anemiyası olan Bir Xəstədə Kortikal Ven Trombozu
2018: Gec Diaqnoz qoyulmuş Perimezensefalik Subaraxinoid Qanama
2018: Kognitif (idrak) Pozuğunluğu Olmayan Parkinson Xəstələrində İstirahət EEG''sinde Delta, Teta ve Alfa Gücünün Dəyərləndirilməsi
2019: Plazmafarezdən Fayda Gören İsaac Sendromu

Lisenziya və sertifikatlar:
2016 - 2-ci Nevrologiya üzre Avropa Akademiyası, Kopenhagen, Danimarka
2016 - 2018 - 2019 - 52-ci, 54-cü, 55-ci Beynəlxalq Nevrologiya Konqresi, Antalya
2017 -2018 - III və IV Kognitif (idrak etmə)- Davranış Nevrologiyası ve Demensiya kursu, İstanbul
2017 - Nevromüskuler Xəstəliklər kongresi, İzmir
2018 - Nörolojik Xəstəliklərdə Yuxu Pozğunluğu kursu
2018 - 15. Nevropatik Ağrı Sempozyumu, Kipr
2018 -14. Baş Ağrısı Qış kursu, İstanbul
2018 - MS diaqnozunda Klinik, MRT, BOM''un yeri, İzmir
2018 -VIII. Ulusal Beyin Damar Xəstəlikləri Kongresi, İzmir
2018 - Hərəkət Pozğunluqlarında Müalicə Konfransı, İzmir
Üzv olduğu təşkilatlar
Türk Nöroloji Dərnəyi
Türk Həkimlər Birliyi', updated_at = NOW() WHERE slug = 'arzu-meherremova';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2025-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'axverdiyeva-fidan-etibar';
UPDATE doctor SET bio = 'Şöbə: Laboratoriya ISO 15189:2012

İş təcrübəsi:
2019-2022 Biomed Spektr Tibb Mərkəzi, həkim-laborant
2025. Mərkəzi Gömrük Hospitalında həkim-laborant kimi fəaliyyətə başlayıb

Lisenziya və sertifikatlar:
2017. IVBeynəlxalq Tibb Konqresi ATU
2024. ATUREK XII elmi təcrübi konfrans ATU', updated_at = NOW() WHERE slug = 'aygun-cennetova';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2002-2017 Dövlət tibbi müəssisəsində pediatr-neonatoloq kimi çalışıb
2017- ci ildən Mərkəzi Gömrük Hospitalında Pediatr-neonatoloq-reanimatoloq kimi çalışır

Lisenziya və sertifikatlar:
2010. XXVIII Milli Neonatologiya konqresi, Türkiyə, İstanbul
2018 Neonatologiya üzrə Azərbaycan-Türkiyə birinci
Beynəlxalq İntensiv təlim kursu
2019. Neonatologiya üzrə Azərbaycan-Türkiyə ikinci
Beynəlxalq İntensiv təlim kursu
2018 Yenidoğulmuşların reanimasiya kursu, Azərbaycan, Bakı
2022 Ege Universitetinin Reanimasiya və Pediatriya şöbəsində neonatologiya üzrə rotasiya kursu. Türkiyə, İzmir şəhəri.
2023 . Azərbaycan Respublikası Səhiyyə Nazirliyi K.Y.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu və Azərbaycan Pediatrlar Assosiasiyasının birgə təşkilatçılığı ilə "Beynəlxalq Vaxtından Əvvəl Doğulan Uşaqlar Günü"nə həsr olunmuş konfrans. Azərbaycan, Bakı şəhəri.
2024. Amerika-Avstriya Fondu tərəfindən təşkil edilmiş "Ana və körpə sağlamlığı" mövzusunda keçirilən beynəlxalq seminar. Avstriya, Zalsburq şəhəri', updated_at = NOW() WHERE slug = 'aygun-sadixova';
UPDATE doctor SET bio = 'Mama - ginekoloq.

İş təcrübəsi:
2010-2022 Mərkəzi Neftçilər Xəstəxanası Mamalıq və Ginekologiya şöbəsinin mama-ginekoloqu, Bakı, Azərbaycan
2019-2021 Caspian International Hospital, Mamalıq və Ginekologiya süni mayalanma şöbəsi, Bakı, Azərbaycan
2021-ci ildən bu günə kimi Respublika Diaqnostika Mərkəzi, Mamalıq və Ginekologiya şöbəsi, Mama-ginekoloq, Bakı, Azərbaycan
İcra etdiyi xidmətlər:
- Hamiləlik planlaşdırılması və təqibi
- Təbii doğuş və keysəriyyə kəsiyi
- Laparoskopik ginekoloji əməliyyaylar
- Estetik ginekoloji əməliyyatlar
- Histerosalpinqografiya
- Sonsuzluğun müalicəsi
- Süni mayalanma
- Ginekoloji ultrasəs müayinəsi
- Kolposkopiya', updated_at = NOW() WHERE slug = 'aynur-babayeva';
UPDATE doctor SET bio = 'Haqqında:
2014 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim oftalmoloq
2014 Sertifikasiya. Oftalmologiya
2012 AMEA A.İ.Qarayev adına Fiziologiya İnstitutu / Elmi işçi
2007 - 2009 ABU tibb mərkəzi/ Həkim oftalmoloq
2004 - 2007 Bakı şəhər göz xəstəxanası / Həkim oftalmoloq
2003 - 2004 İnternatura / Akademik Mir-Qasımov adına Respublika klinik xəstəxanası / Həkim oftalmoloq
1997 - 2003 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'aynur-quliyeva';
UPDATE doctor SET bio = 'Haqqında:
2019 - bugünədək Sağlam Ailə Tibb Mərkəzi/ Həkim - endokrinoloq
2016 - Sankt - Peterburq şəhərində Otto adına Akuşer və Ginekologiya İnstitutu/ Endokrin və ginekologiya üzrə ixtisaslaşma
2015 - Sertifikasiya, Endokrinologiya
2009 - İstanbul Universitetinin tibb fakültəsi/ Endokrinologiya
2006 - bugünədək Medilüks klinikası/ Həkim - endokrinoloq
2005 - 2006 - İnternatura, F. Əfəndiyev adına 4 saylı Klinik xəstəxana/ Endokrinologiya
1999 - 2005 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'aynur-salxayeva';
UPDATE doctor SET bio = 'Şöbə: Qastroenterologiya

İş təcrübəsi:
2009 Türkiyə, Ankara Tibb Universiteti, Kolorektal cərrahiyyə
2010 Türkiyə, Ankara Tibb Universiteti, Alt və üst endoskopiya prosedurları
2012 İtaliya, Modena, Nuovo Ospedale S. Agostino Esfence de Baggiovara, Laparoskopik Kolorektal Cərrahiyyə
2013 Türkiyə, İstanbul Universiteti Tibb fakültəsi, Cərrahi Endoskopiya şöbəsi, Anal kanalın fizioloji tədrisi
2009-cu ildən Mərkəzi Gömrük Hospitalında Ümumi cərrah kimi çalışır
Nailiyyətlər və Üstünlüklər
35-dən yuxarı elmi məqalə və tezislərin müəllifidir
Avropa Koloproktoloji Dərnəyinin Azərbaycan üzrə ilk Milli təmsilçisi
2018-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.
2024 Dr.Aynur Səfiyeva Azərbaycan Respublikası Prezidenti yanında Ali Attestasiya Komissiyası tərəfindən cərrahiyyə ixtisası üzrə tibb elmləri doktoru ali elmi dərəcəsi alıb. Aynur həkim kolorektal cərrahiyyə üzrə ilk qadın elmlər doktorudur.

Lisenziya və sertifikatlar:
2007 Qarın boşluğu orqanlarının USG, Səudiyyə Ərəbistanı, Cizan
2008 Təcili Cərrahiyyə və Travma üzrə ATLS kursu (I bölum) Avstriya, Sazlburg
2009 Təcili Cərrahiyyə və Travma üzrə ATLS kursu (II bölum) Avstriya, Sazlburg
2011 Təcili Cərrahiyyə və Travma üzrə ATLS kursu (III bölum) Avstriya, Sazlburg
2012 Nuovo Ospedale S. Agostino Esdence de Baggiovara, laparoskopik kolorektal cərrahiyyə, Modena, İtaliya
2015 İstanbul Universiteti İstanbul Tibb fakültəsi . Obstetrik Anal Sfinkter Hasarına. Multidisipliner Yaklaşım ve Anorektal Ultrasonoqrafı kursu
2018 ESCP-nin XIII koloproktoloji toplantısı, Fransa, Nitsa
2019 XVIII Beynəlxalq Avrasiya Cərrahlar və Qastroenteroloqlar konqresi, Azərbaycan, Bakı
2019 Avropa Koloproktoloqlar Dərnəyinin XIV elmi-praktiki konfransı. Avstriya, Vyana
2021 Türkiyə Kolon və Rektal Cərrahiyyə Cəmiyyətinin təşkilatçılığı ilə XVIII Türk Kolon və Rektal Cərrahiyyə Konqresi. Türkiyə, Antaliya
2022 Naxçıvan Dövlət Universitetinin, Azərbaycan Tibb Universitetinin, Azərbaycan Endoskopik-Laporoskopik Cərrahlar Cəmiyyətinin təşkilatçılığı ilə keçirilən I Beynəlxalq Tibbi Forum. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri
2022 Türkiyənin Kolon və Rektal Cərrahlar Universitetinin Beynəlxalq Cəmiyyətinin təşkilatçılığı ilə keçirilən 31-ci Konqres. Türkiyə,İstanbul şəhəri.
2023 Türkiyə Kolon və Rektal Cərrahiyyə Dərnəyinin təşkilatçılığı ilə keçirilmiş 2-ci Beynəlxalq Türk Kolorektal Cərrahiyyə Konqresində və XIX Milli Kolon və Rektal Cərrahiyyə Konqresində iştirak edib. Türkiyə, Antalya.
2024 Koreya Universitetinin Anam Hospitalında Kolorektal cərrahiyyə və endoskopiya üzrə təkmilləşmə kursu. Cənubi Koreya, Seul şəhəri
2025. İtaliya və Avropanın aparıcı universitetlərindən biri olan Cattolica del Sacro Cuore Universitetində "Proktologiya və çanaq dibi cərrahiyyəsi"üzrə master dərəcəsi alıb.
2025. Grigol Robakidze Universitetinin təşkilatçılığı ilə keçirilən Ümumdünya Sağlamlıq Konqresi (Global Health Congress: Health Horizons). Gürcüstan, Tbilisi şəhəri
2025. Beynəlxalq Kolorektal Tədqiqat 2025 Sammitində "Anal çatlarda botoks müalicəsi" mövzusunda elmi məruzə ilə çıxış edib. Koreya, Seul şəhəri.
2026. Honkonqda keçirilən "Beynəlxalq kolorektal xəstəliklər" simpoziumunda Kolorektal qeyri-adenomatoz poliplərdə CD133 istifadəsi və risk stratifikasiyası" mövzusunda təqdimatla çıxış edib. Honkonq.
2026. Bolqarıstan Koloproktologiya Cəmiyyətinin təşkilatçılığı ilə Kolorektal və qarnın ön divarı cərrahiyyəsinə həsr olunmuş nüfuzlu beynəlxalq konfransda Anal çatların diaqnostikası və müalicəsində yeniliklər" mövzusunda çıxış edib. Bolqarıstan, Sofiya şəhəri.
2026. Nüfuzlu beynəlxalq "Qahirə Kolorektal və Çanaq üzrə 20-ci İllik Toplantı" elmi tədbirdə "Obstruktiv defekasiya sindromunda defekoqrafiyanın rolu və əhəmiyyəti" mövzusunda məruzə ilə çıxış edib. Misir, Qahirə.
2026. Koreya, Yaponiya, Sinqapur və Çin Kolorektal Cəmiyyətlərinin təşkilatçılığı ilə keçirilən Beynəlxalq Kolorektal Tədqiqat Sammitində (ICRS 2026) "Kolorektal poliplərdə gender fərqliliyi" mövzusunda təqdimatla çıxış edib. Koreya Respublikası, Seul şəhəri.
Üzv olduğu təşkilatlar
2009 Türk Cərrahi Dərnəyi
2009 Türk Kolorektal Cərrahi Dərnəyi
2009 ABŞ-Avstriya Davamlı Təhsil Mərkəzi
2016 Avropa Kolorektal cərrahi Dərnəyinin üzvü, Azərbaycanın Milli Təmsilçisi
Azərbaycan Kolorektal Cərrahi Dərnəyinin İdarə heyətinin üzvü, elmi katib
2021-ci ilin sentyabr ayından Avropa Koloproktoloji Dərnəyinin Şərq ölkələri üzrə regional təmsilçisidir
Elmi yazılar və Məqalələr
Aynur Səfiyevanın elmi yazı və məqalələrinə baxmaq üçün bura daxil olun', updated_at = NOW() WHERE slug = 'aynur-sefiyeva';
UPDATE doctor SET bio = 'Şöbə: Oftalmologiya

Lisenziya və sertifikatlar:
2011 Vitreoretinal cərrahiyyə kursu, Rusiya
2011-2015 Rusiya Tibb Elmləri Akademiyası, Elmi Tədqiqat Göz Xəstəlikləri İnstitutunun dissertantı "Müxtəlif iqlimli zonalarda Quru Göz Sindromu)
2016 Kataraktal Cərrahiyyə Kursu, Rusiya
Üzv olduğu təşkilatlar
2012 "EURETİNA" Avropa retinoloqlar cəmiyyəti', updated_at = NOW() WHERE slug = 'aynure-eliyeva';
UPDATE doctor SET bio = 'Psixoloq.
Şöbə: Somatika və STROK Mərkəzi', updated_at = NOW() WHERE slug = 'aytac-quliyeva';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək - Sağlam Ailə Tibb Mərkəzi/ Şüa diaqnostika üzrə həkim
2011 - bugünədək - İntermed Plyus diaqnostika mərkəzi/ Şüa diaqnostika üzrə həkim
2003 - 2006 - Ağcabədi rayon mərkəzi xəstəxanası/ Şüa diaqnostika üzrə həkim
2001 - 2002 - İnternatura - M.N. Qədirli adına Mərkəzi Hövzə Xəstəxanası/ Funksional - diaqnostik
1996 - 2001 - N. Nərimanov adına Azərbaycan Tibb Universiteti, Tibbi biologiya', updated_at = NOW() WHERE slug = 'ayten-sadiqova';
UPDATE doctor SET bio = 'Şöbə: Efferent Terapiya

İş təcrübəsi:
2000-2020 Qədirli adına Hövzə Xəstəxanasında nefroloq kimi çalışıb.
2022- ci ildən Mərkəzi Gömrük Hospitalı, Efferent Terapiya şöbəsinin həkimi

Lisenziya və sertifikatlar:
2024 Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda 03.11.2023-14.11.2023 "Kəskin orqan çatışmazlığı və homeostoz pozulmalarında intensiz terapiya" mövzusunda kurs.
Üzv olduğu təşkilatlar
2008-ci ildən Rusiya Hemifarez və Ekstrakorporal hemokorreksiya Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'ayten-selimova';
UPDATE doctor SET bio = 'Haqqında:
2020 - bugünədək - Sağlam Ailə Tibb Mərkəzi, Həkim - Uşaq endokrinoloqu
2017 - 2020 - HB Güvən klinikası/ Həkim - pediatr
2014-2017 - Marmara Üniversitesi Tıp Fakültesi, Uşaq endokrinoloqu
2009 - 2014 - Marmara Üniversitesi Tıp Fakültesi, Pediatriya
2006-2007 - İnternatura/ Azərbaycan Tibb Universiteti / Həkim - pediatr
2000 - 2006 - Azərbaycan Tibb Universiteti/ Pediatriya', updated_at = NOW() WHERE slug = 'azad-ekberzade';
UPDATE doctor SET bio = 'Həkim-hematoloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'babayev-mireldar-seyidaga';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'babayeva-elnare-baratxan';
UPDATE doctor SET bio = 'Həkin-endoskopist.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'bagirov-ramin-xaliq';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'bagiyev-ruslan-elman';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2018-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'bayramova-samire-sahzade';
UPDATE doctor SET bio = 'Şöbə: Urologiya

İş təcrübəsi:
2018-2019. Türkiyənin İstanbul şəhərində "Özel Hospitalist Hastanesi"-ndə uzman uroloq cərrah
2019-cu ildən Mərkəzi Gömrük Hospitalında uzman uroloq cərrah kimi çalışır
2021-ci ildən Mərkəzi Gömrük Hospitalın Urologiya şöbəsinin rəisi vəzifəsində çalışır

Lisenziya və sertifikatlar:
2013 Avropa Uroloji Assosiasiyası və Türk Uroloji Assosiasiyasının birgə təşkil etdiyi III İstanbul Urologiya Günləri, Türkiyə
2014 XXIII Beynəlxalq Urologiya konqresi Türkiyə, Antalya
2015 "Prostat xərçəngi və BPH" mövzusunda keçirilən Avrasiya Uroonkoloji Bahar konqresi, Türkiyə, Bursa.
2015 "Qadınlarda çanaq bölgəsi orqanlarının rekonstruktiv əməliyyatları" mövzusunda simpozium, Türkiyə, İstanbul
2016 "Bahçeşehir Universiteti Tibb Fakültəsi Prof. Rhonton Anatomiya Laboratoriyasında "Dondurulmuş meyit modelində yüksək dərəcəli endoskopik və laporaskopik cərrahiyyə" kursu, Türkiyə, İstanbul
2016 VI Uroonkologiya Qış konqresi, Azərbaycan, Bakı.
2017 Türk Urologiya Akademiyasının təşkil etdiyi böyrək şişləri mövzusunda təkmilləşdirmə kursu, Türkiyə, Bursa
2018 V Beynəlxalq Minimal İnvaziv Uroloji Cərrahiyyə konqresi, Türkiyə, Antalya.
2019 Acıbadem Universiteti CASE Robotik, Laparoskopik cərrahiyyə və kliniki anatomiya laboratoriyasında canlı donuz modelində yüksək dərəcəli müasir laparoskopik böyrək cərrahiyyəsi kursu, Türkiyə, İstanbul.
2021 Azərbaycan Respublikası Səhiyyə Nazirliyi Milli Onkologiya Mərkəzinin və Azərbaycan Onkoloqlar Cəmiyyətinin təşkilatçılığı keçirilən IV Beynəlxalq uroonkologiya simpoziumunda "İnvaziv kisəsi xərçənginə yanaşma" mövzusunda çıxış edib, Azərbaycan, Bakı.
2022 Avropa Urologiya Assosiasiyasının təşkilatçılığı ilə keçirilən UROtech22 Beynəlxalq konfrans. Türkiyə, İstanbul
2022 Türkiyə Urologiya Cəmiyyətinin təşkilatçılığı keçirilən 31-ci Milli Urologiya konqresi Şimali Kipr Türk Respublikası.
2022 Azərbaycan Uroloqlar Assosiasiyasının təşkilatçılığı ilə keçirilən "Qadın və kişi genital xəstəliklərinə baxış" Beynəlxalq simpoziumu. Azərbaycan, Bakı şəhəri.
2023. Türk Uroonkoloji Dərnəyinin təşkilatçılığı 16-cı Beynəlxalq Uroonkoloji konqresində iştirak edib. Türkiyə, Antalya şəhəri.
2024. Türk Urologiya Cərrahiyəsi Dərnəyinin təşkilatçılığı ilə keçirilən 7-ci Beynəlxalq Uroloji Cərrahlar Konqresi. Şimali Kipr Türk Respublikası
2025. Avropa Urologiya Cəmiyyətinin 40-cı Konfransı. İspaniya, Madrid şəhəri.
Üzv olduğu təşkilatlar
Türk Urologiya Assosiasiyasının üzvü
Avropa Urologiya Assosiasiyasının üzvü
Türk Uroloji Cərrahiyyə Assosiasiyasının üzvü
Türk Endourologiya Assosiasiyasının üzvü', updated_at = NOW() WHERE slug = 'behruz-xaliqov';
UPDATE doctor SET bio = 'Şöbə: Ümumi Cərrahiyyə

İş təcrübəsi:
1984-2018-ci illər 5 saylı kliniki xəstəxanada cərrah
1984-2000-ci illərdə Elmlər Akademiyasının ET Fiziologiya İnstitutu (akad. Böyükkişi Ağayevin başçılıq etdiyi biliar sistemin fiziologiyası və cərrahiyyəsi akademik qrupu) və Səhiyyə Nazirliyinin ET Qastroenterologiya İnstitutu-öncə kiçik, sonra isə böyük elmi işçi.
2000-2011-ci illər - 5 saylı kliniki xəstəxanada Cərrahiyyə şöbəsinin müdiri
2004-2016-cı illər - Bir neçə özəl tibb müəssisəsində baş həkim vəzifəsində işləyib.
2018-ci ildən Mərkəzi Gömrük Hospitalı, müalicə işləri üzrə baş həkimin müavini vəzifəsində və eyni zamanda ümumi cərrah kimi fəaliyyət göstərir.
2022-ci ildən Gömrük Hospitalının Baş həkim vəzifəsini müvəqqətti icra edir.
2023-cü ildən Mərkəzi Gömrük Hospitalının rəisi - baş həkimidir.
Nailiyyətlər və Üstünlüklər
50-dən yuxarı elmi məqalənin, 1 ixtiranın, 3 səmərələşdirici təklifin və 3 metodik tövsiyənin müəllifidir.
Dr.Bəxtiyar Musayev ölkəmizdə endoskopik əməliyyatları ilk aparanlardan biridir (1982-ci ildən diaqnostik müdaxilələr, 90-cı illərin ortasından isə endoskopik cərrahi müdaxilələr).Keçmiş SSRİ məkanında qaraciyərin punksiyaları və perkutan qaraciyər daxili müdaxilələrin aparılmasında pionerlərdən biridir (1984-cü ildən).
1990-cı ildə tibb elmləri namizədi, 2000-ci ildə isə Moskva şəhərində doktorluq dissertasiyası müdafiə etmişdir.

Lisenziya və sertifikatlar:
1988 Batumi. Zaqafqaziya respublikaları cərrahlarının qurultayı
1990 Leninqrad (indiki Sankt Peterburq). II Ümumittifaq Qastroenteroloqlar Qurultayı
1991 Daşkənd. I Ümumittifaq Biliyar Cərrahiyyə konqresi
1999 Ankara. Hacettepe Universitetinin Tibb fakültəsində təlim
2000 Tel-Aviv Universitetində təcrübə mübadiləsi
2008 Azərbaycan-Almaniya Cərrahiyyə Günləri
2009 18-ci Avropa İnsult konfransı, Stokholm, İsveç
2011 Beynəlxalq Endoskopik Laporaskopik Cərrahiyyə konqresi
2012 Brüssel. XX Avropa Endoskopik Cərrahiyyə Konqresi
2017 Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda ümumi cərrahiyyə kursu
2017 "Diabetik Ayaq Günü" adlı elmi-praktik konfrans
2018 II Azərbaycan-Türkiyə Kolorektal Cərrahiyyə Günləri
2018 4-cü Beynəlxalq Bariatrik-Metabolik Cərrahi Konqresi
2018 Berlin. Alman dilli ölkələrin Cərrahiyyə konqresi
2018 Ümumdünya Tibbi Sərgi (Medica-2018), Almaniya, Düsseldorf
2019 "Arab-Health-2019" Tibb sərgisi. Birləşmiş Ərəb Əmirlikləri
2019 Florence Nightingale Xəstəxanalar Qrupunda xəstəxana işinin təşkili, infeksion nəzarət sahəsində təcrübə mübadiləsi və qarşılıqlı əməkdaşlıq çərçivəsində təkmilləşdirmə kursu. Türkiyə, İstanbul şəhəri
2019 Dezinfeksiya, Antiseptika və sterilizasiya üzrə praktiki kurs. Türkiyə Respublikası, Antalya şəhəri
2020 "Kolorektal Cərrahiyyədə müasir yanaşmalar" mövzusunda beynəlxalq seminar
2022 "Qaraciyər Transplantasiyasında Anesteziya və Reanimasiyaya müasir yanaşma-yeni texnologiyaların tətbiqi" mövzusunda beynəlxalq elmi konfrans', updated_at = NOW() WHERE slug = 'bextiyar-musayev';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
2019-2020 Azərbaycan Respublikası Dövlət Gömrük Komitəsi Tibbi Xidmət İdarəsinin Mərkəzi Hospitalı, Təcili tibbi yardım həkimi
2021 Azərbaycan Respublikası Dövlət Gömrük Komitəsi Tibbi Xidmət İdarəsinin Mərkəzi Hospitalı, Təcili tibbi yardım həkimi

Lisenziya və sertifikatlar:
2023 "National CPRF Foundation" tərəfindən Böyüklərdə, uşaqlarda, yenidoğulmuşlarda boğulma hallarında tibbi yardım. Avtomatlaşdırılmış xarici defibrillyasiya (ilk yardım) kursunu keçmiş və sertifikat almışdır.', updated_at = NOW() WHERE slug = 'beyler-imanov';
UPDATE doctor SET bio = 'Radioloq.
Elmi dərəcə: Tibb elmləri namizədi

İş təcrübəsi:
Hal-hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'cabir-eliyev';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'cahanqos-a-cavad-qurban';
UPDATE doctor SET bio = 'Haqqında:
2016 - bugünədək Müasir Diaqnostika Klinikası / Həkim stomatoloq
2016 Denta Med MMC / Həkim stomatoloq
2014 - 2015 Star Med MMC / Həkim stomatoloq
2010 - 2011 İnternatura / 3 saylı şəhər poliklinikası / Həkim stomatoloq
2005 - 2010 Azərbaycan Tibb Universiteti / Stomatologiya', updated_at = NOW() WHERE slug = 'cebrayil-sultanov';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'cefer-nermine-haqverdi';
UPDATE doctor SET bio = 'Pediatriya şöbəsinin rəhbəri.
Həkim-pediatr.
MediClub-da 2007-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ceferova-lale-rafiq';
UPDATE doctor SET bio = 'Həkim-kardioloq.
MediClub-da 2003-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'cemilov-rufet-rustem';
UPDATE doctor SET bio = 'Haqqında:
2020 - bugünədək Sağlam Ailə Tibb Mərkəzi / Uşaq ve Yeniyetmə Psixiyatrı
2017 - 2022 - Maltepe ve Kurtköy Ersoy Xestexanaları- Uşaq ve Yeniyetme Şöbesi Uzman Hekim /İstanbul
2016 - 2017 - Medicana Çamlıca Xestexanası -Uşaq ve Yeniyetme Şöbesi Uzman Hekim/İstanbul
2013 - 2016 - Fatih Üniversiteti Tibb Fakülteti -Uşaq ve Yeniyetme Kafedrası Yardımcı Dosent /İstanbul
2012 - İstanbul Üniversiteti Tibb Fakülteti Uşaq ve Yeniyetme Psixiyatriyası Kafedrası / Uzmanlıq
2008 - 2013 - Ondokuz Mayıs Üniversiteti Tibb Fakülteti / Çocuk ve ergen ruh sağlığı ve hastalıkları', updated_at = NOW() WHERE slug = 'ceyhun-ceferov';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
2009-2011 Bakı şəhəri Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyası - səyyar həkim-stajor
2011-2016 Bakı şəhəri Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyası. Təcili və təxirəsalınmaz tibbi yardım həkimi
2016-2023 Bakı şəhəri Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyası - həkim-anestezioloq-reanimatoloq
2023 Mərkəzi Gömrük Hospitalının Təcili tibbi yardım şöbəsində həkim kimi fəaliyyət göstərir
Nailiyyətlər və Üstünlüklər
2017 Azərbaycan Respublikası Səhiyyə Nazirliyi, Bakı şəhəri Baş Səhiyyə İdarəsi və Bakı şəhəri Təcili və təxirəsalınmaz tibbi yardım stansiyası tərəfindən Fəxri Fərman.
2018 Əməkdə, təhsildə və ictimai fəaliyyətdə xüsusi nailiyyətlərinə görə 2018-ci ilin Peşəkar gənci fəxri adı.
2021 TƏBİB və Bakı şəhəri Təcili və təxirəsalınmaz tibbi yardım stansiyası tərəfindən Fəxri Fərman.

Lisenziya və sertifikatlar:
2016 Təcili yardım üzrə treninq. Təşkilatçı: Türkiyə Respublikası Səhiyyə Nazirliyi
2019 "Xəstəliklərə nəzarət, profilaktika və menecment" mövzusunda seminar
Təşkilatçı Çin Xalq Respublikası Ticarət Nazirliyi', updated_at = NOW() WHERE slug = 'ceyhun-eliyev';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim kardioloq
2022 - bugünədək Pirallahı Tibb Mərkəzi/ Həkim-kardioloq
2022 - Synergy Medical/ Həkim-kardioloq
2021 - Cəlilabad Rayon Mərkəzi Xəstəxanasının poliklinikası/Həkim-kardioloq
2019 - 2020 - Bakı Dəmir Yolu Xəstəxanası/ Həkim-kardioloq
2019 - Təbriz Med/ Həkim-kardioloq
2018 - 2019 - Baku City Hospital/ Həkim-kardioloq
2014 - 2018 - Azfen birgə müəssisəsi/ Sahə həkimi
2006 - 2007 - İnternatura/ C. Abdullayev adına ET Kardiologiya İnstitutu/ Həkim-kardioloq
2000 - 2006 - Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'ceyhun-islamov';
UPDATE doctor SET bio = 'Travmatoloq-ortoped.

İş təcrübəsi:
2013-2015 Moskva şəhərində 12 N-li Şəhər Xəstəxanasında həkim-travmatoloq kimi fəaliyyət göstərib
Hal hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir', updated_at = NOW() WHERE slug = 'ceyhun-ismayilov';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'cuma-ertugral';
UPDATE doctor SET bio = 'Haqqında:
2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/Həkim-nevropatoloq
2021-2022 - Sağlık Bilimleri Üniversitesi/ Nevrologiya ixtisası üzrə tam kursu bitirmiş
2011-2015 - Rezidentura/ Azərbaycan Tibb Universiteti/ Nevrologiya
2004-2010 - Azərbaycan Tibb Universiteti/Hərbi-həkim', updated_at = NOW() WHERE slug = 'davud-eyvazov';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi (rentqenoloq), Funksional diaqnostika həkimi (USM).
Funksional diaqnostika həkimi (rentqenoloq).
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'deskubes-violetta-vladimirovna';
UPDATE doctor SET bio = 'Həkim-laborant.

İş təcrübəsi:
1988-2008 Respublika Diaqnostika Mərkəzində Laboratoriya şöbəsinin müdiri
2008-2012 illərdə - Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2012-ci ildən Respublika Diaqnostika Mərkəzində Laboratoriya şöbəsinin müdiri kimi fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'dilare-efendiyeva';
UPDATE doctor SET bio = 'Terapevt.

İş təcrübəsi:
2012-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'dina-zotova';
UPDATE doctor SET bio = 'Konfranslar:
2011-ci il Türkiyə İstanbul Yıldız Texnik Universitetinin kimya və gen mühəndisliyi şöbəsi (Western-blot, İFA, İFM, ZPR).
2013-cü il ATU-nin "innovasiya" şöbəsi (Tədrisin təkmilləşməsi).
2015-ci il Türkiyə İstanbul Yıldız Texnik Universitetinin kimya və gen mühəndisliyi şöbəsi (Mikrokultivasiya üsulu).
VI-INTERNATIONAL EUROPEAN CONFERENCE ON INTERDISCIPLINARY SCIENTIFIC RESEARCH held on August 26-27, 2022 / Bucharest, Romania.
Əməkdar elm xadimi, Tibb elmləri doktoru, Professor H.A. Sultanovun 90 illik yubileyinə həsr olunmuş "Koloproktologiyanın aktual problemləri"Beynəlxalq elmi-praktik konfransında iştirak etmiş və 5 DTT balı qazanmışdır.
2-4 May 2024-cü il tarixlərində Baku Fairmont Hotel Flame Towers-də keçirilən "2-ci Beynəlxalq Azərbaycan Laborator Tibb Konqresi & Lab Expo"-nun sədri.
Antimikrob rezistentliyin diaqnostikasında və müalicəsində müasir yanaşmalar adı seminar.
20 Noyabr 2023-cü il Ümumdünya Səhiyyə Təşkilatının Azərbaycandakı Ölkə Ofisinin həyata keçirdiyi Cərrahi bölgə infeksiyalarının profilaktikası adlı 90 dəqiqəlik vebinarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dos-dr-heyat-eliyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ürək-damar və qan sistemi xəstəlikləri; hipertoniya, ürəyin işemik xəstəlikləri, ürək çatışmazlığı
Tənəffüs sistemi xəstəlikləri: bronxial astma, kəskin və xroniki broxit, kəskin respirator xəstəliklər və s.
Həzm sistemi xəstəlikləri: mədə və onikibarmaq bağırsaq xorası
Kəskin və xroniki qastroduodenit
İltihabi mədə-bağısaq sistemi xəstəlikləri.
Hepatit, Pankreatit
Sidik-cinsiyyət sistemi xəstəlikləri
Revmatik xəstəliklər və s.', updated_at = NOW() WHERE slug = 'dr-abid-helimov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yaş və risk qruplarına uyğun check up müayinələrin təşkili
Qida borusu və mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi
QERX (Qastroezofageal reflüks xəstəliyi)
Barrett sindromu - Qida borusu selikli qişasında reflüksə bağlı dəyişikliklər
Kəskin və xroniki qastrit - Helikobakter Pilori infeksiyası ilə əlaqəli və ya digər səbəblərə bağlı mədə iltihabı
Mədə və 12 barmaq bağırsaq xorası
Funksional dispepsiya
Divertikulyar xəstəlik (divertikulit)
Qeyri-spesifik xoralı kolit və Kron xəstəliyi - İltihabi bağırsaq xəstəliklərinin diaqnostikası və müalicəsi
Bağırsaq disbakteriozu - Mikrobiom tarazlığının pozulması, şişkinlik və diskomfort
Psevdomembranoz kolit - Antibiotik istifadəsindən sonra yaranan ciddi bağırsaq infeksiyası
Qıcıqlanmış bağırsaq sindromu (qəbizlik, diareya ilə) - Stress, qidalanma və digər səbəblərlə əlaqəli bağırsaq hərəkətləri pozuntusu
Virus hepatitləri (A, B, C, D) - Yoluxma yollarına və forma görə fərqli yanaşma tələb edən infeksiyalar
Qeyri-alkoqollu steatohepatit (qaraciyər piylənməsi) - Metabolik sindrom və artıq çəki fonunda yaranan qaraciyər pozuntusu
Alkoqollu qaraciyər xəstəliyi - Uzunmüddətli spirtli içki istifadəsinin təsiri ilə yaranan dəyişikliklər
Autoimmun hepatit
Birincili biliar sirroz
Qaraciyər sirrozu - Qaraciyərin funksional toxumasının çapıq toxuması ilə əvəz olunması, qaraciyər çatışmazlığı riski
Lyambliyoz, askaridoz, enterobioz, toksokaroz və s. - Uşaqlarda və böyüklərdə tez-tez rast gəlinən helmint və protozoon infeksiyalar
COVID-19 sonrası və digər virus xəstəliklərindən sonra reabilitasiya - Ağciyər, ürək və sinir sistemində yaranmış qalıq təsirlərin dəyərləndirilməsi və bərpası
Hipertoniya, taxikardiya, aritmiya və digər dövran pozğunluqları
Bronxit, astma, pnevmoniya və digər ağciyər xəstəlikləri
Sidik yollarının infeksiyaları, sistit, pielonefrit və s. müayinə və müalicəsi

Konfranslar:
1987-ci ildə Təcili yardım üzrə ümumi təkminlləşdirmə kursu
1990-cı ildə Ə.Əliyev adına A.D.H.T. İnstitutunda "Kiliniki Kardioqrafiya" kursu
1995-ci ildə Ə. Əliyev adına A.D.H.T. İnstitutunda "İntensiv Terapiya" kursu
1999 Ə.Əliyev adına A.D.H.T. İnstitutunda "Urologiya" kursu', updated_at = NOW() WHERE slug = 'dr-adil-baloglanov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Sonsuz cütlüklərin dəstəklənməsi və sonsuzluğun müalicəsi
Uşaqlıqdaxili inseminasiya (aşılama)
Menstrual disfunksiyanın müalicəsi
Uşaqlıq boynu patologiyalarının ("eroziyanın") profilaktikası (peyvənd), erkən diaqnostikası (pap-smear + HPV skrininq, servikal biopsiya) və müalicəsi (elektro- və lazerkoagulyasiya)
Cinsi yolla ötürülən infeksiyaların diaqnostikası və müalicəsi
Kolposkopiya
Ailə planlaması (spiralin taxılması, oral kontraseptivlərin təyini, dərialtı implantın yerləşdirilməsi, sterilizasiya)
Ginekoloji xəstəliklərin USM diaqnostikası
Uroginikologiya (sidik saxlama problemlərinin müayinəsi və müalicəsi)
HSQ (boruların yoxlanılması)', updated_at = NOW() WHERE slug = 'dr-afet-kerimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
4D ultrasəs müayinəsi
Abdominal (qarın boşluğu)
Ginekoloji
Hamiləlik
Hamiləlik zamanı Dopler müayinəsi
Aşağı ətraf damarlarının Dopler müayinəsi
Bud-çanaq nahiyəsinin
Neyrosonoqrafiya
Qalxanabənzər vəzin
Uroloji
Karotid damarların Dopler müayinəsi
Timus vəzinin
Sümük-oynaq sisteminin müayinəsi

Konfranslar:
2007-2008-ci illər Əziz Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, Ultrasonoqrafiya kursu
2019-cu il Əziz Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, Süni diaqnostika, Modul 5, 6 (Daxili xəstəliklər)
2019-cu il İctimai Səhiyyə İslahatları Mərkəzi, Qadın xəstəlikləri, Fetal exokardioqrafiya, Modul 1, 3
2023 -cü il Prenatal Tibb Vəqfi, Beynəlxalq Fetal Konfrans, Türkiyə, İstanbul
2024 -cü il Əziz Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, Sertifikasiya', updated_at = NOW() WHERE slug = 'dr-agalar-tariverdiyev';
UPDATE doctor SET bio = 'Mama-ginekoloq.
Şöbə: Mamalıq və Ginekologiya

İş təcrübəsi:
2012 - İstanbul Çapa Xəstəxanası: Ginekologiya üzrə təcrübə
2013 - Vyanada - AKHA xəstəxanasında laparoskopik ginekologiya üzrə təcrübə (Avstriya)
2022 - Birləşmiş Ərəb Əmirlikləri: "Visitor lecture"
Azərbaycan Tibb Universiteti və Birləşmiş Ərəb Əmirliklərinin "Ras Al-Khaimah" Tibb Kolleci arasında olan tələbə mübadilə proqramının təşkilatçısı', updated_at = NOW() WHERE slug = 'dr-ahdab-ezim';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

İş təcrübəsi:
09/2019-10/2019 - Mərkəzi Klinika
2019-2023 - 1 saylı Kliniki Tibbi Mərkəz
2020-2023 - Bakı Sağlamlıq Mərkəzi
2021-2023 - Mərkəzi Klinika
04/2021 - Avrasiya Hospital
10/2021 - 6 saylı Uşaq Kliniki Xəstəxanası
2022 - K. Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu - OMD
06/2022 - Elmi-Tədqiqat Mamalıq və Ginekologiya İnstitutu
07/2022 - Şamama Ələsgərova adına 5 nömrəli Kliniki Doğum Evi
12/2022 - Zəfəran Hospital
12/2022-01/2023 - Respublika Perinatal Mərkəz
03/2023 - MəhkəməTibbi Ekspertiza və Patoloji Anatomiya Birliyi
04/2023 - Milli Onkologiya Mərkəzi.', updated_at = NOW() WHERE slug = 'dr-almaz-eliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Şüa diaqnostika

Fəaliyyət sahələri:
Mammoqrafiya və meme USM - Bayandır Xəstəxanası, Türkiyə, Ankara

İş təcrübəsi:
1997-2009 Rentgenoloq-mammoloq Milli Onkologiya Mərkəzi Azərbaycan, Bakı
2009 Həkim-şüa diqnostik, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-amalya-bagirova';
UPDATE doctor SET bio = 'Anestezioloq - Reanimatoloq.', updated_at = NOW() WHERE slug = 'dr-amil-eliyev';
UPDATE doctor SET bio = 'Anestezioloq-Reanimatoloq.', updated_at = NOW() WHERE slug = 'dr-anar-gumayev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və transezofageal exokardioqrafiya - İstanbul Dr. Siyami Ersek Göğüs Kalp ve Damar Cerrahisi Eğitim Ve Araştırma Hastanesi, Türkiyə, İstanbul
Kardiak-KT - Azərbaycan, Bakı
Ürək MRT - Azərbaycan, Bakı

İş təcrübəsi:
2023 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-anaxanim-seferova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yüksək qan təzyiqi və ya Hipertoniya xəstəliyi
Qanda xolesterin və triqliserid artıqlığı, piylənmə
Şəkərli diabet, tip2 (ilkin diaqnostika, müalicənin tənzimlənməsi)
Qalxanvari vəzin xəstəlikləri
Mədə-bağırsaq yollarının, qaraciyər, mədə, mədəaltı vəzi, öd kisəsi, yoğun bağırsaq xəstəlikləri
Böyrək və sidik-cinsiyyət sistemi xəstəlikləri
Qan xəstəlikləri, dəmir, vitamin B12 və fol turşusu çatışmazlığı ilə bağlı anemiyalar, qanaxmalar, laxtalanmanın pozulması

Konfranslar:
2005-2006-cı illər İMC and John Hopkins University, training of trainers Course
2014-cü il Ə.Əliyev adına HTİ, sosial gigiyena və səhiyyə təşkili kafedrası, ixtisas artırma kursları', updated_at = NOW() WHERE slug = 'dr-aqil-axundov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ağız boşluğunun sanasiyası
Uşaqlarda süd və daimi dişlərin müalicəsi və endodontiyası
Terapiya - kariesli dişlərin estetik və rekonstruktiv plomblarla bərpası
Ortopediya - diş qüsurlarının qapaqlar və yarımqapaqlar vasitəsilə bərpası, dişsiz çənələrdə protezləmə
Endodontiya - kanal müalicəsi, sinirlərin amputasiyası və ekstripasiyası

Konfranslar:
2014-cü ildə Oretical course seminar on Orthodontology, Endodontology, İmplantology
2015-ci ildə Azərbaycan Respublikası Həkimlərin Təkmilləşmə İnstitutu, İxtisas artırma kursları
2017-ci ildə Sergey Gette protezləmə üzrə nəzəri praktik təlim
2019-cu ildə Has attended the seminar on Endodontic therapy Endo-master Hands-on
2021-ci ildə Azərbaycan Respublikası Həkimlərin Təkmilləşmə İnstitutu, İxtisas artırma kursları
2022-ci ildə frontal dişlərin preparasiyası üzrə nəzəri-praktiki kurs
2023-cü ildə Dentalux Akademiyası tərəfindən təşkil olunan "Çocuk hastalarda endodonti" kursları', updated_at = NOW() WHERE slug = 'dr-arife-eliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

İş təcrübəsi:
2024 - Həkim-anestezioloq-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-arzu-bayramova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Oftalmologiya

Fəaliyyət sahələri:
Göz xəstəliklərinin müayinəsi
Göz xəstəliklərinin müalicəsi
Göz xəstəliklərinin cərrahiyyəsi
ROP xəstəliklərinin müayinəsi
Blefaroplastika əməliyyatları

İş təcrübəsi:
2000- Həkim-oftalmoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-arzu-eyvazova';
UPDATE doctor SET bio = 'Anesteziologiya və əməliyyatxana şöbəsinin müdiri.

Şöbə: Anestesteziologiya və əməliyyatxana

Fəaliyyət sahələri:
Ümumi Anesteziya və Yeni Protokollar", Rusiya, Moskva
"Ağrı Nəzarətində Müasir Yanaşmalar", Türkiyə, İstanbul
"Reanimasiya və İntensiv Terapiyada Yeniliklər", Almaniya, Berlin

İş təcrübəsi:
2001 - Həkim-anestezioloq-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı
2007 - 2014 Cərrahi Əməliyyatxana Bölməsinin rəisi, Mərkəzi Klinika, Azərbaycan, Bakı
2014- Aneteziologiya və Əməliyyatxana şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-asef-memmedov';
UPDATE doctor SET bio = 'İnfeksionist-Hepatoloq.

Fəaliyyət sahələri:
Virus Hepatitləri
Hepatit A, B, C, D və E viruslarının diaqnostikası və müalicəsi
Xroniki və kəskin hepatitlərin izlənməsi
Qaraciyər sirrozu və hepatosellulyar karsinomaya çevrilmə riskinin monitorinqi
Herpes virus infeksiyaları
Herpes simpleks virus (HSV) infeksiyaları (ağız, genital və digər lokalizasiyalar)
Varisella-zoster virus (su çiçəyi və zona)
Sitomeqalovirus (CMV) infeksiyası
Epstein-Barr virus (EBV) ilə bağlı xəstəliklər
Tənəffüs yollarının infeksion xəstəlikləri
Viral və bakterial pnevmoniyalar
Bronxit, sinüzit, farenjit, tonzillit
Qrip və digər respirator virus infeksiyaları
COVID-19 sonrası müalicə və reabilitasiya
Naməlum etiologiyalı hərarətlər
İzi bilinməyən və uzunmüddətli hərarətin diaqnostikası
Sistematik yanaşma və laborator testlərin tətbiqi
Sidik - Cinsiyyət Sisteminin İnfeksion Xəstəlikləri
Sistit, pielonefrit, uretrit
Cinsi yolla keçən infeksiyalar (Xlamidioz, Gonoreya, Trikomonaz və s.)
Pelvik inflamator xəstəliklər
Mədə-Bağırsaq Sisteminin İnfeksion və Parazitar Xəstəlikləri
Enterit, qastroenterit
Parazitar infeksiyalar (lyambliyoz, askaridoz, enterobioz və s.)
Psevdomembranoz kolit
Zoonoz İnfeksiyalar
Bruselyoz
Toxoplazmoz
Digər heyvan mənşəli xəstəliklərin diaqnostikası və müalicəsi
Dəri və Yumşaq Toxumanın İnfeksiyaları
Bakterial, viral və göbələk mənşəli dəri xəstəlikləri
Abses, selülit, impetigo
Parazitar dəri xəstəlikləri
İmmunosupressiv xəstəliklər və Co-infeksiyalar
QİÇS xəstələrinin müalicə və monitorinqi
Opportunistik infeksiyalar və ko-infeksiyaların idarə olunması
İmmunosupressiv vəziyyətlərdə profilaktik tədbirlər

Konfranslar:
2023-cü il İnfeksion və Qeyri-İnfeksion hepatitlərin müalicə və diaqnostikasına müasir yanaşma elmi konfrans.
2023-cü il Ümumdünya Səhiyyə Təşkilatının keçirdiyi "Viral Hepatitlər" təlimi.
2023-cü il Dünya Ağciyər sağlamlığı gününə həsr olunmuş elmi praktik konfrans.', updated_at = NOW() WHERE slug = 'dr-asif-sirinov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Rentgenoloji müayinələr
Kompüter tomografiyası
Maqnit Rezonans Tomografiyası

Konfranslar:
2011-ci ildə Elmi-Tədqiqat Ağciyər Xəstəlikləri İnsitutu Radiologiya şöbəsi
2011-ci ildə Mərkəzi Hərbi Klinik Hospital Radiologiya şöbəsi
2016-ci ildə Milli Onkologiya Mərkəzi Radiologiya şöbəsi ( KT və MRT )
2016-ci ildə Ə.Əliyev adına Həkimlərin Təkmilləşdirmə İnsitutu radiologiya Kursu
2019-cu ildə Radiologiya üzrə Sertifikasiya
2019-cu ildə Türkiyə-Samsun şəhəri 19 Mayıs Universitesi Tıp Fakultesi Radyoloji Bölümü', updated_at = NOW() WHERE slug = 'dr-aslan-ceferov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal müayinəsi (qaraciyər, öd kisə, dalaq, mədəalti vəzi)
Uroloji müyainə (böyrəklər, sidik kisə)
Kiçik çanaq orqanalarının müyainəsi (uşaqlıq, yumurtalıqlar, prostat vəzi)
Androloji müayinə (skrotal)
Qalxanabənzər vəzinin müayinəsi
Süd vəzilərin müayinəsi
Neyrosonoqrafiya
Bud-çanaq müayinəsi (uşaqlarda)
Səthi toxumların müayinəsi
Hamiləliyin geniş müayinəsi
Fetal ultrasonoqrafiya (dölün 3D, 4D texnologiyası ilə müayinəsi)
Fetal doppleroqrafiya
Exokardioqrafiya', updated_at = NOW() WHERE slug = 'dr-asude-rehmetova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli və şəkərsiz diabet
Piylənmə və metabolik pozğunluqlar
Fiziki inkişafdan geri qalmalar
Qalxanvari vəzi xəstəlikləri (zolaq troid və.s)
Kimaterik sindrom
Osteoporoz
Cinsi inkişafin ləngiməsi
Vaxtından əvvəl cinsi yətişmə
Polikistoz yumurtalıq sindromu

Konfranslar:
2002-2008-ci illər Moskva şəhərində keçirilən Endokrinoloji konqress və konfranslar
2009-cu il Moskva şəhəri TİP 2 şekerli diabet zamanı intensiv insulin müalicəsi
2010-cu il 46 ci Ulusal diabet konqresi, Türkiyə,Antalya
2011- çi il Bakı- Avropa diabet konqresi (EASD)
2012-ci il EASD Avropa diabet konqresi-Almaniya Berlin
2013-cü il İED- Dünya diabet konqresi -BƏƏ.Dubay
2015-ci il Almaniya-Münxen diabet, hipertoniya metabolix sindrom-konqress
2016-2022-ci illər Bakı şəhərində müxtəlif kurslar, konfranslar,konqreslər, seminarlarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-aybeniz-hemidova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Qulaq-burun-boğaz - Şişli Etfal Eğitim və Araştırma Xəstəxanası, Türkiyə, İstanbul
Rinologiya, Allergik rinit - Türkiyə, İstanbul

İş təcrübəsi:
1993-1995 Həkim, Qaradağ rayonu Birləşmiş şəhər xəstəxanası Azərbaycan, Qaradağ
1995-2004 Həkim-otorinolarinqoloq, Səhiyyə Nazirliyi 2-ci poliklinika, Azərbaycan, Bakı
2004- Həkim-otorinolarinqoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-aybeniz-ibrahimova';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin təqibi
Doğuş və qeysəriyyə əməliyyatı
Sonsuzluğun müalicəsi
Hamiləlikdən qorunma üsullarının tətbiqi
Kolposkopiya
Genital infeksiyaların müayinə və müalicəsi
Aybaşı pozğunluqlarının diaqnostikası və müalicəsi
Hormonal pozğunluqların idarə olunması
Pediatrik ginekologiya
Ginekoloji check up
Qadın cinsiyyət orqanlarının iltihabi xəstəlikləri
Ginekoloji və estetik ginekoloji əməliyyatlar

Konfranslar:
2015-2016-cı illər - Andernach şəhəri, Almaniya, St. Nikolaus Stiftshospital- Mama Ginekologiya üzrə praktiki kurs', updated_at = NOW() WHERE slug = 'dr-aydan-hesenova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Yeni doğulmuş körpələrin reanimasiyası - Türkiyə, Ankara
Pediatriya - Dr. Sami Ulus Kadın Doğum, Çoçuk Sağlığı ve Hastalıkları Eğitim ve Araştırma Hastanesi, Türkiyə, Ankara

İş təcrübəsi:
2018- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-aydan-sahbazzade';
UPDATE doctor SET bio = 'Terapevt.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Endokrin xəstəliklər (qalxanabənzər vəzi, diabet)
Yüksək təzyiq (arterial hipertenziya)
Lipid mübadilə pozğunluğu
Qan azlığı (anemiya)
Vitamin və mineral əskiklikləri
Mədə-bağırsaq sistemi xəstəlikləri
Tənəffüs sistemi xəstəlikləri', updated_at = NOW() WHERE slug = 'dr-aygul-dasdemir';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım (uşaq) üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

İş təcrübəsi:
2016 2017 - Gəncə şəhər 3 nömrəli Uşaq Poliklinikası: Sahə pediatrı
2022 - Dövlət Həkimləri təkmilləşdirmə İnstitutu: İxtisas üzrə kurs
2023 - Yeni Klinika: Təcili tibbi yardım (uşaq) üzrə həkim.

Kurslar:
Basic life support
Advanced life support
Pediatric advanced life support
Neonatal Reanimasiya Proqramı - NRP.', updated_at = NOW() WHERE slug = 'dr-aygul-qurbanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

Fəaliyyət sahələri:
Ümumi Anesteziya, Şişli Etfal Araştırma Ve Eğitim Hastanesi, Türkiyə, Istanbul
Regional Anesteziya, Medical Park Hastanesi, Türkiyə, Istanbul
Transplantasiya, Qazi Üniversitesi Hastanesi, Türkiyə, Istanbul
Qaraciyər və Böyrək Transplantasiyasi, Ege Üniversitesi Hastanesi, Türkiyə, İzmir

İş təcrübəsi:
2004-2006 Həkim - anestezioloq-reanimatoloq, ABU Tibb mərkəzi, Azərbaycan, Bakı
2006 Həkim - anestezioloq-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-aygun-ferzeliyeva';
UPDATE doctor SET bio = 'Pediatr, Baş həkim müavini.

Fəaliyyət sahələri:
Yuxarı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Rinofarenxit, angina, otit, sinusit və s.)
Aşağı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Bronxit, bronxiolit, sətəlcəm və s.)
Mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi (Qəbizlik, ishal, dispepsiya, qastroenterit, qida intoleransları)
Qurd və parazitar xəstəliklərin müayinə və müalicəsi (Lyambliyoz, askaridoz, enterobioz və s.)
Uşaq infeksion xəstəliklərinin müayinə və müalicəsi (Qızılca, məxmərək, su çiçəyi, razeola infantum, parotit və s.)
Uşaqlarda İmmunitet pozğunluqlarının diaqnostikası və müalicəsi
Yenidoğulmuşların və körpələrin rutin tibbi müşahidəsi (İnkişafın izlənməsi, qidalanma, reflekslər, boy-çəki dinamikası)
Uşaqlarda peyvəndlərin tətbiqi və nəzarəti (Milli peyvənd təqviminə uyğun vaksinasiya və izləmə)
Uşaqlarda Defisit vəziyyətlərin və mikroelement çatışmazlıqlarının dəyərləndirilməsi
Alergik xəstəliklər və atopik halların diaqnostikası və müalicəsi (Atopik dermatit, qida allergiyası, allergik rinit)
Uşaq endokrinoloji problemlərinin ilkin aşkarlanması (Boy geriliyi, piylənmə, erkən və gecikmiş yetkinlik)

Konfranslar:
2014 курс »педиатрия». Российская медицинская Академия Последипломного Образования. (Р. М. А. П. О. )
2015 « uşaqlıq dövrü əlilliyin erkən diaqnostikasi və profilaktikasi" praktiki təlim kursu
2016 "uşaqlarda tez-tez rast gəlinən irsi-genetik xəstəliklər" kursu. Ə. Əliyev ad. A. D. H. T. İ.
2019- "16 th international conference of nutrition and growth " Spain, Valencia', updated_at = NOW() WHERE slug = 'dr-aygun-kerimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Sonsuzluğun tam müayinəsi və müalicəsi
Yumurtlama funksiyasının yoxlanılması (folikulyasiya izlənməsi, hormonal analizlər)
Hamiləliyin izlənməsi (Normal hamiləlik və Riskli hamiləlik )
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi
Kolposkopiya
Endokrinoloji ginekologiya
Diatermokoaqulyasiya (DTK) - Uterin boynunda eroziyalar və digər dəyişikliklərin elektrik cərəyanı ilə yandırılaraq müalicəsi
Doğuş və ginekoloji cərrahi əməliyyatlar
Təbii doğuş və doğuşa hazırlıq
Keysəriyyə əməliyyatı (indikasiya olduqda)
Müxtəlif Ginekoloji əməliyyatlar (Yumurtalıq və uşaqlıq törəmələrinin çıxarılması, Miomektomiya, Laparoskopik və açıq əməliyyatlar, Uşaqlığın alınması (histerektomiya), Endometriozun cərrahi müalicəsi)

Konfranslar:
2010-cu il "26th Annual meeting of ESHRE" konfrans, İtaliya, Roma
2010-cu il "The 13th World Congress on Controversies in Obstetrics, Gynecology & Infertility (COGI)" kongresi Almaniya, Berlin
2010-cu il "14th Congress of Gynecological Endocrinology II ISGE" Kongresi, İtaliya, Roma
2012-ci il "The 17th World Congress on Controversies in Obstetrics, Gynecology & Infertility (COGI)" Kongresi, Portuqaliya, Lissabon
2014-cü il 30th Annual meeting of ESHRE konfransı, Almaniya, Münix', updated_at = NOW() WHERE slug = 'dr-aygun-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

Fəaliyyət sahələri:
Orqan transplantasiyası (orqan nəqli) anesteziyası - Akdeniz Universiteti Tip Fakultəsi Aneztezilogiya və Reanimasiya Anabilim Dalı, Türkiyə, Antalya
Döş qəfəsi, ürək-damar və torakal anesteziyası

İş təcrübəsi:
2002 - Həkim-anestezioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-aygun-tarverdiyeva';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'dr-aynur-abdullayeva';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Radiologiya

İş təcrübəsi:
2001 - Türkiyə Yüksək İxtisas Xəstəxanası
2001-2010 - Mərkəzi Klinik Xəstəxana: Radioloq
2009 - İstanbul Capa Xəstəxanası
2013-2016 - Mərkəzi Hərbi Hospital: Radioloq
2018-2023 - Mərkəzi Klinik Xəstəxana: Radioloq
2018 - Marmara Universiteti
2023 - Yeni Klinika: Radioloq.', updated_at = NOW() WHERE slug = 'dr-aynur-haciyeva';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Radiologiya', updated_at = NOW() WHERE slug = 'dr-aynur-huseynova';
UPDATE doctor SET bio = 'Uzman pediatr.
Şöbə: Reproduktiv Sağlamlıq və Ailə Planlaması Mərkəzi', updated_at = NOW() WHERE slug = 'dr-aynur-ismayilova';
UPDATE doctor SET bio = 'İnvaziv Kardioloq.

Fəaliyyət sahələri:
Elektrokardioqrafiya (EKQ)
Exokardioqrafiya (EXO)
Holter EKQ - 24/48 saatlıq ritm monitorinqi
Təzyiq Holteri (ABPM)
Stress test / Tredmil testi
Koronar angioqrafiya
Koronar angioplastika (PTCA)
Koronar arteriyalara stent implantasiyası
Kəskin miokard infarktında təcili koronar müdaxilə (Primary PCI)
Ürək-damar xəstəliklərinin diaqnostikası və risk qiymətləndirilməsi
Hipertoniya və ürək ritm pozğunluqlarının diaqnostikası və müalicəsi
Ürək çatışmazlığı və yüksək riskli ürək-damar xəstələrinin invaziv qiymətləndirilməsi
Prosedur öncəsi və sonrası kardioloji müşahidə və müalicə planının hazırlanması
Kardioloji konsultasiya və müalicə planının hazırlanması', updated_at = NOW() WHERE slug = 'dr-aynur-memmedova';
UPDATE doctor SET bio = 'Qastroenteroloq-Endoskopist.

Fəaliyyət sahələri:
Həzm sistemi xəstəliklərinin müayinəsi və müalicəsi
Qida borusunun xəstəlikləri
Qastroezofageal reflüks xəstəliyi (QERX)
Barrett sindromu
Ezofagit (iltihab), striktura və divertikullar
Mədə xəstəlikləri
Kəskin və xroniki qastrit
Helikobakter pilori infeksiyası
Mədə xorası
Mədə polipləri və törəmələri

Konfranslar:
January 20,2022 Has Successfully Completed [The 7th Therapeutic GL endoscopy & ESD training in Daegu_Webinar 2021] Contucted on 4th December 2021 Your hard work,dedication,and achievement will be cherished Awarded this
III Baku Endoscopy Form Has attended the III Baku Endoscopy Form health in National Center of Oncology , Baku, Azerbaijan ,November 9, 2019 This course is accredited which 16 CME credits by Azerbaijan Ministry of Health
2024-cü il - "XƏZƏR GÖRÜŞLƏRİ 4" adlı konfransı', updated_at = NOW() WHERE slug = 'dr-aynur-qurbanova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Revmatoloq.

Fəaliyyət sahələri:
Revmatoid artrit
Şeqren sindromu
Lyupus xəstəliyi
Sklerodermiya
Ankilozlaşdırıcı spondilit
Psoriatik artrit
Behçet xəstəliyi
FMF
Podaqra
Vaskulitlər
Osteoartrit
Fibromialgiya', updated_at = NOW() WHERE slug = 'dr-aynure-ismayilova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Ginekoloq.

Fəaliyyət sahələri:
Qadınlarda sonsuzluğun müalicəsi
Kolposkopiya və Histeroskopiya
Ailə planlanlaması ( spiralın taxılması, oral kontraseptivlərin təyini, dərialtı implantın yerləşdirilməsi)
Normal və riskli hamiləliyin aparılması və USM təqibi
Uroginekologiya (sidikqaçırmanın müayinə və müalicəsi)
Cinsi yolla ötürülən infeksiyaların diaqnostikası və müalicəsi
Menstrual disfunksiyanın müalicəsi
Menopauza', updated_at = NOW() WHERE slug = 'dr-aynure-mehdiyeva';
UPDATE doctor SET bio = 'Revmatoloq.
Şöbə: Terapiya', updated_at = NOW() WHERE slug = 'dr-aysel-agalarova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet (Tip 1, Tip 2, gestasion diabet)
Tiroid xəstəlikləri (zob, hipotireoz, hipertireoz, autoimmun tiroidit)
Artıq çəki və metabolik sindrom
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Osteoporoz (sümük əriməsi), boy qısalığı
Xolesterin və lipid mübadiləsi pozğunluğu
Endokrin mənşəli sonsuzluq
Qadınlarda tüklənmə (hirsutizm)
Menstrual tsikl pozğunluqları

Konfranslar:
2017 - Ankara Yıldırım Beyazıt Universiteti Yenimahalle Eğitim ve Araştırma Hastanesi
2018 - Milli Onkologiya Mərkəzi - Qalxanabənzər vəzin incə iynə aspirasion biopsiyası (TİİAB) kursu
2020 - 56. Ulusal Diyabet Kongresi, Metabolizma və Beslenme Hastalıkları Kongresi - Türkiyə
2023 - 59th Annual Meeting of the European Association for the Study of Diabetes - Hamburq, Almaniya
2023 - 6th International, 2nd Caspian States, 4th Turkic-Speaking Nations Bariatric Surgery and Metabolic Diseases Congress
2023 - 52nd International Bariatric Club Symposium
2023 - Mədəaltı vəzi xəstəlikləri üzrə elmi-praktik konfrans
2023 - 1st International Medicine Forum - Naxçıvan, Azərbaycan
2024 - 60th Annual Meeting of the European Association for the Study of Diabetes - Madrid, İspaniya
2024 - "Bədxassəli şişlərin diaqnostikası və müalicəsinə müasir yanaşma" elmi-praktik konfrans
2024 - "İqlim dəyişikliklərinin sağlamlığa təsiri" Beynəlxalq Elmi Konfrans
2025 - 61st Annual Meeting of the European Association for the Study of Diabetes - Vyana, Avstriya
2025 - "Cərrahi və mama-ginekoloji problemlərə multidissiplinar yanaşmalar" beynəlxalq konfrans
2025 - II "Müasir Pediatriyanın İşığında" konfransı
2025 - "Şəkərli diabet və tiroid xəstəliklərinin idarə olunmasında yeniliklər" seminarı
2026 - II Azərbaycan Diabet və Metabolizma Xəstəlikləri Konqresi
2026 - IV Azərtürkdiab Simpoziumu
2026 - 28th European Congress of Endocrinology (ECE 2026) - Praqa, Çexiya Respublikası', updated_at = NOW() WHERE slug = 'dr-aysel-dunyamaliyeva';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'dr-aysel-ehmedova';
UPDATE doctor SET bio = 'Pediatr, ana südü məsləhətçisi.

Fəaliyyət sahələri:
Yenidoğulmuş dövründən 18 yaşadək uşaqların müayinəsi
Planlı tibbi müayinələrin aparılması, fiziki və psixomotor inkişafın qiymətləndirilməsi
Ana südü ilə qidalanma, süni qidalanma, əlavə qidalara keçid və uşaqların yaşa uyğun qidalanması üzrə məsləhətlərin verilməsi
Yenidoğulmuşlara qulluq, gün rejimi, orqanizmin möhkəmləndirilməsi və raxit kimi defisit hallarının profilaktikası
Kəskin respirator xəstəliklər, mədə-bağırsaq infeksiyaları, kəskin otit, angina və digər kəskin ambulator xəstəliklərin diaqnostikası və müalicəsi
Xroniki xəstəlikləri olan uşaqların, o cümlədən bronxial astma, atopik dermatit, MƏT və böyrək patologiyalarının izlənməsi və müalicəsinin aparılması
Yüksək qızdırma, qıcolmalar, allergik reaksiyalar və dehidratasiya zamanı ilkin tibbi yardımın göstərilməsi və müalicənin təyin edilməsi
Müxtəlif mənşəli anemiya (qan azlığı) hallarının aşkarlanması və müalicəsi
Vitamin və mineral çatışmazlıqlarının müəyyən edilməsi və müalicəsi
Müxtəlif infeksion xəstəliklərin, o cümlədən qızılca, suçiçəyi, məxmərək, epidemik parotit, altıncı xəstəlik, skarlatina, Epşteyn-Barr virusu və Koksaki infeksiyalarının, həmçinin sidik yolu infeksiyalarının diaqnostikası və müalicəsi
Parazitar invaziyaların, o cümlədən lyamblioz, amebiaz, enterobioz və askaridozun diaqnostikası və müalicəsi
Rutin illik analizlərin və instrumental müayinələrin təyin edilməsi, nəticələrin qiymətləndirilməsi və aşkarlanan problemlərə uyğun müalicənin aparılması
Uşaqların dar ixtisas həkimlərinə vaxtında yönləndirilməsi və mütəxəssis tövsiyələrinin koordinasiyası', updated_at = NOW() WHERE slug = 'dr-aysel-haciagayeva';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'dr-aysel-hemzeli';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

İş təcrübəsi:
2020-2021 - Gəncə Beynəlxalq Xəstəxanası, Kardiologiya şöbəsi: Həkim asistenti
2022 - Tədris Cərrahiyyə Xəstəxanası, Reanimasiya şöbəsi: Tibb bacısı
2023 - Kliniki Tibbi Mərkəz, Cərrahi Reanimasiya: Tibb bacısı.

Kurslar:
EKQ,CPR.', updated_at = NOW() WHERE slug = 'dr-aysel-hesenova';
UPDATE doctor SET bio = 'Həkim-laborant.

Konfranslar:
6-8 may 2011-ci il - Samsun, Ondokuz Mayıs Universitesi "Türk Dünyası Tıp Öğrenci Kongresi"
28-29 iyul 2021-ci il - "1-ci Bakı Beynəlxalq Hepatologiya və Qaraciyər Transplantasiya günləri" adlı Elmi konfrans
25 fevral, 2022-ci il - "Covid-19 və xəstəxanadaxili infeksiyalar" adlı Elmi konfrans
20 oktyabr, 2022-ci il - "Uşaqlıq boynu xərçənginin etiologiyası və müayinə üsulları" adlı konfrans
5 noyabr, 2022-ci il - "Azərbaycan Allerqoloq, İmmunoloq və İmmunoreabilitoloqların VII Beynəlxalq Konqresi " - Məruzəçi
5-9 dekabr, 2022-ci il - Moldova, Kişinyov "İmmunizasiya" kursu
2023-cü il - Ulu öndər Heydər Əliyevin 100 illik yubileyinə həsr olunmuş "Ginekologiyada müasir genetik testlərin əhəmiyyəti" adlı konfrans
16 iyun, 2023-cü il - "Müasir kardiologiya: nailiyyətlər və innovativ yeniliklər" adlı Beynəlxalq Elmi Konqres
24 fevral, 2024-cü il - Ak. M. Ə. Qasımov adına Respublika Klinik Xəstəxanası "İnfeksion Xəstəliklər, antibiotiklərə rezistentlik və sepsis" adlı simpozium - Məruzəçi
3 May, 2024-cü il - "Klinik İmmunologiya və Allerqologiya" adlı elmi konfrans - Məruzəçi
10 may, 2025 - "Azərbaycan-Türkiyə Allerqoloqlar və İmmunoloqlarının II Beynəlxalq konfransı" - Məruzəçi', updated_at = NOW() WHERE slug = 'dr-aysem-rzayeva';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.
Şöbə: Reanimasiya', updated_at = NOW() WHERE slug = 'dr-aysen-xanlarli';
UPDATE doctor SET bio = 'Həkim-laborant.', updated_at = NOW() WHERE slug = 'dr-aytekin-zeynalova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Şüa diaqnostika

Fəaliyyət sahələri:
Maqnit Rezonans Tomaqrafiya (MRT), Kompyuter Tomoqrafiya (KT), Rentgen - Ankara Nümunə Eğitim və Araşdırma Xəstəxanası, Türkiyə, Ankara
Ümumi radiologiya - Graz Universiteti, Avstriya Respublikası

İş təcrübəsi:
2001 - Həkim-şüa diaqnostik (radioloq), Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ayten-axundova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Qastroenteroloq-Hepatoloq.', updated_at = NOW() WHERE slug = 'dr-ayten-eliyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qadın və kişi sonsuzluğunun diaqnostikası və müalicəsi
Süni mayalanma (IVF/ICSI) və aşılama (İUI) protokollarının tətbiqi
Yumurtalıq rezervinin azlığı və təkrarlanan implantasiya uğursuzluqları
Normal və yüksək riskli hamiləliklərin monitorinqi və idarə edilməsi
Təbii doğuş və qeysəriyyə əməliyyatlarının icrası
Aybaşı pozulmaları, PKOS və ginekoloji endokrinopatiyalar
Endometrioz, uşaqlıq miomaları və kistaların müalicəsi
Minimal invaziv cərrahiyyə (Laparoskopiya və Histeroskopiya)', updated_at = NOW() WHERE slug = 'dr-ayten-etibarli';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'dr-ayten-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Otorinolarinqologiya - Akdeniz Universiteti Tibb Fakultəsi, Türkiyə, Antalya

İş təcrübəsi:
2010 - Həkim-otorinolarinqoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ayten-mirzezade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və transezofageal exokardioqrafiya - Dr. Siyami Ersek Göğüs Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul
Ürək MRT - Royal Brompton Hospital, Böyük Britaniya, London
EACVİ HİT CMR - Türkiyə, Antalya
İstanbul CMR - Türkiyə, İstanbul
Ürək MRT - Azərbaycan,Bakı

İş təcrübəsi:
2023 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ayten-nesibova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Təcili tibbi yardım və səyyar tibbi xidmət

Fəaliyyət sahələri:
Təcili tibbi yardım
Reanimasiya
Kritik vəziyyətdə olan xəstələrin müalicəsi
İntensiv terapiya
Həyatı təhlükə altında olan xəstələrin diaqnostikası və müalicəsi
The Royal Institute of Public Health, Foundation Certificate in Food Hygiene and Safety, Böyük Britaniya
Advanced Life Support Skills Course, Capita Health Solutions, University of Aberdeen, Böyük Britaniya
Offshore Medic Course, Capita Health Solutions, University of Aberdeen, Böyük Britaniya
Offshore First Aid, Capita Health Solutions, University of Aberdeen, Böyük Britaniya
Advanced Life Support Skills Course, Capita Health Solutions, University of Aberdeen, Böyük Britaniya
Medical Emergency Response Team, Böyük Britaniya

İş təcrübəsi:
1989-2010 Həkim-reanimatoloq, M.Ə.Mirqasımov adına Respublika Klinik Xəstəxanası, Azərbaycan, Bakı
2001-2007 Aparıcı həkim, Medi Club MMC, Azərbaycan, Bakı
2007-2009 Baş həkim, Medi Club Gəncə, Azərbaycan, Gəncə
2012 - Təcili yardım həkimi, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-azad-abidov';
UPDATE doctor SET bio = 'Uroloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

Müalicə etdiyi xəstəliklər:
Böyrək, sidik axarı, sidik kisəsi daşlarının əməliyyatı (açıq və endoskopik)
Böyrək əməliyyatları (açıq və qapalı)
Skrotal cərrahiyyə
Kişi sonsuzluğu
Prostat vəzin hiperplaziyası (müalicə və cərrahiyyəsi)
Perkutan nefrolitotomiya (PCNL).

Üzvlük:
Azərbaycan Reproduktiv Təbabət Assosiasiyası
Türkiyə Urologiya Dərnəyi.', updated_at = NOW() WHERE slug = 'dr-azad-suleymanov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Dermatologiya, Ankara Nümune EĞİTİM və ARAŞTIRMA HASTANESİ, Türkiyə, Ankara

İş təcrübəsi:
1997-2001 Həkim-dermatoloq, Dəri Zöhrəvi Dispanseri, Azərbaycan, Bakı
2001- Həkim-dermatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-azade-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

Fəaliyyət sahələri:
Terapevtik stomatologiya
Ortopedik stomatologiya
Cərrahi stomatologiya
İmplantologiya
Parodontologiya
Stomatoloji restavrasiya

İş təcrübəsi:
2013 - Müasir Stomatoloji Xəstəliklərin Müalicəsi və Daxili Orqanların Patologiyaları ilə Bağlantısı, Bakı, Azərbaycan
Oktyabr, 2014 - Join The Evolution. Das Neue Astra Tech Implant System, Dortmund, Almaniya
May, 2014 - Fortbildung: Wie Sage Ich Es Meinem Patienten beim Mund-Kiefer-Gesicht Chirurgie, Dr. Dr. Christoph Becker und Kurt-Georg Scheible, Hamm, Almaniya
İyun, 2015 - Fortbildung Parodontologie, Bielefeld, Almaniya
May-Sentyabr, 2011 - Hospitation in Lauradent beim Mund-Kiefer-Gesicht Chirurgie, Dr. Dr. Jochen Wessels, Wittmund, Almaniya
Yanvar, 2016 - Fortbildung bei Prof. Frau Ivana Miletic, „Wie man eine optimale Ästhetik in Front und Seitenzahnbereich erreicht", Bakı, Azərbaycan
Mart, 2016 - Fortbildung bei Prof. Pablo Galindo Moreno, Prof. Gabi Chaushu, Dr. Paolo Cardelli, „2. MIS Implantaten Symposium Aserbaidschan", Bakı, Azərbaycan', updated_at = NOW() WHERE slug = 'dr-azer-eliyev';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Radiologiya

İş təcrübəsi:
2013-2014 - N saylı hərbi hissə - Hərbi hissənin tibb məntəqə rəisi
2014-2019 - Silahlı Qüvvələrin Baş Klinik Hospitalı
2014-2019 - Tədris Cərrahiyyə klinikası, Milli onkologiya mərkəzi - Rezidentura təhsili
2019-2024 - Naxçıvan Qarnizonu Mərkəzi Hospitalı - Radiologiya şöbəsinin baş ordinatoru (Son 4 ildə şöbə rəsinin vəzifəsini icra edib).

Kurslar:
2015 - Türkiyə Respublikası Ankara şəhəri Gülhanə Hərbi Tibb Akademiyası - Radiologiya kursu
2018 - Türkiyə Respublikası Ankara şəhəri Gülhanə Hərbi Tibb Akademiyası - Radiologiya kursu.', updated_at = NOW() WHERE slug = 'dr-azer-memmedov';
UPDATE doctor SET bio = 'Konfranslar:
2015-ci il ADHTİ kursu
2019-ci il Azərbaycan-Türkiyə İnfeksion Forumu İnfeksion xəstəliklərin menecmenti konfransı
2020-ci il Klinik Diaqnostikada Laborator testlərin əhəmiyyəti konfransı
2022-ci il ll Beynəlxalq Laboratoriya Təbabəti konfransı
2023-cü il l Beynəlxalq Azərbaycan Laborator Tibb konqresi
2023-cü il Səhiyyə Menecmenti Zirvəsi
2026-cı il ADHTİ kursu', updated_at = NOW() WHERE slug = 'dr-azer-semedov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Tiroid vəzinin ultrasəs müayinəsi
Süd vəzinin ultrasəs müayinəsi
Prostat vəzinin ultrasəs müayinəsi
Limfa düyünlərinin ultrasəs müayinəsi
Abdominal USM (böyüklərdə və uşaqlarda)
Uroloji USM (böyüklərdə və uşaqlarda)
Ginekoloji (transabdominal-transvaginal) USM
Follikulometriya
Hamiləlik (hamiləliyin təyini, hamiləliyin detallı müayinəsi, hamiləliyin doplerometriyası)
Yumşaq toxumanın ultrasəs müayinəsi
Yenidoğulmuşlarda bud-çanaq oynağının müayinəsi
Neyrosonoqrafiya müayinəsi
Skrotal müayinə

Konfranslar:
2022-ci il - Türkiyə, Samsun şəhəri, 19 Mayıs Universiteti, ixtisaslaşma kursu
2024-cü il - Türkiyə, Ankara Universiteti, ixtisaslaşma kursu
2023-cü il - Azərbaycan Radioloqlar və Onkoloqlar Cəmiyyətlərinin birgə konfransı "Onkoloji görüntüləmədə yeniliklər", Bakı Milli Onkologiya Mərkəzi
2024-cü il - "Yartogenik Fəsadların Qarşısının Alınması və Multidissiplinar Yanaşma" adlı konfrans
2024-cü il - Turkish Sosiety of Radiology -National İnternational Radiology Congress, Türkiyə', updated_at = NOW() WHERE slug = 'dr-babek-qedirov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Oftalmoloq.

Fəaliyyət sahələri:
Refraksiya pozğunluqları (miopiya, hipermetropiya, astiqmatizm, presbiyopiya) müalicəsi
Katarakta cərrahiyyəsi
Eksimer lazerlə miopiya, hipermetropiya, astiqmatizmin cərrahiyyəsi
Göz qapağı cərrahiyyəsi
Göz yaşı kanal tutulmaları əməliyyatları
Uşaqlarda göz yaşı kanal tutulmalarında zondlama və kanala tüblərin qoyulması
Qlaukomanın medical və cərrahi müalicəsi
Uveitlərin müalicəsi
Çəpgözlüklərin müalicə və cərrahiyyəsi
Pteriginmin ən son metodlarla cərrahiyyəsi
İntraokulyar infeksiyaların icrası

Konfranslar:
2008-ci il - Moskva, Katarakta və Refraksiya kursu.
2009-cu il - Türkiyə, Vitroeretinal cərrahiyyə kursu.
2018-ci il - Türkiyə, Multidiod lazer ilə Dakriosistorinostomiya kursu.', updated_at = NOW() WHERE slug = 'dr-behruz-quliyev';
UPDATE doctor SET bio = 'Ürək-Damar Cərrahiyyəsi üzrə mütəxəssis.

Şöbə: Ürək-Damar Cərrahiyyəsi

Fəaliyyət sahələri:
Kardio-anesteziologiya və kardio-reanimasiya - Bayındır Xəstəxanası, Türkiyə, Ankara

İş təcrübəsi:
2007-2008 Həkim-anestezioloq-reanimatoloq, City Hospital MMC, Azərbaycan, Bakı
2008-2009 Həkim-reanimatoloq, DİA Holdinq, Azərbaycan, Bakı
2011- Həkim- kardio-reanimatoloq Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-bextiyar-huseynov';
UPDATE doctor SET bio = 'Baş həkim müavini (Ambulatoriya)/ Pediatr.

Şöbə: Pediatriya

İş təcrübəsi:
1992-1994 Həkim pediatr 6 saylı Uşaq Klinik Xəstəxanası Azərbaycan, Bakı
1995-2008 Müəllim Azərbaycan Dillər Universiteti, Tibbi biliklərin əsası kafedrası Azərbaycan, Bakı
2001-2009 Tibbi Sığorta üzrə Baş mütəxəssis A-Group Sığorta şirkəti, Tibbi Sığorta şöbəsi Azərbaycan, Bakı
2009- Şöbə Müdiri Mərkəzi Klinika, Evdə Tibbi Xidmət şöbəsi Azərbaycan, Bakı
2009-2012 Həkim Mərkəzi Klinika, Uşaq Təcili Yardım Bakı, Azərbaycan
2012- Baş həkim müavini Mərkəzi Klinika Bakı, Azərbaycan', updated_at = NOW() WHERE slug = 'dr-beyaz-ibrahimova';
UPDATE doctor SET bio = 'Terapevt-Qastroenteroloq.

Fəaliyyət sahələri:
Qida borusu və mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi
QERX (Qastroezofageal reflüks xəstəliyi)
Barrett sindromu - Qida borusu selikli qişasında reflüksə bağlı dəyişikliklər
Kəskin və xroniki qastrit - Helikobakter Pilori infeksiyası ilə əlaqəli və ya digər səbəblərə bağlı mədə iltihabı
Mədə və 12 barmaq bağırsaq xorası
Funksional dispepsiya
Divertikulyar xəstəlik (divertikulit)
Qeyri-spesifik xoralı kolit və Kron xəstəliyi - İltihabi bağırsaq xəstəliklərinin diaqnostikası və müalicəsi
Bağırsaq disbakteriozu - Mikrobiom tarazlığının pozulması, şişkinlik və diskomfort
Psevdomembranoz kolit - Antibiotik istifadəsindən sonra yaranan ciddi bağırsaq infeksiyası
Qıcıqlanmış bağırsaq sindromu (qəbizlik, diareya ilə) - Stress, qidalanma və digər səbəblərlə əlaqəli bağırsaq hərəkətləri pozuntusu
Virus hepatitləri (A, B, C, D) - Yoluxma yollarına və forma görə fərqli yanaşma tələb edən infeksiyalar
Qeyri-alkoqollu steatohepatit (qaraciyər piylənməsi) - Metabolik sindrom və artıq çəki fonunda yaranan qaraciyər pozuntusu
Alkoqollu qaraciyər xəstəliyi - Uzunmüddətli spirtli içki istifadəsinin təsiri ilə yaranan dəyişikliklər
Autoimmun hepatit
Birincili biliar sirroz
Qaraciyər sirrozu - Qaraciyərin funksional toxumasının çapıq toxuması ilə əvəz olunması, qaraciyər çatışmazlığı riski
Lyambliyoz, askaridoz, enterobioz, toksokaroz və s. - Uşaqlarda və böyüklərdə tez-tez rast gəlinən helmint və protozoon infeksiyalar
COVID-19 sonrası və digər virus xəstəliklərindən sonra reabilitasiya - Ağciyər, ürək və sinir sistemində yaranmış qalıq təsirlərin dəyərləndirilməsi və bərpası
Hipertoniya, taxikardiya, aritmiya və digər dövran pozğunluqları
Bronxit, astma, pnevmoniya və digər ağciyər xəstəlikləri
Sidik yollarının infeksiyaları, sistit, pielonefrit və s. müayinə və müalicəsi

Konfranslar:
1990-cı ildə Ə.Əliyev adına Həkimlər Təkminləşdirmə İnstitutunda "Təxirə salınmaz terapiya ", Ümumi Terapiya kursu
1993-cü ildə Abşeron MB sanotoriyasında Qastroentoloq vəzifəsində çalışmağa başlamışdır.
1995-ci ildə Ümumi rentgenologiya üzrə ixtisaslaşma kursu
1998-ci ildə USM ixtisaslaşma kursundan , "Həzm sistemi xəstəliklərinin diaqnostikası və müalicəsi" ixtisaslaşma kursu
2010-cu ildə Təcili yardım üzrə ümumi təkmilləşdirmə kursu
2010-cu ildən müxtəlif konfranslarda iştirak etmiş və sertifikatlarla təltif olunmuşdur.
2019-cu ildən Referans Poliklinikin Mərdəkan filialında fəaliyyətə başlamışdır.', updated_at = NOW() WHERE slug = 'dr-beyler-eliyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Sızanaq (Akne)
Dərinin göbələk xəstəlikləri
Atopik dermatit
Psoriaz
Ekzema
Neyrodermit
Dərinin bakterial dermatozları
Dərinin virus xəstəlikləri
Saç və dırnaq problemləri
Saç tökülməsi (Alopesiya) - Stress, hormonal pozuntular, dəmir defisiti, autoimmun xəstəliklər və genetik faktorlarla bağlı saç tökülməsinin araşdırılması və müalicəsi.
Dırnaq xəstəlikləri - Göbələk infeksiyaları, qidalanma pozğunluqları və travmalarla əlaqəli dırnaq deformasiya və patologiyalarının müalicəsi.
Dəri törəmələrinin müalicəsi və aradan qaldırılması

Konfranslar:
2019-cu ildə Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Dermatologiya üzrə İxtisaslaşma kursu
2024-cü il Bakı şəhəri Dəri Zöhrəvi Dispanseri, Sertifikasiya kursu
2020-ci il "Biotənzimləyici Sistemli Təbabətdə tətbiq edilən müalicəvi üsullar" mövzusunda kurs
2024-cü il "Həll yönümlü terapiya" adlı təlim', updated_at = NOW() WHERE slug = 'dr-bike-necefli';
UPDATE doctor SET bio = 'Dermatoloq, Dermatokosmetoloq.

Fəaliyyət sahələri:
Dermatologiya
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Dermatoskopik müayinə
Xal və digər dəri törəmələrinin qiymətləndirilməsi
Akne və postaknenin müalicəsi
Rozasea, psoriaz, atopik dermatit və ekzemanın müalicəsi
Allergik dəri xəstəliklərinin müalicəsi
Dərinin bakterial, virus və göbələk xəstəliklərinin müalicəsi
Vitiliqonun müalicəsi
Saç, baş dərisi və dırnaq xəstəliklərinin diaqnostika və müalicəsi
Xoşxassəli dəri törəmələrinin müalicəsi və götürülməsi
Estetik dermatologiya
Botulinum toksin tətbiqləri
Hialuron turşusu əsaslı dolğu prosedurları
Skin booster və biorevitalizasiya prosedurları
Mezoterapiya
PRP terapiyası
Kollagen stimulyatorları
Kimyəvi pilinqlər
Lazer kosmetologiyası
Fraksional CO₂ lazer
Xoşxassəli dəri törəmələrinin lazerlə götürülməsi
Çapıq və postakne çapıqlarının lazer müalicəsi
Dərinin lazerlə yenilənməsi (laser resurfacing)

Konfranslar:
Azərbaycan Dermatoveneroloqlar Assosiasiyasının (ADVAD) beynəlxalq elmi konfransları
2023-2024-cü illər Ege Dermatoloji Günləri konqresləri
2025-ci il Girnə (Şimali Kipr) və 2026-cı il Antalya - DermaEstetik Akademi Konqresi
Dermatologiya, dermatoskopiya, estetik dermatologiya və lazer kosmetologiyası üzrə beynəlxalq konfrans, simpozium və praktik təlim proqramları
Dermatoskopiya üzrə ixtisasartırma kursları', updated_at = NOW() WHERE slug = 'dr-bilqeyis-mustafayeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

İş təcrübəsi:
2024 - Həkim-anestezioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-birgul-zalxayeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Travmatoloq-Ortoped.

Fəaliyyət sahələri:
Diz və bud-çanaq oynağı artrozlarının müalicəsi
Endoprotez əməliyyatları
Travma cərrahiyyəsi
Osteosintez əməliyyatları
Əl cərrahiyyəsi (sinir, vətər və damar zədələnmələrinin müalicəsi)
Sümüklərin və ətrafların yumşaq toxuma şişlərinin cərrahiyyəsi
Əyripəncəlik, yastıpəncəlik və digər deformasiyaların müalicəsi
Qapalı artroskopik əməliyyatlar
İdman travmaları (diz və çiyin oynaqlarının bağ zədələnmələri)
Uşaq ortopediyası
Halluks valgus və digər skelet-deformasiya əməliyyatları', updated_at = NOW() WHERE slug = 'dr-cabir-murselov';
UPDATE doctor SET bio = 'Terapevt, Endokrinoloq.

Fəaliyyət sahələri:
Şəkərli və şəkərsiz diabet
Hamiləlikdə diabet
Artıq çəki və piylənmə
Ağır dərəcəli çəki azlığı
Qalxanabənzər vəzi xəstəliklər və biopsiyası
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Menstrual tsiklin pozulması
Hirsutizm (qadınlarda kişi tipli tüklənmə)
Kişi və qadınlarda sonsuzluğun endokrinoloji aspektlərinin dəyərləndirilməsi
Osteoporoz və digər metabolik xarakterli sümük xəstəlikləri
Hipertoniya və ya yüksək qan təzyiqinin endokrinoloji dəyərləndirilməsi', updated_at = NOW() WHERE slug = 'dr-cahan-atayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyin USM müayinəsi
3D,4D doppler fetal exoqrafiya
Genetik xromosom skrininq( birinci, ikinci və üçüncü trimestr)
Fetal Exokardioqrafiya
Follikulometriya
Süd vəzilərinin U SM
Qarın boşluğu üzvlərinin tam USM
Qalxanabənzər vəzin USM
Ginekoloji transabdominal və transvaginal USM', updated_at = NOW() WHERE slug = 'dr-camal-eliyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Efferent (Ekstrakorporal) terapiya
Böyrək transplantasiyasına xəstənin hazırlanması

İş təcrübəsi:
2018 Həkim-Nefroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-cemale-hemzeli';
UPDATE doctor SET bio = 'Bakıdan dəvətli Nevroloq.', updated_at = NOW() WHERE slug = 'dr-cemil-ibrahimov';
UPDATE doctor SET bio = 'Neonatoloq.
Şöbə: Neonatologiya

İş təcrübəsi:
2017-2022 - 26 saylı Birləşmiş Şəhər Xəstəxanası/Xəzər Tibb Mərkəzi: Doğum şöbəsində Neonatoloq
2020-2023 - K.Y.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu: Reanimatologiya-anesteziologiya şöbəsi, Həkim-reanimatoloq, Elmi bölmə üzrə kiçik elmi işçi
2023 cü ildən - Yeni Klinika: Neonatoloq.', updated_at = NOW() WHERE slug = 'dr-cemile-ehmedova';
UPDATE doctor SET bio = 'Əməkdar həkim, Mütəxəssis.

Şöbə: Şüa diaqnostika

Fəaliyyət sahələri:
Funksional diaqnostika
Dopler Ultrasonoqrafi - Ankara Nümune Eğitim ve Araştırma Hastanesi, Türkiyə, Ankara
Ultrasonoqrafiya və Rəngli Doppler - Ankara Nümune Eğitim ve Araştırma Hastanesi, Türkiyə, Ankara

İş təcrübəsi:
1974-1976 Həkim-anestezioloq-reanimatoloq, 3 saylı Şəhər Klinik Xəstəxanası, Azərbaycan, Bakı
1976-1984 Həkim-terapevt, Azərbaycan Respublikası Səhiyyə Nazirliyi 4-cü idarəsinin 3 saylı xəstəxanası, Azərbaycan, Bakı
1984-1986 Həkim-terapevt, Azərbaycan Respublikası Səhiyyə Nazirliyi 4-cü idarəsinin 2 saylı xəstəxanası, Azərbaycan, Bakı
1986-2000 Həkim-funksional diaqnostik, Şöbə müdiri, Azərbaycan Respublikası Səhiyyə Nazirliyi 4-cü idarəsinin 1 saylı xəstəxanası, Azərbaycan, Bakı
2000 Həkim-şüa diaqnostik, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-cemile-eybetova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ginekoloji əməliyyatlar
Qadın və kişi sonsuzluğunun diaqnostikası və müalicəsi
Çanaq orqanları xəstəliklərinin müalicəsi
Hormonal problemlərin müalicəsi
Hamiləliyin aparılması
USM (ultrasəs müayinəsi)', updated_at = NOW() WHERE slug = 'dr-cemile-novruzova';
UPDATE doctor SET bio = 'Dəvətli USM həkimi.

Fəaliyyət sahələri:
Qarın boşluğu orqanları
Qalxanvari vəzi (zob)
Süd Vəziləri
Ginekoloji müayinə
Prostat vəzi
Xayaların Doppler müayinəsi
Limfa düyünləri müayinəsi
Tüpürcək vəzilərin müayinəsi
Uşaqlarda bütün müayinələr
Damar Doppler müayinələri
Hamiləlik (bütün aylarda)
Hamiləlik Doppler (3/4 D)', updated_at = NOW() WHERE slug = 'dr-ceyhun-xaliqov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
İltihabi Oynaq Xəstəlikləri (Artritlər)
Revmatoid artrit
Psoriazik artrit
Ankilozlaşdırıcı spondilit (Bekhterev xəstəliyi)
Reaktiv artrit
Uşaqlarda revmatik artrit (yuvenil idiopatik artrit)

Konfranslar:
2013-cü il Həkimlərinin Təkmilləşdirmə İnstitutu,Terapiya üzrə kurs
2015-ci Həkimlərinin Təkmilləşdirmə institutu, Kardiologiya üzrə kurs
2015-ci il Cardiology service, EXO-KG kursu TC Şişli Eftal Eğitim Araştırma Hastenesi,Türkiyə, İstanbul
2017-ci il Romatologi bölümündə ixtisaslaşma kursu, TC Maltepe Universitesi Hastenesi, Türkiyə, İstanbul
2017-ci il Endokrinoloji ve Metabolizma hastalıkları mezuniyyet sonrası eğitim kursu
2017-ci il 3.TÜRKİYE-AZERBAYCAN ORTAK HEPATOLOJİ KURSU
2018 ci il 19-cu Ulusal Romatoloji Kongresi Kapilleroskopi kursu
2019-cu il Romatolojide Hedef Sempozyumu Romatologlar için İmmunoloji ve Genetik kursu
2019-cu il EFSUMB EUROSON SCHOOL MUskuloskeletal Sonography Course in Rheumatology-Basic Course
2019-cu il 14th Mediterranean Rheumatology Symopsium & Basic Ultrasound Course
2019 -ci il TC Akdeniz Universitesi Hastanesi Romatoloji və İmmunoloji bölümündə oynaq ultrasonoqrafiyası üzrə ixtisaslaşma, Türkiyə,İstanbul', updated_at = NOW() WHERE slug = 'dr-ceyhune-ismayilova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal USM (uşaqlarda və böyüklərdə)
Qalxanabənzər vəzinin (thyroid) USM-i
Süd vəzisinin USM-i
Ginekoloji USM (transabdominal və transvaginal)
Follikulometriya
Hamiləliyin təyini
Erkən hamiləlik USM-i
Hamiləlik skrininqi, dopplerometriya və 3D/4D müayinəsi:
1-ci skrininq: 11-14 həftə
2-ci skrininq: 18-21 həftə
3-cü skrininq: 28-31 həftə
Yumşaq toxuma USM-i
Limfa düyünlərinin USM-i', updated_at = NOW() WHERE slug = 'dr-ceyran-axundova';
UPDATE doctor SET bio = 'Evdə tibbi xidmət üzrə həkim.
Şöbə: Evdə Tibbi Xidmət

İş təcrübəsi:
2020-2023 - Yeni Klinika: Anesteziologiya-reanimasiya şöbəsi
2023-2024 - Yeni Klinika: Təcili və təxirəsalınmaz tibbi yardım şöbəsi
2024 - Yeni Klinika: Evdə tibbi xidmət şöbəsi.', updated_at = NOW() WHERE slug = 'dr-cosqun-piriyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Refraksiya anomaliyaların uşaq və böyüklərdə müalicə və müayinəsi
Ön və arxa seqment iltihabi və s. patologiyaları müalicə və müayinəsi
Biomikroskopiya
Refraktometriya
Tonometriya
Göz yaşı kanalı müayinəsi və yuyulması
Çəpgözlük ambliopiya müalicəsi
Müxtəlif infeksiyaların müalicəsi
Gözdən yad cismin çıxarılması

Konfranslar:
02.09.2004-30.12.2004 tarixlərində Ə.Əliyev adına Həkimlərin Təkmilləşmə kursu AOC-nın təşkil etdiyi əksər seminarlarda iştirak etmişdir.
Bir çox daxili və xarici konfranslarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-dilare-idrisova';
UPDATE doctor SET bio = 'Mama-Ginekoloq.', updated_at = NOW() WHERE slug = 'dr-dilsad-ehmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Nevrozlar
Beynin işemik xəstəlikləri
Beynin qan dövranı pozğunluqları
Enurezlər
Yuxusuzluq sindromları
Osteoxondrozlar
Miqren
Depressiyalar', updated_at = NOW() WHERE slug = 'dr-edalet-eminov';
UPDATE doctor SET bio = 'Pediatr.

Fəaliyyət sahələri:
0 yaşdan 18 yaşa kimi rutin müayinələrin aparılması
Tənəffüs sistemi xəstəlikləri
Mədə-bağırsaq xəstəlikləri
Allerqoloji xəstəliklər
Parazitar xəstəliklər
Sidik-ifrazat sistemi xəstəlikləri
Anemiyalar

Konfranslar:
2019-cu il iyul - avqust Uşaq Sağlamlığı və Xəstəlikləri Proqramı, Medicabil Hospital, Bursa, Türkiyə
2017-ci il Şişli Hamidiye Etfal Eğitim ve Araştırma Hastanesi Pediatri Kliniğinde ixtisaslaşma kursu, İstanbul, Türkiyə
4 sentyabr 2020-ci il Pediatriya ixtisası üzrə sertifikasiya şəhadətnaməsi, Azərbaycan Respublikası Səhiyyə Nazirliyi
13 noyabr 2025-ci il Pediatriya ixtisası üzrə sertifikasiya şəhadətnaməsi, Azərbaycan Respublikası Səhiyyə Nazirliyi
12-15 mart 2023 cü il 19 cu Uludağ pediatri konqresi, Bursa', updated_at = NOW() WHERE slug = 'dr-efsane-allazova';
UPDATE doctor SET bio = 'Uzman neonatoloq-pediatr.
Şöbə: Neonatologiya

Müalicə etdiyi xəstəliklər:
Sağlam uşaq izlənməsi, böyümə və inkişaf dəyərləndirilməsi
Qidalanma
Anemiyalar
Mədə-bağırsaq sistemi xəstəlikləri
Tənəffüs sistemi xəstəlikləri
Allergik xəstəliklər
Sidik-ifrazat sistemi xəstəlikləri
İnfeksiyon xəstəliklər
Yenidoğulmuşların aylıq rutin müayinələri.

İş təcrübəsi:
2009 -2015 - Gəncə şəhəri 1 saylı Uşaq Poliklinikası: Həkim pediatr
2019-2020 - Leyla Medical Centre: Pediatriya və Neontalogiya şöbəsinin müdiri
2020 - Respublika Diaqnostika Mərkəzi - Pediatriya və neontalogiya şöbəsinin müdiri
2023 - Yeni Klinika: Neonatologiya şöbəsinin müdiri.', updated_at = NOW() WHERE slug = 'dr-ekber-quliyev';
UPDATE doctor SET bio = 'Bakıdan dəvətli LOR.', updated_at = NOW() WHERE slug = 'dr-elbrus-tehmezov';
UPDATE doctor SET bio = 'Ümumi Cərrahiyyə Uzmanı.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Onkoloji xəstəliklərin açıq və qapalı üsullarla cərrahi əməliyyatları
Mədə-bağırsaq xəstəliklərinin laparoskopik və açıq üsullarla əməliyyatları
Qalxanabənzər və qalxanabənzərətrafı vəzilərin cərrahiyyəsi
Süd vəzi cərrahiyyəsi
Qaraciyər, öd yolları və mədəaltı vəzi cərrahiyyəsi.

Kurslar:
Təməl cərrahiyyə kursu
Damar cərrahiyyəsi kursu
Differensial tiroid xərçəngində cərrahi genişlik və boyun metastazlarının gedişinə yanaşma
Cərrahlar üçün Tiroid Ultrasonoqrafiyası Təlim Kursu
Kolorektal xərçənglərdə cari yanaşma kursu
Aşağı ətrafların fasiotomiyası - simulyasiya kursu.', updated_at = NOW() WHERE slug = 'dr-elcin-elizade';
UPDATE doctor SET bio = 'Stomatologiya şöbəsinin müdiri.

Şöbə: Stomatologiya

Fəaliyyət sahələri:
Ortodontologiya, Endodontologiya, İmplantologiya - Azərbaycan, Bakı

İş təcrübəsi:
2011-2013 Həkim-stomatoloq, Mərkəzi Poliklinika, Azərbaycan, Saatlı
2011-2014 Həkim-stomatoloq Doktor Dent Stomatoloji Klinikası, Azərbaycan, Bakı
2014-2017 Həkim-stomatoloq, Caspian Hospital, Azərbaycan, Bakı
2016- Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı
2017 - Stomatologiya şöbəsinin müdiri, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elcin-esedov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Urologiya

Fəaliyyət sahələri:
Endourologiya, Laparoskopiya, Uroonkolgiya, andralogiya, uşaq urologiyası, qadın urologiyası, ESWL, Urodinamika - Ondokuz Mayıs Universiteti, Türkiyə, Samsun

İş təcrübəsi:
2018 - Həkim-uroloq, Mərkəzi Klinika, Bakı, Azərbaycan', updated_at = NOW() WHERE slug = 'dr-eldar-abbasov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Travmatoloq-Ortoped.

Fəaliyyət sahələri:
Onurğa əyrilikləri ( skolioz, kifoz)
Menisk və çarpaz bağ zədələnmələri
Qol və ayaq sınıqları
Uşaq otpediyası
Oynaq və vətər problemləri
Çiyin, topuq və əl biləyi ağrıları
Travma sonrası sinir-damar zədələnmələri
Endoprotez və osteosintez əməliyyatları', updated_at = NOW() WHERE slug = 'dr-eldar-esedli';
UPDATE doctor SET bio = 'Ürək-Damar Cərrahiyyəsi Uzmanı.
Şöbə: Ürək-Damar Mərkəzi

İcra etdiyi əməliyyatlar:
Aorta-koronar şuntlama
Minimal invaziv (kiçik kəsiklər ilə) aorta koronar șuntlama əməliyyatları
Minimal invaziv (kiçik kəsiklər ilə) ürək qapağı əməliyyatları
Döyünən ürəkdə (ürəyi dayandırmadan) icra edilən aorta-koronar șuntlama əməliyyatları
Aorta qapaq əməliyyatları (dəyişdirilməsi və təmiri)
Aort qapağın Neoküspidizasiyası (Ozaki əməliyyatı)
Mitral qapaq əməliyyatları (dəyişdirilməsi və təmiri)
Triküspit qapaq əməliyyatları (dəyişdirilməsi və təmiri)
Qulaqcıqlar arası çəpər defekti təmiri əməliyyatı
Çıxan aortanın anevrizma əməliyyatları
Qarın aortasının anevrizma əməliyyatları
Yuxu arteriyası əməliyyatı
Periferik arteriyaların əməliyyatları
Arteriovenoz fistula açılması əməliyyatı
Aorta anevrizması - diseksiyon əməliyyatları.

İş təcrübəsi:
2022 - Aorta qapağı təmiri kursu - Fellowship (Almanya, Saarland University, Hamburg)
2023 - Ürək transplantasiyası və Assist device cərrahiyyəsi - Fellowship (Türkiyə, Ankara Şehir Hastanesi, Ürək çatışmazlığı cərrahiyyəsi şöbəsi).', updated_at = NOW() WHERE slug = 'dr-elgin-hacizade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

İş təcrübəsi:
1970-1976 Həkim-terapevt, AR Səhiyyə Nazirliyinin 4-cü Baş idarəsinin 2 saylı xəstəxanası, Azərbaycan, Bakı
1976-1978 Həkim-kardioloq, AR Səhiyyə Nazirliyinin 4-cü Baş idarəsinin 2 saylı xəstəxanası, Azərbaycan, Bakı
1978-1989 Kardiologiya şöbəsinin müdiri, AR Səhiyyə Nazirliyinin 4-cü Baş idarəsinin 2 saylı xəstəxanası, Azərbaycan, Bakı
1989-2001 Kardiologiya şöbəsinin müdiri, AR Səhiyyə Nazirliyinin 4-cü Baş idarəsinin 4 saylı xəstəxanası, Azərbaycan, Bakı
2001- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-eli-bayramov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Terapevt, Revmatoloq.

Fəaliyyət sahələri:
Fəqərəarası disk yırtıqları və onurğa sütunu deformasiyaları
Artrozlar
Menisk yırtığı
Baş ağrıları
Artritlər
Ankilozlaşan spondiloartrit
Fibromialgiya
Əyri pəncəlik
Bud-çanaq displaziyası
Hamiləlik zamanı onurğa problemləri və bel ağrıları
Doğuşdan sonra yaranan disfunksiyalar
Nevroloji xəstəliklərin fizioterapevtik müalicəsi', updated_at = NOW() WHERE slug = 'dr-eli-elizade';
UPDATE doctor SET bio = 'Bakıdan dəvətli Dermatoveneroloq.

Fəaliyyət sahələri:
Allergik dermatit və dermatozlar
Ekzema
Psoriaz
Demodekoz
Müxtəlif etiologiyalı dəmrovlar
Acne vulqaris
Döyənəklər
Dərinin, dırnağın və saçların göbələk xəstəlikləri
Cinsi yolla yoluxan zöhrəvi xəstəliklər - xlamidiya, mikoplazma, ureaplazma, qonoreya, trixomoniaz və s.urogenital patologiya
Genital Herpes
Viruslu ziyillər (kondilomalar)
Ət xallar - papilloma, epitelioma, bazalioma və s.dəri törəmələrinin kriodestruksiya üsulu ilə ağrısız, fəsadsız götürülməsi', updated_at = NOW() WHERE slug = 'dr-eli-hetemov';
UPDATE doctor SET bio = 'Həkim-pediatr.
Şöbə: Reproduktiv Sağlamlıq və Ailə Planlaması Mərkəzi

İş təcrübəsi:
2020 PALS Pediatric Advanced Life Support Baku 2021 Həkimləri Təkmilləşdirmə İnstitutu
2018- 2021 Euromed- həkim pediatr
2021-2023 Kəpəz hospital- həkim pediatr
2023-2024 10 saylı uşaq poliklinikası- həkim-pediatr.', updated_at = NOW() WHERE slug = 'dr-ellada-nagiyeva';
UPDATE doctor SET bio = 'Nevroloq, Alqoloq.

Fəaliyyət sahələri:
Nevroloji xəstəliklərin diaqnostika və müalicəsi
Epilepsiya - Tutmaların diaqnozu, medikamentoz və həyat tərzi dəstəyi
Miqren və digər baş ağrısı sindromları - Kəskin və xroniki formada olan baş ağrılarının səbəblərinin araşdırılması və fərdi müalicə planları
Yuxu pozğunluqları - Yuxusuzluq, tez oyanma, gecə panikası və s. halların müayinə və müalicəsi
Yaddaş və diqqət pozğunluqları - Neyrodegenerativ proseslərin erkən aşkarlanması və kognitiv reabilitasiya
Nitq pozuntuları - Nevrogen nitq problemlərinin dəyərləndirilməsi və müalicə istiqamətləri
Panik atak və narahatlıq sindromu - Alqoloji yanaşmalarla psixosomatik simptomların yüngülləşdirilməsi
Xroniki yorğunluq sindromu - Nevroloji və metabolik əsaslı qiymətləndirmə və bərpa proqramı
Xroniki ağrı sindromlarının müalicəsi (Alqologiya) - Baş, bel, boyun, ətraflar və oynaq ağrılarının səbəblərinə yönəlmiş diaqnostika
Karpal tunel sindromu - Əl sinirlərinin sıxılması ilə bağlı ağrı və keyimə şikayətlərinin müalicəsi
Posttravmatik ağrılar- Travmadan sonra hərəkət məhdudiyyəti və ağrının kompleks reabilitasiyası
Onurğa və oynaq sistemi ilə bağlı nevroloji və degenerativ pozuntuların müayinə və müalicəsi
Fəqərələrarası diskin yırtığı və ona bağlı ağrıların aradan qaldırılması
Spondilit və osteodegenerativ dəyişikliklər - Onurğada iltihabi və degenerativ xəstəliklərin kompleks müalicəsi
Oynaq patologiyaları (menisk yırtığı, tendonit və s.) - Oynaq ağrılarının səbəblərinin nevroloji təhlili və bərpaedici yanaşmalar
Uşaqlarda dayaq-hərəkət sistemi pozuntuların müayinə və müalicəsi
Uşaq nevroloji inkişaf problemlərinin müayinə və müalicəsi Tonus pozuntuları, tarazlıq və hərəkət koordinasiyası problemlərinin diaqnozu
Ortopedik-nevroloji patologiyalar - Skolioz, yastıpəncəlik, yerimə və motor funksiyalarla bağlı pozuntular
Üz sinirinin iflici və nevritlər - Üz əzələlərinin hərəkətində zəiflik, assimetriya və ifadə pozuntularının səbəblərinin müəyyənləşdirilməsi və reabilitasiya yönümlü müalicə.', updated_at = NOW() WHERE slug = 'dr-elman-kerimov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2011- Həkim-mama-ginekoloq Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elnare-bayramova';
UPDATE doctor SET bio = 'Dəvətli Fizioterapevt - Reabilitoloq.

Fəaliyyət sahələri:
Onurğa xəstəlikləri (Skolioz, Kifoz, lordoz)
Onurğanın zədə sonrası müalicəsi
Diz ağrıları (Artroz, Artrit, Osteoartrit)
Osteoxondroz
Boyun disk yırtığı (qrija)
Bel disk yırtığı (qrija)
Pleksit
Miqren ağrıları
Bel ağrıları
Ayaq ağrıları
Üz iflici
İnsult
Serebral iflic
Əzələ distrofiyaları', updated_at = NOW() WHERE slug = 'dr-elnur-asurov';
UPDATE doctor SET bio = 'Anestezioloq-Reanimatoloq.

Fəaliyyət sahələri:
Anesteziya öncəsi pasiyentin müayinəsi, məsləhətləndirilməsi və əməliyyata hazırlanması.
Cərrahi, mama-ginekoloji, terapevtik və diaqnostik invaziv müdaxilələr zamanı ağrısızlaşdırma və anesteziyanın təmin edilməsi.
Pasiyentin monitorinqi, əməliyyat öncəsi hemostazın aparılması, kritik şok, koma və digər təcili halların idarə olunması.
Reanimasiya və intensiv terapiya tədbirlərinin təşkil edilməsi və icrası.
Tənəffüs çatışmazlığının dəyərləndirilməsi və süni tənəffüs dəstəyi ilə idarə olunması.
Müalicənin keyfiyyətini və effektivliyini artırmaq məqsədilə elmi tədqiqatların aparılması.', updated_at = NOW() WHERE slug = 'dr-elnur-ceferov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet (Tip 1 və Tip 2)
Şəkərsiz diabet
Hamiləlikdə (hestasion) diabet - Ana və döl üçün riskləri azaldan nəzarət və müalicə proqramı
Artıq çəki və piylənmə - Hormonal səbəblərin araşdırılması və endokrin yanaşmalarla müalicə
Ağır dərəcəli çəki azlığı - Maddələr mübadiləsi və hormon çatışmazlıqlarının qiymətləndirilməsi
Qalxanabənzər vəzi xəstəlikləri - Hipotiroidizm, hipertiroidizm, düyünlü zob və s.
Hipofiz vəzi xəstəlikləri - Hormon ifrazının azalması və ya artması ilə bağlı pozuntular (akromqeliya, prolaktinoma və s.)
Böyrəküstü vəzi xəstəlikləri - Kortizol, aldosteron və digər hormon balansı pozuntuları (Addison, Kuşinq sindromları və s.)
Menstrual tsiklin pozulması - Hormonal disbalans, polikistoz, amenoreya və s.
Hirsutizm - Qadınlarda kişi tipli tüklənmənin endokrin səbəblərinin aşkarlanması
Qadınlarda sonsuzluq - Yumurtlama problemləri və hormon pozğunluqlarının diaqnostikası
Kişilərdə hormonal mənşəli sonsuzluq - Testosteron çatışmazlığı, prolaktin yüksəkliyi və digər səbəblərin araşdırılması
Osteoporoz - Sümük sıxlığının azalması, sınıq riskinin qiymətləndirilməsi və müalicəsi
Digər metabolik sümük xəstəlikləri - D vitamini çatışmazlığı, paratiroid vəzi xəstəlikləri və s.
Hipertoniya - Yüksək qan təzyiqinin qalxanabənzər, böyrəküstü vəzi və digər hormonal səbəblərlə əlaqəsinin dəyərləndirilməsi

Konfranslar:
2011-ci il "Tıp Fakültesi Hastanesi. Endokrinoloji ve Metabolizma Hastalıkları" bölməsində təkmilləşmə kursu, Ege Universiteti
2014-cü il "Şəkərli Diabetdə insulinoterapiya" kursu, Sankt-Peterburq
2018-ci il Diabetologiya üzrə Qrand kursu
2019-cu il Avropa Tireodiologiya Assosiasiyasının mütəxəssislərinin təşkil etdiyi, Ümumdünya Qalxanabənzər vəzi gününə həsr olunmuş konfrans
2019-cu il 5-ci Bariatrik-Metabolik Cərrahiyyə kongresində iştirak edib.
2021-ci il Diabetik neyropatiya və müalicəsi konfransı
2021-ci il Böyrəküstü vəzi çatışmazlığının müalicə və diaqnostikasına müasir yanaşma.
2021-ci il Dislipidemiyalar
2022-ci il Dünya piylənmə günü ilə mübarizə günü beynəlxalq konfrans
2022-ci il Endokurs 2022
2022-ci ilOsteoporoz seminarı
2023-cü il Qadın və kişi endokrinologiyası ekspertlərin dilindən
2023-cü il Hipofiz xəstəliklərinə multidisiplinar yanaşma.', updated_at = NOW() WHERE slug = 'dr-elnur-memmedov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Sızanaq (Akne)
Dərinin göbələk xəstəlikləri
Atopik dermatit
Psoriaz
Ekzema
Neyrodermit
Dərinin bakterial dermatozları
Dərinin virus xəstəlikləri

Konfranslar:
2014-cü ildə Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitunun nəzdində Bakı Şəhər Dəri-Zöhrəvi Dispanserində Dermatoveneroloji kurs keçmişdir.
2018-ci ildə Türkiyənin Gaziosmanpaşa xəstəxanasının Dermatoloji bölümündə kurs keçmişdir.
Bir çox ölkədaxili və xarici konfranslarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-elnur-nezerov';
UPDATE doctor SET bio = 'Uzman uroloq-androloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

Müalicə etdiyi xəstəliklər:
Sidik yolları infeksiyaları (pielonefrit, sistit, uretrit)
Polikistik böyrək və böyrəyin digər kistik xəstəlikləri
Böyrək daşı müalicəsi: (Böyrək daşı, sidik axarı daşları və sidik kisəsi daşlarının cərrahi və dərman müalicəsi)
Hematuriya (sidikdə qan)
Kişilərdə sidiyə çıxma problemləri və prostat vəzi xəstəlikləri
Qadınlarda sidik qaçırma problemləri (dərman və cərrahi müalicəsi)
Kişi sonsuzluğu, varikosele və digər androloji xəstəliklər
Böyrəküstü vəzi xəstəlikləri (adenoma, kista)
Uşaqlarda uroloji xəstəliklər (sidik çıxarıcı yollarda anadan gəlmə anomaliyalar, enməmiş xaya, varikosele).', updated_at = NOW() WHERE slug = 'dr-elnur-ziyadov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Süd vəzi xərçəngi
Ağciyər xərçəngi
Gastrointestinal sistem xərçəngi (Mədə-bağırsaq)
Pankreas xərçəngi
Qaraciyər xərçəngi
Kişi və qadın sistemi xərçəngləri (Prostat, sidik kisəsi, testis, yumurtalıq, uşaqlıq və uşaqlıq yolu)
Baş-boyun bölgəsi xərçəngi

İş təcrübəsi:
2016-2017 Asistent -həkim, Klinikum Dortmund, Almaniya
2022 - Həkim-onkoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elnure-osmanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya - Siyami Ersek Göğüs Kalp Ve Damar Cerrahisi Eğitim Araştırma Hastanesi, Türkiyə İstanbul
Kompleks koronar və CTO müdaxilə - Memorial Bahçelievler Hastanesi, Türkiyə, İstanbul
İntrakoronar görüntüləmə əsasında kompleks koronar və periferik müdaxilə - Erciyes Üniversitesi Kalp Damar cerrahisi, Türkiyə, Kayseri

İş təcrübəsi:
2020 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elnure-qardasova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Hematologiya - Anadolu Sağlık Mərkəzi, Türkiyə, İstanbul

İş təcrübəsi:
2010 - Həkim-hematoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elnure-qasimova';
UPDATE doctor SET bio = 'Uzman travmatoloq-ortoped.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'dr-elsen-necefov';
UPDATE doctor SET bio = 'Ümumi cərrahiyyə şöbəsinin müdiri.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Ümumi cərrahi əməliyyatlar
Paralel olaraq Laparoskopik, Varikoz, Tiroidektomiya və qarın boşluğuna dair əməliyyatlar
Bura daxildir: öd, mədə ,bağırsaq, qara ciyər və dalaq əməliyyatları.', updated_at = NOW() WHERE slug = 'dr-elsen-qedimov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Süd vəzi xərçəngi
Ağciyər xərçəngi
Gastrointestinal sistem xərçəngi (Mədə-bağırsaq)
Pankreas xərçəngi
Qaraciyər xərçəngi
Kişi və qadın sistemi xərçəngləri (Prostat, sidik kisəsi, testis, yumurtalıq, uşaqlıq və uşaqlıq yolu)
Baş-boyun bölgəsi xərçəngi

İş təcrübəsi:
2020-2021 Daxili Xəstəliklər uzmanı, Özel Koru Ankara Xəstəxanası, Türkiyə, Ankara
2024-2025 Tibbi Onkologiya uzmanı, Liv Hospital, Türkiyə, Ankara
2025 - Həkim-onkoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-elvin-celebiyev';
UPDATE doctor SET bio = 'Qastroenterologiya şöbəsinin müdiri.
Şöbə: Qastroenterologiya', updated_at = NOW() WHERE slug = 'dr-elvin-eliyev';
UPDATE doctor SET bio = 'Uzman ümumi cərrah.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Açıq və qapalı (laparoskopik) cərrahi əməliyyatlar

İş təcrübəsi:
Son iş yeri - Bakı Sağlamlıq Mərkəzi, Həkim ümumi cərrah - 2024-2025', updated_at = NOW() WHERE slug = 'dr-elvin-tanriverdi';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Dişləmin anomaliyaları
Diş cərgəsinin estetik və funksional pozulmalarının ortodontik aparatlarla bərpası
Dişsizliyin (adentiya) ortopedik konstruksiyalarla bərpası
Əyri dişlərin ortodontik aparatlar (breketlər və plastinkalarla) ilə müalicəsi
Dişlərin müalicəsi və plomblanması (sadə və estetik)
Protezlər (çıxan və çıxmayan ortopedik konstruksiyalar- termoplastik, akril, attaçmenli və bügel protezlər; metallı və zirkonium əsaslı keramik qapaqlar)

Konfranslar:
2013-cü ildə APOC-un Ortodontiya üzrə 1 ay müddətində modul kursu
2015-ci ildə "Dişlərin çəkilməməsi ilə həyata keçirilən ortodontik müalicə, Pendulum aparatı, Damon sistemi - passiv, özü bəndlənən breket sistemi", ORMCO
2016-cı il Paradont xəstəliklərinin müasir diaqnostika və müalicəsi, ADHTİ
2017-ci ildə Ankara Universiteti Diş Həkimliyi fakültəsində Ortodontiya üzrə 1 aylıq praktik kurs
2023-cü il Ortodontiyada çıxan aparatlarla müalicə üsulları, ADHTİ', updated_at = NOW() WHERE slug = 'dr-elvin-tanriyar';
UPDATE doctor SET bio = 'İnvaziv-kardioloq.
Şöbə: Ürək-Damar Mərkəzi

Müalicə etdiyi xəstəliklər:
Ürəyin işemik xəstəliyi
Miokard infarktı
Stenokardiya
Arterial hipertenziya
Hiperlipidemiyalar
Ürək çatışmazlığı
Kardiomiopatiyalar
Aritmiyalar
Qapaq xəstəlikləri
Ürək qüsurlarının diaqnostikası.

Üzvlük:
Azərbaycan Kardiologiya Cəmiyyəti (AKC)
Avropa Kardiologiya Cəmiyyəti (ESC)
Amerika Kardiologiya Cəmiyyəti (AHA)
Türkiyə Kardiologiya Cəmiyyəti (TKD).', updated_at = NOW() WHERE slug = 'dr-elvira-babasova';
UPDATE doctor SET bio = 'Ümumi Cərrah.

Fəaliyyət sahələri:
Qarınboşluğunun cərrahi müalicəsi
Xolesistektomiya (açıq və laparoskopik)
Appendiktomiya
Splenektomiya
Vətərlərin plastikası
Travmatoloji əməliyyatlar
Osteosintez
Ginekoloji əməliyyatlar
Uroloji xəstəliklərin müalicəsi

Konfranslar:
1982-ci il Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Urologiya üzrə kurs
1984-cü il Moskva şəh., Piroqov adına Tibb Universiteti, Travmatologiya və Ortopediya üzrə kurs
2015-ci il Ege Universiteti, Ümumi cərrahiyyə, Türkiyə, İzmirTəhsil
1969-1975-ci illərdə Azərbaycan Tibb Universiteti, Müalicə-profilaktika fakültəsi
1975-ci il Ümumi cərrahiyyə, İnternatura', updated_at = NOW() WHERE slug = 'dr-emen-qasimov';
UPDATE doctor SET bio = 'Reanimasiya və anesteziologiya şöbəsinin müdiri.
Şöbə: Reanimasiya', updated_at = NOW() WHERE slug = 'dr-emil-qasimov';
UPDATE doctor SET bio = 'Nevroloq.
Şöbə: Nevrologiya

Müalicə etdiyi xəstəliklər:
İşemik ve hemorargik insult
Beynin vaskulyar xəstəlikləri
Periferik sinir sistemi xəstəlikləri
Baş ağrıları
Parkinson və hərəkət pozğunluğu xəstəliyi
Epilepsiya
Baş dönməsi, vertigo.', updated_at = NOW() WHERE slug = 'dr-emin-nesirov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Qastroskopiya
Kolonoskopiya
Kolonoskopik və Qastroskopik polipektomiya
Mədə-Bağırsaq Qanamalarının endoskopik müalicəsi (Arqon, Skleroterapiya, Klips və s.)
Qida borusu Varis Band Liqasiyası
Yad cismin çıxarılması
Mədə-Bağırsaq darlıqlarında balon/buji ilə genişləndirmə
Mədə-Bağırsaq darlıqlarında stent yerləşdirilməsi
Axalaziyada Balon Dilatasiyası
Endoskopik Qidalanma Borusunun Yerləşdirilməsi
Endoskopik Perkutan Qastrostomiya (PEG)
Endoskopik Retroqrad XolangioPankreatoqrafiya (ERCP)
Hepatobiliar USM
Endoskopik Biliar Stent Yerləşdirilməsi
Nazobiliar Drenaj
Görüntüləmə nəzarəti ilə qaraciyər biopsiyası
Biopsiya, iynə
Parasentez
Ultrasəs nəzarəti ilə parasentez, Uludağ Universiteti Tibb Fakultəsi, Türkiyə, Bursa

İş təcrübəsi:
2009-2011 Hərbi-həkim, "161" saylı hərbi hissədə Tibbi məntəqə rəisi, Azərbaycan, Bakı
2012 Həkim-qastroenteroloq, Mərkəzi Klinika, Azərbaycan,Bakı', updated_at = NOW() WHERE slug = 'dr-emin-verdiyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal USM (qaraciyər, öd kisəsi, dalaq, mədəaltı vəzi, böyrəklər)
Neyrosonoqrafiya
Bud-çanaq oynağının müayinəsi
Süd vəzilərinin müayinəsi
Kiçik çanaq orqanlarının ultrasəs müayinəsi
Doppleroqrafiya (aşağı və yuxarı ətraflar venalar və arteriyalar, ekstrakranial damarlar, qarın aortası, böyrək arteriyaları, portal sistemin doppleroqrafiyası)
Prostat vəzinin rektal USM
Qalxanabənzər vəzin müayinəsi
Timus vəzinin müayinəsi
Səthi toxumaların müayinəsi
Göz dibinin ultrasəs müayinəsi və s.

Konfranslar:
2023-2024-cü illər - Gülhane Eğitim ve Araştırma Hastanesi, "Radiologiya" kursu.', updated_at = NOW() WHERE slug = 'dr-emrah-kerim';
UPDATE doctor SET bio = 'Bakıdan dəvətli Pulmonoloq.

Fəaliyyət sahələri:
Tənəffüs Sistemi Xəstəliklərinin müayinə və müalicəsi
Bronxial astma - Xırıltı, nəfəs darlığı və öskürəklə müşayiət olunan astmanın diaqnostikası və uzunmüddətli idarə olunması
Xroniki obstruktiv ağciyər xəstəliyi (XOAX) - Siqaretlə əlaqəli və digər səbəblərlə yaranan xronik tənəffüs çətinliyi
Bronxitlər və pnevmoniyalar - Kəskin və xroniki bronx və ağciyər iltihablarının diaqnozu və müalicəsi
Ağciyərin parenximatoz xəstəlikləri - İnterstisial xəstəliklər, sarkoidoz, fibrozlar və digər ağciyər toxuma problemləri
Plevra xəstəlikləri - Plevral maye, plevrit və digər plevra ilə bağlı patologiyaların qiymətləndirilməsi
Pulmonar tromboemboliya (non-massiv) - Ağciyər damarlarında qansızma və tıxanmanın diaqnostikası
Siqaret və peşə faktorları ilə əlaqəli ağciyər problemləri
Siqaretə bağlı ağciyər zədələnmələri - Tənəffüs funksiyalarının monitorinqi və erkən diaqnostika
Ağciyərin peşə xəstəlikləri - Toz, kimyəvi maddələr və digər iş mühitinə bağlı tənəffüs pozuntularının aşkarlanması
Ağciyər xərçənginin erkən diaqnostikası - Klinik əlamətlər, görüntüləmə və funksional göstəricilər əsasında
Vərəm (tuberkuloz) - Tənəffüs yolu ilə keçən yoluxucu xəstəliyin aşkarlanması və istiqamətli müalicə
Bronxoskopiya - Ağciyər və bronxların endoskopik müayinəsi (diaqnostik və terapevtik məqsədlərlə)
Spirometriya - Tənəffüs həcmlərinin ölçülməsi, astma və XOAX kimi xəstəliklərin təsnifatı
Ağciyər tənəffüs funksiyalarının öyrənilməsi - Cərrahiyyə öncəsi və sonrası, siqaret çəkənlər və xronik xəstələr üçün dəyərləndirmə
Sarkoidoz və digər interstisial xəstəliklərdə ağciyər tutulumunun qiymətləndirilməsi.

Konfranslar:
Türk Toraks Dərnəyi (TTD), Ağciyər Sağlığı və Yoğun Bakım Dərnəyi (ASYOD),Türkiye Solunum Araşdırma Dərnəyinin (TUSAD) üzvü
2010-cu il Əziz Əliyev adına Həkimlərin Təmkilləşdirmə İnstitutu - endokrinologiya ixtisası üzrə təkmilləşmə kursu
2015-ci il Əziz Əliyev adına Həkimlərin Təmkilləşdirmə İnstitutu - ürək ağciyər reanimasiyası və terapevtik yardım üzrə təkmilləşmə kursu
2016-cı il Ağciyər Sağlığı və Yoğun Bakım Dərnəyi ASYOD Ankarada təşkil etdiyi "Toraks Radyolojik Olğu Tartışmaları"kursu
2016-cı il Türk Toraks Dərnəyinin Ankarada təşkil etdiyi "Kadın Çevresel və Məsləki Ağciyər Sağlığı" sempozyumu
2016-2017-ci illər Ankara Universiteti Tibb Fakültəsi Ağciyər xəstəlikləri bölümündə Ağciyər xəstəlikləri, Bronxoskopiya,Spirometriya üzrə təkmilləşmə kursu
2017-ci il Turk Toraks Dərnəyinin İstanbulda təşkil etdiyi "Girişimsəl Bronxoskopi" kursu
2017-ci il TUSAD SOLUNUM kongresi
2017-ci ildə AUTF və TDCY Ankarada təşkil etdiyi "Yoğun Bakımda Təməl Bronxoskopi" kursu
2017-ci il ASYOD Antalyada təşkil etdiyi "Astım Tanı və Tedavi "kursu
2017-ci il Türk Toraks Dərnəyinin Antalyada təşkil etdiyi "EBUS Bronxoskopi:Teorikten Pratiğe "kursu
2017-ci il TUSAD "İnterstisial ağciyər xəstəlikləri radiolojisi" kursu
2018-ci il ASYOD Antalyada təşkil etdiyi "Ulusal Ağciyər Sağlığı" konqresi
2018 -ci il ASYOD "Ulusal Ağciyər Sağlığı" konqresində "Tütün Kontrolü və Siqara Bıraktırma" kursu
2018-ci il Türk Toraks Dərnəyinin Antalyada təşkil etdiyi "Kış Okulunda" İştirak
2018-ci il Türk Toraks Dərnəyi Antalya 20 illik kongresi
2018-ci il ASYOD "Akciğer hastalıkları və yoğun bakım günləri; Tanı ve Tedavide son gelişmeler sempozyumu -3 "
2018-ci il Ağciyər Sağlıgı və Yoğun Bakım Dərnəyinin təşkil etdiyi Ulusal Ağciyər Sağlığı kongresi
2018-ci il Azərbaycan Respublikası Səhiyyə Nazirliyi Elmi-Tədqiqat Ağciyər Xəstlikləri İnstitutu "Tənəffüs orqanları xəstəliklərinin aktual problemləri"
2019-cu il ULUSAL AĞCİYƏR SAĞLIĞI kongresi
2019-cu il "Olgularla interstisial ağciyər xəstəlikləri" kursu
2022-ci il Türk Toraks Dərnəyi kongresi, Kəskin tənəffüs çatmazlığının idarə edilməsi', updated_at = NOW() WHERE slug = 'dr-esed-beydullayev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Mamalıq və Ginekologiya -Allgemeinen Krankenhaus Xəstəxanası, Qadın Doğum bölümü Avstriya, Vyana

İş təcrübəsi:
2007-2009 Assistent ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı
2014- Həkim-mama-ginekoloq, Mərkəzi Klinika Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-esmer-axundova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Klinik nevrologiya, Neyropsixologiya (EMG, EEG, Yuxu müayinələri) - Bakırköy Nevrologiya Mərkəzi, Türkiyə, İstanbul
Elektroensefoloqrafiya

İş təcrübəsi:
1992-2007 Həkim-nevropatoloq, 15 saylı Uşaq Poliklinikası, Azərbaycan, Bakı
2007- Həkim-nevropatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-esmira-hesenzade';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
0-18 yaşa kimi uşaqların qəbulu
Ümumi pediatrik baxış
Profilaktik baxışlar
Orqan sistemlərinə görə müayinə
İnfeksion xəstəliklərin diaqnostikası, müalicəsi
Allerqoloji və immunoloji qiymətləndirmə
Laborator və instrumental müayinələrin qiymətləndirilməsi
Kəskin və xroniki xəstəliklərin müalicəsi
Simptomatik və dəstəkləyici terapiya
Profilaktik müalicə və sağlamlıq izlənməsi
Valideyn maarifləndirilməsi

Konfranslar:
2019-cu ildə İnvestigator Meeting, preparat Avastin tədqiqatı, İstanbul
2022-ci ildə Rusiya Pediatrlar konqresi, Moskva
2023-cü ildə Dermatoloqların və Pediatrların Ümumrusiya elmi və praktik konfransı: Pediatriyada dermatoloji problemlər, Tatarıstan
2023-cü ildə Kəskin respirator xəstəliklər pediatriyada, Yaroslavl
2024-cü ildə Pediatr kvalifikasiya yüksəldmə təlimi, Sankt-Peterburq
2025-ci ildə Pediatr qebulu: 1 yaşa kimi uşağların müşahidəsi
2025-ci ildə Körpələrdə və azyaşlı uşağlarda qidalanma pozğunluqları kursu
2025-ci ildə Somatoform pozğunluqları pediatr praktikasında kursu', updated_at = NOW() WHERE slug = 'dr-ezize-sixveliyeva';
UPDATE doctor SET bio = 'Ümumi cərrahiyyə uzmanı.
Şöbə: Ümumi Cərrahiyyə', updated_at = NOW() WHERE slug = 'dr-fariz-huseynov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Terapiya - Şişli Etfal Eğitim və Araşdırma Hastanesi, Türkiyə, İstanbul
Revmatologiya - Uludağ Universiteti, Türkiyə, Bursa

İş təcrübəsi:
2003- 2007 Həkim -revmatoloq, Ailə Sağlamlıq Mərkəzi, Azərbaycan, Bakı
2007- 2008 Həkim -terapevt, İctimai Səhiyyə və İslahatlar Mərkəzi, Azərbaycan, Bakı
2010 Həkim-terapevt, Mərkəzi Klinika, Azərbaycan, Bakı
2024 Terapiya kafedrasi İ.M. Secenov adina Birinci Moskva Dovlet Tibb Universitetinin Baki filiali, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-fatime-efendiyeva';
UPDATE doctor SET bio = 'Pediatr.
Şöbə: Pediatriya

İş təcrübəsi:
2021-2023 - 17 saylı Şəhər Poliklinikası: Həkim-pediatr.', updated_at = NOW() WHERE slug = 'dr-fatime-qafarova';
UPDATE doctor SET bio = 'Dermatoveneroloq.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Ekzemalar
Psoriaz (pullu dəmrov)
Sızanaqlar (akne və rozasea)
Dərinin bakterial xəstəlikləri
Dərinin göbələk xəstəlikləri
Dərinin virus xəstəlikləri
Piqment xəstəlikləri
Müxtəlif tipli saç tökülmələri
Seboreya
Qırmızı-yastı, çəhrayı, əlvan dəmrov
Dırnaq xəstəlikləri və s.', updated_at = NOW() WHERE slug = 'dr-fatma-memmedli';
UPDATE doctor SET bio = 'Ailə həkimi-Terapevt, Check up üzrə mütəxəssis.

Fəaliyyət sahələri:
Yaş və risk qruplarına uyğun check-up müayinələrin təşkili
Qida borusu və mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi
QERX (Qastroezofageal reflüks xəstəliyi)
Barrett sindromu - Qida borusu selikli qişasında reflüksə bağlı dəyişikliklər
Kəskin və xroniki qastrit - Helikobakter Pilori infeksiyası ilə əlaqəli və ya digər səbəblərə bağlı mədə iltihabı
Mədə və 12 barmaq bağırsaq xorası
Funksional dispepsiya
Divertikulyar xəstəlik (divertikulit)
Qeyri-spesifik xoralı kolit və Kron xəstəliyi - İltihabi bağırsaq xəstəliklərinin diaqnostikası və müalicəsi
Bağırsaq disbakteriozu - Mikrobiom tarazlığının pozulması, şişkinlik və diskomfort
Psevdomembranoz kolit - Antibiotik istifadəsindən sonra yaranan ciddi bağırsaq infeksiyası
Qıcıqlanmış bağırsaq sindromu (qəbizlik, diareya ilə) - Stress, qidalanma və digər səbəblərlə əlaqəli bağırsaq hərəkətləri pozuntusu
Virus hepatitləri (A, B, C, D) - Yoluxma yollarına və forma görə fərqli yanaşma tələb edən infeksiyalar
Qeyri-alkoqollu steatohepatit (qaraciyər piylənməsi) - Metabolik sindrom və artıq çəki fonunda yaranan qaraciyər pozuntusu
Alkoqollu qaraciyər xəstəliyi - Uzunmüddətli spirtli içki istifadəsinin təsiri ilə yaranan dəyişikliklər
Autoimmun hepatit
Birincili biliar sirroz
Qaraciyər sirrozu - Qaraciyərin funksional toxumasının çapıq toxuması ilə əvəz olunması, qaraciyər çatışmazlığı riski
Lyambliyoz, askaridoz, enterobioz, toksokaroz və s. - Uşaqlarda və böyüklərdə tez-tez rast gəlinən helmint və protozoon infeksiyalar
COVID-19 sonrası və digər virus xəstəliklərindən sonra reabilitasiya - Ağciyər, ürək və sinir sistemində yaranmış qalıq təsirlərin dəyərləndirilməsi və bərpası
Hipertoniya, taxikardiya, aritmiya və digər dövran pozğunluqları
Bronxit, astma, pnevmoniya və digər ağciyər xəstəlikləri
Sidik yollarının infeksiyaları, sistit, pielonefrit və s. müayinə və müalicəsi

Konfranslar:
2013, 2018, 2023-cü illər- Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, sertifikasiya kursları
2015- ci il , "OEUK Registered Doctors Training"- Birləmiş Krallıq neft və qaz sənayesində registrasiya olunmuş həkimlərin təlim kursu , Aberdeen, UK
2018-ci il, - "Occupational Health in developing countries"- İnkişaf etməkdə olan ölkələrdə peşə sağlamlığı təlim kursu, Bergen Universiteti, Norveç', updated_at = NOW() WHERE slug = 'dr-fereh-memmedova';
UPDATE doctor SET bio = 'Cərrah-invaziv endoskopist.

Fəaliyyət sahələri:
Mədə-bağırsaq xəstəliklərinin müayinəsi, diaqnostokası və müalicəsi
Qastroskopiya
Kolonoskopiya
Mədə-bağırsaq qanaxmalarının dayandırılması
Mədə-bağırsaq poliplərinin çıxarılması
Mədə balonunun qoyulması
Mədə-bağırsaq Biopsiyalarının alınması
Qida borusunun kəskin varikoz qanaxmasının endoskopik band ligasiyası
Perkütan endoskopik gastrostomi (PEG)
İkiqat balonlu entereskopiya (Nazik bağırsağındiaqnostikası və müalicə vasitəsi ola bilər).

Konfranslar:
Uşaqlarda qastroezofageal reflu xəstəliyi multidissiplinar yanaşma
Endoskopiyada müasir texnologiyalar kolon endoskopiyasında müasir yanaşmalar və innovativ texnologiyalar
ABŞ milli xərçəng institunun beynəlxalq sağlamlıq mərkəzi
Ə.Əliyev adına adına Azerbaycan dövlət həkimləri təkmilləşdirmə inistutu (Umumi Cərrahiyyə)', updated_at = NOW() WHERE slug = 'dr-ferid-dunyamaliyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Tənəffüs sistemi xəstəlikləri
Həzm sistemi xəstəlikləri
Sidik-ifrazat sistemi xəstəlikləri
Hemodializ xəstələrində terapevtik problemlərin müayinə və müalicəsi
Anemiyalar

Konfranslar:
2006-2011 - ci illər - UNICEF-DSS proqramı çərçivəsində təlimlər
2018-2024 - cü illər - Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya-Modul 1-8
2018-2023 - cü illər - Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Nefrologiya kursları
2017-ci il - Bioloji Təbabət kursları
2020-ci il - II Milli Nefrologiya, Dializ və Transplantologiya konqresi
2022-ci il - Ümumdünya Böyrək Gününə həsr olunmuş konfrans
2023-cü il - SGLT 2 seminar
2023-cü il - Beynəlxalq Kardioloji Konfrans
2017-2024 - cü illər - Terapiya və Nefrologiya mövzusunda müxtəlif seminarlar', updated_at = NOW() WHERE slug = 'dr-ferqane-seferli';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Vaginoplastika
Labioplastika
Hudoplastika
Levatoroplastika
TOT əməliyyatı
Boru bağlama əməliyyatı
Laparoskopik əməliyyatlar
Laparotomik əməliyyatlar
Hamiləlik müayinə və müalicəsi
Miomların müayinə və müalicəsi
Polip müayinə və müalicəsi
Cinsi yolla yoluxan infeksiyaların müayinə və müalicəsi

Konfranslar:
Türkiyə Ok Meydanı Eğitim və Araşdırma hastanesi - Kurs Akuşer-Ginekologiyada anesteziya və intensive terapiya, teoriya və praktika. (2012)
Kursk Dövlət Tibb Universiteti - Histeroskopiya üzrə tam praktik təkminləşmə kursu. (2016)
Kursk Dövlət Tibb Universiteti - Kolposkopiya üzrə tam praktik təkminləşmə kursu. (2017)
Kursk Dövlət Tibb Universiteti - Operativ ginekologiyada laparoskopik cərrahiyyə kursu. (2018)
Rusiya Milli Tədqiqat Tibb Universiteti N.İ.Piroqov adına - Estetik ginekologiyadakı yeniliklər. Tam praktik təkminləşmə kursu. (2023)
Türkiyə və Rusiyada elmi praktiki müşavirə, toplantı və konferanslarda aktiv iştirakına görə bir çox sertifikatlar və qramotalarla təltif olunmuşdur.', updated_at = NOW() WHERE slug = 'dr-fexrende-resulova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Uşaq nevrologiyası - İstanbul Universitetinin Çapa Tibb Fakultəsi və Balıklı Rum Xəstəxanası, Türkiyə, İstanbul

İş təcrübəsi:
2006- Həkim-uşaq nevropatoloqu Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-fexriye-qedirova';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım şöbəsinin müdiri.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'dr-fexriyye-quliyeva';
UPDATE doctor SET bio = 'Тerapevt-Qastroenteroloq.

Konfranslar:
2018-ci ildə İstanbul şəhərində- Okmeydani Egitim ve Arastirma xəstəxanasında -Qastroenterologiya/Terapiya şöbəsində həkim-praktikant kimi fəaliyyət göstərmişdir.
2018-ci ildə İstanbul şəhərinin "Asya" özəl xəstəxanasında -Qastreoenterologiya-Endoskopiya və Terapiya şöbəsində həkim-praktikant kimi fəaliyyət göstərmişdir.
2019-ci ildə Ukraynanın Kiev şəhərinin -P. L. Supik adına Milli Tibb Lisansüstü Təhsil Akademiyasında (P.L.Shupik adına NMAPO)-Endoskopiya üzrə təkmilləşdirmə kursu bitirmişdir.
2021-ci il - Hərbi Tibb Lisansüstü Təhsil Akademiyasında -Qastroentereloqiya üzrə İxtisasi artirmaq,kurs,Ukrayna-Kiev şəhəri
2021 ci ildə İngiltərədə "Royal College of Physicians" (Королевская коллегия врачей) adına ali təhsil müəssəsində - "Qastroparez və funksional dispepsiya: patogenez və müalicənin özəllikleri" kursu
2021 ci ildə - Ukraynanın Kiev şəhərində-Hərbi Tibb Lisansüstü Təhsil Akademiyasında -Qastroentereloqiya üzrə İxtisasi artırmaq kursu.', updated_at = NOW() WHERE slug = 'dr-fidan-agazade';
UPDATE doctor SET bio = 'Hematoloq.
Şöbə: Hematologiya

Müalicə etdiyi xəstəliklər:
Anemiyalar
Polisitemiya
Trombositopeniya
Limfomalar
Çoxsaylı Mieloma
Leykemiya.

İş təcrübəsi:
Milli Hematologiya və Transfuziologiya Mərkəzi
2021 - TC İzmir Ege Üniversitesi Tıp Fakültesi Hastanesi: Hematoloji Bilim Dalı - 3aylıq təcrübə
2022 TC Erciyes Üniversitesi Tıp Fakültesi Hastanesi: Erciyes Transplant Merkezi - 5 aylıq təcrübə', updated_at = NOW() WHERE slug = 'dr-fidan-elesgerova';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuzluğun tam müayinəsi və müalicəsi
Yumurtlama funksiyasının yoxlanılması
Hamiləliyin təqibi
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi
Kolposkopiya
Endokrinoloji ginekologiya
Doğuş və ginekoloji cərrahi əməliyyatlar
Təbii doğuş və doğuşa hazırlıq
Keysəriyyə əməliyyatı (indikasiya olduqda)

Konfranslar:
2018-ci il Advanced Endoscopic surgery Hysteroscopy and Minimally Inivasive Surgery Academy
2018-ci il Pathogenesis and Management of Female Pelvic Floor Dysfunction Mediterranean Incontinence and Pelvic Floor Society
02.10.2024 - 06.10.2024-cü il Jinekoloji ve Obstetrikte Tartışmalı Konular Kongresi, Antalya, Türkiyə
19.10.2025 - 22.10. 2025-ci il ESGE 34th Annual Congress', updated_at = NOW() WHERE slug = 'dr-fidan-eliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Riskli hamiləlik təqibi
Təbii doğum
Keysəriyyə
Ginekoloji endokrinologiya
Menopauzal terapiya
Histeroskopiya

İş təcrübəsi:
2012 - Həkim-mama-ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-fidan-hesenova';
UPDATE doctor SET bio = 'Torakal cərrahiyyə uzmanı.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'dr-firdovsi-ferhadzade';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qida borusu və mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi
QERX (Qastroezofageal reflüks xəstəliyi)
Barrett sindromu - Qida borusu selikli qişasında reflüksə bağlı dəyişikliklər
Kəskin və xroniki qastrit - Helikobakter Pilori infeksiyası ilə əlaqəli və ya digər səbəblərə bağlı mədə iltihabı
Mədə və 12 barmaq bağırsaq xorası
Funksional dispepsiya
Divertikulyar xəstəlik (divertikulit)
Qeyri-spesifik xoralı kolit və Kron xəstəliyi - İltihabi bağırsaq xəstəliklərinin diaqnostikası və müalicəsi
Bağırsaq disbakteriozu - Mikrobiom tarazlığının pozulması, şişkinlik və diskomfort
Psevdomembranoz kolit - Antibiotik istifadəsindən sonra yaranan ciddi bağırsaq infeksiyası
Qıcıqlanmış bağırsaq sindromu (qəbizlik, diareya ilə) - Stress, qidalanma və digər səbəblərlə əlaqəli bağırsaq hərəkətləri pozuntusu
Virus hepatitləri (A, B, C, D) - Yoluxma yollarına və forma görə fərqli yanaşma tələb edən infeksiyalar
Qeyri-alkoqollu steatohepatit (qaraciyər piylənməsi) - Metabolik sindrom və artıq çəki fonunda yaranan qaraciyər pozuntusu
Alkoqollu qaraciyər xəstəliyi - Uzunmüddətli spirtli içki istifadəsinin təsiri ilə yaranan dəyişikliklər
Autoimmun hepatit
Birincili biliar sirroz
Qaraciyər sirrozu - Qaraciyərin funksional toxumasının çapıq toxuması ilə əvəz olunması, qaraciyər çatışmazlığı riski
Lyambliyoz, askaridoz, enterobioz, toksokaroz və s. - Uşaqlarda və böyüklərdə tez-tez rast gəlinən helmint və protozoon infeksiyalar
COVID-19 sonrası və digər virus xəstəliklərindən sonra reabilitasiya - Ağciyər, ürək və sinir sistemində yaranmış qalıq təsirlərin dəyərləndirilməsi və bərpası
Hipertoniya, taxikardiya, aritmiya və digər dövran pozğunluqları
Bronxit, astma, pnevmoniya və digər ağciyər xəstəlikləri
Sidik yollarının infeksiyaları, sistit, pielonefrit və s. müayinə və müalicəsi

Konfranslar:
2009-2010-cu illər Rusiya, Xalqlar Dostluğu Universiteti, Terapiya üzrə təlim
Bir çox xarici və yerli konfranslarda iştirak edilmişdir.', updated_at = NOW() WHERE slug = 'dr-govher-memmedova';
UPDATE doctor SET bio = 'Reanimatoloq.
Şöbə: Uşaq Reanimasiya', updated_at = NOW() WHERE slug = 'dr-goycek-memmedli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Anesteziya-Reanimasiya - Akdeniz Universiteti Tibb Fakultəsi Türkiyə, Antalya
Anesteziya-Reanimasiya - Ankara Universiteti Tibb fakultesi İbnSina hastanesi, Cebeci hasanesi, Türkiyə, Ankara

İş təcrübəsi:
2006 -2009 Həkim-anesteziloq, 15 sayli Tibbi sanitar hissə, Azərbaycan, Bakı
2009 - Həkim-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gulana-elekberova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Fizioloji və patoloji hamiləliklərin ilk gündən aparılması və müalicəsi
Təbii və fizioloji doğuşların aparılması
Qeysəriyyə kəsiyi əməliyyatının icrası
Hamiləliyin sonlandırılması (medikamentoz və cərrahi)
Kontrasepsiya (hamiləlikdən qorunma)
İnfeksion və qeyri infeksion mənşəli ginekoloji xəstəliklərinin müalicəsi
Qadın sonsuzluğunun müalicəsi

Konfranslar:
1983-ci ildə Rusiya Federasiyasının Penza şəhərində cərrahi mamalıq- ginekologiya kursu
1989-cu ildə ADHTİ, Cərrahi mamaliq- ginekoligiya kursu
1994-cü ildə ADHTİ, Mamalıqda fəsadlaşmış doğuşlar üzrə kurs
2000-ci ildə ADHTİ, Konservativ mamalıq və dölün antenatal mühafizəsi kursu
2005-ci ildə ADHTİ, Hamiləlik və ekstagenital mühafizəsi kursu
2010-cu ildə ADHTİ, RH(-) qanı olan qadınlarda antenatal qulluq və doğuşun aparılması kursu
2012-ci ildə ADHTİ, Mamalıq və ginekologiyada patoloji vəziyyətlər
2017-ci ildə ADHTİ, Mamalıq və ginekoligiyada endokrinoloji problemlər üzrə kurs
2022-ci ildə ADHTİ, Sonsuzluq, ailə planlanması və qadın sağlamlığı üzrə kurs', updated_at = NOW() WHERE slug = 'dr-gulare-seydayeva';
UPDATE doctor SET bio = 'İnvaziv-kardioloq.
Şöbə: Kardiologiya', updated_at = NOW() WHERE slug = 'dr-gulay-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hər növ pediatrik xəstəliklərin müayinə və müalicəsi (0-18 yaş)
Anemiya (qanazlığı) və immun zəifliyi
Yenidoğulmuşlara baxış
Uşaqlarda çəki azlığı və yaxud artıqlığı
Usaqlarda Fiziki inkişafın, boy çəkinin ləngiməsi
Uşaqlarda diqqət dağınıqlığı, yaddaş və yuxu pozulması
Tənəffus Sistemi xəstəlikləri
Allergik xəstəliklər(dəri,bronx, bağırsaq tipi)
Qurd və parazit xəstəlikləri.
Mədə-bağırsaq xəstəlikləri (qəbizlik,ishal)
Usaqlarda qıcıqlanmış bağırsaq xəstəliyi.
Usaqlarda Sidik yolları xəstəliyi
Limfa sistemi xəstəlikləri
Uşaqlarda revmatizm
Uşaq və Yeniyetmələrin ginekoloji problemləri.
Zəli terapiya
Ozon terapiya
PRP
SMBT terapiya

Konfranslar:
2012-2023-cü illər Padiatriya üzrə Sertifikasiya kursları
II Beynəlxalq Uşaq xəstəlikləri və Cərrahiyyə Simpozium
Xroniki toksisitə və IV Tədavilər eğitim proqramı
EKQ üzrə intevsiv təlim
Xroniki xəstəliklərin müalicəsində U-sin 5element nəzəriyyəsinin tətbiqi
Madera firmasinin"Vaxtından qabaq və yenidoğulmuşların ana südü ilə qidalanması"Lıppstadt Almaniya 2019
Isopatiya və Sanum terapiya seminarı
Toksınlərin xroniki xəstəliklərin patogenezində rolu, müasir diaqnostik və terapevtik metodlarla toksinlərin eliminasiyası.
Segmental Metamerik Bıoregulyator terapiya
2012,2018,2022-ci illərdə Ə,Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda kurslarında iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-gulbaci-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Tibbi Laboratoriya

Fəaliyyət sahələri:
Klinik laborator diaqnostika - Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Terapiya kafedrası, Azərbaycan, Bakı
Trima Accel Aferez cihazı təlimi - Hisar Intercontinental Hospital, Türkiyə, İstanbul

İş təcrübəsi:
1995-2001 Həkim-laborant, AR Səhiyyə Nazirliyi 4-cü Baş idarənin 1 saylı Xəstəxanası, Azərbaycan, Bakı
2001- Həkim-laborant Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gulcin-qafarova';
UPDATE doctor SET bio = 'Dietoloq.
Şöbə: Somatika və STROK Mərkəzi

İş təcrübəsi:
2006-2009- A.F. Qarayev adına 2 saylı Uşaq Klinik Xəstəxanası: Kiçik tibb işçisi
2009-2010-Akademik Zərifə Əliyeva adına Milli Oftalmologiya Mərkəzi: Pəhriz tibb bacısı
2016-2021- Müharibə Veteranları Respublika Xəstəxanası: Həkim-dietoloq', updated_at = NOW() WHERE slug = 'dr-gulnar-abdullayeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Ginekoloq.

Fəaliyyət sahələri:
Ginekoloji müayinə
Uşaqlıq boynu patologiyalarının diaqnostika və müalicəsi
Kolposkopiya
Histeroskopiya
Uşaqlıq borularının müayinəsi
Yumurtalıq kistalarının laparoskopik çıxarılması
Vaginoplastika, perineoplastika
Sonsuzluğun və təkrarlanan düşüklərin müalicəsi
Təbii doğuş və qeysəriyyə', updated_at = NOW() WHERE slug = 'dr-gulnar-ibrahimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal
Süd vəzinin ultrasəs müayinəsi
Tiroid vəzinin ultrasəs müayinəsi
Limfa düyünləri ultrasəs müayinəsi
Uroloji və ginekoloji
Obstetrik
Doppler
Renal doppler
Dərialtı yumşaq toxumaların ultrasəs müayinəsi
Pediatrik USM
Uşaqlarda bud-çanaq oynağının ultrasəs müayinəsi
Yenidoğulmuşlarda neyrosonoqrafiya

Konfranslar:
2008-2009-cu illər - Türkiyə, İzmit, Kocaeli Universiteti, Tibb fakültəsi xəstəxanası, Radyoloji ana bilim dalı USM üzrə təlim
2019-cu il - Türkiyə, Ankara, Hacettepe Universiteti, Tibb fakültəsi xəstəxanası, Radyoloji ana bilim dalı USM üzrə təlim', updated_at = NOW() WHERE slug = 'dr-gulnar-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyə hazırlıq
Hamiləliyin idarə edilməsi
Sonsuzluğun diaqnostikası və müalicəsi
Cinsiyyət orqanlarının iltihabi xəstəliklərinin diaqnostikası və müalicəsi
Menstruasiya pozuntuları
Polikistoz yumurtalıq sindromu, endometriozun müalicəsi
Menopozal pozğunluqların müalicəsi
Süd vəzi xəstəliklərinin diaqnostikası və müalicəsi
Trombofiliya ilə hamiləliyin idarə edilməsi
EKO proqramı çərçivəsində hamiləliyə hazırlıq

Konfranslar:
"Ginekologiyada diaqnostik, terapevtik və operative endoskopiya" proqramına uyğun olaraq - Laparoskopiya və Histeroskopiya seminarı
"Mamalıq və ginekologiyada ekstrogenital patologiya" seminarı
"Mamalıq və ginekologiyada təcili yardım və reanimasiya" seminarı
"Fotona aparatı ilə stres sidik qaçırmanın lazerlə korreksiyası" seminarı
"Ginekoloji endokrinoloqlar" seminarı
"Uşaq ginekologiyası" seminarı', updated_at = NOW() WHERE slug = 'dr-gulnare-eyvazova';
UPDATE doctor SET bio = 'Otorinolarinqoloq.

Fəaliyyət sahələri:
Adenoid vegetasiyası (adenoidlərin hipertrofiyası)
Otit, o cümlədən tubo-otit
Eşitmə borusu və orta qulaq xəstəlikləri
Tonzillit, faringit, laringotraxeit, həmçinin farenks və larinqsin digər xəstəlikləri
Sinusit, o cümlədən təkrarlanan sinusit və paranazal sinusların digər xəstəlikləri
Eşitmə pozğunluğu (karlıq və eşitmə itkisi)
Burun boşluğunun xəstəlikləri (müxtəlif etiologiyalı rinitlər)
Xorultu və apnoe
Böyüklərin və uşaqların QBB orqanlarının endoskopik müayinəsi
Burun qanaxmalarının saxlanılması
Badamcıq lakunalarının yuyulması
Boğazın arxa divarı follikullarının dağlanması
Xarici qulaq keçəcəyindən, burun boşluğundan və boğazdan yad cismin çıxarılması
Qulaq kiri tıxacının xaric edilməsi
Burun septumunun absesi və hematomasının açılması
İrinləmiş badamcıq kistasının açılması
Paratonzilyar absesin yarılması
Burun və xarici qulaq keçəcəyi furunkulunun, qulaq seyvanı hematomasının açılması

Konfranslar:
2008-ci il - «Фармакотерапия болезней уха, горла и носа с позиции доказательной медицины», Moskva şəhəri
2010-cu il - Ежегодная конференция Российского Общества Ринологов, Yaroslavl şəhəri
2022-ci il - Türk Rinoloji Konqresi, Ulusal Baş Boyun Cərrahisi Konqresi və Çocuk Kulak Burun Boğaz ve Baş Boyun Cerrahisi Konqresi, Ankara şəhəri
2022-ci il - Azərbaycan Otorinolarinqoloqlar Cəmiyyətinin 1-ci Beynəlxalq Konqresi, Bakı şəhəri
2024-cü il - EAO Otorinolarinqoloqların Avrasiya Assambleyasının 8-ci Beynəlxalq Konqresi
2024-cü il - Estetik blefaroplastika üzrə canlı cərrahiyyə master-klası, Bakı şəhəri
2024-cü il - Göz qapağı cərrahisi üzrə təlim kursu, Ankara - Medipark Tıp Merkezi
2024-cü il - Botoks-dolğu tətbiqi üzrə təlim kursu, Ankara', updated_at = NOW() WHERE slug = 'dr-gulnare-quliyeva';
UPDATE doctor SET bio = 'Pediatr, Referans Nəsimi filialının Baş həkimi.

Fəaliyyət sahələri:
Yuxarı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Rinofarenxit, angina, otit, sinusit və s.)
Aşağı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Bronxit, bronxiolit, sətəlcəm və s.)
Mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi (Qəbizlik, ishal, dispepsiya, qastroenterit, qida intoleransları)
Qurd və parazitar xəstəliklərin müayinə və müalicəsi (Lyambliyoz, askaridoz, enterobioz və s.)
Uşaq infeksion xəstəliklərinin müayinə və müalicəsi (Qızılca, məxmərək, su çiçəyi, razeola infantum, parotit və s.)
Uşaqlarda İmmunitet pozğunluqlarının diaqnostikası və müalicəsi
Yenidoğulmuşların və körpələrin rutin tibbi müşahidəsi (İnkişafın izlənməsi, qidalanma, reflekslər, boy-çəki dinamikası)
Uşaqlarda peyvəndlərin tətbiqi və nəzarəti (Milli peyvənd təqviminə uyğun vaksinasiya və izləmə)
Uşaqlarda Defisit vəziyyətlərin və mikroelement çatışmazlıqlarının dəyərləndirilməsi
Alergik xəstəliklər və atopik halların diaqnostikası və müalicəsi (Atopik dermatit, qida allergiyası, allergik rinit)
Uşaq endokrinoloji problemlərinin ilkin aşkarlanması (Boy geriliyi, piylənmə, erkən və gecikmiş yetkinlik)

Konfranslar:
2015-ci il EGE Universitetində Pediatriya və Nevrologiya üzrə seminar.
2017-ci il Yeditepe Universitetində Talassemiya xəstəliyi üzrə seminar.
2017-ci il Phadia 250 tərəfindən keçirilən "Allerqologiyada Molekulyar Diaqnostika" seminarı.
2018-ci ildə Pediatriya üzrə Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu.', updated_at = NOW() WHERE slug = 'dr-gulsen-hesenova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Exokardioqrafiya və Kardiak KT angioqrafiya - Kartal Koşuyolu Yüksək İxtisas Təhsil və Araşdırma Xəstəxanası, Türkiyə, İstanbul
Kardiak(ürək) BT Anjo, Koronar BT Anjo - Fatih Universiteti, Türkiyə,İstanbul
Ürək Yetməzliyi və Kardiak görüntüləmə - Xorvatiya, Zaqreb
Kardiak KT angioqrafiya təlimi - Medmar Görüntüləmə, Türkiyə, İstanbul
2012, Yanvar - Avqust Ümumi kardiologiya və exokardioqrafiya 9 Eylül Universitet Xəstəxanası,Türkiyə, İzmir
2012-2015, Avropadan həkimlərlə dövlət reszidenturasına alternativ təhsil proqramı, Azərbaycan, Bakı
2014, İyun- Oktyabr Kardiak KT angioqrafiya təlimi Kartal Koşuyolu Yüksək İxtisas Xəstəxanası və Medmar Görüntüləmə, Türkiyə, İstanbul
2016, May-Oktyabr Kardiak KT angioqrafiya təlimi Erlangen Universiteti, Almaniya
2019, may Ürək Yetməzliyi və Kardiak görüntüləmə treyninq, Xorvatiya, Zaqreb
2023, Dekabr Kardiak KT angioqrafiya təlimi Medmar Görüntüləmə, Türkiyə, İstanbul
2025, Sentyabr Kardiak KT angioqrafiya təlimi Medmar Görüntüləmə, Türkiyə, İstanbul
2025, Dekabr, Avropa Kardiak Goruntuleme konfransi ve Kardiak KT angio work shoplari, Avstriya, Vyana

İş təcrübəsi:
2011-2012 Həkim-kardioloq, Oksigen klinikası, Azərbaycan, Bakı
2012-2015 Həkim-kardioloq, Xüsusi Müalicə Sağlamlıq Kompleksi, Azərbaycan, Bakı
2015 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gulsen-suleymanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya - Mehmet Akif Ersoy Göğüs Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul
İnvaziv kardiologiya

İş təcrübəsi:
2025- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gulsenem-allahyarli';
UPDATE doctor SET bio = 'Həkim-mikrobioloq.', updated_at = NOW() WHERE slug = 'dr-gultekin-ceferova';
UPDATE doctor SET bio = 'Uzman terapevt.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Hipertenziya
Hiperlipidemiya
Tiroid (qalxanabənzər vəzi) xəstəlikləri
Şəkərli diabet
Osteoporoz
Bronxial astma
Xroniki obstruktiv ağciyər xəstəliyi
Anemiyalar
Revmatoid artrit
Qaraciyər xəstəlikləri.

İş təcrübəsi:
2021-2023 - Respublika Diaqnostika Mərkəzi: Həkim-terapevt
2023 - Yeni Klinika: Həkim-terapevt.', updated_at = NOW() WHERE slug = 'dr-gulxar-suleymanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2001-2012 Həkim, Ailə Planlaşdırma Mərkəzi, Azərbaycan, Bakı
2012-2014 Həkim, Elmi-Tedqiqat Mamalıq və Ginekologiya institutu, Azərbaycan, Bakı
2014 Həkim - Embrioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gulzade-kerimova';
UPDATE doctor SET bio = 'ümumi cərrah, transplantoloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Qaraciyər və böyrək transplantasiyası
Qaraciyər və öd yolları əməliyyatları(xoş və bədxassəli şişlər, kistlərin rezeksiyası)
Mədəaltı vəzi əməliyyatları
Dalaq əməliyyatları
Böyrəküstü vəzi əməliyyatları
Mədə və bağırsaq əməliyyatları
Öd kisəsi əməliyyatı
Qarın boşluğu yırtıqları.

İş təcrübəsi:
2018-2023 "Bona dea İnternational hospital" ümumi və transplantasiya cərrahı
2023-cü ildən Yeni klinikada ümumi və transplantasiya cərrahı.

Kurslar:
Ondokuzmayis Üniversitesi Tıp Fakültesi Hastanesi Genel Cerrahi Anabilim Dalında staj 23.07.2010-20.08.2010
Koç University Hospital , Organ Transplantation Clinical Observership Program between 01 October-01 November 2019
International Visiting Scholars Training Program at the Division of Liver Transplantation and Hepatobiliary Surgery at Asan Medical Center, Seoul, South Korea, from October 11,2022 to November 11,2022.
5th Congress of International Advanced HBP Surgery October 18 (Wed) - 21 (Sat), 2023 at Kongresshaus Zurich, Switzerland.
2024-completed Belt and Road İnitiative Liver Minimally İnvasive Technology İnternational Training Course. March 31.2024-April 20.2024 at West China Hospital of Sichuan University. Laparoscopic training course January 25th to 29th 2025 World
Laparoscopy Training Institute Dubai Healthcare City, Dubai, UAE
Fellowship in minimal access surgery on Wednesday 29th January 2025 at Clinical Surgical Training Center, University of Sharjah ,UAE.
MEMBERSHIP of WORLD ASSOCIATION OF LAPAROSCOPIC SURGEONS since 29.01.2025 lifetime', updated_at = NOW() WHERE slug = 'dr-gunay-allahverdiyeva';
UPDATE doctor SET bio = 'Otorinolorinqoloq.

Fəaliyyət sahələri:
Otitlərin (qulaq iltihabları) müalicəsi
Qulaqdan yad cisimlərin çıxarılması
Qulaq kiri tıxacının təmizlənməsi
Otomikoz (qulaqda göbələk infeksiyası) müalicəsi
Vazomotor və allergik rinitlərin müalicəsi
Sinusitlərin (haymorit və s.) müalicəsi
Kəskin və xroniki tonzillitlərin, laringitlərin, faringitlərin müalicəsi

Konfranslar:
2022-ci il - AOS A CASOS 1st CONGREES ORL 2022
2023-cü il - 2-ci Otorinolarinqoloji simpozium
2025-ci il - Azərbaycan Otorinolorinqologiya Cəmiyyətinin III Beynalxalq', updated_at = NOW() WHERE slug = 'dr-gunay-babayeva';
UPDATE doctor SET bio = 'Kardioloq, Avropa və Azərbaycan kardiologiya cəmiyyətinin üzvü.

Fəaliyyət sahələri:
Hipertoniya və Hipotoniyanın müayinə və müalicəsi
Təzyiqin gündəlik monitorinqi (Holter AT)
Ürəyin işemik xəstəliyi (ÜİX)
Miokard infarktından sonrakı vəziyyətlərin izlənməsi
Ritm pozuntuları (Aritmiyalar) - Bradikardiya, taxikardiya
Extrasistoliya, fibrilyasiya
24 saatlıq EKQ Holter monitorinqi
Kəskin və ya xroniki ürək çatışmazlığı
Ürək əzələsinin zəifləməsi
Ödem, nəfəs darlığı, zəiflik kimi əlamətlərlə mübarizə
Mitral klapan çatışmazlığı və ya daralması
Aortal stenoz və ya çatışmazlıq
Uşaqlarda və yeniyetmələrdə aşkar edilən ürək qüsurları
Miokardit (ürək əzələsinin iltihabı)
Perikardit (ürək qişasının iltihabı)
Kardiomiyopatiyalar
Dislipidemiya və metabolik risklər
Ateroskleroz riski olan xəstələrin müayinəsi və müalicəsi
Stress fonunda və psixosomatik ürək şikayətləri
Sinir mənşəli ürəkdöyünmələr, təngnəfəslik hissi
Panik atak və streslə bağlı kardial simptomlar
Ürəyin check-up proqramları
Risk faktorlarının qiymətləndirilməsi (ailəvi tarix, diabet, piylənmə və s.)

Konfranslar:
2014-2022 ci illər hər il keçirilən Azərbaycan Kardilogiya Cəmiyyətinin Milli Kongresi
2017-ci il Türk Dünyasının Kardioloji Birliyinin Bahar Simpoziumu
2018-ci il 6th World Heart Failure Congress
2019-cu il Biolux -randomizə kontrollu tədqiqatın tərəfimdən izahı
2022-ci il Ürək Çatışmazlığında Yeniliklər Kongresi', updated_at = NOW() WHERE slug = 'dr-gunay-meherremzade';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Oftalmoloq.

Fəaliyyət sahələri:
Bütün növ göz xəstəliklərinin müayinə və müalicəsi
Çəpgözlük (Strabismus) müalicəsi
Gözün ultrasəs müayinəsi
Göz dibinin müayinəsi
Kataraktanın müalicəsi
Buynuzlu qişanın topoqrafiyası
Göz quruluğunun testi
Göz daxili təzyiqin ölçülməsi
Göz daxili inyeksiya
Göz dibnin floresan angioqrafiyası
Halazion müalicəsi
Yaş yollarının zodlanması
Göz daxili şişlərin müalicəsi', updated_at = NOW() WHERE slug = 'dr-gunay-memmedli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

İş təcrübəsi:
2021 - Həkim-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gunay-salahova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Nevroloq.', updated_at = NOW() WHERE slug = 'dr-gunay-verdiyeva';
UPDATE doctor SET bio = 'Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin planlaşdırılması və izlənməsi.
Təbii və qeysəriyyə yolu ilə doğuş.
Sonsuzluğun diaqnostika və müalicəsi.
Vaginizmin diaqnozu və psixoterapevtik müalicəsi.
Estetik və rekonstruktiv ginekoloji əməliyyatlar.
Histeroskopiya (uşaqlıq daxilinin optik müayinəsi).
Miomektomiya (uşaqlıq miyomalarının çıxarılması).
Genital infeksiyaların diaqnostika və müalicəsi.
Ginekoloji ultrasəs müayinəsi (USM).
Müasir kontraseptiv metodların seçimi və tətbiqi.
O Shot (intim gəncləşdirmə və funksional dəstək).
G Shot (həssaslığın artırılması proseduru).', updated_at = NOW() WHERE slug = 'dr-gunay-xelilova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Həzm sistemi xəstəliklərinin müayinəsi və müalicəsi
Qida borusunun xəstəlikləri
Qastroezofageal reflüks xəstəliyi (QERX)
Barrett sindromu
Ezofagit (iltihab), striktura və divertikullar

Konfranslar:
2017-ci il I Endoacopik Forum The National Centre of Oncology
2018-ci il APASL STC Delta Hepatitis
2019-ci il XVIII İNTERNATİONAL Euroasian Congress Of Sergey and Hepatogastoenterology
2020-ci il World Obesity Day
2022-ci il TASL&AGHA JOINT Liver Meeting
2023-ci il İNTERNATİONAL Patient Proqram Hepatopan reatobiliaty Diseases
2024-cü il The Silent Tsunami MAFLD', updated_at = NOW() WHERE slug = 'dr-gunay-zeynalova';
UPDATE doctor SET bio = 'İnfeksiya Nəzarət Komissiyasının sədri.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Klinik Kardiologiya və Exokardioqrafiya, Ankara Universiteti, Türkiyə, Ankara
Kardioreanimasiya və Exokardioqrafiya,Gazi Universiteti, Türkiyə, Ankara
Transezofagial Exokardioqrafiya, Dr. Siyami Ersek Göğüs Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul

İş təcrübəsi:
2009 - Həkim - kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı
2025 - İnfeksiya Nəzarət Komissiyasının sədri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gunel-abdiyeva';
UPDATE doctor SET bio = 'Konfranslar:
2010-2014-cü illər MedServis və Medera hospital özəl xəstəxanaları, Ultrasəs müayinəsi üzrə ixtisas artırma kursları.
2007 - 2008-ci illər - Ə.Qarayev adına 2 nömrəli klinik uşaq xəstəxanası, Şüa diqanostika üzrə İnternatura kursu.', updated_at = NOW() WHERE slug = 'dr-gunel-babayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Laboratoriya işi', updated_at = NOW() WHERE slug = 'dr-gunel-ehmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Uşaq cərrahiyyəsi

Fəaliyyət sahələri:
Uşaq cərrahiyyəsi və urologiyası - Bursa Uludağ Universiteti, Türkiyə, Bursa

İş təcrübəsi:
2011- Həkim-uşaq cərrahı, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gunel-emiraslanova';
UPDATE doctor SET bio = 'Revmatoloq.
Şöbə: Radiologiya', updated_at = NOW() WHERE slug = 'dr-gunel-esgerova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Urologiya

İş təcrübəsi:
2019 - Həkim -uroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-gunel-ferruxzade';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet və metabolik pozğunluqlar (Tip 1, Tip 2, hestasion diabet, prediabet, metabolik sindrom)
Qalxanabənzər vəzi xəstəlikləri (Hipotireoz, hipertireoz, Haşimoto, Qreyvs, düyün və zoblar)
Hipofiz vəzinin xəstəlikləri (Akromeqaliya, giqantizm, prolaktinoma və digər şişlər)
Böyrəküstü vəz xəstəlikləri (Addison, Kuşinq sindromu, feoxromositoma)
Sümük və kalsium metabolizmi pozğunluqları (Osteoporoz, paratireoid vəz problemləri)
Vitamin D çatışmazlığı
Reproduktiv hormonal pozğunluqlar (PCOS, aybaşı pozğunluqları, sonsuzluğun hormonal səbəbləri)
Piylənmə və metabolik problemlər
Endokrin şişlər

Konfranslar:
ARDMS - Sonography Principles and Instrumentation (SPI) Certification American Registry for Diagnostic Medical Sonography (05.05.2021 - 23.10.2021)
Diagnostic Medical Ultrasound Training Medical Educational Center, Illinois, ABŞ (01.05.2018 - 25.08.2019)
Daxili Xəstəliklər kursu Wisconsin Medical College, Daxili Xəstəliklər şöbəsi (03.01.2018 - 03.05.2019)
3rd Azerbaijan EASD Postgraduate Education Course European Association for the Study of Diabetes (EASD) (08.12.2016 - 10.12.2016)
Ümumdünya Qalxanabənzər Vəzi Günü tədbiri Respublika Endokrinoloji Mərkəzi (25.05.2015 - 27.05.2015)
2nd EASD Postgraduate Education Course European Association for the Study of Diabetes (EASD)
(10.04.2014 - 12.04.2014)
Diabetes Mellitus in Children and Adolescents - ISPAD Workshop (14.02.2013 - 15.02.2013)
IV Azərbaycan Milli Allerqologiya, İmmunologiya və İmmunoreabilitasiya Konqresi Allerqologiya, İmmunologiya və İmmunoreabilitasiya Elmi Cəmiyyəti (19.10.2012 - 20.10.2012)
Uluslararası Acil Tıp Simpoziumu Azərbaycan Tibb Universiteti (13.04.2012 - 15.04.2012)', updated_at = NOW() WHERE slug = 'dr-gunel-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal USM (uşaqlarda və böyüklərdə)
Qalxanvari vəz (thyroid) USM
Süd vəzi USM
Ginekoloji USM (transabdominal və transvaginal)
Follikulometriya
Hamiləliyin təyini
Erkən hamiləlik USM
Hamiləliyin skrininqi , dopplerometriya və 3D/4D ilə (1-ci skrining 11-14 həftə, 2-ci skrininq 18-21 həftə, 3cü skrininq 28-31 həftə)
Yumşaq toxuma USM
Limfa düyünləri USM
Uşaqlarda neyrosonoqrafiya
Uşaqlarda bud-çanaq USM

Konfranslar:
2011-2012-ci illər V.İ.Kulakov adına mamalıq, ginekologiya və perinatologiya elmi mərkəzində ginekoloji və obstetrik ultrasəs müayinəsi üzrə ixtisasartırma kursu.
Bir çox ölkədaxili və beynəlxalq konfranslarda iştirak edib.', updated_at = NOW() WHERE slug = 'dr-gunel-miriyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyin təqibi
Təbii doğuşların aparılması və qeysəriyyə əməliyyatı
Sonsuzluq, qadin hormonal problemləri
Genital infeksiyaların müalicəsi
Qadın cinsiyyət üzvlərinin iltihab xəstəlikləri
Vaginizm müalicəsi
PRP terapiya (Trombosit zənqin plazma)
Klimaterik dövr problemlərin müalicəsi
Hamiləlikdən qorunma üsulları və tətbiqi ( uşaqlıq daxili vasitənin qoyulması və çıxarılması "spiral", dərialtı implantların qoyulması)
Laparoskopik əməliyyatlar
Ginekoloji əməliyyatlar
Estetik ginekologiya', updated_at = NOW() WHERE slug = 'dr-gunel-necefli';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Radiologiya

İş təcrübəsi:
2022 - Yeni Klinika, Radiologiya şöbəsi: Həkim-radioloq.', updated_at = NOW() WHERE slug = 'dr-gunel-rzazade';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Baş ağrıları (Miqren, GTB, KTB, Qarışıq növ baş ağrısı)
Baş gicəllənmələri (Vertiqo, dizziness)
Kəskin beyin qan dövranının pozulmaları (insultlar,TİA,QTA)
Sinir sisteminin neyrodegenerativ xəstəlikləri
Panik Atak, depressiyalar, OKP
Polineyropatiyalar
Disk yırtıqlarının nevroloji fəsadları (mielopatiyar,radikulopatiyalar)
Demensiyalar
Epilepsiyalar
Dağınıq skleroz
Üz siniri iflici

Konfranslar:
2019-cu il "l Azərbaycan uşaq nevroloqlarının" konqresi.
2021-ci il "lll Beynəlxalq Türk Dünyası dağınıq skleroz" konqresi.
2021-ci il 57-ci Ulusal neyroloji konqresi, Antalya şəhəri.
2023-cü il "V Beynəlxalq Türk dünyası dağınıq skleroz" konqresi, Bakı şəhəri.
2023-cü Bakı şəhəri Vagal nerve stimulation in epilepsy patients.(VNS summit)-Epilepsiya xəstələrində azan sinir stimulyasiyasi.', updated_at = NOW() WHERE slug = 'dr-hecer-allahverdiyeva';
UPDATE doctor SET bio = 'Kardioloq-Revmatoloq.

Fəaliyyət sahələri:
Ürək-damar sistemi xəstəlikləri
Hipertoniya
Ürək çatışmazlığı
Ürəyin ritm pozğunluğu
Aritmiyalar
Stenokardiya
Revmatizm
Revmatoid artrit, poliartrit
Artrozlar
Osteoporoz
Autoimmun xəstəliklər.', updated_at = NOW() WHERE slug = 'dr-hecer-memmedova';
UPDATE doctor SET bio = 'Pediatr, yoluxucu xəstəliklər üzrə mütəxəssis.

Fəaliyyət sahələri:
Yenidoğulmuş dövründən 18 yaşadək uşaqların müayinəsi
Planlı tibbi müayinələrin aparılması, uşaqların fiziki və psixomotor inkişafının qiymətləndirilməsi
Ana südü ilə qidalanma, süni qidalanma, əlavə qidalara keçid və böyük yaşlı uşaqların qidalanması üzrə məsləhətlərin verilməsi
Yenidoğulmuşlara qulluq, gün rejimi, orqanizmin möhkəmləndirilməsi və raxit kimi defisit hallarının profilaktikası
Kəskin ambulator xəstəliklərin, o cümlədən kəskin respirator xəstəliklərin, mədə-bağırsaq infeksiyalarının, kəskin otitlərin, anginanın və s. diaqnostikası və müalicəsi
Xroniki xəstəlikləri olan uşaqların, o cümlədən bronxial astma, atopik dermatit, MƏT və böyrək patologiyalarının izlənməsi və müalicəsinin aparılması
Təcili hallarda, o cümlədən yüksək qızdırma, qıcolmalar, allergik reaksiyalar və dehidratasiya zamanı ilkin tibbi yardımın göstərilməsi və müalicənin təyin edilməsi
Müxtəlif mənşəli anemiya (qan azlığı) hallarının aşkarlanması və müalicəsi
Vitamin və mineral çatışmazlıqlarının müəyyən edilməsi və müalicəsi
Müxtəlif infeksion xəstəliklərin, o cümlədən qızılca, suçiçəyi, məxmərək, epidemik parotit, altıncı xəstəlik, skarlatina, Epşteyn-Barr virusu mənşəli xəstəliklər, Koksaki infeksiyası və sidik yolu infeksiyalarının diaqnostikası və müalicəsi
Parazitar invaziyaların, o cümlədən lyamblioz, amebiaz, enterobioz və askaridozun diaqnostikası və müalicəsi
Rutin illik analizlərin və instrumental müayinələrin təyin edilməsi, nəticələrin qiymətləndirilməsi və aşkarlanan problemlərə uyğun müalicənin aparılması
Uşaqların dar ixtisas həkimlərinə - nevroloq, allerqoloq, kardioloq, cərrah və digər mütəxəssislərə vaxtında yönləndirilməsi və onların tövsiyələrinin koordinasiyası', updated_at = NOW() WHERE slug = 'dr-hemid-haciagayev';
UPDATE doctor SET bio = 'Uroloq.
Şöbə: Urologiya

İcra etdiyi əməliyyatlar:
Nefrektomiya - böyrəyin çıxarılması (açıq və laparoskopik - qapalı)
Parsial nefrektomiya (böyrəyin hissəvi rezeksiyası)
Pieloplastika - böyrək ləyəni daralmasının ləğvi (açıq və qapalı)
Pielolitotomiya - böyrək ləyəni daşının çıxarılması (açıq və qapalı)
Perkutan nefrolitotriosiya - PNL (qapalı böyrək daşı çərrahiyyəsi)
Böyrək kistası rezeksiyası (açıq və qapalı)
Sidik axarı daşı əməliyyatları (açıq və qapalı)
Sidik kisəsinin daş və ya törəməyə görə açıq və qapalı (TUR) əməliyyatları
Radikal sistektomiya (sidik kisəsinin tamının çıxarılması) və yeni sidik yollarının yaradılması
Prostat vəzinin açıq və qapalı (TUR) əməliyyatları
Radikal prostatektomiya (prostat şişinə görə prostat vəzinin tamının çıxarılması)
Sidik kanalının açıq və qapalı (endoskopik) əməliyyatları
Varikoselektomiya (genişlənmiş xaya damarlarının ləğvi)
Xaya və xayalıq əməliyyatları
Cinsi alət (penis) üzərində və digər androloji əməliyyatlar
Qadınlarda sidik qaçırmasına görə asqı (TOT) əməliyyatı
Qadınlarda sidik kisəsi sallanması (sistosel) təmiri
Qadınlarda sidik kanalı ağzının polipinin (karunkul) kəsilməsi

İş təcrübəsi:
2018-2020 - Uniklinik Minden: Uzman həkim
2020-2022 - Lohne Hospital: Şöbə müdiri (Oberarzt)', updated_at = NOW() WHERE slug = 'dr-hemzet-cigerov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləlik, hamiləlik təqibi
Normal doğum
Ağrısız doğum
Cərrahi doğum - Qeysəriyyə əməliyyatı
Hamiləlikdən qorunma üsulları və tətbiqi ( uşaqlıq daxili vasitənin qoyulması və çıxarılması "spiral", dərialtı implantların qoyulması
Uşaqlıq boruların bağlanması
Genital infeksiyaların müayinəsi və müalicəsi
Sonsuzluq, qadın hormonal problemləri
Qadın cinsiyyət üzvlərinin iltihab xəstəlikləri
Klimakterik dövr problemləri və onların müayinəsi, müalicəsi
Ginekoloji chek-up
Genital PRP (Trombosit Zangin Plazma)
Kolposkopiya
Estetik ginekoloqiya

Konfranslar:
Müxtəlif illərdə ixtisas artımı kursları (kolposkopiya,estetik ginekologiya və s.) keçmişdir.
Bir çox elmi praktiki konfranslar və seminarlarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-heyat-namiq-qizi';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Şüa diaqnostika

Fəaliyyət sahələri:
İnvaziv radiologiya
İnvaziv neyroradiologiya
İnvaziv onkologiya

İş təcrübəsi:
2008 - 2009 Təcili yardım həkimi, Medikal Park Xəstəxanası, Türkiyə, İstanbul
2016-2017 Həkim-invaziv radioloq, İstanbul Avrasya Qaziosmanpaşa xəstəxanası, Türkiyə, İstanbul
2018-2024 Həkim-invaziv radioloq, İstanbul Medicine Hospital Atlas Universiteti, Türkiyə, İstanbul
2024- Həkim-şüa diaqnostik (İnvaziv radioloq), Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-heyder-huseynov';
UPDATE doctor SET bio = 'Neonatoloq.
Şöbə: Neonatologiya

İş təcrübəsi:
2011-2017 - Bakı şəhəri Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyasının 6 saylı Bölməsi
2017 -2021 - Azərbaycan Respublikası Silahlı Qüvvələrinin Baş Klinik Hospital
2019-2025 - Baku Medical Plaza Medilux filialı
2023 - Yeni Klinika.', updated_at = NOW() WHERE slug = 'dr-hilal-budaqova';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Somatika və STROK Mərkəzi', updated_at = NOW() WHERE slug = 'dr-humay-rzayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təcili tibbi yardım xidməti və ilkin stabilizasiya
(Kəskin vəziyyətlərdə ilkin müdaxilə və həyat funksiyalarının bərpası)
Şok və həyati təhlükəli vəziyyətlərin idarə olunması
(Kardiogen, hipovolemik, anafilaktik, septik şok və s.)
Reanimasiya və reanimasyon protokolları
(KPR, ACLS, BLS, travma hallarında ATLS və s.)
Təcili diaqnostik prosedurlar və ilkin tibbi müayinə
(EKQ, USM, FAST, laborator analizlərin təhlili)
Travmatologiya və ortopedik təcili yardım
(Qırıq, çıxıq, kəsik və digər travmatik hallar)
Kəskin infeksion və toksikoloji vəziyyətlər
(Zəhərlənmələr, yüksək hərarət, sepsis, anafilaksiya)
Kəskin kardioloji və pulmonoloji hallar
(İnfarkt, ürək ritm pozğunluqları, ağciyər emboliyası, astma tutmaları və s.)
Nevroloji təcili hallar
(İnsult, qıcolmalar, şüur pozulmaları)
Psixotibbi və davranış pozuntularında ilkin tibbi yardım
(Psixotik epizodlar, intihar riski olan xəstələrin ilkin qiymətləndirilməsi və
müdaxiləsi)', updated_at = NOW() WHERE slug = 'dr-huseyin-haciyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Audiologiya və surdologiya, Azərbaycan, Bakı

İş təcrübəsi:
2005 - Audioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-husniyye-memmedova';
UPDATE doctor SET bio = 'Dəvətli Fleboloq.

Fəaliyyət sahələri:
Aşağı ətraf venalarının varikoz xəstəliyi
Flebektomiya
Miniflebektomiya
Skleroterapiya
Diabetik ayaq sindromu
Xroniki yaralar
Endovenoz lazer ablasiya
Tromboflebit', updated_at = NOW() WHERE slug = 'dr-ibrahim-huseynov';
UPDATE doctor SET bio = 'İnfeksionist.
Şöbə: Terapiya', updated_at = NOW() WHERE slug = 'dr-ibrahim-rufullayev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təcili tibbi yardım xidməti və ilkin stabilizasiya
(Kəskin vəziyyətlərdə ilkin müdaxilə və həyat funksiyalarının bərpası)
Şok və həyati təhlükəli vəziyyətlərin idarə olunması
(Kardiogen, hipovolemik, anafilaktik, septik şok və s.)
Reanimasiya və reanimasyon protokolları
(KPR, ACLS, BLS, travma hallarında ATLS və s.)
Təcili diaqnostik prosedurlar və ilkin tibbi müayinə
(EKQ, USM, FAST, laborator analizlərin təhlili)
Travmatologiya və ortopedik təcili yardım
(Qırıq, çıxıq, kəsik və digər travmatik hallar)
Kəskin infeksion və toksikoloji vəziyyətlər
(Zəhərlənmələr, yüksək hərarət, sepsis, anafilaksiya)
Kəskin kardioloji və pulmonoloji hallar
(İnfarkt, ürək ritm pozğunluqları, ağciyər emboliyası, astma tutmaları və s.)
Nevroloji təcili hallar
(İnsult, qıcolmalar, şüur pozulmaları)
Psixotibbi və davranış pozuntularında ilkin tibbi yardım
(Psixotik epizodlar, intihar riski olan xəstələrin ilkin qiymətləndirilməsi və
müdaxiləsi)', updated_at = NOW() WHERE slug = 'dr-ikram-qubadov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Kardioloji İnstrumental və Funksional Diaqnostik Müayinələr
EKQ (Elektrokardioqrafiya)
EXO-KQ (Exokardioqrafiya) - Ürəyin ultrasəs müayinəsi
Tredmill Stress EKQ Testi - Fiziki yüklənmə altında ürək fəaliyyətini qiymətləndirməsi.
24 Saatlıq Qan Təzyiqi Monitorinqi (BP-Holter)
24-48-72 Saatlıq Ritm-Holter Monitorinqi
Hipertoniya (Yüksək qan təzyiqi) - səbəbinin araşdırılması, müayinə və müalicə istiqamətlərinin təyini
Dislipidemiya - lipid mübadiləsi pozğunluqlarının araşdırlması,müayinə və müalicəsi
Aritmiya və ritm pozğunluqları, diaqnostika, müalicə (dərman və elektrik kardioverdiya)
Ürəyin iltihabi xəstəlikləri ( miokardit, perikardit, endokardit) diaqnostika və müalicə, profilaktika
Ürək Çatışmazlığının müayinə və müalicəsi, stasionar və amlulator təqib.
Hamilələrdə hestasion dövr öncəsi və sonrası kardioloji təqib ( yüksək qan təzyiqi, ürək çırpıtı ritm pozgünluqları, iltihabi xəstəklər, peripartum kardiomiopatiya və s.', updated_at = NOW() WHERE slug = 'dr-ilahe-agayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yüksək qan təzyiqi və ya Hipertoniya xəstəliyi
Qanda xolesterin və triqliserid artıqlığı, piylənmə
Şəkərli diabet, tip2 (ilkin diaqnostika, müalicənin tənzimlənməsi)
Qalxanvari vəzin xəstəlikləri
Mədə-bağırsaq yollarının, qaraciyər, mədə, mədəaltı vəzi, öd kisəsi, yoğun bağırsaq xəstəlikləri
Böyrək və sidik-cinsiyyət sistemi xəstəlikləri
Qan xəstəlikləri, dəmir, vitamin B12 və fol turşusu çatışmazlığı ilə bağlı anemiyalar, qanaxmalar, laxtalanmanın pozulması

Konfranslar:
2014-2022-ci illər Həkimləri Təkmilləşmə İnstitutu, təkmilləşmə kursu
2023-cü il Ankara Tibb Universiteti Qastroenteroloji bilim dalı
2023-cü il TC Ankara İbn Sina Xəstəxanası Endoskopiya bölümü
2023-cü il TC Ankara Cebeçi Xəstəxanası Hepatoloji poliklinik', updated_at = NOW() WHERE slug = 'dr-ilahe-emirova';
UPDATE doctor SET bio = 'İntensiv terapiya və reanimasiya şöbəsinin müdiri.
Şöbə: Reanimasiya

İş təcrübəsi:
2015-2018 - İzmir, Türkiyə, Reanimasiya: Məsul uzman həkim
2018-2020 - İstanbul, Türkiyə, Əməliyyatxana: Məsul uzman həkim
2020-2021 - İstanbul, Türkiyə Reanimasiya: Məsul uzman həkim
2021 - Stralsund, Almaniya, Helios Hansa-Klinikum Hospitation
2022-2023 - Azərbaycan Tibb Universiteti, Anesteziologiya və reanimasiya şöbəsi: Uzman həkim
2024 - Yeni Klinika: İntensiv terapiya və reanimasiya şöbəsinin müdiri.', updated_at = NOW() WHERE slug = 'dr-ilahe-mecidova';
UPDATE doctor SET bio = 'Həkim-laborant.

Konfranslar:
2015-ci il Dokuz Eylül Universitesi Hastanesi Merkez Laboratuvarında kurs (Bakterioloji Laboratuvarı, Doku Tiplendirmə Laboratuvarı, Molekulyar Testler Laboratuvarı, Özel Biokimya Laboratuvarı, Parazitoloji Laboratuvarı).
2015-ci il Azərbaycan Tibb Universitetinin Mikrobiologiya və immunologiya kafedrasının Klinik Laboratoriyası - Klinik materialların kultivasiyası və alınmış mikroorqanizmlərin identifikasiyası kursu
2016-cı il Ondokuz Mayıs Universitesi - Hematoloji Bilim Dalında mikroskopi və Flow citometry kursu
2016-cı il B.Ə.Eyvazov adına Elmi Tədqiqat Hematologiya və Transfuziologiya İnstitutu - Periferik qan və sümük iliyi yaxmaları kursu
2019-cu il Vərəmin erkən aşkarlanmasında diaqnostik üsullar, biotəhlükəsizlik tədbirləri mövzusunda təlim
2019-cu il Talassemiyasız həyat 5-ci regional simpozium
2023-cü il Ümümdunya Səhiyyə Təşkilatının Azərbaycan üçün Milli Laborator siyasət və strateji planın hazırlanması seminarı', updated_at = NOW() WHERE slug = 'dr-ilahe-umudova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Süd vəziləri
Qarın boşluğu və kiçik çanaq orqanlarının
Uroloji
Qalxanabənzər vəzin
Limfa düyünlərinin
Bud-çanaq nahiyəsinin', updated_at = NOW() WHERE slug = 'dr-ilham-huseynov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Terapevtik və qastroenteroloji xəstəliklərin müayinə və müalicəsi
Virus Hepatitlərin və qaraciyər xəstəliklərinin müalicəsi
Mədə qastridləri, qurd xəstəlikləri, mədəaltı vəz xəstəlikləri
Pnevmoniya, bronxitlər, dayaq-hərəkət sistemi xəstəliklərinin müayinə və müalicəsi', updated_at = NOW() WHERE slug = 'dr-ilqar-qasimov';
UPDATE doctor SET bio = 'Referans Xırdalan Tibb Mərkəzinin Baş Həkimi.', updated_at = NOW() WHERE slug = 'dr-ilqar-tapdiqli';
UPDATE doctor SET bio = 'Terapevt, Referans Qəbələ Tibb Mərkəzinin Baş həkimi.

Fəaliyyət sahələri:
Ürək - qan damar sistemi xəstəlikləri: hipertoniya, ürəyin işemik xəstəlikləri, ürək çatışmamazlığı və s.
Tənəffüs sistemi xəstəlikləri: bronxial astma, A.C.XOX, kəskin və xroniki bronxit, kəskin respirator xəstəliklər və s.
Həzm sistemi xəstəlikləri: mədə və onikibarmaq bağırsaq xorası
Kəskin və xroniki qastroduodenit
İltihabi bağırsaq xəstəlikləri. Hepatit, Pankreatit
Sidik-cinsiyyət sistemi xəstəlikləri müalicəsi
Revmatik xəstəliklər və s.', updated_at = NOW() WHERE slug = 'dr-imran-nezirov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet TİP 1 və TİP 2
Piylənmə və çəki artıqlığı
İnsulindirənci və metabolizm xəstəlikləri
Zob xəstəlikləri
Hipotireoz
Hipertireoz
Haşimoto və digər tireoiditlər
Reproduktiv sistem xəstəlikləri
Yumurtalıqların polikistoz sindromu
Menstural pozğunluq
Hipofiz vəz xəstəlikləri
Hiperprolaktinemiya
Lipid mübadiləsi pozğunluğu
Osteoparoz və Vitamin D çatışmazlığı
Hirsutizm-tüklənmə', updated_at = NOW() WHERE slug = 'dr-inci-sabanli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

Fəaliyyət sahələri:
Alqologiya və ozonterapiya, girişimsel ağrı müalicəsi - Maltəpə Universiteti, Türkiyə, İstanbul

İş təcrübəsi:
1991 - 2007 Həkim - Anestezioloq-reanimatoloq, 1 saylı Şəhər Klinik Xəstəxanası, Azərbaycan, Bakı
2007 - Həkim-anestezioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-irade-demirova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Tibbi Laboratoriya

Fəaliyyət sahələri:
Klinik Laborator diaqnostika, hematologiya, Azərbaycan, Bakı

İş təcrübəsi:
1982-1983 Kiçik elmi işçi, Ə. Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
1983 -1989 Baş laborant, Ə. Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
1989 -2001 Həkim-laborant, AR Səhiyyə Nazirliyi 4 №-li Baş İdarənin 1 saylı Xəstəxanası, Azərbaycan, Bakı
2001 - Həkim-laborant, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-irade-haciyeva';
UPDATE doctor SET bio = 'USM həkimi, Azərbaycan Radioloqlar Cəmiyyəti və Avropa Radioloji Cəmiyyətinin üzvü.

Fəaliyyət sahələri:
Tiroid vəzinin ultrasəs müayinəsi
Süd vəzinin ultrasəs müayinəsi
Prostat vəzinin ultrasəs müayinəsi
Limfa düyünlərinin ultrasəs müayinəsi
Abdominal USM (böyüklərdə və uşaqlarda)
Uroloji USM (böyüklərdə və uşaqlarda)
Ginekoloji (transabdominal-transvaginal) USM
Follikulometriya
Hamiləlik: (hamiləliyin təyini, hamiləliyin detallı müayinəsi, hamiləliyin doplerometriyası)
Yenidoğulmuşlarda bud-çanaq oynağının müayinəsi
Neyrosonoqrafiya müayinəsi
Yumşaq toxumanın ultrasəs müayinəsi

Konfranslar:
2024-cü il "Azərbaycan Radioloqları Cəmiyyətinin 4-cü" Beynəlxalq Konfransı Bakı, Azərbaycan
2024-cü il "2-ci qadın xəstəlikləri və estetik ginekologiyada innovasiyalar" adlı Beynəlxalq Tibbi Konfrans Bakı, Azərbaycan
2023-cü il "Çanaq dibi sağlamlığı Endometrioz və Adenomiozda mübahisəli mövzular" Beynəlxalq Konfransı Bakı, Azərbaycan
2023-cü il Mamalıqda Aktual Mövzular və Yanaşmalar Beynəlxalq Konqresi Bakı, Azərbaycan
2023-cü il I-ci Beynəlxalq Qadın Sağlamlığı və Radiologiyası Konfransı Bakı, Azərbaycan
2023-cü il Azərbaycan Respublikası Səhiyyə Nazirliyi İctimai Səhiyyə və İslahatlar Mərkəzi Bakı, Azərbaycan
2022-ci il VII Bakı Beynəlxalq Tibbi Treyninq Günləri Bakı, Azərbaycan
2012-ci il Azerbaijan-Germany Medical Cooperation Association Bakı, Azərbaycan
2009-cu il Hacettepe Universiteti Tibb Fakültəsi Ankara,Türkiyə
2007-ci il Hacettepe Universiteti Tibb Fakültəsi Ankara,Türkiyə', updated_at = NOW() WHERE slug = 'dr-irade-qocayeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Travmatoloq-Ortoped.', updated_at = NOW() WHERE slug = 'dr-ismixan-metiyev';
UPDATE doctor SET bio = 'Endokrinoloq, Referans Bayıl filialının Baş həkimi.

Fəaliyyət sahələri:
Şəkərli və şəkərsiz diabet
Hamiləlikdə diabet
Artıq çəki və piylənmə
Qalxanabənzər vəzi xəstəlikləri
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Menstrual tsiklin pozulması
Hirsutizm (qadınlarda kişi tipli tüklənmə)
Kişi və qadınlarda sonsuzluğun endokrinoloji aspektlərinin dəyərləndirilməsi
Osteoporoz və digər metabolik xarakterli sümük xəstəlikləri
Hipertoniya və ya yüksək qan təzyiqinin endokrinoloji dəyərləndirilməsi

Konfranslar:
2018-İzsiz tiroidektomiya masterklass
2018ci il 5-ci Bariatrik-Metabolik Cərrahiyyə kongresində iştirak edib.
2018" Diabetik pəncə elmi praktiki konfrans
2018-ci il Diabetologiya üzrə Qrand kursu
2019-cu il Avropa Tireodiologiya Assosiasiyasının mütəxəssislərinin təşkil etdiyi, Ümumdünya Qalxanabənzər vəzi gününə həsr olunmuş konfrans
2021-ci il Diabetik neyropatiya və müalicəsi konfransı
2021-ci il Böyrəküstü vəzi çatışmazlığının müalicə və diaqnostikasına müasir yanaşma.
2019 Tiroid ultrasonu kursu-Temd
2021-ci il Dislipidemiyalar
2021-Diabetes digital dialogues-online
2022-ci il Dünya piylənmə günü ilə mübarizə günü beynəlxalq konfrans
2022-ci il Endokurs 2022
2022-ci il Osteoporoz seminarı
2022-Tirois vəzi problemləri beynəlxalq tiroidologiya konfransı
2023-cü il Qadın və kişi endokrinologiyası ekspertlərin dilindən
2023-cü il Hipofiz xəstəliklərinə multidisiplinar yanaşma.', updated_at = NOW() WHERE slug = 'dr-jale-oqtayzade';
UPDATE doctor SET bio = 'Nevroloq və EEQ üzrə mütəxəssis (Nevropatoloq).

Fəaliyyət sahələri:
Əsəbilik, nevrotik pozuntular
Depresiya
Panik atak, müxtəlif fobiyalar
Posttravmatik stres pozuntusu
Baş ağrıları - miqren və digər yayılmış baş ağrıları
Başgicəllənmə
Yuxu pozuntuları
Yaddaş problemləri
Beyin qan dövranı pozğunluqları
Epilepsiya, qıcolmalar
Uşaqlarda qorxular
Uşaqlarda yaddaş və qavrama problemləri
Uşaqlarda kəkələmə və tiklər', updated_at = NOW() WHERE slug = 'dr-jale-qarayeva';
UPDATE doctor SET bio = 'USM həkimi.

Fəaliyyət sahələri:
Qarın boşluğu və retroperitoneal sahənin ultrasəs müayinəsi
Qaraciyər, öd kisəsi, mədəaltı vəzi, dalaq və böyrəklərin ultrasəs müayinəsi
Qaraciyərin elastoqrafiyası
Qalxanabənzər vəz və süd vəzilərinin ultrasəs müayinəsi
Regional limfa düyünlərinin və yumşaq toxumaların ultrasəs müayinəsi
Damarların Doppler müayinəsi
Kiçik çanaq orqanlarının ultrasəs müayinəsi
Mamalıq və ginekologiyada ultrasəs diaqnostikası
Obstetrik Dopplerometriya
Fetal neyrosonoqrafiya
Fetal ürəyin müayinəsi və fetal exokardioqrafiya
Anadangəlmə fetal anomaliyaların prenatal diaqnostikası
Ultrasəs nəzarəti altında biopsiya

Konfranslar:
2015: VISUS, GE Healthcare, ultrasəs diaqnostikası üzrə təlim
2017: AFERG/AFERS, "Basic OB-GYN Ultrasound" seminarı
2018: "Fetal anomaliyaların erkən diaqnostikası" kursu
2018: I Beynəlxalq Mamalıq və Ginekologiya Konqresi
2019: Reproduktiv və perinatal tibb, ginekoloji endokrinologiya üzrə kurslar
2019: Fetal exokardioqrafiya üzrə 1-5-ci modullar
2019: "Qadın xəstəlikləri və fetal radiologiya" konfransı
2021: Fetal neyroembriologiya və neyrosonoqrafiya üzrə seminar
2023: "Second Baku Fetal Brain and Heart Days"
2023: "Mamalıqda aktual mövzular və yanaşmalar" kursu
2025: "Baku Fetal Imaging Masterclass"', updated_at = NOW() WHERE slug = 'dr-kamile-huseynova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ürək-Damar Cərrahiyyəsi

Fəaliyyət sahələri:
Ürək cərrahiyyəsi - İsveçrə, Cenevrə
Anadangəlmə ürək qüsurları üzrə mütəxəssis
Elmi yazı və məqalələr
External stenting of saphenous vein bypass grafts does not affect intraoperative transit-time flow measurement. B.C.Depboylu, P.O.Myers, M.Parmeseeven, J.Jolou, K.Ahmadov, S.Karaca, M.Licker, A.Kalangos, M.Cikirikcioglu J Cardiothorac Surg 10 (Suppl 1), A297 (2015). https://doi.org/10.1186/1749-8090-10-S1-A297
HeartMate 3 in Lowest INTERMACS Profile Cohort: The Swiss Experience P.Tozzi, C.Banfi, K.Ahmadov, R.Hullin, P.Meyer, R.Giraud, L.Liaudet, F.Gronchi, C.Huber, M.Kirsch ASAIO Journal 63(6):p 752-758, November/December 2017. | DOI: 10.1097/MAT.0000000000000589
A rare case of a patient with aortic root aneurysm, bicuspid aortic valve, and Scimitar syndrome with anomalous venous return to the right superior pulmonary vein K.Ahmadov , C.A.Beigelman, M.Kirsch Cardiol Young. 2018 Apr;28(4):595-597. doi: 10.1017/S1047951117002359. Epub 2018 Jan 23. PMID: 29357959.
A giant coronary artery aneurysm associated with multiple peripheral arterial aneurysms and an abdominal aortic aneurysm K.Ahmadov, T.Sologashvili, M.Roffi, C.Huber European Journal of Cardio-Thoracic Surgery, Volume 54, Issue 3, September 2018, Pages 598-600, https://doi.org/10.1093/ejcts/ezy053
Early Results of Aortic Valve Neocuspidization (Ozaki Procedure): Azerbaijan Experience K.Musayev, K.Ahmadov, N.Kazimzade Structural Heart 4(sup1):58-58, February 2020, DOI:10.1080/24748706.2020.1717223
Aortic Valve Repair: Baku Experience K.Musayev,K. Ahmadov Structural Heart 4(sup1):20-20, February 2020, DOI:10.1080/24748706.2020.1714344
Treatment of a thoracic aortic aneurysm-related aortoesophageal fistula K.Musayev,K. Ahmadov Turk J Vasc Surg 2020;29(2):131-133, Doi:10.9739/tjvs.2020.609
An unusual thrombus location in a Heartmate 3 device with fatal outcome C.Banfi, F.Rigamonti, K.Ahmadov, P.Meyer, A.L.Hachulla, C.Craviari, P.Fontana, K.Bendjelid, R.Giraud Perfusion. 2020 Jul;35(5):442-446. doi: 10.1177/0267659119890218. Epub 2019 Dec 9. PMID: 31814521.
Surgical management of multiple in-stent restenosis with coronary endarterectomy and stentectomy K.Musayev, N.Kazimzade, K.Ahmadov AZJCVS. 2021;1(1):30-2.DOI:10.30546/azjcvs.2021.2.1.60
Efficacy and outcomes of pulmonary artery banding: Our experience in Azerbaijan K.Ahmadov, K.Musayev AZJCVS 2023;4(3):63-6. Doi:10.5455/azjcvs.2023.10.023
Azerbaijan''s first successful ECMO patient management - 4 year survival K.Ahmadov, K.Musayev AZJCVS 2024;5(1):26-8. Doi:10.5455/azjcvs.2023.10.022
Extra-Pericardial Modified Blalock-Taussig Shunt Via Sternotomy in Patients with A Right Aortic Arch. K.Ahmadov, K.Musayev, T.Sologashvili Turk Gogus Kalp Damar Cerrahisi Derg. 2024 Dec 31;32(4 Suppl 2):006-7. doi: 10.5606/tgkdc.dergisi.2024.mob-03. PMID: 40322161
Acute Cardiac Tamponade Secondary to Pericardial Cyst. K.Ahmadov, V.Behbudov, F.Alakbarov, K.Musayev 2024 Dec 31;32(4 Suppl 2):118-119. doi: 10.5606/tgkdc.dergisi.2024.mep-22. PMID: 40322114
Managing Recurrent Chylothorax Post Pediatric Cardiac Surgery. K.Ahmadov, K.Musayev, F.Huseynov Turk Gogus Kalp Damar Cerrahisi Derg. 2024 Dec 31;32(4 Suppl 2):120-121. doi: 10.5606/tgkdc.dergisi.2024.mep-23. PMID: 40322147
Minimally Invasive Right Vertical Axillary Thoracotomy for Repair of Congenital Heart Defects: Azerbaijan Experience. K.Ahmadov, K.Musayev Turk Gogus Kalp Damar Cerrahisi Derg. 2024 Dec 31;32(4 Suppl 2):046-46. doi:10.5606/tgkdc.dergisi.2024.msb-26. PMID: 40322156
Mid-Term Results of Ozaki Procedure: Azerbaijan Experience. K.Ahmadov, N.Kazimzade, K.Musayev Turk Gogus Kalp Damar Cerrahisi Derg. 2024 Dec 31;32(4 Suppl 2):045-45. doi: 10.5606/tgkdc.dergisi.2024.msb-25. PMID: 40322172; PMCID: PMC12045243.

İş təcrübəsi:
2019- Həkim-ürək-damar cərrahı, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-kamran-ehmedov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

İş təcrübəsi:
2012 - Həkim-anestezioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-kamran-esedullayev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ürək-Damar Cərrahiyyəsi

Fəaliyyət sahələri:
Anesteziologiya-Reanimatologiya
Kardio-reanimatologiya

İş təcrübəsi:
2014-2015 Hərbi həkim, N saylı Hərbi hissə, Azərbaycan, Tovuz
2019- Həkim-kardio-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-kamran-nagizade';
UPDATE doctor SET bio = 'Şüa diaqnostika şöbəsinin müdiri.

Şöbə: Şüa diaqnostika

Fəaliyyət sahələri:
Angioqrafiya - İstanbul Universiteti ÇAPA Tibb Fakultəsi, Türkiyə, İstanbul

İş təcrübəsi:
2004 - Həkim-şüa diaqnostik (invaziv radioloq), Mərkəzi Klinika, Azərbaycan, Bakı
2016- Şüa diaqnostikası şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-kamran-yaqubov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal USM (uşaqlarda və böyüklərdə)
Qalxanabənzər vəzinin (tiroid) USM-i
Süd vəzisinin USM-i
Ginekoloji USM (transabdominal və transvaginal)
Follikulometriya
Hamiləliyin təyini
Erkən hamiləlik USM-i
Hamiləlik skrininqi, dopplerometriya və 3D/4D müayinəsi:
I skrininq: 11-14 həftə
II skrininq: 18-21 həftə
III skrininq: 28-31 həftə
Yumşaq toxuma USM-i
Limfa düyünlərinin USM-i
Uşaqlarda neyrosonoqrafiya
Mammoqrafiya müayinəsinin rəyinin yazılması
Tomosintez (3D mammoqrafiya) müayinəsinin rəyinin yazılması', updated_at = NOW() WHERE slug = 'dr-kemale-memmedova';
UPDATE doctor SET bio = 'Dermatokosmetoloq.

Fəaliyyət sahələri:
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Sızanaq (Akne)
Dərinin göbələk xəstəlikləri
Atopik dermatit
Psoriaz
Ekzema
Neyrodermit
Dərinin bakterial dermatozları
Dərinin virus xəstəlikləri

Konfranslar:
2011-ci il Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitunun nəzdində Bakı Şəhər - Dəri-Zöhrəvi Dispanserində Dermatoveneroloji Kursu
2011-ci ildən etibarən bir çox ölkə daxili və xarici dermatoveneroloji və kosmetoloji konfranslarda iştirak etmişdir.
2012-ci il "İnnovate Nano Technology new generation fillers" dolğuların yeni texnologiya ilə işlənməsi mövzusunda Konfrans
2013-cü il müxtəlif dəri tiplərinə uyğun olaraq "Kimyəvi Piliqlərin" düzgün olaraq işlənməsi kursu
2014-cü il "Botilinium Terapiya" kursu
2018-ci il Qaziosmanpaşa xəstəxanasının Dermatoloji bölümündə Kurs,Türkiyə
2020-ci il Dubaiderma Beynalxalq Konqres
2021-ci il AMWC Konqres (Monako)
2023-cü il Dermatolojodə və Kosmetolojide Gelişmeler (Antalya)', updated_at = NOW() WHERE slug = 'dr-kemale-nezerova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Yoluxucu xəstəliklər, Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı

İş təcrübəsi:
2018 - Həkim-infeksionist, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-kemale-topcubasova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Kardiologiya və İntensiv terapiya - Algemain Krankenhaus Stadt Wien, Avstriya Vyana
Fövqəladə hallarda təcili və təxirə salınmaz tibbi yardımın təşkili - Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu Təcili Yardımın təşkili kafedrası

İş təcrübəsi:
2004-2007 İntensiv terapiya briqadasının həkimi, Bakı şəhəri Təcili və təxirəsalınmaz tibbi yardım Stansiyası, Azərbaycan, Bakı
2004-2007 Sənaye təbabəti həkimi, Medi Club MMC, Azərbaycan, Bakı
2007-2008 Həkim-aspirant, kiçik elmi işçi (dissertant) Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya kafedrası Azərbaycan, Bakı
2008- Müşayiət sektorunun böyük məsləhətçisi, Azərbaycan Respublikası Prezidentinin Xüsusi Tibb Xidməti, Azərbaycan, Bakı
2011- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakıı', updated_at = NOW() WHERE slug = 'dr-kenan-ehmedov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Pulmonologiya - Yedi Kule Gögüs Hastalıkları və Gögüs Cerrahisi Egitim Araşdırma Mərkəzi, Türkiyə, İstanbul
Allerqologiya - Bursa Uludağ Universiteti Gögüs hastalıkları Alerji Anabilim dalı, Türkiyə, Bursa

İş təcrübəsi:
1998- 2006 Həkim-sahə terapevti, 14 saylı Birləşmiş Şəhər Xəstəxanası, Azərbaycan, Bakı
2006 Həkim-pulmonoloq, Mərkəzi Klinika, Bakı, Azərbaycan', updated_at = NOW() WHERE slug = 'dr-kerime-abdullayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Bütun növ daxili xəstəliklər
Tənəffüs sistemi xəstəlikləri (bronxit,pnevmoniya və s.)
Həzm sistemi xəstəlikləri (qastrit,mədə xorasi,ezofagit, xolisistit və s.)
Sidik ifrazat sistemi xəstəlikləri (sistit,nefrotik sindrom pielonefrit və s.)
Revmatoloji xəstəliklər
Anemiyalar
Allergiyalar
Ostexandroz və başqa xəstəliklər

Konfranslar:
2008-ci il "hemotoksikalogiya "kursu
2009-cu il "psixiatriya" kursu Ə.Əliyev adına H.T.İ
2014-cü il "Terapiya "kursu Ə.Əliyev adına H.T.İ
2019-cu il "Terapiya kursu( modul 1-2) Ə.Əliyev adina H.T.İ
2020-ci il "Terapiya kursu (modul 5-6) Ə.Əliyev adıma H.T.İ
2020-ci il "Terapiya kursu (modul 7-8)Ə.Əliyev adına H.T.İ
2021-ci il "Terapevtik praktikada hepatobiliar patalogiyalar" Ə .Əliyev adina H.T.İ', updated_at = NOW() WHERE slug = 'dr-konul-agayeva';
UPDATE doctor SET bio = 'Referans VIP filialının Baş həkimi.', updated_at = NOW() WHERE slug = 'dr-konul-memmedova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Onkoginekoloq.

Fəaliyyət sahələri:
Kolposkopiya müayinəsi
Pap Smear testi və HPV skrininqi
Uşaqlıq boynunun xərçəngi
Endometrium (uşaqlıq daxili qişa) xərçəngi
Vulva xərçəngi
Uşaqlıq boynunun polipləri və kistləri
Ginekoloji müayinə və müalicə', updated_at = NOW() WHERE slug = 'dr-konul-merdanova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Pediatr.

Fəaliyyət sahələri:
Yenidoğulmuşların müayinəsi
Uşaqların fiziki və psixi inkişafının qiymətləndirilməsi
Müxtəlif mənşəli anemiyalar, onların fəsadları
Burun qanaxmaları, digər mənşəli qanaxmalar
Mədə-bağırsaq xəstəlikləri
Sidik-ifrazat sistemi xəstəlikləri
Boy qısalığı, çəki artıqlığı, inkişafdan qalma
Müxtəlif mənşəli allergiyalar
Tənəffüs sistemi xəstəlikləri
Baş ağrıları, diqqət zəifliyi
Qurd xəstəlikləri', updated_at = NOW() WHERE slug = 'dr-konul-mirzeyeva';
UPDATE doctor SET bio = 'Qastroenteroloq-endoskopist.

Fəaliyyət sahələri:
Mədə-bağırsaq xəstəliklərinin müayinəsi, diaqnostikası və müalicəsi
Mədəaltı vəzi xəstəliklərinin müayinəsi, diaqnostikası və müalicəsi
Qaraciyər və öd kisəsi xəstəliklərinin müayinəsi, diaqnostikası və müalicəsi
Qastroskopiya
Kolonoskopiya
Mədə-bağırsaq qanaxmalarının dayandırılması
Mədə-bağırsaq poliplərinin çıxarılması
Mədə balonunun qoyulması
Mədə-bağırsaq biopsiyalarının alınması
Endoskopik stent qoyulması
Yad cismin çıxarılması
Perkütan endoskopik qastrostomiya (PEG)

Konfranslar:
2020-ci il Ankara Gazi Xəstəxanası, Qastroenterologiya şöbəsi (kurs)
2020-ci il Ankara İrəli Endoskopiya Günləri
2021-ci il I Bakı Mədə Günləri
2022-ci il AQIEC. I Qastroenteroloji Simpozium: Pankreas və qida borusu xəstəlikləri
2023-cü il II Bakı Mədə Günləri
2023-cü il II Beynəlxalq Onko-Qastro-Hepatologiya Konfransı
2024-cü il 20-ci Beynəlxalq Avrasiya Cərrah və Qastroenteroloqlar Konqresi
2025-ci il İltihabi Bağırsaq Xəstəlikləri Simpoziumu 2: Crohn xəstəliyi', updated_at = NOW() WHERE slug = 'dr-kubra-eskerova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2005 - Həkim-mama-ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-lale-agayeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Nevroloq, İqlaterapevt.

Fəaliyyət sahələri:
Serebrovaskulyar xəstəliklər və baş beyin pozuntuların müayinə və müalicəsi
İşemik və hemorragik insult - Serebral qan dövranının pozulması nəticəsində yaranan vəziyyətlərin diaqnostikası və müalicəsi
Beyin qan dövranı pozğunluqları - Xroniki serebrovaskulyar çatışmazlıq, başgicəllənmə və koqnitiv pozuntular
Miqren və gərginlik tipli baş ağrıları - Baş ağrılarının növünə uyğun müayinə və müalicə
İkincili baş ağrıları - Digər nevroloji və ya sistemik xəstəliklərlə əlaqəli baş ağrılarının araşdırılması
Sinir sisteminin funksional pozuntularının müayinə və müalicəsi
Əsəbilik, gərginlik, nevrotik hallar - Vegetativ sinir sisteminin disbalansı ilə əlaqəli psixosomatik şikayətlər
Panik atak və anksiyete pozuntuları - Nəfəs darlığı, ürəkdöyünmə, qorxu hissi və digər vegetativ simptomlarla müşayiət olunan vəziyyətlərin nevroloji müalicəsi
Koqnitiv və zehni funksiyaların pozulmalarının müyainə və müalicəsi
Demensiya - Alzheimer, vaskulyar demensiya və digər növlərin erkən diaqnozu və dəstək müalicəsi
Yaddaş və diqqət pozğunluqları - Koqnitiv bacarıqların zəifləməsi ilə bağlı nevroloji dəyərləndirmə
Periferik sinir sistemi xəstəliklərinin müayinə və müalicəsi
Neyropatiyalar - Diabetik, toksik, infeksion və digər mənşəli sinir zədələnmələri
Nevritlər - Sinir iltihabları nəticəsində yaranan ağrı, zəiflik və hissiyat dəyişiklikləri
Nevralgiyalar - Trigeminal, oksipital və digər sinirlərə aid kəskin ağrılı sindromların müalicəsi
Onurğa və dayaq-hərəkət sistemi ilə bağlı nevroloji problemlərin müayinə və müalicəsi
Protruziya, disk yırtığı, osteoxondroz - Onurğa kanalındakı dəyişikliklərin sinir sisteminə təsirinin qiymətləndirilməsi və ağrı sindromlarının idarə olunması
İqlaterapiya (akupunktura) - Sinir sisteminin tənzimlənməsi və xroniki ağrıların müalicəsində sübutlara əsaslanan tamamlayıcı metod

Konfranslar:
15.09.2016 - 04.11.2016 - I Təkmilləşdirmə kursu, Ə.Əliyev adına ADHTİ
2022-ci il - II Təkmilləşdirmə kursu, Ə.Əliyev adına ADHTİ
2016-cı ildən - Azərbaycan Milli Nevroloqlar Assosiasiyasının həqiqi üzvü
2016-cı ildən - Valeh Mirzəzadənin rəhbərlik etdiyi Azərbaycan Respublikası Endokrinoloqlar Elmi Cəmiyyətinin daimi üzvü
03.01.2019 - 28.06.2019 - Azərbaycan Akupunktur Assosiasiyası ICMART tam ixtisaslaşma kursu
2-4 aprel 2021-ci il - Azərbaycan-Türkiyə Pediatrik Endokrinologiya kursu
Dünya Piylənmə ilə Mübarizə Gününə həsr olunmuş elmi konfrans
23-26 may 2020-ci il - 6-cı Avropa Nevrologiya Akademiyasının Konqresi (6th Congress of the European Academy of Neurology)
29 may 2021-ci il - Ümumdünya Dağınıq Sklerozla Mübarizə Gününə həsr olunmuş konfrans
15 aprel 2021-ci il - Bakı Beynəlxalq Nevrologiya Konfransı
2-4 aprel 2021-ci il - 3-cü Uluslararası Türk Dünyası Multipl Skleroz Kongresi', updated_at = NOW() WHERE slug = 'dr-lale-cabbarli';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'dr-lale-eliyeva';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İş təcrübəsi:
1997-1999 - Ağcabədi rayon Mərkəzi Xəstəxanası: Həkim anestezioloq-reanimatoloq
1999-2002 - H.Qasımov adına 1 nömrəli Doğum evi: Həkim anestezioloq-reanimatoloq
2002-2007 - İbn-Seena Central Teaching Hospital Al Mukalla (Yəmən): Həkim-anestezioloq
2007-2009 - H.Qasımov adına 1 nömrəli Doğum evi: Həkim anestezioloq-reanimatoloq
2009-2020 - Mərkəzi Neftçilər Xəstəxanası: Həkim anestezioloq-reanimatoloq
2020-2022 - Məlhəm Beynəlxalq Hospital: Həkim anestezioloq-reanimatoloq.

Kurslar:
The English for Health Professionals program (EHP) June /2007 - November/2007 Australia, MELBOURNE LANGUAGE CENTRE.
Postgraduate course in Respiration Stockholm Sweden May/2014
Postgraduate course in Regional Anesthesia Stockholm Sweden June/2014
Postgraduate course in Intraoperative Neuromonitoring Berlin Germany May/2015
Postgraduate course in Ultrasound-Guided Regional Anesthesia June/2015. Berlin Germany
Ultrasound in Anesthesia Practice Certificate / San Antonio TX US April/2015
Postgraduate course in Ultrasound-Guided Regional Anesthesia June/2017 Geneva Switzerland.
Postgraduate course in Ultrasound-Guided Central Venous Catheter Placement June/2017Geneva Switzerland
Peripheral Nerve Blocks for Breast and Chest Wall Surgery (Ultrasound based) April 19 /2018 New York /USA.
Salzburg Weill Cornell Seminar in Trauma and Emergency Surgery, December 12-18, 2021 Austria
Salzburg CHOP Seminar in Pediatric Anesthesia and Critical Care, January 16-22, 2022', updated_at = NOW() WHERE slug = 'dr-lale-eliyeva-yeniklinika';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Autoimmün xəstəliklərdə nutrisiyent dəstək
Yaşlanma əleyhinə (anti-aging) proqramlar
Klimaks dövrü üçün qidalanma və terapiya
Osteoporoz və osteopeniya profilaktikası
Sarkopeniyanın qarşısının alınması
Dəri xəstəliklərində vitamin və mineral dəstəyi
Akne və rozasea üçün nutrisiyent korreksiya
Həzm problemlərində (qəbizlik, şişkinlik, reflüks və s.) qidalanma dəstəyi
Probiotik, prebiotik və fermentlərin təyini ilə dəstəkləyici proqram
Sonsuzluqda qidalanma və mikroelement korreksiyası
Hamiləlik öncəsi nutrisiyent proqramları
Hamiləlik dövründə vitamin-mineral balansı
İntravenoz terapiyalar (vena daxili dəstəklər)
Detoks və immun gücləndirici infuziyalar
Enerji və anti-stress kokteyllər
Otizmli uşaqlarda mikro və makro nutrisiyent dəstəyi
Qida protokollarının hazırlanması (otizm və inkişaf geriliyi üçün)
Premenopoz dövründə hormonal dəstək
Menopozda biodentik hormon terapiyası
Xroniki yorğunluq sindromu üçün fərdi proqramlar
Yuxu problemləri üçün infuziyalar və qidalanma dəstəyi', updated_at = NOW() WHERE slug = 'dr-lale-huseynova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yuxarı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Rinofarenxit, angina, otit, sinusit və s.)
Aşağı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Bronxit, bronxiolit, sətəlcəm və s.)
Mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi (Qəbizlik, ishal, dispepsiya, qastroenterit, qida intoleransları)
Qurd və parazitar xəstəliklərin müayinə və müalicəsi (Lyambliyoz, askaridoz, enterobioz və s.)
Uşaq infeksion xəstəliklərinin müayinə və müalicəsi (Qızılca, məxmərək, su çiçəyi, razeola infantum, parotit və s.)
Uşaqlarda İmmunitet pozğunluqlarının diaqnostikası və müalicəsi
Yenidoğulmuşların və körpələrin rutin tibbi müşahidəsi (İnkişafın izlənməsi, qidalanma, reflekslər, boy-çəki dinamikası)
Uşaqlarda peyvəndlərin tətbiqi və nəzarəti (Milli peyvənd təqviminə uyğun vaksinasiya və izləmə)
Uşaqlarda Defisit vəziyyətlərin və mikroelement çatışmazlıqlarının dəyərləndirilməsi
Alergik xəstəliklər və atopik halların diaqnostikası və müalicəsi (Atopik dermatit, qida allergiyası, allergik rinit)
Uşaq endokrinoloji problemlərinin ilkin aşkarlanması (Boy geriliyi, piylənmə, erkən və gecikmiş yetkinlik)

Konfranslar:
2006-ci il "Uşaqlıq dövrü xəstəliklərin birgə aparılması "Unicef
2007-ci il Moskva, Rusiya "Pediatriyada allergik xəstəliklər"
2013-cü il "Uşaqlarda infeksion xəstəliklər zamanı təxirəsalmaz tədbirlər"
2015-ci il "Uşaq yaşlarının kardiorevmatologiyası" ADHTU
2017-ci il "Həzm sistemi xəstəliklərin biotənzimləyici terapiyası " Bioloji təbabət kafedrası.
2019-cu il "Ailə təbabəti " kursu Ailə təbabət kafedrası
2020-ci il "COVID-19.Triaj, diagnostika və xəstələrin evde idarə olunması" Yeni Klinika
2021-ci il "Ailə həkimi praktikasında endokrin sistemi xəstəliklərin müasir müalicə prinsipləri" Ailə təbabəti kafedrası "və s.', updated_at = NOW() WHERE slug = 'dr-lale-ibrahimova';
UPDATE doctor SET bio = 'ümumi cərrah, transplantoloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Qaraciyər və böyrək transplantasiyası
Qaraciyər və öd yolları əməliyyatları(xoş və bədxassəli şişlər, kistlərin rezeksiyası)
Mədəaltı vəzi əməliyyatları
Dalaq əməliyyatları
Böyrəküstü vəzi əməliyyatları
Mədə və bağırsaq əməliyyatları
Öd kisəsi əməliyyatı
Qarın boşluğu yırtıqları.

Kurslar:
Ondokuzmayis Üniversitesi Tıp Fakültesi Hastanesi Genel Cerrahi Anabilim Dalında staj 23.07.2010-20.08.2010
Koç University Hospital , Organ Transplantation Clinical Observership Program between 09 -27 December 2019
International Visiting Scholars Training Program at the Division of Liver Transplantation and Hepatobiliary Surgery at Asan Medical Center, Seoul, South Korea, from October 11,2022 to November 11,2022.
5th Congress of International Advanced HBP Surgery October 18 (Wed) - 21 (Sat), 2023 at Kongresshaus Zurich, Switzerland.
Laparoscopic training course January 25th to 29th 2025 World Laparoscopy Training Institute Dubai Healthcare City, Dubai, UAE
Fellowship in minimal access surgery on Wednesday 29th January 2025 at Clinical Surgical Training Center, University of Sharjah ,UAE.
MEMBERSHIP of WORLD ASSOCIATION OF LAPAROSCOPIC SURGEONS since 29.01.2025 lifetime', updated_at = NOW() WHERE slug = 'dr-lale-ismayilova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Kardiak görüntüləmə - Koç Universiteti Xəstəxanası, Türkiyə, İstanbul

İş təcrübəsi:
2023 Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-lale-quluzade';
UPDATE doctor SET bio = 'Baş həkim, Pediatr - Pulmonoloq.

Fəaliyyət sahələri:
Ambulator şəraitdə rutin müayinələr
Gündüz və gecə stasionarı
7/24 təcili təxirəsalınmaz tibbi yardım
Evdə müayinə və tibbi təxliyənin təşkili.
Konsiliumlarin təşkili və dar mütəxəssisləri komandasının cəlb olunması.
Yuxarı və aşağı tənəffüs yolları xəstəlikləri.
Astma və xroniki ağ ciyər xəstəlikləri
Pnevmoniya, bronxit , uzun müddətli öskürəklər və s.
Ürək damar xəstəlikləri
Mədə-bağırsaq sistemi xəstəlikləri
İnfeksion və yoluxucu xəstəliklər
Qurd invaziyaları və parazitar xəstəliklər
Allerqik xəstəliklər
Dəri xəstəlikləri
Endokrinoloji skriniqlər
Uşaqların fiziki və əqli inkişafının dəyərləndirilməsi və dinamik müşahidələr ( dispanserizatsiya və chek-up)
Sidik-ifrazat sistemi xəstəlikləri
Peyvəndləmə və peyvənd öncəsi müayinələr
İndividual peyvənd cədvəlinin qurulması
Yenidoğulmuşların patologiyaları və s.', updated_at = NOW() WHERE slug = 'dr-lale-rehimova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

İş təcrübəsi:
2011 - Diyetoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-lalexanim-memmedli';
UPDATE doctor SET bio = 'Lor (Otorinolarinqoloq).

Fəaliyyət sahələri:
Haymorit
Adenoid
Rinit
Xroniki tonzilit
Angina
Otit ( xarici, daxili, orta)
Menyer xəstəliyi
Otoskleroz
Vertiqo
Qəfil qarlaşma
Taringit
Laringit
Sinusitlər
Allergik rinit, Pollinoz
Burun qanaxmaları
Neyrosensor ağıreşitmə
Yuxarı tənəffüs orqanlarının allergik xəstəlikləri
Yuxarı tənəffüs yollarının göbələk infeksiyaları
Yad cisimlərin çıxardılması', updated_at = NOW() WHERE slug = 'dr-lamiye-mirzeyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ginekoloji USM
Süd vəzi USM
Qalxanvari vəz USM
Limfa düyünləri USM
Follikulometriya, hamiləliyin təyini, erkən hamiləlik USM
Abdomen USM
Kiçik çanaq orqanlarının USM
Yumşaq toxumalarının USM
Bud çanaq oynağı USM
Hamiləliyin doppler müayinəsi (3D, 4D), skrininqlər', updated_at = NOW() WHERE slug = 'dr-lamiye-nesibova';
UPDATE doctor SET bio = 'Pediatr.
Şöbə: Pediatriya

İş təcrübəsi:
2021-2023 - 3 Saylı Usaq Poliklinikası: Həkim-pediatr
2022-2023 - Medera Hospital: Həkim-pediatr.', updated_at = NOW() WHERE slug = 'dr-lamiye-zahidli';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Arterial hipertoniya
Ürəyin işemik xəstəliyi
Ürək çatışmazlığı
Ürək qüsurları
Aritmiyalar
Stenokardiya
EKQ
Exo-KQ
Sutkalıq EKQ-Holter müayinələri

Konfranslar:
2021-ci il - Türkiyə, Ege Universiteti Sürekli Eğitim Merkezi, Hastane öncesi EKQ ve Aritmi Eğitim sertifikatı
2023-cü il - Türkiyə, Ondokuz Mayıs Universiteti, Exokardioqrafiya kursu
2023-cü il - "Baku Heart Days" VII International Congress
Bir sıra Azərbaycan Kardiologiya Cəmiyyəti Milli kongresləri', updated_at = NOW() WHERE slug = 'dr-leman-huseynova';
UPDATE doctor SET bio = 'Qastroenteroloq-Endoskopist.', updated_at = NOW() WHERE slug = 'dr-leman-xasayeva';
UPDATE doctor SET bio = 'Terapevt.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Anemiyalar (qan azlığı)
Qaraciyər xəstəlikləri
Mədə-bağırsaq xəstəlikləri
Ağciyər xəstəlikləri
Böyrək xəstəlikləri
Vitamin çatışmazlığı
Tiroid vəzi xəstəlikləri
Şəkərli diabet
Arterial hipertenziya', updated_at = NOW() WHERE slug = 'dr-letife-memmedzade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Kardiologiya, Bayındır Xəstəxanası, Türkiyə, Ankara

İş təcrübəsi:
2009 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-leyla-elekberova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləlik - Detallı skrininq , Doppler - 3D, 4D
Çoxdöllü və riskli hamiləlik təqibi
Genetik skrininq
Neyrosonoqrafiya
Bud - çanaq müayinəsi (yenidoğulmuşlarda)
Timus vəzi
Qalxanvari vəzi
Süd vəzi
Prostat vəzi
Tam Abdominal müayinə ( Qaraciyər,Öd kisə, Mədəaltı vəzi, Dalaq, Böyrəklər)
Uroloji USM
Ginekoloji USM
Skrotal USM
Renal doppler
Yumşaq toxuma USM
Karotid arter doppleri
Limfa vəziləri USM

Konfranslar:
Müxtəlif beynəlxalq və elmi konfranslarda mühazirəçi və iştirakçı qismində iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-leyla-eliyeva';
UPDATE doctor SET bio = 'Keyfiyyətə nəzarət mütəxəssisi, Həkim-laborant.

Fəaliyyət sahələri:
Biokimyəvi və Hormonal laborator müayinələr
Hemotoloji laborator müayinələr
Metabolik testlər
Keyfiyyət İdarəetmə Sistemi Üzrə Menecer

Konfranslar:
Azərbaycan-Türkiyə İnfeksion Forumu çərçivəsində "İnfeksion xəstəliklərin menecmentinə dair Azərbaycan-Türkiyə Beynəlxalq Simpoziumu".
Perinatal Təbabət Üzrə Konfrans -2020.
Sübuta Dayanıqlı Kliniki Təbabət 2021 -Məruzəçi.
2-ci Beynəlxalq Laboratoriya Təbabəti Konfransı 2022- iştirakçı
1-ci Beynəlxalq Azərbaycan Laboratoriya Təbabəti Konferans -2023
Azərbaycan Pediatriya cəmiyyətinin 1-ci Beynəxalq Pediatriya Konfransı - Məruzəçi 2023
"Müasir diaqnostik laboratoriyalarda Boditech Med Inc-nin rolu. Yeni ixtiralar və kəşflər"', updated_at = NOW() WHERE slug = 'dr-leyla-eliyeva-referans';
UPDATE doctor SET bio = 'Nevroloq, Neyromodulyasiya üzrə mütəxəssis.

Fəaliyyət sahələri:
Mərkəzi sinir sistemi xəstəliklərinin müayinə və müalicəsi
Beyin qan dövranı pozğunluqları - İsemik və hemorragik insult, xroniki serebrovaskulyar çatışmazlıq, başgicəllənmə və yeriş pozğunluğu kimi halların dəyərləndirilməsi.
Mərkəzi sinir sisteminin infeksion xəstəlikləri - Ensefalit, meninqit və digər neyroinfeksiyalar.
Epilepsiya - Tutmalarla müşayiət olunan xəstəlik; EEG və medikamentoz nəzarət altında olan müalicə proqramları ilə idarə olunur.
Parkinson xəstəliyi və parkinsonizm sindromu - Əl titrəməsi, hərəkət ləngiməsi, əzələ sərtliyi və digər motor pozuntuların erkən diaqnostikası və müalicəsi.
Dağınıq skleroz - Autoimmun mənşəli demielinizəedici xəstəlik; görmə, hissiyat və hərəkət pozuntuları ilə müşayiət olunur.
Yan Amiotrofik Skleroz (ALS) - Sinir-əzələ aparatını tədricən zəiflədən və ciddi nəzarət tələb edən neyrodegenerativ xəstəlikdir.
Periferik və vegetativ sinir sistemi pozğunluqlarının müayinə və müalicəsi
Periferik sinir sistemi xəstəlikləri - Nevritlər, neyropatiyalar, sinir blokları və müxtəlif ağrılı sindromların dəyərləndirilməsi və müalicəsi
Vegetativ sinir sistemi xəstəlikləri - Təzyiqin sabit olmaması, tərləmə, ürəkdöyünmə, panik atak və digər psixosomatik halların dəyərləndirilməsi və müalicəsi.
Onurğa sütunun degenerativ xəstəlikləri - Protruziya, fəqərəarası disk yırtığı, osteoxondroz, radikulopatiya və onurğa kanalının daralması ilə müşayiət olunan halların müalicəsi.
Baş və sinir sistemi ilə əlaqəli funksional pozğunluqların müayinə və müalicəsi
Baş ağrıları - Miqren, gərginlik tipli, kümevi və ikincili baş ağrılarının səbəblərinin araşdırılması və müalicəsi.
Başgicəllənmə (vertigo) - Vestibulyar sistem və ya mərkəzi sinir sistemi mənşəli başgicəllənmələrin differensial diaqnozu.
Sinir-əzələ xəstəlikləri - Miyopatiyalar, miasteniya və sinir-əzələ keçiriciliyinin pozulması ilə xarakterizə olunan hallar.
Sinir tikləri və qeyri-iradi hərəkətlər - Uşaq və böyüklərdə rast gəlinən motorik və vokal tiklərin müayinəsi və idarə olunması.
Yuxu pozğunluqları - Yuxuya getmədə çətinlik, tez oyanma və keyfiyyətsiz yuxu kimi problemlərin müalicəsi.
Nevrozlar - Stress, narahatlıq, emosional gərginlik və digər funksional pozğunluqlarla müşahidə olunan vəziyyətlər.
Enurez (gecə sidiyə qaçırma) - Xüsusilə uşaqlarda rast gəlinən, nevrogen və ya psixogen mənşəli halların dəyərləndirilməsi və müalicəsi.

Konfranslar:
Ölkədaxili və ölkəxarici müxtəlif konfrans və seminarların iştirakçısıdır.', updated_at = NOW() WHERE slug = 'dr-leyla-sahbazova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Tibbi Laboratoriya

Fəaliyyət sahələri:
Klinik laborator diaqnostika, Azərbaycan, Bakı
Biokimya - Ankara Nümunə Eğitim və Araşdırma Xəstəxanası, Türkiyə, Ankara
Diaqnostik Laboratoriya, Düzen Laboratoriyaları, Türkiyə,İstanbul

İş təcrübəsi:
1980-1982 Həkim-laborant, 15 saylı uşaq poliklinikası, Azərbaycan, Bakı
1982-1983 Kiçik elmi işçi, 1 saylı şəhər poliklinikası, Azərbaycan, Bakı
1983-2001 Baş laborant, AR Səhiyyə Nazirliyi 4 №-li Baş İdarənin 1 saylı Xəstəxanası, Azərbaycan, Bakı
2001 - Həkim-laborant, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-leyla-topciyeva';
UPDATE doctor SET bio = 'İnvaziv Pulmonoloq.', updated_at = NOW() WHERE slug = 'dr-mahal-elekberov';
UPDATE doctor SET bio = 'Qastroenteroloq-Hepatoloq.

Fəaliyyət sahələri:
Qaraciyər viruslu hepatitlərinin müayinə və müalicəsi
Alkoqollu hepatitlərin müayinə və müalicəsi
Qaraciyər piy xəstəliyinin müayinə və müalicəsi
Autoimmun hepatitlərin müayinə və müalicəsi
İrsi qaraciyər xəstəliklərinin müayinə və müalicəsi
Qaraciyər sirrozunun müayinə və müalicəsi
Şəkərli diabetli və artıq çəkili xəstələrdə qaraciyər problemlərinin müayinə və müalicəsi
Toksiki və dərman hepatitlərinin müayinə və müalicəsi
Mədə eroziyaları və xoralarının müayinə və müalicəsi
12-barmaq bağırsaq xoralarının müayinə və müalicəsi
Öd yollarının iltihabı xəstəliklərinin müayinə və müalicəsi

Konfranslar:
2012-ci il 7-8 iyun "Hepatologiyanın Ağ Gecələri 2012" konfransı, Sankt-Peterburq, Rusiya
2012-ci il 12-13 oktyabr, Tbilisi, Gürcüstan,Qaraciyər Beynəlxalq Simpoziumu
2013-cü il 24-28 aprel, Amsterdam, Hollandiya, Beynəlxalq Qaraciyər Konqresi
2014-cü il Qaraciyər xəstəliklərinə dair Birinci Zaqafqaziya Beynəlxalq Konfransı, Tbilisi, Gürcüstan', updated_at = NOW() WHERE slug = 'dr-mahire-qedirova';
UPDATE doctor SET bio = 'Terapiya şöbəsinin müdiri.

Şöbə: Terapiya

Fəaliyyət sahələri:
Pulmonologiya - Ankara Atatürk Gögüs Hastalıkları və Gögüs Cerrahisi Egitim-Araştırma Hastanesi, Türkiyə, Ankara
Astma və Allergologiya - Ankara Atatürk Gögüs Hastalıkları və Gögüs Cerrahisi Egitim-Araştırma Hastanesi, Türkiyə, Ankara

İş təcrübəsi:
1998-2000 Həkim-ftiziatr, Müdafiə Nazirliyi Əlahiddə Ftiziatriya Hospitalı, Azərbaycan,Bakı
2000- Həkim-pulmonoloq, Mərkəzi Klinika, Azərbaycan,Bakı
2017- Terapiya şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan,Bakı', updated_at = NOW() WHERE slug = 'dr-manaf-abbasov';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Normal və riskli hamiləliyin təqibi
Ginekoloji xəstəliklərin müayinəsi və müalicəsi
⁠Sonsuzluğun müalicəsi
⁠Fizioloji doğuş
⁠Keysəriyyə əməliyyatı
⁠Ginekoloji əməliyyatlar

Konfranslar:
2017-ci il Okan Universiteti xəstəxanası "Qadın xəstəlikləri və hamiləlik seminarı".
2017-ci il "Sağlam hamiləlik naminə" mövzusunda Beynalxalq elmi praktik konfrans
2018-ci il Ana və dölün sağlamlığında müasir yanaşma mövzusunda konfrans
2018-ci il "Aybaşı pozulması problemlərinə müasir yanaşma" seminarı.
2019-cu il Beynəlxalq reproduktiv sağlamlıq və sonsuzluq simpozyumda Laparaskopiya ve Histerozkopiya kursu
2023-cü il Mamalıq və Ginekologiya üzrə 5-ci Beynəlxalq konqres', updated_at = NOW() WHERE slug = 'dr-mariya-ismayilova';
UPDATE doctor SET bio = 'Uroloq-Androloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

Müalicə etdiyi xəstəliklər:
Prostat vəzin hiperplaziyası (müalicə və cərrahiyyəsi)
Sidik daşı xəstəliyi (açıq və endoskopik yolla əməliyyat)
Uroloji daş xəstəlikləri əməliyyatları (açıq ve edoskopik)
Perkutan nefrolitotomiya PCNL
Böyrək əməliyatları (açıq və qapalı)
Sidik kisəsi törəmələri
Kişi Sonsuzluğu (müalicə və cərrahiyəsi)
Skrotal cərrahiyyə.

Üzvlük:
Uroloji Cərrahiyyə Cəmiyyəti
Türkiyə Urologiya Dərnəyi.', updated_at = NOW() WHERE slug = 'dr-mecid-haqverdiyev';
UPDATE doctor SET bio = 'Bakıdan dəvətli Endokrinoloq-Dietoloq.', updated_at = NOW() WHERE slug = 'dr-medine-dilbazi';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Travmatologiya, Ortopediya, İdman Həkimliyi

Fəaliyyət sahələri:
Periprostatik infeksiya; diaqnostik, müalicə, müasir konsepsiya
Artroplastika və Artroskopiya
Ciyin və diz nahiyyəsi
İdman travmalarının müalicəsi

İş təcrübəsi:
2023 - 2024 Təcili tibbi yardım həkimi, Mərkəzi Klinika, Azərbaycan, Bakı
2024 - Həkim-travmatoloq-ortoped, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-mehemmed-mensimov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ortopediya-Travmatologiya, İdman həkimliyi və Fizioterapiya

Fəaliyyət sahələri:
Fizioterapiya, Romatem Xəstəxanası, Türkiyə, Kocaeli
Akupunktura
Uşaq inkişafı-xüsusi ehtiyaclı uşaqlara qulluq sahəsində tibbi model kursu

İş təcrübəsi:
2000 - 2007 Fizioterapevt, Bakı Bərpa Mərkəzi, Azərbaycan, Bakı
2007 - Fizioterapevt, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-mehluqe-seferova';
UPDATE doctor SET bio = 'Otorinolarinqoloq.

Fəaliyyət sahələri:
Kəskin və xroniki otitlərin diaqnostikası və müalicəsi
Vestibulyar patologiyaların müalicəsi
Labirintitlərin müalicəsi
Qulaq kiri tıxacının təmizlənməsi (yuyulma və aspirasiya)
Konduktiv və neyrosensor ağıreşitmə problemlərinin qiymətləndirilməsi
Evstaxi borusuna hava üfürülməsi (keçiriciliyin bərpası)
Burun və burunətrafı sinusların prosedurları və müalicəsi:
Kəskin və xroniki sinusitlərin müalicəsi
Allergik, hipertrofik və vazomotor rinitlərin müalicəsi
Burun çəpərinin submukoz rezeksiyası (əməliyyat)
Udlaq və boğazla bağlı prosedurlar və müalicə:
Kəskin və xroniki faringit, tonzillitlərin müalicəsi
Udlağa dərman sürtülməsi, lakunaların yuyulması
Adenotomiya (əməliyyat)
Tonzillektomiya (əməliyyat)
Qırtlaq və səs telləri ilə bağlı prosedurlar və müalicə:
Kəskin və xroniki laringitlərin diaqnostikası və müalicəsi

Konfranslar:
2010-cu il - Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, ixtisasartırma kursu
2015-2023-cü illər - Sertifikasiya şəhadətnaməsi
2023-cü il - Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu (ADHTİ), ixtisasartırma kursu
17 may 2025-ci il - Azərbaycan Otorinolarinqologiya Cəmiyyətinin III Beynəlxalq Konqresi
3-4 iyun 2025-ci il - Azərbaycan Otorinolarinqoloqlarının IV Beynəlxalq Konqresi', updated_at = NOW() WHERE slug = 'dr-mehriban-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Ümumi pediatriya, Uludağ Universiteti, Türkiyə, Bursa

İş təcrübəsi:
2017 - Həkim-Pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-melahet-efendiyeva';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuz cütlüyün dəyərləndirilməsi və sonsuzluğun müalicəsi
Uşaqlıqdaxili inseminasiya (aşılama)
Menstrual disfunksiyanın müalicəsi
Cinsi yolla ötürülən infeksiyaların diaqnostikası və müalicəsi
Ailə planlaması (spiralın taxılması, oral kontraseptivlərin təyini, dərialtı implantın yeridilməsi, tubal sterilizasiya)
Ginekoloji xəstəliklərin USM diaqnostikası və müalicəsi
Normal və riskli hamiləliyin aparılması və USM təqibi
Normal və ağrısız doğuş
Kolposkopiya
Qeysəriyyə kəsiyi əməliyyatı
HSQ (boruların yoxlanılması)
Uroginekologiya (sidik qaçırmanın müayinə və müalicəsi)
Hər növ ginekoloji əməliyyatlar
Genital estetik cerrahi və qeyri-cərrahi prosedurlar

Konfranslar:
2012-ci ildə Eğitim Araştırma Hastanesi, Kadın Doğum bölümündə ixtisaslaşma kursu, Türkiyə, İstanbul
2016-ci ildə "Ginekoloji problemlərə və riskli hamiləliklərə müasir yanaşma" adlı elmi- praktiki simpozium
2018-ci ildə 4. Azerbaijan-German-Turkish Medical Congress and 3.Baku İnternational Medical Workshop Days - Hysteroscopy course
2018-ci ildə İnternational Symposium on Reproductive Health and Infertility
2018-ci ildə Ovulation İnduction course
2018-ci ildə Azərbaycan Tibb Universiteti Rezidentlərinin 6-cı Elmi Konfransı məruzəçi
2018-ci ildə Advanced Imaging Techniques in Ultrasonography
2018-ci ildə "Təkrarlanan düşüklər və tromboemboliya problemləri" adlı konfrans
2019-ci ildə Pathogenesis and Management of Female Pelvic Floor Dysfunctions
2019-ci ildə "Reproduktiv, Perinatal, Ginekoloji- Endokrinoloji" adlı Beynəlxalq Tibbi Konfrans
2019-ci ildə "Uşaqlıq boynu patologiyalarının müalicəsinə müasir yanaşma " adlı Beynəlxalq Onkoginekologiya Konfransı
2021-ci ildə "Döldəki qüsürların prenatal diaqnostikası və bətndaxili invaziv müdaxilələr" adlı təlim
2021-ci ildə Alman- Azərbaycan Ginekologiya günü
2022-ci ildə "COVİD19 pandemiyası zamanı mamalıq və ginekoloji problemlərə müasir baxış" adlı beynəlxalq elmi konfrans
2022-ci ildə "Fetal medicine and prenatal diagnosis" congress
2022-ci ildə ÜTCD, İVF okulu
2022-ci ildə "Kadın Genital Estetik Cerrahisi ve Cinsel Disfonksiyon" kursu
2022-ci ildə International Functional Cosmetic Gynecology Hands-on Course
2024-ci ildə "Advances in Fetal Medicine Course ", London
World Journal of Surgery (may 2018) - "Efficacy of cervical cerclage in pregnant women with cervical insufficiency "- adlı məqaləsi dərc edilmişdir.
11th SEUD Annual Congress 2025 Prague, Czech Republic', updated_at = NOW() WHERE slug = 'dr-melek-qafarli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya - Siyami Ersek Göğüs Kalp və Damar Cerrahisi Eğıtım ve Araştırma Hastanesi, Türkiyə, İstanbul
Kompleks koronar müdaxilələr,CTO - Memorial Bahçelievler Xəstəxanası, Türkiyə, İstanbul
İnvaziv kardiologiya

İş təcrübəsi:
2021 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-meryam-qafarova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Nevrologiya
EEQ (Elektroensefaloqrafiya)
Yuxu elektroensefaloqrafiyası
Video-monitorinq elektroensefaloqrafiyası
Epilepsiya və onun növləri
Baş ağrıları
Miqren
Gərginlik tipli baş ağrısı
Klaster baş ağrısı
Histamin baş ağrısı
Seksual baş ağrıları və digər baş ağrısı növləri
Beyin qan dövranı pozğunluqları
Kəskin və xroniki beyin qan dövranı pozğunluqları
İşemik insult
Hemorragik insult
Vaskulitik tipli pozğunluqlar
Yaddaş pozğunluqları və demensiyalar
Yaşlı və gənclərdə yaddaş zəifləməsi
Demensiya və onun növləri:
Alzheimer xəstəliyi
Frontotemporal demensiya və s.
Periferik sinir sistemi xəstəlikləri
Polineyropatiyalar
Kəskin formalar
Xroniki formalar
Psixonevroloji pozuntular
Depressiya
Təşviş və həyəcan pozuntuları
Panik ataklar
Onurğa və onurğa beyni xəstəlikləri
Onurğa osteoxondrozu
Disk yırtıqları
Radikulitlər və digər onurğa problemləri
Mərkəzi sinir sisteminin iltihabi və demielinizəedici xəstəlikləri
Meningitlər
Ensefalitlər
Dağınıq skleroz (Multiple Skleroz)
ADEM
Leykoensefalopatiyalar
Serebral ifliclər
Parezlər

İş təcrübəsi:
2007- Həkim-nevropatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-merziyye-muxtarova';
UPDATE doctor SET bio = 'İnsult Mərkəzinin (STROK) şöbə müdiri.
Şöbə: Nevrologiya', updated_at = NOW() WHERE slug = 'dr-minare-cerkezzade';
UPDATE doctor SET bio = 'Bakıdan dəvətli Uroloq-Androloq.', updated_at = NOW() WHERE slug = 'dr-mirhikmet-qiyasov';
UPDATE doctor SET bio = 'Ümumi cərrah.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Öd kisəsi və öd yolları cərrahiyyəsi (laparoskopik və açıq)
Yırtıq əməliyyatları (qasıq yırtığı, göbək yırtığı, əməliyyatdan sonrakı yırtıqlar)- laparoskopik və açıq
Mədə xəstəliklərinin cərrahiyyəsi
Nazik və yoğun bağırsaq əməliyyatları
Qaraciyər və dalaq cərrahiyyəsi
Büzdümün dermoid kistasının ləğvi
Anal çat, anal fistul əməliyyatları
Babasilin lazerlə və klassik yolla əməliyyatları
Diafraqmal yırtığın laparoskopik yolla bərpası.

İş təcrübəsi:
2011-2012 - Respublika Klinik Xəstəxanası
2012-2016 - ATU Tədris Cərrahiyyə Klinikası
2014-2015 - İnönü Universiteti, Orqan transplantasiyası institutu, Malatya, Türkiyə
2016-2018 - Avrasiya Hospital
2018 - Bakı Şəhəri 20 saylı klinik xəstəxana
2019-2020 - N.Tusi adına klinika, ümumi cərrah, cərrahiyyə şöbəsinin müdiri
2020-2023 - Leyla Medical Center, ümumi cərrah, poliklinika şöbəsinin müdiri
2023 - Yeni Klinika: Ümumi cərrah.', updated_at = NOW() WHERE slug = 'dr-mohsum-esgerov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
0-16 yaş uşaqların müayinə və müalicəsi
Uşaqların fiziki inkişafının qiymətləndirilməsi
Pediatrik chek up
Anemiyalar
Avitaminoz və hipovitaminozlar
Tənəffüs sistemi xəstəlikləri
Həzm sistemi xəstəlikləri
Sidik yollarının infeksion xəstəlikləri
Helmintozlar

Konfranslar:
2019-cu il Azərbaycan Respublikası Səhiyyə Nazirliyi "Uşaqlarda boy problemləri"
2021-ci il İstinye Universitesi "Yenidoğan Temel bakım ilkeleri ve Riskli yenidoğan"
2021-ci il İstanbul Universitesi "Solunum Fonksiyon Testleri ve Arter Kan Qazı Değerlendirilmesi" eğitim programı
2021-ci il Sağlık Bilimleri Üniversitesi "Talasemi Sempozyumu"
2021-ci il LİV Hospital ve Istiniye Üniversitesi-Çocuk Hematoloji Onkoloji Bakım Kursu', updated_at = NOW() WHERE slug = 'dr-munevver-hesenova';
UPDATE doctor SET bio = 'Nevroloq.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Müxtəlif növ baş ağrıları
Başgicəllənmələr
Depressiya və digər nevrotik pozuntular
Serebrovaskulyar xəstəliklər (işemik ve hemorragik insult)
Hərəkət pozuntuları (Parkinson xəstəliyi, narahat ayaqlar sindromu, tremor)
Epilepsiya
Müxtəlif növ onurğa problemləri və radikulopatiyalar
Yuxu pozğunluğu
Sinir-əzələ xəstəlikləri
Neyropatiyalar.

İş təcrübəsi:
2015 - "İstanbul Şişli Etfal Eğitim ve Araştırma" Xəstəxanası:1 aylıq təcrübə kursu
Rezidentura təhsili zamanı Tədris Terapevtik Klinikada 2 ay klinik nevrologiya və EEQ üzrə, Neyrocerrahiyyə Xəstəxanasında isə 2 ay neyrocərrahiyyə və lumbar punksiya üzrə rotasiyada olub.

Üzvlük:
Milli Nevroloqlar Assosasiyası üzvü
Epilepsiya Əleyhinə Beynəlxalq Liqa üzvü (İİAE)', updated_at = NOW() WHERE slug = 'dr-munevver-muxtarova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Tənəffüs orqanları xəstəlikləri
Hipertoniya və ürəyin işemik xəstəlikləri
Qan xəstəlikləri
Qurd xəstəlikləri
Müxtəlif virus və bakterial mənşəli xəstəliklər
Şəkərli diabet, tip 2
Qalxanvari vəzin xəstəlikləri
Allergik xəstəliklər
Mədə-bağırsaq xəstəlikləri
Qaraciyər xəstəlikləri
Sidik-ifrazat sistemi xəstəlikləri', updated_at = NOW() WHERE slug = 'dr-musa-eliyev';
UPDATE doctor SET bio = 'Uzman mama-ginekoloq.
Şöbə: Mamalıq və Ginekologiya

İş təcrübəsi:
Abşeron Rayon Mərkəzi Xəstəxanası - Həkim-mama-ginekoloq
2023 - Yeni Klinika: Həkim-mama-ginekoloq.', updated_at = NOW() WHERE slug = 'dr-musfiqe-quliyeva';
UPDATE doctor SET bio = 'Endokrinoloq-Dietoloq.

Fəaliyyət sahələri:
Şəkərli diabet (Tip 1 və Tip 2)
Şəkərsiz diabet
Hamiləlikdə (hestasion) diabet - Ana və döl üçün riskləri azaldan nəzarət və müalicə proqramı
Artıq çəki və piylənmə - Hormonal səbəblərin araşdırılması və endokrin yanaşmalarla müalicə
Ağır dərəcəli çəki azlığı - Maddələr mübadiləsi və hormon çatışmazlıqlarının qiymətləndirilməsi
Qalxanabənzər vəzi xəstəlikləri - Hipotiroidizm, hipertiroidizm, düyünlü zob və s.
Hipofiz vəzi xəstəlikləri - Hormon ifrazının azalması və ya artması ilə bağlı pozuntular (akromqeliya, prolaktinoma və s.)
Böyrəküstü vəzi xəstəlikləri - Kortizol, aldosteron və digər hormon balansı pozuntuları (Addison, Kuşinq sindromları və s.)
Menstrual tsiklin pozulması - Hormonal disbalans, polikistoz, amenoreya və s.
Hirsutizm - Qadınlarda kişi tipli tüklənmənin endokrin səbəblərinin aşkarlanması
Qadınlarda sonsuzluq - Yumurtlama problemləri və hormon pozğunluqlarının diaqnostikası
Kişilərdə hormonal mənşəli sonsuzluq - Testosteron çatışmazlığı, prolaktin yüksəkliyi və digər səbəblərin araşdırılması
Osteoporoz - Sümük sıxlığının azalması, sınıq riskinin qiymətləndirilməsi və müalicəsi
Digər metabolik sümük xəstəlikləri - D vitamini çatışmazlığı, paratiroid vəzi xəstəlikləri və s.
Hipertoniya - Yüksək qan təzyiqinin qalxanabənzər, böyrəküstü vəzi və digər hormonal səbəblərlə əlaqəsinin dəyərləndirilməsi

Konfranslar:
2016-cı ildə ATU nun Tədris Terapevtik klinikasında endokrinoligiya üzrə iş yerində təcrübə
2016-cı ildə Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutunda Diabetologiyanın aktual problemləri üzrə, 2018-ci ildə Endokrinologiya ixtisası üzrə təkmilləşmə kursları
2016-cı ildə Rusiya Federasiyasının Moskva şəhərində ,Elmi -Tədqiqat Endokrinologiya İnstitunda qalxanvari vəzi xəstəlikləri və piylənmə üzrə ixtisasartırma kursu
2017-ci ildə Həkimlərin Sertifikasiya imtahanınını uğurla keçmişəm
2018-ci ildə Sağlamlıq Strategiyası Təlim Mərkəzində Nutrisologiya kursu və həmin ildə Piylənmənin idarə olunması kursu keçərək ANDOP məzunu
2022-ci il Fonksiyonel Tıp Okulu "Kadın ,Erkek ve Tiroid hormonları ,HPGT aksi modülünü bitirmişəm
2022-ci ildə Həkimlərin Sertifikasiya imtahanını uğurla keçmişəm
2022-ci il İstanbul Yeditepe Universitesi Hastaneleri endokrinoloji bölümündə ixtisasartırma kursu
2022-ci il İstanbul Mədəniyyət Universiteti Endokrinoloji günləri', updated_at = NOW() WHERE slug = 'dr-musgunaz-eliyeva';
UPDATE doctor SET bio = 'Patohistologiya üzrə mütəxəssis.

Fəaliyyət sahələri:
Sinir sistemi şişlərinin patohistologiyası və sitologiyası
Həzm sistemi şişlərinin patohistologiyası və sitologiyası
Tənəffüs sisteminin şişlərinin patohistologiyası və sitologiyası
Qadın cinsiyyət sistemi şişlərinin patohistologiyası və sitologiyası
Sidik-cinsiyyət sisteminin patohistologiyası və sitologiyası
Yumşaq toxumanın patohistologiyası və sitologiyası
Sümük-əzələ sistemi şişlərinin patohistologiyası və sitologiyası
Dərinin patohistologiyası və sitologiyası
Endokrin sistemin patohistologiyası və sitologiyası
Molekulyar patoloji

Konfranslar:
2018-ci il- 27-ci Türk Patoloji konqresi
2021-2022-ci illər Anadolu Sağliq Mərkəzi (In Affilations with Johns Hopkins Medicine) - Onkopatoloji, Molekulyar patoloji, Tumor krulu kursu
2024-cü il - Neyropatoloji - Yapılandırılmış Uzmanlık Eğitim kursu', updated_at = NOW() WHERE slug = 'dr-nagi-zeynalov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Şüa diaqnostika

İş təcrübəsi:
2011- Həkim-şüa diaqnostik, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nahide-qurbanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Göz xəstəlikləri- Beyoğlu Göz Eğitim və Araşdırma Xəstəxanası və Bagcılar Eğitim və Araşdırma Xəstəxanası Göz bölümü, Türkiyə, İstanbul

İş təcrübəsi:
2006-2008 Həkim-oftalmoloq, Beyoğlu-Göz Eğitim və Araşdırma Xəstəxanası Türkiyə, İstanbul
2008-2009 Həkim-oftalmoloq, Bagcılar-Eğitim və Araşdırma Xəstəxanası, Göz bölümü, İstanbul, Türkiyə
2010- Həkim-oftalmoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-naile-abdulkerimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal ultrasəs müayinəsi (qaraciyər, öd kisəsi, dalaq, mədəaltı vəzi, böyrəklər)
Neyrosonoqrafiya (bir yaşa qədər uşaqlarda beynin ultrasəs müayinəsi)
Bud-çanaq oynağının müayinəsi
Hamiləliyin geniş ultrasəs müayinəsi
Süd vəzilərinin müayinəsi (adətən yaşı 35-dən aşağı olan qadınlarda)
Fetal ultrasonoqrafiya (dölün 3D, 4D texnologiyası ilə müayinəsi)
Kiçik çanaq orqanlarının ultrasəs müayinəsi (uşaqlıq, yumurtalıqlar, prostat vəzi, toxum kisəcikləri, sidik kisəsi)
Doppleroqrafiya (aşağı və yuxarı ətraflar venalar və arteriyalar, ekstrakranial damarlar, qarın aortası, böyrək arteriyaları, portal sistemin doppleroqrafiyası)
Prostat vəzinin rektal USM
Qalxanabənzər vəzin müayinəsi
Timus vəzinin müayinəsi
Səthi toxumaların müayinəsi
Süd vəzilərinin müayinəsi (adətən yaşı 35-dən aşağı olan qadınlarda)
Göz dibinin ultrasəs müayinəsi və s.

Konfranslar:
1993- cü il Ə.Əliyev ad. Azərbaycan Dövlət Həkimləri Təkminləşdirmə İnstitutu Reanimasiya üzrə ixtisaslaşma kursu
2003- cü il Ə.Əliyev ad. Azərbaycan Dövlət Həkimləri Təkminləşdirmə İnstitutu Ultrasonoqrafiya üzrə ixtisaslaşma kursu
2010-cu və 2017-ci illər Ə.Əliyev adına Azərbaycan Dövlət Həkimlər Təkminləşdirmə İnstitutu Ultrasonoqrafiya üzrə təkminləşmə kursu
2018- cü il Qaziosmanpaşa Hospital İstanbul şəhəri Radiologiya Şöbəsi ixtisaslaşma kursu
2012-ci il və 2018 - ci illər Radiologiya (Şüa - diaqnostika) üzrə sertifikasiya kursu', updated_at = NOW() WHERE slug = 'dr-naile-agayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ürək çatışmazlığının diaqnostikası və müalicəsi
Klinik aritmologiya
Böyüklərdə anadangəlmə ürək qüsurları
Akut və xroniki koronar sindromların idarəolunması
Kardiomiopatiyaların qiymətləndirilməsi və müalicəsi
Müxtəlif mənşəli ürək əzələsi xəstəliklərinin diaqnostikası
Ürək xəstələrinin gündəlik nəzarəti, müntəzəm monitorinqi
Elektrokardioqrafiyanın (EKQ) oxunması və təhlili
Transezofageal Exokardioqrafiya', updated_at = NOW() WHERE slug = 'dr-naile-veliyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal USM (uşaqlarda və böyüklərdə)
Qalxanabənzər vəzinin (thyroid) USM-i
Süd vəzisinin USM-i
Ginekoloji USM (transabdominal və transvaginal)
Follikulometriya
Hamiləliyin təyini
Erkən hamiləlik USM-i
Hamiləlik skrininqi, dopplerometriya və 3D/4D müayinəsi:
1-ci skrininq: 11-14 həftə
2-ci skrininq: 18-21 həftə
3-cü skrininq: 28-31 həftə
Yumşaq toxuma USM-i
Limfa düyünlərinin USM-i
Uşaqlarda neyrosonoqrafiya

Konfranslar:
2005-ci ilin may ayında Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda "Ultrasəs müayinəsi" üzrə ixtisaslaşıb.
2005-ci ilin noyabr-dekabr aylarında Rusiya Tibb Elmlər Akademiyasının Mama-Ginekologiya və Perinatologiya Elmi Mərkəzində "Funksional diaqnostika" şöbəsində ultrasəs müayinəsi kursunu tamamlayıb (Prof. V.N. Demidovun rəhbərliyi altında).
Həmin mərkəzdə "Neyroexoqrafiya üsulu" üzrə kurs keçib.
2009-cu ildə Almaniyanın Berlin Vivantes Klinikasının Nükoln filialında Mama-Ginekologiya şöbəsində "Şüa diaqnostikası" kursunu bitirib.
2015-ci ildə Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda "Şüa diaqnostikası" üzrə təkmilləşmə kursu keçib.', updated_at = NOW() WHERE slug = 'dr-natevan-veliyeva';
UPDATE doctor SET bio = 'Nefroloq.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Kəskin və xroniki böyrək xəstəliyi
Kəskin və xroniki qlomerulonefritlər
Kəskin və xroniki pielonefrit
Diabetik və hipertonik nefropatiya
Hamiləlik nefropatiyası
Xroniki sistit
Prostatit
Prostat vəzinin hipertrofiyası
Böyrək daşı xəstəliyi
Sidik yolları infeksiyaları

İş təcrübəsi:
2004-2010 - Respublika Klinik Xəstəxanası: Hemodializ şöbəsi -Həkim-nefroloq
2006-2007 - MedServis Tibb Mərkəzi: Həkim-nefroloq
2010-2023 - Kliniki Tibbi Mərkəz: Nefrologiya və Hemodializ şöbəsi - Həkim-nefroloq', updated_at = NOW() WHERE slug = 'dr-natiq-mesimov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorakal və transezofageal exokardioqrafiya, Stress-exokardioqrafiya, pre-op və post-op qapaq xəstəliklərinin dəyərləndirilməsi, böyüklərdə anadangəlmə ürək qüsurlarının exokardioqrafiyası - Mehmet Akif Ersoy Göğüs Kalp ve Damar Cerrahisi Eğitim və Araşdırma Hastanesi, Türkiyə, İstanbul
3D-Exokardioqrafiya - Türkiyə, Eskişehir
Exokardioqrafiya, Transtorakal və Transezofageal Exokardioqrafiya, stress exokardioqrafiya, 4D Strain-speckle tracking, struktur ürək xəstəlikləri və transkateter müdaxilələr (PFO-ASD-LAA qapadılması, TAVİ və Mitral-TEER)- European İnterbalkan Medical Center Xəstəxanası, Yunanıstan, Saloniki

İş təcrübəsi:
2025 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nergiz-mustaqzade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Pediatriya - Ankara Universiteti Tibb fakültəsi, Pediatrik İmmunologiya və Allerqologiya anabilim dalı, Türkiyə, Ankara

İş təcrübəsi:
2021- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nergiz-osmanli';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ürək-damar xəstəlikləri
Pulmonologiya xəstəlikləri
Qastroenterologiya xəstəlikləri
Dayaq-hərəkət xəstəlikləri
Dermatologiya xəstəlikləri və s.

Konfranslar:
Almaniyanın Gissen Universitet Klinikasında 3-aylıq təcrübə kursları.', updated_at = NOW() WHERE slug = 'dr-nergiz-selimxanova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Yeni doğulmuş körpələrin reanimasiyası - Dr. Sami Ulus Kadın Doğum, Çoçuk Sağlığı ve Hastalıkları Eğitim ve Araştırma Hastanesi, Türkiyə, Ankara
Neonatal reanimasiya - Türkiyə, Ankara

İş təcrübəsi:
2018- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nergiz-veliyeva';
UPDATE doctor SET bio = 'Pediatr, Azərbaycan Pediatriya Cəmiyyətinin üzvü.

Fəaliyyət sahələri:
0-18 yaş uşaqların müayinə və müalicəsi
Tənəffüs yolu xəstəlikləri
Həzm sistemi xəstəlikləri
Sidik yolu xəstəlikləri
İnfeksion xəstəliklər
Allergik xəstəliklər
Profilaktik baxışlar, peyvəndlərin aparılması
Boy, çəki və inkişafın izlənməsi
Ana südü və düzgün qidalanma məsləhətçisi', updated_at = NOW() WHERE slug = 'dr-nermin-bagirova';
UPDATE doctor SET bio = 'Uzman terapevt.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Endokrinoloji patologiyalar (şəkərli diabet, qalxanvari vəz, böyrəktüstü vəz xəstəlikləri)
Arterial hipertenziya (qan təzyiqinin yüksəlməsi)
Anemiyalar
Revmatoloji xəstəliklər
Mədə-bağırsaq və qaraciyər xəstəlikləri
Tənəffus sistemi xəstəlikləri
Xərcəng diaqnostikası.

İş təcrübəsi:
07-09.2014 - İstanbul Eğitim Arastırma Xəstəxanası: Təcili yardım və daxili xəstəliklər kursu
2017-2018 - Ege Universiteti Tibb fakültəsi: Tibbi staj.', updated_at = NOW() WHERE slug = 'dr-nermin-beydulova';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 'dr-nermin-emiraslanova';
UPDATE doctor SET bio = 'LOR.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'dr-nermin-eyyubova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Neonatal Reanimasiya və İntensiv terapiya - "Sağlık Bilimleri Universitesi Gülhane Tıp Fakültesi" Türkiyə, Ankara

İş təcrübəsi:
2023 - Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nermin-meherremova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Pediatriya, neonatologiya - Ankara Universiteti Tibb Fakültəsi, Türkiyə, Ankara
Yenidoğulmuşların reanimasiyası və intensiv terapiyası - Bursa Uludağ Universiteti Tibb Fakultəsi, Türkiyə, Bursa
"Təkmilləşmiş uşaq sağlamlığı" İmperial Kollec, İngiltərə, London

İş təcrübəsi:
2011 - Həkim-pediatr (neonatoloq), Gəncə Müalicə Diaqnostika Mərkəzi, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nermin-talibova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal (qarın boşluğu)
USM
Abdominal Pediatrik USM
Qalxanabənzər Vəzi USM
Süd Vəzi USM
Ginekoloji USM
Yuxarı və Aşağı Ətrafların
Arteriya və Venalarının
Rəngli - Doppler Müayinəsi
Karotis və Vertebral Arteriyaların Rəngli Doppler Müayinəsi
Renal (böyrək) Arteriyaların Rəngli Doppler Müayinəsi', updated_at = NOW() WHERE slug = 'dr-nermine-mustafayeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və transezofagial exokardioqrafiya - Mehmet Akif Ersoy Göğüs Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə İstanbul

İş təcrübəsi:
2025- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nezrin-abidova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

Fəaliyyət sahələri:
Stomatologiya - Okmeydanı Ağız və Diş xəstəlikləri Xəstəxanası, Türkiyə, İstanbul

İş təcrübəsi:
2018 - Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nezrin-ehmedova';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuzluğun tam müayinəsi və müalicəsi
Yumurtlama funksiyasının yoxlanılması (folikulyasiya izlənməsi, hormonal analizlər)
Hamiləliyin izlənməsi (Normal hamiləlik və Riskli hamiləlik )
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi
Kolposkopiya
Endokrinoloji ginekologiya
Diatermokoaqulyasiya (DTK) - Uterin boynunda eroziyalar və digər dəyişikliklərin elektrik cərəyanı ilə yandırılaraq müalicəsi
Doğuş və ginekoloji cərrahi əməliyyatlar
Təbii doğuş və doğuşa hazırlıq
Keysəriyyə əməliyyatı (indikasiya olduqda)
Müxtəlif Ginekoloji əməliyyatlar (Yumurtalıq və uşaqlıq törəmələrinin çıxarılması, Miomektomiya, Laparoskopik və açıq əməliyyatlar, Uşaqlığın alınması (histerektomiya), Endometriozun cərrahi müalicəsi)

Konfranslar:
2014-cü il ATU REK 1-də Hamiləlikdə böyrək patologiyaları mövzusu, məruzəçi
2015-ci il "Hamiləlikdə rezus izoimmunizasiya seminar, məruzəçi patologiyaları" mövzusu, məruzəçi
2016-cı il Hamiləliyinin III trimestr qanaxmaları seminar,məruzəçi
2019-cu il "Onkoginekoloji xəstəliklərə müasir yanaşma konfrans
2021-ci il Reproduktiv sağlamlıq və operativ ginekologiya
2021-ci il Döldəki qüsurların prenatal diaqnostikası və bətndaxili invaziv müdaxilələr
2021-ci il Hamiləliyə hazırlıq: Müasir sübutlu standartlar
2021-ci il "Pediatriyada aktual mövzular: müasir tibbi yeniliklərin təcrübədə tətbiqi"
2022-ci il COVID-19 pandemiyası zamanı mamalıq və ginekoloji problemlərə müasir baxış
2022-ci il ÜTCF İVF Okulu
2022-ci il Hamiləlikdə genital və ekstragenital xəstəliklər', updated_at = NOW() WHERE slug = 'dr-nezrin-esgerova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Hipofiz xəstəlikləri - Türkiyə İstanbul
Onurğa deformasiyaları düzəldilməsi manevraları - Türkiyə İstanbul
Minimal İnvaziv onurğa cərrahiyyəsi - Türkiyə İstanbul
Beyin damarlarının mikrocərrahi yolla şuntlanması - Amerika Birləşmiş Ştatları, Wisconsin, Madison
Onurğa cərrahiyyəsi və manevraları - Amerika Birləşmiş Ştatları, Wisconsin, Madison
Periferik Sinir cərrahiyyəsi - Amerika Birləşmiş Ştatları, Wisconsin, Madison

İş təcrübəsi:
2022-2023 Neyrocərrah, İstanbul Universiteti Cerrahpaşa Neyrocərrahiyə Mərkəzi, İstanbul Memorial Xəstəxanası Onurğa Mərkəzi, Türkiyə, İstanbul
2023- - Araşdırmacı-Neyrocərrah, Madison Universiteti Neyrocərrahiyyə Mərkəzi, Amerika Birləşmiş Ştatları, Wisconsin
2023-2024 Həkim-neyrocərrah, Kliniki Tibbi Mərkəz, Azərbaycan, Bakı
2024 - Həkim-neyrocərrah, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nicat-bayramli';
UPDATE doctor SET bio = 'Bakıdan dəvətli Allerqoloq.

Fəaliyyət sahələri:
Tənəffüs yolu allergiyaları
Astma və digər tənəffüs yolu allergiyaları
Allergik rinit (burun allergiyası)
Pollinoz (mövsümi allergiya)
Kəskin və xroniki övrə (bronxit)
Dəri və yumşaq toxuma allergiyaları
Atopik dermatit
Allergik kontakt dermatit
Allergik konyunktivit (göz allergiyası)
Angionevrotik ödem
Dərman allergiyası
Qida allergiyaları
Qida allergiyası (ümumi)
Qlüten allergiyası
Dəri allergiya testləri (prick test və s.)
Spirometriya (ağciyər funksiyasının ölçülməsi)
İmmunoterapiya (Allergen Spesifik İmmunoterapiya - ASİT)
Allerqiya simptomlarının farmakoloji idarəsi və nəzarəti

Konfranslar:
2018-ci il - "Allerqologiyada Molekulyar diaqnostika 2" konfransı
2019-ci il - Avropa Allergiya və Klinik İmmunologiya Akademiyasının üzvü
2020-ci il - EAACI Digital Congress 2020 of the European Academy of Allergy and Clinical Immunology
2021-ci il - "Atopik dermatit və digər allergik dəri xəstəlikləri" seminarı
2024-ci il - "Türk Toraks Derneği Azərbaycan temsilçiliği, Azərbaycan Pulmonolojı Sempozyumu"
2024-ci il - EAACİ Congress Avropa Allerqologiya assosiyasiyası və klinik immunologiya, İspaniya-Valensiya beynalxalq konfrans', updated_at = NOW() WHERE slug = 'dr-nicat-efendizade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
İnvaziv kardiologiya, Ondokuz Mayıs Universiteti Təhsil və Araşdırma Xəstəxanası, Samsun, Türkiyə

İş təcrübəsi:
2024- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nicat-elekberov';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım (uşaq) üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

Müalicə etdiyi xəstəliklər:
0-18 yaş uşaqlar üçün Təcili və Təxirəsalınmaz yardım Kritik xəstə dəyərləndirilməsi
Allergik xəstəliklər
Mədə-bağırsaq sistemi xəstəlikləri
Müxtəlif virus və bakterial mənşəli xəstəliklər
Tənəffüs sistemi xəstəlikləri
Sidik yollarının infeksiyaları
Anemiyalar
Qurd xəstəlikləri və s.

İş təcrübəsi:
2015 - Medi Club Uşaq reanimasiya şöbəsi: Pediatr (assisent)
2016-2019 - Mədinə Tibb Mərkəzi: Həkim Pediatr
2019-2024 - Xızı rayonu Mərkəzi Xəstəxanası, Giləzi ASM: Ailə həkimi (pediatr).', updated_at = NOW() WHERE slug = 'dr-nicat-mehraliyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təcili tibbi yardım xidməti və ilkin stabilizasiya
(Kəskin vəziyyətlərdə ilkin müdaxilə və həyat funksiyalarının bərpası)
Şok və həyati təhlükəli vəziyyətlərin idarə olunması
(Kardiogen, hipovolemik, anafilaktik, septik şok və s.)
Reanimasiya və reanimasyon protokolları
(KPR, ACLS, BLS, travma hallarında ATLS və s.)
Təcili diaqnostik prosedurlar və ilkin tibbi müayinə
(EKQ, USM, FAST, laborator analizlərin təhlili)
Travmatologiya və ortopedik təcili yardım
(Qırıq, çıxıq, kəsik və digər travmatik hallar)
Kəskin infeksion və toksikoloji vəziyyətlər
(Zəhərlənmələr, yüksək hərarət, sepsis, anafilaksiya)
Kəskin kardioloji və pulmonoloji hallar
(İnfarkt, ürək ritm pozğunluqları, ağciyər emboliyası, astma tutmaları və s.)
Nevroloji təcili hallar
(İnsult, qıcolmalar, şüur pozulmaları)
Psixotibbi və davranış pozuntularında ilkin tibbi yardım
(Psixotik epizodlar, intihar riski olan xəstələrin ilkin qiymətləndirilməsi və müdaxiləsi)', updated_at = NOW() WHERE slug = 'dr-nicat-necefov';
UPDATE doctor SET bio = 'Uşaq Sağlamlığı və Xəstəlikləri Uzmanı.
Şöbə: Pediatriya

Müalicə etdiyi xəstəliklər:
Sağlam uşaq izlənməsi, böyümə və inkişaf dəyərləndirilməsi
Qidalanma
Anemiyalar
Mədə-bağırsaq sistemi xəstəlikləri
Tənəffüs sistemi xəstəlikləri
Allergik xəstəliklər
Sidik-ifrazat sistemi xəstəlikləri
İnfeksiyon xəstəliklər
Yenidoğulmuşların aylıq rutin müayinələri.', updated_at = NOW() WHERE slug = 'dr-nigar-bayramova';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Somatika və STROK Mərkəzi', updated_at = NOW() WHERE slug = 'dr-nigar-bayramova-yeniklinika';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qarın boşluğu orqanlarının ultrasəs müayinəsi
Kiçik çanaq orqanlarının ultrasəs müayinəsi (Transabdominal və/və ya transvaginal ginekoloji müayinə)
Hamiləlik dövründə Ultrasəs müayinələr
Süd vəzisinin Ultrasəs müayinəsi
Qalxanabənzər vəzi və boyun nahiyəsinin ultrasəs müayinəsi
Müxtəlif nahiyələrin limfa düyünlərinin ultrasəs müayinəsi
Boyun, qoltuqaltı, qasıq və digər sahələrdə limfa vəzilərinin ultrasəs müayinəs
Damarların Doppler müayinəsi
Əzələ və yumşaq toxumaların ultrasəs müayinəsi
Timuz vəzisinin ultrasəs müayinəsi
Uroloji ultrasəs müayinə
Uşaqlarda neyrosonoqrafiya və bud çanaq ultrasəs müayinəsi

Konfranslar:
2003-2006-ci il Moskva şəh, Rusiya Tibb Elmləri Akademiyasının Elmi Cərrahiyyə Mərkəzi "Qarın boşluğu üzvlərinin ultrasəs müayinəsi" "Ultrasəs dopleroqrafiyası"
2005-ci il Moskva şəh., Rusiya Elmi Mama-Ginekologiya və Perinatologiya Mərkəzi: "Mama-ginekologiyada USM metodları"
2006-ci il Moskva şəh., Rusiya Prezident yaninda Tibbi Elmi-tədris Mərkəzi: "Ultrasəs dopleroqrafiyasının horizontları"
2006-2007-2009 cu illərdə Moskva şəh., Rusiya Diplomdansonraki Tibb Təhsil Akademiyası: "Kardiologiyada ultrasəs diaqnostika (Exokardioqrafiya)""Mama-ginekologiyada dopleroqrafiya" "Uşaq və böyüklərdə anadangəlmə və qazanılmış ürək qüsurlarının Exokardioqrafiyası" "Damar sisteminin kompleks ultrasəs müayinəsi"
2012-ci il Madrid şəh., İspaniya Dünya Ultrasəs cəmiyyəti konqresi,Euroson
2015-2018-ci illər Moskva şəh., Rusiya İSUOG və RTTUDMD təşkili ilə: Tibbdə ana və dölün ultrasəs diaqnostikasının aktual sualları "Dölün irsi xəstəliklərinin perinatal diaqnostikası"
2015-ci il Bakı şəh, Azərbaycan Beynəlxalq Ultrasəs müayinəsi Akademiyasının təşkili ilə "Visus Kurs"
2016-ci il Krakov şəh., Polşa İSUOG təşkili ilə "Fetal Kardioqrafiya kursu"
2016-ci il Roma şəh., İtaliya Mama və ginekologiyada şüa diaqnostikası beynəlxalq konqresi
2017-ci il Bakı şəh., Azərbaycan İSUOG təşkili ilə "Dölün və ginekoloji ultrasəs müayinələrində son nəaliyyətlər"
2017-ci il Vyana şəh., Avstriya "Ginekoloji ve embrion ultrasəs diaqnostikasında yeni nəaliyyətlər"
2017-ci il Bakı şəh., Azərbaycan "Kardiyal diseksiyonu və embrion exokardiyografiya kursu"
2018-ci il Moskva şəh., Rusiya Fetal Tibb Mərkəzi:"Fetal exokardioqrafiya"
2019-cu il Tivat şəh., Çernoqoriya, Dölün inkişaf qüsurlarının erkən diaqnostikası: Son nəaliyyətlər və ve inkişaf perspektivləri.', updated_at = NOW() WHERE slug = 'dr-nigar-hemidova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal ultrasəs müayinəsi (qaraciyər, öd kisəsi, dalaq, mədəaltı vəzi, böyrəklər)
Neyrosonoqrafiya (bir yaşa qədər uşaqlarda beynin ultrasəs müayinəsi)
Bud-çanaq oynağının müayinəsi
Hamiləliyin geniş ultrasəs müayinəsi
Süd vəzilərinin müayinəsi (adətən yaşı 35-dən aşağı olan qadınlarda)
Fetal ultrasonoqrafiya (dölün 3D, 4D texnologiyası ilə müayinəsi)
Kiçik çanaq orqanlarının ultrasəs müayinəsi (uşaqlıq, yumurtalıqlar, prostat vəzi, toxum kisəcikləri, sidik kisəsi)
Doppleroqrafiya (aşağı və yuxarı ətraflar venalar və arteriyalar, ekstrakranial damarlar, qarın aortası, böyrək arteriyaları, portal sistemin doppleroqrafiyası)
Prostat vəzinin rektal USM
Qalxanabənzər vəzin müayinəsi
Timus vəzinin müayinəsi
Səthi toxumaların müayinəsi
Süd vəzilərinin müayinəsi (adətən yaşı 35-dən aşağı olan qadınlarda)
Göz dibinin ultrasəs müayinəsi və s.', updated_at = NOW() WHERE slug = 'dr-nigar-hesenova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qarın boşluğunun USM
Ginekoloji USM
Süd vəzilərinin USM
Səthi toxumaların USM
Qalxanabənzər vəzin USM
Uroloji USM
Neyrosonoqrafiya
Bud-çanaq USM
Hamiləliyin skrininqi, doppler müayinəsi

Konfranslar:
Bir çox ölkədaxili konfranslarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'dr-nigar-ismayilova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ürək-Damar Cərrahiyyəsi

Fəaliyyət sahələri:
Ürək-damar cərrahiyyəsi
Vaskulyar və endovaskulyar cərrahiyyə - Şimali Kipr Türk Cümhuriyyəti, Girne

İş təcrübəsi:
2016 - Həkim-ürək-damar cərrahı, Mərkəzi Klinika, Azərbaycan, Bakı
2024- Müəllim, İ.M. Seçenov adına birinci Moskva Dövlət Tibb Universitetinin Bakı fililalı, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nigar-kazimzade';
UPDATE doctor SET bio = 'Endokrinoloq.
Şöbə: Somatika və STROK Mərkəzi', updated_at = NOW() WHERE slug = 'dr-nigar-memmedli';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Abdominal ultrasəs müayinəsi: (qaraciyər, öd kisəsi, mədəaltı vəzi, dalaq, böyrəklər, sidik kisəsi, uşaqlıq-yumurtalıqlar, prostat vəzi)
Neyrosonoqrafiya: (1 yaşa qədər uşaqlar beynin ultrasəs müayinəsi)
Bud-çanaq oynağının müayinəsi
Süd vəzinin ultrasəs müayinəsi: (Adətən 35 yaşdan aşağı plan qadınlar)
Tetal ultrasonoqrafiya: (dölün 3D və 4D texnologiyası ilə müayinəsi)
Səthi toxumaların müayinəsi
Yumşaq toxumaların müayinəsi
Limfa vəzilərinin müayinəsi

Konfranslar:
2013-2014-ci il Ankara Nümunə Xəstəxanasında tibbi təcrübənin artırılması.', updated_at = NOW() WHERE slug = 'dr-nigar-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yenidoğulmuşların müayinəsi
0-1 yaş rutin müayinələr
Antropometrik və inkişaf müayinələri
Peyvənd təqviminə uyğun peyvəndöncəsi müayinələr
Pediatrik Check up müayinələri
Raxit profilaktikası və müalicəsi
Anemiya
Allergiyalar
Dəri xəstəlikləri
Qurd xəstəlikləri
Mədə-bağırsaq xəstəlikləri
Yuxarı və aşağı tənəffüs yollarının xəstəlikləri
Virus və bakteriya mənşəli xəstəliklər
Hiper və hipovitaminozlar

Konfranslar:
1998-ci il - Döşlə əmizdirmə proqramı, təlim
1998-ci il - Geniş immunizasiya proqramı, təlim
2006-ci il - Pediatrların tibbi elmi konfransı
2012-ci il - Respirator xəstəliklər, spesifik praktik konfrans
2018-ci il - "Uşaqlarda dişlərin sağlamlığının təminatı" adlı konfrans
2018-2019-2020-ci illər - BMJ jurnalın sertifikatları 177 ədəd
2023-cü il - Uşaqlarda xəstəliklərin menecmentinə dair konfrans
2024-cü il - Bəsləyici Qayğı üçün ailələrə dəstək, onlayn modul', updated_at = NOW() WHERE slug = 'dr-nigar-mustafayeva';
UPDATE doctor SET bio = 'USM həkimi,Avropa və Azərbaycan Radioloqlar Cəmiyyətinin üzvü.

Fəaliyyət sahələri:
Tiroid vəzinin ultrasəs müayinəsi
Süd vəzinin ultrasəs müayinəsi
Limfa düyünlərinin ultrasəs müayinəsi
Abdominal USM (böyüklərdə və uşaqlarda)
Uroloji USM (böyüklərdə və uşaqlarda)
Ginekoloji (abdominal-transabdominal) USM
Follekulmetriya
Hamiləlik: (hamiləliyin təyini, hamiləliyin detallı müayinəsi, hamiləliyin doppleremetriyası)
Yumşaq toxumanın ultrasəs müayinəsi

Konfranslar:
2018-ci il International Symposium on Reproductive Health and Infertility
2021-ci il ISOUG: 31st World Congress on Ultrasound in Obstetrics and Gynecology
2023-cü il Türkiyə Meternal Fetal Tıp və Perinatoloji Dernegi Ultrasongrofi Kongresi', updated_at = NOW() WHERE slug = 'dr-nigar-piriyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Qastroenteroloqiya və invaziv endoskopiya
Hepataloqiya, transplantaloqiya, qastroenteroloqiya və invaziv endoskopiya

İş təcrübəsi:
2018 - Həkim-qastroenteroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nigar-quliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

Fəaliyyət sahələri:
Cərrahi ixtisaslar üzrə anesteziya

İş təcrübəsi:
2021 - Həkim - anestezioloq-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nigar-sadlinskaya';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yenidoğulmuşların müayinəsi və inkişafın dəyərləndirilməsi
Üst və alt tənəffüs yolu xəstəlikləri
Mədə-bağırsaq xəstəlikləri
Allergik xəstəliklər
Anemiyalar
Sidik sistemi xəstəlikləri
Boy qısalığı və kilo azlığı
Avitaminoz, qurd xəstəlikləri, iştahsızlıq
Ana südü məsləhitçisi
Check up müayinələr

Konfranslar:
Türkiyə Səhiyyə Nazirliyi tərəfindən akredasiya olunmuş "Emzirme danışmanlığı eğitimi"
Azərbaycan Pediatriya Cəmiyyətinin 2-ci Milli Kongresi
II Azərbaycan-Türkiyə Pediatriya Günləri
Azərbaycan-Türkiyə-Naxçıvan ilk Pediatriya sempozyumu', updated_at = NOW() WHERE slug = 'dr-nihat-abdullayev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hipertoniya və Hipotoniyanın müayinə və müalicəsi
Təzyiqin gündəlik monitorinqi (Holter AT)
Ürəyin işemik xəstəliyi (ÜİX)
Miokard infarktından sonrakı vəziyyətlərin izlənməsi
Ritm pozuntuları (Aritmiyalar) - Bradikardiya, taxikardiya
Extrasistoliya, fibrilyasiya
24 saatlıq EKQ Holter monitorinqi
Kəskin və ya xroniki ürək çatışmazlığı
Ürək əzələsinin zəifləməsi
Ödem, nəfəs darlığı, zəiflik kimi əlamətlərlə mübarizə
Mitral klapan çatışmazlığı və ya daralması
Aortal stenoz və ya çatışmazlıq
Uşaqlarda və yeniyetmələrdə aşkar edilən ürək qüsurları
Miokardit (ürək əzələsinin iltihabı)
Perikardit (ürək qişasının iltihabı)
Kardiomiyopatiyalar
Dislipidemiya və metabolik risklər
Ateroskleroz riski olan xəstələrin müayinəsi və müalicəsi
Stress fonunda və psixosomatik ürək şikayətləri
Sinir mənşəli ürəkdöyünmələr, təngnəfəslik hissi
Panik atak və streslə bağlı kardial simptomlar
Ürəyin check-up proqramları
Risk faktorlarının qiymətləndirilməsi (ailəvi tarix, diabet, piylənmə və s.)

Konfranslar:
2010-cu il Kardiologiya və Exokardioqrafiya üzrə kurs Yüksek Eğitim Araşdırma Hastanesi, Ankara.', updated_at = NOW() WHERE slug = 'dr-nurane-azayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Sızanaq (Akne)
Dərinin göbələk xəstəlikləri
Atopik dermatit
Psoriaz
Ekzema
Neyrodermit
Dərinin bakterial dermatozları
Dərinin virus xəstəlikləri
Saç və dırnaq problemləri
Saç tökülməsi (Alopesiya) - Stress, hormonal pozuntular, dəmir defisiti, autoimmun xəstəliklər və genetik faktorlarla bağlı saç tökülməsinin araşdırılması və müalicəsi.
Dırnaq xəstəlikləri - Göbələk infeksiyaları, qidalanma pozğunluqları və travmalarla əlaqəli dırnaq deformasiya və patologiyalarının müalicəsi.
Dəri törəmələrinin müalicəsi və aradan qaldırılması
Dəri törəmələrinin götürülməsi - Xallar, papillomalar, fibromalar, lipomalar və digər dəri törəmələrinin dermatoskopik qiymətləndirilməsi və zərurət olduqda, krioterapiya, elektrokoaqulyasiya və ya cərrahi üsullarla çıxarılması.

Konfranslar:
2012-2013-cü illər Atopik Dermatitin Yerli Müalicəsinin Alqoritmləri
2014-cü il Azərbaycan Dermatoloji Cəmiyyəti və Türk Pediatrik Dermatoloji Dərnəyinin 1-ci Gündəmi
2014-cü il Dırnaq və Dərinin Göbələk Xəstəlikləri Müalicəyə Müasir Yanaşma Mövzusunda Simpozium
2014-cü il Atopik Dermatitin və Psoriazın Etiopatogenezinə və Müalicəsinə Müasir Yanaşma
2011-ci il Dermatologiyada Müasir Yanaşmalar Mövzusunda Beynəlxalq Konfrans
2015-ci il Akne Xəstəliyinin Kompleks Müalicəsi
2013-cü il Azərbaycan-Gürcüstan Dermatoveneroloji Konfransı
2017-ci il Allerqologiyada Molekulyar Diaqnostika
2019-cu il Azərbaycan Dermatoveneroloqlar Assosiasiyasının "Dermatovenerologiyanın Birliyi Naminə" Mövzusunda Birinci Beynəlxalq Konqresində iştirak etmişdir', updated_at = NOW() WHERE slug = 'dr-nurane-ibrahimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Əməliyyatların aparılması: intraamnional prostaqlandinlərin yeridilməsi, amniosentez, kolposkopiya, gisteroskopiya, elektro-, krio- və radiokoaqulyasiya, bartolin vəzilərin xaric edilməsi
Stasionarda xəstəyə gündəlik baxış keçirilmə
Ginekoloji xəstəliklərin, hamiləlik və doğuşların, doğuşdansonrakı dövrün fəsadlarının qarşısının alınması və azaldılması üzrə profilaktik tədbirlərin keçirilməsi
Sonsuzluğun konsultasiyası və müalicəsi
Klimaksın əvəzedici hormonal terapiyası
Bütün növ kontrasepsiya (uşaqliq daxili spiral, dərialtı implantant, kombinə edilmiş oral kontraseptivlər və s.
Uşaqlığın selikli qişasının diaqnostik və müalicəvi qaşınması
Diaqnostik və müalicə prosedurlarının aparılması

Konfranslar:
The Fetal Medicine Foundation - The 11-13 week scan, Doppler Ultrasound, Cervical assessmenta. FMF ID: 136163
Transfuziologiya kursu (13.01 - 25.01.2014)
Əvəzedici hormonal terapiya kursu (04.04 - 05.04.2014)
"Urgent Obstetrics" kursu (19.05 - 20.05.2014)
İnkişafdan qalmış hamiləlik kursu (09.06.2015)
Qadın sonsuzluğu kursu (03.05.2019 - 05.05.2019)
Ovarial stimulation kursu (04.05.2020 - 05.05.2020)', updated_at = NOW() WHERE slug = 'dr-nurida-zeynalova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Urologiya

İş təcrübəsi:
2023 - Həkim-uroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-nurlan-rzayev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qarın boşluğu USM
Ginekoloji USM
Süd vəzi USM
Uroloji USM
Qalxanabənzər vəzi USM
Karotis doppler
Aşağı ətrafların doppler müayinəsi

Konfranslar:
2018-2023-cü il Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmiləşdirmə İnstitutunda sertifikasiya
2018-ci il İSUOQ - Fetal Anomaliyalarin Erkən Diaqnostikasi
2012-2017-ci il Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmiləşdirmə İnstitutunda sertifikasiya', updated_at = NOW() WHERE slug = 'dr-nurlana-seyidova';
UPDATE doctor SET bio = 'Anestezioloq - Reanimatoloq.', updated_at = NOW() WHERE slug = 'dr-nurmehemmed-imanov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ginekoloji müayinə üsulları
Hamiləliyin aparılması
Hamiləliyin sonlandırılması
UDS (uşaqlıqdaxili spiralın qoyulması)
Ultrasəs müayinəsi
Sonsuzluğun müalicəsi
Uşaqlıqdan müalicə üçün materialın götürülməsi

Konfranslar:
1988-ci il Mama-Ginekologiya ixtisaslaşma kursu
2002-ci il Mama-Ginekologiya USM üzrə ixtisaslaşma', updated_at = NOW() WHERE slug = 'dr-nusabe-bayramova';
UPDATE doctor SET bio = 'Həkim-laborant.', updated_at = NOW() WHERE slug = 'dr-nusabe-bebirova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Tibbi Laboratoriya

Fəaliyyət sahələri:
Klinik və Hematoloji labarator müayinə, Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
İmmunoloji laboratoriya, Başkənt Universiteti, Türkiyə,Ankara

İş təcrübəsi:
1984-1987 Həkim-laborant, Qan köçürmə institutu, Azərbaycan, Gəncə
1987-1998 Laboratoriya müdiri, 1 nömrəli qadın məsləhətxanası, Azərbaycan, Gəncə
1998-2000 Həkim-laborant, Xalq təbabəti mərkəzi, Azərbaycan, Bakı
2001 Həkim-laborant, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ofeliya-humbetova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
İnvaziv kardiologiya - Cleveland Klinikası, ABŞ, Cleveland

İş təcrübəsi:
2011 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-oqtay-musayev';
UPDATE doctor SET bio = 'Uroloq-Androloq.

Fəaliyyət sahələri:
Genitouriya sahəsinin iltihabi xəstəlikləri
Cinsi yolla ötürülən infeksiyalar
Erektil disfunksiya, vaxtından əvvəl boşalma, kişi sonsuzluğu
BPH, prostat adenoması
Sidik pozğunluqları
Neoplazmalar
Fimoz, parafimoz, hidrosel, varikosel, spermatosel', updated_at = NOW() WHERE slug = 'dr-orxan-abusov';
UPDATE doctor SET bio = 'Terapevt - Endokrinoloq.

Fəaliyyət sahələri:
Hipofiz vəzi xəstəlikləri (akromeqaliya, kuşing xəstəliyi, prolaktinomalar, şəkərsiz diabet)
Qalxanabənzər vəzi xəstəlikləri (zəhərli zob, tireoiditlər, endemik ur)
Qalxanabənzər ətraf vəzi xəstəlikləri və osteoporoz (sümük kövrəkliyi)
Mədəalti vəzi xəstəliklər (şəkərli diabet, insulinomalar)
Böyrəküstü vəzi xəstəlikləri (müalicəyə tabe olmayan qan təzyiqi yüksəklikləri)
Hipogonadizm (hormonal səbəbli kişi sonsuzluğu)
Hirsutizm (qadınlarda kişi tipli tüklənmələr)
Lipid mübadiləsi pozğunluqları (xolesterin və triqliserid yüksəkliyi)
Artıq çəki, piylənmə, insulin dirənc

Konfranslar:
2018-ci il "Ulusal Obezite Kongresi" Ankara şəhəri.
2018-ci il "Hipofiz Sempozyumu" Ankara şəhəri
2019-cu il "Endokrinoloji və Metabolizma Hastalıkları, Kadin sağlığı ve Gebelik Sempozyumu", Ankara şəhəri.
2022-ci il Beynəlxalq diabetologiya konfransı, Moskva şəhəri', updated_at = NOW() WHERE slug = 'dr-orxan-esgerov';
UPDATE doctor SET bio = 'Uşaq cərrahiyyəsi şöbəsinin müdiri.
Şöbə: Reproduktiv Sağlamlıq və Ailə Planlaması Mərkəzi

İcra etdiyi əməliyyatlar:
Yenidoğulmuş və körpələrin anadangəlmə cərrahi xəstəlikləri
Kəskin qarın
Qaraciyər ve öd yollarının cərrahiyyəsi
Uşaqlarda endokrin cərrahiyyəsi
Laparoskopik və torakoskopik cərrahi əməliyyatlar
Endoskopiya ve bronxoskopiya
Uşaqlarda uroloji cərrahi xəstəliklər.', updated_at = NOW() WHERE slug = 'dr-orxan-ferzeliyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

İş təcrübəsi:
2023 - Həkim-ümumi cərrah, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-orxan-memmedov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

İş təcrübəsi:
2012-2017 Həkim-stomatoloq, İnteqrasiya təlimli internat tipli gimnaziya, Azərbaycan, Şəki
2017- Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-orxan-salmanov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Nevroloq.

Fəaliyyət sahələri:
Oynaq patologiyası və osteodegenerativ dəyişiklik (menisk yırtığı, tendonit və s.)
Fəqərələrarası diskin yırtıqları
Spondolit
Onurğa sütununun kifozu
Onurğa sütununun düzlənməsi
Karpal tunel sindromunun müalicəsi
Yuxu və yaddaş pozğunluqları
Travmadan sonra oynaqlarda yaranmış kantrakturanın bərpası
Uşaqlarda dayaq hərəkət sisteminin patologiyası
Miqrenin müalicəsi
Üz sinirinin iflici
Panik atak
Xroniki yorğunluğun müalicəsi

Konfranslar:
2019-cu il Türk Dünyası, Nevroloji konfrans
2022-ci il EMQ, infaziv nevrologiya və ümumi nevrologiya kursu. Türkiyə, İzmir', updated_at = NOW() WHERE slug = 'dr-penah-eliyarov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Anestesteziologiya və əməliyyatxana

İş təcrübəsi:
2011-2013 Həkim-anestezioloq-reanimatoloq, UNİ Klinika, Azərbaycan, Bakı
2013-2015 Həkim-anestezioloq, Oksigen Klinikası, Azərbaycan, Bakı
2015-2017 Həkim-anestezioloq-reanimatoloq, Şöbə müdiri, Milana Hospital, Azərbaycan, Bakı
2017-2018 Həkim-anestezioloq-reanimatoloq, Zəfəran Hospital, Azərbaycan, Bakı
2019 - Həkim-anestezioloq-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-pervane-qurbanova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Pediatr.

Fəaliyyət sahələri:
Yenidoğulmuşların müayinəsi və inkişafının dəyərləndirilməsi
0-18 yaş uşaqların rutin müayinəsi
Uşaqlarda inkişaf problemləri
Uşaqlarda anemiyalar
Tənəffüs sistemi xəstəlikləri
Həzm sistemi xəstəlikləri
Parazitar xəstəliklər
Sidik- cinsiyyət sistemi xəstəlikləri
Allergik xəstəliklər

Konfranslar:
2007-2010-cu illər Experience Certificate, Pediatric
2018-ci il AQHİB, Virus hepatitlərinin müasir problemləri adlı konfrans
2018-ci il ATİF, İnfeksion xəstəliklərin menecmenti kursu
2019-cu il Çocuk Acil və Yoğun Bakım Derneği, Pediatrik Reanimasiya kursu', updated_at = NOW() WHERE slug = 'dr-pervin-pasayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli və şəkərsiz diabet
Hamiləlikdə diabet
Artıq çəki və piylənmə
Ağır dərəcəli çəki azlığı
Qalxanabənzər vəzi xəstəlikləri
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Menstrual tsiklin pozulması
Hirsutizm (qadınlarda kişi tipli tüklənmə)
Kişi və qadınlarda sonsuzluğun endokrinoloji aspektlərinin dəyərləndirilməsi
Osteoporoz və digər metabolik xarakterli sümük xəstəlikləri
Hipertoniya və ya yüksək qan təzyiqinin endokrinoloji dəyərləndirilməsi

Konfranslar:
2015-ci il The Harvard Medical School CME- Metabolic syndrome.
2015- ci il American Board of İnternal Medicine.Endocrinology.Diabets.Metabolism.
2016-ci il "Современные технологии в эндокринологии» Санкт-Петербург.
2017-ci il SSTM "Klinik diyetologiya"
2018- SSTM "Основы нутрициологии»
2021-ci il T.C. Istanbul Universitesi. "Istanbul TIP Fakultesi 32.Endokrinologive Metabolizma Hastaliklari Mezumiyet sonrasi egitim toplantisi.
2022-ci il Beynəlxalq konqress "Kolchida"
2022-ci il Türkiye Endokrinoloji ve Metabolizma Hastaliklari Kongresi', updated_at = NOW() WHERE slug = 'dr-pervin-sadiqzade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Hepatologiya və invaziv endoskopiya- Bursa Uludağ Universiteti, Türkiyə, Bursa

İş təcrübəsi:
2025 - Həkim-qastroenteroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-qemer-sultanli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

İş təcrübəsi:
2020 Həkim-neyrocərrah, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-qemer-veliyeva';
UPDATE doctor SET bio = 'Dermatoveneroloq.', updated_at = NOW() WHERE slug = 'dr-rafiq-ferecov';
UPDATE doctor SET bio = 'Uşaq Nevroloqu.

Fəaliyyət sahələri:
xronik və ya kəskin baş ağrıları
baş gicəllənməsi
əzələ zəifliyi və əzələ ağrıları
yuxarı və ya aşağı ətraflarda spazmalar və ya titrəmələr
bel və boyun ağrıları
qıcolmalar və epileptik tutmalar
yaddaş zəifləməsi
yuxu pozulması
əsəbilik (nevroz)
eşitmə pozuntuları, o cümlədən, qulaqda küy
depressiya və ya həyacan, "panika" halları
aşağı və yuxarı ətraflarda keyləşmələr, uyuşmalar və ya ağrıya həssaslığın artması / azalması
üzdə keyləşmə
uşaqlarda diqqət əksikliyi və hiperaktivlik
uşaq serebral iflici
uşaqlarda sidik qaçırılması (enurez)', updated_at = NOW() WHERE slug = 'dr-raise-tahirova';
UPDATE doctor SET bio = 'Reanimatoloq-anestezioloq.
Şöbə: Anesteziologiya', updated_at = NOW() WHERE slug = 'dr-ramide-bayramova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Nevrologiya, EEQ və EMQ - Bursa Uludağ Universiteti, Türkiyə, Bursa

İş təcrübəsi:
2009 - Həkim-nevropatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ramile-qehremanova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təcili tibbi yardım xidməti və ilkin stabilizasiya
(Kəskin vəziyyətlərdə ilkin müdaxilə və həyat funksiyalarının bərpası)
Şok və həyati təhlükəli vəziyyətlərin idarə olunması
(Kardiogen, hipovolemik, anafilaktik, septik şok və s.)
Reanimasiya və reanimasyon protokolları
(KPR, ACLS, BLS, travma hallarında ATLS və s.)
Təcili diaqnostik prosedurlar və ilkin tibbi müayinə
(EKQ, USM, FAST, laborator analizlərin təhlili)
Travmatologiya və ortopedik təcili yardım
(Qırıq, çıxıq, kəsik və digər travmatik hallar)
Kəskin infeksion və toksikoloji vəziyyətlər
(Zəhərlənmələr, yüksək hərarət, sepsis, anafilaksiya)
Kəskin kardioloji və pulmonoloji hallar
(İnfarkt, ürək ritm pozğunluqları, ağciyər emboliyası, astma tutmaları və s.)
Nevroloji təcili hallar
(İnsult, qıcolmalar, şüur pozulmaları)
Psixotibbi və davranış pozuntularında ilkin tibbi yardım
(Psixotik epizodlar, intihar riski olan xəstələrin ilkin qiymətləndirilməsi və müdaxiləsi)', updated_at = NOW() WHERE slug = 'dr-ramin-eliyev';
UPDATE doctor SET bio = 'Şüa diaqnostikası üzrə həkim.

Fəaliyyət sahələri:
Rentgen müayinələri
Kompyuter tomoqrafiyası (KT)
Maqnit rezonans tomoqrafiyası (MRT)', updated_at = NOW() WHERE slug = 'dr-ramin-ibrahimov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Ektrakorporal mayalanma
Laparoskopik cərrahi əməliyyatlar
Histeroskopik əməliyyatlar
Ginekoloji plastik əməliyyatlar
Riskli hamiləliklər
Normal doğum
Keysəriyyə əməliyyat

İş təcrübəsi:
2000-2002 Həkim, Tibb məntəqə rəisi, N saylı hərbi hissə, Azərbaycan, Bakı
2004-2009 Assistent həkim, İstanbul Universiteti, Cerrahpaşa Tibb fakültəsi Türkiyə, İstanbul
2009 - Həkim-mama-ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ramin-salahov';
UPDATE doctor SET bio = 'Uşaq Təcili Tibbi Yardım şöbəsinin müdiri.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

Müalicə etdiyi xəstəliklər:
Kritik xəstə dəğərləndirilməsi
Yenidoğulmuşların rutin müayinəsi və təqibi
Sağlam uşaq izlənməsi
Uşaqlarda qidalanma, böyümə və inkişafın izlənməsi
Usaqlarda nevroloji inkişafın izlənməsi
Anemiyalar
Allergik xəstəliklər
İnfeksiyon xəstəliklər
Mədə-bağırsaq sistemi xəstəlikləri
Tənəffüs sistemi xəstəlikləri
Sidik-ifrazat sistemi xəstəlikləri.

İş təcrübəsi:
2021- 2023 K. Fərəcova adına Elmi Tədqiqat Pediatriya İnstitutu: Həkim-pediatr, elmi işçi
2023 - Mediclub: Həkim-pediatr
2023 - Bakı Sağlamlıq Mərkəzi: Həkim-pediatr
2023 - Yeni Klinika: Həkim-pediatr, Uşaq Təcili və Tibbi Yardım şöbəsinin müdiri.', updated_at = NOW() WHERE slug = 'dr-ramine-rzayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qarın boşluğu orqanlarının (abdominal) MRT və KT müayinələri
Kiçik çanaq orqanlarının (pelvik) MRT və KT müayinələri
Döş qəfəsi orqanlarının KT müayinəsi
Baş və onurğa beyninin MRT və KT müayinələri
Dayaq-hərəkət sisteminin, əzələ və oynaqların (onurğa, bud-çanaq, diz, əl-ayaq və s.) MRT və KT müayinələri

Konfranslar:
2018-2023-cü illər RSNA- Radiology society of North America tam üzvü
2023-cü ildən ECR- European Society of Radiology tam üzvü
2015-2016-cı illər Azərbaycan Tibb Universiteti, Tədris Terapevtik Klinikası, Radiologiya üzrə kurs
2017-2018-ci illərdə Milli Onkologiya Mərkəzi, Radiologiya üzrə kurs
2018-2019-cu illərdə Gülhane Eğitim və Araştırma Merkezi, Radiologiya üzrə kurs, Ankara, Türkiyə', updated_at = NOW() WHERE slug = 'dr-ramiz-hesimov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hipertoniya və Hipotoniyanın müayinə və müalicəsi
Təzyiqin gündəlik monitorinqi (Holter AT)
Ürəyin işemik xəstəliyi (ÜİX)
Miokard infarktından sonrakı vəziyyətlərin izlənməsi
Ritm pozuntuları (Aritmiyalar) - Bradikardiya, taxikardiya
Extrasistoliya, fibrilyasiya
24 saatlıq EKQ Holter monitorinqi
Kəskin və ya xroniki ürək çatışmazlığı
Ürək əzələsinin zəifləməsi
Ödem, nəfəs darlığı, zəiflik kimi əlamətlərlə mübarizə
Mitral klapan çatışmazlığı və ya daralması
Aortal stenoz və ya çatışmazlıq
Uşaqlarda və yeniyetmələrdə aşkar edilən ürək qüsurları
Miokardit (ürək əzələsinin iltihabı)
Perikardit (ürək qişasının iltihabı)
Kardiomiyopatiyalar
Dislipidemiya və metabolik risklər
Ateroskleroz riski olan xəstələrin müayinəsi və müalicəsi
Stress fonunda və psixosomatik ürək şikayətləri
Sinir mənşəli ürəkdöyünmələr, təngnəfəslik hissi
Panik atak və streslə bağlı kardial simptomlar
Ürəyin check-up proqramları
Risk faktorlarının qiymətləndirilməsi (ailəvi tarix, diabet, piylənmə və s.)

Konfranslar:
2002-ci il 3 saylı Klinik Xəstəxanada "Kardiologiyada funksional diaqnostika" ixtisaslaşma kursu
2018-ci il Exokardioqrafiya kursu, MediClub Klinikası
2020-ci il Ə. Əliyev adına A.D.H.T. İnstitutunda Kardiologiya üzrə Təkmilləşdirmə kursu
2020-ci il Anadangəlmə ürək qüsurları üzrə seminar', updated_at = NOW() WHERE slug = 'dr-rauf-eliyev';
UPDATE doctor SET bio = 'Uroloq-Androloq.

Fəaliyyət sahələri:
Pediatrik Urologiya
Xayaların enməməsi (kriptorxizm)
Hipospadiya - Sidik kanalının anadangəlmə yerləşmə pozuntusu
PUV (Posterior uretral valv) - Oğlan uşaqlarında sidik kanalının daralması və sidik axınının pozulması
Böyrək, sidik axarları, sidik kisəsi və prostat vəzinin şişləri - Erkən diaqnostika, əməliyyat və multidissiplinar müalicə yanaşması
Sidikçıxarıcı sistemdə daş xəstəliklərinin müayinə və müalicəsi
Daşların konservativ müalicəsi - Qidalanma, dərman və həyat tərzi dəyişiklikləri ilə yanaşma
Endoskopik/lazer üsulu ilə cərrahi müalicə - Böyrək, sidik axarı və sidik kisəsindəki daşların minimal invaziv yolla çıxarılması
Endoskopik və laparoskopik uroloji əməliyyatlar
Prostat vəzinin xoşxassəli hiperplaziyası - Açıq və qapalı (TURP) üsullarla müalicə
Laparoskopik əməliyyatlar - Böyrək kisti, hidronefroz və böyrəyin çıxarılması kimi hallarda minimal invaziv cərrahiyyə
Mikroskopik varikoselektomiya - Varikoselenin yüksək dəqiqliklə cərrahi müalicəsi
Sidik-cinsiyyət orqanlarının iltihabi xəstəliklərinin müayinə və müalicəsi
Kəskin və xroniki infeksiyalar - Böyrək, sidik axarları, sidik kisəsi, sidik kanalı, testis, prostat vəz və seminal vezikulun iltihabları
Cinsi yolla keçən infeksiyalar - Laborator diaqnostika və müasir müalicə protokolları
Androloji problemlər və kişi sağlamlığının dəyərləndirilməsi
Erektil disfunksiya (cinsi zəiflik) - Hormonal, psixoloji və damar mənşəli səbəblərin qiymətləndirilməsi
Erkən eyakulyasiya (boşalma) - Tərəfli yanaşma və medikamentoz müalicə
Kişi sonsuzluğu - Spermoqramma, hormonal analizlər və uroandroloji dəyərləndirmə
Sidik ifrazı ilə bağlı problemlərin müayinə və müalicəsi
Sidik saxlamama (inkontinensiya)
Hiperaktiv sidik kisəsi - Gündüz və gecə tez-tez sidiyə getmə, təcili tələbat hissi kimi halların diaqnostika və müalicəsi

Konfranslar:
2015-ci ildə Türkiyənin Bezmialəm Vakıf Universitetinin xəstəxanasında endouroloji əməliyyatlar üzrə kurs keçmişdir.', updated_at = NOW() WHERE slug = 'dr-rauf-kazimov';
UPDATE doctor SET bio = 'Hematoloq.
Şöbə: Hematologiya və Sümük İliyi Nəqli Mərkəzi

Müalicə etdiyi xəstəliklər:
Anemiya (qan azlığı)
Trombositopeniyalar və trombositozlar (trombosit hüceyrələrin azlığı və ya çoxluğu)
Hemoqlobinopatiyalar
Trombositopatiyalar
Tromboz
Mieloma
Limfoma
Leykemiya', updated_at = NOW() WHERE slug = 'dr-refiqe-muradova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Non-invaziv kardiologiya, Exokardioqrafiya (ECHO), Transözofageal Exokardioqrafiya (TEE) - Bakırköy Dr. Sadi Konuk Təhsil və Araşdırma Xəstəxanası, İstanbul, Türkiyə.
Non-invaziv kardiologiya:
Elektrokardioqrafiya (EKQ)
Dobutamin stres exokardioqrafiyası
Qaçış yolu (treadmill) fiziki yük testi
Holter monitorinqi (ürək ritminin uzunmüddətli izlənməsi)

İş təcrübəsi:
2011-2013 Assistant-həkim, HB Güvən klinikası, Azərbaycan, Bakı
2014- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-rena-huseynova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Dermatoloq.

Fəaliyyət sahələri:
Xroniki allergik xəstəliklər
Dırnaq göbələyi
Dırnaq batması
Ekzema
Saç tökülməsi
Müxtəlif bədən nahiyəsindəki ləkələr
Yeniyetməlik dövrü sızanaqları
Dəmrov
Qurd xəstəlikləri', updated_at = NOW() WHERE slug = 'dr-rena-kengerli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Mədə-bağırsaq və qaraciyər xəstəliklərinin müayinə və müalicəsi

İş təcrübəsi:
1983-1988 Terapevt, Göyçay rayon Mərkəzi Xəstəxanası, Azərbaycan, Göyçay
1993-1998 Həkim-qastroenteroloq, Akademik M.Ə.Mirqasımov adına Respublika Klinik Xəstəxanası, Azərbaycan, Bakı
2002-2011 Həkim-qastroenteroloq, Mərkəzi Klinika, Azərbaycan, Bakı
2011-2016 Həkim-qastroenteroloq, Mərkəzi Gömrük Hospitalı, Azərbaycan, Bakı
2016 Həkim-qastroenteroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-rena-nagiyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

İş təcrübəsi:
2011-2013 Həkim-stomatoloq, Saatlı rayon Mərkəzi Xəstəxanası, Azərbaycan, Saatlı
2014-2017 Həkim-stomatoloq, Caspian Hospital, Azərbaycan, Bakı
2017- Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-resade-esedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hipertoniya xəstəliyi
Ateroskleroz xəstəliyi
Ürəyin aritmik xəstəlikləri
Ürəyin işemik xəstəlikləri
Stenokardiyalar
Miokard infarktı
Ürəyin qapaq xəstəlikləri
Anadangəlmə ürək qüsurları
EKQ (Elektrokardioqram)
Exo-KQ və Dopler
(Exokardioqrafiya və Dopler üsulu)
Stres test (qaçış testi - fiziki yük sınağı)
Ritm holteri (24, 48, 72 saatlıq),təzyiq holteri
Koronar angioqrafiya (Angio)', updated_at = NOW() WHERE slug = 'dr-revan-bagirli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Travmatologiya, Ortopediya, İdman Həkimliyi

Fəaliyyət sahələri:
Artroplastika - Azərbaycan, Bakı

İş təcrübəsi:
2024- Həkim-travmatoloq-ortoped, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-revan-mehemmedeliyev';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım (uşaq) üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

Müalicə etdiyi xəstəliklər:
0-18 yaş uşaqlar üçün təcili və təxirəsalınmaz yardım
Kritik xəstə dəyərləndirilməsi
Allergik xəstəliklər
Mədə-bağırsaq sistemi xəstəlikləri
Müxtəlif virus və bakterial mənşəli xəstəliklər
Tənəffüs sistemi xəstəlikləri
Sidik yollarının infeksiyaları
Anemiyalar
Qurd xəstəlikləri və s.

İş təcrübəsi:
2008 - Kocaeli Universiteti: Çoçuk Hastalıkları Ana bilim Dalı
2009-2010 - Fırat Universiteti: Çoçuk Hastalıkları Ana bilim dalı
2013-2023 - 15 saylı Birləşmiş Şəhər Xəstəxanası: Həkim-pediatr
2024 - Yeni Klinika: Təcili və təxirəsalınmaz tibbi yardım şöbəsi: Təcili tibbi yardım üzrə həkim.', updated_at = NOW() WHERE slug = 'dr-reyhan-tagiyeva';
UPDATE doctor SET bio = 'Təcili tibbi yardım və səyyar tibbi xidmət şöbəsinin evdə tibbi xidmət bölməsinin məsul şəxsi.

Şöbə: Təcili tibbi yardım və səyyar tibbi xidmət

Fəaliyyət sahələri:
Terapiya, kardiologiya - Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
Kliniki kardiologiya - Rusiya, Moskva

İş təcrübəsi:
1977-1983 Həkim-terapevt Mərkəzi Rayon xəstəxanası, Azərbaycan, Ağcabədi
1983-1995 Həkim-kardioloq, Səhiyyə Nazirliyi 4-cü Baş idarınin Birinci poliklinikası Azərbaycan,Bakı
1995-2000 Həkim-kardioloq, Səhiyyə Nazirliyi 4-cü Baş idarınin Mərkəzi Klinik Xəstəxanası Azərbaycan,Bakı
2000- Həkim-reanimatoloq, Mərkəzi Klinik Xəstəxanası, Azərbaycan, Bakı
2014 - Evdə tibbi xidmət bölməsinin məsul şəxsi, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-rovsane-qasimova';
UPDATE doctor SET bio = 'Həkim psixiatr, Psixoterapevt.

Fəaliyyət sahələri:
Affektiv pozuntular
Depressiya
Bipolyar affektiv pozuntu
Şəxsiyyət pozuntuları
Şizofreniya spektri və sayıqlama pozuntuları
Təşviş, stresslə əlaqəli və somatoform pozuntular
Panik pozuntu və panik atak
Generalizə olunmuş təşviş pozuntusu
Sosial fobiya və digər fobiyalar
Obsessiv-kompulsiv pozuntu
Posttravmatik stress pozuntusu
Yemə və yuxu pozuntuları
Diqqət əksikliyi və hiperaktivlik pozuntusu (ADHD)
Üzvi mənşəli psixi pozuntular
Somatik xəstəliklərlə əlaqəli psixi dəyişikliklər
Psixoterapiya yanaşmaları
Koqnitiv Davranış Terapiyası (CBT)
Dialektik Davranış Terapiyası (DBT)
İnterpersonal Terapiya (IPT)

Konfranslar:
2015-ci il Franka Bazalya Məktəbi, Triyest, İtaliya - Psixososial reabilitasiya
2018-2019-cu illər Harvard T.H. Chan School of Public Health Boston, ABŞ - "Fogarty" Təqaüdçüsü
2016-indiyədək Azərbaycan Psixiatriya Assosiasiyası Gənc Psixiatrlar Bölümünün Katibi və bir neçə Avropa psixiatrik cəmiyyətinin Azərbaycan üzrə yerli koordinatoru', updated_at = NOW() WHERE slug = 'dr-roya-eliyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Histerosalpinqoqrafiya
Sümük yaşı təyini (uşaqlarda)
Bud-çanaq displaziyası (uşaqlarda)
Enteroqrafiya, iriqoskopiya
Kəllə əsası patologiyaları
Döş qəfəsi orqanlarının müayinəsi
Skolioz, kifoz, lordoz təyini
Yastıpəncəlilik (ölçü və dərəcə)
Ətraf sümüklərin sınıq və patologiyaları
Qaymarit, frontit, sinusit müayinəsi
Diz oynağı artrozu (mərhələli təyinat)

Konfranslar:
2009-cu ildə Medceur Exercise, Medseur Lecture Series, Serbiya
2011-ci ildə NATO Medical Training, Bakı, Azərbaycan
2012-ci ildə Military Medical Training Center (Basic staff medical officers course), Litva
2012-ci ildə Defense Language İnstitute English Language Course, Azərbaycan, Bakı
2017-ci ildə NATO Vigorous Warrior, Almaniya', updated_at = NOW() WHERE slug = 'dr-rustem-qasimov';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.
Şöbə: Reanimasiya', updated_at = NOW() WHERE slug = 'dr-sahabxanim-niftaliyeva';
UPDATE doctor SET bio = 'Kardiologiya şöbəsinin müdiri.
Şöbə: Kardiologiya', updated_at = NOW() WHERE slug = 'dr-sahane-elesgerli';
UPDATE doctor SET bio = 'Baş həkim müavini (Xəstəxana) / mütəxəssis.

Şöbə: Urologiya

Fəaliyyət sahələri:
Uroloji transplantasiya- Türkiyə, Ankara

İş təcrübəsi:
1983-1986 - Həkim-uroloq, Xəzər Hövzə poliklinikası, Azərbaycan, Bakı
1986-1992 Həkim-uroloq, Akademik M.Cavadzadə adına Respublika Kliniki Uroloji Xəstəxanası, Azərbaycan, Bakı
1992-2010 I Uroloji şöbənin müdiri, Akademik M.Cavadzadə adına Respublika Kliniki Uroloji Xəstəxanası, Azərbaycan, Bakı
2010-2016 Böyrəkköçürmə şöbəsinin müdiri, Akademik M.Cavadzadə adına Respublika Kliniki Uroloji Xəstəxanası, Azərbaycan, Bakı
2016- Baş həkim, Mərkəzi Klinika Ambulatoriyası, Azərbaycan, Bakı
2026 - Baş həkim müavini, Mərkəzi Klinika Xəstəxanası, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sahlar-nesirov';
UPDATE doctor SET bio = 'Hematoloq.

Fəaliyyət sahələri:
Anemiya
Qan xərçəngi
Trombositopeniyalar
Hemolitik proseslər və xəstəliklər
Çoxsaylı mielom xəstəliyi
Leykemiyalar (leykozlar-qan xərçəngləri)
İrsi qan xəstəlikləri-talassemiyalar
Fermentopatiyalar
Koaqolopatiyalar
Laxtalanma faktor problemləri və s.

Konfranslar:
2011-ci il International Medical Students Congress,Türkiyə
2014-cü il SQBKH Yerində Təhsil fəaliyyəti üzrə konfrans
2015-ci il International Scientific Conference of Oncology, Azərbaycan
2017-2018-ci illər Gülhane Eğitim və Araşdırma Hastanesi, Hematoloji və Allojenik kemik iliyi nakli üzrə kurs
2018-ci il Hemofil vakalarla eğitim simpoziumu, Türkiyə
2018-ci il EGE Hematoloji Onkoloji Kongresi, Türkiyə
2019-cu il Reanimatologiya və İntensiv Terapiya Tromboembolizm seminarı
2019-cu il Villebrand xəstəliyi, elmi-praktiki seminar
2019-cu il Actual problems of hematology İnternational Conference,Azerbaijan', updated_at = NOW() WHERE slug = 'dr-saleh-rzayev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hipertoniya və Hipotoniyanın müayinə və müalicəsi
Ürəyin işemik xəstəliyi (ÜİX)
Miokard infarktından sonrakı vəziyyətlərin izlənməsi
Ritm pozuntuları (Aritmiyalar) - Bradikardiya, taxikardiya
Extrasistoliya, fibrilyasiya
Kəskin və ya xroniki ürək çatışmazlığı
Ürək əzələsinin zəifləməsi
Ödem, nəfəs darlığı, zəiflik kimi əlamətlərlə mübarizə
Mitral klapan çatışmazlığı və ya daralması
Aortal stenoz və ya çatışmazlıq
Uşaqlarda və yeniyetmələrdə aşkar edilən ürək qüsurları
Miokardit (ürək əzələsinin iltihabı)
Perikardit (ürək qişasının iltihabı)
Kardiomiyopatiyalar
Dislipidemiya və metabolik risklər
Ateroskleroz riski olan xəstələrin müayinəsi və müalicəsi
Stress fonunda və psixosomatik ürək şikayətləri
Sinir mənşəli ürəkdöyünmələr, təngnəfəslik hissi
Panik atak və streslə bağlı kardial simptomlar
Ürəyin check-up proqramları
Risk faktorlarının qiymətləndirilməsi (ailəvi tarix, diabet, piylənmə və s.)

Konfranslar:
2012 İstanbul Meeting of Practice and Sceance in Cardiology and Cardiovascular / Surgery, İstanbul, Turkey
2012 Spring Summit Meeting, Heart House, Nice, France
2013 2nd National Conference of European Educational Programme, Warsaw, Polland
2015 European Society of Cardiology International Congress, London, UK
2019 International ICI meeting for innovations in Cardiology', updated_at = NOW() WHERE slug = 'dr-samir-esgerov';
UPDATE doctor SET bio = 'Qastroenteroloq.
Şöbə: Qastroenterologiya', updated_at = NOW() WHERE slug = 'dr-samire-hesenova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Görmə kəskinliyinin yoxlanılması
Refraksiyanın qiymətləndirilməsi və eynək təyini (miopiya, hipermetropiya, astiqmatizm)
Uşaqlarda refraksiyanın ölçülməsi
Tonometriya (gözdaxili təzyiqin ölçülməsi)
Biomikroskopiya
Gözdibi müayinəsi
Göz quruluğu qiymətləndirilməsi (Schirmer test)
Konyuktivit, allergik dəyişikliklər, keratit, blefaritin müayinə və müalicəsi
Gözdən yad cismin çıxarılması
Gözyaşı kanalının yuyulması
Katarakta, Qlaukoma, Diabetik retinopatiya, Tiroid oftalmopatiyasının müayinə və müalicəsi', updated_at = NOW() WHERE slug = 'dr-samire-hummetova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Endokrinologiya - Bursa Uludağ Universitesi, Türkiyə, Bursa və Hacəttəpə Universitesi, Türkiyə, Ankara

İş təcrübəsi:
2007-2016 Həkim-endokrinoloq, Laçın rayon Mərkəzi Xəstəxanası, Azərbaycan, Laçın
2016 - Həkim-endokrinoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-samire-merdanova';
UPDATE doctor SET bio = 'Uşaq Endokrinoloqu.

Fəaliyyət sahələri:
Uşaqlarda boy qısalığı və boy geriliyi
Boy hormonu çatışmazlığı
Boy hormonu stimulyasiya testləri
Genetik boy pozuntularının qiymətləndirilməsi
Uşaqlarda Tip 1 və Tip 2 şəkərli diabet
Uşaqlarda Şəkərsiz diabet (diabetes insipidus)
Uşaqlarda Hipoqlikemiya (qanda şəkərin düşməsi)
Uşaqlarda artıq çəki və piylənmə
Metabolik sindrom və insulin müqaviməti
Erkən cinsi yetişkənlik
Gecikmiş cinsi inkişaf
Menstruasiya pozuntuları (yeniyetmə qızlarda)
Həddindən artıq tüklənmə (hirsutizm)
Penis inkişafı problemləri (mikropenis, undescended testis və s.)
Uşaqlarda Hipotiroidizm
Uşaqlarda Hipertiroidizm
Uşaqlarda Autoimmun tiroiditlər (Hashimoto və s.)
Doğuşdan adrenal hiperplaziya (CAH)
Kortizol ifrazı ilə bağlı pozğunluqlar
Hipofiz hormon çatışmazlıqları
Uşaqlarda Genetik və metabolik xəstəliklər
Turner sindromu
D vitamini çatışmazlığı və raxit
Kalsium və fosfor metabolizması pozğunluqları
Sümük xəstəlikləri - Natamam osteogenez, raxit və s.
Endokrinoloji problemlərin geniş spektrli diaqnozu
Müasir müalicə protokolları ilə individual yanaşma
Uzunmüddətli təqib və inkişafın monitorinqi

Konfranslar:
2015-ci ildə Columbia Universiteti və Open Medical İnstitutun təşkil etdiyi diabet simpoziumu
Azərbaycan-Türkiyə Pediatrik Endokrinoloji kursunda iştirak etmişdir.
Prof. Cengiz Karanın rəhbərliyi altında osteokursun iştirakçısı olub.
Samsun 19 Mayıs Universiteti Çocuk Endokrinolojisi bölümündə Prof. Murat Aydının rəhbərliyi altında uşaq endokrinologiyası üzrə kurs keçmişdir.', updated_at = NOW() WHERE slug = 'dr-samire-nesibova';
UPDATE doctor SET bio = 'Həkim-laborant.

Fəaliyyət sahələri:
Laboratoriya işi', updated_at = NOW() WHERE slug = 'dr-samire-qedimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
İndividual pəhriz proqramlarının tərtibi (Hər bir şəxsin sağlamlıq vəziyyətinə, həyat tərzinə və məqsədinə uyğun fərdi qidalanma planlarının hazırlanması)
Çəki defisiti ilə bağlı qidalanmanın tənzimlənməsi (Orqanizmin ehtiyaclarını nəzərə alaraq sağlam şəkildə çəki artımına yönəlmiş pəhriz proqramları)
Mədə eroziyaları və xora xəstəliklərində terapevtik qidalanma (Həzm sistemini zədələmədən mədəni qoruyan xüsusi pəhriz proqramları)
Qaraciyərin piylənməsi zamanı qidalanmanın tənzimlənməsi (Qaraciyər yağlanmasının qarşısını alan və funksiyasını bərpa edən pəhriz yanaşmaları)
Virus hepatitlərinin (B və C) kompleks müalicəsində pəhriz proqramları (Qaraciyərin yükünü azaltmaq və müalicəni dəstəkləmək məqsədilə uyğunlaşdırılmış qidalanma planları)
Şəkərli diabet və artıq çəkili xəstələrdə qaraciyər sağlamlığının bərpası üçün pəhriz proqramları

Konfranslar:
2015-ci il JBP japan co, Modern Hepatitid treatment
04.01.2016 - 29.01.2016-c illər T.C. Endekrinoloji Metebolizm Kliniği (Türkiyə), Metobolizma Kliniğinde beslenme
2018-ci il AQHİB, Virus hepatitlərinin problemləri
2018-ci il Qastroenteroloji klinika, Xroniki B hepatiti müalicəsi
2018-ci il Qastroenteroloji klinika, Qaraciyərin xolestazla müşaiyət olunan xəstəliklərinin farmokoloji müalicəsində (UDXT) istifadəsi
2021-ci il AQHİB, Viruslu Hepatitlərlə mübarizə
2022-ci il AQHİB Qastroenterologiya və Hepotoligiya üzrə beynalxalq konfrans', updated_at = NOW() WHERE slug = 'dr-sara-babayeva';
UPDATE doctor SET bio = 'Pediatr.
Şöbə: Reproduktiv Sağlamlıq və Ailə Planlaması Mərkəzi

Müalicə etdiyi xəstəliklər:
Pediatrik Chek-up müayinələr
Allergik xəstəliklər
Mədə-bağırsaq sistemi xəstəlikləri
Müxtəlif virus və bakterial mənşəli xəstəliklər
Anemiyalar
Peyvənd öncəsi müayinələr
Uşaqlarda böyümə və inkişafın dəyərləndirilməsi
Yenidoğulmuşların müayinəsi və aylıq rutin müayinələrin aparılması
Qurd xəstəlikləri və s.', updated_at = NOW() WHERE slug = 'dr-seadet-ehmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Exokardioqrafiya

İş təcrübəsi:
2003-2010 Müəllim, N.Rəfibəyli adına 2 nömrəli Bakı Baza Tibb Məktəbi, Azərbaycan, Bakı
2013-2014 Həkim-koordinator, Baku City Hospital (Ortoped MMC), Azərbaycan, Bakı
2014- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-seadet-haciyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya - Dr Sadi Konuk adına Eğitim ve Araştırma Xəstəxanası, Türkiyə, İstanbul
Non-invaziv və invaziv kardiologiya

İş təcrübəsi:
2011- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-seadet-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Kardioloji İnstrumental və Funksional Diaqnostik Müayinələr
EKQ (Elektrokardioqrafiya)
EXO-KQ (Exokardioqrafiya) - Ürəyin ultrasəs müayinəsi
Tredmill Stress EKQ Testi - Fiziki yüklənmə altında ürək fəaliyyətini qiymətləndirməsi
24 Saatlıq Qan Təzyiqi Monitorinqi (BP-Holter)
24-48-72 Saatlıq Ritm-Holter Monitorinqi
Hipertoniya (Yüksək qan təzyiqi) - səbəbinin araşdırılması, müayinə və müalicə istiqamətlərinin təyini
Dislipidemiya - lipid mübadiləsi pozğunluqlarının araşdırlması,müayinə və müalicəsi
Ürək Çatışmazlığının müayinə və müalicəsi

Konfranslar:
2008-ci il Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu - EKQ-nin klinik interpretasiyası
2015-ci il ESC Congress European Society of Cardiology Hollandiya, Amsterdam
2016-cı il ESC Congress Böyük Britaniya, London
2017-ci il ESC Congress İtaliya, Roma', updated_at = NOW() WHERE slug = 'dr-seadet-memmedova-referans';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Endokrinologiya, "Santariskes Klinikos", Litva Respublikası, Vilnüs
Endokrinologiya Şişli Hamidiye Etfal Eğitim ve Araştırma" Xəstəxanası, Türkiyə Cümhuriyyəti, İstanbul

İş təcrübəsi:
2008- Həkim-Endokrinoloq, Mərkəzi Klinika, Terapiya Mərkəzi Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sebine-ceferova';
UPDATE doctor SET bio = 'Ambulatoriya şöbəsinin müdiri, Endokrinoloq.
Şöbə: Terapiya', updated_at = NOW() WHERE slug = 'dr-sebine-pasayeva';
UPDATE doctor SET bio = 'Nevroloq.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Müxtəlif növ baş ağrıları, başgicəllənmələr
Depressiyalar və digər nevrotik pozğunluqlar
Serebrovaskulyar xəstəliklər (insultlar)
Yuxu pozulmaları
Yaddaş pozulmaları
Parkinson
Multipl Skleroz
Müxtəlif növ onurğa problemləri və radikulopatiyalar
Müxtəlif sinir və əzələ xəstəlikləri.', updated_at = NOW() WHERE slug = 'dr-sebine-tagiyeva';
UPDATE doctor SET bio = 'Uzman pediatr-neonatoloq.
Şöbə: Neonatologiya

Kurslar:
2015 -07 Okmeydanı Eğitim Araştırma Hastanesi Kadın Hastalıkları ve doğum - observer
2017-09 - 2018-03 Hacettepe Üniversitesi Tıp Fakültesi - observer
2018-04 Eskişehir Osmangazi Üniversitesi Tıp Fakültesi - Pediatriya - observer
2019-09 VIII Ulusal Aşı Sempozyumu
2019-06 Yenidoğan Canlandırma Programı (NRP)
2020-01 Pediatrik İleri Yaşam Desteği (PALS)
2020-11 Anne Sütü ve Emzirme Danışmanlığı Eğitim Programı
2022-06 Çocuklarda Nörolojik Aciller Kursu
2022-09 Pediatride Yaygın Nefrolojik Durumlar
2022-04 Denver II Gelişimsel Tarama Testi.', updated_at = NOW() WHERE slug = 'dr-sebnem-bagirli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Təcili yardım - İstanbul Eğitim ve Araştırma Xəstəxanası və Okmeydanı Eğitim ve Araştırma Hastanesi Türkiyə, İstanbul
Uşaq reanimasiyası - Ankara Üniversitesi Cebeci Çocuk Xəstəxanası, Türkiyə, Ankara

İş təcrübəsi:
2024- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sebnem-bekirli';
UPDATE doctor SET bio = 'Kardioloq, Terapevt.

Fəaliyyət sahələri:
Bronxit
Bronxial astma
Pnevmoniya
Xroniki bronxit iltihablı birgə xəstəliklər
Anemiya
Xroniki böyrək xəstəliyi
Qaraciyər xəstəliyi
Xroniki mədə-bağırsaq xəstəlikləri (kolit, enterit, qastrit)
Mədə, onikibarmaq bağırsağın peptik xorası
Kardioloji poliklinika (EKQ, EXO-KQ, Holter, Ambulator qan təzyiqinin monitorinqi 24 saat)
Koronar arteriya xəstəliyi
Aritmiyalar
Fərdi kardioloji Check-Upların tərtib edilməsi
Xəstənin klinik vəziyyətinin və şikayətlərinin geniş təhlili (Ağciyər, Qastroenteroloji, Yoluxucu xəstəliklər)
Komorbid hallar - Bir neçə xəstəliyin eyni vaxtda mövcud olduğu hallarda ən uyğun müalicə yanaşmasının müəyyən edilməsi', updated_at = NOW() WHERE slug = 'dr-sebnem-ibrahimova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Nevrologiya - Bakırköy Nevrologiya Mərkəzi, Türkiyə, İstanbul

İş təcrübəsi:
2011-2015 Həkim-nevropatoloq, Laçın Mərkəzi rayon Xəstəxanası, Azərbaycan, Laçın
2015-2019 Həkim-nevropatoloq, Gəncə Müalicə Diaqnostika Mərkəzi, Azərbaycan, Gəncə
2019- Həkim-nevropatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sebnem-neqiyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Təcili tibbi yardım - İstanbul Universiteti Tibb Fakultəsi, Anestezioloji və reanimatoloji anabilim dalı,Türkiyə, İstanbul
Reanimatologiya və intensiv terapiyada tromboembolizm - Azərbaycan, Bakı
PRİSMAFLEX CRRT Cihazı istifadəsi eğitimi - Türkiyə, İstanbul

İş təcrübəsi:
2012 Həkim-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sebuhi-sofiyev';
UPDATE doctor SET bio = 'Baş həkim müavini (Xəstəxana) / mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Təxirə salınmaz və reanimasiya /Təcili Yardımın reanimasiom briqadaları üçün, Gürcüstan, Tbilisi
Pediatrik anesteziologiya - Reanimasiya, Russiya Federasiyası, Sankt- Peterburq.

İş təcrübəsi:
1978-1983 Həkim-reanimatoloq, Bakı şəhəri Təcili və Təxirəsalınmaz Tibbi Yardım Stansiyası, Azərbaycan, Bakı
1983-1985 Həkim-reanimatoloq, 4 saylı baş idarənin 1 saylı xəstəxanası, Azərbaycan, Bakı
1985-2000 Həkim-reanimatoloq, 4 saylı baş idarənin 1 saylı xəstəxanası, Azərbaycan, Bakı
2000-2009 Həkim-reanimatoloq, Reanimasiya və intensiveterapiya şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı
2009- Baş həkim müavini (Xəstəxana) Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sedaqet-behri';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Mərkəzi sinir sistemi xəstəliklərinin müayinə və müalicəsi
Beyin qan dövranı pozğunluqları - İsemik və hemorragik insult, xroniki serebrovaskulyar çatışmazlıq, başgicəllənmə və yeriş pozğunluğu kimi halların dəyərləndirilməsi.
Mərkəzi sinir sisteminin infeksion xəstəlikləri - Ensefalit, meninqit və digər neyroinfeksiyalar.
Epilepsiya - Tutmalarla müşayiət olunan xəstəlik; EEG və medikamentoz nəzarət altında olan müalicə proqramları ilə idarə olunur.
Parkinson xəstəliyi və parkinsonizm sindromu - Əl titrəməsi, hərəkət ləngiməsi, əzələ sərtliyi və digər motor pozuntuların erkən diaqnostikası və müalicəsi.
Dağınıq skleroz - Autoimmun mənşəli demielinizəedici xəstəlik; görmə, hissiyat və hərəkət pozuntuları ilə müşayiət olunur.
Yan Amiotrofik Skleroz (ALS) - Sinir-əzələ aparatını tədricən zəiflədən və ciddi nəzarət tələb edən neyrodegenerativ xəstəlikdir.
Periferik və vegetativ sinir sistemi pozğunluqlarının müayinə və müalicəsi
Periferik sinir sistemi xəstəlikləri - Nevritlər, neyropatiyalar, sinir blokları və müxtəlif ağrılı sindromların dəyərləndirilməsi və müalicəsi
Vegetativ sinir sistemi xəstəlikləri - Təzyiqin sabit olmaması, tərləmə, ürəkdöyünmə, panik atak və digər psixosomatik halların dəyərləndirilməsi və müalicəsi.
Onurğa sütunun degenerativ xəstəlikləri - Protruziya, fəqərəarası disk yırtığı, osteoxondroz, radikulopatiya və onurğa kanalının daralması ilə müşayiət olunan halların müalicəsi.
Baş və sinir sistemi ilə əlaqəli funksional pozğunluqların müayinə və müalicəsi
Baş ağrıları - Miqren, gərginlik tipli, kümevi və ikincili baş ağrılarının səbəblərinin araşdırılması və müalicəsi.
Başgicəllənmə (vertigo) - Vestibulyar sistem və ya mərkəzi sinir sistemi mənşəli başgicəllənmələrin differensial diaqnozu.
Sinir-əzələ xəstəlikləri - Miyopatiyalar, miasteniya və sinir-əzələ keçiriciliyinin pozulması ilə xarakterizə olunan hallar.
Sinir tikləri və qeyri-iradi hərəkətlər - Uşaq və böyüklərdə rast gəlinən motorik və vokal tiklərin müayinəsi və idarə olunması.
Yuxu pozğunluqları - Yuxuya getmədə çətinlik, tez oyanma və keyfiyyətsiz yuxu kimi problemlərin müalicəsi.
Nevrozlar - Stress, narahatlıq, emosional gərginlik və digər funksional pozğunluqlarla müşahidə olunan vəziyyətlər.
Enurez (gecə sidiyə qaçırma) - Xüsusilə uşaqlarda rast gəlinən, nevrogen və ya psixogen mənşəli halların dəyərləndirilməsi və müalicəsi.

Konfranslar:
2009-ci il AHTİ - Nevrologiyada müalicə üsulları kursu
2015-ci il AHTİ - Nevrologiyanın aktual məsələləri
2017-ci il İstanbul, Nevroloji xəstəliklər nəzarətdə yeni yanaşmalar
2019-ci il Avstriya, Strasburq, İşemik insult və diabetik polineyropatiyaların müalicəsində yeni yanaşmalar kursu
2021-ci ildə sertifikatsiya kursu', updated_at = NOW() WHERE slug = 'dr-sedaqet-celilova';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

İş təcrübəsi:
2013-2014 - 2 nömrəli Yaroslavl Doğum Evi
2015-2019 - İnsan Klinika
2019-2022- 16 BŞX
2021-2022 - Pirallahı Tibb Mərkəzi
2022 - Yeni Klinika,Təcili və təxirəsalınmaz tibbi yardım şöbəsi: Təcili və təxirəsalınmaz tibbi yardım üzrə həkim.', updated_at = NOW() WHERE slug = 'dr-sefeq-ageliyeva';
UPDATE doctor SET bio = 'Həkim-laborant.', updated_at = NOW() WHERE slug = 'dr-sefer-haciyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Dəri xəstəliklərinin diaqnostikası və müalicəsi
Sızanaq (Akne)
Dərinin göbələk xəstəlikləri
Atopik dermatit
Psoriaz
Ekzema
Neyrodermit
Dərinin bakterial dermatozları
Dərinin virus xəstəlikləri

Konfranslar:
2011-ci il "Gənc həkimlər və tibb tələbələr" Beynəlxalq Kongresi, İndoneziya, Jakarta
2013-cü il "Age-related skin disorders" Seminarı
2015-ci il "Atopik dermatit və onun müasir müalicə metodları" Seminarı
2016-cı il "Akne ilə mübarizə" Beynəlxalq Konqresi
2016-cı il "Uşaaqlarda və yeniyetmələrdə dəri xəstəlikləri" Seminarı
2017-ci il "Lazer Dermatologiya" Seminarında spiker
2017-ci il "Psoriazın lazer müalicəsi" Seminarında spiker
2019-cu il "International Dermatology and Cosmetology" Konqresi', updated_at = NOW() WHERE slug = 'dr-sefiqe-yusifova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Gözün konyuktiva və buynuz qişa xəstəlikləri
Refraksiya qüsurları
Damarlı qişa xəstəlikləri
Gözün torlu qişa xəstəlikləri

Konfranslar:
1998-ci il MN tibb heyəti internaturasında "hərbi səhra cərrahiyyəsi və ilkin oftalmologiya" kursu.
2007-ci il Azərbaycan tibb universitetinin hərbi tibb fakültəsi cərrahiyyə silsiləsi Oftalmologiya ixtisası üzrə.
2015-ci il Azərbaycan tibb universitetinin hərbi tibb fakültəsi cərrahiyyə silsiləsi Oftalmologiya ixtisası üzrə kurs.
2017-ci il Gülhanə Asgeri tibb akademiyasında kurs.
2018-ci il Z. Əliyeva adına Milli oftalmologiya mərkəzinin Refraksiya anomaliyaları üzrə kurs.
2023-cü il Z. Əliyeva adına milli oftalmologiya mərkəzinin "Torlu qişa xəstəlikləri və Qlaukuma" üzrə kurs.', updated_at = NOW() WHERE slug = 'dr-sehla-adigozelova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
TEE-Transezofagial Exokardioqrafiya - Siyami Ersek Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul
Aritmologiya - Siyami Ersek Kalp ve Damar Cerrahisi Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul

İş təcrübəsi:
2018- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sehla-pasazade';
UPDATE doctor SET bio = 'Şüa diaqnostikası üzrə həkim.

Fəaliyyət sahələri:
Rentgen müayinələri
Kompyuter tomoqrafiyası (KT)
Maqnit rezonans tomoqrafiyası (MRT)', updated_at = NOW() WHERE slug = 'dr-seide-ibrahimova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Uşaq kardiologiyası

Fəaliyyət sahələri:
Uşaq kardioloqu, Pediatrik EKQ Değerendirme - Uludağ Universiteti Uşaq Kardiologiya Bölümü, Türkiyə, Bursa
Uludağ Üniversitesi Uşaq Kardiologiya Bölümü Yenidoğan Bölümü Yenidoğan Resüstasyon Kursu, Türkiyə, Bursa
Hecettepe İhsan Doğramacı Uşaq Xəstəxanası, Uşaq Kardiologiya Bölümü, Türkiyə, Ankara

İş təcrübəsi:
2007- Həkim-uşaq kardioloqu, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-seide-qurbanova';
UPDATE doctor SET bio = 'Fizioterapevt.

Fəaliyyət sahələri:
Menisk yırtığı
Skolioz, kifoz, lordoz
Onurğa Deformasiya və Pozuntularının Müalicəsi
Skoliozun erkən mərhələdə aşkarlanması və bərpası
Kifozun aşkarlanması və korreksiyası
Lordozun fizioterapevtik bərpası
Bel yırtığı (disk yırtığı) - Ağrıların azaldılması, əzələ gücünün bərpası və hərəkət diapazonunun genişləndirilməsi
Protruziya - Disk çıxıntılarının erkən mərhələdə qarşısının alınması və funksional bərpa
Osteoxondroz - Onurğa sütununda degenerativ dəyişikliklərin konservativ müalicəsi
Yastıpəncəlik (düz ayaqlılıq) - Uşaqlarda və böyüklərdə addım mexanikasının bərpası və dayaq-hərəkət sisteminin dəstəklənməsi
Fiziki Reabilitasiya və Bərpa Proqramları
Müalicəvi idman - Fərdi məşq proqramları ilə hərəkət sisteminin gücləndirilməsi və tarazlığın bərpası
Boy uzatma məşqləri - Mümkün olan fizioloji sərhədlər daxilində boy artımına dəstək məqsədilə xüsusi fiziki məşqlər
Manual Terapiya
Müalicəvi masaj - Qan dövranının yaxşılaşdırılması, əzələ spazm və gərginliklərinin aradan qaldırılması
Əl ilə terapiya və dartılma texnikaları - Onurğa və oynaq mobilizasiyası, ağrısız hərəkət üçün dəstək
İqlaterapiya (akupunktura) - Bioloji aktiv nöqtələrin stimulyasiyası ilə ağrının azaldılması və enerji axınının bərpası
Zəli terapiyası (hirudoterapiya) - Təbii zəlilər vasitəsilə qan dövranının yaxşılaşdırılması, ödemin və iltihabın azaldılması
Kinezobantlama (kinesiotaping) - Əzələ və oynaq dəstəyi üçün xüsusi elastik lentlərlə ağrının azaldılması və hərəkətin stabilləşdirilməsi

Konfranslar:
2009-cu il Həkimlərin təkmilləşdirmə insitutu Fizioterapiya və Tibbi bərpa üzrə kurs
2012-ci il Oynaq xəstəlikləri zamani fizioterapiyanin rolu adlı seminar
2015 ci il Daxili xəstəliklər zamanı fizioterapiyanin müasir aspektleri
2017 ci il Nevroloji xəstəliklərin müalicəsində fizioterapiya ve tibbi reablitasiya
2018- ci il Hirudoterapiya kursu
2020-ci il Kinezoterapiya kursu
2022-ci il İynə refleksoterapiya kursu', updated_at = NOW() WHERE slug = 'dr-selale-suleymanova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet (Tip 1 və Tip 2)
Şəkərsiz diabet
Hamiləlikdə (hestasion) diabet - Ana və döl üçün riskləri azaldan nəzarət və müalicə proqramı
Artıq çəki və piylənmə - Hormonal səbəblərin araşdırılması və endokrin yanaşmalarla müalicə
Ağır dərəcəli çəki azlığı - Maddələr mübadiləsi və hormon çatışmazlıqlarının qiymətləndirilməsi
Qalxanabənzər vəzi xəstəlikləri - Hipotiroidizm, hipertiroidizm, düyünlü zob və s.
Hipofiz vəzi xəstəlikləri - Hormon ifrazının azalması və ya artması ilə bağlı pozuntular (akromqeliya, prolaktinoma və s.)
Böyrəküstü vəzi xəstəlikləri - Kortizol, aldosteron və digər hormon balansı pozuntuları (Addison, Kuşinq sindromları və s.)
Menstrual tsiklin pozulması - Hormonal disbalans, polikistoz, amenoreya və s.
Hirsutizm - Qadınlarda kişi tipli tüklənmənin endokrin səbəblərinin aşkarlanması
Qadınlarda sonsuzluq - Yumurtlama problemləri və hormon pozğunluqlarının diaqnostikası
Kişilərdə hormonal mənşəli sonsuzluq - Testosteron çatışmazlığı, prolaktin yüksəkliyi və digər səbəblərin araşdırılması
Osteoporoz - Sümük sıxlığının azalması, sınıq riskinin qiymətləndirilməsi və müalicəsi
Digər metabolik sümük xəstəlikləri - D vitamini çatışmazlığı, paratiroid vəzi xəstəlikləri və s.
Hipertoniya - Yüksək qan təzyiqinin qalxanabənzər, böyrəküstü vəzi və digər hormonal səbəblərlə əlaqəsinin dəyərləndirilməsi

Konfranslar:
2016-cı il -"Diabetic foot -and multidisciplinary approach"
2016-cı il -"Short stature and precoccious puberty in pediatric endocrinology" Simpozium
2017-ci il "Diabetik ayaq günü" adlı elmi-praktiki konfrans
2018 -ci il "Azərbaycan Türkiyə Pediatrik Endokrin" kursu
2018-ci il Attendance at Thyroid Meeting with ETA speakers
2018-ci il "54. Ulusal Diyabet Kongresi" Türkiyə, Antalya
2019 - cu il "55. Ulusal Diyabet Kongresi" Kipr, Bafra
2019 - cu il "21.Diyabet Diyetisyenliği Sempozyumu" Kipr, Bafra
2023 - cü il " Piylənməyə Müasir Yanaşma" Bakı', updated_at = NOW() WHERE slug = 'dr-selim-ehedov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Qaraciyərin Fibroskanı
Viruslu Hepatitlər
Alkoqollu hepatitlər
Qaraciyərin piy xəstəlikləri
Autoimmun hepatitlər
İrsi qaraciyər xəstəlikləri
Qaraciyər sirrozu
Toksiki hepatitlər
Birincili biliar xolanqit
Birincili sklerozlaşmış xolangit
Jilber sindromu
Mədə bağırsaq xəstəlikləri
Hamiləlik xolestazı
Qaraciyərin Fibroskanı

Konfranslar:
2019-cu il "The internationa liver congress" EASL-ın illik konfransında "Early predictor for SVR of patients with chronic hepatitis C during DAA treatment" mövzusu ilə çıxış etmişdi, Vyana,Avstriya
2020-ci il "Epidemiology of HCC in patients with viral Hepatitis" mövzusu ilə EGO SUMMIT-də məruzəçi kimi iştirak etmişdir, İsgəndəriyyə, Misir
2022-ci il Hands-on Motility Workshop kursu , Ege Universitet, İzmir
2024- cü il Meet the Expert - Train in the Trainer Hepa Merz kursu, Varşava, Polşa
2024-ci il Education program about Fibroscan as a trainee kursu, Ege Universitet, İzmir', updated_at = NOW() WHERE slug = 'dr-seltenet-efendiyeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Allerqoloq.

Fəaliyyət sahələri:
Astma
Allergik rinit
Atopik dermatit
Allergik kontakt dermatit
Allergik konyunktivit
Angionevrotik ödem
Anafilaksiya
Dərman allergiyası
Həşərat (insekt) allergiyası
Qida allergiyaları
Qlüten enteropatiyası
Pollinoz
Övrə və s.
Dəri allergiya testləri
Spirometriya

Konfranslar:
2014-cü il Hacettepe Universitesi, Tıp Fakültesi, Çocuk Sağlığı ve Hastalıkları Anabilim dalı, Alerji ve Astım Unitesi/rezidentlər üçün təkmilləşmə kursu
2017-2018-ci illər Molekulyar Allerqologiya və İmmunologiya üzrə Beynəlxalq Universitetin (INUNIMAI, Avstriya) distansion baza təlim kursu
2017-2018-2019-2020-2021-2022-2023-cü illər Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu
2019-cu il Acıbadem xəstəxanası / Respirator xəstəliklərin müalicə və diaqnostikasına həsr olunmuş beynəlxalq seminar
2024-cü il "Kliniki immunologiya və allerqologiya"/ elmi konfrans
2024-cü il Avropa Allergiya və Klinik İmmunologiya Akademiyasının konqresi / EAACI, The EAACI congress', updated_at = NOW() WHERE slug = 'dr-sema-agamirzeyeva';
UPDATE doctor SET bio = 'Pediatr, Yuvenoloq.

Fəaliyyət sahələri:
0-16 yaş uşaqların müayinə və müalicəsi
Yenidoğulmuşların fiziki inkişafının izlənməsi
9-16 yaş qız uşaqlarında cinsi inkişafın izlənməsi
Tənəffüs sistemi xəstəlikləri
Uşaqlarda qida və mövsümü allergiyalar
Həzm sistemi xəstəlikləri
Sidik yolları xəstəlikləri
Anemiyalar
Avitaminozlar və hipovitaminozlar
Helmintozlar
Pediatrik chek up
Yuvenoloji chek up

Konfranslar:
2022 ci-il Azərbaycan Pediatriya Cəmiyyətinin 1-ci Milli Konqresində iştirak
2022 ci-il Uşaqlarda "Xroniki daxili xəstəliklərin yaranmasına müasir yanaşma"ya dair elmi-praktik seminar
2022 ci-il "Həzm sistemi xəstəliklərinin biotənzimləyici terapiyası"seminar
2023 cü-il "Müxtəlif xəstəliklərin müalicəsində İnteqrativ Təbabətin əvəzedilməz rolu" mövzusunda seminar
2023 cü-il Azərbaycan Pediatriya Cəmiyyətinin 1-ci Beynalxalq Konqresi', updated_at = NOW() WHERE slug = 'dr-semengul-tarverdiyeva';
UPDATE doctor SET bio = 'Pediatr.
Şöbə: Pediatriya', updated_at = NOW() WHERE slug = 'dr-senuber-ismayilova';
UPDATE doctor SET bio = 'Konfranslar:
2007ci il Moskva "Endokrin patologiya zamanı hamiləliyin planlaşdırılması və aparılması"
2009cu il Moskva "Şəkərli diabetli insanların terapevtik təliminin təşkili və aparılması"
2009-cu il Moskva «Diabet pəncəsi sindromunun diaqnostika və müalicəsi"
2009-cu il Moskva "Piylənməsi olan pasientlərin təliminin təşkili və aparılması"
2009, 2010,2011-ci illlər Moskva, Bakı,Bolqariya " İnsulinpompaterapiyasının və Davamlı Qlükoza Monitorinqi (CGMS) aparatının diabetli insanlarda tədbiq edilməsi"
2010-cu il Bakı "Sosial Gigiyena və Səhiyyə Təşkili üzrə kurs"
2014 IME - DC "İnsulinpompaterapiyası " üzrə kurs
2011-ci il SOFİA "Şəkərli diabetin beynəlxalq səviyyədə idarə edilməsi" məruzəçi
2012ci il Los Angeles (USA) "Diabet pəncəsi sindromu" üzrə ( DF GLOBAL )
2011, 2012, 2013, 2014, 2015 Diabetin Öyrənilməsi üzrə Avropa Assosiasiyasının (EASD) illik konfransının iştirakçısı
2015 Avropa Endokrinoloqlar Assosiasiyasının konfrans iştirakçısı ( ESE)
2009 cu ildən (2009 və 2011), (2015), (2017), (2021), (2023) Beynəlxalq Diabet Federasiyasının konfranslarının iştirakçısı (WORLD DIABETES CONGRESS)
2009-2017 Azərbaycanda keçirilən endokrinoloji konfransların iştirakçısı
2015-2017 WEB academy of Diabetology " Şəkərli diabeti olan pasientlərin təlimi" (DESG)
2016 AZƏRBAYCAN RESPUBLİKASI HƏKİMLƏRİN SERTİFİKASİYASI
2016 MEDİPOL UNİVERSİTY HOSPİTAL "SHORT STATURE AND PRECOCİOUS PUBERTY İN PEDİATRİC ENDOCRİNOLOGY"
2017 AZƏRBAYCAN PEDİATRİK ENDOKRİNOLOGİYA KURSU
2017 AZƏRBAYCAN RESPUBLİKASINDA QEYRİ - İNFEKSİON XƏSTƏLİKLƏRLƏ MÜBARİZƏYƏ DAİR KONFRANS
2017 İSTANBUL UNİVERSİTETİ CƏRRAHPAŞA TİP FAKÜLTƏSİ "DİABETİK AYAQ" KONFRANS
2017 Heydər Əliyev Fondu və NovoNordisk şirkətinin birgə təşkil etdiyi "Changing Diabetes Award" layihəsınin qalibi - "İLİN ƏN YAXŞI HƏKİMİ"
2018 TEMD 2018 (TÜRKİYƏ), ENDOBRIDGE 2018 (TÜRKİYƏ), ENDOKURS 2018 (TÜRKİYƏ), EASD 2018 (BERLIN), ACCESS TO NEW THERAPIES 2018
2018, 2019, Ulusal Diabet Və Metabolizma xəstəlikləri konfrans iştirakcısı
2023 "Uşaqlarda nadir endokrin xəstəliklər"
2023 ESPE (Avropa Pediatr Endokrinoloqlarının Cəmiyyətinin konfransı)
2022, 2023, 2024 UPEK (Ulusal Pediatrik Endokrin Konfransı)
2025 ESPE/ESE 2025 COURSE (Uşaqdan Böyüyə keçid Endokrinologiyası üzrə konfrans)', updated_at = NOW() WHERE slug = 'dr-seriyye-agayeva';
UPDATE doctor SET bio = 'Həkim - Mikrobioloq.

Fəaliyyət sahələri:
Bakterioloji müayinələr
Mikroskopik müayinələr
Seroloji müayinələr
Parazitoloji müayinələr
Virusoloji müayinələr
Mikoloji müayinələr', updated_at = NOW() WHERE slug = 'dr-seriyye-rehimova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Pediatr immunoloq, pediatr infeksionist - Uludağ Universiteti, Türkiyə, Bursa
Pediatrik revmatologiya - Medizinische Universität Wien, Allgemeine Krankenhaus Kinderklinik Revmatoloji bölüm, Umumi profilli stasionar və poliklinika, Pulmonoli-allergoloji bölüm, Immunoloji bölüm, Təcili yardım və reanimasiya, Avstriya, Vyana
ELMİ İŞ VƏ MƏQALƏLƏR
Leukocytoclastic Vasculitis in Patients with Severe
Congenital Neutropenia. Authors:Kilic Sara Sebnem1
Mustafayeva Sevda: Ipek, Kezban]: Adim, Saduman B.2.
Source: Journal of Tropical Pediatrics, Volume 56, Number 5, 15 October 2010, pp.359-362

İş təcrübəsi:
2002-2005 Həkim-pediatr-immunoloq, 4saylı Uşaq Poliklinikası, Azərbaycan, Bakı
2005-2006 Həkim-pediatr, Medi Club Klinikası, Azərbaycan, Bakı
2007 - Həkim-pediatr-revmatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevda-mustafayeva';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin planlanması
Normal və riskli hamiləliyin təqibi
Sonsuzluğun müalicəsi
Kolposkopiya
Peyvəndləmə
Uşaqlıq boynu xəstəliklərinin diaqnostikası və müalicəsi
Cinsi yolla keçən infeksiyaların müayinə və müalicəsi
Endokrinoloji ginekologiya, menstrual disfunksiyaların müalicəsi', updated_at = NOW() WHERE slug = 'dr-sevgin-bayramzade';
UPDATE doctor SET bio = 'Sümük iliyi transplantasiyası şöbəsinin müdiri.
Şöbə: Hematologiya', updated_at = NOW() WHERE slug = 'dr-sevil-celilova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

Fəaliyyət sahələri:
Stomatologiya - ortodont
Uşaq stomatologiyası

İş təcrübəsi:
2007-2009 Həkim-stomatoloq, OKİ KLİNİKA, Azərbaycan, Bakı
2009-2017 Həkim-stomatoloq, Sağlam dish klinikasi, Azərbaycan, Bakı
2017 Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevil-huseynova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyin detallı müayinəsi
Abdominal USM ( Qarın boşluğu)
Qalxanabənzər vəzi USM
Süd vəzi USM
Ginekoloji USM
Abdominal USM (Pediatrik)
Neyrosonoqrafiya
Bud-çanaq USM

Konfranslar:
2013-cü il Almaniya , Manheim şəhəri Universitat klinikada 4 həfətlik radiologiya şöbəsində praktika
2015- ci il İnternational Academy of Medical Ultrasound tərəfindən visus course seminar.', updated_at = NOW() WHERE slug = 'dr-sevil-mursaqulova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Şəkərli diabet, Azərbaycan, Bakı

İş təcrübəsi:
1979-1989 Həkim-endokrinoloq, 19 saylı Şəhər poliklinikası, Azərbaycan, Bakı
1989-2001 Həkim-endokrinoloq-ordinator, 4 saylı baş idarənin 1 saylı xəstəxanası, Azərbaycan, Bakı
2006- Həkim-endokrinoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevil-quliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Uşaq yaşlarının kardiorevmatologiyası - Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
Yenidoğulmuşların reanimasiyası və intensiv terapiyası - Uludağ Universiteti Uşaq sağlığı və xəstəlikləri anabilim dalı, Türkiyə, Bursa
Vaxtından əvvəl yeni doğulmuşların intensiv terapiyası, Medikos Beynəlxalq Mərkəz, Azərbaycan, Bakı

İş təcrübəsi:
2001-2010 Sahə həkimi Bakı şəhəri 23 sayli Birləşmiş Şəhər Xəstəxanası, Uşaq poliklinik şöbəsi, Azərbaycan, Bakı
2010- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevinc-abbasova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Pediatrik allerqologiya -Bursa Uludağ Universiteti, Türkiyə, Bursa
Allergik rinit, Bronxial astma müalicəsi
Spesifik allergenimmunoterapiyası

İş təcrübəsi:
2001 - Həkim-pediatr-allerqoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevinc-abdullayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
EKQ-elektrokardioqrafiya
Holter EKQ monitorinqi
Stres Test
Exokardioqrafiya', updated_at = NOW() WHERE slug = 'dr-sevinc-abdullayeva-referans';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Səudiyyə Ürək Assosiasiyasının standar və qaydalarına uyğun olaraq kardiopulmonar reanimasiya(CPR) (BLS provider sertifikatı) - Birləşmiş Ərəb Əmirliyi, Səudiyyə Ərəbistan Krallığı
ACLS - ürək dayanması, ağır aritmiyalar, insult və digər həyati təhlükəli ürək-damar vəziyyətlərində xəstəyə təcili və ixtisaslaşdırılmış tibbi yardım göstərmə - Səudiyyə Ərəbistanı Krallığı, Ər-Riyad

İş təcrübəsi:
1996-1997 Həkim-terapevt, Bakı şəhər "Şəfqət və Sağlamlıq" fondu, Azərbaycan, Bakı
1997-2002 Həkim-terapevt, Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Terapiya kafedrası, Azərbaycan, Bakı
2002-2015 Daxili Xəstəliklər Mütəxəssisi, Zulfi Hospital, Səudiyyə Ərəbistanı Krallığı, Ər-Riyad
2015- Həkim-terapevt, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevinc-elesgerova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Mama-Ginekologiya - Ankara Universiteti Tibb Fakultəsi Qadın Xəstəlikləri və Doğum Anabilim Dalı, Türkiyə, Ankara

İş təcrübəsi:
2011- Həkim-mama-ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevinc-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyin planlaşdırılması və normal/riskli hamiləliyin aparılması
Menstrual disfunksiyanın müalicəsi
Kolposkopiya və uşaqlıq boynu patologiyalarının profilaktikası, erkən diaqnostikası və müalicəsi
Vulva patologiyalarının profilaktikası və müalicəsi
Cinsi yolla ötürülən infeksiyaların diaqnostika və müalicəsi
Reproduktiv sistemin iltihabi xəstəliklərinin müalicəsi
Ailə planlaması (spiral, kontraseptivlər, implant)
Ginekoloji xəstəliklərin USM diaqnostikası və müalicəsi (mioma, endometrioz, hiperplaziya, poliplər)
Klimaks dövrünün idarə olunması, menopauzal terapiya
Qeyri-cərrahi prosedurlar (PRP, intim kontur plast)

Konfranslar:
27-28.04.2011-ci il Konfrans: Uşaqlıq boynu patologiyaları, uşaqlıq boynu xərçənginin profilaktikası (Ufa)
03.09.2012-25.12.2012-ci il Kurs: Ultrasəs diaqnostika
11.10.2016-cı il Seminar: Uşaqlıq boynu, genital infeksiyalar, hormonlar. Kolposkopiya
22.11.2016-ci il Seminar: Vulvovaginal xəstəliklərinin müayinə və müalicəsinin müasir strategiyaları (Moskva)
25.06.2021 -ci il Seminar: CONNEXIO - Qadının sağlamlığı, xalqın sağlamlığı
15.06.2022-ci il Seminar-praktika: Gialuron turşusu ilə intim kontur plastika (Ufa)
03-05.04.2025-ci il Kurs: Ginekoloji endokrinologiya və menopauza (Moskva)', updated_at = NOW() WHERE slug = 'dr-sevinc-quliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Ginekoloji endoskopiya - Rusiya Dövlət Tibb Universiteti, Rusiya, Moskva

İş təcrübəsi:
2007-2011 Həkim-ginekoloq, Ailə Planlaması Mərkəzi, Azərbaycan, Bakı
2011- 2014 Şöbə müdiri, Mama-Ginekologiya İnstitutu, Ekstrakorporal Mayalanma şöbəsi, Azərbaycan, Bakı
2014- Həkim-mama-ginekoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sevinc-sevdimaliyeva';
UPDATE doctor SET bio = 'Fizioterapevt.

Fəaliyyət sahələri:
Sinir sistemi xəstəlikləri
Ateroskleroz
Miosteniya
Miqren
Boyun osteoxondrozu
Mielit
Uşaq xəstəlikləri, anoreksiya
Bronxial astma
Hamiləlik nevropatiyası
Dəri xəstəlikləri - vitiliqo
Saç tökülməsi
Dermatit (dəri qaşınması)

Konfranslar:
2010-2015-ci illər "Fizioterapiya" üzrə ümumi təkmillləşdirmə kursu
2010-2015-ci illər Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu', updated_at = NOW() WHERE slug = 'dr-sexavet-isgenderova';
UPDATE doctor SET bio = 'İnfeksionist.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Yuxarı və aşağı tənəffüs yolu infeksiyaları
Dəri və yumşaq toxuma infeksiyaları
Həzm sistemi infeksiyaları
Virus hepatitləri
Sidik yolu infeksiyaları
Cinsi yolla keçən xəstəliklər
Sümük və oynaq infeksiyaları
Parazit infeksiyaları
Səbəbi bilinməyən qızdırmalar
Diabetik ayaq infeksiyaları', updated_at = NOW() WHERE slug = 'dr-sexavet-xelilli';
UPDATE doctor SET bio = 'LOR (Otorinolarinqoloq).

Fəaliyyət sahələri:
Qulaqla bağlı prosedurlar və müalicə
Otoskopiya (qulaq daxili müayinəsi)
Parasentez (orta qulaqdan maye boşaldılması)
Qulaq yuyulması (müxtəlif səbəblərdən qulaq kanallarının təmizlənməsi)
Qulaqdan yad cisimlərin xaric edilməsi
Xarici otitlərin (iltihabların) müalicəsi
Otodermatitlərin müalicəsi
Otomikozların (qulaq göbələk infeksiyaları) müalicəsi
İrinli və irinsiz orta otitlərin diaqnostikası və müalicəsi
Burun və burunətrafı sinusların prosedurları və müalicəsi
Rinoskopiya (burun daxili müayinə)
Burun yuyulması (burun boşluğunun təmizlənməsi və dezinfeksiyası)
Burun konxalarının anemizasiyası (şişkinliyin azaldılması)
Konxalara inyeksiya (dərman yeridilməsi)
Burun ətrafı sinusların punksiyası (sinuslardan maye çıxarılması)
Burundan yad cisimlərin xaric edilməsi
Politser üsulu ilə hava üfürülməsi (burun-udlaq əlaqəsinin açılması)
Eşitmə borularının kateterizasiyası
Buruna ön və arxa tamponada (qanaxma və ya müdaxilə sonrası tamponlama)
Xroniki və kəskin rinitlərin, sinusitlərin, burun poliplərinin müalicəsi

Konfranslar:
2011, 2016 və 2021-ci illərdə Ə.Əliyev ad. Azərbaycan HTİ sertifikasiya kursu və imtahanı
2018-ci il "Bioloji Təbabətdə tətbiq edilən müalicə üsulları" kursu
2022-ci il "Azerbaijan Otorhinolaryngological Sosiety and Central and West Asian ORL HNS Association 1-st International Congress"
2023-cü il Azərbaycan SN və LOR Hospital 2-ci "Beynəlxalq Otolarinqoloji Simpozium"
2024-cü il "EURASİAN ASSAMBLEY of OTORHİNOLARİNGOLOJİSTS CONGRESS"', updated_at = NOW() WHERE slug = 'dr-seymur-esedov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Histerosalpingografiya (uşaqlıq borularının müayinəsi)
Hamiləliyin izlənməsi (prenatal nəzarət)
Doğuşun təşkili və idarə olunması
Ginekoloji əməliyyatlar (açıq və laparoskopik)
Sonsuzluğun (infertilite) müalicəsi
Hormonal pozğunluqların müalicəsi
Menstrual problemlərin həlli
Uşaqlıq və yumurtalıq xəstəliklərinin müalicəsi
İnfeksiyaların diaqnostikası və müalicəsi
Pap-smear və digər skrininq testləri', updated_at = NOW() WHERE slug = 'dr-seyran-cabbarova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Endokrinoloq.

Fəaliyyət sahələri:
Şəkər xəstəliyi (Diabet)
Zob (Tiroid problemləri)
Sonsuzluq və hormonal problemlər
Sümük əriməsi (Osteoporoz)
Qadınlarda tüklənmə (Hirsutizm)
Polikistik yumurtalıq sindromu (PCOS)
Kişilərdə hormonal problemlər (hormonal zəiflik, sonsuzluq,testosteron azlığı)
Böyümə geriliyi və boy problemi (uşaqlarda)
Qalxanabənzər vəz düyünlərinin diaqnostikası, biopsiyası', updated_at = NOW() WHERE slug = 'dr-sirvan-zekeriyeyev';
UPDATE doctor SET bio = 'Dermatoveneroloq.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Sızanaq (akne ve rozasea)
Psoriaz (pullu dəmrov)
Dərinin allergik xəstəlikləri
Eqzemalar
Saç ve dırnaq xəstəlikləri
Piodermiyalar
Dərinin göbələk mənşəli xəstəlikləri
Dərinin virus mənşəli xəstəlikləri
Piqment xəstəliklər və s.', updated_at = NOW() WHERE slug = 'dr-sona-memmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya - Başkent Universitesi İstanbul Hastanesi, Türkiyə, İstanbul
İnvaziv kardiologiya

İş təcrübəsi:
2023 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-sona-qasimzade';
UPDATE doctor SET bio = 'Ali dərəcəli həkim-terapevt.

Fəaliyyət sahələri:
Qida borusu və mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi
QERX (Qastroezofageal reflüks xəstəliyi)
Barrett sindromu - Qida borusu selikli qişasında reflüksə bağlı dəyişikliklər
Kəskin və xroniki qastrit - Helikobakter Pilori infeksiyası ilə əlaqəli və ya digər səbəblərə bağlı mədə iltihabı
Mədə və 12 barmaq bağırsaq xorası
Funksional dispepsiya
Divertikulyar xəstəlik (divertikulit)
Qeyri-spesifik xoralı kolit və Kron xəstəliyi - İltihabi bağırsaq xəstəliklərinin diaqnostikası və müalicəsi
Bağırsaq disbakteriozu - Mikrobiom tarazlığının pozulması, şişkinlik və diskomfort
Psevdomembranoz kolit - Antibiotik istifadəsindən sonra yaranan ciddi bağırsaq infeksiyası
Qıcıqlanmış bağırsaq sindromu (qəbizlik, diareya ilə) - Stress, qidalanma və digər səbəblərlə əlaqəli bağırsaq hərəkətləri pozuntusu
Virus hepatitləri (A, B, C, D) - Yoluxma yollarına və forma görə fərqli yanaşma tələb edən infeksiyalar
Qeyri-alkoqollu steatohepatit (qaraciyər piylənməsi) - Metabolik sindrom və artıq çəki fonunda yaranan qaraciyər pozuntusu
Alkoqollu qaraciyər xəstəliyi - Uzunmüddətli spirtli içki istifadəsinin təsiri ilə yaranan dəyişikliklər
Autoimmun hepatit
Birincili biliar sirroz
Qaraciyər sirrozu - Qaraciyərin funksional toxumasının çapıq toxuması ilə əvəz olunması, qaraciyər çatışmazlığı riski
Lyambliyoz, askaridoz, enterobioz, toksokaroz və s. - Uşaqlarda və böyüklərdə tez-tez rast gəlinən helmint və protozoon infeksiyalar
COVID-19 sonrası və digər virus xəstəliklərindən sonra reabilitasiya - Ağciyər, ürək və sinir sistemində yaranmış qalıq təsirlərin dəyərləndirilməsi və bərpası
Hipertoniya, taxikardiya, aritmiya və digər dövran pozğunluqları
Bronxit, astma, pnevmoniya və digər ağciyər xəstəlikləri
Sidik yollarının infeksiyaları, sistit, pielonefrit və s. müayinə və müalicəsi

Konfranslar:
Bir çox xarici və yerli konfranslarda iştirak edib.
Qastroenterologiya və Pulmonologiya üzrə davamlı kurslar keçərək ixtisaslaşıb.', updated_at = NOW() WHERE slug = 'dr-sucaet-hesimov';
UPDATE doctor SET bio = 'Konfranslar:
Qalxanabənzər vəzi xəstəlikləri (zob)
Şəkərli diabet
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Osteoporoz (sümük əriməsi)
Xolesterin mübadiləsi pozğunluğu
Endokrin sonsuzluq
Qadınlarda tüklənmə (hirsutizm)
Menstrual tsikl pozğunluğu
Artıq çəki problemi
Endokrin hipertoniya (yüksək qan təzyiqi)', updated_at = NOW() WHERE slug = 'dr-suleyman-piriyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Uşaq nefrologiyası - İstanbul Universiteti Çapa Tibb Fakültəsi, Türkiyə, İstanbul

İş təcrübəsi:
2005- Həkim-pediatr, Mərkəzi Klinika, Azərbaycan Bakı', updated_at = NOW() WHERE slug = 'dr-sulhiyye-elekberova';
UPDATE doctor SET bio = 'Həkim-nefroloq.
Şöbə: Somatika və STROK Mərkəzi', updated_at = NOW() WHERE slug = 'dr-taleh-nagdeliyev';
UPDATE doctor SET bio = 'Konfranslar:
2005-2006-cı ildə Daxili orqanlar üzrə ixtisas artırma kursu
2016-cı ildə World Congress on Ultrasond, Moskva şəhəri
2018-ci ildə "fetal anomaliyaların erkən diaqnostikası" Bakı, Azərbaycan
2022-ci ildə "Advanses in fetal medicine and gynecologic" Bakı, Azerbaijan
2024-cü ildə "Fetal ultrasonoqrafiya günləri"seminarı, Azərbaycan, Şəki
2024-cü il Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu sertifikasiya kursu.', updated_at = NOW() WHERE slug = 'dr-tamara-hesenova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ortopediya-Travmatologiya, İdman həkimliyi və Fizioterapiya

Fəaliyyət sahələri:
Müalicəvi bədən tərbiyəsi və həkim nəzarəti, Sankt-Peterburq Tibb Akademiyası, Rusiya, Sankt-Peterburq

İş təcrübəsi:
1988 -1999 Fizioterapevt, Qəbələ rayon Mərkəzi Xəstəxanası, Azərbaycan, Qəbələ
2000 - 2009 Fizioterapevt, Kral Əbdüləziz Universiteti Xəstəxanası, Səudiyyə Ərəbistanı, Ciddə
2010 - Həkim-fizioterapevt, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-tamerlan-resulov';
UPDATE doctor SET bio = 'Orqan və toxumaların transplantasiyası şöbəsinin müdiri.

Şöbə: Orqan və toxumlar transplantasiyası

Fəaliyyət sahələri:
Orqan nəqli - Akdeniz Universiteti, Türkiyə, Antalya
Qaraciyər, Öd yolları, Mədəaltı vəzi cərrahiyyəsi - Ege Universiteti, Türkiyə, İzmir

İş təcrübəsi:
2009- Həkim-ümumi cərrah, transplantoloq, Mərkəzi Klinika, Azərbaycan, Bakı
2018- Orqan və toxumalar transplantasiyası şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-tariyel-nadirov';
UPDATE doctor SET bio = 'Ali dərəcəli Həkim-Terapevt.

Fəaliyyət sahələri:
Tənəffüs sistemi xəstəlikləri (bronxit, pnevmoniya, BOAX və s.)
Terapevtik profilaktik müayinələr (Check-up)
Arterial hipertoniya və ürəyin işemik xəstəliyi (İÜX)
Hematoloji patologiyalar (qan xəstəlikləri)
Avitaminoz və hipervitaminoz vəziyyətləri
Helmintozlar (qurd xəstəlikləri)
Virus və bakterial mənşəli infeksion xəstəliklər
Dislipidemiya - qanda xolesterin və triqliseridlərin artıqlığı, piylənmə
Allergik reaksiyalar və xəstəliklər
Mədə-bağırsaq traktının xəstəlikləri (qastrit, xoraşəkilli xəstəlik və s.)
Qaraciyər patologiyaları (hepatoz, sirroz və s.)
Sidik-ifrazat (sidik-ifraz) sistemi xəstəlikləri
Revmatoloji xəstəliklər (oynaq və birləşdirici toxuma zədələnmələri)
Bruselloz
Hepatit B və C infeksiyaları', updated_at = NOW() WHERE slug = 'dr-tarqulu-tarquluyev';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yenidoğulmuşların və 1 yaşa qədər uşaqların rutin müayinələri
Sağlam uşaq təqibi, böyümə inkişafının dəyərləndirilməsi
Peyvəndləmə
Tənəffüs yolu, mədə bağırsaq sistemi xəstəlikləri
İnfeksion xəstəliklərin müalicəsi
Helmintlərin (qurd xəstəliyi) müalicəsi
Anemiyalar (qanazlığı) müalicəsi
Allergik xəstəliklər

Konfranslar:
2012-2013-cü illər İstanbul şəhəri, Şişli Etfal Eğitim Araştırma Hastanesi, təcrübə
2021-ci il İzmir şəhəri Ege Universitesi Hastanesi Neonatoloji Yoğunbakım, təcrübə
2022-ci il Neonatal Reanimasiya Proqramı (NRP) kursu
2023-cü il Uşaq Nutrisiologiya və Diyetologiyasının əsasları təlimi (ANDOP)', updated_at = NOW() WHERE slug = 'dr-tehmine-hebibli';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Hamiləliyin müşahidəsi
Qadınlarda iltihabi xəstəliklərinin müalicəsi
Salpinqoqrafiya
Kolposkopiya
Hamiləliyin sonlandırılması
Endometrium və uşaqlıq boynu poliplərinin abroziosu
Eroziyanın kauqleqrafiyası
Boruların medikamlintoz yuyulması
Vaginaplastika
Labioplastikası
UDS (Uşaqlıqdaxili spiralın) qoyulması

Konfranslar:
2002-ci il Həkimlərin təkmilləşdirmə və mama ginekologiya üzrə ixtisaslaşma kursu', updated_at = NOW() WHERE slug = 'dr-telli-osmanova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yuxarı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Rinofarenxit, angina, otit, sinusit və s.)
Aşağı tənəffüs yolu xəstəliklərinin müayinə və müalicəsi (Bronxit, bronxiolit, sətəlcəm və s.)
Mədə-bağırsaq sistemi xəstəliklərinin müayinə və müalicəsi (Qəbizlik, ishal, dispepsiya, qastroenterit, qida intoleransları)
Qurd və parazitar xəstəliklərin müayinə və müalicəsi (Lyambliyoz, askaridoz, enterobioz və s.)
Uşaq infeksion xəstəliklərinin müayinə və müalicəsi (Qızılca, məxmərək, su çiçəyi, razeola infantum, parotit və s.)
Uşaqlarda İmmunitet pozğunluqlarının diaqnostikası və müalicəsi
Yenidoğulmuşların və körpələrin rutin tibbi müşahidəsi (İnkişafın izlənməsi, qidalanma, reflekslər, boy-çəki dinamikası)
Uşaqlarda peyvəndlərin tətbiqi və nəzarəti (Milli peyvənd təqviminə uyğun vaksinasiya və izləmə)
Uşaqlarda Defisit vəziyyətlərin və mikroelement çatışmazlıqlarının dəyərləndirilməsi
Allergik xəstəliklər və atopik halların diaqnostikası və müalicəsi (Atopik dermatit, qida allergiyası, allergik rinit)
Uşaq endokrinoloji problemlərinin ilkin aşkarlanması (Boy geriliyi, piylənmə, erkən və gecikmiş yetkinlik)

Konfranslar:
2011-ci il Uşaqlarda allergik xəstəliklərin müasir aspektləri
2013-cü il "Neonatal resusitasyon" kursu
2015-ci il Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu - Pediatriya kursu
2015-ci il Sertifikasiya şəhadətnaməsi
2016-ci il Short stature and precocious puberty in pediatric endocrinology
2017- ci il Uşaq xəstəlikləri və ruh sağlamlığı
2017-ci il Uşaq xəstəlikləri və sağlamlığı
2017-ci il Allerqologiyada molekulyar diaqnostika
2017-ci il Çocuk sağlığı ve hastalıkları bölümünde doktor(Türkiyə İstanbul)
2018-ci il Vaxtından əvvəl doğulmuşlara həsr olunan konfrans
2018-ci il Revmatologiya yeniliklər
2019-ci il Pediatriyada yeniliklər', updated_at = NOW() WHERE slug = 'dr-terane-bagirova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

İş təcrübəsi:
2011-2012 Həkim-stomatoloq, Qusar rayon Həzrə kənd xəstəxanası, Azərbaycan, Qusar
2012-2014 Həkim-stomatoloq, Sizin stomatoloq Klinikası, Azərbaycan, Bakı
2014-2015 Həkim-stomatoloq, Müasir Diaqnostika Klinikası, Azərbaycan, Bakı
2016-2017 Həkim-stomatoloq, Elis MED MMC, Azərbaycan, Bakı
2017- Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-terlan-huseynov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Böyrək və sidik yollarının infeksiyaları, daşları,onkoloji xəstəlikləri, anadangəlmə xəstəlikləri
Cinsi yolla keçən infeksiyalar
Prostat vəzin xəstəlikləri
Cinsiyyət sistemi xəstəlikləri
Kişi sonsuzluğu
Cinsi zəiflik', updated_at = NOW() WHERE slug = 'dr-teymur-novruzov';
UPDATE doctor SET bio = 'Terapevt, Check Up üzrə mütəxəssis.

Fəaliyyət sahələri:
Tənəffüs sistemi xəstəlikləri
Nefroloji xəstəliklər (böyrək xəstəlikləri)
Sidik yollarının iltihabi xəstəlikləri
Mədə göynəməsi, ishal, meteroizm, mədə xorası və s.
Ürəyin işemik xəstəlikləri
Xroniki baş ağrısı sindromu
Xroniki yorğunluq sindromu
Panik ataklar
Essensial ve ikincili hipertenziyalar
Cinsi Infeksiyalar
Müxtəlif növ anemiyalar
Artrozal, protruziyalar və s.

Konfranslar:
2011-ci il Heydər Əliyevin anım gününə həsr edilmiş "Beynalxalq Ürək Günlər"i konfransı, Naxçıvan
2012-ci il Ağciyər xəstəliklərinin diaqnostikasında müasir yanaşmalar
2013-cü il "Təcili Tibbi Yardımda ilkin yardım və xəstələrin triajlanması"kursu, Qazi Universiteti, Ankara, Türkiyə
2014-cü il "Daxili xəstəliklərin diaqnostikasında müasir yanaşmalar" kursu, Qazi Universiteti, Ankara, Türkiyə
2015-ci il "Cərrahi xəstəliklərin müayinə və müalicəsi təxirəsalınmaz hallar" adlı konfrans, Hacettepe Üniversitesi, Ankara, Türkiyə
2016-cı il "Endokrinoloji xəstəliklərdə onkoloji biliklerin önemi" adlı konfrans, Ankara Üniversitesi Tıp Fakültesi Hematoloji Bilim Dalı, Türkiyə
2019-2020-ci illərdə Androloji xəstəliklərin müayinəsi, diaqnostikası və müalicəsi, Ankara Tibb fakultəsi, Türkiyə', updated_at = NOW() WHERE slug = 'dr-tofiq-huseynzade';
UPDATE doctor SET bio = 'Travmatoloq-ortoped.
Şöbə: Travmatologiya və Ortopediya

İcra etdiyi əməliyyatlar:
Sınıq-travma cərrahiyyəsi
Artroplastika - bud-çanaq, diz oynağı endoprotezləşdirilməsi
Əl cərrahiyyəsi
Artroskopik cərrahiyyə
Anadangəlmə və qazanılma deformasiyaların cərrahiyyəsi və s.', updated_at = NOW() WHERE slug = 'dr-tural-behbudsoy';
UPDATE doctor SET bio = 'Uzman neyrocərrah.
Şöbə: Neyrocərrahiyyə

İcra etdiyi əməliyyatlar:
Baş beyninin törəmələri
Baş beyin və onurğa beyninin kavernomaları
Kiari Malformasiyası (Beyincik sürüşməsi)
Epilepsiya cərrahiyyəsi
Baş beyin və onurğa beyninin absesləri, subdural ampiyemləri
Hidrosefaliya
Travmatik kəskin subdural qanamalar
Xronik subdural qanamalar
Baş beyindaxili qanamalar
Epidural qanamalar
Baş beyninin kistaları
Trigeminal nevralgiya, hemifasiyal spazm (mikrovasküler dekompression)
Trigeminal nevralgiya (Balon kompresyon)
Dekompressiv kraniyoektomiya
Spina bifida əməliyyatları
Bel və boyun fəqərəarası disk yırtıqları
Boyun, döş və bel spinal kanal darlıqları
Karpal tunel sindromu.', updated_at = NOW() WHERE slug = 'dr-tural-ehmedov';
UPDATE doctor SET bio = 'Təcili və təxirəsalınmaz tibbi yardım üzrə həkim.
Şöbə: Təcili və Təxirəsalınmaz Tibbi Yardım

İş təcrübəsi:
2016-2022 - Respublika TTTYS: Təcili və təxirəsalınmaz tibbi yardım üzrə həkim
2020-2021 - Mediplus Tibb Mərkəzi: Terapevt-qastroenteroloq
2019-2020 - ATU Tədris Terapevtik Klinika: Təcili və təxirəsalınmaz tibbi yardım üzrə həkim
2020 - Caspian Hospital: Təcili və təxirəsalınmaz tibbi yardım üzrə həkim
2022 - Yeni Klinika, Təcili və təxirəsalınmaz tibbi yardım şöbəsi: Təcili və təxirəsalınmaz tibbi yardım üzrə həkim
2022 - Xırdalan Tibb Mərkəzi: Terapevt-qastroenteroloq.', updated_at = NOW() WHERE slug = 'dr-tural-eliyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Qulaq-burun-boğaz xəstəlikləri üzrə kadavra - Türkiyə
Qulaq cərrahiyyəsi kadavra kursu - Hershey Universiteti, Amerika
Koklear implant kadavra kursu - Fransa
Federal otorinolarinqologiya elmi mərkəzi koklear implant kursu, Rusiya

İş təcrübəsi:
2011-2023 Həkim-otorinolarinqoloq, Mərkəzi Neftçilər Xəstəxanası, Azərbaycan, Bakı
2018-2023 Həkim-otorinolarinqoloq, Respublika Diaqnostika Mərkəzi, Azərbaycan, Bakı
2023- Həkim-otorinolarinqologiya, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-tural-huseynov';
UPDATE doctor SET bio = 'Almaniyadan dəvətli Qastroenteroloq-Endoskopist.

Fəaliyyət sahələri:
Qastroskopiya
Kolonoskopiya
Polipektomiya
Biopsiya
Proktoskopiya
Hemoroid ligasiyası
Yemək borusu varikozlarının ligasiyası
Yemək borusu stenozlarının (daralmalarının) bouji və ya balonla genişləndirilməsi
Mədə-bağırsaq qanaxmalarının endoskopik üsulla dayandırılması
EMR (Endoskopik Mukozal Rezeksiya)
ESD (Endoskopik Submukozal Diseksiya)
Mədə-bağırsaq traktına, öd axarlarına və mədəaltı vəzin axarına stent yerləşdirilməsi
PEG (Perkutan Endoskopik Qastrostomiya)
ERCP (Endoskopik Retroqrad Xolangiopankreatoqrafiya)
EUS (Endosonoqrafiya) ilə biopsiya, mədəaltı vəzi kistlərinin drenajı və müalicəsi
Qaraciyər abseslərinin drenajı və qaraciyər biopsiyası', updated_at = NOW() WHERE slug = 'dr-tural-memmedov';
UPDATE doctor SET bio = 'İnvaziv-kardioloq.
Şöbə: Ürək-Damar Mərkəzi

İş təcrübəsi:
2019-2023 - ATU Tədris Cərrahiyyə Klinikası: Kardioloq həkim-rezident
2024 - Yeni Klinika: Həkim-kardioloq.', updated_at = NOW() WHERE slug = 'dr-tural-memmedov-yeniklinika';
UPDATE doctor SET bio = 'Bakıdan dəvətli Kardioloq.

Fəaliyyət sahələri:
Anadangəlmə və qazanılma ürək qüsurları
Ürək ritm pozulmaları
Kardiomiopatiyalar
Ürək işemik xəstəlikləri
Hipertoniya xəstəliyi
Ekq
ExoKq
Pediatrik ExoKq
Holter Ekq
Stres
EKQ', updated_at = NOW() WHERE slug = 'dr-tural-quliyev';
UPDATE doctor SET bio = 'İnvaziv-kardioloq.
Şöbə: Kardiologiya

İş təcrübəsi:
2015-2019 - Ədliyyə Nazirliyi Müalicə Müəssisəsi
2019 - 2021 - Bakı Sağlamlıq Mərkəzi: Kardioloq rezident
2021-2023 - ATU Tədris Cərrahiyyə Klinikası: Kardioloq rezident
2023-2024 - Gülhane Eğitim Araşdırma Hastanesi: İnvaziv kardiologiya ixtisaslaşma kursu.', updated_at = NOW() WHERE slug = 'dr-tural-sadiqov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Onkoginekoloq.', updated_at = NOW() WHERE slug = 'dr-turkan-mansurova';
UPDATE doctor SET bio = 'Uzman travmatoloq-ortoped.
Şöbə: Travmatologiya və Ortopediya

İş təcrübəsi:
2012-2020 - Azərbaycan Respublikası Müdafiə Nazirliyi Baş Klinik Hospitalı
2021 - N.Tusi adına klinika: Travmatoloq-ortoped
2022 - Mediland Klinikası: Travmatoloq-ortoped
2023 - bu günə kimi - Yeni Klinika: Travmatoloq-ortoped.', updated_at = NOW() WHERE slug = 'dr-turkel-huseynov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

İş təcrübəsi:
2024- Həkim-neyrocərrah, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ufuq-huseynli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Göz xəstəlikləri - Allgemeinen Krankenhaus Xəstəxanası, Avstriya, Vyana

İş təcrübəsi:
1996-2001 Həkim-oftalmoloq, Mir Qasımov adına Respublika Klinik Xəstəxanası, Azərbaycan, Bakı
2001- Həkim-oftalmoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ulker-ebilova';
UPDATE doctor SET bio = 'Nevroloq.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Müxtəlif növ baş ağrıları, başgicəllənmələr
Depressiyalar və digər nevrotik pozğunluqlar
Serebrovaskulyar xəstəliklər (insultlar)
Yuxu pozulmaları
Yaddaş pozulmaları
Parkinson və digər hərəkət pozulmaları
Epilepsiya
Müxtəlif növ onurğa problemləri və radikulopatiyalar
Müxtəlif sinir və əzələ xəstəlikləri.

Üzvlük:
Milli Nevroloqlar Assosasiyası üzvü
Epilepsiya Əleyginə Beynəlxalq Liqa üzvü (İİAE)', updated_at = NOW() WHERE slug = 'dr-ulker-mirzezade';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Uşaq endokrinologiyası - Uludağ Universiteti Tibb Fakultesi Türkiyə, Bursa

İş təcrübəsi:
2005-2006 Həkim-terapevt, Sağlam Ailə MMC, Azərbaycan, Bakı
2009 - Həkim-pediatr-endokrinoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-ulker-seyidova';
UPDATE doctor SET bio = 'Qastroenteroloq-Hepatoloq, Endoskopist.

Fəaliyyət sahələri:
Qida Borusu və Mədə-Bağırsaq Xəstəlikləri:
Qida borusu reflüks xəstəliyi (QERX)
Kardiyanın axalaziyası
Diafraqmanın qida borusu dəliyinin yırtığı
"Plummer-Vinson" sindromu
Barrett qida borusu
Qida borusu xorası
Kəskin və xroniki qastrit
Alkalen reflüks-qastrit
Mədə və onikibarmaq bağırsaq xora xəstəliyi
Zollinger-Ellison sindromu
Funksional dispepsiya
Divertikulyar xəstəliyi
Qeyri - spesifik xoralı kolit
Kron xəstəliyi
Bağırsaq disbakteriozu
Qəbizlik
Babasil xəstəliyi (hemoroid)
Anal çat
Qıcıqlanan bağırsaq sindromu
Qaraciyər Xəstəlikləri:
Hepatitlər (A, B, C, D, E)
Steatohepatit (alkoqollu və qeyri-alkoqollu)
Qaraciyər piy distrofiyası
Qaraciyər sirrozu və absessi
Autoimmun hepatit
Biliar sirroz
Qaraciyər kistləri və exinokokkozu
Hemokromatoz və Vilson xəstəliyi
Öd yolu və pankreatit xəstəlikləri:
Öd daşı xəstəliyi
Öd yollarının diskineziyası
Kəskin xolesistit
Bakterial xolangit
Birincili skleroz xolangit
Kəskin və xroniki pankreatit', updated_at = NOW() WHERE slug = 'dr-ulvi-ibrahimov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Müayinə istiqaməti
Hamiləlik dopler 3D, 4D
Süd Vəzisi
Abdominal
Bud-çanaq
Neyrosonoqrafiya
Arteriya Vena
Qalxanvari vəz', updated_at = NOW() WHERE slug = 'dr-ulviyye-canmemmedli';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yenidoğulmuşların müayinələri və 1 yaşa qədər aylıq rutin müayinələrinin aparılması
Yuxu rejiminin formalaşmasında yanaşma
Qidalanma üzrə tövsiyyələr
Uşaqlarda böyümə və inkişafın dəyərləndirilməsi
Peyvənd təqviminə uyğun peyvənd öncəsi müayinələr
Pediatrik Check-up müayinələr
Anemiyalar
Allergik xəstəliklər
Dəri xəstəlikləri
Avitaminoz və hipervitaminozlar
Qurd xəstəlikləri
Mədə-bağırsaq sistemi xəstəlikləri
Müxtəlif virus və bakterial mənşəli xəstəliklər
Tənəffüs sistemi xəstəlikləri
Öyrənmə çətinliyi və davranış pozuntusu olan uşaqlara yanaşma
Yeniyetmələ yanaşma

Konfranslar:
2020 ci il "Nutrition for kids " Gogo school ukrayna
2021 ci il Pediatrik xəstələrə Multidisiplianar yanaşma simpoziumu
2021 ci il Təkmil həyat dəstəyi təlimi ÜST Sağlam davranış nəzəriyyəsi və qeyri infeksion xəstəliklərin proflaktikası
2022 ci il NUTRİTİON ''22 "Sürdürülə bilir beslenme","Sezgisel beslenme","Yemə bozukluğu"', updated_at = NOW() WHERE slug = 'dr-ulviyye-heziyeva';
UPDATE doctor SET bio = 'Ümumi Cərrah.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Mədəkiçiltmə əməliyyatı
Xolesistektomiya açıq və qapalı
Laparoskopik fundoplikasiya
Laparoskopik exinokokkektomiy
Açıq və qapalı üsulla appendektomiya
Proktoloji əməliyyatlar
Yırtıq cərrahiyyəsi
Mədə bağırsaq üzərində icra edilən əməliyyatlar
Tiroid vəzi üzərində icra edilən əməliyyatlar
Abdominoplastika.', updated_at = NOW() WHERE slug = 'dr-urfan-ismayilov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Mərkəzi sinir sistemi xəstəliklərinin müayinə və müalicəsi
Beyin qan dövranı pozğunluqları - İsemik və hemorragik insult, xroniki serebrovaskulyar çatışmazlıq, başgicəllənmə və yeriş pozğunluğu kimi halların dəyərləndirilməsi.
Mərkəzi sinir sisteminin infeksion xəstəlikləri - Ensefalit, meninqit və digər neyroinfeksiyalar.
Epilepsiya - Tutmalarla müşayiət olunan xəstəlik; EEG və medikamentoz nəzarət altında olan müalicə proqramları ilə idarə olunur.
Parkinson xəstəliyi və parkinsonizm sindromu - Əl titrəməsi, hərəkət ləngiməsi, əzələ sərtliyi və digər motor pozuntuların erkən diaqnostikası və müalicəsi.
Dağınıq skleroz - Autoimmun mənşəli demielinizəedici xəstəlik; görmə, hissiyat və hərəkət pozuntuları ilə müşayiət olunur.
Yan Amiotrofik Skleroz (ALS) - Sinir-əzələ aparatını tədricən zəiflədən və ciddi nəzarət tələb edən neyrodegenerativ xəstəlikdir.
Periferik və vegetativ sinir sistemi pozğunluqlarının müayinə və müalicəsi
Periferik sinir sistemi xəstəlikləri - Nevritlər, neyropatiyalar, sinir blokları və müxtəlif ağrılı sindromların dəyərləndirilməsi və müalicəsi
Vegetativ sinir sistemi xəstəlikləri - Təzyiqin sabit olmaması, tərləmə, ürəkdöyünmə, panik atak və digər psixosomatik halların dəyərləndirilməsi və müalicəsi.
Onurğa sütunun degenerativ xəstəlikləri - Protruziya, fəqərəarası disk yırtığı, osteoxondroz, radikulopatiya və onurğa kanalının daralması ilə müşayiət olunan halların müalicəsi.
Baş və sinir sistemi ilə əlaqəli funksional pozğunluqların müayinə və müalicəsi
Baş ağrıları - Miqren, gərginlik tipli, kümevi və ikincili baş ağrılarının səbəblərinin araşdırılması və müalicəsi.
Başgicəllənmə (vertigo) - Vestibulyar sistem və ya mərkəzi sinir sistemi mənşəli başgicəllənmələrin differensial diaqnozu.
Sinir-əzələ xəstəlikləri - Miyopatiyalar, miasteniya və sinir-əzələ keçiriciliyinin pozulması ilə xarakterizə olunan hallar.
Sinir tikləri və qeyri-iradi hərəkətlər - Uşaq və böyüklərdə rast gəlinən motorik və vokal tiklərin müayinəsi və idarə olunması.
Yuxu pozğunluqları - Yuxuya getmədə çətinlik, tez oyanma və keyfiyyətsiz yuxu kimi problemlərin müalicəsi.
Nevrozlar - Stress, narahatlıq, emosional gərginlik və digər funksional pozğunluqlarla müşahidə olunan vəziyyətlər.
Enurez (gecə sidiyə qaçırma) - Xüsusilə uşaqlarda rast gəlinən, nevrogen və ya psixogen mənşəli halların dəyərləndirilməsi və müalicəsi.

Konfranslar:
1996-cı il Ə.Əliyev adına AHTİ, Nevrologiya üzrə ixtisaslaşma kursu.
01.06-30.06.2004-cü illərdə Periferik sinir sisteminin müalicəsi üzrə təkminləşmə kursu.
14.05-13.07.2012-ci illərdə Nevropatologiya üzrə ümumi təkminləşmə kursu.', updated_at = NOW() WHERE slug = 'dr-vaqif-ibrahimov';
UPDATE doctor SET bio = 'Ümumi cərrahiyyə uzmanı.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi

İcra etdiyi əməliyyatlar:
Endokrin sistemin cərrahi xəstəlikləri
Qalxanabənzər vəzi
Qalxanabənzər ətraf vəzi
Böyrəküstü vəzin cərrahi xəxtəlikləri.
Mədə bağırsaq sisteminin cərrahi xəstəlikləri:
Qida borusu
Mədə
Onikibarmaq bağırsaq
Nazik və yoğun bağırsağın cərrahi xəstəlikləri.
Hepatobilier sisteminin cərrahi xəstəlikləri:
Qaraciyər və öd yolları
Medealti vəzi
Öd kisəsi xəstəliklərinin cərrahi müalicəsi
Qarın divarı yırtıqları və dalağın cərrahi xəstəlikləri
Perianal bölgə xəstəlikləri
Anal çat
Hemorroid
Perianal fistula.

İş təcrübəsi:
2023 - Yeni Klinika: Həkim-ümumi cərrah.', updated_at = NOW() WHERE slug = 'dr-vaqif-qurbanov';
UPDATE doctor SET bio = 'Tibbi Laboratoriya şöbəsinin müdiri.

Şöbə: Tibbi Laboratoriya

Fəaliyyət sahələri:
Klinik-Diaqnostik həkim, Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı
Diaqnostik Laboratoriya - Düzen Laboratoriyaları, İstanbul, Türkiyə
Laboratoriya - Adana Çukurova Unversiteti, Anadolu Saglik Mərkəzi (Gəbzə)
SYNLAB laboratoriyası (qan analizləri, hormon testləri, vitamin testləri, genetik testlər, PCR və infeksiya testləri, check-up paketlər) - Türkiyə, Ankara

İş təcrübəsi:
1992-1996 Laborant, Dövlət Dəmiryol xəstəxanası, Azərbaycan, Bakı
1996-2000 Həkim-laborant, AR Səhiyyə Nazirliyi 4 №-li Baş İdarənin 1 saylı Xəstəxanası, Azərbaycan, Bakı
2000- Həkim-laborant, Mərkəzi Klinika, Azərbaycan, Bakı
2007- Tibbi laboratoriya şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-vecihe-heziyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Mərkəzi sinir sistemi xəstəliklərinin müayinə və müalicəsi
Beyin qan dövranı pozğunluqları - İsemik və hemorragik insult, xroniki serebrovaskulyar çatışmazlıq, başgicəllənmə və yeriş pozğunluğu kimi halların dəyərləndirilməsi.
Mərkəzi sinir sisteminin infeksion xəstəlikləri - Ensefalit, meninqit və digər neyroinfeksiyalar.
Epilepsiya - Tutmalarla müşayiət olunan xəstəlik; EEG və medikamentoz nəzarət altında olan müalicə proqramları ilə idarə olunur.
Parkinson xəstəliyi və parkinsonizm sindromu - Əl titrəməsi, hərəkət ləngiməsi, əzələ sərtliyi və digər motor pozuntuların erkən diaqnostikası və müalicəsi.
Dağınıq skleroz - Autoimmun mənşəli demielinizəedici xəstəlik; görmə, hissiyat və hərəkət pozuntuları ilə müşayiət olunur.
Yan Amiotrofik Skleroz (ALS) - Sinir-əzələ aparatını tədricən zəiflədən və ciddi nəzarət tələb edən neyrodegenerativ xəstəlikdir.
Periferik və vegetativ sinir sistemi pozğunluqlarının müayinə və müalicəsi
Periferik sinir sistemi xəstəlikləri - Nevritlər, neyropatiyalar, sinir blokları və müxtəlif ağrılı sindromların dəyərləndirilməsi və müalicəsi
Vegetativ sinir sistemi xəstəlikləri - Təzyiqin sabit olmaması, tərləmə, ürəkdöyünmə, panik atak və digər psixosomatik halların dəyərləndirilməsi və müalicəsi.
Onurğa sütunun degenerativ xəstəlikləri - Protruziya, fəqərəarası disk yırtığı, osteoxondroz, radikulopatiya və onurğa kanalının daralması ilə müşayiət olunan halların müalicəsi.
Baş və sinir sistemi ilə əlaqəli funksional pozğunluqların müayinə və müalicəsi
Baş ağrıları - Miqren, gərginlik tipli, kümevi və ikincili baş ağrılarının səbəblərinin araşdırılması və müalicəsi.
Başgicəllənmə (vertigo) - Vestibulyar sistem və ya mərkəzi sinir sistemi mənşəli başgicəllənmələrin differensial diaqnozu.
Sinir-əzələ xəstəlikləri - Miyopatiyalar, miasteniya və sinir-əzələ keçiriciliyinin pozulması ilə xarakterizə olunan hallar.
Sinir tikləri və qeyri-iradi hərəkətlər - Uşaq və böyüklərdə rast gəlinən motorik və vokal tiklərin müayinəsi və idarə olunması.Yuxu pozğunluqları - Yuxuya getmədə çətinlik, tez oyanma və keyfiyyətsiz yuxu kimi problemlərin müalicəsi.
Nevrozlar - Stress, narahatlıq, emosional gərginlik və digər funksional pozğunluqlarla müşahidə olunan vəziyyətlər.
Enurez (gecə sidiyə qaçırma) - Xüsusilə uşaqlarda rast gəlinən, nevrogen və ya psixogen mənşəli halların dəyərləndirilməsi və müalicəsi.

Konfranslar:
2019-ci il - Türkiyə, Çukurova Universiteti, Balcalı xəstəxanası Nevrologiya şöbəsi, ixtisasartırma kursu
2017-ci il - Azərbaycan Nevroloqlar Assosiyası, "Azərbaycan Epilepsiya ilə mübarizə Liqasının 1-ci regional elmi-praktiki konfransı"
2019-cu il - Türkiyə Mediapol Universitetinin Hospitalının təşkil etdiyi "Parkinson xəstəliyinin diaqnostikası və müalicəsi" mövzusunda seminar
2021-ci il - Narınc Psixologiya Mərkəzi tərəfindən təşkil edilmiş "Uşaqlarda ən çox rast gəlinən psixoloji problemlər" adlı təlim', updated_at = NOW() WHERE slug = 'dr-vefa-eliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Uşaq kardiologiyası

Fəaliyyət sahələri:
Uşaq kardiologiyası, Hacettepe Universiteti Tibb Fakultəsi, Türkiyə, Ankara

İş təcrübəsi:
2011- Həkim-uşaq kardioloqu, Mərkəzi Klinika, Azərbaycan, Bakı
2016- Uşaq kardiologiyası bölməsinə məsul şəxsi, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-veli-behbudov';
UPDATE doctor SET bio = 'Konfranslar:
2015‐ci ildə Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, "Kardiologiyanın aktual məsələləri" kursu
2017- ­2019­cu illərdə Türkiyədə 33‐cü
Ulusal Kardiyoji Konqresi (Antalya) və 35‐ci Ulusal Kardiyoji Konqresi (Antalya)
Xarici ölkələrdə və Azərbaycanda bir çox Beynəlxalq kurslar, seminarlar və konfranslarda iştirak edib.', updated_at = NOW() WHERE slug = 'dr-vuqar-abbasov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Nevroz
Panik atak
Depressiya
Baş ağrıları
Baş gicəllənmələr (Vertiqo)
Onurğa problemləri
Epilepsiya
Parkinsonizm
Polineyropatiyalar
İqloterapiya
EEQ

Konfranslar:
2008- ci ildə Akupunktura kursu, Bakı
2009-cu ildə EEQ kursu, Sankt Peterburq
2013-cü ildə Nevrologiya üzrə sertifikasiya kursu
2017-ci ildə Baş ağrısının ümumi və differensial diaqnostikası
2017-ci ildə Vertiqonun diaqnostikası, Master klas
﻿- 2020-ci il İnsultun menecmenti kursu
2020-ci il Modern Challenges of Medicine
2021-ci il Miqren, Diaqnostika menecmenti kursu
2022-ci il Baş ağrıları, Differensial diaqnostika və müalicə prinsipləri
2022-ci il Nevrologiya sertifikasiya kursu
2024-ci il Türkdilli dövlətlərin 5-ci beynelxalq nevroloji konqresi', updated_at = NOW() WHERE slug = 'dr-vuqar-mustafayev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Stomatologiya

İş təcrübəsi:
2011-2012 Həkim-stomatoloq, Şəki şəhər Qarışıq tipli uşaq evi, Azərbaycan, Şəki
2013-2015 Həkim-stomatoloq, 2 saylı Stomatoloji poliklinika, Azərbaycan, Bakı
2015- Həkim-stomatoloq, Mərkəzi Klinika Stomatologiya, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-vuqar-verdixanov';
UPDATE doctor SET bio = 'Endokrinoloq-Dietoloq.

Fəaliyyət sahələri:
Şəkərli diabet (Tip 1 və Tip 2)
Şəkərsiz diabet
Hamiləlikdə (hestasion) diabet - Ana və döl üçün riskləri azaldan nəzarət və müalicə proqramı
Artıq çəki və piylənmə - Hormonal səbəblərin araşdırılması və endokrin yanaşmalarla müalicə
Ağır dərəcəli çəki azlığı - Maddələr mübadiləsi və hormon çatışmazlıqlarının qiymətləndirilməsi
Qalxanabənzər vəzi xəstəlikləri - Hipotiroidizm, hipertiroidizm, düyünlü zob və s.
Hipofiz vəzi xəstəlikləri - Hormon ifrazının azalması və ya artması ilə bağlı pozuntular (akromqeliya, prolaktinoma və s.)
Böyrəküstü vəzi xəstəlikləri - Kortizol, aldosteron və digər hormon balansı pozuntuları (Addison, Kuşinq sindromları və s.)
Menstrual tsiklin pozulması - Hormonal disbalans, polikistoz, amenoreya və s.
Hirsutizm - Qadınlarda kişi tipli tüklənmənin endokrin səbəblərinin aşkarlanması
Qadınlarda sonsuzluq - Yumurtlama problemləri və hormon pozğunluqlarının diaqnostikası
Kişilərdə hormonal mənşəli sonsuzluq - Testosteron çatışmazlığı, prolaktin yüksəkliyi və digər səbəblərin araşdırılması
Osteoporoz - Sümük sıxlığının azalması, sınıq riskinin qiymətləndirilməsi və müalicəsi
Digər metabolik sümük xəstəlikləri - D vitamini çatışmazlığı, paratiroid vəzi xəstəlikləri və s.
Hipertoniya - Yüksək qan təzyiqinin qalxanabənzər, böyrəküstü vəzi və digər hormonal səbəblərlə əlaqəsinin dəyərləndirilməsi

Konfranslar:
2015-ci il - "Diyabet Hastalığının Modern Yöntemlerle Kontrol altına alınması" Konfrans, Medical Park Hospital
2016-cı il -"Diabetic foot -and multidisciplinary approach" Konfransı
2016-cı il -"Short stature and precoccious puberty in pediatric endocrinology" Simpozium
2017-ci il "Diabetik ayaq günü" adlı elmi-praktiki konfrans
2017-ci il "Endo Bridge" Endokrinoloji Konfrans, Türkiyə, Antalya 2017-ci il Reproduktiv endokrinologiya kursu (СЗГМУ имени И.И.Мечникова), Sankt-Peterburq şəhəri
2018-ci il 8.Türkiye Tiroid Hastalıkları Kongresi və Ultrasonografi kursu
2019-cu il 15. Hipofiz Sempozyumu, Ankara
2018-ci il "Endokrinoloji kurs" Ankara Universiteti Tıp Fakultesi Hastanesi, İbn Sina Hastanesi, Türkiyə, Ankara şəhəri
2018 -ci il "Azərbaycan Türkiyə Pediatrik Endokrin" kursu
2018-ci il Attendance at Thyroid Meeting with ETA speakers
2018-ci il "40. Türkiye Endokrinoloji ve Metabolizma Hastalıkları Kongresi" Türkiyə , Antalya', updated_at = NOW() WHERE slug = 'dr-vusale-babayeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
İnfeksion xəstəliklər - Akdeniz Universitesi Hastanesi, Enfeksiyon Hastalıkları ve Klinik Mikrobioyolji Anabilim Dalı, Türkiyə, Antalya
İnfeksion xəstəliklər - Uludağ Unversitesi Hastanesi, Enfeksiyon Hastalıkları ve Klinik Mikrobioyolji Anabilim Dalı, Türkiyə, Bursa

İş təcrübəsi:
2016-2017 İnfeksion xəstəliklər, Kliniki Tibbi Mərkəz, Azərbaycan, Bakı
2018- Həkim-infeksionist, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-vusale-memmedzade';
UPDATE doctor SET bio = 'Otorinolarinqoloq.

Fəaliyyət sahələri:
Otitlərin (qulaq iltihabı) müalicəsi
Qulaq kiri tıxacının (sera) təmizlənməsi
Otomikozların (göbələk infeksiyası) müalicəsi
Qulaqdan yad cismin çıxarılması
Vazomotor və allergik rinitlərin müalicəsi
Sinusitlərin (haymorit və s.) müalicəsi
Kəskin və xroniki tonzillit, faringit və laringitlərin müalicəsi

Konfranslar:
10.02.2018-ci il I Qış Simpoziumu
02-03.09.2022-ci il AOS ACASOS I ORL Konqresi
23-24.06.2023-cü il II Otorinolarinqoloji Simpozium
31.05.2024-cü il EAO (Eurasian Assembly of Otorhinolaryngologists)
17.05.2025-ci il Azərbaycan Otorinolarinqologiya Cəmiyyətinin III Beynəlxalq Konqresi', updated_at = NOW() WHERE slug = 'dr-vusale-qurbanova';
UPDATE doctor SET bio = 'İnfeksionist-Hepatoloq,Yara və Podologiya Mərkəzinin rəhbəri.

Fəaliyyət sahələri:
Virus hepatitləri
Bruselloz
Toksoplazmoz və digər zoonoz infeksiyalar
Mədə-bağırsaq infeksiyaları
Səbəbi bilinməyən qızdırmalar
Diabetik ayaq infeksiyaları
Dəri və yumşaq toxuma infeksiyaları
İmmunsupressiv xəstələrdə infeksiyalar
Tənəffüs yolları infeksiyaları
Sidik-cinsiyyət yolları infeksiyaları
Virus infeksiyaları
Rasional antibiotikoterapiya, infeksion kontrol

Konfranslar:
2019-cu il "5-ci İnfeksion xəstəliklər" konfransı, Moskva
2022-ci il Ankara İnfeksion Çalıştayı
2018-ci il 19cu KlİMİK kongresi, Antalya
2017-2019-cu illər Türkiyə-Azərbaycan Hepatoloji Kurs, İstanbul
2021-ci il 15-ci Yara Kongresi, Antalya
2022-ci il 10-cu EKMUD kongresi, Antalya
2022-ci il HiV/AİDS kursu, İstanbul
Bir çox ölkədaxili və xarici konfranslarda Məruzəçi olaraq iştirak edib.', updated_at = NOW() WHERE slug = 'dr-vusale-yasar';
UPDATE doctor SET bio = 'Uzman Mama-ginekoloq.
Şöbə: Mamalıq və Ginekologiya', updated_at = NOW() WHERE slug = 'dr-xalide-efendi';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Ekstrakorporal terapiya

İş təcrübəsi:
2018 - Həkim-reanimatoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-xaliq-bagirov';
UPDATE doctor SET bio = 'Dəvətli Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin təqibi
Təbii doğuş və qeysəriyyə
Sonsuzluğun müalicəsi
Uşaq və yeniyetmələrin ginekologiyası
Hormonal pozulmaların müalicəsi
Laparoskopik ginekoloji əməliyyatlar
Uşaqlıq boynu eroziyasının cərrahi və konservativ (dərmanlarla) müalicəsi
Kolposkopiya (uşaqlıq boynunun müayinəsi)
Histeroskopiya (uşaqlığın müayinəsi)
Histerosalpinqoqrafiya (uşaqlıq borularının yoxlanılması)
Ginekoloji USM', updated_at = NOW() WHERE slug = 'dr-xanim-resid';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
İnsult
Epilepsiya
Ostroxondroz və onun fəsadları
Nryropatiyalar
Hipertoniya və hipertonik krizlər
Mielit və ensefalomielit
Dağınıq skelearoz
Alsgeymer xəstəliyi və s.

Konfranslar:
1998-ci il ixtisas dəyişmə kursu keçərək həkim Nevropatoloq ixtisası almışdır.
I və II Türk dilli dövlətlərin Nevroloqlarının Qurultayının iştirakçısı olmuşdur.
2017-ci il Avstriyada Beynəlxalq Nevroloji Konfransda iştirak edib.
5 dəfə həkimlərin ixtisaslaşma kursu keçmişdir.', updated_at = NOW() WHERE slug = 'dr-xanlar-atakisiyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Orqan və toxumların transplantasiyası

Fəaliyyət sahələri:
Tranplant nefrologiyası - Yeni Yüzyıl Universitesi Gaziosmanpaşa Hastanesi İç Hastalıkları Anabilim Dalı Nefroloji Bilim Dalı, Türkiyə, İstanbul

İş təcrübəsi:
2018- Həkim-nefroloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-xeyal-rustemov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Müayinə və Müalicə istiqamətləri:
Yenidoğulmuşların müayinəsi
Uşaqların fiziki və psixi inkişafının qiymətləndirilməsi
Müxtəlif mənşəli anemiyalar, onların fəsadları
Burun qanaxmaları, digər mənşəli qanaxmalar
Mədə-bağırsaq xəstəlikləri
Sidik-ifrazat sistemi xəstəlikləri
Tənəffüs sistemi xəstəlikləri
Müxtəlif mənşəli allergiyalar
Boy qısalığı, çəki artıqlığı, inkişafdan qalma
Baş ağrıları, diqqət zəifliyi
Qurd xəstəlikləri
Revmatizm və digər revmatoloji xəstəliklər', updated_at = NOW() WHERE slug = 'dr-xeyale-ehmedova';
UPDATE doctor SET bio = 'Terapevt.
Şöbə: Somatika və STROK Mərkəzi

Müalicə etdiyi xəstəliklər:
Anemiyalar (Qan azlığı)
Qaraciyər xəstəlikləri (Hepatitlər)
Mədəaltı vəz xəstəlikləri
Revmatoloji xəstəliklər
Vitamin çatışmazlıqları
Böyrək xəstəlikləri
Ağciyər xəstəlikləri
Səbəbi bilinməyən qızdırmalar', updated_at = NOW() WHERE slug = 'dr-xeyale-kerimova';
UPDATE doctor SET bio = 'Laboratoriya müdiri, Həkim-laborant.

Konfranslar:
2016-cı ildə B.Ə.Eyvazov adına Elmi Tətqiqat Hematologiya və Transfuziologiya İnstitutu- Periferik qan və sümük iliyi yaxmaları kursu.
2019-cu ildə ATKLMD Laborator diaqnostikalara giriş və yeniliklər.
2021-ci ildə Klinik Təbabətdə Laborator diaqnostikanın rolu, Ənənələr və İnnovasiyalar Elmi-praktik konfrans.
2019-cu ildə ATU Tədris Terapevtik Klinika. EUCAST/CLSİ kriteriyaları
2022-ci ildə Beynəlxalq Keyfiyyətin idarə edilməsi. İSO 9001:2015
2022-ci ildə Hemoqlobinopatiyaların Laborator diaqnostikası.
2022-ci ildə II Beynəlxalq Laboratoriya Təbabəti konfransı.
2023-cü ildə AZLTK8Lab EXPO 2023 I Beynəlxalq Azərbaycan Laborator Tibb konqresi
2023-cü ildə Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu. İnfeksion İmmunologiya. Bağırsaq infeksiyalarının mikrobiologiyası.', updated_at = NOW() WHERE slug = 'dr-xeyale-sirinova';
UPDATE doctor SET bio = 'Həkim - Mikrobioloq.

Fəaliyyət sahələri:
Bakterioloji müayinələr
Mikroskopik müayinələr
Seroloji müayinələr
Parazitoloji müayinələr
Virusoloji müayinələr
Mikoloji müayinələr

Konfranslar:
2021-ci il Covid -19 Erkən və Gecikmiş Fəsadlar Beynəlxalq Elmi Konfrans
2019-cu il Dünya Səhiyyə Təşkilatının Antibiotiklərə Həssaslıq konfransı
2021-ci il Təməl Həyat Dəstəyi Konfransı
2022-ci ildə Covid-19 və Xəstəxanadaxili İnfeksiyalar Beynəlxalq Elmi Konfrans
2023-cü ildə Təbii Ocaqlı infeksion xəstəliklər mövzusu üzrə təlim', updated_at = NOW() WHERE slug = 'dr-xumar-memmedli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Transtorasik və Transezofagial Exokardioqrafiya

İş təcrübəsi:
2014- Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-xumar-osmanli';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Travmatologiya, Ortopediya, İdman Həkimliyi

Fəaliyyət sahələri:
Əl cərrahisi - Türk El və Üst EkstremiteCerrahisi Dernegi, Türkiyə, Ankara
İnkişaf anomaliyalı Bud-Çanaq Oynağı Displaziyası və Pes Ekinovarus (əyripəncəlik) - Baltalimanı, Kemik Xəstəxanası, Türkiyə, İstanbul
Travma cərrahiyyəsi
İdman və artroskopik cərrahiyyə
Uşaq ortopediyası
Oynaq xəstəliklərində endoprotez əməliyyatları

İş təcrübəsi:
2019 - 2021 Həkim-travmatoloq-ortoped, İzmir Özəl Kent Xəstəxanası, Türkiyə, İzmir
2021 - Həkim-travmatoloq-ortoped, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-yasin-haxverdiyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Mikrobiologiya,Ankara Numune Egitim ve Arastirma Hastanesi, Türkiyə, Ankara
Mikrobioloji, androloji, Gülhane askeri tıp akademisi, Türkiyə, İstanbul
Embrioloji və androloji, İstanbul Memorial Xəstəxanası, Türkiyə, İstanbul
Embrioloji, Acıbadem Kent Hastanesi Türkiyə, İzmir

İş təcrübəsi:
1997-2000 Həkim-laborant, 1 saylı şəhər Dəri-Zöhrəvi Dispanseri, Mikoloji Laboratoriya Azərbaycan, Bakı
2000- Həkim-mikrobioloq-embrioloq Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-zahire-esedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yeni doğulmuşların müayinəsi və tibbi izlənməsi
Körpə və uşaqların ümumi pediatrik müayinəsi
Uşaq xəstəliklərinin diaqnostikası və müalicəsi
Peyvəndləmə və peyvənd cədvəlinin aparılması
Boy və çəki nəzarəti
Kəskin və xroniki xəstəliklərin izlənməsi
Allergik xəstəliklər: atopik dermatit, allergik rinit, bronxial astma, allergik konyunktivit
Profilaktik müayinələr (sağlam uşaq nəzarəti)

Konfranslar:
2021-2022-ci illər 65-66-cı Beynəlxalq Türkiyə Milli Pediatriya Konqresi
2022-ci il World Allergy Congress', updated_at = NOW() WHERE slug = 'dr-zaur-mutellibov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Tibbi Laboratoriya

İş təcrübəsi:
2004 - 2009 Həkim-laborant, Mərkəzi Neftçilər Xəstəxanası, Azərbaycan, Bakı
2009-2016 - Həkim-laborant, Genlab MMC, Azərbaycan, Bakı
2017 Həkim-laborant, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-zehra-efendibeyli';
UPDATE doctor SET bio = 'Mama-Ginekoloq.', updated_at = NOW() WHERE slug = 'dr-zehra-namazli';
UPDATE doctor SET bio = 'Radioloq.
Şöbə: Radiologiya', updated_at = NOW() WHERE slug = 'dr-zerife-ehmedova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Terapiya

Fəaliyyət sahələri:
Onkoginekoloji cərrahiyyə, onkoloji xəstəliklərin diaqnostikası və müalicəsi - Elmi-Tədqiqat Onkologiya İnstitutu, Ginekologiya və Abdominal Onkologiya bölməsi, Rusiya, Rostov
Onkologiya - Algenmine Krancenhouse Klinikası, Avstriya, Vyana
Kimyaterapiya, Azərbaycan, Bakı

İş təcrübəsi:
2010 - Həkim-onkoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-zeyneb-allahverdiyeva';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Kardiologiya

Fəaliyyət sahələri:
Kardiologiya - Bayındır Xəstəxanası, Türkiyə, Ankara və Allgemeinen Krankenhaus Xəstəxanası, Avstriya, Vyana
Kliniki kardiologiya
Exokardioqrafiya
Transezofagial Exokardioqrafiya

İş təcrübəsi:
1990-2003 Funkdional diaqnostika həkimi, 24 №-li Tibbi Sanitariya Hissəsi, Azərbaycan, Bakı
2006 - Həkim-kardioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'dr-zohre-abbasova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təcili tibbi yardım xidməti və ilkin stabilizasiya
(Kəskin vəziyyətlərdə ilkin müdaxilə və həyat funksiyalarının bərpası)
Şok və həyati təhlükəli vəziyyətlərin idarə olunması
(Kardiogen, hipovolemik, anafilaktik, septik şok və s.)
Reanimasiya və reanimasyon protokolları
(KPR, ACLS, BLS, travma hallarında ATLS və s.)
Təcili diaqnostik prosedurlar və ilkin tibbi müayinə
(EKQ, USM, FAST, laborator analizlərin təhlili)
Travmatologiya və ortopedik təcili yardım
(Qırıq, çıxıq, kəsik və digər travmatik hallar)
Kəskin infeksion və toksikoloji vəziyyətlər
(Zəhərlənmələr, yüksək hərarət, sepsis, anafilaksiya)
Kəskin kardioloji və pulmonoloji hallar
(İnfarkt, ürək ritm pozğunluqları, ağciyər emboliyası, astma tutmaları və s.)
Nevroloji təcili hallar
(İnsult, qıcolmalar, şüur pozulmaları)
Psixotibbi və davranış pozuntularında ilkin tibbi yardım
(Psixotik epizodlar, intihar riski olan xəstələrin ilkin qiymətləndirilməsi və müdaxiləsi)', updated_at = NOW() WHERE slug = 'dr-zumrud-memmedova';
UPDATE doctor SET bio = 'Sənaye təbabəti şöbəsinin həkimi.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ehedova-arasta-agabala';
UPDATE doctor SET bio = 'İş təcrübəsi:
Tibb qardaşı, Kliniki Onkoloji xəstəxana (1970-1971)
Həkim-ordinator, şöbə müdiri, Kliniki Onkoloji xəstəxana (1971-1974)
Kiçik elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, reabilitasiya şöbəsi (1977-1979)
Kiçik elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1979-1981)
Aparıcı elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1987-1989)
Baş elmi işçi, SSRİ Tibb Elmləri Akademiyasının Ümumittifaq Onkoloji Elmi Mərkəzi, ümumi onkologiya şöbəsi (1989-1994)
Rektor, Azərbaycan Tibb Universiteti (1992-2015)
Kafedra müdiri, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1993-hal-hazıradək)
Direktor, Azərbaycan Tibb Universitetinin Onkoloji klinikası (2007-hal-hazıradək)
"Bioloji elmlər" bölməsinin akdemik katibi, Azərbaycan Milli Elmlər Akademiyası (2007-hal-hazıradək)
Milli Məclisin deputatı, Milli Məclisin Səhiyyə Komitəsinin sədri, Azərbaycan Respublikası Milli Məclisi (2015-hal-hazıradək)

Üzvlük:
Azərbaycan Milli Elmlər Akademiyasının akademiki
Azərbaycan Milli Elmlər Akademiyası "Boloji elmlər" bölməsinin akademik-katibi
UNESKO xətti üzrə "Bioetika, Elmi biliklərin VI texnologiyaların etikası" Azərbaycan Milli Komitəsinin sədr müavini
Avropa Tibbi-Onkologiya Cəmiyyətinin həqiqi üzvü
Dünya Azərbaycanlılarının III qurultayında Dünya Azərbaycanlılarının Əlaqələndirilmə Şurasının üzvü
Azərbaycan Respublikasının Prezidenti yanında Bilik Fondunun Himayəçilik Şurasının üzvü
UNESKO-nun eksperti
Türkdilli Ölkələrin Parlament Assambleyasının Parlamentlərarası Komissiyasının (TÜRKPA) sədri
Müstəqil Dövlətlər Birliyinin iştirakçı dövlətlərinin Parlamentlərarası Assambleya şurasının üzvü
Ümumdünya Ortoped-Travmatoloq və Onkoloqlar Assosiasiyasının üzvü
Yunanıstan, Çexiya, Macarıstan Onkoloqlar Cəmiyyətlərinin üzvü
Avropa Bərpa Cərrahlığı Assosiasiyasının fəxri üzvü
Amerika Klinik Onkologiya Cəmiyyətinin aktiv üzvü
RF Təbiət Elmləri Akademiyasının üzvü
Polşa Tibb Elmlər Akademiyasının həqiqi üzvü
Rusiya Tibb Elmlər Akademiyasının həqiqi üzvü
Rusiya Elmlər Akademiyasının xarici üzvü', updated_at = NOW() WHERE slug = 'ehliman-emiraslanov';
UPDATE doctor SET bio = 'şöbə rəisi, stomatoloq.
Şöbə: Stomatologiya

İş təcrübəsi:
1997-1999 Müxtəlif dövlət və özəl tibb müəssisələrində həkim-stomatoloq çalışıb
2019-cu ildən Mərkızi Gömrük Hospitalında həkim-stomatoloq çalışır

Lisenziya və sertifikatlar:
2014 Beynəlxalq Diş konfransı və sərgisi. Birləsmis Ərəb Əmirlikləri, Dubay
2015 Beynəlxalq Diş konfransı və sərgisi. Birləsmis Ərəb Əmirlikləri, Dubay
2018 Beynəlxalq Diş konfransı və sərgisi. Birləsmis Ərəb Əmirlikləri, Dubay
2016 Moskva Beynəlxalq Stomatoloji forum və sərgi. Moskva, Rusiya', updated_at = NOW() WHERE slug = 'ehmed-memmedov';
UPDATE doctor SET bio = 'Həkim-terapevt.
MediClub-da 2022-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ehmedova-ayten-tahir';
UPDATE doctor SET bio = 'İş təcrübəsi:
Uzmanlıq, Hacettepe Universiteti (2012-2017)
baş laborant, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2018 - 2025)
Asissent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2025 hal-hazıradək)', updated_at = NOW() WHERE slug = 'ekber-mirze-oglu-ibrahimov';
UPDATE doctor SET bio = 'Həkim-qastroenteroloq.
MediClub-da 2013-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ekberova-gunay-veli';
UPDATE doctor SET bio = 'Həkim-stomatoloq.
spec-17.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ekberova-nermin-mehman';
UPDATE doctor SET bio = 'Şöbə: Neyrocərrahiyyə

İş təcrübəsi:
2003-2005 Mərkəzi Hərbi Klinik hospital, həkim-neyrocərrah
2005-2012 Dövlət və özəl tibb müəssisələrində həkim-neyrocərrah
2012-ci ildən Mərkəzi Gömrük Hospitalında neyrocərrah kimi çalışır

Lisenziya və sertifikatlar:
2010 Ukrayna Neyrocərrahiyyə İnstitutunun keçirdiyi "Endovaskulyar neyrocərrahiyyə" kursu. Ukrayna, Kiyev
2015 Santa Barbara klinikasının təşkiltçılığı ilə keçirilən "Onurğa cərrahiyyəsi" kursu. Almaniya, Hamm
Üzv olduğu cəmiyyətlər
Azərbaycan Neyrocərrahiyyə Cəmiyyətinin üzvü
Ukrayna Neyrocərrahiyyə Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'elcin-abbaszade';
UPDATE doctor SET bio = 'İş təcrübəsi:
Assistent, Azərbaycan Tibb.Univ. Onkologiya kafedrası assistenti (2000-dən hal-hazıra qədər)

Təlimlər:
Ixtisaslaşma kursu (2009)
İxtisaslaşma kursu (2011)

Üzvlük:
Avropa Tibbi Onkoloqlar Cəmiyyətinin üzvü (ESMO)', updated_at = NOW() WHERE slug = 'elcin-huseynov';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi

İş təcrübəsi:
2011. Türkiyənin Osmangazi Universitetinin Ürək-Damar Cərrahiyyəsi şöbəsində ürək-damar cərrahı kimi fəaliyyət göstərib
2012-2014. Türkiyənin Artvin Dövlət Xəstəxanasında ürək-damar cərrahı kimi fəaliyyət göstərib
2014-2023. Ankara Yüksək İxtisas Xəstəxanasında ürək-damar cərrahı kimi fəaliyyət göstərib
2023-2024. Müxtəlif dövlət və özəl tibb müəssisələrində ürək-damar cərrahı kimi fəaliyyət göstərib
2024. Mərkəzi Gömrük Hospitalının Kardiologiya şöbəsində ürək-damar cərrahı

Lisenziya və sertifikatlar:
2008. Türkiyə Ürək-Damar Cərrahiyyəsi Dərnəyinin təşkilatçılığı ilə 10-cu Milli Konqres. Türkiyə, Antalya şəhəri.
2009. Milli Vaskulyar Cərrahiyyə Cəmiyyətinin təşkilatçılığı ilə XIV Milli Vaskulyar Cərrahiyyə Konqresi, Türkiyə, Bodrum şəhəri.
2019. Milli Vaskulyar və Endovaskulyar Cərrahiyyə Cəmiyyətinin təşkilatçılığı ilə XIX Milli Vaskulyar və Endovaskulyar Cərrahiyyə Konqresi. Türkiyə, Antalya şəhəri.
2021. XX Milli Vaskulyar və Endovaskulyar Cərrahiyyə Konqresi. Türkiyə, Antalya şəhəri.
2024. Azərbaycan Respublikası Səhiyyə Nazirliyi və Elmi-Tədqiqat Kardiologiya İnstitutunun birgə təşkilatçılığı ilə keçirilə I Türk Dövlətləri Kardioloji Qurultayı. Azərbaycan, Bakı şəhəri.
Üzv olduğu təşkilatlar
Türkiyə Endovaskulyar Cərrahiyyə Cəmiyyətinin üzvüdür', updated_at = NOW() WHERE slug = 'eldar-bagirov';
UPDATE doctor SET bio = 'Ürək-damar cərrahı.

İş təcrübəsi:
2018-ci ildən bu günədək Respublika Diaqnostika Mərkəzinin Kardiocərrahiyyə şöbəsində ürək-damar cərrahı vəzifəsində fəaliyyət göstərir', updated_at = NOW() WHERE slug = 'eldar-veliyev';
UPDATE doctor SET bio = 'Şöbə: Radiologiya

İş təcrübəsi:
2014-cü ildən Mərkəzi Gömrük Hospitalı, radiologiya şöbə rəisi kimi çalışır

Lisenziya və sertifikatlar:
2011 Türk Ulusal Radioliji konfransı. Antalya, Türkiyə
2012 Karotis stentləmə kursu-Dubay. B.Ə.Ə
2012 Türk radioloji dərnəyi aylıq simpoziumları. İstanbul, Türkiyə
2018 Türk Maqnit rezonans dərnəyinin 23-cü illik konfransı-Ankara, Türkiyə
Üzv olduğu təşkilatlar
Türkiyə Radioloji Dərnəyi
Türkiyə Maqnit Rezonans dərnəyi', updated_at = NOW() WHERE slug = 'eldeniz-huseynov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Yetkin şəxslərdə
Həyəcan (təşviş) pozuntusu
Panik pozuntusu
Depressiya
Asılılıqlar (maddə, tütün, alkoqol, oyun)
Ailə və cütlük terapiyası
Vaginizm
Qorxu və fobiyalar
Obsessiv-kompulsiv pozuntu
Psixosomatik ağrılar
Tükənmişlik sindromu
Posttravmatik stress pozuntusu
Uşaqlıq travmaları
Özünəqiymət çatışmazlığı
Stresin idarə olunması
Yeniyetmələrdə
Davranış pozuntusu
Özünəqiymət çatışmazlığı
Valideyn-övlad münasibətləri
Qorxular
Bullinq
Diqqət çatışmazlığı
Zehni inkişafda gerilik
Təlim uğursuzluqları
İmtahan öncəsi stress

Konfranslar:
Minnesota Çoxaspektli Şəxsiyyət Sorğusu (MMPI) - şəxsiyyətin çoxtərəfli qiymətləndirilməsi metodikası - İstanbul Universiteti - Obsessiv-Kompulsiv Pozuntu (OKP) - Helsinki Brief Therapy İnstitute, treyner Ben Furman
Qəbul və Öhdəlik Terapiyası (ACT) - İstanbul Esenyurt Universiteti
Posttravmatik Stress Pozuntusu (PTSD) - Anatoli Kreinin, İsrail Dövlət Universiteti
Mürəkkəb psixoloji travmalar zamanı psixoloji yardım - Beynəlxalq Qırmızı Xaç Komitəsi
Koqnitiv-Davranış Terapiyası (KDT/CBT) - İstanbul Esenyurt Universiteti
Sxema Terapiyası - İstanbul Esenyurt Universiteti
Vaginizm psixoterapiyası - Cinsel Eğitim Araştırma Derneği
Ailə və cütlük psixoterapiyası - Linda Friel (Final International University) və s.', updated_at = NOW() WHERE slug = 'elgul-agarzayeva';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'eliyev-samil-telman';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2022-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'eliyeva-nergiz-valeh';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2003-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'eliyeva-yegane-imameli';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi

İş təcrübəsi:
2011 ABŞ Texas A&M Universitetində süni ürək proqramında çalışmışdır.
2012 SCOTT & WHITE hospitalında kardiotorakal cərrahiyyə kursu keçmişdir.
2013-2014 Ege Universiteti Ürək-damar cərrahiyyəsi kafedrasında ürək cərrahı olaraq çalışmışdır.
2014 cü ildən Mərkəzi Gömrük Hospitalında ürək-damar cərrahı kimi çalışır

Lisenziya və sertifikatlar:
2012 Ürək və Damar cərrahiyyəsi dərnəyinin XII beynəlxalq konqresi, Türkiyə
2013 Ürək və Damar cərrahiyyəsi dərnəyinin ekstrakorporal qan dövranı dəstəyi kursu, Türkiyə
2015 Bakı Ürək Günləri, IV Beynəlxalq konqresi, Azərbaycan, Bakı
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2019 Bakı Ürək Günləri, VI Beynəlxalq konqresi, Azərbaycan, Bakı
2022 Azərbaycan Kardiologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən "Ürək çatışmazlığında yeniliklər" konqresi. Azərbaycan, Bakı şəhəri.
2024 Azərbaycan Ürək və Damar Cərrahiyyəsi Cəmiyyətinin təşkilatçılığı, Azərbaycan Respublikası Səhiyyə Nazirliyi, TƏBİB və İcbari Tibbi Sığorta üzrə Dövlət Agentliyinin dəstəyi keçirilən "Ürək-damar cərrahlarının Şuşa Zirvəsi" adlı elmi toplantı. Azərbaycan, Şuşa şəhəri.
2025. Qazaxıstan Səhiyyə Nazirliyinin təşkilatçılığı ilə "Struktur ürək xəstəlikləri" üzrə II Beynəlxalq Sammit. Qazaxstan, Astana şəhəri.
Üzv olduğu təşkilatlar
Türk Ürək-Damar cəmiyyəti', updated_at = NOW() WHERE slug = 'elmeddin-eliyev';
UPDATE doctor SET bio = 'İş təcrübəsi:
Terapevd-onkoloq, Sabirabad rayon Mərkəzi Xəstəxanası (1986-1989)
Kişik elmi işçi, Milli Onkologiya Mərkəzi (1992-1993)
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1993-2005)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-hal-hazıradək)
II cərrahiyyə şöbəsinin dayaq-hərəkət bölməsinin müdiri, ATU-nun Onkoloji klinikası (2007 hal-hazıradək)

Üzvlük:
ESMO
Azərbaycan Onkoloqlar Cəmiyyəti
Azərbaycan Travmatoloq və ortopedlər Assosiasiyası
Sarkomaların öyrənilməsinə dair Şərqi Avropa Qrupu', updated_at = NOW() WHERE slug = 'elnur-ibrahimov';
UPDATE doctor SET bio = 'Haqqında:
bugünədək Sağlam Ailə Tibb Mərkəzi / Şüa diaqnostika üzrə həkim / Rentgenoloq
2011 Sertifikasiya, Şüa diaqnostika
2011 Atatürk Eğitim ve Araştırma hastanesi / Radyoloji kliniği Praktiv və uyğulamalı Eğitimi
2005 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu / Şüa diaqnostika / Rentgenologiya üzrə kurs
2003 - 2004 İnternatura / Sumqayıt şəhəri 1 saylı Şəhər Xəstəxanası / Həkim terapevt
1997 - 2003 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'elnure-elimirzeyeva';
UPDATE doctor SET bio = 'Şöbə: Otorinolarinqologiya

İş təcrübəsi:
2007-2014 Ukrayna, Xarkov, 30 saylı Xarkov klinik xəstəxanası, otolarinqoloq
2013-2015 Ukrayna, Xarkov diplom sonrası Tibb Akademiyası, otolarinqologiya kafedrası, uşaq otolarinqologiyası üzrə staj müddəti
2015-ci ildən Mərkəzi Gömrük Hospitalında həkim-otolarinqoloq kimi çalışır
Nailiyyətlər və Üstünlüklər
2014 Ukrayna, Kiyev, A.S Kolomiyçenko adına Elmi Tədqiqat Otolarinqologiya İnstitutunda tibb elmləri namizədi elmi dərəcəsi almaq üçün "Agırlaşmış sinusitli xəstələrdə cərrahi müalicənin fotohemoterapiya istifadəsi ilə optimallaşdırılması" mövzusunda dissertasiya müdafiəsi
2014 Patent № 88326 «Ağırlaşmış paranazal xəstələrin müalicə üsulu" Ukrayna Dövlət patent reyestrində keyfiyyət modelinin qeydiyyatı. 11.03.2014

Lisenziya və sertifikatlar:
2012 Ukrayna həkim-otolarinqoloaqların elmi-tibbi birliyi "LOR orqanlarının xroniki iltihabi xəstəliklərinin müasir müalicə və diaqnostika metodları"
2012 Gənc alimlərin «21-ci əsrin tibbi» adlı elmi-praktiki konfrans Ukrayna, Xarkov
2019 Burun boşluğu, paranazal sinusların və kəllə əsasının kadavra materialı üzərində endoskopik sinus cərrahiyyəsi kursu, Rusiya, Sankt-Peterburq şəhəri
2022 Rusiya Rinologiyasının 30 illiyinə həsr olunmuş "Burun boşlugu, paranazal sinuslar və qonşu anatomik strukturların, kadavra materialı üzərində bazal və genişləndirilmiş funksional endoskopik sinus cərrahiyyəsi" yubiley disseksiya kursu. Türkiyə, Ankara şəhəri', updated_at = NOW() WHERE slug = 'elvin-ezizov';
UPDATE doctor SET bio = 'Otorinolarinqoloq.
Elmi dərəcə: Uzman

İş təcrübəsi:
2022-2024 Naxçıvan Mərkəzi Hospitalı otorinolarinqologiya şöbəsi
2024-ci ildən bu günədək Respublika Diaqnostika Mərkəzində otorinolarinqoloq kimi fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'elxan-zergerov';
UPDATE doctor SET bio = 'Haqqında:
• 2025-bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim - endokrinoloq • 2021-bugünədək Gəncə şəhər hərbi hospitalı/ Həkim-endokrinoloq • 2017-2021 - Rezidentura/ Azərbaycan Tibb Universiteti / Endokrinologiya • 2009-2015 - Bakalavr/ Azərbaycan Tibb Universiteti / Hərbi həkim işi', updated_at = NOW() WHERE slug = 'emil-hesenov';
UPDATE doctor SET bio = 'Şöbə: İnvaziv Kardiologiya

İş təcrübəsi:
2008-2020. Müxtəlif özəl və dövlət tibb müəssisələrində həkim-kardioloq kimi çalışıb.
2020-ci ildən etibarən Mərkəzi Gömrük Hospitalında invaziv kardioloq kimi fəaliyyət göstərir.

Lisenziya və sertifikatlar:
2014 Polşa Kardiologiya Cəmiyyətinin təşkil etdiyi XVIII Kardiologiya konqresi. Polşa, Poznan şəhəri.
2017 Avropa Kardiologiya Cəmiyyətinin Kardioloji konqresi. İspaniya, Barselona şəhəri.
2018 Avropa Kardiologiya Cəmiyyətinin Kardioloji konqresi.
Almaniya, Münhen şəhəri.
2018 Azərbaycan Respublikası Səhiyyə Nazirliyinin Həkimləri təkmilləşdirmə İnstitutunda Exokardioqrafiya üzrə invaziv müdaxilələr üzrə kurs. Azərbaycan, Bakı şəhəri.
2019 Başkent Universiteti Ankara Xəstəxanasında ExoKQ və Koronar Angioqrafiya və invaziv müdaxilələr üzrə kurs. Türkiyə, Ankara şəhəri.
2021 Belarusiya Elmi-Praktik Kardiologiya İnstitutunda invaziv müdaxilələr üzrə kurs. Belarusiya, Minsk şəhəri
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyətinin üzvü.
Avropa Kardiologiya Cəmiyyətinin üzvü.', updated_at = NOW() WHERE slug = 'emin-allahverdiyev';
UPDATE doctor SET bio = 'Şöbə: İnvaziv Kardiologiya

İş təcrübəsi:
Kardiologiyanın bütün sahələrində iş təcrübəsi
2014-cü ildən Mərkəzi Gömrük Hospitalı, həkim-kardioloq
Nailiyyətlər və Üstünlüklər
Ürəyin koronar damarlarının angioqrafiyası, balon angioqrafiya, aorta-koronar şuntlama, by-pass kontrol (şuntoqrafiya, balon angioplastika və stendləmə), periferik damarların angioqrafiyası (renal, aşağı və yuxarı ətrafların angioqrafiyası və müvəqqəti pacemakerin qoyulması) kimi mürəkkəb invaziv müdaxilələr həyata keçirir

Lisenziya və sertifikatlar:
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli konqresi, Bakı, Azərbaycan
2022 Türkiyə Kardiologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən 38-ci Beynəlxalq Kardioloji konqres. Türkiyə, Antalya şəhəri
2023 Azərbaycan Kardiologiya Cəmiyyətinin "Besan" MMC və "Boston Scientific" şirkətlərinin ilə birgə əməkdaşlığı əsasında keçirilən "Ürəyin damardaxili ultrasəs müayinəsi" ilə bağlı ana koronar & bifurkasiya: Rota Pro, Synergy/Megatron təlimi. Türkiyə, İstanbul.
2024. Avropa Kardioloqlar Cəmiyyətinin təşkilatçılığı ilə keçirilən təlimdə iştirak edərək sertifikat əldə edib. Böyük Britaniya və Şimali İrlandiya Birləşmiş Krallığı, London.
2025. Avropa Kardioloqlar Cəmiyyətinin təşkilatçılığı ilə keçirilən təlimdə iştirak edərək sertifikat əldə edib. İspaniya, Madrid.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyəti
Avropa Kardiologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'emin-hacibalayev';
UPDATE doctor SET bio = 'Şöbə: Radiologiya

İş təcrübəsi:
2008-2009 Özəl tibb müəssisəsində, assistent radioloq
2009-cu ildən etibarən Mərkəzi Gömrük Hospitalında radioloq kimi çalışır

Lisenziya və sertifikatlar:
2010 Florence Nightingale xəstəxanası, İstanbul
2011 Qaziosmanpaşa xəstəxanası, İstanbul
2019 Avropa Radioloji konfransı, Vyana, Avstiya', updated_at = NOW() WHERE slug = 'emin-memmedov';
UPDATE doctor SET bio = 'Haqqında:
2025-bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim-pediatr
2024-bugünədək - Gəncə Şəhər Birləşmiş Xəstəxanası PHŞ-Uşaq xəstəxanası/ Təcili və təxirəsalınmaz tibbi yardım üzrə həkim
2023-2024 - Qobustan Rayon Mərkəzi Xəstəxanası PHŞ/ Ailə həkimi - pediatr
1997-1998 - İnternatura/ Respublika Uşaq Klinik Xəstəxanası/ Pediatr
1991-1997 - Azərbaycan Tibb Universiteti / Pediatriya', updated_at = NOW() WHERE slug = 'emine-yusifova';
UPDATE doctor SET bio = 'Tibb üzrə fəlsəfə doktoru.
Həkim-qastroenteroloq-hepatoloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'emiraslanova-ilhame-telman';
UPDATE doctor SET bio = 'Həkim-pediatr-reanimatoloq.
MediClub-da 2008-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'erzrumi-sehla-abbasaga';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'esgerli-aysel-etibar';
UPDATE doctor SET bio = 'Haqqında:
2017 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim terapevt
2010 N saylı hərbi hissə yoluxucu xəstəliklər bölməsi / Baş ordinator
1998 - 2017 N saylı hərbi hissə / Yoluxucu xəstəliklət bölməsi / İnfeksionist
1996 - 1998 N saylı hərbi hissə / Səyyat tibbi qrup bölməsi / Həkim terapevt
1995 - 1996 Sumqayıt şəhəri 2 saylı xəstəxana / Həkim terapevt
1994 - 1995 İnternatura / Bakı şəhəri 1 saylı şəhər klinik xəstəxana / Həkim terapevt
1994-1995 Sumqayıt şəhəri Bərpa müalicə mərkəzi / Həkim terapevt
1991 - 1994 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnistutu / Travmatoloq kafedrası / Tibb qardaşı
1988 - 1994 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'etibar-suleymanov';
UPDATE doctor SET bio = 'MediClub Poliklinikanın baş həkimi, Tibb üzrə fəlsəfə doktoru.
Funksional diaqnostika həkimi.
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ezimova-nigar-kamran';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2000-2012 Müxtəlif özəl tibbi müəssisələrində həkim pediatr kimi çalışıb
2012- ci ildən Mərkəzi Gömrük Hospitalında həkim pediatr kimi çalışır

Lisenziya və sertifikatlar:
2006. VI Türk Dünyası Pediatriya konqresi, Azərbaycan, Bakı
2013. Ana və uşaqların sağlamlığı seminarı, Azərbaycan, Bakı
2016. Uşaq Sağlamlığı Təlim konfransı
2017 "Allergologiya Molekulyar Diaqnostika" seminarı, Azərbaycan, Bakı
2017. "Qulaq-Burun-Boğaz xəstəliklərinin müalicəsinə müasir yanaşma" adlı elmi konfrans, Azərbaycan, Bakı
2018. Uşaq cərrahiyyəsi üzrə seminar, Azərbaycan, Bakı
2018. "Allergologiyada Molekulyar Diaqnostika 2"
2018. VIII Simpozium "Pediatriyada yeniliklər", Azərbaycan, Bakı
2018. Azərbaycan Neonatoloqlarının Beynəlxalq vaxtından əvvəl doğulmuşlar gününə həsr olunmuş Elmi-Praktik konfrans, Azərbaycan, Bakı
2019. ATU-nun vəTürkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Azərbaycan, Bakı
2020. 64.Türkiyə Milli Pediatrik konqresi, Türkiyə, İstanbul. Onlayn
2021 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2021 Professor Tamerlan Əliyevin 100 illiyinə həsr olunmuş və Azərbaycan Tibb Universitetinin təşkilatçılığı ilə keçirilən "Təbabətin aktual problemləri 2021" mövzusunda elmi-praktik konqres, Azərbaycan, Bakı
2022 Türkiyə Pediatrlar Cəmiyyətinin təşkilatçılığı ilə XXVIII Milli Uludağ Pediatriya Qış konqresi, Türkiyə, Uludağ
2025 Azərbaycan Respublikası Səhiyyə Nazirliyinin, TƏBİB-in və İcbari Tibbi Sığorta Agentliyinin təşkilatçılığı ilə 5-ci Azərbaycan-Türkiyə Pediatriya Günləri Beynəlxalq konfrans. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri.', updated_at = NOW() WHERE slug = 'fereh-vahabova';
UPDATE doctor SET bio = 'Radioloq.

İş təcrübəsi:
2001-2002 Turk-American Medical Center Radioloq
2002-2014 Leyla Şixlinskaya Klinikası Radioloq
2006-2014 Nəsrəddin Tusi adına Klinika Radioloq
2008-2014 Uniklinika Radioloq
2013-2016 Caspian International Hospital Radiologiya şöbəsinin müdiri
2014-2016 Mərkəzi Klinik Xəstəxana Radiologiya şöbəsinin müdiri
2016-2025 Hayat Clinic Radiologiya şöbəsinin müdiri', updated_at = NOW() WHERE slug = 'ferhad-qarayev';
UPDATE doctor SET bio = 'Uroloq-cərrah.

İş təcrübəsi:
2011-2016 Milli Onkologiya Mərkəzi Onkourologiya şöbəsi, həkim-uroloq
2016-2019 Medical Plaza xəstəxanası, həkim uroloq
2019-2021 Ege Hospital, həkim-uroloq 2019-2021
2021-2024 Caspian İnternational Hospital,h əkim-uroloq
Hal hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir
İcra etdiyi əməliyyatlar:
Böyrək və sidik yolları daşlarının endoskopik lazer cərrahiyəsi
Laparoskopik cərrahiyə
Prostat vəzi adenomasının endoskopik cərrahiyəsi
Sidik kisəsi törəmələrinin endoskopik cərrahiyəsi
Böyrək və sidik-cinsiyyət sisteminin bəd və xoşxassəli törəmələrinin cərrahiyəsi
Böyrək-sidik yollarının anadangəlmə və qazanılmış qüsurlarının rekonstruktiv cərrahi əməliyyatları
Kişi sonsuzluğu mikrocərrahi müalicəsi.', updated_at = NOW() WHERE slug = 'fexri-quliyev';
UPDATE doctor SET bio = 'Psixiatr.

Fəaliyyət sahələri:
Əhval-ruhiyyə pozuntuları
Depressiya
Bipolyar pozuntu (manik-depressiv psixoz)
Daimi narahatlıq, kədər, ümidsizlik hissi
Sevinc və qəzəb epizodları arasında dəyişkənlik', updated_at = NOW() WHERE slug = 'fuad-semedov';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
2023 - 2023 Mərkəzi Gömrük Hospitalının Təcili tibbi yardım şöbəsində təcili tibbi yardım həkimi
2023 - cü ildən Mərkəzi Gömrük Hospitalının Təcili tibbi yardım şöbəsində təcili tibbi yardım şöbəsinin rəisi
Nailiyyətlər və Üstünlüklər
İkinci Qarabağ müharibəsi veteranı
"Qubadlının azad olunmasına görə" və "Vətən müharibəsi iştirakçısı" medalları ilə təltif olunub

Lisenziya və sertifikatlar:
2019 "Deutsch B2 Medizin" təlimi, Küps, Almaniya
2021 "Dənizdə təhlükəsizliyin əsasları və fövqəladə hallar üzrə təlim". Azərbaycan, Bakı
2023 Qabaqcıl Ürək-Damar Həyat Dəstəyi təlimi, Azərbaycan, Bakı.', updated_at = NOW() WHERE slug = 'fuzuli-abisov';
UPDATE doctor SET bio = 'Endokrinoloq.

İş təcrübəsi:
2010 - 2024- Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2020-ci ildən bu günədək Respublika Diaqnostika Mərkəzində həkim-endokrinoloq vəzifəsində çalışır', updated_at = NOW() WHERE slug = 'gulnar-celilova';
UPDATE doctor SET bio = 'Uşaq və Yeniyetmə Psixoloqu.

Fəaliyyət sahələri:
Uşaq və yeniyetmə psixologiyası
Uşaq psixodiaqnostikası və psixoterapiyası
Yeniyetmə psixoterapiyası
Autizm Spektr Pozuntuları olan uşaqlarla iş
Dikkat Eksikliyi və Hiperaktivlik Bozukluğu (DEHB) ilə iş
Disleksiya ilə bağlı psixoloji dəstək
Diaqnostika və terapiya metodları
Obyektiv və Proyektiv Testlər
Eral NİT zəka testi (beynəlxalq dərəcə)
ÇEPS101 programı (beynəlxalq dərəcəli)
Oyun terapiyası
Psixofarmakologiya sahəsində bilgi və dəstək
Yas və itki psixologiyası ilə iş

Konfranslar:
2019-cu i-l - "Oyun terapiyası" təlimi, Lalə Həmidli2020-ci il - "Obyektiv və Proyektiv Testlər" təlimi, Tuğba Deliktaşlı
2020-ci il - "Dikkat Eksikliği ve Hiperaktivlik Bozukluğu Eğitimi", Mücahit Hoca
2022-ci il - Samsun Universiteti, Uşaq və Yeniyetmə Psixoterapiya stajı (beynəlxalq dərəcə)
2022-ci il - "Disleksiya Eğitimi", Ayşegül Hoca
2022-ci il - "Oyun terapiyası" təlimi, Zeyneb Alt Torun Hoca
2023-cü il - ÇEPS101 programı (beynəlxalq dərəcəli), Atanur Hoca
2023-cü il - "Yas, Ümid Psixologiyası" təlimi, Tayfun Hoca
2023-cü il - Eral NİT zəka testi (beynəlxalq dərəcə), Sertan Hoca
2024-cü il - Ankara Boylam Psixiatriya Xəstəxanasında staj
2024-cü il - "Uşaq və Yeniyetmə Psixodiaqnostikası və Psixoterapiya" təlimi, Sevinc İsmayılova
2025-ci il - "Psixofarmakologiya" təlimi, Linda Fraim Hoca', updated_at = NOW() WHERE slug = 'gulnar-mursudzade';
UPDATE doctor SET bio = 'Fizioterapevt-reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
Ortopedik xəstəliklərin reabilitasiyası
Nevroloji xəstəliklərdə reabilitasiya
İnsult
Parkinson
Multiple Skleroz
Bel,boyun ağrıları
Skolioz, kifoz, lordoz
Rotator manjet vətər zədələnmələri zamanı reabilitasiya.

İş təcrübəsi:
2021-2022 - Türkiyə Respublikası,İstanbul Medipol Mega xəstəxanası:Təcrübəçi fizioterapevt
2021-2022 - İstanbul Medipol Fındıkzade xəstəxanası:Təcrübəçi fizioterapevt
2022-2023:İstanbul Medipol Esenler xəstəxanası-Təcrübəçi fizioterapevt
2022-2023 - Duyusal Akademi:Təcrübəçi fizioterapevt
2022-2023 - Engelsiz yaşam merkezi:Təcrübəçi fizioterapevt
2023-2024 - Beykoz Akdem:Təcrübəçi fizioterapevt
2023-2024 - North Clinics:Təcrübəçi fizioterapevt
2024 - Maison de Pilates Studio: Fizioterapevt
2024 - Yeni Klinika: Fizioterapevt-rehabilitoloq.', updated_at = NOW() WHERE slug = 'gulnar-qasimzade';
UPDATE doctor SET bio = 'Haqqında:
2020 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim-nevropatoloq
2017 - 2020 - Artromed Tibb mərkəzi/ Həkim nevroloq
2012 - 2016 - Rezidentura, Kliniki Tibbi Mərkəz/ Nevrologiya
2005 - 2011 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'gulnar-verdiyeva';
UPDATE doctor SET bio = 'Hematoloq.

İş təcrübəsi:
2015-2019 illərdə B.Eyvazov adına Hematologiya və Transfuziologiya İnstitutu - həkim-rezident
2020- dən Respublika Diaqnostika Mərkəzində Həkim-hematoloq, Qan Bankı şöbəsinin müdiri.
İştirak etdiyi treninq və seminarlar:
1-ci Azərbaycan Beynəlxalq Hematoloqiya Mütəxəssisləri Konqresi.
2-ci Azərbaycan Beynəlxalq Hematoloqiya Mütəxəssisləri Konqresi.
Müalicə etdiyi xəstəliklər:
Bütün növ anemiyalar (qan azlığı), talassemiyalar, sümük iliyinin bədxassəli şişləri (leykozlar, miyelom xəstəliyi və s.), miyelofibroz, miyelodisplastik sindrom(refrakter anemiya), aplastik anemiya.
Bacarıqları: sümük iliyinin aspirasion və trepanobiopsiyası, intratekal kimyəvi dərman müalicəsi.', updated_at = NOW() WHERE slug = 'gulxanim-ismayilova';
UPDATE doctor SET bio = 'Şöbə: Diaqnostika

İş təcrübəsi:
2011-ci ildən Mərkəzi Gömrük Hospitalı, həkim-sonoloq
Nailiyyətlər və Üstünlüklər
2021 "Gömrük orqanlarında xidmətə görə" 3-cü dərəcəli döş nişanı ilə təltif olunub
2022 Azərbaycan Respublikası Gömrük işini aparan İcra Hakimiyyəti orqanının Fəxri fərmanı
2023 Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi (1992-2022) Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.
2024 Azərbaycan Respublikasının gömrük işini aparan icra hakimiyyəti orqanın fəxri fərmanı ilə təltif edilib.

Lisenziya və sertifikatlar:
2010 Istanbul Universiteti Istanbul Tibb fakultəsi Radioloji Anabilim Dalı /Qarın boşluğu orqanları USG və GRİ SCALA rəngli doplerografiyası/ kursu
2013 İUTF Radioloji Anabilim Dalı /Pediatrik Ultrosonoqrafik İncelemeler, Neyrosonoqrafiya, Artrosonoqrafiya-oynaqların USG, Yenidoğulmuşlarda bud-çanaqının dislokasiya və diplaziya diaqnostikası kursu
2012-2013 İUTF Radioloji Anabilim Dalı /Damarların rəngli doppleroqrafiyası, Süd vəzilərinin USG-si və Mommoqrafiyası, Obsetrik USG, Hamilələrdə Doppleroqrafiya/. Anorektal USG kursu
2014 İstanbul ALFA Radioloji Görüntüləmə Mərkəzində Praktik Seminar kursu /GRİ SCALA-Neyrosonoqrafiya, Ayrıntılı USG/. Yumşaq toxumalar və Endokrin (THYROİD, PARATHYROİD, PAROTİS) və Limfotik sistem üzrə USG kursu
2015 Ayrıntılı USG, Abdominal USG, Ginekoloji Xəstəliklər zamanı Diferensial USG praktik seminar kursu
2018 11-ci Beynəlxalq Türkiyə maternal fetal perinatoloji konqresi, İstanbul, Türkiyə
2025. Azərbaycan Respublikası Səhiyyə Nazirliyi, TƏBİB, Azərbaycan Tibb Universiteti və Azərbaycan Onkoloqlar Cəmiyyətinin dəstəyi, Azərbaycan Süd Vəzi Xəstəlikləri Mütəxəssisləri Assosiasiyasının təşəbbüsü ilə keçirilən "Süd Vəzi Xəstəliklərinə Multidissiplinar Yanaşma" mövzusunda keçirilən elmi-praktik konfransda "Süd vəzi xəstəliklərində ultrasəs müayinə, onun invaziv radiologiyaya və cərrahiyyəyə inteqrasiyası" adlı təqdimatla çıxış edib. Azərbaycan, Gəncə şəhəri.
2026. 15-ci "Westlake International Conference in Ultrasound Medicine and Biology" beynəlxalq elmi konqresində iştirak edib. Çin Xalq Respublikası, Hançjou şəhəri.', updated_at = NOW() WHERE slug = 'gunay-ehmedova';
UPDATE doctor SET bio = 'Haqqında:
2020 - Sağlam Ailə Tibb Mərkəzi, Həkim pediatr
2019-bugünədək - Oksigen Klinik xəstəxanası/ Həkim-neonatoloq
2016 - 2019 - Doktorantura/ K. Fərəcova adına Elmi-tətqiqat Pediatriya İnstitutu/ Həkim - pediatr
2011 - 2015 Rezidentura/ K. Fərəcova adına Elmi-tətqiqat Pediatriya İnstitutu/ Həkim - pediatr
2005 - 2011 Azərbaycan Tibb Universiteti/ Pediatriya', updated_at = NOW() WHERE slug = 'gunay-hacizade';
UPDATE doctor SET bio = 'Şöbə: Kardiologiya

İş təcrübəsi:
2012-2018 Müxtəlif dövlət tibb müəssisələrində kardioloq rezident vəzifəsində çalışıb
2018-ci ildən Mərkəzi Gömrük Hospitalında kardioloq vəzifəsində çalışır

Lisenziya və sertifikatlar:
2014 Anadangəlmə ürək qüsurları mövzusunda təlim. Bakı, Azərbaycan.
2014 Anadangəlmə ürək xəstəliklərində yeniliklər. Bakı, Azərbaycan.
2016 Azərbaycan Kardiologiya Cəmiyyətinin V Milli və I İnvaziv Kardioloqlarının konqresi
2017 Azərbaycan Kardiologiya Cəmiyyətinin VI Milli konqresi, Bakı, Azərbaycan.
2017 Türk Dünyası Kardioloji Birliyinin Bahar simpoziumu
2017 Acibadem Sağlamlıq Qrupu tərəfindən "Böyük Arteriyaların köçürülməsi və Transcatheter Closure of the Ventricular Septal Defect" təlimi, Bakı, Azərbaycan
2018 VI "Bakı ürək günləri" Beynəlxalq konqresi, Bakı, Azərbaycan
2018 Dr.Siyami Ersek Gögüs Kalp ve Damar Cerrahisi, Eğitim və Araştırma Hastanesi, İstanbul, Türkiyə. İnvaziv kardiologiya üzrə ixtisaslaşma təlimi
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli konqresi, Bakı, Azərbaycan
2022 Elmi-Tədqiqat Kardiologiya İnstitutu və Elmi-Tədqiqat Tibbi Bərpa İnstitutunun təşkilatçılığı ilə keçirilən "Kardiologiya və reabilitasiya nailiyyətlər və perspektivlər" mövzusunda Elmi konfrans.
2023 Türkiyənin Bayraktar Group Sağlamlıq Turizm Şirkətinin təşkilatçılığı ilə keçirilən "Ürək-damar xəstəliklərinin müasir aspektləri" adlı elmi-praktik konfrans. Azərbaycan, Bakı şəhəri.
2023 Hacettepe Universitetinin Azərbaycandakı Baş ofisi olan İncir And Global Healtsh şirkətinin və Azərbaycan Endoskopik və Laparoskopik Cərrahlar Assosiasiyasının birgə təşkilatçılığı ilə Heydər Əliyevin 100 illiyinə həsr olunmuş "Kardiologiyada və ürək-damar cərrahiyyəsində müasir metodlar" mövzusunda beynəlxalq konfransda iştirak edib.
2023 Azərbaycan Kardiologiya Cəmiyyətinin təşkilatçılığı ilə 2-ci Milli Kardiologiya konqresi. Azərbaycan, Bakı şəhəri.
2022 Azərbaycan Kardiologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən XI Milli konqres. Azərbaycan, Bakı şəhəri.
2022 Azərbaycan Kardiologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən IV Azərbaycan İnvaziv Kardiologiya konqresində iştirak etmişdir. Azərbaycan, Bakı şəhəri.
2025 Türkiyə Kardiologiya Cəmiyyətinin təşkilatçılığı keçirilən 41-ci Milli Kardiologiya Konqresi. Türkiyə, Antalya şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyəti
Avropa Kardiologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'gunay-hetemova';
UPDATE doctor SET bio = 'Şöbə: Kardiologiya

İş təcrübəsi:
2011-2015 Dövlət Tibb müəssisəsində, kardioloq
2015-ci ildən etibarən Mərkəzi Gömrük Hospitalında həkim-kardioloq kimi çalışır.

Lisenziya və sertifikatlar:
2014 Türkiyə İstanbul Maltepe Universiteti, exokardioqrafiya kursu
2016 Türkiyə Kardioloji Birliyinin birinci Bakı simpoziumu
2018 Azərbaycan Kardiologiya Cəmiyyətinin VII Milli konqresində iştirak edib.
2019 Beynəlxalq Kardiologiya (ESC 2019) konqresi, Fransa, Paris
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli konqresi, Azərbaycan, Bakı
Üzv olduğu təşkilatlar
Türkiyə Kardiologiya Cəmiyyəti
Azərbaycan Kardiologiya Cəmiyyəti
Avropa Kardiologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'gunay-memmedova';
UPDATE doctor SET bio = 'Haqqında:
05.05.2023 - bugünədək - Sağlam Ailə Tibb Mərkəzi / Şüa diaqnostika üzrə həkim
18.04.2023 - Sertifikasiya Şəhadətnaməsi
03.04.2018 - bugünədək - 18 №li Birləşmiş Şəhər Xəstəxanası / Şüa diaqnostika üzrə həkim
2012-2018 - Kliniki Tibbi Mərkəz / Şüa diaqnostika ixtisası üzrə rezidentura
2008-2009 - Ə.D.Məlikov adına 6 saylı Birləşmiş Şəhər Xəstəxanası / Həkim-terapevt
2002-2008 - Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'gunel-bayramova';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2025. Mərkəzi Gömrük Hospitalında anestezioloq-reanimatoloq kimi fəaliyyətə başlayıb.
Lisenziyalar və Sertifikatlar
2022 "Orqan və toxuma transplantasiyasında Beyin ölümü diaqnozunun aktual aspektləri" mövzusunda Beynəlxalq Elmi Konfrans
2023 Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin 1-ci Milli Konqresi
2024 Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin 2-ci Milli Konqresi
2025 Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin təşkilatçılığı ilə keçirilən 3-cü Milli Konqres. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'gunel-ceferova';
UPDATE doctor SET bio = 'Şöbə: Orqan Transplantasiyası

İş təcrübəsi:
2025 Mərkəzi Gömrük Hospitalında Cərrahiyyə şöbəsində ümumi cərrah

Lisenziya və sertifikatlar:
2022. Azərbaycan Respublikası Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin, Mərkəzi Gömrük Hospitalının təşkilatçılığı ilə keçirilən "Orqan və Toxuma Transplantasiyasında Beyin Ölümü Diaqnozunun aktual aspektləri" mövzusunda keçirilən konfrans. Azərbaycan, Bakı şəhəri
2024. Azərbaycan Respublikası Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin, Mərkəzi Gömrük Hospitalının təşkilatçılığı ilə "Orqan Transplantasiyasında Müasir Dövrün Çağırışları" mövzusunda keçirlən seminar və konfrans. Azərbaycan, Bakı şəhəri', updated_at = NOW() WHERE slug = 'haci-resulzade';
UPDATE doctor SET bio = 'Həkim-endokrinoloq.
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'haciyeva-nesibe-ebulfez';
UPDATE doctor SET bio = 'Stasionar şöbənin həkimi.
MediClub-da 2026-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'hemidov-rifah-ramazan';
UPDATE doctor SET bio = 'Sənaye təbabəti şöbəsinin həkimi.
MediClub-da 2025-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'hemidova-jale-eleddin';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi (rentqenoloq).
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'hemidova-viktoriya-leonidovna';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'hu-seynova-aynur-tacirovna';
UPDATE doctor SET bio = 'Anestezioloq-reanimatoloq.

İş təcrübəsi:
2015 - 2018 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2015 - DTX Hospital
2016 - Uludağ Universiteti Anesteziologiya və Reanimasiya üzrə kurs
2017- German Hospital
2018-ci ildən bu günədək Respublika Diaqnostika Mərkəzinin Anesteziologiya şöbəsində həkim anestezioloq-reanimatoloq vəzifəsində çalışır.', updated_at = NOW() WHERE slug = 'huseyn-babayev';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2023-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'huseynova-seadet-yaqub';
UPDATE doctor SET bio = 'Həkim-endokrinoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'huseynova-tamara-hafiz';
UPDATE doctor SET bio = 'Ümumi cərrah.

İş təcrübəsi:
1987-1989 Rusiyanın Leninqrad şəhərindəki hərbi hospitalda məcburi hərbi xidmətdə tibb qardaşı
1994 - 2003 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2013-2014 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2002-2013 Səudiyyə Ərəbistanı Krallıgı Səhiyyə Nazirliyi "Wothelan General Hospital"da ümumi cərrah
İstanbul Universiteti Çapa Tibb fakültəsi Xəstəxanasının Cərrahi Endoskopiya şöbəsində həkim-cərrah - sentyabr-dekabr 2014
2015-ci ildən bu günədək Respublika Diaqnostika Mərkəzində ümumi cərrah
İcra etdiyi əməliyyatlar:
Öd kisəsi və öd yollarında açıq və laparoskopik cərrahi əməliyyatlar
Laparoskopik appendektomiya
Diafraqma yırtıqlarının laparoskopik təmiri (fundoplikasiya)
Müxtəlif mənşəli bağırsaq keçməzliyinin ləğvi
Nazik və yoğun bağırsaqlarda aparılan açıq və laparoskopik əməliyyatlar
Yırtıqların açıq və laparoskopik üsulla təmiri (qasıq, göbək yırtıqları, orta xətt, əməliyyatdan sonra əmələ gələn yırtıqlar və s.)
Diaqnostik laparoskopiya
Bariatrik və metabolik cərrahiyyə (mədə kiçiltmə əməliyyatı)
Abdominoplastika
Babasil düyünlərinə lateks həlqələrinin qoyulması
Hemorroidektomiya
Pararektal fistulların ləğvi
Anal çatın cərrahi müalicəsi
Anal stenozlarda plastik rekonstruksiya (anoplastika).', updated_at = NOW() WHERE slug = 'ibrahim-efendiyev';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2025-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ibrahimov-turan-elsen';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi-pediatrı.
MediClub-da 2018-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ibrahimova-nigar-ibrahim';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2012-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ibrahimova-tahire-tahir';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi (USM).
MediClub-da 2007-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ibrahimova-zemfira-allahverdi';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi (USM).
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ibrahimova-zemfira-memmed';
UPDATE doctor SET bio = 'Həkim-stomatoloq (cərrah, implantoloq).
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ickovskiy-oleq';
UPDATE doctor SET bio = 'Həkim-terapevt.
MediClub-da 2019-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'idrisova-sebine-elbrus';
UPDATE doctor SET bio = 'Haqqında:
2010 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim dermatoveneroloq
2012 Sertifikasiya, Dermatovenerologiya üzrə
2008 - bugünədək Respublika Dəri Zöhrəvi Dispanseri, Həkim Dermatoveneroloq
1997 - 2008 Respublika Dəri Zöhrəvi Dispanseri, Baş həkim müavini
1995 - 1997 Bakı şəhər Dəri Zöhrəvi Dispanseri, Həkim Dermatoveneroloq
1994 - 1995 Bakı şəhəri 8 №li poliklinika, Həkim Dermatoveneroloq
1993 - 1994 İnternatura, Respublika Dəri Zöhrəvi dispanseri
1987 - 1993 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'ilham-igidov';
UPDATE doctor SET bio = 'Uroloq-onkoloq.

İş təcrübəsi:
2014 - 2019 Priviljskiy Rayon Tibb Mərkəzi, 3 saylı Kliniki Xəstəxananın urologiya şöbəsi
2018 - 2019 Nijniy - Novqorod, 30 saylı Şəhər Xəstəxanası, urologiya şöbəsi
⁠2019 - 2022 Novqorod Regional Onkoloji Dispanser, Uroloji Onkologiya şöbəsi
2023-cü ildən bu günə kimi Respublika Diaqnostika Mərkəzində uroloq - onkoloq.', updated_at = NOW() WHERE slug = 'ilkin-goyusov';
UPDATE doctor SET bio = 'Ümumi cərrah.
Elmi dərəcə: Uzman

İş təcrübəsi:
2002 - 2007 illərdə Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2017-ci ildən RDM-də həkim ümumi cərrah və 2018-ci ildən RDM Ümumi cərrahiyyə şöbəsinin müdiri vəzifəsində çalışır
Minimal invaziv (laparoskopik) qida borusu, mədə, bağırsaq əməliyyatları üzrə geniş təcrübəyə malikdir
Azərbaycan və ətraf regionda ilk və yeganə TransAnal Cərrahiyyə Mərkəzi qurmuşdur və düz bağırsaq xərçəngi xəstələrinə ən müasir cərrahi yardım göstərməkdədir
Avropanın ən böyük cərrahi virtual universiteti olan IRCAD-ın WebSurge portalında yayımlanan 4 expert videoların müəllifidir.
İcra etdiyi əməliyyatlar:
- Qarın divarının yırtıqlarının bərpası, laparoskopik
- Düz əzələ diastazının bərpası
- Süd vəzi cərrahiyyəsi
- Tiroid vəzi (zob) cərrahiyyəsi
- Öd kisəsi və öd yolları cərrahiyyəsi
- Qida borusunun xoş və bədxassəli şişlərinə görə laparoskopik əməliyyatlar
- Mədə xərçənginin laparoskopik əməliyyatları
- Bağırsaq şişlərinin laparoskopik cərrahiyyəsi
- Düz bağırsaq şişlərində TransAnal əməliyyatlar (TAMIS, TATME).', updated_at = NOW() WHERE slug = 'ilqar-ismayilov';
UPDATE doctor SET bio = 'Haqqında:
01.02.2023 - tarixinədək Sağlam Ailə Tibb Mərkəzi / Həkim uroloq
25.08.2022 - 15.12.2022 - "Unikal-A" MMC / Həkim-uroloq
01.12.2020 - 22.01.2022 - "HB Guven" MMC / Həkim-uroloq
26.07.2021 - 10.08.2022 - Necmettin Erbakan Üniversitesi Meram Tıp fakültesi üroloji ana bilim dalı / Üroloji eğitim
14.10.2020 - ci il tarixində - Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu Sertifikasiya Şəhadətnaməsi / Həkim-uroloq
2004 - 2009 - Azərbaycan Tibb Universiteti / Tibbi profilaktika', updated_at = NOW() WHERE slug = 'ilqar-mikayilzade';
UPDATE doctor SET bio = 'Şöbə: İnvaziv Kardiologiya

İş təcrübəsi:
2021-ci ildən I.M Seçenov adına Birinci Moskva Dövlət Tibb Universitetinin Bakı filialında müəllim kimi çalışır.
2021-2022 Azərbaycanın özəl tibb müəssisələrində
Həkim-kardioloq, Kardiologiya bölməsinin rəhbəri kimi çalışıb.
2022 ci ildən Mərkəzi Gömrük Hospitalında Kardiologiya şöbəsinin rəisi, yandal uzman invaziv kardioloq kimi fəaliyyət göstərir.
Nailiyyətlər və Üstünlüklər
2022 Türkiyənin "International Journal of Current Medical and Biological Sciences" jurnalına redaktor seçilib.
2022 "Frontiers in Cardiovascular Medicine" beynəlxalq kardiologiya jurnalında "Səyirici aritmiyalı xəstələrdə sol qulaqcığın airukulasının cihazla qapatılması" adlı məqaləsi dərc olunub.
2024 Hindistan Respublikasının Meril firmasının Transkateter Aorta Qapağı İmplantasiyası (TAVİ) qapaqları üzrə beynəlxalq proktoru seçilib.

Lisenziya və sertifikatlar:
Müxtəlif illərdə Avropa və Amerika Kardiologiya Cəmiyyətlərinin təşkil etdiyi kardioloji konfranslarda iştirak edib.
2022 Avropa Kardiologiya Cəmiyyətinin təşkilatçılığı ilə İ keçirilən beynəlxalq konfrans. İspaniya Krallığının Barselona şəhəri.
2022 "PCRValve2022" samittində iştirak edib. Böyük Britaniya, London şəhəri.
2023 Azərbaycan Kardiologiya Cəmiyyəti İctimai Birliyinin təşkilatçılığı ilə keçirilən 5-ci İnvaziv Kardiologiya konqresində iştirak edib. Azərbaycan, Bakı şəhəri.
2023 "Medtronic" firması tərəfindən dünyada TAVİ əməliyyatlarının təşkili, həyata keçirilməsi və təlimlərin təşkilinə icazə verən sertifikat alıb.
2024 Beynəlxalq Gömrük Günü münasibətilə Beynəlxalq Gömrük Təşkilatının Fəxri sertifikatı ilə təltif olunub.
2025. Qazaxıstan Səhiyyə Nazirliyinin təşkilatçılığı ilə "Struktur ürək xəstəlikləri" üzrə II Beynəlxalq Sammit. Qazaxstan, Astana şəhəri.
2026. CHIP-CTO INDIA 2026 beynəlxalq elmi konfransında məruzə ilə çıxış edib. Hindistan Respublikası.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyətinin üzvü
Kardiologiya Cəmiyyətinin üzvü
Avropa Kardiologiya Cəmiyyətinin üzvü
Amerika Kardiologiya Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'ilqar-tahiroglu';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Mama-Ginekologiya

Fəaliyyət sahələri:
Androloji - İstanbul Cərrahiyyə Xəstəxanası, Türkiyə, İstanbul
Genetik, İntergen Genetik Laboratoriya - Türkiyə, Ankara
Pgd, Genetiks Laboratoriyası - Türkiyə, İstanbul
Dondurma,vitrivikasyon - Bahceci tüpbebek Mərkəzi, Türkiyə, İstanbul

İş təcrübəsi:
1997-2000 Biokimyaçı, İnternatioanal Hospital Yeşilyurt, Türkiyə, İstanbul
2000-2004 Embrioloq, Alman Hastanesi Bahceci tüpbebek, Türkiyə, İstanbul
2014- Embrioloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'ilyas-karayaka';
UPDATE doctor SET bio = 'Həkim-uroloq.
MediClub-da 2015-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'imanov-kenan-islam';
UPDATE doctor SET bio = 'Radioloq.

İş təcrübəsi:
2004 - 2013 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2013-cü ildən bu günədək Respublika Diaqnostika Mərkəzində Şüa diaqnoastikası şöbəsində həkim-radioloq
Azərbaycan və Türk Radiologiya Cəmiyyətlərinin, Avropa Radiologiya Cəmiyyəti, Şimali Amerika Radiologiya Cəmiyyətinin həqiqi üzvüdür
Çoxsaylı ixtisasartırma kurslarının, seminar və konfransların fəal iştirakçısı olmuşdur.', updated_at = NOW() WHERE slug = 'irade-musayeva';
UPDATE doctor SET bio = 'Həkim-otorinolarinqoloq.
MediClub-da 2009-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'isayeva-vefa-atif';
UPDATE doctor SET bio = 'Şöbə: Allerqologiya və Detoks mərkəzi

İş təcrübəsi:
1996-2021 1 saylı şəhər Klinik xəstəxanasında Toksikologiya şöbəsinin həkim toksikoloq-reanimatoloqu kimi fəaliyyət göstərib. Bakı şəhərinin baş toksikoloqudur
2001-hazırki dövrə qədər Azərbaycan Tibb Universitetinin I Daxili xəstəliklər kafedrasının dosenti
2007-2008 Vivantes Humbold Xəstəxanası Daxili xəstəliklər, kardiologiya
və intensiv terapiya klinikasi Berlin, Almaniya
2022-ci ildən Mərkəzi Gömrük Hospitalında həkim allerqoloq-toksikoloq kimi fəaliyyət göstərir
Nailiyyətlər və Üstünlüklər
2001 Tibb elmləri namizədi
2010 Prezident Yanında Ali Attestasiya Komissiyasının qərarı ilə dosent elmi adı almışdır.
191 orijinal elmi iş, o cümlədən 4 dərs vəsaiti, 11 metodik vəsait, 2 monoqrafiya, 2 klinik protokol və 1 patent-ixtira
Elmi jurnallar və üzvlük
2015 bu vaxta kimi - "Caucasus Journal of Health Sciences and Public Health" (Gürcüstan) Elmi jurnalının redaksiya heyətinin üzvü
2016 bu vaxta kimi - "Eurasian Journal of Clinical Science" Elmi jurnalının redaksiya heyətinin üzvü
2017 bu vaxta kimi - "Toksikologiya" Elmi-praktiki jurnalının Baş Redaktoru
2019 bu vaxta kimi - «Медицина труда и промышленная экология» (Moskva, Rusiya Federasiyasi) elmi-praktiki jurnalının redaksiya heyətinin üzvü
2019 bu vaxta kimi - "Токсикологический вестник" (Moskva, Rusiya Federasiyasi) elmi jurnalının redaksiya heyətinin üzvü

Lisenziya və sertifikatlar:
2008 WHO 3rd International Training on Emergency and Disaster Management Specializing on Chemical, Biological and Nuclear (Bali, Indonesia)
2009 WHO INTOX Data Management System Users Training (Kardiff, Böyük Britaniya)
2010 WHO "Public Health and Emergency Management" Training (Bakı, Azərbaycan)
2012 Ümumdünya Səhiyyə Təşkilatının "Fövqəladə hallarda bağlı ictimai səhiyyədə idərəçilik" təlim kursu (Bakı, Azərbaycan)
2012 OMI Simposium on Medical Education (Tbilisi, Gürcustan )
2012 "Intensive teacher course on development and execution of Case-Based Reasoning" TEMPUS-MUMEENA Project Training (Utreht, Holland Krallığı)
2012 Modernizing Undergraduate Medical Education in EU Eastern Neighbouring Area TEMPUS Project Training (Kiev, Ukraina)
2013 AAF Medical Quality/Safety Seminarı (Zaltsburq, Avstriya)
2013 Dəvət olunmuş professor tədris həftələri (Ewha University, Seul, Cənubi Koreya)
2014 Columbia University Seminar in Internal Medicine (Zaltsburq, Avstriya)
2015 WHO EURO International Emergency Surge Training (Snekkersten, Danimarka)
2015 AAF CHOP Seminar in Medical Education (Zaltsburq, Avstriya)
2017 AAF CHOP Seminar in Clinical Research Methods (Zaltsburq, Avstriya)
2018 "Səhiyyə sistemində islahatların idarə edilməsi. Səhiyyə iqtisadiyyatı" təlimi (Bakı, Azərbaycan)
2019 "Seminar on Disease Control, Prevention and Management for Developing Countries" (Guangzhou, Çin)
2021 Türkiyə Xəstəxana İnfeksiyalara Nəzarət Dərnəyi tərəfindən təşkil olunmuş «Xəstəxana İnfeksiyalar» HİKON-2021 Beynəlxalq Konqresi. Türkiyə, Ankara şəhəri
2022 Avropa Kliniki Toksikoloqlar və Toksikoloji Mərkəzlər Assosiasiyasının (EAPCCT) 42-ci Beynəlxalq Konqresi. Estoniya, Tallinn şəhəri
2022 Naxçıvan Dövlət Universitetinin, Azərbaycan Tibb Universitetinin, Azərbaycan Endoskopik-Laporoskopik Cərrahlar Cəmiyyətinin təşkilatçılığı ilə keçirilən I Beynəlxalq Tibbi Forum. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri.
2023 Avropa Toksikoloji Mərkəzlər və Kliniki Toksikoloqlar Assosiasiyasının (EAPCCT) 43-cü Konqresi. İspaniya Krallığının Palma de Mayorka şəhəri
2023 Azərbaycan Respublikasının Səhiyyə Nazirliyi, "Tibbi Ərazi Bölmələrini İdarəetmə Birliyi", İctimai Səhiyyə və İslahatlar Mərkəzi, "Sağlam Ailə" Tibb Mərkəzi və "Facemark" şirkətinin ortaq təşkilatçılığı, VISA şirkətinin baş sponsorluğu ilə "Səhiyyə Menecmenti Zirvəsi" tədbiri. Azərbaycan, Bakı şəhəri.
2023 İrlandiya Respublikasının Dublin şəhərində keçirilən 16-cı Avropa İctimai Səhiyyə Konfransında iştirak edib.
2025 Niderland Krallığının Maastricht Universiteti tərəfindən təşkil olunan "Səhiyyədə İqtisadi Qiymətləndirmələr" mövzusunda beynəlxalq seminar. Avstriya Respublikası, Zalsburq şəhəri.
Üzv olduğu təşkilatlar
2003 MDB-nin Allerqoloqlar və İmmunologlar Cəmiyyətinin üzvü
2006 Azərbaycan Toksikoloqlar Cəmiyyətinin sədri
2009 Avropa Toksikoloji Mərkəzlərin və Kliniki Toksikoloqların Assosiasiyanın həqiqi üzvü
2010 BMT "Beynəlxalq Kimyəvi İdarəetmə Üçün Strateji Yanaşma"(SAICM) təşkilatının Azərbaycan üzrə koordinatoru
2012 Ümumdünya Səhiyyə Təşkilatyının Kimyəvi Təhlükəsizlik və Ətraf Mühitin Sağlamlığı üzrə Milli Ekspert və Koordinatoru', updated_at = NOW() WHERE slug = 'ismayil-efendiyev';
UPDATE doctor SET bio = 'Həkim-stomatoloq (ortodont).
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ismayilov-vuqar-azer';
UPDATE doctor SET bio = 'Həkim-kardioloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ismayilova-gunay-ismayil';
UPDATE doctor SET bio = 'Şöbə: Orqan Transplantasiyası

İş təcrübəsi:
2007-2018 özəl tibb müəssisələrində Orqan transplantasiyası şöbəsi
həkim-cərrah
2018-ci ildən etibarən Mərkəzi Gömrük Hospitalında cərrah-transplantoloq çalışır
Nailiyyətlər və Üstünlüklər
2023. Səhiyyə sahəsində qüsursuz və səmərəli fəaliyyətinə görə Azərbaycan Respublikası Səhiyyə nazirliyinin Fəxri Fərmanı ilə təltif edilib.
2025. Dr.Kamran Beydullayev canlıdan-canlıya böyrək və qaraciyər transplantasiyası əməliyyatlarında donorun əməliyyatını Laparoskopik (qapalı) və açıq üsulla icra edir. 2025-ci ilin fevral ayında meyit donordan alınan orqan köçürülməsi əməliyyatında Dr.Kamran Beydullayev meyitdən donor əməliyyatını Azərbaycanda ilk dəfə icra edərək icra edərək daha bir ilkə imza atıb.

Lisenziya və sertifikatlar:
2008-2009 Orqan transplantasiyası üzrə treninq, Türkiyə, İzmir
Üzv olduğu təşkilatlar
Avropa Orqan Transplantasiyası Cəmiyyəti
Orta Şərq Orqan Transplantasiya Cəmiyyəti
İngiltərə Kral Cərrahlar Kolleci', updated_at = NOW() WHERE slug = 'kamran-beydullayev';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi-pediatrı.
MediClub-da 2009-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'keberlinskaya-nigar-kamal';
UPDATE doctor SET bio = 'Haqqında:
2014 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim otorinolarinqoloq
2014 Vitamed Tibb Mərkəzi / Həkim otorinolarinqoloq
2011 - 2014 Şəfa Tibb Mərkəzi / Həkim otorinolarinqoloq
1999 - 2005 Azərbaycan Respublikası Səhiyyə Nazirliyində nəznində tibb müəssisəsi / Həkim otorinolarinqoloq
1998 - 1999 İnternatura / M.Qasımov adına Respublika Klinik Xəstəxanası / LOR şöbəsi
1992 - 1998 Azərbaycan Tibb Universiteti / 2ci Müalicə profilaktika', updated_at = NOW() WHERE slug = 'kemale-qardaseliyeva';
UPDATE doctor SET bio = 'Haqqında:
2018 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim pediatr
2016 - bugünədək Zirə Müalicə Diaqnostika Mərkəzi, Pediatr - neonatoloq
2011 - 2016 Rezidentura. K.Y. Fərəcova adına Elmi Tətqiqat Pediatriya İnstitutu
2009 - 2010 İnternatura. Sumqayıt Şəhər Uşaq Xəstəxanası, Həkim pediatr
2003 - 2009 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'kemale-rustemova';
UPDATE doctor SET bio = 'Haqqında:
2022 - bugünədək - Ultralab Tibb Mərkəzi Gəncə filialı / Həkim-dermatoloq
2022 - bugünədək - 3 Saylı Uşaq Dəri-Zöhrəvi Dispanseri / Dəri-Zöhrəvi həkim
2019 - bugünədək - "Vitiliqo Psoriaz Mərkəzi" MMC / Həkim-dermatoloq
2017 - 2018 - A.H. Group MMC / Həkim-dermatoloq
04/04/2018 - Sertifikasiya Şəhadətnaməsi, № AH 028991 / Dermatovenerologiya ixtisası
2004 - 2005 Respublika Dəri-Zöhrəvi Dispanseri Xəstəxanası / Həkim- dermatovneroloq ixtisası üzrə internatura pilləsini bitirmiş
1998 - 2004 Azərbaycan Tibb Universiteti / Müalicə ixtisası üzrə bakalavr pilləsini bitirmiş', updated_at = NOW() WHERE slug = 'kenan-ehmedov';
UPDATE doctor SET bio = 'Uroloq, şöbə müdiri.

İş təcrübəsi:
2014-2023 V. M. Buyanov adına Şəhər Klinik Xəstəxanası (Rusiya Federasiyası, Moskva), uroloq. Bu 10 il müddətində təcili və planlı uroloji müdaxilələr həyata keçirdib.
2023-cü ildən bu günə kimi Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'kenan-ehmedov-rdm';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi

İş təcrübəsi:
2007-ci ildə Özəl tibb müəssəsində kiçik həkim-pediatr
2010-2011 Özəl tibb müəssəsində torakal cərrah
2011-2018 Dövlət tibb müəssəsində ürək-damar cərrahı
2018-ci ildən Mərkəzi Gömrük Hospitalında ürək-damar cərrahı çalışır
Nailiyyətlər və Üstünlüklər
2018-ci ildə aparılan uğurlu əməliyyata görə Dövlət Sərhəd Xidməti tərəfindən Fəxri fərman.

Lisenziya və sertifikatlar:
2015 Ürək-damar cərrahı sertifikasiyası
2022 Türkiyə Pediatrik Kardioloji və Ürək Damar Cərrahiyyəsi Dərnəyinin təşkilatçılığı ilə keçirilən "Milli Pediatrik Kardioloji və Pediatrik Ürək Cərrahiyyəsi" konqresi. Türkiyə, Antalya şəhəri.
2024 Akademik V.İ. Şumakov adına Transplantologiya və Süni Orqanlar üzrə Milli Tibbi Tədqiqat Mərkəzində ürək transplantasiyası və süni ürək təcrübə kursunda iştirak edib. Rusiya, Moskva şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Assosiasiyasının üzvü', updated_at = NOW() WHERE slug = 'kenan-esedov';
UPDATE doctor SET bio = 'Haqqında:
2009 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim mama ginekoloq
2014 - bugünədək Müasir diaqnostika Klinikası
2008 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu, Mamalıq və ginekologiya üzrə
2003 - 2004 İnternatura, A.T. Abbasov adına Şəhər Onkoloji dispanseri
1997 - 2003 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'konul-eyvazova';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2011-2013-cü illərdə Naxçıvan Muxtar Respublikasında Respublika xəstəxanasında anestezioloq-reanimatoloq.
2013-cü ildən etibarən Mərkəzi Gömrük Hospitalında anestezioloq-reanimatoloq kimi çalışır.
Mükafatlar
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2004-2005 . M.Ə.Əfəndiyev adına 2 saylı klinik xəstəxanasında anesteziologiya və reanimasiya şöbəsi, internatura təhsili.
2011. Türkiyə, İzmit, Kocaeli Egitim-Araştırma Hastanesi, təkmilləşdirmə kursu.
2013. Türkiyə, Ankara, Atatürk Egitim-Araşdırma Hastanesi, təkmilləşdirmə kursu.
2014. Türkiyə, İzmir, Ege Üniversitesi Hastanesi, Perfuziologiya kursu.
2021 Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2024. Türkiyə Anesteziologiya və Reanimasiya Cəmiyyətinin təşkilatçılığı ilə 58-ci Milli Konqres. Türkiyə, Antalya şəhəri
2025 Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin təşkilatçılığı ilə keçirilən 3-cü Milli Konqres. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'konul-hesenova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Təşviş pozuntuları, panik atak və depressiya
Asılılıqlar (maddə, tütün, alkoqol və oyun asılılığı)
Ailə və cütlük terapiyası
Qorxu və fobiyalar
Obsessiv-kompulsiv pozuntu
Psixosomatik ağrılar və tükənməşlik sindromu
Post-travmatik stress və uşaqlıq travmaları
Özgüvən problemləri və stressin idarə olunması
Davranış pozuntuları
Valideyn-övlad münasibətləri
Qorxular və bullinq problemləri
Diqqət əskikliyi və təfəkkür çətinlikləri
Təlim uğursuzluğu və imtahan stressi
Psixoanaliz və Koqnitiv Davranış Terapiyası (CBT)

Konfranslar:
"Rasional Emosional və Koqnitiv Davranış Terapiyası" - (CBT) beynəlxalq kurs. (Amerikanın Albert Ellis İnstitutu, Türkiyənin Rasio Psixologiya İnstitutu və Psixologiya Elmi Tədqiqat İnstitutunun əməkdaşlığı çərçivəsində keçirilmiş kurs).', updated_at = NOW() WHERE slug = 'konul-mircavadzade';
UPDATE doctor SET bio = 'Haqqında:
2020 - bugünədək - Sağlam Ailə Tibb Mərkəzi/ Şüa diaqnostika üzrə həkim
2008 - bugünədək Lanset cərrahlıq klinikası/ Şüa diaqnostika üzrə həkim
2005 - 2008 - Odlar Yurdu Universiteti/ Baş laborant
2004 - 2005 - İnternatura - M.N. Qədirli adına Mərkəzi Hövzə Xəstəxanası/ Funksional - diaqnostik
1998 - 2004 - N. Nərimanov adına Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'konul-qurbetova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Uşaqlarda və yeniyetmələrdə psixoloji dəstək
Diqqət pozuntusu
Hiperaktivlik və impuls nəzarətində çətinliklər
Davranış pozuntuları
Məktəbə psixoloji hazırlıq
Bacı-qardaş qısqanclığı
Aqressiya və əsəbiliyin idarəsi
Fobiyalar (qorxu)
Utancaqlıq və özünəqapanma
Asossial davranışlar
Tik pozuntuları (məs., göz qırpma, səs çıxarma və s.)
Enurez və enkoprez (sidik və nəcis qaçırma)
Ünsiyyət çətinlikləri
Yeniyetməlik dövrünə aid emosional və davranış problemləri
İmtahan həyəcanı və akademik stress
İnternet və oyun asılılığı
Emosional və davranış pozuntularının korreksiyası
Stress və gərginliklə mübarizə
Depressiv vəziyyətlər
Frustrasiya (təkrar uğursuzluqlardan doğan ruh düşkünlüyü)
İntihar meyillərinin qiymətləndirilməsi və yönləndirilməsi
Yuxu pozuntuları
Təşviş (anksiyete) pozuntuları
Panik atak
Obsessiv-Kompulsiv Pozuntu (OKP)

Konfranslar:
Milli Məclisin Mədəniyyət Komitəsinin sədri Qənirə Paşayeva tərəfindən Vətən Müharibəsinin simvolu olan Xarı Bülbül yaxa nişanı ilə təltif olunub.
Vətən müharibəsi dövründə və sonrakı vaxtlarda göstərdiyi psixoloji yardımlara görə
Amerikanın Azərbaycandakı Səfirliyi - " Uşaqlar və Biz " adlı silsiləli xeyriyyə lahiyəsi həyata keçirdiyinə görə
" Ailə həyatına aparan yol" və s. adlı seminarlar keçirdiyinə görə
Elmi - Pedoqoji Yaradıcılıq Birliyinin X Elmi Konfransı - " Çətin tərbiyə olunan uşaqların psixoloji xüsusiyyətləri "adlı mövzu ilə çıxışına görə
Vətən müharibəsi dövründə göstərdiyim psixoloji yardımlara və Psixologiya sahəsində uğurlu fəaliyyətimə görə, " Azərbaycan İnciləri 2021" mükafatına layiq görülmüşdür.', updated_at = NOW() WHERE slug = 'konul-telmanqizi';
UPDATE doctor SET bio = 'Həkim-dermatoloq-kosmetoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'korobk-alena';
UPDATE doctor SET bio = 'Şöbə: Nevrologiya

İş təcrübəsi:
2005-2018 Dövlət və özəl tibb müəssisələrində nevroloq kimi çalışıb
2018-ci ildən Mərkəzi Gömrük Hospitalında həkim-nevroloq kimi çalışır

Lisenziya və sertifikatlar:
2014 Podiatriya və Pəncənin FormThotiks sistemi vastəsi ilə içliklərin hazırlanması" üzrə təlim
2014 Həkimləri Təkmilləşmə instututunda nevrologiya ixtisası üzrə təkmilləşmə kursu və sertifikasiyadan keçmişdir
2015 Elektroensefaloqrafiya kursu, Azərbaycan, Bakı
2016 Akademik B.N.Komançevin rəhbərliyi altında körpələrdə mərkəzi və periferik sinir sisteminin prenatal və natal zədələnmələrinin qlobal Elektromioqrafiya vasitəsi ilə erkən diaqnostikası kursu, Rusiya, Sankt-Peterburq
2016 "Uluslararası Trigger Point Performance Therapy" ixtisaslaşma kursu, Türkiyə-ABŞ
2017 "Medical taping course Sindividual-kinesology-taping, cross-taping, trigger points"
2017 Elektroson, transkranial elektroanalgeziya, transkranial elektrostimulyasiya, mezodiensefal modulyasiya, mikropolyarizasiya kursu, Rusiya, Yekaterinburq
2018 İdman sahəsi üzrə beynəlxalq dərəcəli nutrisioloq və dietoloq', updated_at = NOW() WHERE slug = 'lale-adilxanova';
UPDATE doctor SET bio = 'Dermatoloq.

İş təcrübəsi:
2002-2006 Gəncə Dəri Zöhrəvi Dispanseri, həkim dermatoveneroloq
2006-2014 World Med klinikası, həkim dermatoveneroloq
2015-2022 - Respublika Diaqnostika Mərkəzi, həkim dermatoveneroloq
2022-2023 Korea Təbabəti Mərkəzi, həkim dermatoveneroloq
2023-2025 Paramed klinikası, həkim dermatoveneroloq
2025 Mart ayından Respublika Diaqnostika Mərkəzi, həkim dermatonevroloq', updated_at = NOW() WHERE slug = 'lale-ehmedova';
UPDATE doctor SET bio = 'Haqqında:
2022 - bugünədək Sağlam Ailə Ultralab klinikası / Həkim-endokrinoloq
2015 - 2022 - Azərbaycan Tibb Universiteti / Dissertant (davam edir)
2008 - 2010 - Diabet mərkəzi / Həkim endokrinoloq
2006 - 2007 - Sumqayıt Şəhər Uşaq Poliklinikası / Həkim interna
2000 - 2006 - Azərbaycan Tibb Universiteti Pediatriya', updated_at = NOW() WHERE slug = 'leman-sultanova';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
2018-2022 Dövlət tibb müəssisəsində terapevt
2022 Mərkəzi Gömrük Hospitalının Təcili tibbi yardım şöbəsində həkim kimi fəaliyyət göstərir.
Nailiyyətlər və Üstünlüklər
5 elmi iş, 1 məqalə, 4 tezis və 3 metodik vəsaitin müəllifidir.

Lisenziya və sertifikatlar:
2021 Ümumdünya Səhiyyə Təşkilatının və Beynəlxalq Qırmızı Xaç Komitəsinin təşkil etdiyi "Təməl Təcili Yardım" kursu, Bakı, Azərbaycan
2021 Azəri Toksikoloqlarının Dərnəyi tərəfindən təşkil olunan "Kəskin Zəhərlənmələrin Prehospital Mərhələdə Diaqnostika və Müalicəsi" e-təlimi, Bakı, Azərbaycan
2019 K.Fərəcova adına Elmi Tədqiqat Pediatriya İnstitutu və Uptodate İn Medicine birgə təşkilatçılığı ilə keçirilən Təkmil Həyata Dəstək (Təxirəsalınmaz Kardiovaskulyar Yardım)/ACLS üzrə Təlim kursu, Bakı, Azərbaycan
2018 3-cü Beynəlxalq Anesteziologiya və İntensiv Terapiya Konfransı, Batumi, Gürcüstan
2015 Türk İç Hastalıkları Uzmanlık Derneği tərəfindən keçirilən "Beynəlxalq Daxili Xəstəliklər Təlim Görüşləri - 6" iştirak etmişdir. - Bakı, Azərbaycan
Üzv olduğu təşkilatlar
Azərbaycan Toksikoloqlar Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'leyla-fetullayeva';
UPDATE doctor SET bio = 'Radioloq.

İş təcrübəsi:
2007 - 2018 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2018-ci ildən bu günədək Respublika Diaqnostika Mərkəzində İntervensional radiologiya və şüa diaqnostikası şöbəsində ultrasəs müayinə mütəxəssisi vəzifəsində çalışır', updated_at = NOW() WHERE slug = 'leyla-ismayilova';
UPDATE doctor SET bio = 'Fizioterapevt.

İş təcrübəsi:
2007 "Neurosphere Clinic", həkim-fizioterapevt
2014 "Hayat Clinic", həkim-fizioterapevt
2016-2022 Mediland klinikası fizioterapiya və reabilistasiya şöbəsinin müdiri, həkim-fizioterapevt, kinezioloq, FDM-osteopat
Respublika Diaqnostika Mərkəzində 2022-ci ildən bu günədək fəaliyyət göstərir.
İcra etdiyi prosedurlar:
Manual əzələ testləri ilə onurğa və oynaqaların funksional vəziyyəti, reflekslərin diaqnostikası
Manual və osteopatik üsullarla müalicə
Visseral manual və osteopatik müalicə üsulları
Fiziki, mexanki və optiki faktorların müalicədə tətbiqi', updated_at = NOW() WHERE slug = 'leyla-matanova';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək Müasir Diaqnostika klinikası/ Həkim-stomatoloq
2021-2023 - Moskva şəhəri "M-vito" MMC/ Həkim-stomatoloq
2020-2021 - Dental update klinikası/ Həkim-stomatoloq
2016 - Kurs - Ondokuz Mayıs Üniversitesi/ Oral cərrahiyyə kafedrası
2012-2017 - Azərbaycan Tibb Universiteti/ Stomatologiya', updated_at = NOW() WHERE slug = 'leyla-pasayeva';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2020-cü ildən Mərkəzi Gömrük Hospitalında mama-ginekoloq kimi çalışır.

Lisenziya və sertifikatlar:
2016 Diaqnoz Tibb Mərkəzinin təşkilatçılığı ilə "Uşaqlıq boynu patologiyası və kolposkopiya" kursu, Azərbaycan, Bakı şəhəri.
2016 Almaniya-Azərbaycan Tibbi Əməkdaşlıq Assosiasiyası və ALMAZ AKADEMİYASI Tibbi Tədris Mərkəzinin təşkil etdiyi "Laparoskopik ginekologiya və histeroskopiya" kursu, Azərbaycan, Bakı şəhəri.
2017 Almaniyanın Frayburq Akademiyasının MEDIZIN GmbH-in təşkilatçılığı ilə "Ultrasonoqrafiya" təlimi, Azərbaycan, Bakı şəhəri.
2018 Histeroskopiya və Minimal İnvaziv Cərrahiyyə Akademiyasının təşkilatçılığı ilə "Histeroskopiya" kursu - HAMSA, Azərbaycan, Bakı şəhəri.
2019 Azərtürkmed lazer klinikasının təşkilatçılığı ilə "Lazer və estetik ginekogiya" üzrə təlim, Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'leyla-qacayli';
UPDATE doctor SET bio = 'Haqqında:
2015 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim Otolarinqoloq
2014 Sertifikasiya
2014 - bugünədək Bakı Sağlamlıq Mərkəzi / Həkim Otolarinqoloq
2000 - 2004 F.Əfəndiyev adına 4 saylı klinik xəstəxana / Həkim Otolarinqoloq
1999 - 2000 F.Əfəndiyev adına 4 saylı klinik xəstəxana təcili təxirə salınmaz yardım üzrə növbətçi həkim
1998 - 1999 İnternatura / F.A.Əfəndiyev adına 4 № li şəhər klinik xəstəxanası
1992 - 1998 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'leyla-qaraqasova';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'mahmudov-metin-iftixar';
UPDATE doctor SET bio = 'infeksionist.
Şöbə: İnfeksion xəstəliklər

İş təcrübəsi:
2017- 2021 Özel Ege Şəhər Xəstəxanası, İnfeksion Xəstəliklər və Klinik Mikrobiologiya mütəxəssis
2020 Ümumdünya Səhiyyə Təşkilatı, REACT C19 konsultant-həkim, İnfeksion Xəstəliklər və Klinik Mikrobiologiya mütəxəssisi
2021-ci ildən Mərkəzi Gömrük Hospitalında çalışır

Lisenziya və sertifikatlar:
2017 "Veyl xəstəliyi: anamnez və erkən müalicənin əhəmiyyəti." 18-ci Türk Klinik Mikrobiologiya və Yoluxucu Xəstəliklər Konqresi, Türkiyə.
2018 "Xroniki hepatit B ilə qaraciyər zədələnməsi və HBV DNT səviyyəsinin Golgi protein 73 ifadəsi ilə əlaqələri." 19-cu Türkiyə Klinik Mikrobiologiya və Yoluxucu Xəstəliklər Konqresi, Türkiyə
2019 "Xroniki hepatit B ilə qaraciyər zədələnməsi və HBV DNT səviyyəsinin HBsAg ifadəsi ilə qarşılıqlı əlaqəsi" 20-ci Türk Klinik Mikrobiologiya və Yoluxucu Xəstəliklər Konqresi, Türkiyə
2021 Türkiyə Xəstəxana İnfeksiyalara Nəzarət Dərnəyi tərəfindən təşkil olunmuş «Xəstəxana İnfeksiyalar» HİKON-2021 Beynəlxalq Konqresi. Türkiyə, Ankara şəhəri
2022 Naxçıvan Dövlət Universitetinin, Azərbaycan Tibb Universitetinin, Azərbaycan Endoskopik-Laporoskopik Cərrahlar Cəmiyyətinin təşkilatçılığı ilə keçirilən I Beynəlxalq Tibbi Forum. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri
2025. Azərbaycan Respublikası Səhiyyə Nazirliyi, TƏBİB və Azərbaycan İnfeksion Xəstəliklər və Klinik Mikrobiologiya Cəmiyyətinin təşkilatçılığı ilə Bakı şəhərində keçirilən "II Azərbaycan İnfeksion Xəstəliklər və Klinik Mikrobiologiya Cəmiyyətinin" konfransında "Solid orqan transplantasiya olan xəstələrdə virus hepatitlərin idarə olunması" mövzusunda təqdimatla çıxış edib.
2025. TƏBİB, Azərbaycan Nefroloqlar Cəmiyyəti, Yeni Klinika və TƏBİB Akademiyasının təşkilatçılığı, Səhiyyə Nazirliyinin İctimai Səhiyyə və İslahatlar Mərkəzinin əməkdaşlığı ilə keçirilən "Nefrologiya və Hemodializ Məktəbi" adlı elmi-praktik konqresdə "Hemodializ alan pasiyentlərdə tez-tez rast gəlinən infeksiyalar" mövzusunda çıxış edib.
Üzv olduğu təşkilatlar
Türkiyə Klinik Mikrobiologiya və İnfeksion Xəstəliklər Cəmiyyəti (KLİMİK)
Türkiyə İnfeksion Xəstəliklər və Klinik Mikrobiologiya Cəmiyyəti (EKMUD)
Avropa Klinik Mikrobiologiya və İnfeksion Xəstəliklər Cəmiyyəti (ESCMID)
Amerika İnfeksiyon Xəstəliklər Cəmiyyəti (IDSA)', updated_at = NOW() WHERE slug = 'medine-abdullayeva';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2003-2006 Özəl tibb müəssisəsi, həkim
2004-2006 Bakı ş. Təcili və Təxirəsalınmaz Tibbi Yardım stansiyasının həkimi
2007-2011 Milan Universiteti. Ospedale Maggiore of Milan xəstəxanası
2012-ci ildən etibarən Mərkəzi Gömrük Hospitalı, Reanimasiya və intensiz terapiya şöbəsi, həkim anastezioloq-reanimatoloq
Lisenziyalar və Sertifikatlar
2005 Aberdin Universiteti, Şotlandiya - Advanced Cardiac and Trauma Life Support Skills Course and Completed Clinical Update on the Administration of Thrombolysis kursları
2007-2011 Milan Universiteti. Ospedale Maggiore of Milan xəstəxanası Anesteziologiya və İntensiv terapiya kafedrası
2010 Bucharest Romanian Society for Emergency and Disaster Medicine- Emergency Clinic Hospital, Emergency Care Department, Ruminiya
2011 IRCCS Polilinico San Donato Milano xəstəxanası Anesteziya və Reanimasiya Kardiotoraks cərrahiyyəsi- İtaliya, Milan
2012-2013 Ege Universiteti Ürək-Damar Cərrahiyyəsi kafedrası Anesteziologiya və Perfuziologiya və İntensiv terapiya- İzmir, Türkiyə
2021 Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 M.A.Topçubaşov adına Elmi Cərrahiyyə Mərkəzinin Doktorantura şöbəsinin Anesteziologiya və Reanimasiya ixtisası üzrə həkim doktorantı
2024 Ümumdünya İnsult Təşkilatının təşkilatçılığı ilə keçirilən16-cı Ümumdünya İnsultla Mübarizə Konqresi. Birləşmiş Ərəb Əmirlikləri, Abu Dabi şəhəri.
Üzv olduğu təşkilatlar
Avropa Anestezioloqlar Cəmiyyəti
Türk Anesteziologiya və Reanimasiya Cəmiyyəti
Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyəti
Avropa İntensiv Terapiya Təbabəti Cəmiyyəti', updated_at = NOW() WHERE slug = 'mehdi-eliyev';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək Sağlam Ailə Tİbb Mərkəzi, Həkim endokrinoloq
2020 - bugünədək Görüş tibb mərkəzi/ Həkim-endokrinoloq
2019-2020 - Nərgiz med tibb mərkəzi/ Həkim-endokrinoloq
2018-2019 - Sağlam Ailə Tİbb Mərkəzi, Həkim endokrinoloq
2016-2018 - Hayat Clinic/ Həkim-endokrinoloq
2013-2016 - AzərTürkMed Hospital/ Həkim-endokrinoloq
2004 - 2005 - İnternatura/ F. Əfəndiyev adına 4 saylı şəhər klinik xəstəxanası/ Həkim-endokrinoloq
1998-2004 - Azərbaycan Tibb Universiteti/ Müalicə işi', updated_at = NOW() WHERE slug = 'mehri-memmed-zade';
UPDATE doctor SET bio = 'Terapevt.

İş təcrübəsi:
2007-2019 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2012-2019 Daxili İşlər Nazirliyi Daxili Qoşunlarının Hərbi Hospitalı
2019-cu ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'mehriban-efendiyeva';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2001-2008 Özəl tibb mərkəzləri, mama-ginekoloq
2008-2012 RF, Sertolovo mərkəzi şəhər xəstəxanası, mama-ginekoloq
2014-cü ildən Mərkəzi Gömrük Hospitalı, mama-ginekoloq kimi çalışır

Lisenziya və sertifikatlar:
2009 RF, Sankt-Peterburq, "Uşaqlıq yolunun və boynunun patalogiyasi"; "Mama-ginekologiya praktikasında ultrasəs diaqnostikasi"; "Ginekologiyada histeroskopiya" ixtisasartırma kursları; "Mama-ginekologiyada əl ilə vakuum aspirasiyası" təlimi
2010 RF, Sankt-Peterburq, "Ginekologiyada endovideocərrahiyyə"; "Sonsuz ailə" ixtisasartırma kursları
2011 RF, Moskva, "Medikamentoz abort: tibbi texnologiya" təlimi; "Müasir kontrasepsiya reproduktiv sağlamlıqda" seminarı
2011 RF, Sankt-Peterburq, "Ginekoloji endokrinologiya"; "Ailə cütlüyünün reproduktiv sağlamlığı" ixtisasartırma kursları
2013-2014 Turkiyə, İstanbul, Bahçeci Sağlamlıq Qrupu (Süni Mayalanma Mərkəzi); İstanbul Universiteti Tibb Fakültəsi, Qadin xəstəliklərı və Doğum Anabilim Dalı; Eğitim və Araştırma xəstəxanasında praktika
2013 Türkiyə, İstanbul, "Ultrasonoqrafi", "Urojinekolojik əməliyyatlar" kursları
2014 "Ginekologiyada laparoskopiya", "Yumurtalıqların polikistoz sindromu", "Pratik ovulasyon induksiyonu", "Tibbi və Cərrahi müalicə", "Təməl obstetri ustrasonoqrafi" kursları, Türkiyə, İstanbul
2014 "Vaginal Histerektomiya" kursu, Türkiyə, Ankara
2014 "Laparoskopik sütür texnikaları", "Histereskopi" kursları, Türkiyə, İzmir
2019 "Ginekologiyada endovideocərrahiyyə" kursu, Rusiya, Sankt-Peterburq
2019 "Ginekologiyada endoskopiya təhsili 1"; "Ginekologiyada endoskopiya təhsili 2" kursları, Türkiyə, Bursa
2020 "Ginekologiyada endoskopiya təhsili 3" kursu, Türkiyə, Istanbul
2020 Cinsel Sağlık Enstitüsü Derneyi. Vaginizm təlimi, Türkiyə, İstanbul
2021 Türkiyə Qaradəniz Qadın Sağlığı Cəmiyyətinin təşkilatçılıgı ilə hibrit formatında keçirilən IV Qaradəniz Ginekoloji və Mamalıq konqresi, Türkiyə, İstanbul
2022 Naxçıvan Dövlət Universitetinin, Azərbaycan Tibb Universitetinin, Azərbaycan Endoskopik-Laporoskopik Cərrahlar Cəmiyyətinin təşkilatçılığı ilə keçirilən I Beynəlxalq Tibbi Forum. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri
2022 FAGA master-class Funksonal Kosmetik Ginekoloji Birebir Uygulamalı Kurs (COSGYN). Bakı, Azərbaycan
2022 Beynəlxalq Genital Estetik və Kosmetik Ginekologiya mövzusunda kurs. İstanbul, Türkiyə.
2022 Rusiya Federasiyası Səhiyyə Nazirliyinin Akademik V.İ.Kulakov adına Milli Tibbi Tədqiqat Mamaliq, Ginekologiya və Perinatologiya Mərkəzinin təşkilatçılığı ilə keçirilən "Estetik ginekologya" mövzusunda ixtisasartırma kursu. Moskva, Rusiya.
2023 "Ginekologiyada lazer tətbiqi" mövzusunda beynəlxalq master-klass (Mauriziano Hospital). Turin, Italiya
2023 "Ginekologiyada lazer tətbiqi" mövzusunda beynəlxalq master-klass. (Mario Malzoni clinic). Avellino, Italiya.
ACOGS kurs günləri, "Genetal estetik kursu", İstanbul, Türkiyə
2024 "Genital estetika qeyri cərrahi tətbiqlər kursu". (Organization of medical projects academy).Bakı, Azərbaycan
2024 "Ginekologiyada Lazer tətbigi" beynəlxalq master-klass", Bakı, Azərbaycan
2025. Uşaqlıq və Endometrioz üzrə Avropa Cəmiyyətinin təşkilatçılığı ilə keçirilən XXI Beynəlxalq Konqres. Çexiya Respublikası, Praqa şəhəri
2025. Özbəkistan Respublikasının Andijan şəhərində keçirilən Andijan Dövlət Tibb İnstitutunun 70 illik yubileyinə həsr olunmuş "Profilaktik təbabətdə yüksək innovativ texnologiyaların istifadəsi" mövzusunda beynəlxalq elmi-praktik konfransda moderator və məruzəçi qismində iştirak edib. Özbəkistan Respublikası, Andijan şəhəri
2025. XI Beynəlxalq Konqresdə moderator və məruzəçi qismində iştirak edib. Konqresdə "Vulvovaginal atrofiyanın müalicəsində diod lazerin tətbiqi" mövzusunda məruzə ilə çıxış edib. Özbəkistan, Daşkənd şəhəri.', updated_at = NOW() WHERE slug = 'mehriban-emirova';
UPDATE doctor SET bio = 'Şöbə: Nevrologiya

İş təcrübəsi:
2004-2015 Müxtəlif dövlət və özəl müəssisələrində uşaq nevropatoloqu kimi fəaliyyət göstərib.
2016-cı ildən etibarən Mərkəzi Gömrük Hospitalında uşaq nevropatoloqu kimi çalışır
Nailiyyətlər və Üstünlüklər
2022 Azərbaycan Respubikası Dövlət Gömrük Komitəsi tərəfindən qüsursuz xidmət və xidmətdə əldə etdiyi nailiyyətlərə görə Fəxri Fərman ilə təltif olunub.

Lisenziya və sertifikatlar:
2010 Əziz Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda "Nevropatologiya" üzrə ümumi təkmilləşdirmə kursu.
2016 Memorial Ankara Universitetinin təşkilatçılığı ilə "Uşaq Sağlamlığı" mövzusunda təlim konfransı. Azərbaycan, Bakı şəhəri.
2019 Beynəlxalq Pediatriya Assosiasiyasının təşkilatçılığı ilə 17-ci UNPSTR Avrasiya konqresi. Azərbaycan, Bakı şəhəri.
2019 Azərbaycan Respublikası Səhiyyə nazirliyinin təşkilatçılığı ilə "İmmunpatoloji Xəstəliklər" adlı 1-ci Beynəlxalq konfrans. Azərbaycan, Bakı şəhəri.
2017 Türkiyə Nevroloji Cəmiyyətinin təşkilatçılığı ilə "Pediatriyada Yeniliklər" simpoziumu. Azərbaycan, Bakı şəhəri.
2018 Azərbaycan Tibb Assossiasiyası və Türkiyə Pediatriya Cəmiyyətinin təşkilatçılığı "Pediatriyada Yeniliklər" mövzusunda VIII simpozium. Azərbaycan, Bakı şəhəri.
2019 Azərbaycan Pediatrlar Assosiasiyasının təşkilatçılığı ilə "Ailə həkiminin fəaliyyətində Pediatriyanın aktual problemləri" mövzusunda elmi-praktiki konfrans. Azərbaycan, Bakı şəhəri.
2021 Azərbaycan Respublikası Dövlət Gömrük Komitəsi Tibbi Xidmət İdarəsinin Elmi-Təcrübi Tədris Mərkəzinin təşkilatçılığı ilə "Pediatriyada aktual mövzular:Müasir tibbi yeniliklərin təcrübədə tətbiqi" beynəlxalq elmi konfrans. Azərbaycan, Bakı şəhəri.
2022 Azərbaycan Respublikası Səhiyyə Nazirliyinin "Davamlı Tibbi Təhsil üzrə elm və tədris tədbirlərinin akkreditasiyası Qaydaları" əsasında DTT üzrə akkreditasiya edilmiş "Sağlam Böyüyən Uşaq" adlı elmi praktik tibb simpoziumu. Azərbaycan, Bakı şəhəri.
2022 Türk Yuxu Tibb Birliyinin təşkilatçılığı ilə keçirilən XXll Milli Yuxu Tibb Üsulları və Texnikası konqresi. Türkiyə, İzmir şəhəri.
2022 Azərbaycan Respublikası Səhiyyə Nazirliyinin təşkilatçılığı ilə "Sağlam Böyüyən Uşaq" adlı elmi praktik tibb simpozium. Azərbaycan, Bakı şəhəri.
2022 Türkiyə Yuxu Tibb Birliyinin təşkilatçılığı ilə XXII "Milli Yuxu Tibb Üsulları və Texnikası" konqresi. Türkiyə, İzmir şəhəri.
2022 Azərbaycan Pediatriya Cəmiyyətinin I Milli konqresi. Azərbaycan, Bakı şəhəri.
2022 Azərbaycan Pediatriya Cəmiyyətinin I Milli konqresi çərçivəsində "Uşaq nevrologiyası" kursu. Azərbaycan, Bakı şəhəri.
2025. Türkiyə Nevrologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən 61-ci Milli Nevroloji Konqresində iştirak edib. Türkiyə, Antalya şəhəri.', updated_at = NOW() WHERE slug = 'mehriban-memmedova';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi-pediatrı.
MediClub-da 2014-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedov-sehriyar-etibar';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2013-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedova-ayten-sahin';
UPDATE doctor SET bio = 'Həkim-stomatoloq (terapevt, ortoped, uşaq stomatoloqu).
MediClub-da 2018-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedova-kemale-rufet';
UPDATE doctor SET bio = 'Həkim-mammoloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedova-tunzale-novruz';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi-pediatrı.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedova-vusale-zakir';
UPDATE doctor SET bio = 'Həkim-dermatoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'memmedova-xeyale-elman';
UPDATE doctor SET bio = 'Şöbə: Nevrologiya

İş təcrübəsi:
1983-2011 Dövlət və özəl tibb müəssisələrində p sixonevroloq, həkim-nevroloq və şöbə müdiri kimi çalışıb
2011-ci ildən Mərkəzi Gömrük Hospitalı, həkim- nevropatoloq

Lisenziya və sertifikatlar:
2010 "Baş ağrıları və Miqren" mövzusunda seminar. Fransa, Ntisa
2011 Serebral xəstəliklərinin müalicəsi. Avstrya, Zalsburq
2013 Nevralogiya günləri konfransı. Epilepsiya, Miqren və dağınıq skleroz, diaqnostik və müalicəvi üsulları, Türkiyə, Uludağ
2014 23-cü Europa konfransı, Fransa, Nitsa
2015 "Korvitinin kardioloji və nevroloji praktikada istifadəsi" mövzusunda konfrans, Azərbaycan, Bakı
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.', updated_at = NOW() WHERE slug = 'mensume-talibova';
UPDATE doctor SET bio = 'Fizioterapevt.

İş təcrübəsi:
2007 - 2017 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2017-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fizioterapevt kimi fəaliyyət göstərir
2021-ci ildən bu günədək fizioterapiya şöbə müdiri vəzifəsində çalışır', updated_at = NOW() WHERE slug = 'metanet-abbasova';
UPDATE doctor SET bio = 'Haqqında:
2019 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Həkim-pediatr
2017 - bugünədək - Gəncə şəhər 2 nömrəli Birləşmiş Uşaq Xəstəxanası/ Həkim-pediatr
2014 - 2016 -Gəncə Müalicə Diaqnostika Mərkəzi/ Həkim - neonatoloq
1996 - 2014 - Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim-pediatr
1994 - 1995 - İnternatura/ Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim-pediatr
1988 - 1994 - Azərbaycan Tibb Universiteti / Pediatriya', updated_at = NOW() WHERE slug = 'mina-qocayeva';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
1997-1998 Naxçıvan Muxtar Respublikası, Dövlət Doğum mərkəzində həkim-neonatoloq
1998-2008 Naxçıvan Muxtar Respublikası, Ana və uşaq reabilitasiya Mərkəzində həkim-neonatoloq
2009-ci ildən Mərkəzi Gömrük Hospitalında neonatologiya və pediatriya şöbəsində neonatoloq-pediatr kimi çalışır

Lisenziya və sertifikatlar:
2011. Türkiyə Beynəlxalq Neonatoloji konqresi
2013. Ankara Zəkai Tahir Burak Kadın Sağlığı Eğitim və Araştırma Hastanesi"ndə yenidoğulmuşların reanimasiyası bölümündə 6 aylıq kurs
2013. "Yenidoğulanların reanimasiyası" kursu, Türkiyə, Ankara
2018. Azərbaycan Neonatoloqlarının Beynəlxalq vaxtından əvvəl doğulmuşlar gününə həsr olunmuş elmi praktiki konfrans
2018. Neonatologiya üzrə I Bakı Beynəlxalq və Neonatologiya üzrə Azərbaycan Türkiyə II İntensiv təlim kursu
2019. Pediatrik xəstələrdə və yenidoğulmuşlarda mexaniki ventilyasiyanın tətbiqinə dair təlim. Azərbaycan, Bakı
2019 ATU-nun və Türkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Bakı, Azərbaycan
2023 Azərbaycan Respublikası Səhiyyə Nazirliyi K.Y.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu və Azərbaycan Pediatrlar Assosiasiyasının birgə təşkilatçılığı ilə "Beynəlxalq Vaxtından Əvvəl Doğulan Uşaqlar Günü"nə həsr olunmuş konfrans. Azərbaycan, Bakı şəhəri.
2024. 68-ci Türkiyə Milli Pediatriya Konqresi və 1-ci Beynəlxalq Türkiyə Milli Pediatrlar Dərnəyi Konqresi. Türkiyə, Antalya şəhəri.', updated_at = NOW() WHERE slug = 'minazer-abdullayeva';
UPDATE doctor SET bio = 'Azərbaycan Respublikasının əməkdar həkimi.
spec-17.
MediClub-da 2005-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'mir-huseynov-elcin-oqtay';
UPDATE doctor SET bio = 'Şöbə: Orqan Transplantasiyası

İş təcrübəsi:
2009-2010-cu illərdə İzmir şəhərinin "Kent" xəstəxanasında qaraciyər transplantasiyası proqramı üzrə təlim
2012 Cənubi Koreyanın Seul şəhəri transplantasiyası proqramı üzrə təlim
2012 "Asan Medical Center"-də hepatobiliyar cərrahiyyə və qaraciyər transplantasiyası proqramı üzrə təlim
2008-2018 Dövlət tibb müəssisəsinin Endoskopik cərrahiyyə şöbəsində həkim-cərrah kimi fəaliyyətə başlamış, qısa müddət ərzində Cərrahiyyə və Orqan transplantasiyası şöbəsini yaratmışdır.
2018-ci ildən Mərkəzi Gömrük Hospitalı, Cərrahiyyə və Orqan transplantasiyası şöbəsinin rəisi
2024-cü ildən Mərkəzi Gömrük Hospitalı, Cərrahiyyə və Orqan transplantasiyası şöbəsinin transplantoloqu
Nailiyyətlər və Üstünlüklər
Azərbaycanda ilk dəfə qaraciyər transplantasiyası əməliyyatını uğurla həyata keçirib
Azərbaycanda ilk dəfə uşaqlarda qaraciyər transplantasiyası əməliyyatını uğurla həyata keçirib
Azərbaycanda ilk dəfə pediatrik böyrək transplantasiyası əməliyyatını uğurla həyata keçirib
Milli transplantasiya komandasının formalaşdırılması
2020-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2020-ci ildə Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.
Bu günə qədər 1000-dən çox orqan transplantasiyası əməliyyatını uğurla həyata keçirib. Azərbaycanda icra olunan təkcə böyrək transplantasiyası əməliyyatlarının 90%-i Dr.Mircəlal Kazımi tərəfindən həyata keçirilib.
2025. Orqan donorluğu və transplantasiyası sahəsində müasir Azərbaycan səhiyyə tarixində ilkə imza atılıb. Belə ki, meyit donordan götürülmüş qaraciyər Mərkəzi Gömrük Hospitalında, tibb üzrə fəlsəfə doktoru Mircəlal Kazıminin rəhbərlik etdiyi peşəkar tibbi heyət tərəfindən hepatit B və hepatit D-yə görə qaraciyər sirrozundan əziyyət çəkən, canlı donoru olmayan 12.10.2002-ci il təvəllüdlü Şərifova Mənzər Yaşar qızına köçürülüb.
2026. Azərbaycan Respublikasının Prezidenti cənab İlham Əliyevin imzaladığı "Azərbaycan Respublikasının səhiyyə işçilərinin təltif edilməsi haqqında" Sərəncama əsasən, ölkəmizdə səhiyyə sahəsində uzunmüddətli səmərəli fəaliyyətinə və göstərdiyi xidmətlərə görə Mərkəzi Gömrük Hospitalının Cərrahiyyə və Orqan Transplantasiyası şöbəsinin transplantoloqu, t.ü.f.d., Səhiyyə əlaçısı Kazımi Mircəlal Mirkazım oğlu "Tərəqqi" medalı ilə təltif olunub.
Üzv olduğu təşkilatlar
Transplantasiya Cəmiyyətinin üzvü
Avropa Qaraciyər Nəqli Reyestrinin üzvü
Yaxın Şərq Orqan Transplantasiyası Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'mircelal-kazimi';
UPDATE doctor SET bio = 'Şöbə: Efferent Terapiya

İş təcrübəsi:
2011-2013 Dövlət tibb müəssisəsində, həkim-nefroloq
2013-cü ildən Mərkəzi Gömrük Hospitalı, nefroloq
2018- ci ildən Mərkəzi Gömrük Hospitalı, Efferent Terapiya şöbəsinin rəisi

Lisenziya və sertifikatlar:
2009-2011. Türkiyə 9 Eylül Universitetinin nefrologiya kafedrasında təkmilləşdirmə kursu
2015. Türkiyənin Akdeniz Univerisitetinin Orqan Transplantasiyası Mərkəzində təkmilləşdirmə kursu
2015-ci ildə Türkiyənin Ankara şəhərində XII Beynəlxalq İntensiv Terapiya konqresi
2018. Antalyanın Belek şəhərində Beynəlxalq nefroloji, hipertoniya, dializ və transplantasiya konqresi.
2019. Türkiyənin Ankara şəhərində yerləşən Ankara Tibb Universitetinin Pediatriya xəstəxanasında "Uşaqlarda kəskin və xroniki böyrək çatışmazlığı zamanı periton dializ" mövzusunda təkmilləşdirmə kursu
2019. Türkiyənin Malatya şəhərində yerləşən İnönü Universitetinin Qaraciyər Transplantasiya İnstitutunda hepatorenal sindromlu xəstələrdə ekstrakarporal müalicə üzrə təkmilləşdirmə kursu
2021 Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 Türkiyə Hipertoniya və Böyrək Xəstəlikləri Cəmiyyətinin təşkilatçılığı ilə keçirilən XXIV Milli Hipertoniya və Böyrək Xəstəlikləri Konqresi. Türkiyə, Muğla Dalaman əyaləti.
2025. TƏBİB, Azərbaycan Nefroloqlar Cəmiyyəti, Yeni Klinika və TƏBİB Akademiyasının təşkilatçılığı, Səhiyyə Nazirliyinin İctimai Səhiyyə və İslahatlar Mərkəzinin əməkdaşlığı ilə keçirilən "Nefrologiya və Hemodializ Məktəbi" adlı elmi-praktik konqresdə "Kardioloji risk qrupu xəstələrdə dializ növünün seçimi və parametrlərinin optimallaşdırılması" mövzusunda çıxış edib', updated_at = NOW() WHERE slug = 'mirmensim-memmedov';
UPDATE doctor SET bio = 'Həkim-anestezioloq-reanimatoloq.
MediClub-da 2026-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'miskerli-murad-eldar';
UPDATE doctor SET bio = 'Şöbə: Patomorfologiya

İş təcrübəsi:
2017-ci il tarixindən Mərkəzi Gömrük Hospitalında Həkim-patomorfoloq kimi çalışır

Lisenziya və sertifikatlar:
2017 İstanbul Bezmialem Vakıf Universiteti Tibb fakültəsində Qaraciyər patohistoloji kursu.
2017 İzmir Ege Universiteti Tibb fakültəsi Tiroid sitopatoloji kursu.
2022 Naxçıvan Dövlət Universitetinin, Azərbaycan Tibb Universitetinin, Azərbaycan Endoskopik-Laporoskopik Cərrahlar Cəmiyyətinin təşkilatçılığı ilə keçirilən I Beynəlxalq Tibbi Forum. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri
Üzv olduğu təşkilatlar
2017 Türk Pataloji Dərnəklər Federasiyası', updated_at = NOW() WHERE slug = 'muqabil-sixeliyev';
UPDATE doctor SET bio = 'Həkim uşaq-cərrahı.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'musayev-umud-musa';
UPDATE doctor SET bio = 'Şöbə: Travmatologiya və Ortopediya

İş təcrübəsi:
1995-1998 Ukrayna Respublikasının Mariupol şəhərində həkim travmatoloq-ortoped kimi çalışıb.
2000-2002 Dövlət tibb müəssisəsində travmatoloq-ortoped kimi çalışıb.
2002-2009 Səudiyyə Ərəbistanı Krallığının Bureydah şəhərində yerləşən Bureydah Mərkəzi Hospitalında həkim travmatoloq-ortoped kimi çalışıb.
2009-cu ildən Mərkəzi Gömrük Hospitalı, həkim travmatoloq-ortoped kimi çalışır

Lisenziya və sertifikatlar:
2001 Həkimləri Təkmilləşdirmə İnstitutunda Travmatologiya və Ortopediya ixtisası üzrə 3 aylıq ixtisasartırma kursu
2003 Amerika Cərrahlar kollecinin travma üzrə komitəsinin təlimi
2004-2010 Travmanın bütün səviyyələri üzrə təlim İsveçrə, Malta, Ukrayna
2011-2014 Avstriya-Zalsburq Amerika Cərrahlar kollecinin travma üzrə komitəsinin Oynaq və sümük cərrahiyəsi təlimi
2016 Uşaq ortopediya və travmatologiyası üzrə seminar, Avstriya, Zalsburq
2017 27-ci Millli Türk Ortopediya və Travmatologiya Konqresi
2018 Avropa Ortopediya və Travmatologiya Assisoasiyasının 19-cu konqresi
2021 Türk Travmatoloji Cəmiyyətinin təşkilatçılığı ilə XXX Milli Türk Ortopedik və Travmatoloji konqresi. Türkiyə, Antalya şəhəri.
2022 "Bud-çanaq və diz artroplastikasında aktual problemlər" III Beynəlxalq kurs seminarı. Azərbaycan, Bakı şəhəri
2023 Türk Ortopediya və Travmatologiya Dərnəyinin təşkilaşçılığı ilə keçirilən32-ci Ümummilli Türk Ortopediya və Travmatologiya Konqresi. Türkiyə, Antalya.
2024 33-cü Milli Türk Ortopediya və Travmatologiya Konqresi. Türkiyə, Antalya şəhəri.
Üzv olduğu təşkilatlar
Səudiyyə Ərəbistanı Tibb Assosiyasiyası
Avropa "AO. Spine" Cəmiyyəti', updated_at = NOW() WHERE slug = 'museyib-ehmedov';
UPDATE doctor SET bio = 'Həkim-stomatoloq (terapevt, uşaq stomatoloqu).
MediClub-da 2007-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'museyibova-kemale-fexreddin';
UPDATE doctor SET bio = 'Haqqında:
2022 - bugünədək Sağlam Ailə Ultralab klinikası / Həkim-endokrinoloq
2021 - 2022 - K.Y.Fərəcov adına Elmi-Tədqiqat İnstitutu / Həkim-endokrinoloq
2009 - 2021 - 6 Saylı Şəhər Klinik Uşaq Xəstəxanası / Həkim-endokrinoloq
2008 - 2009 - 6 Saylı Şəhər Klinik Uşaq Xəstəxanası / İnternatura
2001 - 2008 - Azərbaycan Tibb Universiteti / Pediatriya', updated_at = NOW() WHERE slug = 'nabat-agayeva';
UPDATE doctor SET bio = 'Həkim-travmatoloq.
MediClub-da 2007-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'nadirov-namiq-sefqulu';
UPDATE doctor SET bio = 'Şöbə: Laboratoriya ISO 15189:2012

İş təcrübəsi:
2008-2020 Dövlət və özəl tibb müəssisələrində həkim laborant.
2020-ci ildən etibarən Mərkəzi Gömrük Hospitalında həkim-laborant kimi fəaliyyət göstərir.

Lisenziya və sertifikatlar:
2021 Azərbaycan Tibb Universitetinin Tədris Terapevtik Klinikasının təşkilatçılığı ilə keçirilən "Süni intellektə əsaslanan mikrobiom analizi" mövzusunda simpozium
2022. "SARS-COV-2 (COVID-19) diaqnostikasına müasir yanaşma və problemlər" mövzusunda konfrans
2022 Azərbaycan Respublikası Dövlət Təhlükəsizliyi Xidmətinin Hərbi Tibb Baş İdarəsi və Dövlət Gömrük Komitəsi Tibbi Xidmət İdarəsinin birgə təşkilatçılığı ilə keçirilən "SARS-CoV-2 (COVID-19) kompleks diaqnostikasına müasir yanaşmalar" mövzusunda beynəlxalq elmi konfrans', updated_at = NOW() WHERE slug = 'naibe-eliyeva';
UPDATE doctor SET bio = 'Şöbə: Endokrinologiya

İş təcrübəsi:
2012-2016-ci illərdə dövlət tibb müəssisəsində həkim-endokrinoloq kimi çalışıb.
2016-cı ildən Mərkəzi Gömrük Hospitalı, həkim-endokrinoloq

Lisenziya və sertifikatlar:
2012 "Endokrin patologiyalı xəstələrdə hamiləliyin planlaşdırılması və aparılması" kursu, Rusiya, Moskva
2014 II EASD ixtisas artırma kursu, Azərbaycan, Bakı
2015 Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu Sertifikasiya kursları
2019 Ege Universiteti Xəstəxanasında endokrinologiya sahəsi üzrə təkmilləşdirmə kursu. Türkiyə, İzmir
2020 Azərbaycan Endokrinologiya, Diabet və Terapevtik Təlimat Assosiasiyası, Azərbaycan Endokrinoloqlar Elmi Cəmiyyəti və Azərbaycan Diabet Cəmiyyətinin birgə təşkilatçılığı ilə onlayn keçirilən III Azərbaycan Diabet konqresi. Azərbaycan, Bakı. Onlayn.
2021 Türkiyə Tiroid Cəmiyyətinin təşkilatçılığı ilə keçirilən IX Türkiyə Tiroid xəstəlikləri üzrə onlayn konqres.
2022 Türkiyə Endokrinoloji və Metabolizma Dərnəyinin təşkilatçılığı ilə keçirilən 43-cü Endokrinoloji və Metabolik Xəstəliklər konqresi, Türkiyə, Antalya
2022 Türkiyənin Hacettepe Universitetinin Tibb Fakültəsi və Türkiyə Ege Universiteti Tibb Fakültəsinin, Türkiyə Diabet Cəmiyyətinin, Türkiyə Uşaq Endokrinoloji və Diabet Dərnəyinin təşkilatçılığı keçirilən IV Diabet Texnologiyaları Simpoziumu. Türkiyə, Ankara şəhəri.', updated_at = NOW() WHERE slug = 'naide-novruzova';
UPDATE doctor SET bio = 'Həkim-anestezioloq-reanimatoloq.
MediClub-da 2018-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'namazova-kemale-novruz';
UPDATE doctor SET bio = 'İş təcrübəsi:
Həkim-interna, Bakı şəhər Onkoloji Dispanseri (1984-1985)
Onkoloq-cərrah, Şamaxı rayon Mərkəzi Xəstəxanası (1985-1988)
Klinik ordinator, Ümumittifaq Elmi Onkologiya Mərkəzi, baş və boyun şöbəsi (1988-1990)
Baş laborant, Azərbaycan Dövlət Təkmilləşdirmə İnstitutu, Onkologiya kursu ilə cərrahiyyə kafedrası (1991-1992)
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1992-2002)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2003-2008)
Professor, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2008-hal-hazıradək)

Təlimlər:
Qırtlaq xərçənginin orqansaxlayıcı müalicəsi (1999-2000)
Baş və boyun xərçənginin rekonstruktiv plastik cərrahiyyəsi (2001-2002)
Baş-boyun rekonstruktiv-plastik cərrahiyyəsi (2005)
Ağız boşluğu və qırtlaq xərçənginin cərrahi müalicəsi (2011)
Ağız boşluğu xərçənginin plastik cərrahiyyəsi (2015)
Baş-boyun şişlərinin mikrocərrahi təlim kursu (2015)

Üzvlük:
İnternational Federatiov of Head and Neck Oncologic (İFHNOS)
Euroasian Society of Head and Neck Oncology', updated_at = NOW() WHERE slug = 'namiq-emireliyev';
UPDATE doctor SET bio = 'Şöbə: Qastroenterologiya

İş təcrübəsi:
1998-2003 Müxtəlif dövlət müəssisələrində ümumi cərrah vəzifəsində çalışıb
2003-2007 Rusiya, N.V. Sklifosovski adına Moskva şəhər Elmi Tədqiqat Təcili Yardım İnstitutunda ümumi cərrah vəzifəsində çalışıb
2009 Mərkəzi Gömrük Hospitalı, həkim cərrah
2013 Mərkəzi Gömrük Hospitalı, Cərrahiyyə şöbəsinin rəisi
Nailiyyətlər və Üstünlüklər
Cərrahiyyənin müxtəlif sahələrini əhatə edən 50-dən artıq elmi məqalənin və 1 kitabın müəllifidir. Ümumi cərrahiyyə, Laparoskopik cərrahiyyə, Transplantasiya və İnvaziv Endoskopiyanı əhatə edən geniş çeşidli diaqnostik və cərrahi əməliyyatlar üzrə ixtisaslaşmışdır
2020-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2024 Ümumi Cərrahiyyə şöbəsinin rəisi, ümumi cərrah Namiq Novruzov Heydər oğlu Gömrük orqanlarında səmərəli fəaliyyətinə görə "Dövlət qulluğunda fərqlənməyə görə" medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2006 Moskva Meriyası Tibb Xidməti Endoskopik Cərrahiyyə Mərkəzi, Qarın boşluğu və çanaq üzvlərinin Endoskopik Cərrahiyyəsi Kursu, Rusiya, Moskva
2008 İ.M.Seçenov adına Moskva Tibb Universiteti, Laparoskopik Cərrahiyyə Kursu, Rusiya, Moskva
2010 Ankara Universiteti Tibb fakültəsi, Alt və Üst endoskopiya və ERCP prosedurları kursu
2010 Ankara Universiteti Tibb fakültəsi 4-cü qabaqcıl ERCP kursu, Türkiyə, Ankara
2011 Laparoskopik yırtıq cərrahiyyəsi kursu, Türkiyə, Istanbul
2012 Açıq və laparoskopik yırtıq cərrahiyyəsi kursu, Türkiyə, Istanbul
2012-2013 Malatya İnönü Universiteti, Qaraciyər Transplantasiyası Türkiyə, Malatya
2018 1st İnternational Transplant Network (İTN) Rixos Sungate Hotel, Antalya, Türkiyə
2019 XVIII Beynəlxalq Avrasiya Cərrahlar və Qastroenteroloqlar konqresi, Azərbaycan, Bakı
2019 Ümumdünya Qastroenteroloji konqresi. Türkiyə, İstanbul
2020 Amerika Avstriya Fondu tərəfindən təşkil edilmiş "Mədə-bağırsaq xərçəngi" seminarı. Zalsburq şəhəri, Avstriya.
2022 Türkiyə Cərrahlar Cəmiyyətinin təşkilatçılığı keçirilən XXII Beynəlxalq Cərrahiyyə konqresi, Türkiyə, Antalya
2026 Azərbaycan Səhiyyə nazirliyinin təşkilatçılığı ilə keçirilən III Beynəlxalq Türkdilli Ölkələrin Tibb Konqresi və Endoforum 2026-nın "Endoskopik və Laparoskopik Cərrahiyyə Kursu" çərçivəsində "Laparoskopik xoledox eksplorasiyası" mövzusunda məruzə ilə çıxış edib. Azərbaycan, Bakı şəhəri.
Üzv olduğu təşkilatlar
Türk Cərrahi Dərnəyi
İFSO (The International Federation for the Surgery of Obesity and Metabolic Disorders)
Azərbaycan Bariatrik-Metabolik Cərrahlar Assosiasiyası
Azərbaycan Cərrahlar Birliyi
Elmi yazılar və Məqalələr
Namiq Novruzovun elmi yazı və məqalələrinə baxmaq üçün bura daxil olun
İCRA ETDİYİ ƏMƏLİYYATLAR
"28 həftəlik hamiləlik zamanı laparoskopik appendektomiya"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
16 AVQUST 2018
"Retrosekal appendiksin laparoskopik çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
27 YANVAR 2018
"Çətin laparoskopik xolesistektomiya"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
8 OKTYABR 2017
"Route-en-Y qastrik bypass (arıqlama əməliyyatı)"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
12 MART 2017
"Mədə kiçiltmə
əməliyyatı"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
24 SENTYABR 2017
"Böyrəküstü vəzin laparoskopik çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
12 YANVAR 2019
"Qaraciyər Exinokokk kistinin laparoskopik drenlənməsi"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
10 NOYABR 2018
"Mədə perforatik dəliyinin laparoskopik tikilməsi"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
30 SENTYABR 2018
"Dalağın laparoskopik yolla çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
26 MAY 2017
"Laparoskopik qasıq yırtığı
təmiri"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
21 İYUN 2019
"Öd yollarından daşların laparoskopik çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
3 MART 2017
"Erofaqus varikozlarının elastik həlqələnməsi"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
3 DEKABR 2017
"Diafraqmal yırtıqların laparoskopik təmiri"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
3 MAY 2019
"Mekkel divertikulun laparoskopik çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
1 İYUL 2019
"Qida borusu yad cismin
çıxarılması"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
28 AVQUST 2016
"Laparoskopik yoğun bağırsaq rezeksiyası"
Dr. Namiq Novruzov
t.f.d., ümumi-cərrah
7 YANVAR 2016
HƏKİMƏ RƏYİNİZİ BİLDİRİN!', updated_at = NOW() WHERE slug = 'namiq-novruzov';
UPDATE doctor SET bio = 'Şöbə: Radiologiya

İş təcrübəsi:
2000-2017 Müxtəlif dövlət və özəl tibb müəssisələrində həkim-rentgenoloq
2017-ci ildən Mərkəzi Gömrük Hospitalında həkim-rentgenoloq kimi çalışır

Lisenziya və sertifikatlar:
2001 Əziz Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu
həkim-rentgenoloq
2013 Əziz Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu
həkim-rentgenoloq', updated_at = NOW() WHERE slug = 'nataliya-astraxanseva';
UPDATE doctor SET bio = 'Ürək-damar cərrahı.
Elmi dərəcə: Tibb üzrə fəlsəfə doktoru, PhD

İş təcrübəsi:
2009-2012 Mərkəzi Neftçilər xəstəxanasında ürək-damar cərrahı vəzifəsində fəaliyyət göstərib
Respublika Diaqnostika Mərkəzində ürək-damar cərrahı vəzifəsində çalışır - 2012-ci ildən bu günədək
Üzvlük:
Minimal invaziv ürək cərrahiyyəsi beynəlxalq cəmiyyəti- ISMICS
Avropa Kardio-Torakal Cərrahiyyə Assosiasiyası- EACTS
Azərbaycan Ürək-Damar Cərrahiyyəsi Cəmiyyəti- AÜDCC
İcra etdiyi cərrahi əməliyyatlar:
Minimal invaziv ürək əməliyyatları - 5-7 sm-lik kiçik kəsiklə və döş sümüyünü kəsmədən qabırğa arasından koronar, qapaq və anadangəlmə ürək qüsuru əməliyyatları
Aorta-koronar şuntlama (ürəyin tac damarları üzərində əməliyyatlar)
Ürək qapaq əməliyyatları (protezləşdirmə və plastika)
Aorta üzərində əməliyyatlar (anevrizma və disseksiyaların cərrahiyyəsi)
Böyüklərdə anadangəlmə ürək qüsuru əməliyyatları (12 yaşdan yuxarı)
Yuxu arteriyası üzərində əməliyyatlar (karotis arteriya cərrahiyyəsi).', updated_at = NOW() WHERE slug = 'natiq-mirzeyev';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2010-2016 Müxtəlif özəl tibb müəssisələrində həkim-neonatoloq kimi çalışıb.
2017- ci ildən Mərkəzi Gömrük Hospitalında həkim-neanotoloq kimi çalışır

Lisenziya və sertifikatlar:
2011 Türçesi Eğitim Öğretim mərkəzi, pediatriya sahəsi üzrə kurs, Azərbaycan, Bakı şəhəri
2012 Acıbadem Hospitals, Neonatologiyada intensiv terapiya və reanimasiya kursu, Türkiyə, İstanbul
2019 ATU-nun və Türkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'nazile-huseynova';
UPDATE doctor SET bio = 'Şöbə: Terapiya

İş təcrübəsi:
1992-2015 Dövlət və özəl tibb müəssisələrində həkim-terapevt kimi çalışıb
2016-cı ildən Mərkəzi Gömrük Hospitalı, həkim terapevt-qastroenteroloq
Nailiyyətlər və Üstünlüklər
2021-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.

Lisenziya və sertifikatlar:
1998 İlk tibbi yardım kursları. İsveçrə, Zalsburq
2000 "İlk tibbi yardım" üzrə kurs, Avstriya, Zalsburq
2001 "Daxili xəstəliklər" üzrə kurslar, Türkiyə, İstanbul
2011 Daxili xəstəliklər" üzrə kurslar, Türkiyə, İstanbul', updated_at = NOW() WHERE slug = 'nazile-xelilbeyova';
UPDATE doctor SET bio = 'Həkim-laborant, bakterioloq.
MediClub-da 2008-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'nebiyeva-sefeq-fazil';
UPDATE doctor SET bio = 'Neyrocərrah, həkim-nevroloq, kliniki psixoloq.
MediClub-da 2023-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'necefbeyli-nigar-valid';
UPDATE doctor SET bio = 'Qastroenteroloq.

İş təcrübəsi:
2019-cu ildən bu günədək Respublika Diaqnostika Mərkəzində həkim-qastroenteroloq vəzifəsində çalışır', updated_at = NOW() WHERE slug = 'nemet-melikov';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
1994-2002 M.Qədirli adına Mərkəzi Hövzə Xəstəxanasının Təcili Yardım şöbəsi, həkim
2006-2007 Özəl Tibb müəssisəsində həkim təlimçi.
2007-2009 Özəl tibb müəssisəsində həkim ekspert, şöbə müdiri.
2002-2003 Səudiyyə Ərəbistanı Krallığının Əl-Baha şəhərində Al Baha İlk Tibbi Yardım Mərkəzində şöbə müdiri.
2003-2006 Al Baha şəhəri Əl Dəfir Mərkəzi Təcili Yardim hospitalında şöbə müdiri.
2006 S.Ə.Krallığı Mina şəhəri mərkəzi xəstəxanasında həkim.
2009-2021 Mərkəzi Gömrük Hospitalında Təcili yardım həkimi.
2021-2023 Təcili Yardım şöbəsinin rəisi.
2023- Mərkəzi Gömrük Hospitalında Təcili yardım həkimi.
Nailiyyətlər və Üstünlüklər
2005-ci ildə Əl Baha reqionu üzrə ilin ən yaxşı həkimi secilib.
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2010 Weiss Memorial Hospital təcili yardim kursu, Amerika Birləşmiş Ştatları, Çikaqo
2013 Zalsburq Universitet Hospitalında travmatoloji yardım üzrə təcrübə proqramı. Avstriya, Zalsburq
2018 "Qadın sağlamlığı" Beynəlxalq konfrans. Gürcüstan, Tbilisi
2025. Grigol Robakidze Universitetinin təşkilatçılığı ilə keçirilən Ümumdünya Sağlamlıq Konqresi (Global Health Congress: Health Horizons).. Gürcüstan, Tbilisi şəhəri', updated_at = NOW() WHERE slug = 'nergiz-kerimova';
UPDATE doctor SET bio = 'Haqqında:
2022 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Mama-ginekoloq
2012 - bugünədək Turan klinikası / Həkim-ginekoloq
2007 - 2012 - Xəzər klinikası / Həkim-ginekoloq
2006 - 2008 - 4 Saylı qadın məsləhətxanası / Ginekoloq
2002 - 2003 - Azərsutikinti / Həkim-interna
12.04.2021 - № AH 039405 Sertifikasiya Şəhadətnaməsi / Mamalıq-ginekologiya
2003-2005 - (ordinatura) Sibir Dövlət Tibb Universiteti / Həkim-ginekoloq ixtisası üzrə tam kursu bitirmiş
1996-2002 - Azərbaycan Tibb Universiteti / Müalicə işi ixtisası üzrə bakalavr pilləsini bitirmiş', updated_at = NOW() WHERE slug = 'nergiz-qurbetova';
UPDATE doctor SET bio = 'Həkim-anestezioloq-reanimatoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'nesibova-esmira-mirze';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi

İş təcrübəsi:
2006-2011 Müxtəlif dövlət tibb müəssisələrində
həkim-revmokardioloq, pediatr
2011-2015 Türkiyə Cümhuriyyəti Kocaeli Universiteti Uşaq kardiologiyası şöbəsində pediatrik kardioloq ixtisası üzrə təkmilləşdirmə kursu
2015-2018 Dövlət tibb müəssisəsində həkim-kardioloq
2019-cu ildən Mərkəzi Gömrük Hospitalında həkim kardioloq kimi çalışır

Lisenziya və sertifikatlar:
2011 Əziz Əliyev adına ADHTİ, kardiologiya ixtisası üzrə sertifikasiya kursu ​​​​​​​
2014 Türkiyə Cumhuriyyəti İstanbul Mehmet Akif Ersoy Göğüs və Kalp Damar cərrahiyyəsi Eğitim Araşdırma Xəstəxanasının uşaq kardiologiyası şöbəsində pediatrik kardioloq ixtisası üzrə təkmilləşdirmə kursu
2015 Acıbadem Üniversiteti Atakent xəstəxanası Uşaq kardiologiyası şöbəsində pediatrik kardioloq ixtisası üzrə təkmilləşdirmə kursu
2018 XVII Beynəlxalq Uşaq Kardiologiyası və Ürək Cərrahiyyəsi konfransı
2019 XVIII Beynəlxalq Uşaq Kardiologiyası və Ürək Cərrahiyyəsi konfransı Türkiyə, İstanbul
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyəti
Türk Kardiologiya Dərnəyi
Türkiyə Pediatrik Kardioloji və Ürək Cərrahiyyəsi Dərnəyi', updated_at = NOW() WHERE slug = 'nesimi-cabbarov';
UPDATE doctor SET bio = 'İş təcrübəsi:
Baş laborant, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu, Onkologiya kafedrası (1974-1976)
Assistent, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutu Onkologiya kafedrası (1976-1988)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1988-hal-hazıradək)
Universitet Partiya Təşkilatının katibinin müavini, katibi, N. Nərimanov adına Azərbaycan Dövlət Tibb İnstitutunun partiya təşkilatı. (1987-1992)
Tədris şöbə müdiri, Azərbaycan Tibb Universiteti (1992-hal-hazıradək)
Baş həkim, ATU-nun Onkoloji klinikası (2007-hal hazıradək)

Təlimlər:
İxtisasartırma, Onkologiyanın müasir problemləri (1980)
İxtisasartırma, Onkologiyanın müasir problemləri (1990)

Üzvlük:
Azərbaycan Onkoloqlar Cəmiyyəti, 1974-cü ildən etibarən
ESMO-nun üzvü 2008-ci ildən etibarən', updated_at = NOW() WHERE slug = 'nesimi-qasimov';
UPDATE doctor SET bio = 'Həkim-cərrah.
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'nezirov-rufet-balaqardas';
UPDATE doctor SET bio = 'Uzman fizioterapevt-reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

İş təcrübəsi:
2021- Azərbaycan Respublika Diaqnostika Mərkəzi: Təcrübəçi fizioterapevt
2022- İzmir Hatay Fizioterapiya Müailə Mərkəzi: Təcrübəçi Fizioterapevt
2022-Manisa Hafsa Sultan Dövlət Xəstəxanası: Təcrübəçi fizioterapevt
2023- Koreya Şərq Təbabəti Klinikası: Fizioterapevt
2024-2025 - Yeni Klinika- Uzman Fizioterapevt ( Davam edir)', updated_at = NOW() WHERE slug = 'nezrin-esedli';
UPDATE doctor SET bio = 'Mama-ginekoloq.

İş təcrübəsi:
2011-2015 Medilux Klinikası, mama-ginekoloq
2015-2018 Caspian İnternational Hospital, mama-ginekoloq
2018-2022 Baku Medical Plaza klinikası, mama-ginekoloq
2022-2024 Leyla Medical Center, mama-ginekoloq
Hal-hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'nigar-esgerova';
UPDATE doctor SET bio = 'Uzman klinik psixoloq.
Şöbə: Terapiya', updated_at = NOW() WHERE slug = 'nigar-eyvazova';
UPDATE doctor SET bio = 'İş təcrübəsi:
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2006-2010)
II cərrahiyyə şöbəsinin müdiri, bölmə rəhbəri, ATU-nun Onkoloji klinikası (2007 hal-hazıradək)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2010 hal-hazıradək)

Təlimlər:
Süd vəzisinin onkoplastikası və rekonstruktiv cərrahiyyəsi (16-23.11.2015)
Реконструктивная пластика молочной железы (9-11.03.2016)

Üzvlük:
NCCN
ESMO', updated_at = NOW() WHERE slug = 'nigar-mehdiyeva';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2011-2014. Azərbaycan Tibb Universiteti II Mamalıq-ginekologiya kafedrasında Mamalıq-ginekologiya üzrə təcrübə kursu.
2011 Türkiyə-Almaniya Ginekoloji Təhsil və Araşdırma Fondunun təşkilatçılığı ilə "IX Türkiyə-Almaniya Ginekoloji konqresi". Türkiyə, Antalya.
2022 ci ildən Mərkəzi Gömrük Hospitalında ginekoloq kimi fəaliyyət göstərir.
Nailiyyətlər və Üstünlüklər
Vahid və funksional tibb həkimi

Lisenziya və sertifikatlar:
2014 Türkiyə-Almaniya Ginekoloji Təhsil və Araşdırma Fondunun təşkilatçılığı ilə "X Türkiyə-Almaniya Ginekoloji konqresi". Türkiyə, Antalya.
2021 Türkiyə Funksional Tibb Akademiyasının təşkilatçılığı ilə "Qadın hormonunda düzənsizlik və hormon yerinə qoyma müalicəsi" kursu. Türkiyə, İzmir şəhəri.
2021 Türkiyə Funksional Tibb Akademiyasının təşkilatçılığı ilə "Detoksifikasiya və neyro-koqnitiv problemlər" kursu. Türkiyə, İstanbul şəhəri.
2022 Türkiyə Funksional Tibb Akademiyasının təşkilatçılığı ilə "Tiroid, kişi hormonları və stresin idarəedilməsi" kursu. Türkiyə, Antalya şəhəri.
2022 Türkiyə Vahid Tibb məktəbinin təşkilatçılığı ilə "Tətbiqi vahid tibb məktəbi" proqramı. Türkiyə, İstanbul şəhəri.
2022 Türkiyə Vahid tibb məktəbinin təşkilatçılığı ilə Ш Vahid Tibb konqresində iştirak edib. Türkiyə, Antalya şəhəri.
2022 Türkiyə Vahid Tibb Dərnəyinin təşkilatçılığı ilə Karaköydəki klinikasında keçirilən "Klinik Ozonterapiya" mövzusunda təlimdə iştirak edib. Türkiyə, İstanbul şəhəri.
Üzv olduğu təşkilatlar
Funksional Tibb Akademiyası', updated_at = NOW() WHERE slug = 'nigar-memmedova';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2014-2015 Müxtəlif tibb müəssisələrində, həkim-pediatr
2016-cı ildən Mərkəzi Gömrük Hospitalında pediatr kimi çalışır
Lisenziyalar və Sertifikatlar
2017 Türkiyə Milli Pediatriya Cəmiyyətinin "Uşaqlarda qidalanma" kursu, Türkiyə, Antalya
2017 Türkiyə Milli Pediatriya Cəmiyyətinin 61-ci Pediatriya konqresi, Türkiyə, Antalya
2019 Neonatologiya üzrə Azərbaycan-Türkiyə 3-cü Beynəlxalq Təlim kursu, Azərbaycan, Bakı
2019 Azərbaycan Tibb Assosiasiyasının Pediatriya Dərnəyinin IX simpoziumu
"Pediatriyada yeniliklər"
2019 Yeditepe Üniversitesi Hastanesində pediatriya sahəsi üzrə təkmilləşdirmə kursu', updated_at = NOW() WHERE slug = 'nigar-mirzeyeva';
UPDATE doctor SET bio = 'Şöbə: Diaqnostika

İş təcrübəsi:
1992-2009 Dövlət tibb müəssisəsində Müalicə-profilaktika şöbəsinin müdiri
2007-2009 Özəl tibb müəssisəsində, Funksionalist-kardioloq
2009-ci ildən Mərkəzi Gömrük Hospitalı, funksionalist-kardioloq

Lisenziya və sertifikatlar:
2001 Kliniki kardiologiyada funksional diaqnostika üzrə ümümi təkmilləşmə kursu
2004 Kliniki elektrokardioqrafiya üzrə tematik təkmilləşmə kursu
2007 Respublika müalicəvi Diaqnostika Mərkəzində ürək-damar sisteminin tədqiqatlari üzrə I funksional diaqnostika şöbəsində işci yerində "Exokardioqrafiya" metodu ilə praktiki və nəzəriyyə kursu
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.', updated_at = NOW() WHERE slug = 'nigar-rehmetova';
UPDATE doctor SET bio = 'Həkim-oftalmoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'novruzova-aynur-valeh';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2012-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'novruzova-go-vher-serxan';
UPDATE doctor SET bio = 'Həkim-pediatr, Təcili yardım xidmətinin həkimi-pediatrı.
Həkim-pediatr.
MediClub-da 2011-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'nuriyeva-kemale-aqil';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi

İş təcrübəsi:
2018 - ci ildən Mərkəzi Gömrük Hospitalında ürək-damar cərrahı kimi çalışır

Lisenziya və sertifikatlar:
2014 "Mitral qapaq təmiri kursu" adlı konfrans, Azərbaycan, Bakı
2019 "Bakı Ürək Günləri" VI Beynəlxalq konqres
2025. Qazaxıstan Səhiyyə Nazirliyinin təşkilatçılığı ilə "Struktur ürək xəstəlikləri" üzrə II Beynəlxalq Sammit. Qazaxstan, Astana şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Assosiasiyasının üzvü
Avropa Kardiologiya Assosiasiyasının üzvü', updated_at = NOW() WHERE slug = 'nurlan-mahmudov';
UPDATE doctor SET bio = 'Həkim-stomatoloq.
spec-17.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'obeydat-inas-vail';
UPDATE doctor SET bio = 'Haqqında:
2010 - bugünədək Sağlam Ailə Tibb Mərkəzi / həkim mama ginekoloq
2012 Sertifikasiya / mama ginekoloq üzrə
1995 Ailə Sağlamlıq Mərkəzi / həkim mama ginekoloq
1985 Ailə və nigah məsləhətxanası / həkim mama ginekoloq
1979 - 1985 Nasosnu adına sahə xəstəxanası / həkim mama ginekoloq
1978 - 1979 Doğum evi / həkim mama ginekoloq
1978 - 1979 İnternatura Qazaxıstan Tibb Universiteti
1972 - 1978 Aktyubin Dövlət Tibb Universiteti / müalicə işi', updated_at = NOW() WHERE slug = 'olqa-akcurina';
UPDATE doctor SET bio = 'Cərrah, Mama-Ginekoloq.

Fəaliyyət sahələri:
QSQ (boruların yoxlanılması)
Eroziyanın müalicəsi və yandırılması
Polipin çıxarılması
Uşaqlıq boynunun biopsiyası
Kandilomaların yandırılması
Bartolinit vəzinin müalicəsi və əməliyyatı
Kolposkopiya
HPV, PAP Smear və digər yaxmaların götürülməsi
HPV-yə qarşı peyvənd
Cinsi xəstəliklərin müalicəsi
Hiperplaziyanın müalicəsi
Diaqnostik qaşınma
Klimakterik dövrün idarə olunması
Spiralin qoyulması və çıxarılması
Nexplanon implantının qola yerləşdirilməsi
Medikamentoz abort
Hamiləlik və doğuşların aparılması: riskli hamiləlik, normal doğuş və qeysəriyyə əməliyyatı
Sonsuzluğun müalicəsi
Genital estetik cerrahiyyə (vaginoplastika, labioplastika) və digər əməliyyatlar
Qeyri-cərrahi prosedurlar ( PRP, intim doğular, intim ağartma, lazer vaginal daralma)

Konfranslar:
2013 - Vyana, Avstriya - COGI Konqresi
2014 - Florensiya, İtaliya - 16th World Congress of Gynecological Endocrinology
2014 - Paris, Fransa - COGI Konqresi
2015 - İstanbul, Türkiyə - Uşaqlıq boynunun patologiyası və kolposkopiya seminarı
2016 - Moskva, Rusiya - "Мать и Дитя" Konqresi
2019 - İzmir, Türkiyə - Minimal invaziv ginekoloji cərrahiyyə konqresi
2023 - Roma, İtaliya - CYNITALI Konqresi
2024 - Dubay, BƏƏ - EndoDubai (Dəvət Məktubu)
2024 - Marsel, Fransa - ESGE Beynəlxalq Konqresi', updated_at = NOW() WHERE slug = 'op-dr-afet-tagiyeva';
UPDATE doctor SET bio = 'Uroloq-Androloq.

Fəaliyyət sahələri:
Pediatrik Urologiya
Xayaların enməməsi (kriptorxizm)
Hipospadiya - Sidik kanalının anadangəlmə yerləşmə pozuntusu
PUV (Posterior uretral valv) - Oğlan uşaqlarında sidik kanalının daralması və sidik axınının pozulması
Böyrək, sidik axarları, sidik kisəsi və prostat vəzinin şişləri - Erkən diaqnostika, əməliyyat və multidissiplinar müalicə yanaşması
Sidikçıxarıcı sistemdə daş xəstəliklərinin müayinə və müalicəsi
Daşların konservativ müalicəsi - Qidalanma, dərman və həyat tərzi dəyişiklikləri ilə yanaşma
Endoskopik/lazer üsulu ilə cərrahi müalicə - Böyrək, sidik axarı və sidik kisəsindəki daşların minimal invaziv yolla çıxarılması
Endoskopik və laparoskopik uroloji əməliyyatlar
Prostat vəzinin xoşxassəli hiperplaziyası - Açıq və qapalı (TURP) üsullarla müalicə
Laparoskopik əməliyyatlar - Böyrək kisti, hidronefroz və böyrəyin çıxarılması kimi hallarda minimal invaziv cərrahiyyə
Mikroskopik varikoselektomiya - Varikoselenin yüksək dəqiqliklə cərrahi müalicəsi
Sidik-cinsiyyət orqanlarının iltihabi xəstəliklərinin müayinə və müalicəsi
Kəskin və xroniki infeksiyalar - Böyrək, sidik axarları, sidik kisəsi, sidik kanalı, testis, prostat vəz və seminal vezikulun iltihabları
Cinsi yolla keçən infeksiyalar - Laborator diaqnostika və müasir müalicə protokolları
Androloji problemlər və kişi sağlamlığının dəyərləndirilməsi
Erektil disfunksiya (cinsi zəiflik) - Hormonal, psixoloji və damar mənşəli səbəblərin qiymətləndirilməsi
Erkən eyakulyasiya (boşalma) - Tərəfli yanaşma və medikamentoz müalicə
Kişi sonsuzluğu - Spermoqramma, hormonal analizlər və uroandroloji dəyərləndirmə
Sidik ifrazı ilə bağlı problemlərin müayinə və müalicəsi
Sidik saxlamama (inkontinensiya)
Hiperaktiv sidik kisəsi - Gündüz və gecə tez-tez sidiyə getmə, təcili tələbat hissi kimi halların diaqnostika və müalicəsi

Konfranslar:
2015-ci il "Cadaveric Model Retrograde İntrarenal Surgery For Stone Disease" Kursu, Türkiyə Ankara
2016-cı il Gazi Universitesi, "Androloji tetkikler Güncelleme kursu" Türkiyə, Ankara
2016-cı il Uroonkologiya kursu, Gülhanə Hərbi Tibb Akademiyası, Türkiyə, Ankara
2017-ci il "Pediatrik Urologiya və Andrologiya kursu, Gülhanə Hərbi Tibb Akademiyası, Türkiyə, Ankara
2019-cu il "Uroloji xəstəliklərin radioloji diaqnostikası", Rusiya Federasiyası, Sankt-Peterburq
2020-ci il "Böyrək daşı xəstəliyi müalicəsində müasir yanaşma" Rusiya Federasiyası, S.Peterburq
2022-ci il American Language Course (Amerikalı təlimçilərlə ABŞ səfirliyinin təşkil etdiyi kurs)', updated_at = NOW() WHERE slug = 'op-dr-anar-almasov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Açıq və qapalı (laparoskopik) üsulla yırtıq əməliyyatları
Enməmiş xaya (kriptorxizm)
Hidrosel (xayalıq su yığılması)
Sünnət (sirkumzisiya)
Sünnət xətalarının korreksiyası
Hipospadiya (anadangəlmə sidik kanalının inkişaf qüsuru)
Laparoskopik appendektomiya
Laparoskopik xolesistektomiya
Uşaqlarda endoskopiya və kolonoskopiya
Döş qəfəsi və qarın boşluğu xəstəliklərinin açıq və qapalı üsulla cərrahi müalicəsi
Böyrək və sidik yollarının daralma (stenoz) və genişlənmələri (dilatasiya)
Qəbizlik (konstipasiya)
Sidik qaçırma (inkontinensiya)

Konfranslar:
34. Ulusal Çocuk Cerrahisi Kongresi, 26-30 Oktyabr 2016, Girne, KKTC
7. Ulusal Pediatrik Üroloji Kongresi, 26-30 Oktyabr 2016, Girne, KKTC
8. Ulusal Pediatrik Üroloji Kongresi, 25-28 May 2017, Antalya
9. Ulusal Pediatrik Üroloji Kongresi, 3-6 May 2018, Adana
1. International Transplant Network Congress, 17-21 Oktyabr2018, Antalya
10. Ulusal Pediatrik Üroloji Kongresi, 16-19 May 2019, Samsun
37. Ulusal Çocuk Cerrahisi Kongresi, 15-19 Oktyabr 2019, Ankara
Hipospadiasta güncel yaklaşımlar sempozyumu, 20 Dekabr, Ankara
40. Ulusal Çocuk Cerrahisi Kongresi, 26 - 29 Oktyabr 2023, Ankara
1. Azərbaycanda Uşaq Cərrahiyəsi günləri, 17 - 18 May 2024, Bakı
3. Bakı Beynəlxalq Uşaq Urologiyası Konfransı 12 Sentyabr 2025, Bakı
Uşaqlarda koloproktoloji patologiyalara müasir yanaşma 30 Yanvar 2026, Bakı', updated_at = NOW() WHERE slug = 'op-dr-anar-qurbanov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Qulaq Burun Boğaz cərrahı, VNG üzrə mütəxəssis.

Fəaliyyət sahələri:
Septoplastika
Radiofrekans tətbiqi
Paratonzilyar absesin yarılması
Konxotomiya
Funksional Endoskopik
Sinus Cərrahiyyəsi
Burun sümüklərinin repozisiyası
Adenoidektomiya
Tonzillektomiya
Ventilyasiya boru taxılması
Burundan və qulaqdan yad cismin çıxarılması', updated_at = NOW() WHERE slug = 'op-dr-aqil-agayev';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyə nəzarət, yüksək riskli hamiləliyin izlənilməsi
Bütün növ ginekoloji xəstəliklərin müayinə və müalicəsi
Laparoskopik və histereskopik əməliyyatlar
Uşaqlıq boynu patologiyaları müalicəsi
Sonsuzluğun diaqnostikası və müalicəsi
İntim və vaginal plastika və s.

Konfranslar:
Bir sıra ölkə daxili və Beynəlxalq kurs və konfranslarda iştirak etmişdir.', updated_at = NOW() WHERE slug = 'op-dr-aygun-sahbazova';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Laparotomik, laparoskopik,Total Histerektomiya
Myomektomiya
Kistektomiya
Salpingooferektomiya
Endometrioz cərrahiyəsi
Histeroskopik üsulla bütün növ ginekoloji əməliyyatlar
Ginekoloji USM
Hamiləliyin təqibi və mamalıq əməliyyatları
Fizioloji doğuş, Qeysəriyyə
Ginekoloji Urologiya - Sidik qaçırma
Prolapsus (orqan sallanması) ilə bağlı əməliyyatlar
Vaginal Histerektomiya
Anterior və Posterior Kolpoqrafiya
Transobturator Tape (TOT)
Vaginaplastika
Labiaplastika
Perineoplastika
Çətin doğuşlara bağlı travmaların cərrahi aradan qaldırılması
Sonsuzluqla bağlı bütün cərrahi əməliyyatlar
Süni mayalanma

Konfranslar:
2016-ci il - Almaniya, Ştutqart, Tübingen Universiteti - Department fwr Frauengesundheit Universitats - Frauenklinik hospitiert hat.
2017-ci il - Türkiyə, Yeditepe Universitet Xəstaxanasının mütəxəssislərinin iştirakı ilə aparılmış Ginekoloji, USM və İVF seminarı
2018-ci il - Ginekoloji təcrübədə progesteronun istifadəsinin müasir aspektləri" seminarı
2018-ci il - "Perinatology Course" İnternational Symposium on Reproductive Health and İnfertility
2019-cu il - "2nd İnternational Symposium on Reproductive Health and İnfertility"
2019-cu il - "Laporoscopy and Hysteroscopy Course"
2019-cu il - "Laporoscopic Surgery in Gynecology" kursu
2020-ci il - "Vitamin D və bilinməyən tərəfləri" kursu
2022-ci il - "Üreme Tibbi Cerrahisi Derneği İVF Mektebi" kursu', updated_at = NOW() WHERE slug = 'op-dr-ayna-memmedrehimova';
UPDATE doctor SET bio = 'Cərrah-mama-ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin izlənməsi
Təbii doğuş və keysəriyyə əməliyyatı
Hamiləlik patologiyalarının diaqnostikası və müalicəsi
Ginekoloji xəstəliklərin diaqnostikası və fərdi müalicəsi
Mioma, kista və yumurtalıq xəstəlikləri
Kolposkopiya və uşaqlıq boynu xəstəlikləri
Laparoskopik, histeroskopik və açıq ginekoloji əməliyyatlar
Vaginoplastika və labioplastika
Çanaq dibi problemləri və sidik qaçırma
Kontrasepsiya və spiral yerləşdirilməsi
Ektopik hamiləliyin diaqnostikası və müalicəsi

Konfranslar:
XXXVII Международный конгресс с курсом эндоскопии «Новые технологии в диагностике и лечении гинекологических заболеваний»*
2024, Moskva
Ginekoloji endoskopiya, laparoskopiya və histeroskopiya üzrə beynəlxalq konqres.
VII Международный конгресс «Новые технологии в акушерстве, гинекологии, перинатологии и репродуктивной медицине»*
3-5 aprel 2025, Novosibirsk - Online
Mama-ginekologiya, perinatologiya və reproduktiv tibb üzrə beynəlxalq konqres.', updated_at = NOW() WHERE slug = 'op-dr-aynur-rzayeva';
UPDATE doctor SET bio = 'Ümumi Cərrah.

Fəaliyyət sahələri:
Laparoskopik cərrahiyyə
Qasıq Yırtıqları
Appendisitlər
Öd kisəsi əməliyyatları
Öd yollarında problemlər
Abdominoplastika
Blefaroplastika
Qasıq bölgəsinin cərrahiyəsi
Mədə, nazik və yoğun bağırsağın onkoloji xəstəlikləri
Hemoroid xəstəliyi
Perianal fistullar

Konfranslar:
2013-cü ildə Laporoskopiya üzrə kurs Ə.Əliyev adına Həkimlər təkmilləşdirmə institutu
2015-ci ildə Ə.Əliyev adına Həkimlər təkmilləşdirmə institutu Sertifikasiya imtahanı', updated_at = NOW() WHERE slug = 'op-dr-aynur-yaqubova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.', updated_at = NOW() WHERE slug = 'op-dr-aynure-abdullayeva';
UPDATE doctor SET bio = 'Cərrah - Oftalmoloq.', updated_at = NOW() WHERE slug = 'op-dr-azade-mecidova';
UPDATE doctor SET bio = 'Dəvətli Travmatoloq-Ortoped.', updated_at = NOW() WHERE slug = 'op-dr-azer-ilyasov';
UPDATE doctor SET bio = 'Mama-Ginekoloq.

Fəaliyyət sahələri:
Aybaşı disfunksiyaların diaqnostikası və müalicəsi
Cinsi yolla ötürülən infeksiyaların diaqnostikası və müalicəsi
Ailə planlaması: spiralın taxılması, oral kontraseptivlərin təyini, dərialtı implantın yeridilməsi və tubal sterilizasiya
Ginekoloji xəstəliklərin müayinə və müalicəsi
Normal və riskli hamiləliyin aparılması
Normal və ağrısız doğuşun aparılması
Kolposkopiya
Qeysəriyyə kəsiyi əməliyyatı
Uroginekologiya: sidik qaçırmanın diaqnostikası və müalicəsi
Hər növ ginekoloji əməliyyatlar', updated_at = NOW() WHERE slug = 'op-dr-bahar-ibrahimova';
UPDATE doctor SET bio = 'Ümumi cərrah.', updated_at = NOW() WHERE slug = 'op-dr-cabir-ehmedov';
UPDATE doctor SET bio = 'Ümumi Cərrah.

Fəaliyyət sahələri:
Mədə-bağırsaq sistemində icra olunan bütün növ cərrahi əməliyyatlar
Öd kisəsi və öd yollarında həyata keçirilən bütün növ cərrahi əməliyyatlar
Rektosele və digər anal bölgə xəstəliklərinin cərrahi müalicəsi
Göbək, qasıq, bud və əməliyyatdan sonrakı bütün növ yırtıqların cərrahi müalicəsi
Qaraciyər və mədəaltı vəzdə aparılan cərrahi əməliyyatlar
Babasil, anal çat, tük dönməsi və bütün növ fistulların cərrahi müalicəsi', updated_at = NOW() WHERE slug = 'op-dr-cavan-xubanov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Travmatoloq-Ortoped.', updated_at = NOW() WHERE slug = 'op-dr-cavid-ehmedov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyin (o cümlədən riskli hamiləliyin) aparılması
Təbii doğuş
Qeysəriyyə əməliyyatı
Sonsuzluğun müalicəsi
İnseminasiya (aşılama)
Uşaq və yeniyetmələrin ginekologiyası
Ginekoloji endokrinologiya - hormonal pozulmaların müalicəsi
Laparoskopik ginekoloji əməliyyatlar - histerorezektoskopiya, poliplərin və miomaların kəsiksiz götürülməsi və s.
Uşaqlıq boynu eroziyasının cərrahi və konservativ (dərmanlarla) müalicəsi
Kolposkopiya (uşaqlıq boynunun müayinəsi)
Histeroskopiya (uşaqlığın müayinəsi)
Histerosalpinqoqrafiya (uşaqlıq borularının yoxlanılması)
Ginekoloji transvaginal USM, follikulometriya və s.

Konfranslar:
Nordbayerischen Symposium für Gynäkologische Endokrinologie und Reproduktionmedizin - Almaniya, Nürnberg
Türkiyə Maternal Fetal Tıp Ve Perinotoloji Derneği Xl. Ulusal Kongresi-Türkiyə, İstanbul
Modern aspects of management of pregnant women with premature rupture of the fetal bladder-Ukrayna
12.Kölner Repetitorium und Pfingskongress der DTGH - Almaniya, Köln', updated_at = NOW() WHERE slug = 'op-dr-elnare-memmedova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.', updated_at = NOW() WHERE slug = 'op-dr-elnure-eliyeva';
UPDATE doctor SET bio = 'Travmatoloq-Ortoped.', updated_at = NOW() WHERE slug = 'op-dr-emrah-selimzade';
UPDATE doctor SET bio = 'Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuzluğun tam müayinəsi və müalicəsi
Yumurtlama funksiyasının yoxlanılması (folikulyasiya izlənməsi, hormonal analizlər)
Hamiləliyin izlənməsi (Normal hamiləlik və Riskli hamiləlik )
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi
Kolposkopiya
Endokrinoloji ginekologiya
Diatermokoaqulyasiya (DTK) - Uterin boynunda eroziyalar və digər dəyişikliklərin elektrik cərəyanı ilə yandırılaraq müalicəsi
Doğuş və ginekoloji cərrahi əməliyyatlar
Təbii doğuş və doğuşa hazırlıq
Keysəriyyə əməliyyatı (indikasiya olduqda)
Müxtəlif Ginekoloji əməliyyatlar (Yumurtalıq və uşaqlıq törəmələrinin çıxarılması, Miomektomiya, Laparoskopik və açıq əməliyyatlar, Uşaqlığın alınması (histerektomiya), Endometriozun cərrahi müalicəsi)

Konfranslar:
2014-cü il Ginekologiyada müasir müalicə və müayinə üsulları
2014-cü il Ginekologiya və USM Doppler üzrə praktik kurs
2018-ci il Ginekoloji təcrübədə progesteronun istifadəsinin müasir aspektleri
2018-ci il Ana və dölün sağlamlığına müasir yanaşma
2018-ci il Mamalıq və ginekologiyanın aktual problemləri
2019-cu il Uşaqlıq boynu patologiyalarının müalicəsinə müasir yanaşma
2021-ci il Kolposkopiya üzrə kurs
2022-ci il Həkimlərin sertifikasiya kursu
2022-ci il Uşaqlıq boynu xərçənginin etimologiyası və müayinə üsulları', updated_at = NOW() WHERE slug = 'op-dr-esmira-hesenova';
UPDATE doctor SET bio = 'Cərrah Uroginekoloq.

Fəaliyyət sahələri:
Sidik-cinsiyyət sisteminin hər növ iltihabı və infeksion xəstəliklərinin müayinəsi və müalicəsi
İnfeksiya fonunda qadın sonsuzluğunun müayinəsi və müalicəsi
Böyrək daşı xəstəliyinin müayinəsi və müalicəsi
Hamiləlikdən öncə və hamiləlik dövründə qadınlarda hər növ uroloji problemlərinin müayinəsi və müalicəsi
Qadınlarda sistoskopiya və biopsiyanın götürülməsi
Slinq əməliyyatları (qadınlarda)
Uretra və sidik kisəsinə dolğuların və botulotoksinin tətbiqi
Qadınlarda hər növ sidik qaçırmalarının müayinəsi və müalicəsi

Konfranslar:
Zeynəb Kamil adına Xəstəxanada Qadın Doğum şöbəsində kurs, İstanbul, Türkiyə
2006-2007-ci illərdə Başkent Universiteti, Uroloji Anabilim şöbəsi və Qadın Doğum şöbəsində kurs, Ankara, Türkiyə
2020-ci il Akademik M. Cavadzadə adına Respublika Kliniki Uroloji Xəstəxanasında kurs', updated_at = NOW() WHERE slug = 'op-dr-guler-mehdiyeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuzluğun tam müayinəsi və müalicəsi
Yumurtlama funksiyasının yoxlanılması (folikulyasiya izlənməsi, hormonal analizlər)
Hamiləliyin izlənməsi (Normal hamiləlik və Riskli hamiləlik )
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi
Kolposkopiya
Endokrinoloji ginekologiya
Diatermokoaqulyasiya (DTK) - Uterin boynunda eroziyalar və digər dəyişikliklərin elektrik cərəyanı ilə yandırılaraq müalicəsi
Doğuş və ginekoloji cərrahi əməliyyatlar
Təbii doğuş və doğuşa hazırlıq
Keysəriyyə əməliyyatı (indikasiya olduqda)
Müxtəlif Ginekoloji əməliyyatlar (Yumurtalıq və uşaqlıq törəmələrinin çıxarılması, Miomektomiya, Laparoskopik və açıq əməliyyatlar, Uşaqlığın alınması (histerektomiya), Endometriozun cərrahi müalicəsi)

Konfranslar:
2010-cu il Beynəlxalq konfrans "Мать и Дитья" Perinatologiya problemləri, hamiləlik və doğuşun idarə edilməsi, Reproduktiv endokrinologiyanın müasir problemləri, Mamalıq və ginekologiyada yoluxucu xəstəliklər
2014-cü il Moskva Operativ ginekologiya: yeni texnologiyalar konfrans
2020-ci il Sübutedici təbabət nöqtəyi nəzərindən erkən toksikozun müalicəsində müasir yanaşmalar
2020-ci il Xəstəxanadaxili infeksiyalar üzrə Azərbaycan Türkiyə konfransı', updated_at = NOW() WHERE slug = 'op-dr-ilahe-mesimeliyeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Qulaq Burun Boğaz Cərrahı.

Konfranslar:
2014-cü il Burunətrafı ciblərin və kəllə əsası cərrahiyyəsi disseksiya kursu. ATU İnsan Anatomiyası Kafedrası
2014-cü il 10.Türk Rinoloji konqresi. Antalya, Türkiyə.
2014-cü il Yaxın Avrasiya Afrika Kulak Burun Boğaz 1.ci Beynəlxalq Konqresi', updated_at = NOW() WHERE slug = 'op-dr-ilkin-mikayilzade';
UPDATE doctor SET bio = 'Cərrah, Proktoloq.', updated_at = NOW() WHERE slug = 'op-dr-janna-xudaverdiyeva';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Hamiləliyə nəzarət, yüksək riskli hamiləliyin izlənilməsi
Bütün növ ginekoloji xəstəliklərin müayinə və müalicəsi
Laparoskopik və histereskopik əməliyyatlar
Uşaqlıq boynu patologiyaları müalicəsi
Sonsuzluğun diaqnostikası və müalicəsi
İntim və vaginal plastika və s.

Konfranslar:
Bağcılar Eğitim Araştırma Hastanesi,İstanbul
Ankara,Nümune Eğitim Araşdırma Hastanesi 2016
Ankara,Gazi Üniversiteti Hastanesi2017
Almaniya,Köln Uniklinik,Hospitation 2019
Türkiye Maternal Fetal Tıp ve Perinatoloji derneği XI Ulusal Kongressi,İstanbul 2019
TAJEV,Türk Alman Jinekoloji Kongress 2022,Antalya
XVII AAGL İnternational Meeting Gynİtaly,Roma 2023
XVIII İnternational Congress on Reproductive Medicine,Moskva 2024
Middle East ob&Gyn Conference,MegoDubai 2024
EndoDubai 10th Edition ,202', updated_at = NOW() WHERE slug = 'op-dr-leyli-sadiqli';
UPDATE doctor SET bio = 'Otorinolarinqoloq.

Fəaliyyət sahələri:
Rinoplastika
Septoplastika
Tonsillektomiya
Otoplastika
Adenoidektomiya
QBB müayinəsi', updated_at = NOW() WHERE slug = 'op-dr-natiq-qarayev';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah-Fleboloq.', updated_at = NOW() WHERE slug = 'op-dr-nubar-ismayilova';
UPDATE doctor SET bio = 'Ali Dərəcəli Ümumi Cərrah.

Konfranslar:
1982-ci il Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Urologiya üzrə kurs
1984-cü il Moskva şəh., Piroqov adına Tibb Universiteti, Travmatologiya və Ortopediya üzrə kurs
2015-ci il Ege Universiteti, Ümumi cərrahiyyə, Türkiyə, İzmir', updated_at = NOW() WHERE slug = 'op-dr-oktay-salamov';
UPDATE doctor SET bio = 'Cərrah-Oftalmoloq.', updated_at = NOW() WHERE slug = 'op-dr-selaheddin-tehmezov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Babasilin lazer üsulu ilə müalicəsi (lazer hemoroidektomiya)
Anal çatın müalicəsi
Anal çatın botoks üsulu ilə müalicəsi
Anal kondilomların lazer üsulu ilə götürülməsi
Lazer prosedurları
Anal fistulanın seton üsulu ilə müalicəsi
Rektovaginal fistulaların müalicəsi
Anal poliplərin götürülməsi (polipektomiya)
Rektoskopiya
Vaginal problemlərin müalicəsi
Doğuş sonrası aralıq və anal bölgənin bərpası
Nəcis qaçırtmanın (inkontinensiyanın) müalicəsi
Sidikqaçırmanın müalicəsi
Rektosel əməliyyatı
Sistosel əməliyyatı
Büzdümün dermoid kistasının lazer əməliyyatı
Anal saçaqların ləğvi
Tükdönməsinin lazer üsulu ilə əməliyyatı
Dərinin biopsiyası və götürülməsi
Doğuş travmalarının müalicəsi
Digər proktoloji əməliyyatlar', updated_at = NOW() WHERE slug = 'op-dr-sukur-abdullayev';
UPDATE doctor SET bio = 'Funksional Estetik Lor Cərrah.

Fəaliyyət sahələri:
Rinoplastika (xarici burnun korreksiyası)
Septoplastika (burun çəpərinin düzəldilməsi)
Polipektomiya (burun poliplərinin xaric edilməsi)
Fess əməliyyatı
Haymorotomiya
Otoplastika (xarici qulağın korreksiyaı)
Blefaroplastika (alt və üst göz qapaqlarının korreksiyası)
Lipplastika (alt və üst dodaqlarının plastikası)
Xalların götürülməsi
Etimoidotomiya
Qırtlaq polipi

Konfranslar:
2008 ci il Ukrayna Kiyev konfrans
2009 cu il Ukrayna Yalta konfrans
2010-2011 ci il Türkiyə İstanbul "Acıbadem Maslak" kurs
2012 BƏƏ Dubay Yüksək Texnologiyalar sərgisi
2013 Çexiya, Praqa konfrans
2014 Avstrya,Vyana konfrans
2015 Macarıstan, Budapeşt konfrans
2016 Türkiyə, İzmir konfrans
2017 Türkiyə, Antalya konfrans
2018 Türkiyə, Ankara konfrans
2019 Rusiya, Sank Peterburq konfrans', updated_at = NOW() WHERE slug = 'op-dr-vidadi-memmedov';
UPDATE doctor SET bio = 'Mama-Ginekoloq.

Fəaliyyət sahələri:
Riskli və normal hamiləlik təqibi
Sonsuzluğun diaqnostikası və müalicəsi
Bütün növ ginekoloji əməliyyatlar (miomektomiya, vaginoplastika, labioplastika və s.)
Histeroskopiya
Laparoskopiya
Uşaqlıq boynu patologiyalarının müayinəsi və müalicəsi
Kolposkopiya
Sidik saxlamama problemlərinin cərrahi və konservativ müalicəsi
Endokrinoloji ginekologiya üzrə xidmətlər', updated_at = NOW() WHERE slug = 'op-dr-vusale-eyvazova';
UPDATE doctor SET bio = 'Haqqında:
bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim
2014 Sertifikasiya, Şüa diaqnostika üzrə
Turan Klinikası, Şüa diaqnostika üzrə həkim
2004 - 2013 Səuidi Ərəbistan Arar Central Hospital Cərrahi şöbə, Şüa diqnostika üzrə
1996 - 2004 Sumqayıt Şəhər Polis İdarəsi nəznində tibb idarəsi, Həkim cərrah
1995 - 1996 Daxili İşlər Nazirliyi Tibbi idarəsi, Həkim cərrah
1994 - 1995 İnternatura. ARSN Məhkəmə Tibbi Ekspertiza və Patoloji Anatomiya Birliyi
1988 - 1994 Azərbaycan Tibb Universiteti', updated_at = NOW() WHERE slug = 'oqtay-kazimov';
UPDATE doctor SET bio = 'Laboratoriya müdiri, Genetik.

Konfranslar:
Roche Taqman 48 Workshop, Antalya - Turkey, 4-8 Juin 2004.
Simsek F, Yalciner A, Çiftçi U, Dağdemir A, Laleli Y.
The Role of Anti HCV and HCV RNA PCR in Diagnosis of Hepatit C Virus İnfection 41st Meeting of Turkish Microbololgy, Kuşadası-Turkey, 19-23 September 2004 (poster)
Dolek B, Kesim Eroglu B, Gultekin G, Dagdemir A, Eraslan S, Eroglu S, Karatas G, Laleli Y.
Prenatal Diagnosis in Turkish Patients on Chromosomes 21, 18, 13 and XY with Quantitative Flourescent PCR Methods.
European Society of Human Genetics, Amsterdam - Holland 6-9 May 2006 (poster).
CELLSEARCH™ SYSTEM Workshop Strasbourg-France, 29 May-2 June 2007.
Eroğlu Kesim B., Kagnıcı O., Karatas G., Güz Eroğlu S., Dagdemir A., Eraslan S., Laleli Y.
Comparıson of Mutation Screennıg Assays on Mefv Gene in Turkısh FMF Patients European Society of Human Genetics, Barcellona-Spain, 29 May-3 June 2008 (poster).
Kesim Eroglu B, Dagdemir A, Karatas G, Dolek B Eraslan S, Eroglu S, Gultekin G,Laleli Y.
Prenatal Diagnosis in Turkish Patients on Chromosomes 21, 18, 13 and XY with Quantitative Flourescent PCR Methods.
Second congre of Southeast Europen Society of Perinotent Medicine, Istanbul-Turkey, 31October-3November 2007 (poster).
Mentioned in Acknowledgements in the Meeting of Clinical Biochemistry, Duzen Laboratories, Ankara/Turkey - October 2005 in below seminars:
Serpil Eraslan - ''The Molecular Basis of Beta Thalassemia in Turkish Population''
''The Molecular Basis of Familial Mediterenian Fever in Turkish Population''
Belgin Eroglu Kesim - ''Tests for Prenatal and Postnatal Diagnosis''
1ère Cerificate en Médecine Prédictive & Médecine Personalisée, Aplication pour la Pharmacogénétique, April 15-17, 2011, Université Yeditepe, Istanbul, Turquie ( http://www.personalmedicineistanbul.org/ )
2éme Cerificate en Médecine Prédictive & Médecine Personalisée, Aplication pour la Pharmacogénétique, Septembre 13-16, 2012 Université Anadolu, Eskisehir, Turquie ( http://www.p4certificate.anadolu.edu.tr/ )
Formation « Medical Writing »par le laboratoire Lilly. 24 Septembre 2012 Clermont-Ferrand, France ( https://www.lilly.fr/ )
Dagdemir A, Durif J, Ngollo M, Bignon Y-J, Bernard-Gallon D
Histone lysine trimethylation or acetylation can be modulated by phytoestrogen, estrogen or anti-HDAC in breast cancer cell lines.
Journée Scientifique du CRNH-AUVERGNE Pôle Physique des Cézeaux, Clermont-Ferrand-France, 22 Novembre 2012 (poster).
Ngollo M, Durif J, Dagdemir A, Adjakly M, Boiteux J-P, Bignon Y-J, Guy L, Bernard-Gallon D
Etude de la marque épigénétique H3K27 triméthylée sur le silencing de gènes impliqués dans le cancer de la prostate.
Journée Scientifique du CRNH-AUVERGNE Pôle Physique des Cézeaux, Clermont - Ferrand - France ,22 Novembre 2012 (poster).
Judes G, Dagdemir A, Ngollo M, Karsli-Ceppioglu S, Lebert A, Penault-Llorca F, BignonYJ, Bernard-Gallon D.
Etude des marques epigenetiques methylantes et acetylantes dans les cancers sporadiques du sein et leurs tissus sains correspondants.
Journée Scientifique du CRNH-AUVERGNE Pôle Physique des Cézeaux, Clermont-Ferrand- France, 28 Novembre 2013 (poster).
Dagdemir A, Judes G, Echegut M, Karsli-Ceppioglu S, Ngollo M, Penault-Llorca F, BignonYJ, Bernard-Gallon D.
Histone Lysine Trimethylation or Acetylation Can Be Modulated by Histone Methylation Inhibitor and Anti-HDAC like Sodium Butyrate in Breast Cancer Cell Lines.
Journée Scientifique du CRNH-AUVERGNE Pôle Physique des Cézeaux, Clermont-Ferrand- France , 28 Novembre 2013 (poster).
Ngollo M, Dagdemir A, Penault-Llorca F, Boiteux JP, Guy L, Lebert A, Bignon YJ, Bernard-Gallon D.
Etude Des Modıfıcatıons Post-Traductıonnelles Des Hıstones: Role De La Trımethylatıon De La Lysıne 27 De L''hıstone H3 Dans Le Cancer De La Prostate"
7ème Assise de Génétique, Bordeaux- France, 29-31 Janvier 2014 (poster).
Gallon-Bernard D, Judes G, Dagdemir A , Echegut M, Karsli-Ceppioglu S, Ngollo M, Lebert A, Penault-Llorca F, Bignon Y.J.
Histone lysine trimethylation or acetylation in sporadic breast tumor and matched normal tissue.
Annual Meeting of the American Association for Cancer Research (AACR) , San Diego-USA April 5-9, 2014 (poster).
Dagdemir A, Judes G, Echegut M, Karsli-Ceppioglu S, Ngollo M, Penault-Llorca F, BignonYJ, Bernard-Gallon D.
Histone Lysine Trimethylation or Acetylation Can Be Modulated by Histone Mehylation Inhibitor and Anti-HDAC Like Sodium Butyrate in Breast Cancer Cell Lines.
Les journees de l''ecole doctorale, Clermont-Ferrand, France,12 &13 Juin 2014 (poster).
Euroimmun Medical Laboratory Automation course, Euroimmun Academy in Luebeck-Germany, 29 June-07 July 2015.', updated_at = NOW() WHERE slug = 'phd-dr-aslihan-dagdemir';
UPDATE doctor SET bio = 'Endokrinoloq-Cərrah.

Fəaliyyət sahələri:
Qalxanabənzər vəzin cərrahi əməliyyatları
Qalxanabənzər ətraf vəzin cərrahi əməliyyatları
Laparoskopik əməliyyatlar
Qalxanabənzər vəzi düyünlərinin lazerlə destruksiyası
Düyünlərin skleroterapiyası
Qalxanabənzər vəzi düyünlərinin UZİ altında incə iynə aspirasion biopsiyası', updated_at = NOW() WHERE slug = 'phd-dr-azer-hummetov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Genetik konsultasiya
Molekulyar genetik testləri
NİPT testləri
Ekzom testləri
Mikroarray testləri

Konfranslar:
8-ci Milli Genetika və Biomühəndislik Konqresi, 2021, İstanbul, Türkiyə
İMÜGEN''21 Molekulyar Biologiya və Genetika Günləri, 2021, İstanbul, Türkiyə
I. ULUGEN Elm Günləri, 2021, Bursa, Türkiye
I. SciGether Science Days, 2021, Türkiyə
DNT zədələnməsi, təmiri və tandem kütləvi spektrometriya məlumat keyfiyyəti qiymətləndirmə nəzəri və praktik kurs, 2018, İzmir, Türkiyə
Kök Hüceyrə və Hüceyrə Mədəniyyəti Kursu, 2017, Ankara, Türkiyə', updated_at = NOW() WHERE slug = 'phd-dr-elza-balakisiyeva';
UPDATE doctor SET bio = 'Uşaq endokrinoloqu.

Fəaliyyət sahələri:
Uşaqlarda boy qısalığı və boy geriliyi
Boy hormonu çatışmazlığı
Boy hormonu stimulyasiya testləri
Genetik boy pozuntularının qiymətləndirilməsi
Uşaqlarda Tip 1 və Tip 2 şəkərli diabet
Uşaqlarda Şəkərsiz diabet (diabetes insipidus)
Uşaqlarda Hipoqlikemiya (qanda şəkərin düşməsi)
Uşaqlarda artıq çəki və piylənmə
Metabolik sindrom və insulin müqaviməti
Erkən cinsi yetişkənlik
Gecikmiş cinsi inkişaf
Menstruasiya pozuntuları (yeniyetmə qızlarda)
Həddindən artıq tüklənmə (hirsutizm)
Penis inkişafı problemləri (mikropenis, undescended testis və s.)
Uşaqlarda Hipotiroidizm
Uşaqlarda Hipertiroidizm
Uşaqlarda Autoimmun tiroiditlər (Hashimoto və s.)
Doğuşdan adrenal hiperplaziya (CAH)
Kortizol ifrazı ilə bağlı pozğunluqlar
Hipofiz hormon çatışmazlıqları
Uşaqlarda Genetik və metabolik xəstəliklər
Turner sindromu
D vitamini çatışmazlığı və raxit
Kalsium və fosfor metabolizması pozğunluqları
Sümük xəstəlikləri - Natamam osteogenez, raxit və s.
Endokrinoloji problemlərin geniş spektrli diaqnozu
Müasir müalicə protokolları ilə individual yanaşma
Uzunmüddətli təqib və inkişafın monitorinqi', updated_at = NOW() WHERE slug = 'phd-dr-gunay-cebrayilova';
UPDATE doctor SET bio = 'Onkoloq-Mammoloq.

Fəaliyyət sahələri:
Süd vəzisi törəmələrinin müasir protokollara uyğun müalicəsi
Orqanqoruyucu və onkoplastik əməliyyatlar
Estetik əməliyyatlar (xoşxassəli şişlər üzrə)
Süd vəzilərinin böyüdülməsi, kiçildilməsi, dikləşdirilməsi
Fərqli ölçülü süd vəzilərinin simmetrikləşdirilməsi
Süd vəzisində ağrılar və dishormonal vəziyyətlər
Kista, fibroadenoma kimi əllə hiss olunan törəmələrin diaqnostika və müalicəsi
Gilədən gələn ifrazatlar, axardaxili papilomalar
Süd vəzisinin iltihabi xəstəlikləri və digər narahatlıqlar', updated_at = NOW() WHERE slug = 'phd-dr-gunay-ehmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Onurğa problemləri
Skolioz
Kifoz
Lordoz
Onurğa əyrilikləri
Duruş pozğunluqları
Onurğa ağrıları (boyun, bel, kürək)
Ayaq və skelet sistemi
Yastıpəncəlik
Valgus (ayaqların içə düşməsi)
Varus / O-bacak
Diz ağrıları
Bud-çanaq problemləri
Ayaq forması pozğunluqları
Əzələ problemləri
Əzələ zəifliyi
Əzələ disbalansı
Əzələ spazmı
Miopatiyalar
Uşaqlarda əzələ tonus problemləri
Sinir sistemi ilə bağlı hallar
Serebral iflic (CP)
Sinir sıxılması (boyun, bel)
Radikulit
Nevroloji zəifliklər
Hərəkət koordinasiya problemləri
Uşaqlarda inkişaf problemləri
Gec yerimə
Gec oturma
Motor inkişaf geriliyi
Əyri oturma və əyri yerimə
Duruş qüsurları
Travmadan sonra reabilitasiya
Sınıqdan sonra bərpa
Çıxıqdan sonra reabilitasiya
Əməliyyatdan sonra hərəkətin bərpası
Bağ zədələrindən sonra reabilitasiya
Ağrı sindromları
Boyun ağrısı
Bel ağrısı
Çiyin ağrısı
Diz ağrısı
Kürək ağrısı

Konfranslar:
Sporcularda diz bölgəsi bantlama tətbiqləri - İKÇÜ Workshop
Sportfiz Akademi - Pilates (Level 1, Level 2)', updated_at = NOW() WHERE slug = 'pinar-memmedli';
UPDATE doctor SET bio = 'Fizioterapevt-Reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
Ortopedik xəstəliklərin reabilitasiyası
Nevroloji xəstəliklərdə reabilitasiya
Revmatoloji xəstəliklərdə reabilitasiya
Post - operativ reabilitasiya
Donmuş çiyin sindromu
Skolioz ,kifoz , lordoz
Rotator manjet vətər zədələnmələri zamanı reabilitasiya
Sınıqlardan sonra reabilitasiya', updated_at = NOW() WHERE slug = 'pinar-seferova';
UPDATE doctor SET bio = 'Əməkdar Həkim, Kardiologiya şöbəsinin müdiri.', updated_at = NOW() WHERE slug = 'prof-dr-firdovsi-ibrahimov';
UPDATE doctor SET bio = 'Baş həkim (Xəstəxana) / Şöbə müdiri / Mütəxəssis.

Şöbə: Ürək-Damar Cərrahiyyəsi

Fəaliyyət sahələri:
Transmiokardial lazer revaskulyarizasiyası - Amerika Birləşmiş Ştatları
Minimal invaziv ürək cərrahiyyəsi - Almaniya Berlin
Kardiovaskulyar cərrahiyyə
Koronar bypass əməliyyatları
Minimal invaziv ürək əməliyyatı
Arterial və venoz xəstəliklərin cərrahi müalicəsi
Aorta cərrahiyyəsi
Bayandır Xəstəxanası, Türkiyə, Ankara
Harefield Xəstəxanası, İngiltərə, London

İş təcrübəsi:
1996-2002 Həkim-ürək-damar cərrahı, Qәdir Xas Universiteti Florence Nightingale xәstәxanası, Ürәk-Damar Cәrrahiyyәsi, Türkiyə, İstanbul
2002-2005 Həkim-ürək-damar cərrahı, Stasionar şöbənin müdiri, Mərkəzi Klinika, Azərbaycan Bakı
2005- 2009 İcraçı direktorun tibbi işlər üzrə müavini, Mərkəzi Klinika, Azərbaycan Bakı
2009- Baş həkim, Ürәk-Damar Cәrrahiyyәsi şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan Bakı', updated_at = NOW() WHERE slug = 'prof-dr-kamran-musayev';
UPDATE doctor SET bio = 'Kardioloq.

İş təcrübəsi:
2014-cü ildən bu günədək Respublika Diaqnostika Mərkəzində həkim-kardioloq vəzifəsində çalışır.', updated_at = NOW() WHERE slug = 'puste-xelilova';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 1999-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'qaralova-sevinc-asbandiyar';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2015-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'qarayeva-neneqiz-qehraman';
UPDATE doctor SET bio = 'MediClub Hospitalın baş meneceri, MediClub Laboratoriyasının şöbə müdiri.
MediClub-da 2015-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'qasimova-sevinc-hemidaga';
UPDATE doctor SET bio = 'Həkim-mama-ginekoloq.
MediClub-da 2016-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'qedirova-elvira-sahmar';
UPDATE doctor SET bio = 'Həkim-nevroloq.
MediClub-da 2017-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'quliyeva-sugra-agaselim';
UPDATE doctor SET bio = 'Həkim-nevroloq.
MediClub-da 2015-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'quliyeva-ulviyye-nizami';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Manual terapiya
Mulligan konsepti texnikaları
Əzələ-skelet sistemi reabilitasiyası
Onurğa problemlərinin reabilitasiyası
Postural pozuntuların korreksiyası
Travma və ortopedik problemlərdən sonra reabilitasiya
Yutma pozğunluqlarının reabilitasiyası
Müalicə etdiyi xəstəliklər
Skolioz, kifoz və lordoz kimi onurğa əyrilikləri
Boyun və bel ağrıları (servikalgiya, lumbalgiya)
Disk yırtığı (bel və boyun fəqərələrində)
Əzələ spazmları və miofasial ağrı sindromu
Postural pozuntular (duruş problemləri)
Çiyin, diz və digər oynaqlarda ağrı və funksional məhdudiyyətlər
Travma və əməliyyatlardan sonra reabilitasiya
Əzələ zəifliyi və hərəkət məhdudiyyəti
Yastıpəncəlik və ortopedik ayaq problemləri
Uşaqlarda ortopedik problemlər
Yutma pozğunluqlarının reabilitasiyası', updated_at = NOW() WHERE slug = 'ramazan-nesirli';
UPDATE doctor SET bio = 'MediClub Dental stomatoloji klinikasının baş meneceri.
Həkim-stomatoloq (cərrah).
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'ramazanova-nergiz-fuad';
UPDATE doctor SET bio = 'Uzman fizioterapevt-reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
İnsult
Dağınıq skleroz
Parkinson
Kəllə-beyin və onurğa yaralanmaları
Miyopatiyalar
Neyropatiyalar
Serebral iflic
Spina bifida və Əzələ distrofiyaları kimi pediatrik və nevroloji xəstəliklərin fizioterapiya və reabilitasiyası.

İş təcrübəsi:
2022-2023 - İzmir Nefes Fizioterapiya Mərkəzi: Fizioterapevt-reabilitoloq
2024 - Yeni Klinika: Fizioterapevt-reabilitoloq.', updated_at = NOW() WHERE slug = 'ramil-ehmedov';
UPDATE doctor SET bio = 'Şöbə: Travmatologiya və Ortopediya', updated_at = NOW() WHERE slug = 'ramin-rzayev';
UPDATE doctor SET bio = 'Şöbə: Stomatologiya

İş təcrübəsi:
2000-2014 Dövlət və özəl tibb müəssisələrində həkim-stomatoloq kimi çalışmışdır
2014-cü ildən Mərkəzi Gömrük Hospitalı, həkim-stomatoloq

Lisenziya və sertifikatlar:
2001 Respublika stomatoloji mərkəzi, təkmilləşdirmə kursu
2017 İsrail Rambar Sağlamlıq kampusu. Dental implantlar, müasir yanaşma müalicə planlaması və ağırlaşmaların aradan qaldırılması kursu
2017 İmplantalogiyada rəqəmsal texnologiyaların tətbiqi, Almaniya, Bremen
2018 Cərrahi və protezləmə ilə estetik bölgədə diş ətində təbiiliyin əldə olunması, Belçika
2023 XXVI MegaGen Beynəlxalq Simpoziumu. ABŞ, Nyu York şəhəri.
Üzv olduğu təşkilatlar
İnternational Team for İmplantology
Türk Oral İmplantoloji Dərnəyi
Azərbaycan İmplantoloq İctimai Birliyi
Azərbaycan Ağız və Üz-çənə cərrahları cəmiyyəti', updated_at = NOW() WHERE slug = 'rauf-babayev';
UPDATE doctor SET bio = 'Kardioloq.
Elmi dərəcə: Tibb elmləri namizədi

İş təcrübəsi:
Təlimlər: Kardiologiya üzrə kurslar, University Hospital. Friedrich Schiller - Jena
Hal-hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'rauf-semedov';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2020-2021 Malatya Özəl Xəstəxanasında qadın xəstəlikləri və doğum uzmanı
2021-2024. Müxtəlif dövlət və özəl tibb müəssisələrində şöbə müdiri və mama- ginekoloq kimi fəaliyyət göstərib.
2024-cü ildən Mərkəzi Gömrük Hospitalında ginekoloq çalışır

Lisenziya və sertifikatlar:
2018 Yenidoğulmuşların resussitasiyası, Mersin, Türkiyə
2018 Hamiləlikdə ultrasəs dalğalarının təsiri simpoziumu, Adana, Türkiyə
2018 18. Milli Ginekologiya və Doğum simpoziumu Adana, Türkiyə
2019 17. Milli Ginekologiya və Doğum konqresi Antalya, Türkiyə
2024 Genital estetika qeyri-invaziv tətbiqlər kursu, Bakı
2024 Estetik ginekologiya konfransı, Bakı
2024 Azərbaycan Respublikası Səhiyyə Nazirliyi, Səhiyyə Nazirliyinin İctimai Səhiyyə və İslahatlar Mərkəzi və Elmi Tədqiqat Mamalıq və Ginekologiya İnstitutunun birgə təşkilatçılığı ilə keçirilən "Mamalıqda təkmilləşdirilmiş təxirəsalınmaz yardım" üzrə təlim kursunda iştirak edib. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'raziyye-tapdiqova';
UPDATE doctor SET bio = 'Həkim-terapevt.
MediClub-da 2007-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'refizade-sevda-kerim';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək Sağlam Ailə Ultralab klinikası / Baş həkim/ Həkim-pediatr
2023-2024 - K.Fərəcova adına Elmi Tədqiqat İnstitutu/ Neoanatologiya şöbəsinin müdiri
2022 - 2023 - Sağlam Ailə Ultralab klinikası / Həkim-pediatr
2022 - 2023 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Həkim-neonatoloq
2018 - 2021 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Anesteziologiya, reanimasiya və intensiv terapiya şöbəsinin müdiri
2017 - 2018 - K.Fərəcova adına Elmi Tədqiqat İnstitutu / Doktorantura
2011 - 2016 - Rezidentura/ K.Fərəcova adına Elmi Tədqiqat İnstitutu / Həkim pediatr
2005 - 2011 - Azərbaycan Tibb Universiteti / Pediatriya', updated_at = NOW() WHERE slug = 'regina-nemetova';
UPDATE doctor SET bio = 'Həkim-stomatoloq (cərrah, ortoped, implantoloq).
MediClub-da 2025-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'rehimov-orxan-mehdi';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2022-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'rehmetov-kamin-kamal';
UPDATE doctor SET bio = 'Radioloq.

İş təcrübəsi:
2000-2003 7 saylı doğum evi
2003-2013 "Leyla Şıxlinskaya" klinikası
2013-2014 ""Baku" klinikası, FiBROSCAN üzrə mütəxəssis
2013-2014 "Eurolab" klinikası, Radioloq (USM)
2014 Caspian International Hospital, Radioloq (USM)
2024-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir
Fəaliyyət sahələri:
Perinatal diaqnostika (rəngli doppler, 3D, 4D)
Ginekologiya
Mammologiya
Endokrinologiya
Neyrosonoqrafiya
Pediatriya
Hepatologiya
Urologiya
Müayinə istiqamətləri:
Perinatal diaqnostika (doppler, 3D, 4D)
Ginekoloji-Mamoloji-Endokrinoloji USM
Pediatrik USM
Hepatoloji USM
Uroloji USM
Yumşaq toxumalar USM
Cərrahi xəstəlikler, punksiyalar, biopsiyalar va s.', updated_at = NOW() WHERE slug = 'rena-abasova';
UPDATE doctor SET bio = 'Nevropatoloq.

İş təcrübəsi:
2011-2015 Azərbaycan Tibb Universiteti Tədris Terapevtik Klinika Nevrologiya şöbəsi 2011-2015, nevroloq-rezident
2015-2017 Azərbaycan Tibb Universiteti Tədris Terapevtik Klinika Nevrologiya şöbəsi 2015-2017, nevroloq-həkim
2017-2019 Respublika Perinatal Mərkəz, nevroloq-həkim
2019-cu ildən bu günədək Respublika Diaqnostika Mərkəzi, həkim-nevroloq', updated_at = NOW() WHERE slug = 'rena-emirova';
UPDATE doctor SET bio = 'Nevropatoloq.
Elmi dərəcə: Professor

İş təcrübəsi:
1980 - 2018 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
AR Prezidenti yanında Ali Attestasiya Komissiyasının ekspert şurasının, Azərbaycan Tibb jurnalının, Azərbaycan Kurortologiya, fizioterapiya və reabilitasiya jurnalının və Psixiatriya jurnalının redaksiya şuralarının üzvüdür, Milli Nevrologiya Jurnalının baş redaktorudur.
Nevrologiya sahəsində 100-dən artıq elmi əsər, o cümlədən 5 dərslik, 6 tədris vəsaiti, 2 monoqrafiya, 2 məlumat kitabçası, 8 metodik tövsiyyənin müəllifidir, məqalələri respublikada və xaricdə dövrü nəşriyyatda çap olunmuşdur.', updated_at = NOW() WHERE slug = 'rena-sireliyeva';
UPDATE doctor SET bio = 'Haqqında:
2024 - bugünədək Ultralab Tİbb Mərkəzi, Həkim endokrinoloq
2013 - bugünədək "Yaşam" tibb mərkəzi/ Həkim-endokrinoloq
2003-2013 - Səhhət klinikası/ Həkim-endokrinoloq
2001-2003 - Xəzər Qayğıkeşlik Lahiyəsi/ Tibbi koordinator
1999-2001 - Elmi-Tətqiqat Ağciyər Xəstəlikləri İnstitutu, Həkim endokrinoloq
1998-1999 - Western medical/ Həkim
1995-1997- Ordinatura/ Azərbaycan Tibb Universiteti/ Həkim-endokrinoloq
1994-1995 - İnternatura/ F. Əfəndiyev adına 4 saylı şəhər klinik xəstəxanası/ Həkim-endokrinoloq
1988-1994 - Azərbaycan Tibb Universiteti/ Müalicə işi', updated_at = NOW() WHERE slug = 'rena-vekilova-hodnicak';
UPDATE doctor SET bio = 'Şöbə: Ürək-Damar Cərrahiyyəsi', updated_at = NOW() WHERE slug = 'resad-mahmudov';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2008-2015-ci illərdə Azərbaycan Travmatologiya və Ortopediya İnstitutu, anesteziologiya və reanimasiya şöbəsində anestezioloq-reanimatoloq
2011-2015 ci illərdə B. Eyvazov adına Hematologiya və Transfuziologiya İnstitutunda anestezioloq-reanimatoloq
2011-2015 Müxtəlif dövlət və özəl tibb müəssələrində anestezioloq-reanimatoloq
2015-ci ildən Mərkəzi Gömrük Hospitalında anestezioloq-reanimatoloq kimi çalışır
Mükafatlar
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2011-2013 Avrasiya Hematoloji Konfransı Türkiyə, Antalya
2015 "İntensiv Terapiya Dərnəyinin konqresi Türkiyə, Ankara
2011 Dışkapı Egitim-Araştırma Xəstəxanası 3 aylıq təkmilləşdirmə kursu keçmişdir. Türkiyə, Ankara
2018 Birinci Beynəlxalq Transplantasiya konqresi Türkiyə, Ankara
2018-ci il Malatiya İnönü Universiteti qaraciyər nəqli İnstitutunda 1 aylıq təşkilləşdirmə kursu
2018 Qaraciyər Nəqli Xəstəxanası,Anesteziya üzrə kurs, Malatya, Türkiyə
2021 Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2023 Open Medical İnstitute", "Weill Corner Medicine" təşkilatının və Vyana Tibb Universitetinin təşkilatçılığı ilə keçirilən "Anesteziologiya və İntentsiv terapiya" mövzusunda seminar. Avstriya, Zalsburq şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan İntensiv Terapiya Assosiasiyası', updated_at = NOW() WHERE slug = 'resad-nesirli';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2010-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'resulova-samire-sahzade';
UPDATE doctor SET bio = 'Loqoped, Xüsusi Psixoloq.

Fəaliyyət sahələri:
Autizm spektor pozuntusu
Daun sindromu
Uşaq serebral iflici
İnkişaf ləngiməsi
Qorxular, Təşviş pozuntusu
Art terapiya
Kineziobantlama
Diqqət əksikliyi
Hiperaktivlik sindromu
Özgüvən əksikliyi
Mutizm
Loqopedik masaj

Konfranslar:
2021-ci il "KİNEZETEYPİNG" kursu, İstanbul
2022-ci ildə "CASPİAN AWARDS 2022" layihesi.
2022-ci il "MY LİFE"- Danışmanlık mərkəzi mövzu: "KƏKƏLƏMƏ", kursu
2022-ci ildə Azərbaycan Respublikasının Səhiyyə Nazirliyinin "Davamlı tibbi təhsil üzrə elm və tədris tədbirlərinin akkreditasiya Qaydaları" əsasında DTT üzrə akkreditasiya edilmiş "SAGLAM BÖYÜYƏN UŞAQLAR" adli elmi praktiki tibb simpozium, Bakı
2023-cü il yaradıcı psixologiya simpoziumu, Art terapiya', updated_at = NOW() WHERE slug = 'revane-eliyeva';
UPDATE doctor SET bio = 'Şöbə: Laboratoriya ISO 15189:2012

İş təcrübəsi:
1998-2009 Müxtəlif dövlət tibb müəssisələrində həkim-biokimyaçı kimi çalışıb.
2004-2013 Bakı Slavyan Universitetinin "Tibbi biliklərin əsasları və mülki müdafiə" kafedrasında baş müəllim kimi fəaliyyət göstərib.
2009-cu ildən etibarən Mərkəzi Gömrük Hospitalının Tibbi Laboratoriya şöbəsində həkim-biokimyaçı kimi fəaliyyət göstərir.
Nailiyyətlər və Üstünlüklər
2019 Azərbaycan Respublikasi Dövlət Gömrük Komitəsi - Gömrük organlarında uzun müddət və qüsursuz xidmətə görə "Gömrük organlarında xidmətə görə" 3-cü dərəcə döş nişanı ilə təltif olunub.
2022-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.

Lisenziya və sertifikatlar:
2001 Respublika QİÇS-lə Mübarizə Mərkəzinin HİV-in laborator diaqnostikası sahəsində ilkin ixtisaslaşdırılma kursu. Azərbaycan, Bakı şəhəri.
2009 Labservis LTD-nin təşkilatçılığı ilə Almaniyanın Roche Diagnostics şirkətinin Cobas 4000 C-311 tam avtomat biokimyəvi analizatorunda tədris kursu. Azərbaycan, Bakı şəhəri.
2021 ATU-nun Tədris Terapevtik Klinikasında təşkil edilmiş "Süni İntellektə Əsaslanan Mikrobiom analizi" mövzusunsa simpozium. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'reyhan-eliyeva';
UPDATE doctor SET bio = 'Həkim-anestezioloq-reanimatoloq.
MediClub-da 2022-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'rustemli-nermin-mobil';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2018-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'rustemov-hesret-qurbaneli';
UPDATE doctor SET bio = 'Sənaye təbabəti şöbəsinin profilaktik müayinələr üzrə aparıcı mütəxəssis.
MediClub-da 1998-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'rzayeva-konul-aydin';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2008 Mərkəzi Neftçilər Xəstəxanası, Ürək-damar cərrahiyəsi anestezioloq-reanimatoloq
2017-2018 Naxçıvan MR Müalicə Diaqnostika Mərkəzi , Ürək-damar cərrahiyəsi reanimasiyanın Şöbə Müdiri
2018 ci ildən Mərkəzi Gömrük Hospitalında anestezioloq-reanimatoloq vəzifəsində çalışır
Lisenziyalar və Sertifikatlar
2009 Türk Kardioloji Dərnəyinin və Azərbaycan Kardiovaskulyar Cərrahiyyə Cəmiyyətinin təşkilatçılığı ilə keçirilən "Kardiologiya və exokardioqrafiya" kursu. Azərbaycan, Bakı şəhəri.
2011 Naxçıvan Muxtar Respublikası Səhiyyə Nazirliyi tərəfindən təşkil edilmiş "Ürək xəstəliklərinin bu günü və gələcəyi" IV Regional Beynəlxalq elmi-praktiki konfrans. Naxçıvan Muxtar Respublikası, Naxçıvan şəhəri
2017 Naxçıvan Muxtar Respublikası Səhiyyə Nazirliyi Naxçıvan Diaqnostika Müalicə Mərkəzi tərəfindən əməkdə xüsusi xidmət və nailiyyətlərə görə Fəxri Fərman ilə təltif olunub.
2018 Tibb Elmləri üzrə Urmia Universitetinin təşkilatçılığı ilə "Minimal invaziv cərrahiyyə və yeni konseptlər" mövzusunda mühazirə. İran İslam Respublikası, Urmia şəhəri.
2019 Azərbaycan Tibb Universitetinin təşkilatçılığı ilə keçirilən "Pediatrik Reanimasiya və Təcili Pediatrik Yardım üzrə təlim kursu". Azərbaycan Respublikası, Bakı şəhəri.
2019 Azərbaycan Respublikası Səhiyyə Nazirliyi Kübra Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutunun təşkilatçılığı ilə keçirilən "Neonatologiya üzrə Azərbaycan-Türkiyə 3-cü Beynəlxalq təlim kursu". Azərbaycan Respublikası, Bakı şəhəri.
2024. Türkiyə Anesteziologiya və Reanimasiya Cəmiyyətinin təşkilatçılığı ilə 58-ci Milli Konqres. Türkiyə, Antalya şəhəri', updated_at = NOW() WHERE slug = 'sahin-mazanov';
UPDATE doctor SET bio = 'İnvaziv-kardioloq.
Elmi dərəcə: Tibb üzrə fəlsəfə doktoru

İş təcrübəsi:
2002-2017-ci illərdə aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2012-ci ildən bu günədək Respublika Diaqnostika Mərkəzində invaziv kardioloq, şöbə müdiri vəzifəsində çalışır
İngilis, rus və Azərbaycan dillərində yazılmış 25-dən çox məqalənin müəllifidir. Son 10 ildə 50-dən çox beynəlxalq konqres və simpoziumda fəal iştirak etmişdir.
2022-ci ildən ATU I-ci daxili xəstəliklər kafedrasının elmi pedaqoji fəaliyyəti ilə məşğuldur.
Hal-hazırda doktorluq dissertasiya üzrə çalışır.
İcra etdiyi əməliyyatlar:
Koronar angioqrafiya
Perkutan translyuminal koronar angioplastika (PTKA)
CRT-D
ICD implantasiyası
Elektriki kardioversiya
Peysmekerin taxılması .', updated_at = NOW() WHERE slug = 'sahin-xelilov';
UPDATE doctor SET bio = 'Haqqında:
1998 - 2004 Azərbaycan Tibb Universiteti / Müalicə işi
2004 - 2005 Mirqasım adına Respublika Klinik Xəstəxanasında internatura keçmişdir və həkim - qastroentroloq intern vəzifəsində çalışmışdır
2006 -2009 Neftçala Rayon Mərkəzi xəstəxanasında həkim - terapevt vəzifəsində çalışmışdır
2016 -2020 Baku Health Medicial Klinikasında həkim - qastroenteroloq vəzifəsində çalışmışdır
2020 - 2025 "Səmra N " MMC -yə məxsus "Nəbz " Tibb Mərkəzində həkim - qastroenteroloq vəzifəsində çalışmışdır
2025 - bugünədək Sağlam Ailə Tibb Mərkəzi / həkim - qastroenteroloq', updated_at = NOW() WHERE slug = 'sahnaz-rustemova';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2024 Mərkəzi Gömrük Hospitalının Pediatriya şöbəsində həkim pediatr

Lisenziya və sertifikatlar:
2019 Azərbaycan Tibb Assosiasiyasının Pediatriya dərnəyinin IX simpoziumu "Pediatriyada yeniliklər". Azərbaycan, Bakı
2020 64-cü Türkiyə Milli Pediatrik konqresi, Türkiyə, İstanbul.
2023 İsrail Pediatriyasının online qış məktəbi, İsrail, Beerşeba
Üzv olduğu təşkilatlar
Azərbaycan Pediatriya Cəmiyyəti', updated_at = NOW() WHERE slug = 'sahnaz-zamanli';
UPDATE doctor SET bio = 'Həkim-otorinolarinqoloq.
MediClub-da 2009-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'salahov-yasar-adil';
UPDATE doctor SET bio = 'Funksional diaqnostika həkimi (USM).
MediClub-da 2010-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'salamov-tale-akif';
UPDATE doctor SET bio = 'Şöbə: Urologiya

İş təcrübəsi:
2012-2014. Türkiyə Respublikasında Bodrum Acıbadem xəstəxanasında təcili tibbi yardım həkimi
2019-2021 Azərbaycanda özəl tibb müəssisəsində uroloq-androloq kimi fəaliyyət göstərib
2021-ci ildən Mərkəzi Gömrük Hospitalında uroloq-androloq kimi çalışır.

Lisenziya və sertifikatlar:
2015 Türkiyənin İzmir şəhərində Türkiyə Urologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən II Dünya Endouroloji konqresində "Tək böyrəkli transplant xəstəsində mövcud olan daşın qapalı cərrahiyyəsi" mövzusunda çıxış edib.
2016 Endourologiya Təşkilatının təşkilatçılığı ilə "Laparoskopik və robotik cərrahiyyə" kursu
2016 Fransa Uroloji Cəmiyyətinin təşkilatçılığı ilə "Endorulogiyanın problemləri" konqresi. Paris şəhəri, Fransa.
2017 Türkiyə Urologiya Cəmiyyətinin təşkilatçılığı ilə XXVI Beynəlxalq Urologiya konqresi. Şimali Kipr Türk Respublikası
2019 İstanbul AcıBadəm Taksim xəstəxanasının təşkilatçılığı ilə "Laparoskopik və Robotik canlı cərrahiyyə" kursu.
2022 Türkiyə Urologiya Cəmiyyətinin təşkilatçılığı keçirilən 31-ci Milli Urologiya konqresi Şimali Kipr Türk Respublikası.
2023 Azərbaycan Respublikası Səhiyyə Nazirliyinin Milli Onkologiya Mərkəzinin və Azərbaycan Onkoloqlar Cəmiyyətinin təşkilatçılığı ilə Ümummilli lider Heydər Əliyevin 100 illik yubileryinə həsr edilmiş VI Beynəlxalq Uroonkologiya Simpoziumunda iştirakçı və məruzəçi qismində iştirak edib
2025 Avropa Urologiya Cəmiyyətinin 40-cı Konfransı. İspaniya, Madrid şəhəri.
Üzv olduğu təşkilatlar
Avropa Urologiya Cəmiyyətinin üzvü
Amerika Urologiya Cəmiyyətinin üzvü
Türkiyə Uroloji Cərrahlar Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'samir-agalarov';
UPDATE doctor SET bio = 'Haqqında:
2023 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim - anestezioloq
22.07.2002 - 08.09.2022 - Neyrocərrahiyə Xəstəxanası / Həkim anestezioloq - reanimatoloq
01.08.2001 - 01.08.2002 - M.Nağıyev adına Bakı şəhər KYTYX / Həkim - intern
01.08.2001 - 30.06.2002 - M.Nağıyev adına Təcili Tibbi Yardım Xəstəxanası / Anestezioloq-reanimatoloq ixtisası üzrə internatura pilləsini bitirmiş
1995 - 2001 - N.Nərimanov adına Azərbaycan Tibb Universiteti / Həkim-pediatr ixtisası üzrə bakalavr pilləsini bitirmiş', updated_at = NOW() WHERE slug = 'samir-eybetov';
UPDATE doctor SET bio = 'Şöbə: İnvaziv Kardiologiya

İş təcrübəsi:
2007-2008 N-saylı motatıcı taborun, tibb məntəqə rəisi
2009 Türkiyə Cümhuriyyəti, Samsun Mediva özəl xəstəxanası, invaziv kardioloq
2012-ci ildən Mərkəzi Gömrük Hospitalı, invaziv kardioloq

Lisenziya və sertifikatlar:
2015 "Avropa Kardioloji Cəmiyyəti"-nin konfransı, İngiltərə, London
2016 "Avropa Kardioloji Cəmiyyəti"-nin konfransı, İtaliya, Roma
2017 "Avropa Kardioloji Cəmiyyəti"-nin konfransı, İspaniya, Barselona
2018 ESC konqresi Almaniya, Münhen
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2019 Beynəlxalq Kardiologiya (ESC 2019) konqresi, Fransa, Paris
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli konqresi, Bakı, Azərbaycan ​​​​​​​', updated_at = NOW() WHERE slug = 'samir-mustafayev';
UPDATE doctor SET bio = 'Otorinolarinqoloq-audioloq.

İş təcrübəsi:
2017-2018 ci illərdə LOR hospital otorinolarinqoloq-audioloq
2023-cü il National Prime Hospital , otorinolarinqoloq
2023 -cü ildən bu günədək Respublika Diaqnostika Mərkəzində otorinolarinqoloq-audioloq vəzifəsində çalışır.', updated_at = NOW() WHERE slug = 'samire-allahverdiyeva';
UPDATE doctor SET bio = 'Şöbə: Laboratoriya ISO 15189:2012

İş təcrübəsi:
2004-2017 Müxtəlif dövlət və özəl tibb müəssisələrində həkim- mikrobioloq kimi fəaliyyət göstərib.
2017-2020 Müxtəlif dövlət və özəl tibb müəssisələrində Molekulyar-biologiya laboratoriyasının müdüri kimi çalışıb.
2020-ci il Mərkəzi Gömrük Hospitalında həkim-laborant, PZR üzrə mütəxəssis.
2024-cü ildən etibarən Laboratoriya şəbə rəisi kimi fəaliyyət göstərir.
Nailiyyətlər
Fəlsəfə doktoru, Azərbaycan Respublikası Prezidenti yanında Ali Attestasiya Komissiyası.
2016-ci ildə Azərbaycan Respublikası Səhiyyə Nazirliyinin "Səhiyyə əlaçısı".
2021-ci ildə Azərbaycan Respublikası Dövlət Gömrük Tibbi Xidmət İdarəsinin Mərkəzi Hospitalının Laboratoriya şöbəsinin xidmətdə əldə etdiyi müvəffəqiyyət, qüsursuz xidmət və digər nailiyyətlərinə görə Fəxri fərman.

Lisenziya və sertifikatlar:
2010-2012 ABŞ-ın Xəstəliklərə Nəzarət və Profilaktika Mərkəzinin (CDC) təşkilatçılığı ilə "Sahə Epidemiologiya və Laboratoriya" üzrə təlim kursu. Gürcüstan, Tbilisi şəhəri.
2014-2017 Təhlükənin Azaldılması üzrə Müdafiə Agentliyi (TAMA) təşkilatçılığı ilə Biotəhlükəsizlik və Biomühafizə üzrə laborator təlimlər, Azərbaycan, Bakı şəhəri.
2014 TAMA-nın təşkilatçılığı Rikketsiyalar üzrə Amerika alimlərin konfransı, ABŞ, Montana ştatı.
2016 Kimyəvi, Bioloji, Radioloji, Nüvə və Partlayıcı maddələrlə bağlı Elm və Biotəhlükəsizlik üzrə dünya konqresi. Gürcüstan, Tbilisi şəhəri.
2016 Təhlükəsizlik Assossiyası (GeBSA) və Xəstəliklərə Nəzarət və İctimai Səhiyyənin Milli Mərkəzinin təşkilatçılığı ilə 12-ci Beynəlxalq Simpoziumu
Gürcüstan, Tbilisi şəhəri.
2017 Avropa Biotəhlükəsizlik Assosiasiyasının təşkilatçılığı ilə Biotəhlükəsizlik üzrə konfrans. İspaniya, Madrid şəhəri.
2018. "Təhlükəsiz qida mövzusunda təlim"-in təşəbbüsü çərçivəsində sanitariya və fitosanitariya sahələrində "Avian Influenza" hüquq mühafizə orqanlarını
gücləndirmək üçün tədbirlərinin təşkilatçılığı ilə workshop, Belarusiya, Minsk şəhəri.
2018 TAMA-nın təşkilatçılığı ilə Xüsusi Təhlükəli İnfeksiyalarla bağlı konfrans, ABŞ, Vaşinqton şəhəri.
2018 Malaziya Tibbi Elmi Tədqiqat Universitetinin təşkilatçılığı ilə Virus infeksiyalarının laborator deteksiyası və identifikasiyası mövzusunda təlim
Malaziya, Kuala-Lumpur şəhəri.
2019 TAMA-nın təşkilatçılığı ilə Ipək yolunda Biotəhlükəsizlik qaydaları üzrə Elmi konfrans, Kazaxstan, Nursultan şəhəri.
2019 ÜST-ün təşkilatçılığı ilə İmmunoferment müayinələrinin aparılması üzrə təlim Russiya, Moskva şəhəri.
2020 Azərbaycanın Səhiyyə Nazirliyinin və Türkiyənin Səhiyyə nazirliyinin təşkilatçılığı ilə COVID-19 infeksiyasının molekulyar diaqnostikası üzrə təlim, Türkiyə, Ankara şəhəri.
2020 ÜST-ün təşkilatçılığı ilə Avropa regionun Yüksək Təhlükəli Patogenlərin laborator diaqnostikası mövzusunda iclas. Austria, Vienna şəhəri.
2021ÜST-ün təşkilatçılığı ilə Laboratoriya testlərinin qiymətləndirilməsinin əsasları mövzusunda təlim, Azərbaycan, Bakı şəhəri.
2022 Dövlət Gömrük Hospitalının təşkilatçılığı ilə COVID-19 kompleks diaqnostikasında müasir yanaşmalar mövzusunda Beynəlxalq Elmi Konfrans, Dövlət Təhlükəsizliyi Xidmətinin Hərbi-Tibb Baş İdarəsinin Hərbi Hospitalı, Azərbaycan, Bakı şəhəri.
2022 Dövlət Gömrük Hospitalının təşkilatçılığı COVID-19-un Diaqnostika və müalicəsi, Metodik vəsaitin tədqimatına həsr olunmuş elmi konfrans. Azərbaycan, Bakı şəhəri.
2022 ÜST-ün təşkilatçılığı ilə Sağlamlıq üçün həmrəylik təşəbbüsü mövzusunda konfrans. Azərbaycan, Bakı şəhəri.
2022 ÜST-ün təşkilatçılığı ilə Molekulyar Epidemiologiyada Sekvensiya və Bioinformatikanın əhəmiyyəti mövzusu üzrə təlim. Azərbaycan, Bakı şəhəri.
2023 Yunanıstanın Saloniki Aristotel Universitetinin təşkilatçılığı ilə Krım-Konqo Hemorragik Qızdırma virusunun 3-cü Beynəlxalq konfransı. Yunanıstan, Saloniki şəhəri.
2026. Beynəlxalq Laborator Tibb Simpoziumunda "Snibe Maglumi X8 və VIDAS 3 platformalarında Anti-HCV anticisimlərinin təyini nəticələrinin müqayisəli analizi" mövzusunda təqdimatla çıxış edib. Pakistan, İslamabad şəhəri.', updated_at = NOW() WHERE slug = 'sebine-ibrahimova';
UPDATE doctor SET bio = 'Fizioterapevt-Reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
Qadın sağlamlığı (pelvic floor)
Bel və boyun ağrıları (mexaniki bel ağrıları)
İdmanda Rehabilitasiya
Ortopedik Rehabilitasiya
Skolioz,kifoz,lordoz

İş təcrübəsi:
2018- Gəncə Beynalxalq Xəstəxanası Təcrübəçi
2019- Nəsrəddin Tusi Klinikası - Təcrübəçi
2020- Respublilka Diaqnostika Mərkəzi Təcrübəçi
2021 - Respublika Diaqnostika Mərkəzi - Fizioterapevt
2022-Koreya Şərq Təbabəti Klinikası Fizioterapevt
2022-2023 Hacettepe Universiteti Araştırma Xəstəxanası Fizioterapevt
2023 Ankara Medifit Sporcu Sağlığı Mərkəzi Fizipterapevt
2023-2024 Koreya Şərq təbabəti Fizioterapevt
2024 Baku Medical Plaza Mərkəz Fizipterapevt
2024-2025 Yeni Klinika Fizioterapevt (davam edir)', updated_at = NOW() WHERE slug = 'sebine-tagiyeva';
UPDATE doctor SET bio = 'Şöbə: Endokrinologiya

İş təcrübəsi:
2012- cü ildən Mərkəzi Gömrük Hospitalı, həkim-endokrinoloq

Lisenziya və sertifikatlar:
2010 "Endokrin patologiyalı xəstələrdə hamiləliyin planlaşdırılması və aparılması" kursu, Rusiya, Moskva
2010 "Endokrin xəstəliyi olan qadınlarda menopauzanın aparılması" kursu, Rusiya, Moskva
2010 "Kontrasepsiyanın endokrin aspektləri" kursu, Rusiya, Moskva
2012 Ümumrusiya üzrə endokrinoloqların VI konqresi
2022 Türkiyə Endokrinoloji və Metabolizma Dərnəyinin təşkilatçılığı ilə keçirilən 43-cü Endokrinoloji və Metabolik Xəstəliklər konqresi, Türkiyə, Antalya
2023 Türkiyə Endokrinoloji və Metabolizm Dərnəyinin təşkilatçılığı ilə Türkiyə Cümhuriyyətinin 100-cü ildönümünə həsr edilmiş "ENDOCURS 7" tədbiri. Türkiyə, Bursa şəhəri.
2025. Türkiyə Endokrinoloji və Metabolizma Dərnəyinin təşkilatçılığı 46-cı Endokrinoloji və Metabolik Xəstəliklər Konqresi. Türkiyə, Antalya şəhəri.', updated_at = NOW() WHERE slug = 'sebnem-elirzayeva';
UPDATE doctor SET bio = 'Şöbə: Efferent Terapiya

İş təcrübəsi:
2022- ci ildən Mərkəzi Gömrük Hospitalı, Efferent Terapiya şöbəsinin həkimi

Lisenziya və sertifikatlar:
Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin, Mərkəzi Gömrük Hospitalının, Akademik M. Cavadzadə adına Respublika Kliniki Uroloji Xəstəxana PHŞ-nin, Azərbaycan Nefroloqlar Cəmiyyətinin, Nefrologiyanın İnkişafına Yardım İctimai Birliyinin və "EGİS Pharmaceuticals PLC" şirkətinin ölkə nümayəndəliyinin birgə təşkilatçılığı ilə keçirilən "Nefrologiyanın aktual problemləri" mövzusunda Elmi Konfrans
Üzv olduğu təşkilatlar
Azərbaycan Nefroloqlar Cəmiyyəti', updated_at = NOW() WHERE slug = 'sebnem-qedimeliyeva';
UPDATE doctor SET bio = 'Şöbə: Damar Cərrahiyyəsi

İş təcrübəsi:
2007-2012-ci illərdə Rusiya Federasiyasında ürək-damar cərrahiyyəsinin müxtəlif bölümlərini əhatə edən elmi-praktik kurslar keçmiş, bir çox konfransların, konqreslərin iştirakçısı olmuş və elmi işi barəsində məruzələrlə çıxışlar etmişdir
2009 İ.M. Seçenov adına Moskva Tibb Akademiyasının Klinik Mərkəzi, həkim-ordinator
2009-2013 İ.M. Seçenov adına Birinci Moskva Dövlət Tibb Universitetinin 1 nömrəli universitet klinik xəstəxanası, həkim-aspirant
2013-cü ildən Mərkəzi Gömrük Hospitalı, damar cərrahı
Nailiyyətlər və Üstünlüklər
Elmi jurnallarda çap olunmuş 8 məqalə ("Angiologiya və ürək-damar cərrahiyyəsi", "Həkim", "Cərrahiyyə")
Dr. Səbuhi Dadaşov Rusiya Federasiyasının İntellektual mülkiyyət üzrə Federal Xidmət idarəsində "Abdominal aortanın yukstarenal anevrizmasının müalicə üsulu" adlı 5 471 430 saylı patentin həmmüəllifdir
13.11.2012-ci ildə "Daxili yuxu arteriyasının patoloji deformasiyasının cərrahi müalicə taktikası" mövzusunda tibb elmləri namizədi elmi dərəcəsinin müdafiəsi
01.07.2015-ci ildə Azərbaycan Respublikasının Prezidenti Yanında Ali Attestasiya Komissiyasının qərarı ilə tibb üzrə fəlsəfə doktoru elmi dərəcəsi verilmişdir
​​​​​​​2018-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.

Lisenziya və sertifikatlar:
2007-2012 Rusiya Federasiyasında ürək-damar cərrahiyyəsinin müxtəlif bölümlərini əhatə edən elmi-praktik kurslar keçmiş, bir çox konfransların, konqreslərin iştirakçısı olmuş və elmi işi barəsində məruzələrlə çıxışlar etmişdir.
2011 İ.M.Seçenov adına Birinci Moskva Dövlət Tibb Universiteti - ultrasəs müayinəsi üzrə kurs
2018 19-cu Avropa Venoz Forumu. Yunanıstan. Afina
2021 LİVE (qabaqcıl innovativ damar təhsili) 2021. Yunanıstan. Saloniki
2022 LİVE (qabaqcıl innovativ damar təhsili) 2022. Yunanıstan. Larissa
2022 22-ci Avropa Venoz Forumu. İtaliya, Venesiya
2024 Azərbaycan Ürək və Damar Cərrahiyyəsi Cəmiyyətinin təşkilatçılığı, Azərbaycan Respublikası Səhiyyə Nazirliyi, TƏBİB və İcbari Tibbi Sığorta üzrə Dövlət Agentliyinin dəstəyi keçirilən "Ürək-damar cərrahlarının Şuşa Zirvəsi" adlı elmi toplantıda "Dərin venoz trombozun müalicəsində müasir yanaşma" mövzusunda təqdimatla çıxış edib. Azərbaycan, Şuşa şəhəri.
Üzv olduğu təşkilatlar
Rusiya Federasiyası Ürək-Damar Cərrahları Assosiasiyası
Avropa Damar Cərrahiyyəsi Cəmiyyəti', updated_at = NOW() WHERE slug = 'sebuhi-dadasov';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2003-2009-cu illərdə Rusiya Federasiyası, Moskva şəhərində N. İ. Piroqov adına 1 nömrəli klinik xəstəxanası, mamalıq, ginekoloji və onkoginekoloji şöbə
2009-cu ildən Mərkəzi Gömrük Hospitalı, Mama-ginekoloq
2011-ci ildə isə Almaniyanın Frauenklinik Klinikum Aschaffenburg xəstəxanasında mama-ginekoloji bölümü

Lisenziya və sertifikatlar:
2005 Ginekologiyada laporoskopiya və histeroskopiya, 1 aylıq təkmilləşmə kursu, Rusiya, Moskva
2007 Uşaqlıq boynunun patologiyası və kolposkopiya kursu, Rusiya, Moskva
2017 Mama-ginekoloqların Şərqi Avropa sammiti, Rusiya, Moskva
2018 "Mama-ginekoloqların II Avrasiya Sammiti", Rusiya, Moskva
2018 Keysəriyyə əməliyyatında yeniliklər üzrə kurs, Rusiya, Moskva
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 Böyük Britaniyanın Birminqem Qadın və Uşaq Hospitalının Qadın və Uşaq Mərkəzi Mama-ginekologiya şöbəsində təcrübə mübadiləsində iştirak edib.
Böyük Britaniya, Birminqem şəhəri
2023 Tibbi Layihələrin Təşkili Akademiyasının təşkilatçılığı ilə keçirilən "Qadın sağlamlığı və radiologiyası" konfransının "Ümumi ginekologiya" panelində "Qadın reproduktiv traktının anadangəlmə patologiyaları" mövzusunda təqdimatla çıxış edib. Azərbaycan, Bakı şəhəri.
2023. Tibbi Layihələrin Təşkili Akademiyasının təşkilatçılığı ilə keçirilən "Qadın sağlamlığı və radiologiyası" konfransının "Ümumi ginekologiya" panelində "Qadın reproduktiv traktının anadangəlmə patologiyaları" mövzusunda təqdimatla çıxış edib. Azərbaycan, Bakı şəhəri.
2023. Azərbaycan Respublikası Səhiyyə Nazirliyi K.Y.Fərəcova adına Elmi-Tədqiqat Pediatriya İnstitutu və Azərbaycan Pediatrlar Assosiasiyasının birgə təşkilatçılığı ilə "Beynəlxalq Vaxtından Əvvəl Doğulan Uşaqlar Günü"nə həsr olunmuş konfrans. Azərbaycan, Bakı şəhəri.
2024. "Sərhədsiz Ginekologiya. Təxirəsalınmaz Ginekologiya. Gözləntilər və Reallıqlar" VIII Beynəlxalq Elmi-praktiki konfrans. Qazaxıstan, Almatı şəhəri
2024. Endoskopik ginekologiyanın aktual problemlərinə həsr olunmuş "IX Endo Dubai 2024" konfransında həm iştirak edib, həm də video prezentasiya ilə çıxış edib. Birləşmiş Ərəb Əmirlikləri, Dubay şəhəri.
2025. M. Seçenov adına Birinci Moskva Dövlət Tibb Universitetinin Bakı filialının, Azərbaycan Respublikası Səhiyyə Nazirliyinin və Bakı Sağlamlıq Mərkəzinin birgə təşkilatçılığı ilə M. Seçenov adına Birinci Moskva Dövlət Tibb Universitetinin Bakı filialının 10 illik yubileyinə həsr olunmuş "Sərhədsiz ginekologiya" mövzusunda keçirilən IX konfransda Mərkəzi Gömrük Hospitalının Mama-ginekologiya şöbəsinin mama-ginekoloqu, t.ü.f.d., Sədi Allahverdiyev canlı bağlantıda "Laparoskopik total histerektomiya bilateral salpinqektomiya" əməliyyatını icra edərək master-klass verib.
2025. Uşaqlıq və Endometrioz üzrə Avropa Cəmiyyətinin təşkilatçılığı ilə keçirilən XXI Beynəlxalq Konqresdə "Uşaqlıq miomalarının cərrahi müalicəsi sonrası hamiləlik nəticələri" mövzusunda təqdimatla çıxış edib. Çexiya Respublikası, Praqa şəhəri
2025. "Sərhədsiz Ginekologiya" 10-cu Yubiley Beynəlxalq Konfransında
"Uşaqlıq miomalarının cərrahi müalicəsi sonrası hamiləlik nəticələri" mövzusunda çıxış edib. Qırğızıstan Respublikası, Bişkek şəhəri.
2025. Avropa Endoskopik Ginekologiya Cəmiyyətinin (ESGE) təşkilatçılığı ilə keçirilən 34-cü illik beynəlxalq konqresdə "Bir etapda Histeroskopik və laparoskopik miomektomiya" mövzusunda çıxış edib. Türkiyə, İstanbul şəhəri.
İCRA ETDİYİ ƏMƏLİYYATLAR
"Uşaqlıq borusunun laparoskopik xaric edilməsi"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
17 DEKABR 2015
"Histeroskopiya, döl qalıqlarının xaric edilməsi"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
13 NOYABR 2015
"Sağ yumurtalığın dermoin kisti"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
13 NOYABR 2015
"Xroniki Çanaq Peritoniti"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
12 NOYABR 2015
"Histeroskopik Polip Rezeksiyası"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
19 DEKABR 2015
"Laparoskopik Histerektomiya"
Dr. Sadi Allahverdiyev
t.f.d., mama-ginekoloq
21 DEKABR 2015
HƏKİMƏ RƏYİNİZİ BİLDİRİN!', updated_at = NOW() WHERE slug = 'sedi-allahverdiyev';
UPDATE doctor SET bio = 'Haqqında:
2017 - bugünədək Sağlam Ailə Tibb Mərkəzi / Terapevt
2015 Sertifikasiya şəhadətnaməsi / Terapiya üzrə
2004 - 2016 Həyat Klinikası / Baş həkim / terapevt
1986 - 2004 Qubadlı rayon Xanlıq kənd xəstəxanası / Baş həkim
1985 - 1986 Akademik M.Qasımov adına Respublika Klinik Xəstəxanası / Terapiya üzrə
1979 - 1985 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'sefa-memmedova';
UPDATE doctor SET bio = 'Haqqında:
2018 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim terapevt
2016 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu
1998 - bugünədək 1 saylı Bakı Dəmiryol Poliklinikası / Sahə həkimi
1996 - 1997 İnternatura. Azərsutikinti Xəstəxanası / Həkim terapevt
1989 - 1995 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'sefeq-allahyarova';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'seferov-elbrus-mehrac';
UPDATE doctor SET bio = 'Həkim-oftalmoloq.
MediClub-da 2021-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'seferova-i-rade-zu-lfu-qar';
UPDATE doctor SET bio = 'Şöbə: İnvaziv Kardiologiya

İş təcrübəsi:
2021-2022 Özəl tibb müəssisəsində invaziv kardioloq kimi çalışıb.
2022 Mərkəzi Gömrük Hospitalının Kardiologiya şöbəsində invaziv kardioloq kimi fəaliyyət göstərir.

Lisenziya və sertifikatlar:
2017 Azərbaycan Kardiologiya Cəmiyyətinin VI Milli konqresin "Kardiopulmonor Resusitasiya" kursu. Azərbaycan, Bakı şəhəri.
2017 Azərbaycan Kardiologiya Cəmiyyətinin VI Milli konqresin "Aritmologiya" kursu. Azərbaycan, Bakı şəhəri.
2018 Azərbaycan Tibb Universiteti Kardiologiya Akademiyasının təşkilatçılığı ilə keçirilən "Səyrici Aritmiya" mövzusunda 1-ci Zirvə Toplantısı. Azərbaycan, Bakı şəhəri.
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli Konqres çərçivəsində təşkil edilmiş "Qapaq xəstəlikləri" kursu. Azərbaycan, Bakı şəhəri.
2021 Azərbaycan Kardiologiya Cəmiyyətinin X Milli Konqres çərçivəsində təşkil edilmiş "Klinik Hallar ilə interaktiv EKQ" kursu.
Azərbaycan, Bakı şəhəri.
2021 Türk Kardioloji Dərnəyinin təşkilatçılığı ilə keçirilən 28-ci Milli Kardioloji Toplantı. Türkiyə, İstanbul şəhəri.
2022 "Myval" transkateter ürək qapağı, Milli Tədqiqat Kardio-cərrahiyyə Mərkəzinin təşkilatçılığı ilə keçirilən "TAVİ əsasları və Myval THV elmi, kliniki yeniləmə" təlimi. Qazaxıstan, Astana şəhəri.
2022 Azərbaycan Kardiologiya Cəmiyyətinin və Türk Kardioloji Dərnəyinin təşkilatçılığı ilə keçirilən "A-dan Z-yə Aorta" konfransı. Azərbaycan, Bakı şəhəri.
2021 Azərbaycan Kardiologiya Cəmiyyətinin təşkilatçılığı ilə keçirilən 3-cü İntervensional kardiologiya iclası. Azərbaycan, Bakı şəhəri.
2021 Rouen-Normandiya Universitetinin təşkilatçılığı ilə keçirilən
"TF-TAVİ Minimalist yanaşma" təlimi. Fransa, Rouen şəhəri.
2022 "PCRValve2022" samittində iştirak edib. Böyük Britaniya, London şəhəri.
2023 Azərbaycan Kardiologiya Cəmiyyəti İctimai Birliyinin təşkilatçılığı ilə keçirilən 5-ci İnvaziv Kardiologiya konqresində iştirak edib. Azərbaycan, Bakı şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyəti
Avropa Kardiologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'sehla-agayeva';
UPDATE doctor SET bio = 'Şöbə: Fizioterapiya və Tibbi Reabilitasiya

İş təcrübəsi:
2011 Hamburq Eppendorf Universitet Klinikasında təcrübə
2009- 2016 Özəl tibb müəssisələri, fizioterapevt-reabilitoloq
2016-cı ildən Mərkəzi Gömrük Hospitalında fizioterapevt-reabilitoloq kimi çalışır

Lisenziya və sertifikatlar:
2011 Hamburq Universitet klinikası, Almaniya
2017 Tibbi Reabilitasiya təlimi, Avstriya
2017 Tibbi Reabilitasiya üzrə seminar, Avstriya
2018 "Skolioz xəstəliyinin Schroth metodu ilə müalicəsi" təlimi, İspaniya, Barselona
2019 İspaniyanın Barselona şəhərində Scoliosis Physical Therapy School-da "Skoliozun Schroth metodu ilə müalicəsi" mövzusunda iki mərhələli kurs
2019 "Complex Core" konsepsiyası üzrə təlimdə iştirak edib, Bakı, Azərbaycan
2019 Avropa Proloterapiya məktəbinin "Spine2019" təlimi, İtaliya, Ferraro şəhəri
2022 Fizioterapiya və Reabilitasiya üzrə 16-cı Dünya Konqresi. Portuqaliya Respublikası, Lissabon şəhəri
2022 "Ürək xəstələrində poliklinik reabilitasiya mərhələləri" mövzusunda təlim, Azərbaycan, Bakı
Üzv olduğu təşkilatlar
Ağrının Tədqiqatı üzrə Beynəlxalq Assosiasiya
"DÜZ QAMƏT - SAĞLAM HƏYAT!"
Sağlam və gözəl görünmək istəyirsinizsə "DÜZ QAMƏT - SAĞLAM HƏYAT!" rubrikamızı izləyin. Rubrikanı Mərkəzi Gömrük Hospitalının tanınmış həkimi, Barselona Skolioz Məktəbində ixtisaslaşmış həkim-fizioterapevt Səidə Kərimova təqdim edir.', updated_at = NOW() WHERE slug = 'seide-kerimova';
UPDATE doctor SET bio = 'Haqqında:
• 2019 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim - oftalmoloq • 1982 - 2023 - Gəncə ş. Göz xəstəxanası/ Uşaq şöbəsinin şöbə müdiri/ Həkim oftalmoloq • 1976 - 1982 - Gəncə ş. 2 nömrəli Uşaq xəstəxanası/ Həkim - oftalmoloq • 1975 - 1976 - İnternatura-Mərkəzi birləşmiş şəhər xəstəxanası/ Həkim - oftalmoloq • 1969 - 1975 - Azərbaycan Tibb Universiteti / Pediatriya', updated_at = NOW() WHERE slug = 'seide-mustafayeva';
UPDATE doctor SET bio = 'Həkim-kardioloq.
MediClub-da 2015-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'semedli-ferhad-elovset';
UPDATE doctor SET bio = 'Həkim-ginekoloq.
MediClub-da 2024-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'serifzade-lale-namiq';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2017-2019. İstanbul Universitetinin Tibb fakültəsində Anesteziologiya və Reanimatologiya şöbəsində elmi işçi
2019-cu ildən Mərkəzi Gömrük Hospitalında anestezioloq-reanimatoloq kimi çalışır.
Nailiyyətlər və Mükafatlar
Türkiyə Anesteziologiya və Reanimasiya Dərnəyinin təşkilatçılığı ilə keçirilən 53-cü Ulusal Konqresi çərçivəsində Alparslan Turan adına keçirilən klinik araşdırma yarışmasında "Laparoskopik əməliyyatlarda fərqli intraoperativ oksigen inspirasiya fraksiyalarının qlikokaliks üzərinə təsiri" adlı çalışması ilə birinci yerə layiq görülmüşdür.
2021 Azərbaycan Respublikası Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2021 Azərbaycan Respublikası Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2026. Həmmüəllifi olduğu "Laparoskopik cərrahiyyə zamanı perioperativ hiperoksiyanın ağciyər epitelinə və endotel qlikokaliksinə aid biomarkerlərə erkən təsirinin Prospektiv randomizə olunmuş tədqiqi" adlı elmi məqalə beynəlxalq nüfuzlu MDPI nəşriyyatının Life jurnalında dərc olunub. Bu tədqiqat daha əvvəl Türkiyə Anesteziologiya və Reanimasiya Cəmiyyətinin (TARK) Klinik Tədqiqatlar Müsabiqəsində təqdim olunaraq "Klinik tədqiqat" kateqoriyası üzrə birinci yerə layiq görülmüşdü.

Lisenziya və sertifikatlar:
2018 Türkiyə Anesteziologiya və Reanimasiya Dərnəyinin təşkilatçılığı ilə keçirilən Pediatrik Anestezioloji simpozium. Türkiyə, İstanbul şəhəri.
2017 Türkiyə Reanimasiya Dərnəyinin təşkilatçılığı ilə keçirilən XXVIII Mexaniki Ventilasyon kursu. Türkiyə, İstanbul şəhəri.
2015 XX "İntensiv terapiya" simpoziumu. Türkiyə, İstanbul şəhəri.
Üzv olduğu təşkilatlar
Azərbaycan Reanimatologiya və Anesteziologiya Cəmiyyətinin üzvü', updated_at = NOW() WHERE slug = 'sevda-huseynova';
UPDATE doctor SET bio = 'Şöbə: Dermatovenerologiya

İş təcrübəsi:
1996-2009 Dövlət tibb müəssisəsində həkim-dermatoveneroloq kimi çalışıb
2009- cu ildən Mərkəzi Gömrük Hospitalı, həkim-dermatoveneroloq
Mükafatlar
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2009 "Dəri-zöhrəvi xəstəliklərin müasir diaqnostika və müalicəsi" kursu, Avstriya, Zalsburq
2013 "Dəri xəstəliklərində müasir patomorfoloji tədqiqatlar" üzrə seminar, Şotlandiya, Edinburq
2014 "Dermatologiya və kosmetologiyada lazer aparatlarının tətbiqi" kursu, İtaliya, Florensiya
2017 "Molekulyar diaqnostika" kursu, Avstriya, Vyana
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2023 Ümummilli Lider Heydər Əliyevin anadan olmasının 100 illiyinə həsr olunan Azərbaycan Dermatoveneroloqlar Elmi Cəmiyyətinin təşkilatçılığı ilə Estetik Tibb, Dermatologiya və Kosmetologiya üzrə Birinci Elmi-Praktik Beynəlxalq Konfrans. Azərbaycan, Bakı şəhəri.
2023 Türkiyə Dermatoveneroloji Dərnəyinin təşkilatçılığı ilə keçirilən "Ege Dermatologiya Günləri" tədbiri. Türkiyə, İzmir şəhəri.
Üzv olduğu təşkilatlar
Türk Dermotoloji Dərnəyi
Avropa Asiya Dermotoloqlar Cəmiyyəti
Rusiya Dermotoloji Dərnəyi', updated_at = NOW() WHERE slug = 'sevinc-kerimova';
UPDATE doctor SET bio = 'Şöbə: Kardiologiya

İş təcrübəsi:
2001-2011 Dövlət tibb müəssisələrində kardioloq kimi çalışıb
2012-cü ildən etibarən Mərkəzi Gömrük Hospitalında həkim-kardioloq kimi çalışır.

Lisenziya və sertifikatlar:
2018 Azərbaycan Kardioloqlar Cəmiyyətinin VII Milli Konqresi
2019 Azərbaycan Kardiologiya Cəmiyyətinin VIII Milli konqresi, Azərbaycan, Bakı
Üzv olduğu təşkilatlar
Azərbaycan Kardioloqlar Cəmiyyəti', updated_at = NOW() WHERE slug = 'sevinc-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Fizioterapiya xidmətləri:
1. Elektroterapiya
TENS (ağrıkəsici impulslar)
Ultrasəs terapiyası
Elektrostatik stimulyasiya (EMS)
2. Termoterapiya
İsti və ya soyuq tətbiqlər (kompresslər, parafin)
3. Manual terapiya
Əllə tətbiq olunan texnikalar (masaj, manipulyasiya)
4. Maqnitoterapiya
Aşağı tezlikli maqnit sahələri ilə müalicə
5. Miostimulyasiya
Əzələ tonusunu artırmaq və atrofiya qarşısını almaq üçün
Reabilitasiya Xidmətləri:
1. Ortopedik Reabilitasiya
Qırıq, çıxıq, əməliyyat sonrası hərəkət bərpası
2. Nevroloji Reabilitasiya
İnsult, parkinson, iflic sonrası funksiyaların bərpası
3. Uşaq Reabilitasiyası
Serebral iflic, inkişaf geriliyi olan uşaqlar üçün
4. İdman Reabilitasiyası
İdmançılarda travma sonrası bərpa
Əlavə Xidmətlər:
Fiziki məşqlər və individual proqramlar
Postural korreksiya və duruş düzəldilməsi
Skolioz, kifoz, lordoz və onurğa problemi terapiyası
Bel və boyun yirtigi
Protruziyalar
Oynaq xəstəlikləri
Artiroz artirit
Ağrıkəsici kompleks müalicə metodları
Travmatoloji Reabilitasiya
Donmuş çiyin müalicəsi
Massaj
Yastıpəncəlik
Pilates', updated_at = NOW() WHERE slug = 'sima-zeynalova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ortopediya-Travmatologiya, İdman həkimliyi və Fizioterapiya

Fəaliyyət sahələri:
Elektroterapist
İdman fizioterapiyası
Manual terapiya və mobilizasiya
Quru iynə
Kinoziateyp
Sensor inteqrasiya və osteopatiya

İş təcrübəsi:
2011-2012 Fizioterapevt, Sevgi Tibb Mərkəzi, Türkiyə, Malatya
2012-2013 Fizioterapevt, Muş Dövlət Xəstəxanası, Türkiyə, Muş
2013-2014 Fizioterapevt, Özəl Gözdə Xəstəxanası, Turgut Ozal Araşdırma Xəstəxanası, Türkiyə, Malatya
2014-2015 Fizioterapevt, Therapy Sport Center, GATA Kadıköy, Türkiyə, İstanbul
2015-2016 Fizioterapevt,Cerrahpaşa, Çapa, Gata və İstanbul FTR, Türkiyə, İstanbul
2016-2017 Fizioterapevt, Mehmet Akif Ersoy Kalp Damar Xəstəxanası, Avropa Özəl Eğitim Mərkəzi, Türkiyə, İstanbul
2017-2018 Fizioterapevt, ROMATEM, Türkiyə, Bursa
2017-2018 Fizioterapevt,ROMATEM Bağdat Caddesi, Türkiyə, İstanbul
2017-2018 Fizioterapevt,ROMATEM Beşiktaş, Fulya, Türkiyə, İstanbul
2018 - Fizioterapevt (bioloji aktiv nöqtələrinin masajisti), Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'sinan-yilmaz';
UPDATE doctor SET bio = 'Haqqında:
2017 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim
2016 Sertifikasiya, Şüa diaqnostika üzrə
1991 - 2016 1 nömrəli Doğum evi, Şüa diaqnostika üzrə həkim
1989 - 1991 1 nömrəli Doğum evi, Həkim mama ginekoloq
1989 Sumqayıt şəhər poliklinası, Sahə həkimi
1985 - 1989 Ordinatura, Pulmonologiya üzrə
1984 - 1985 Kirov rayonu 1 nömrəli poliklinası, Həkim pulmonoloq
1982 - 1984 8 saylı tibb mərkəzi, Həkim terapevt
1980 - 1982 Naxçıvan Muxtar Respublikası Bədən Tərbiyə Dispanseri, Sahə həkimi
1979 - 1980 İnternatura, Əfəndiyev adına 4 nömrəli şəhər xəstəxanası, Terapiya üzrə
1973 - 1979 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'sudabe-quliyeva';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 't-e-d-dr-zaur-xelilov';
UPDATE doctor SET bio = 'Haqqında:
2019 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim- uroloq
2003 - bugünədək Azərbaycan Tibb Universiteti, Urologiya kafedrası/ Assistent
2018 - 2019 Ege Universitesi Tıp fakültesi Uroloji Anabilim Dalı/ Genel Uroloji, Endouroloji və Androloji kurs
2017 - 2018 Sağlam Ailə Tibb Mərkəzi / Həkim- uroloq
2009 - Tibb Elmləri namizədi
2005 - 2008 - Aspirantura, Azərbaycan Tibb Universiteti / Urologiya
2003 - 2005 - Ordinatura, Azərbaycan Tibb Universiteti / Urologiya
2002 - 2003 - İnternatura / A. T. Abbasov ad. Şəhər Onkoloji dispanser/ Uşaq onkoloqu
2000 - 2002 ET Travmotologiya və Ortopediya İnstututu/ Tibb qardaşı
1996 - 2002 Azərbaycan Tibb Universiteti / Həkim-pediatr', updated_at = NOW() WHERE slug = 't-e-d-rafiq-huseynzade';
UPDATE doctor SET bio = 'Bakıdan dəvətli İnvaziv uşaq kardioloqu.', updated_at = NOW() WHERE slug = 't-e-n-dr-elnur-imanov';
UPDATE doctor SET bio = 'Otorinolarinqoloq.

Konfranslar:
1978-2024-cü illər Bakı şəhəri, ADHTİ, Moskva MHTİ, dəfələrlə ixtisaslaşma və təkmilləşmə kursları
1986-1989-cu illər Moskva MHTİ, aspirantura təhsili
1989-cu ildə "Pazabənzər cibin iltihabı zamanı mikrocərahi əməliyyatlar" mövzusunda tibb üzrə namizədlik dissertasiyasiyasının müdafiəsi, Rusiya, Moskva
2024-cü il - Sertifikasiya kursu', updated_at = NOW() WHERE slug = 't-e-n-dr-huseyn-agayev';
UPDATE doctor SET bio = 'Mütəxəssis.', updated_at = NOW() WHERE slug = 't-e-n-dr-mahir-dumanov';
UPDATE doctor SET bio = 'Əməkdar həkim, Mama-ginekologiya şöbəsinin müdiri.', updated_at = NOW() WHERE slug = 't-e-n-dr-mahire-ismayilova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Ağır ürək xəstələrinin kompleks müalicəsi
Kəskin və xroniki ürək patologiyaları ilə müraciət edən pasiyentlərin klinik qiymətləndirilməsi
Aritmiya, ürək çatışmazlığı hallarında medikamentoz və həyat tərzi əsaslı müalicə protokolları
Arterial Hipertoniya və onun ikincili səbəblərinin araşdırılması, Yüksək qan təzyiqi olan xəstələrin ətraflı klinik və instrumental qiymətləndirilməsi
İkincili hipertoniya səbəblərinin (böyrək xəstəlikləri, endokrin pozğunluqlar və s.) diaqnostikası, müasir dərman protokolları və həyat tərzi dəyişiklikləri ilə müalicə və monitorinq
Ürəyin işemik xəstəliyi və xroniki ürək çatışmazlığının müayinə və müalicəsi
Miokardın qanla təminatının pozulması (İşemik ürək xəstəliyi - İÜX) zamanı risklərin qiymətləndirilməsi
Stenokardiya, miokard infarktı sonrası nəzarət və müalicə
Xroniki ürək çatışmazlığı hallarının mərhələyə uyğun idarə olunması
Anadangəlmə və qazanılmış Ürək qüsurlarının aşkarlanması və dəyərləndirilməsi
Kardioloji İnstrumental və Funksional Diaqnostik Müayinələr
EKQ (Elektrokardioqrafiya)
EXO-KQ (Exokardioqrafiya) - Ürəyin ultrasəs müayinəsi
Tredmill Stress EKQ Testi - Fiziki yüklənmə altında ürək fəaliyyətini qiymətləndirməsi
24 Saatlıq Qan Təzyiqi Monitorinqi (BP-Holter)
24-48-72 Saatlıq Ritm-Holter Monitorinqi

Konfranslar:
2016-cı il Atrial fibrilasiyanın diaqnostika və müalicəsinin aktual problemləri, Moskva
2017-ci il Rusiya Xalqlar Dostluğu Universiteti (RXDU) - "Funksional Diaqnostika" kursu (3 ay)
2018-ci il Rusiya Milli Kardioloqlar Konqresi, Moskva
2020-ci il 15 Milli Terapevtlər Konqresi (məruzə ilə Konqres iştirakçısı), Moskva
2020-ci il ESC, Heart Failure Congress (məruzə ilə iştirakçı), Barselona
2021-ci il ESC, Heart Failure Congress (məruzə ilə iştirakçı), Florensiya
2021-ci il Rusiya Milli Kardioloqlar Konqresi (məruzə ilə Konqres iştirakçısı), Moskva
2021-2022-ci illər Rusiya Xalqlar Dostluğu Universiteti, Davamlı Tibb Təhsili Fakültəsi - Kardiologiya üzrə Peşəkar İnkişaf Sertifikatı
Bir sıra Elmi nəşrlər və tədqiqatların müəllifi olmuşdur.', updated_at = NOW() WHERE slug = 't-e-n-dr-sebuhi-memmedov';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Proktoloq - Moskva Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Rusiya, Moskva
Kəşf Toxumalarda kanal yaratmaqla rektal fistulektomiyada tətbiqi - (№118779), Rusiya, Moskva
Ümumi cərrahiyə, proktoloqiya - Proktoloqiya institutu, Rusiya, Moskva
Düz bağırsağın murəkkəb fistullarının cərrahi müalicəsi - Azərbaycan, Bakı
Yoğun və duz bağırsağın travmatik zədələnmələri - Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutu, Azərbaycan, Bakı

İş təcrübəsi:
1973 -1977 Hərbi həkim-ümumi cərrah, şöbə mudiri, Hərbi Hospital, Azərbaycan, Bakı
1977-1979 Həkim-ümumi cərrah, 22№-li Bakı şəhər poliklinikası, Azərbaycan, Bakı
1979-1984 Assistant (proktologiya kursu), Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdimə İnstitutu, Proktologiya kafedrası, Azərbaycan, Bakı
1984 -1986 Həkim-ümumi cərrah, Ə. Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutun Klinikası, Azərbaycan, Bakı
1986-1990 Həkim-ümumi cərrah, şöbə mudiri AR Səhiyyə Nazirliyinin 4-cu Baş İdarənin 1 nömrəli Poliklinikası, Azərbaycan, Bakı
1990-2000 Həkim-ümumi cərrah, AR Səhiyyə Nazirliyinin 1 nömrəli xəstəxanası, Azərbaycan, Bakı
2000 Həkim-ümumi cərrah,proktoloq, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 't-e-n-dr-xudayar-mustafayev';
UPDATE doctor SET bio = 'Haqqında:
2008 - bugünədək Sağlam Ailə Tibb Mərkəzi, Həkim endokrinoloq
2007 - Azərbaycan Tibb Universiteti, Dosent
1990 - 2007 Azərbaycan Tibb Universitetinin Daxili xəstəliklər kafedrası, Assistent
1990 Tibb Elmləri Namizədi, Azərbaycan Tibb Universiteti, Daxili xəstəliklər kafedrası
1987 - 1990 Azərbaycan Tibb Universiteti daxili xəstəxanası , Aspirant
1984 - 1987 Sumqayıt şəhər Bərpa müalicə xəstəxana intensiv terapiya
1983 - 1984 Sumqayıt şəhər 1saylı poliknika , Sahə həkimi
1982 - 1983 İnternatura. Sumqayıt şəhər 1 № poliknika
1976 - 1982 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 't-e-n-eli-ibrahimov';
UPDATE doctor SET bio = 'Haqqında:
2012 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim oftalmoloq
2010 Türkiyə İstanbul Lazile kursu / ESCRS Qış konfransı
2009 Hindistan / Fakoemulsifikasıya kursu
2008 - bugünədək Modern Hospital / Həkim oftalmoloq
2005 - 2007 Rusiya Diplomdan sonraki Tibb Akademiyası / Həkim oftalmoloq
2001 - 2004 Caspian Compassion Project göz klinikası / Həkim oftalmoloq
2001 Tibb Elmləri Namizədi / Alimlik dərəcəsi
1994 - 1996 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu / Göz Xəstəlikləri kafedrası / Həkim oftalmoloq
1992 - 2001 Milli Təhlükəsizlik Nazirliyi Hərbi Hospitalı / Həkim oftalmoloq
1992 - 1994 Klinik Ordinatura / Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu
1990 - 1992 Göz Xəstəxanası / Həkim oftalmoloq
1989 - 1990 Göz Xəstəlikləri İnstitutu / Həkim oftalmoloq
1983 - 1989 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 't-e-n-elmira-mayilova';
UPDATE doctor SET bio = 'Haqqında:
2018 - bugünədək Sağlam Ailə tibb mərkəzi, həkim kardioloq
2017 Avropa Kardiologiya Cəmiyyəti, Professional üzvlük
2015 Azərbaycan Respublikası Prezident yanında Ali Attestasiya Komissiyası, Fəlsəfə doktoru elmi dərəcəsi
2015 - 2018 Avrasiya Hospitalı, Həkim kardioloq
2014 Sertifikasiya, Kardiologiya üzrə
2013 - 2014 Müasir Diaqnostika Klinkası, Həkim kardioloq
2011 - 2013 Salyan Mərkəzi Rayon Xəstəxanası, Kardiologiya şöbəsinin müdiri
2010 - 2017 Salyan Mərkəzi Rayon Xəstəxanası, Həkim kardioloq
2004 - 2007 Medical İnternational Relife, Həkim kardioloq, EXOKQ mütəxəsisi
1993 - 2010 Salyan Rayonlarası Kardioloji Dispanseri, Həkim kardioloq
1992 - 1993 İnternatura, Salyan Rayon Mərkəzi Xəstəxanası, Kardiologiya
1986 - 1988 Sovet ordusunda həqiqi hərbi xidmət
1984 - 1992 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 't-f-d-azer-melikov';
UPDATE doctor SET bio = 'Patohistologiya üzrə mütəxəssis.

Konfranslar:
National 9th Forensic Type Workshop by Namik Kemal University - Tekirdag, Turkiye, 2019-10-11 - 2019-10-13
International Medical Seminar - Salzburg, Austria, 2023-05-21 - 2023-05-27American-Austrian Foundation
International Medical Seminar on the specialty "Pathology" organized by the Open Medical Institute
2nd International Congress.
Rare localized lipomatosis. Science & Justice. ITAC 2018. 2nd International Congress.
1st International Conference One Health: Problems & Solutions. 2018
Unusual cholesterol crystals in renal tubules. Proceedings of 1st International Conference
One Health: Problems & Solutions. June 1-2 2018, Kazar University, Baku, Azerbaijan, p. 68.1.
International scientific conference
Structural changes in the liver during burn toxemia. R. A. Askerov ''''Materials of the international scientific conference collection dedicated to the 85th anniversary of his birth"
1st International conference on immunopathological diseases. 2019
Morphofunctional changes in organs of immunogenesis during burn sepsis.
Program and abstracts of the 1st International conference on immunopathological diseases. 2019
One health: Problems and solutions. 2019
Determination of lipopolyccaharides with the anti-lipid A antibody immunohistochemical staining in kidneys of died from peritonitis.
36th National Nephrology Congress, 29th National Nephrology Congress nursing congress. Antalya, Turkiye, 2019
Kidney histopathology in sepsis-induced rats and ascorbic acid in the same model. Investigation of its protective effect.
36th National Nephrology Congress, 29th National Nephrology Congress nursing congress. Antalya, Turkiye, 2019
Pathomorphology depending on the stage of chronic kidney disease in patients with chronic glomerulonephritis changes.
Scientific research on pediatric surgery dedicated to the 80th anniversary of the Department of Pediatric Surgery of the University practical congress materials, 2019
Kidney after treatment with lasix in animals modeled with acute ischemia comparative assessment of ultrastructural changes in parenchyma.
17th International Euroasian Congress of Surgery and Hepatogastroenterology. 2019
Characteristics renal parenchyme after nefroprotective anti-iscemic treatment and interstitsial ultrastructural chanes(experimental research).
57th ERA-EDTA Congress Abstracts. Nephrology Dialysis Transplantation
Features of ultrastructural changes in kidney tissue in the patients who have passed away as a result of sepsis. 57th ERA-EDTA Congress Abstracts. Nephrology Dialysis Transplantation.
3rd Karabakh International Congress of Applied Scienes "Year of Shusha-2022"
7th International European Conference On Interdisciplinary Scientific Research. Frankfurt, Germany, 2023
9th International Paris Congress on Social Sciences and Humanities.Paris, France, 2023
Ibishova A.V. Ganbaeva S. Gulieva K. C. Nigar Mustafayeva. Tarana Gasımova. Gunel Ganiyeva. Individual typological features of the pteycomaxillary fissure.
2th Silk Road International Scientific Research Conference. Turkiye, 2023
Ibishova A.V. Ganbaeva S. Gulieva K. C. Aliyeva Ş. Aliyeva G. Kerimova İ. Rare localalized lipoma of the spleen.
3th International Anatolian Scientific Research Conference. Kayseri, Turkiye, 2022
Hasanov R.P. Ibishova A.V. Morphology of drug-toxic hepatitis and viral hepatitis comparison according to characteristics.
Student Scientific Society conference- Ibishova A.V. Niftaliyev R.N. Kearn-Sayre the importance of determining the syndrome at the mitochondrial level. Euroimmun Academy 2022
Anti-PLA2R and other biomarkers in the diagnosis of Membranous Nephropathy Organized by Euroimmun Academy. USA. Euroimmun Academy 2022
Online Certificate Course entitled, "The Role of PLA2R testing in pre-and post renal transplantant monitoring in Membranous Nephropathy" Organized by Euroimmun Academy USA.', updated_at = NOW() WHERE slug = 't-u-f-d-dr-arzu-ibisova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
USM (ginekoloji və mamalıq)
Ginekoloji əməliyyatlar (medikamentoz və cərrahi abort, bartolin vəzinin kistasının marsupilizasiyası/götürülməsi, uşaqlıq boynunun diatermoelektrokoaqulasiyası (Surgitron və s. apparatı), uşaqlıq boşluğunun və uşaqlıq boynunun diaqnostik qaşınması, polipektomiya, histeroskopiya, histerorezektoskopiya, miomektomiya, uşaqlığın amputasiya, uşaqlığın ekstirpasiyası, ön və arxa kolporrafiya )
Sonsuzluğun müalicəsi
Hamiləliyin aparılması
Qeysəriyyə və təbii doğuşların aparılması
Laparoskopik əməliyyatlər (tubektomiya, adneksektomiya, kistektomiya, adgeziolizis, yumurtalıqların kauterizasiyası, xromogidrotubasiya, sterilizasiya)

Konfranslar:
2006-2011-ci illərdə "Ana va uşaq" forumu (Rusiya Federasiyası)
2014-cü ildə Rusiya FTBA ixtisas artırma institutu (Rusiya Federasiyası)
2014-cü ildə "Yuxarı riskli hamiləlik" konferensiya (Rusiya Federasiyası)
2015-ci ildə "Ginekologiyada endoskopiya" klinik kursu (Rusiya Federasiyası)
2015-ci ildə "Kolposkopiya" kursu (Rusiya Federasiyası)
2015-ci ildə "Vaxtından əvvəl doğuş" (Rusiya Federasiyası)
2016-cı ildə Preklamsiyanın müasir diaqnostika və müalicəsi" (Azərbaycan)
2016-cı ildə Həkimlərin sertifikasiyası (Azərbaycan)
2018-ci ildə "Ginekologiyada yeniliklər" (Azərbaycan)
2019-cu ildə "Mamalıqda təkmiləşdirilmiş təxirəsalınmaz tibbi yardım"', updated_at = NOW() WHERE slug = 't-u-f-d-dr-aynur-muxtarova';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Neyrocərrahiyyə - Ankara Nümune Eğitim ve Araştırma Hastanesi, Türkiyə, Ankara
Mikrocərrahiyyə - Mikrocərrahi Eğitim ve Araştırma Mərkəzi, Türkiyə, Ankara

İş təcrübəsi:
1980-1984 Həkim-cərrah, Xankəndi Tibb Mərkəzi, Azərbaycan, Xankəndi
1984-1988 Həkim-cərrah, Sabunçu Tibb Mərkəzi, Azərbaycan, Bakı
1990-2000- Həkim-cərrah, Respublika neyrocərrahiyyə xəstəxanası, Azərbaycan, Bakı
2001- Həkim-neyrocərrah Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 't-u-f-d-dr-eli-elekberov';
UPDATE doctor SET bio = 'Baş həkim əvəzi (Ambulatoriya) / mütəxəssis.

Şöbə: Uşaq cərrahiyyəsi

Fəaliyyət sahələri:
Uşaq ümumi cərrahiyyəsi
Uşaq döş qəfəsi orqanlarının cərrahiyyəsi (Torakal)
Uşaq Urologiyası
Uşaq Travması

İş təcrübəsi:
2004-2005 Həkim-cərrah, Mərkəzi Neftçilər Xəstəxanası, Azərbaycan, Bakı
2012 Həkim-uşaq cərrahı, Mərkəzi Klinika, Azərbaycan Bakı
2021 Pedaqoji fəaliyyət, RF səhiyyə Nazirliyinin Federal Dövlət Muxtar Ali Təhsil Müəssisəsi.İ.M. Seçenov adına birinci Moskva Dövlət Tibb Universitetinin Bakı fililalı Uşaq Cərrahiyyəsi kafedrası, Azərbaycan, Bakı
2025 Uşaq Cərrahiyyəsi şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı
2026 Baş həkim əvəzi (Ambulatoriya)', updated_at = NOW() WHERE slug = 't-u-f-d-dr-fuad-huseynov';
UPDATE doctor SET bio = 'Qastroenteroloq-Hepatoloq, Qaraciyər xəstəliklərinin müalicə və diaqnostika mərkəzinin rəhbəri.

Fəaliyyət sahələri:
Qaraciyər xəstəliklərinin diaqnostika və müalicəsi
Qaraciyərin piylənməsi (steatoz)
Xroniki hepatitlər (Hepatit B, C və digər virus mənşəli hepatitlər,alqokollu hepatitlər)
Qaraciyər sirrozu və onun fəsadları
Autoimmun və dərman mənşəli qaraciyər xəstəlikləri
Öd kisəsi və öd yolları xəstəliklərinin diaqnostika və müalicəsi
Öd daşı xəstəliyi (xolesistit)
Öd yollarında iltihab və tıxanma (xolangit)
Funksional öd disfunksiyası
Mədə-bağırsaq traktının iltihabi və funksional xəstəliklərinin diaqnostika və müalicəsi
Qastrit, mədə və onikibarmaq bağırsaq xorası
Refluks xəstəliyi (GERD)
İrritabl bağırsaq sindromu (IBS)
Kron və xoralı kolit kimi iltihabi bağırsaq xəstəlikləri (IBD)
Pankreas xəstəliklərinin diaqnostika və müalicəsi
Pankreatit (kəskin və xroniki)
Pankreasın funksional pozuntuları

Konfranslar:
2004 - 2021-ci illər APASL (spiker)
2004 - 2013-ci illər Rusiya Qastroenteroloqlar və Hepatoloqlar Assosiasiyanın illik Konqresi (spiker)
2021 Fevral - APASL- Asiya-Sakit Okean qaraciyər tədqiqatları Assosiasiyasının İcra Komitəsinin üzvü', updated_at = NOW() WHERE slug = 't-u-f-d-dr-gulnare-agayeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Şəkərli diabet (Tip 1, Tip 2)
Şəkərsiz diabet
Piylənmə
Hipotireoz
Qreyvs xəstəliyi
Tiroiditlər
Düyünlü ur
Osteoporoz, osteopeniya
Böyüklərdə boy hormonu çatışmazlığı
Hiperprolaktinemiya sindromu
Menopauzal sindrom

Konfranslar:
Oktyabr, 1997 - Therapeutic Educational Programmes, Grimenitz, İsveçrə
İyun, 1999 - Azər-Türk Diabet Proqramı çərçivəsində aylıq təlim kursu, İstanbul, Türkiyə
2015-2017 - Academy of Diabetology - Diabetik Pasiyentlərin Maarifləndirilməsi (vebinarlar)
Oktyabr, 2019 - IDF Online Course on Prevention of Type 2 Diabetes
Aprel, 2021 - American Diabetes Association - Clinical Diabetes Kursu', updated_at = NOW() WHERE slug = 't-u-f-d-dr-gulnare-isgenderli';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mammoloq-Onkoloq.

Fəaliyyət sahələri:
Süd vəzisində olan ağrılar
️- Süd vəzisinin dishormonal vəziyyəti
️- Süd vəzisində əllə hiss olunan törəmələr: kista, fibroadinoma
️Gilədən müxtəlif rəngli ifrazatın gəlməsi, axardaxili papilomalar
️- Süd vəzisinin iltihabi xəstəlikləri
Süd vəzisi xərçənginin müasir protokollara uyğun müalicəsi
️- Süd vəzisi xərçəngində orqanqoruyucu və onkoplastik əməliyyatlar
️- Süd vəzisinin xoşxassəli şişləri üzrə estetik əməliyyatları
️- Süd vəzilərinin böyüdülməsi
️- Süd vəzilərinin kiçildilməsi
️- Süd vəzilərinin dikləşdirilməsi
️- Fərqli ölçülü süd vəzilərinin eyniləşdirilməsi.', updated_at = NOW() WHERE slug = 't-u-f-d-dr-gunay-ehmedova';
UPDATE doctor SET bio = 'Cərrah, Proktoloq.

Fəaliyyət sahələri:
Babasilin lazer üsulu ilə müalicəsi (lazer hemoroidektomiya)
Anal çatın müalicəsi
Anal çatın botoks üsulu ilə müalicəsi
Anal kondilomların lazer üsulu ilə götürülməsi
Lazer prosedurları
Anal fistulanın seton üsulu ilə müalicəsi
Rektovaginal fistulaların müalicəsi
Anal poliplərin götürülməsi (polipektomiya)
Rektoskopiya
Vaginal problemlərin müalicəsi
Doğuş sonrası aralıq və anal bölgənin bərpası
Nəcis qaçırtmanın (inkontinensiyanın) müalicəsi
Sidikqaçırmanın müalicəsi
Rektosel əməliyyatı
Sistosel əməliyyatı
Büzdümün dermoid kistasının lazer əməliyyatı
Anal saçaqların ləğvi
Tükdönməsinin lazer üsulu ilə əməliyyatı
Dərinin biopsiyası və götürülməsi
Doğuş travmalarının müalicəsi
Digər proktoloji əməliyyatlar', updated_at = NOW() WHERE slug = 't-u-f-d-dr-kemale-qasimova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Bətndaxili infeksiya ilə doğulan uşaqların (CMV, Herpes, Toksoplazmoz,Xlamidioz, Vərəm, Hepatit və s.) müayinələri
Sepsis
Yenidoğulmuşun hemorragik pozğunluqları
Yenidoğulmuşun hemolitik xəstəliyi
Yenidoğulmuşların anemiyası
Yenidoğulmuşların müayinələri və 1 yaşa qədər aylıq rutin müayinələrinin aparılması
Uşaqlarda böyümə və inkişafın dəyərləndirilməsi
Peyvəndləmə
Ağ ciyər xəstəlikləri
Allergik xəstəliklər
Mədə- bağırsaq sistemi xəstəlikləri
Böyrək və sidik sistemi xəstəlikləri və s.

Konfranslar:
1991-1994-cü illərdə K.Y.Fərəcova adına Elmi -Tədqiqat Pediatriya İnstitutunda Neonatologiya üzrə Klinik ordinatura keçmişdir.
1994-2000-ci illərdə K.Y.Fərəcova adına Elmi -Tədqiqat Pediatriya İnstitutunda Neonatologiya üzrə aspirantura keçmişdir.
2012-ci ildə Ə.Əliyev adına Həkimlərin Təkmilləşdirmə İnstitutunda Sertifikasiya imtahanın keçmişdir.
2017-ci ildə Ə.Əliyev adına Həkimlərin Təkmilləşdirmə İnstitutunda Sertifikasiya imtahanın keçmişdir.', updated_at = NOW() WHERE slug = 't-u-f-d-dr-lolita-sirinova';
UPDATE doctor SET bio = 'Mama-Ginekoloq.

Fəaliyyət sahələri:
Sonsuz cütlüklərin müayinə və müalicəsi
Normal və riskli hamiləlik təqibi
Təbii doğuş
Qeysəriyyə əməliyyatı
Zahı müşahidəsi
Cinsi yolla keçən və iltihabi xəstəliklərin müayinəsi və müalicəsi
Kolposkopiya
Histerosalpinqoqrafiya
Histeroskopiya
Bütün növ kiçik və böyük ginekoloji əməliyyatlar

Konfranslar:
2005-ci ildə - "Мать и дитя", Moskva, Rusiya
2007-ci ildə - "Здоровье будущих поколений: новые технологии и новые возможности медицины", Moskva, Rusiya
2007-ci ildə - "Мать и дитя", Moskva, Rusiya
2013-cü ildə - International Symposium "Actual problems of modern perinatology", Bakı, Azərbaycan
2014-cü ildə - "Medikamentoz abort: metodika, üstünlükləri, hüquqi aspektləri", Bakı, Azərbaycan
2017-ci ildə - "Qadın genital xəstəliklərinin müasir müalicəsi və profilaktikası", Bakı, Azərbaycan
2017-ci ildə - Beynəlxalq elmi-praktiki konfrans "Sağlam hamiləlik naminə", Bakı, Azərbaycan
2018-ci ildə - "Azerbaijan-German-Turkish Medical Congress", Bakı, Azərbaycan
2019-cu ildə - "Modern Approach to Gynecologic Oncology", Bakı, Azərbaycan
2020-ci ildə - "Sübutedici təbabət nöqteyi nəzərindən erkən toksikozun müalicəsində müasir yanaşmalar", Bakı, Azərbaycan
2020-ci ildə - "Mamalıq vəziyyətlərinin və ginekoloji xəstəliklərin diaqnostikasında və müalicəsində yeni aspektlər", Bakı, Azərbaycan
2021-ci ildə - "Беременность и роды высокого риска. Как избежать перинатальных потерь", Ukrayna
2021-ci ildə - "RH-izoimmunizasiya: müasir standartlar", Bakı, Azərbaycan
2021-ci ildə - "Life Extension. Продолжение молодости", Kiev, Ukrayna
2021-ci ildə - "Евразийский телемост "Жизнь после Covid 19: вернуть активность"", Ukrayna
2022-ci ildə - "Minimal və endo-vizual ginekologiyanın aktual problemləri", Bakı, Azərbaycan
2023-cü ildə - "Qadın reproduktiv orqanlarının şişləri", Bakı, Azərbaycan
2023-cü ildə - "Multidisciplinary Cancer Management Conference", Bakı, Azərbaycan
2025-ci ildə - "Mamalıq-Ginekologiyada çətin məsələlərin asan həlli", Bakı, Azərbaycan', updated_at = NOW() WHERE slug = 't-u-f-d-dr-metanet-bayramova';
UPDATE doctor SET bio = 'Endokrinoloq, Baş həkim.

Fəaliyyət sahələri:
Şəkərli diabet (Tip 1 və Tip 2)
Şəkərsiz diabet
Hamiləlikdə (hestasion) diabet - Ana və döl üçün riskləri azaldan nəzarət və müalicə proqramı
Artıq çəki və piylənmə - Hormonal səbəblərin araşdırılması və endokrin yanaşmalarla müalicə
Ağır dərəcəli çəki azlığı - Maddələr mübadiləsi və hormon çatışmazlıqlarının qiymətləndirilməsi
Qalxanabənzər vəzi xəstəlikləri - Hipotiroidizm, hipertiroidizm, düyünlü zob və s.
Hipofiz vəzi xəstəlikləri - Hormon ifrazının azalması və ya artması ilə bağlı pozuntular (akromqeliya, prolaktinoma və s.)
Böyrəküstü vəzi xəstəlikləri - Kortizol, aldosteron və digər hormon balansı pozuntuları (Addison, Kuşinq sindromları və s.)
Menstrual tsiklin pozulması - Hormonal disbalans, polikistoz, amenoreya və s.
Hirsutizm - Qadınlarda kişi tipli tüklənmənin endokrin səbəblərinin aşkarlanması
Qadınlarda sonsuzluq - Yumurtlama problemləri və hormon pozğunluqlarının diaqnostikası
Kişilərdə hormonal mənşəli sonsuzluq - Testosteron çatışmazlığı, prolaktin yüksəkliyi və digər səbəblərin araşdırılması.
Osteoporoz - Sümük sıxlığının azalması, sınıq riskinin qiymətləndirilməsi və müalicəsi
Digər metabolik sümük xəstəlikləri - D vitamini çatışmazlığı, paratiroid vəzi xəstəlikləri və s.
Hipertoniya - Yüksək qan təzyiqinin qalxanabənzər, böyrəküstü vəzi və digər hormonal səbəblərlə əlaqəsinin dəyərləndirilməsi.', updated_at = NOW() WHERE slug = 't-u-f-d-dr-nermin-ismayilova';
UPDATE doctor SET bio = 'Baş həkim müavini / Pediatriya şöbə müdiri / Mütəxəssis.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Neonatologiya- Ankara Nümune Eğitim və Araştırma Hastanesi, Türkiyə, Ankara
Yeni doğulmuş uşaqların reanimasiyası - Bursa Uludağ Universitesi, Türkiyə, Bursa
Vaxtından əvvəl doğulmuş uşaqların reanimasiyası - Allgemeinen Krankenhaus Xəstəxanası, Avstriya, Vyana

İş təcrübəsi:
1996-1998 Həkim-pediatr, 1 saylı uşaq poliklinikası, Azərbaycan, Bakı
1998-2001 Kiçik Elmi işçi, Neonatoloq, Elmi-Tədqiqat Pediatriya İnstitutu, Yenidoğulmuşların Patologiyası şöbəsi, Azərbaycan, Bakı
2001- Həkim-pediatr-neonatoloq, Mərkəzi Klinika, Azərbaycan, Bakı
2009- Pediatriya şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı
2013- Baş həkimin müavini (Xəstəxana), Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 't-u-f-d-dr-sevda-esedova';
UPDATE doctor SET bio = 'Təcili tibbi yardım, Reanimasiya və intensiv terapiya şöbəsinin müdiri.

Şöbə: Reanimasiya və İntensiv Terapiya

Fəaliyyət sahələri:
Anesteziologiya-reanimatologiya
Alqologiya: diz artroskopilərində fərqli anestezi usullarının perioperativ hemodinamikaya və xəstənin evə yazılma vaxtına təsiri

İş təcrübəsi:
2009 - Həkim-reanimatoloq-alqoloq, Reanimasiya və intensiv terapiya şöbəsinin müdiri, Təcili tibbi yardım və səyyar tibbi xidmət şöbəsinin müdiri, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 't-u-f-d-dr-vuqar-abdulkerimov';
UPDATE doctor SET bio = 'Damar cərrahı, Fleboloq.

Fəaliyyət sahələri:
Doppler müayinəsi - damarların qan dövranının qiymətləndirilməsi
Diabetik ayaq sindromu - ağırlaşmaların qarşısının alınması və müalicəsi
Şarko pəncəsi (diabetik osteoartropatiya) - sümük və oynaqlarda dəyişikliklərin erkən diaqnostikası
Makro və mikroangiopatiyalar - böyük və kiçik damarların diabetlə əlaqəli zədələnmələrinin aşkarlanması
Diabetik neyropatiya - sinir zədələnmələrinin diaqnostika və idarə olunması
Varikoz xəstəliyi, tromboflebit və trombozlar - damar genişlənməsi və laxtalanma problemlərinin müalicəsi
Xroniki yaralar və trofiki pozğunluqlar - uzun müddət sağalmayan yaraların kompleks müalicəsi
PRP terapiyası - trombositlərlə bərpaedici müalicə
Trofiki, venoz, işemik və neyropatik yaraların diaqnostikası və fərdi müalicə planı
Yüksək texnologiyalı sarğılar (FLUMİNAL, gümüş ionları ilə olan sarğılar, ayaqlara dördlü bandajın qoyulması)', updated_at = NOW() WHERE slug = 't-u-f-d-dr-zaur-eliyev';
UPDATE doctor SET bio = 'Mütəxəssis.

Şöbə: Ümumi cərrahiyyə

Fəaliyyət sahələri:
Endoskopik və minimal invaziv cərrahiyyə - Endoskopik Cərrahiyyə Mərkəzi, Rusiya, Kazan
Varikoz damarların skeleroterapiyası üzrə - Endoskopik Cərrahiyyə Mərkəzi, Rusiya, Kazan

İş təcrübəsi:
2017 Həkim-ümumi cərrah, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 't-u-f-d-dr-ziya-muxtarov';
UPDATE doctor SET bio = 'İş təcrübəsi:
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2005-2015)
Şöbə müdiri, ATU-nun Onkoloji klinikası (2010 hal-hazıradək)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2012 hal-hazıradək)

Təlimlər:
İxtisasartırma kursu (15.06-15.08.2015)
Реконструктивная пластика молочной железы (01-31.03.2016)', updated_at = NOW() WHERE slug = 'tamara-quliyeva';
UPDATE doctor SET bio = 'Şöbə: Kardiologiya

Lisenziya və sertifikatlar:
1992 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda klinik elektrokardioloji kurs, həkim-kardioloq
1995 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda klinik elektrokardioloji kurs, həkim-kardioloq
2008 "Şəkərli diabet tip 2 və ürək-damar xəstəlikləri" təlimi
2009 "İnsan Resurslarının tərkibində kadr işinin təşkili və hüquqi aspektləri" təlimi
2009 İnsan Resurslarının cəlb olunması və idarəolunması metodları" təlimi
2009 "Fəaliyyətin qiymətləndirilməsi və motivasiya" təlimi
2009 "İşçi heyətin inkişaf və təkmilləşdirilməsi metodları" təlimi
2009 "Keyfiyyət menecment sistemində kargüzarlıq, ofis işinin təşkili" təlimi
2009 "Kadrların planlaşdırılması və vəzifə təlimatları" təlimi
2009 "Taym menecment" təlimi
2011 Azərbaycan Dövlət Həkimləri Təkmilləşdirmə İnstitutunda Kardiologiya üzrə ümumi təkmilləşmə kursu, şöbə rəisi
2014 "Şəkərli diabet tip 2 və ürək-damar xəstəlikləri" təlimində mühazirəçi
2014 Azərbaycan Respublikası Səhiyyə nazirliyində sertifikasiyadan keçmiş və kardiologiya ixtisası üzrə sertifikasiya şəhadətnaməsi almışdır
2021 Səhiyyə Nazirliyi tərəfindən Fəxri Fərman ilə təltif olunub.
2022 "Ürək xəstələrində poliklinik reabilitasiya mərhələləri" mövzusunda təlim, Azərbaycan, Bakı
Üzv olduğu təşkilatlar
Azərbaycan Kardiologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'tamilla-eliyeva';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
2010-2012 Ərzincan Dövlət Xəstəxanası və Ərzincan Universitetində pediatr uzman
2012-2015 Özəl tibb müəssisələrində pediatr kimi çalışıb
2015-2017 Necmettin Erbakan Universitetində Meran Tibb fakültəsində Pediatriya bölümü Neonatologiya şöbəsində Yandal uzmanlığı
2017-ci ildən Mərkəzi Gömrük Hospitalı, Pediatriya və Neonatologiya şöbəsinin rəisi

Lisenziya və sertifikatlar:
2018 11-ci Beynəlxalq Uşaq İnfeksion xəstəlikləri konqresi, Peyvənd kursu əsasları Türkiyə, Bələk
2017 61-ci Türkiyə Milli pediatriya konqresi, Türkiyə, Bələk
2017 25-ci Beynəlxalq Neonatoloji konqresi (UNEKO-25) Təkmilləşmiş Mexaniki Ventilyasiya kursu, Antalya, Belek
2016 Neonatoloji reanimasiya təlimi, Türkiyə, Konya
2015 59-cu Türkiyə Milli Pediatriya Konqresi, Türkiyə, Antalya
Türkiyə Nəcməddin Erbakan Universiteti Meram Tibb fakültəsi Dekanlığı. Daxili xəstəliklər bölümü. Uşaq sağlıq və xəstəlikləri fakültəsinin Neonatologiya ixtisası (Yenidoğulmuşlar reanimasiya şöbəsində) üzrə 27 noyabr 2015-ci il tarixində ixtisas təhsilinə başlamış və 15 fevral 2018-ci il tarixində bitirmişdir.
2018 62-ci Türkiyə Milli Pediatriya konqresi, Türkiyə, Antalya
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2019 Avropa Neontoloji Cəmiyyətinin 3-cü konqresi, Niderland, Mastriçt şəhəri
2020 Səhiyyə Nazirliyinin İctimai Səhiyyə və İslahatlar Mərkəzi, Türkiyənin Ankara Universiteti, Amerika Birləşmiş Ştatlarının Vanderbilt Universiteti və "Up-to-date in medicine Tibbi Konsaltinq" şirkətinin birgə təşkilatçılığı ilə "Neonatologiyada Yeniliklər» mövzusunda Beynəlxalq konqresi. Azərbaycan, Bakı.
2022 Türkiyə Milli Pediatriya Dərnəyinin təşkilatçılığı ilə keçirilən 66-cı Milli Pediatriya konqresi. Şimali Kipr Türk Respublikası, Girnə şəhəri.', updated_at = NOW() WHERE slug = 'telman-aytayev';
UPDATE doctor SET bio = 'Şöbə: Mama-Ginekologiya

İş təcrübəsi:
2000-2001 Azərbaycan Səhiyyə Nazirliyi Elmi Tədqiqat Mamalıq və Ginekologiya İnstitutu "Ana, Döl, Uşaq Sağlamlığının mühafizəsi" şöbəsində kiçik elmi işçi, həkim mama-ginekoloq
2001-2010 Mərkəzi Klinik Xəstəxana, Qadın Sağlamlığı mərkəzi, həkim mama-ginekoloq
2010-cu ildən Mərkəzi Gömrük Hospitalında Mama-ginekologiya şöbəsinin rəisi kimi çalışır
Elmi dərəcə
2015 Ali Attestasiya Komissiyası tərəfindən "Tibb üzrə Fəlsəfə Doktoru" elmi dərəcəsi
Elmi işlər
100-dən çox yerli və xarici konfransda, 45 kursda iştirak etmişdir. Yerli və xarici elmi jurnallarda çap olunmuş 90 original məqalə və tezis, 1 kitab, 2 metodik tövsiyə, 1 səmərələşdirici təklifin müəllifidir
Nailiyyətlər və Üstünlüklər
2000-ci ildə İlk ginekoloji endoskopik: laparoskopik və histeroskopik əməliyyatlarının icrası, Azərbaycan
2002-ci ildə Mərkəzi Klinik Xəstəxana rəhbərliyi tərəfindən Mama-ginekologiya şöbəsinin inkişafında əvəzsiz əməyinin olması, yüksək peşə ustalığı və mənəvi keyfiyyətlərə görə TƏŞƏKKÜRNAMƏ təqdim edilib
2002-ci ildə ilk Laparoskopik total histerektomiyanın LigaSure ilə həyata keçirilməsi, Azərbaycan
2003-ci İlk Süni Mayalanma Mərkəzinin qurulmasının aktiv iştirakçısı, ilk süni mayalanma mütəxəssisi, Azərbaycan.
2011-ci ildə Səhiyyə işçiləri günü münasibətilə "Sağlam Həyat naminə"elmi tibbi jurnalın təsis etdiyin İLİN HƏKİMİ diplomu ilə təltif olunub
2011-ci il tarixində Səhiyyə işçiləri günü münasibətilə "Təqdimat" ictimai-siyasi və hüquqi qəzetinin təsis etdiyi İLİN HƏKİMİ diplomu ilə təltif edilib
2011-ci il tarixində "Lider Azərbaycan" qəzetinin təsis etdiyi HİPPOKRAT Fəxri diploma layiq görülüb
2015 "Abdominal və laparoskopik histerektomiya əməliyyatlarının müxtəlif texnikalarının müqayisəli xarakteristikası" mövzusunda dissertasiya müdafiəsi, tibb üzrə fəlsəfə doktoru elmi dərəcəsi alıb
2017-ci ildə cəbhə bölgəsində yerləşən Tərtər rayonunun qadınlarına ixtisası üzrə göstərdiyi tibbi xidmətə görə TƏŞƏKKÜRNAMƏ ilə təltif olunub
2022 Koronavirusa yoluxmuş xəstələrin müayinə və müalicəsində yaxından iştirakına görə Dövlət Gömrük Komitəsi tərəfindən TƏŞƏKKÜRNAMƏ ilə təltif olunub
2023-cü ildə Azərbaycanda ilk dəfə Fraksional CO2 Lazer texnologiyasının Elmi Əsaslı tətbiqinə başlayıb
2023-cü ildə DGK TXİ "SOS Uşaq Kəndləri-Azərbaycan" Assosiasiyasının Gəncə şəhər filialında və Gəncə şəhər uşaq evində valideyn himayəsindən məhrum olan uşaqlar üçün tibbi sosial aksiyada fəal iştirakına görə TƏŞƏKKÜRNAMƏ təqdim edilib
2023 Gömrük orqanlarında uzun müddət və qüsursuz xidmətə görə "Gömrük Orqanlarında Xidmətə görə" III DƏRƏCƏLİ DÖŞ NİŞANI ilə təltif olunub
2023 Dövlət Gömrük Komitəsi tərəfindən Tibbi Xidmət İdarəsinin Mərkəzi Hospitalının fəaliyyətinin 15 illiyi münasibəti ilə xidmətdə əldə etdiyi naliyyətlərə görə Fəxri Fərman ilə təltif olunub
2024-cü ildə Naxçıvan Mərkəzi Xəstəxanasında şəhid və qazi ailələrinin üzvləri üçün keçirilmiş ödənişsiz tibbi-sosial xeyriyyə aksiyasında aktiv iştirakına görə TƏŞƏKKÜRNAMƏ ilə təltif edilib
2025-ci ildə "Qala" DTEQ-da "27 sentyabr Anım günü"nə həsr edilmiş ödənişsiz tibbi social xeyriyyə aksiyası çərçivəsində şəhid, qazi ailə üzvləri və tibbi yardıma ehtiyacı olan şəxslərin müayinə olunması və peşəkar tibbi məsləhətlərin verilməsinə görə TƏŞƏKKÜRNAMƏ ilə təltif edilib

Lisenziya və sertifikatlar:
2000 Mama-ginekologiya ixtisası üzrə təkmilləşmə kursu, Ankara, Türkiyə
2000 "Kolposkopiya və LETZ" kursu, Ankara, Türkiyə
2000 "Video laparoskopik cərrahiyyə" kursu (İTEM), Ankara, Türkiyə
2000 Gülhane Askeri Tıp Akademiyası "Diaqnostik və cərrahi histeroskopiya" kursu. Ankara, Türkiyə
2003 İstanbul Memorial Hastanesi, Tüp Bebek Mərkəzi "Süni mayalanma üzrə təkmilləşmə" kursu, İstanbul, Türkiyə
2003 5. İnternational symposium on preimplantation genetics kongresi, "Süni mayalanma-embriologiya" kursu, Antalya, Türkiyə
2004 Ankara Nümune Xəstəxanası "Nəzəri-praktik təcrübə və amniosentez" kursu, Ankara, Türkiyə
2010 7.Obstetrik ve jinekolojik ultasonoqrafi kongresi "Temel Ultrasonoqrafiya" kursu, İstanbul, Türkiyə
2011 XIII.Ulusal Perinatoloji kongresi "Obstetrik acillər"kursu, İstanbul, Türkiyə
2011 TARTEN kongresi "Yumurtalıqların stimullaşdırılması və ART" kursu, İstanbul, Türkiyə
2011 III Üreme tıbbi derneği kongresi "Endoskopik Cərrahiyyə" kursu, Antalya, Türkiyə
2011 5.Ulusal Urojinekoloji kongresi "Mesh uygulamaları cerrahi tedavi" kursu, İstanbul, Türkiyə
2012 5. EGE Jinekolojik Endoskopi sempozyumu, məruzəçi və Ege Universiteti tıp fakültesi, Kadın hastalıkları ve Doğum bölümü,"Laparoskopik Total histerektomiya" kursu, İzmir, Türkiyə
2012 Azərbaycan Respublikası SN ATU təşkilatı ilə Professor Həsən Sultanovun 80 illik yubileyinə həsr olunmuş elmi praktik konfransı, məruzəçi, Bakı, Azərbaycan
2012 Maternal Fetal Medicine and Perinatology Association of Turkey "Mamalıq Ultrasəs əsasları təlimi", İstanbul, Türkiyə
2012 "Uroginekoloji estetik cərrahiyyə" kursu, Ankara, Türkiyə
2013 Ist Annual MESGE Congress in conjunction with the Turkish Society of Gynecological Endoscopy "Robotik cərrahiyyə və ve endoskopik ginekologiyada yeni texnologiyalar" təlimi, məruzəçi, Antalya, Türkiyə
2013 The 18th World Congress on COGİ "Mamalıq, ginekologiya və sonsuzluq mövzusunda yeniliklər" təlimi, məruzəçi, Vyana, Avstriya
2013 "ARUD 2013"-Türk Cümhuriyetleri Anestezi günleri: "Transplantasyon Anestezisinde güncel gelişmeler" kongresi, məruzəçi, Bakı, Azərbaycan
2014 MİJİD, 5. Uludağ Minimal İnvaziv Jinekoloji Sempozyum ve Çalıştayı, məruzəçi, "Laparoskopik sütür kursu", Bursa, Türkiyə
2014 6. EGE Jinekolojik Endoskopi sempozyumu, məruzəçi, İzmir, Türkiyə
2014 İnternational Ankara Urogynecology Congress IV "Estetik jinekoloji"kurs, Ankara, Türkiyə
2014 X.Turkish German Gynecology Congress, məruzəçi və "Optimization if treatment outcomes in infertility" kursu, Antalya, Türkiyə
2014 6.Ulusal Üreme Endokrinolojisi ve İnfertilite Kongresi, məruzəçi, Antalya, Türkiyə
2017 ATU-Aralıq dənizi çanaq dibi cərrahiyyəsi cəmiyyətinin (MİPS) təşkilatı "Qadınlarda çanaq dibi pozulmalarının diaqnostika və müalicəsi: yeni məqamlar" təlim kursu, Bakı, Azərbaycan
2018 RPM və Türk Jinekoloji ve Obsterik Derneyinin təşkilatı "Perinatologiya və ginekologiya. Mama-Ginekologiyada diaqnostikanın və müalicənin aktual problemləri" təlim kursu, Bakı Azərbaycan
2018 ATU CK "IV Azərbaycan-Türkiyə Ortaq Hepatoloji" kursu, Bakı, Azərbaycan
2018 1st İnternational transplant network congress, məruzəçi və "Qaraciyər nəqli Hepatoloji kursu" Antalya, Türkiyə
2018 II. İnternational Cosmetology and Cosmetic Gynecology Congress "Ginekoloji Lazer uyğulamaları kursu", İstanbul, Türkiyə
2019 ATU və İnönü Universiteti, "V Bakı-Malatya orqan transplantasiya günləri" konfransı, məruzəçi, Bakı, Azərbaycan
2019 Azərturkmed, ETMGİ təşkilatı ilə "Laser and Aesthetic Gynecology master class", Bakı, Azərbaycan
2019 WAPM, 14th World Congress of Perinatal Medicine "14-cü Ümumdünya Perinatal Tibb konfransı, məruzəçi və "İan Donald Ultrasəs məktəbinin təlim kursu", İstanbul, Türkiyə
2019 ADHTİ "Mamalıq və ginekologiya (modul 1-2)" ixtisasartırma kursu, Bakı, Azərbaycan
2019 II Beynəlxalq Rekonstruktiv Estetik Genital Cərrahiyyə və Seksologiya konqresi "Estetik genital cərrahiyyə kursu" İstanbul, Türkiyə
2020 ADHTİ "Uşaqlıq boynunun eroziyasının müalicəsi və müasir metodların tətbiqi" üzrə ixtisasartırma kursu, Bakı, Azərbaycan
2021 ADHTİ "Mamalıq və ginekologiya (modul 3-4)" ixtisasartırma kursu, Bakı, Azərbaycan
2022 Beynəlxalq Genital Estetik və Kosmetik Ginekologiya mövzusunda seminar, İstanbul, Türkiyə
2022 DGK TXİ ETTM-nin təşkilatı ilə "COVİD-19 Pandemiyası zamanı mamalıq və ginekoloji problemlərə müasir baxış" Beynəlxalq elmi konfransı, moderator və məruzəçi, Bakı, Azərbaycan
2022 ATU və İnönü Universiteti, "VII Bakı-Malatya orqan transplantasiya günləri" konfransı, məruzəçi, Bakı, Azərbaycan
2022 DGK TXİ ETTM və MGH təşkilatı ilə "Hamiləlikdə genital və ekstragenital xəstəliklər" mövzusunda Beynəlxalq Elmi Konfrans, moderator, məruzəçi, Bakı, Azərbaycan
2022 Azərbaycan Respublikası SN, Seçenov Universiteti, BSM-nin təşkilatı ilə "Bakı Beynəlxalq ginekoloji konfransı"-nda "Minimal və endo-vizual ginekologiyanın aktual problemləri mövzusunda konfrans və təlim; məruzəçi və kurs təlimçisi, Bakı, Azərbaycan
2023 ADHTİ "Şəkərli diabet və hamiləlik" üzrə ixtisasartırma kursu, Bakı, Azərbaycan
2023 GYNOAZ, Akademik Zərifə Əliyevanın 100 illiyinə həsr olunmuş "Qadın reproduktiv orqanlarının şişləri" adlı GYNOAZ 2023 - I Beynəlxalq Ginekoloji Konqresi, məruzəçi, Bakı, Azərbaycan
2023 Genital Aestetics and Cosmetic Gynecology Congress" Video based Genital Aestetics and Cosmetic Gynecology CAMP", məruzəçi, İstanbul, Türkiyə
2023 Paramed Estetik Mərkəzi Laser and Aesthetic Gynecology Femilift Pixel CO2 Laser master class, Bakı, Azərbaycan
2023 DGK TXİ və MGH-nın təşkilatı ilə "Mamalıq-ginekologiya sahəsində beynəlxalq təcrübənin və multidissiplinar əməkdaşlığın rolu" adlı dəyirmi masa, məruzəçi, Bakı, Azərbaycan
2023 Ümummilli Lider Heydər Əliyevin 100 illiyinə həsr olunmuş Beynəlxalq Elmi-Praktik Konfrans, "Minimal və endo-vizual ginekologiya","MİPS Bakı-III Praktik kurs", "Sərhədsiz ginekologiya-VII konfrans" moderator, məruzəçi, Bakı, Azərbaycan
2023 DGK TXİ ETTM, MGH və Florence Nightingale Xəstəxanalar qrupunun təşkilatı ilə, "Müasir mama-ginekologiyanın aktual problemləri" mövzusunda Beynəlxalq Elmi Konfrans, moderator, məruzəçi və "Kolposkopiya kursu", Bakı, Azərbaycan
2023 ACOGS kurs günləri, "Genital estetik kursu", İstanbul, Türkiyə
2024 Paramed Estetik Mərkəzi "Laser and Aesthetic Gynecology / Femilift Pixel CO2 Laser" Master Class, Bakı, Azərbaycan
2024 Azərbaycan Respublikası SN "DTT üzrə elm və TTAQ" əsasında "Mama-Ginekologiya, Reproduktiv Sağlamlıq və Qadın Sağlamlığı üzrə II Beynəlxalq Konfrans, moderator, məruzəçi, Bakı, Azərbaycan
2024 ADHTİ "Mamalıqda təxirəsalınmaz vəziyyətlər" üzrə ixtisasartırma kursu, Bakı, Azərbaycan
2024 Paramed Estetik Mərkəzi "Femilift Pixel CO2 Lazer and Aestethic 2024 Organization of medical projects academy "Genital estetika qeyri cərrahi tətbiqlər kursu", Bakı, Azərbaycan
2024 Paramed Estetik Mərkəzi "Laser & Aesthetic Gynecology Postpartum rehabilitation" Master Class, "Müasir ginekologiyada lazer texnologiyalarının rolu" mövzusunda məruzəçi və təlimçi, Bakı, Azərbaycan
2024 Türk Uroginekoloji ve Pelvik Rekonstruktiv Cerrahi dərnəyi tərəfindən təşkil olunmuş 11.Ulusal Ürojinekoloji Kongresində məruzəçi və "Pelvik Taban Ultrasonoqrafiya kursu", İstanbul, Türkiyə
2024 Bakı Sağlamlıq Mərkəzi , Biolitec, "Ginekologiyada Lazer üzrə Beynəlxalq Master-class", Bakı, Azərbaycan
2025 ARSN "DTT üzrə EDTA qaydaları" əsasında DGK TXİ ETTM və MGH, Masallı Rayon İH, TƏBİB-in dəstəyi ilə Ümummilli lider Heydər Əliyevin anadan olmasının 102-ci ildönümünə həsr edilmiş "Ana və uşaq sağlamlığı: Mövcud problemlərə müasir baxış" mövzusunda Beynəlxalq Elmi Konfrans, moderator və məruzəçi, Masallı, Azərbaycan
2025 İSAGSS təşkilatı ilə "II.Genital Estetik Ve Rejenerativ Tedaviler" konqresi, məruzəçi, İstanbul, Türkiyə
2026 ADHTİ "Patoloji mamalıq və operativ ginekologiya" üzrə ixtisasartırma kursu, Bakı, Azərbaycan
2026 IAGC26, vNOTES konqres sonrakı kursu, Bakı, Azərbaycan
2026 Mərkəzi Gömrük Hospitalı ilə Britaniya-Azərbaycan Həkim və Stomatoloqlar Assosiasiyası arasında imzalanmış əməkdaşlıq memorandumu çərçivəsində Böyük Britaniyanın Birmingham Women''s and Children''s NHS Foundation Trust xəstəxanasında keçirilən beynəlxalq təkmilləşmə kursu, Birmingham, Böyük Britaniya
Peşəkar cəmiyyətlərdə üzvlük
TJOD (Türkiye Jinekoloji ve Obstetrik dernegi)
TÜTD (Türkiye Üreme Tıppı Derneği)
T.S.R.M (Türkiye üreme sağlığı ve infertilite derneği)
TJED (Türkiye Jinekolojik Endoskopi Derneği)
ESHRE (European Society of Human Reproduction and Embryology)
TPRCİD (Türkiye Pelvik Rekonstruktiv Cerrahi ve İnkontinans Derneği)
İSPP (İnternational Society for Pelviperineology)
İCRA ETDİYİ ƏMƏLİYYATLAR
"Laparoskopik Adheziolizis Miomektomiya
Xromohidrotubasiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik Uşaqlıq Borularının Bağlanması"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik
Tubektomiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik Unilateral Salpinqooferektomiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik
miomektomiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik kistektomiya xromohisrotubasiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik adheziolizis tubektomiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
"Laparoskopik total histerektomiya bilateral salpinqooferektomiya"
Dr. Təranə Bayramova
t.f.d., mama-ginekoloq
HƏKİMƏ RƏYİNİZİ BİLDİRİN!', updated_at = NOW() WHERE slug = 'terane-bayramova';
UPDATE doctor SET bio = 'Şöbə: Pediatriya

İş təcrübəsi:
1992 - 2009 Dövlət və özəl tibb müəssisələrində pediatr-neonatoloq-reanimatoloq kimi çalışmışdır.
2007 Avstriya, Graz Landeskrakenhhaus, Universitet klinikası, neonatoloq
2009 Türkiyə Hacettepe Universitetin uşaq xəstəxanası
2009 Avstriya, Graz Landeskrakenhhaus, Universitet klinikası
2010 Türkiyə, Ankara Universitetinin uşaq xəstəxanası, yenidoğulmuşların reanimasiya şöbəsi
2018 Avstriya, Medical University of Graz, Pediatriya və Neonatologiya şöbəsi
2009-cu ildən Mərkəzi Gömrük Hospitalında pediatr-neanatoloq-reanimatoloq kimi çalışır.
2014-cü ildən Azərbaycan Respublikası Səhiyyə Nazirliyinin neonatal xidmətinin təkmilləşdirilmə komissiyasının üzvüdür.

Lisenziya və sertifikatlar:
2003 Pediatric cardiology -Avstriya
2006 General pediatrics - Avstriya
2009 Vienna School of Clinical Research, Avstriya
2011 Neonatoji kongress, Türkiyə
2012 Balkan multidisciplinary Medical Forum, Monteneqro
2013 Neonatoji kongress, Türkiyə
2014 International workshop of surfaktant replacement, İspaniya
2014 İnternational Congress on Pediatric Pulmonology, Belçika
2015 Balkan Medical Forum, Gürcüstan
2015 Neonatoji kongress, Türkiyə
2015 Vanderbilt Universiteti, ABŞ və İSİM - neonatal intensiv terapiya
2015 İtaliyan- Türk- İran Pediatrik kongressi, Türkiyə
2016 Charite Universitatsmedizin, Almaniya - workshop- neonatal intensiv terapiya
2016 Spandau LKH, Almaniya workshop-neonatal intensiv terapiya
2016 SPIN International workshop of respiratory therapy and surfaktant replacement, Italiya
2017 Nutrition and growth conference- Fransa
2018 Neonatologiya üzrə Azərbaycan-Türkiyə 1-ci intensiv təlim kursu, Azərbaycan (təşkilat komitəsi)
2018 Neonatologiya üzrə Azərbaycan-Türkiyə 2-ci intensiv təlim kursu və neonatologiya üzrə 1-ci Bakı beynəlxalq konfransı, Azərbaycan (təşkilat komitəsi)
2018 Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.
2019 ATU-nun vəTürkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Bakı, Azərbaycan
2020 Səhiyyə Nazirliyinin İctimai Səhiyyə və İslahatlar Mərkəzi, Türkiyənin Ankara Universiteti, Amerika Birləşmiş Ştatlarının Vanderbilt Universiteti və "Up-to-date in medicine Tibbi Konsaltinq" şirkətinin birgə təşkilatçılığı ilə "Neonatologiyada Yeniliklər» mövzusunda Beynəlxalq konqresi. Azərbaycan, Bakı.
2022 Şimali Kipr Respublikasının Lefkoşa şəhərində İstanbul Sağlık Bilimleri İnstitutunun təşkilatçılığı ilə keçirilən "Yenidoğulmuşa nəfəs almağa yardım etmə" simpoziumunda iştirak edib.
2023 ATU-nun Tədris Terapevtik Klinikasının təşkilatçılığı ilə Ulu öndər Heydər Əliyevin 100 illiyinə həsr olunmuş "Pediatriyaya müasir yanaşma" mövzusunda beynəlxalq elmi-praktik konfransda "İnfantil kolik" mövzusunda elmi təqdimatla çıxış edib.', updated_at = NOW() WHERE slug = 'terane-goyusova';
UPDATE doctor SET bio = 'Pediatr - neonatoloq.

İş təcrübəsi:
Səudiyyə Ərəbistanında Neonatologiya, Reanimasiya üzrə Birinci Səudiyyə Milli Simpoziumu, Riyad Tibb Kompleksi, Uşaq Xəstəxanası.
Uşaq Sağlamlığında Yenilik, Ər-Riyad - Səudiyyə Ərəbistanı Krallığı, Kral Faysal Mütəxəssis Xəstəxanası, Pediatriya Şöbəsi, Neonatologiya Bölməsi 2008.
Neonatologiyada Salzburg seminarı
Hal-hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'tezibe-mirzeliyeva';
UPDATE doctor SET bio = 'Şöbə: Təcili Tibbi Yardım

İş təcrübəsi:
1986-1988 A.F.Qarayev adına 2 saylı Uşaq Klinik Xəstəxanası - tibb qardaşı
1989-2012 Bakı şəhəri Təcili Təxirəsalınmaz Tibbi Yardım Stansiyası - anestezioloq-reanimatoloq
2012- Azərbaycan Respublikası Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsi, Mərkəzi Gömrük Hospitalı - təcili yardım həkimi

Lisenziya və sertifikatlar:
2018 "Azerbaycan Acil Tıp Sempozyumu" Təşkilatçı:Sağlık Bilimleri Üniversitesi ve ATUDER (Acil Tıp Uzmanları Derneği)
2018 "İLK YARDIM" üzrə təlim kursu "Azəri Toksikoloqlarının Dərnəyi" və "UpToDate in Medicine" tərəfindən
2019 "Davamlı Tibb Təhsil üzrə elm və tədris tədbirlərinin akkreditasiya Qaydaları" əsasında "Uşaq cərrahiyyəsi üzrə Elmi-praktika" Təşkilatçı: Azərbaycan Respublikası Səhiyyə Nazirliyi Azərbaycan Tibb Universiteti
2019 "Davamlı Tibbi Təhsil üzrə elm və tədris tədbirlərinin akkreditasiya Qaydaları" əsasında "İmmunpatoloji Xəstəliklər" adlı konfrans Təşkilatçı: Azərbaycan Respublikası Səhiyyə Nazirliyi
2022 "SARS-Cov-2 COVID -19 Kompleks Diaqtnostikasına Müasir Yanaşmalar" Beynəlxalq Elmi Konfrans Təşkilatçı: Dövlət Təhlükəsizliyi Xidmətinin Hərbi-Tibb Baş İdarəsi Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsi
2022 "Orqan və toxuma transplantasiyasında Beyin ölümü diaqnozunun aktual aspektləri" Beynəlxalq Elmi Konfrans Azərbaycan Respublikası Dövlət Gömrük Komitəsinin Tibb Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin, Mərkəzi Gömrük Hospitalının, Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin və Azərbaycan Ürək və Sağlamlıq Assosiasiyası İctimai Birliyinin birgə təşkilatçılığı ilə
2022 "Azərbaycan-Türkiyə Neanotologiya Konqresi" Azərbaycan Respublikası Dövlət Gömrük Komitəsinin Tibb Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin və Mərkəzi Gömrük Hospitalının təşkilatçılığı ilə
2023 "İnfeksion və qeyri-infeksion hepatitlərin müalicə və diaqnostikasına müasir yanaşma" Təşkilatçı: Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin, Mərkəzi Gömrük Hospitalının, "Azəri Toksikoloqlarının Dərnəyi" İctimai Birliyinin, "Azərbaycan Qastroenteroloqlar və Hepatoloqlar" İctimai Birliyinin, "Azərbaycan İnfeksion Xəstəlikləri və Kliniki Mikrobiologiya Cəmiyyəti"-nin və Materia Medica
2023 Praktik tibb və ya əczaçılıq fəaliyyəti ilə məşğul olmaq hüququnu təsdiq edən "Sertifikasiya Şəhadətnaməsi"', updated_at = NOW() WHERE slug = 'tofik-bayramov';
UPDATE doctor SET bio = 'Şöbə: Uşaq Cərrahiyyəsi

İş təcrübəsi:
2011-2013 N saylı Hərbi hissədə həqiqi hərbi xidmətdə həkim kimi fəaliyyət göstərib.
2014-2019 Özəl tibb müəssisələrində uşaq cərrahı kimi çalışıb.
2023-cü ildən etibarən Mərkəzi Gömrük Hospitalında uşaq cərrahı kimi fəaliyyət göstərir.

Lisenziya və sertifikatlar:
2022 Türkiyədə İstanbul Universiteti Cərrahpaşa Tibb fakültəsində Uşaq cərrahiyyəsi və uşaq urologiyası kafedrasında ixtisasartırma kursu keçib.
2022 Azərbaycan Elmi Tədqiqat Pediatriya İnstitutunun təşkilatçılığı ilə 1-ci Beynəlxalq Pediatriya, Uşaq Cərrahiyyəsi və Tibb Bacıları konqresi. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'togrul-piriyev';
UPDATE doctor SET bio = 'Şöbə: Diaqnostika

İş təcrübəsi:
2009-cu ildən Mərkəzi Gömrük Hospitalı, həkim-sonoloq
Mükafatlar
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2012 Erciyes Universitetinin Tibb fakültəsinin Radioloji Anabilim dalında "Qarın boşluğu orqanları USG və GRİ SCALA rəngli dopleroqrafiyası" pediatrik ultrasonoqrafik incələmələr və yenidoğulmuşlarda bud-çanaq oynağının diaqnostikası üzrə neyrosonoqrafiya kursu. Türkiyə, Kayseri
2012 AnaKalp Xəstəxanasında "Damarların rəngli dopleroqrafiyası kursu.Türkiyə, Kayseri
2012 Hüma Qadın Xəstəlikləri və Doğum Xəstəxanasında Obsetrik USG, hamilələrdə dopleroqrafiya, ginekoloji xəstəliklər zamanı diferensial diaqnostika kursu. Türkiyə, Kayseri
2013 Bezmialem Vakif Universitetinin Tibb fakültəsində süd vəzilərinin USG-si və mammoqrafiyası, anorektal USG, yumşaq toxumalar, endokrin və limfotik sistem üzrə USG, pediatrik ultrasonoqrafiya, yenidoğulmuşlarda bud-çanaq oynağının diaqnostikası, neyrosonoqrafiya kursu. Türkiyə, İstanbul
2014 Weill Cornell Tibb kollecində "Süd vəzilərinin Mammoqrafiyası və qaraciyər törəmələrinə Multidisiplinar yanaşma" kursu. Avstriya, Zalsburq
2015 İstanbul Universitetinin Tibb fakültəsində "Hamilələrin Anal Sfinkter zədələnmələrində Multidisiplinar yanaşım ve anorektal ultrasonoqrafıya" kursu. Türkiyə, İstanbul
2015 Echosesns Təlim mərkəzinin təşkil etdiyi qaraciyər elastometriyası kursu. Rusiya, Moskva', updated_at = NOW() WHERE slug = 'tukezban-abdullayeva';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
2009-2014 Dövlət və özəl tibb müəssisələrində həkim-anestezioloq-reanimatoloq kimi çalışıb
2014- cü ildən Mərkəzi Gömrük Hospitalında Reanimasiya və intensiv terapiya şöbəsinin rəisi, həkim-anestezioloq-reanimatoloq kimi çalışır
Mükafatlar
2022 "Azərbaycan Respublikası Dövlət Gömrük Komitəsinin 30 illiyi" Azərbaycan Respublikasının yubiley medalı ilə təltif olunub.

Lisenziya və sertifikatlar:
2018 Türk Anesteziologiya və Reanimasiya Dərnəyinin 52-ci Milli konqresi
2018 Türk Tibbi və Cərrahi Reanimasiya Dərnəyinin 15-ci illik konqresi
2018 Azərbaycan Reanimatoloqlar,Anestezioloqlar Cəmiyyəti və Türk Daxili Cərrahiyyə və Reanimasiya Dərnəyinin ilə birgə keçirdiyi konfrans
2018 Türk Anesteziologiya və Reanimasiya Dərnəyinin keçirdiyi Transplantasiya Anesteziya kursu
2018 Milli Daxili və Cərrahiyyə sahəsində Reanimasiya Konqresi, Antalya, Türkiyə
2018 Türk Anesteziologiya və Reanimasiya Cəmiyyətinin yığıncağı, Türkiyə, Antalya
2019 Türkiyənin Florence Nightingale Xəstəxanalar Qrupunda təkmilləşdirmə kursunda iştirak edib
2020 "USM altında yüksək səviyyə periferik sinir blokadası" adlı təkmilləşdirmə kursu. Manisa şəhəri, Türkiyə Respublikası.
2021 Sağlık Bilimləri Üniversitesi tərəfindən təşkil edilmiş I Milli Anesteziologiya və Reanimasiya simpoziumu. Türkiyə, İstanbul
2025 Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin təşkilatçılığı ilə keçirilən 3-cü Milli Konqres. Azərbaycan, Bakı şəhəri.
2026 Azərbaycan Səhiyyə Nazirliyinin, Azərbaycan Tibb Universitetinin, TƏBİB-in, Azərbaycan Reanimatoloqlar və Anestezioloqlar Cəmiyyətinin və digər nüfuzlu qurumların təşkilatçılığı ilə keçirilən 7-ci Beynəlxalq Bariatrik-Metabolik Xəstəlikləri Konqresində "Bariatrik cərrahiyyədə pasiyentin əməliyyatönü dəyərləndirilməsi, anesteziya özəlliyi və postoperasion dövrdə baxımı" mövzusunda təqdimatla çıxış edib. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'tural-sadiqov';
UPDATE doctor SET bio = 'Loqoped.
Şöbə: Terapiya

Müalicə etdiyi xəstəliklər:
Ümumi nitq ləngiməsi
Artikulyasiya aparatının gimnastikası
Tələffüz pozuntuları
Nitq inkişafının geri qalmasının qarşısının alınması
Afaziya (insult sonrası)
Kəkələmə
Disleksiya
Dislaliya
Alaliya
Bradilayiya
Taxilaliya
Disfoniya
Afoniya
Exolaliya
Expressiv nitq
Rinolaliya
Dizartriya.', updated_at = NOW() WHERE slug = 'turane-eliyeva';
UPDATE doctor SET bio = 'Şöbə: Laboratoriya ISO 15189:2012

İş təcrübəsi:
2001-2009. Müxtəlif dövlət və özəl tibb müəssisələrində həkim-mikrobioloq kimi çalışıb.
2009-cu ildən Mərkəzi Gömrük Hospitalında həkim-mikrobioloq kimi fəaliyyət göstərir.
Nailiyyətlər və Üstünlüklər
Azərbaycan Respublikası Dövlət Gömrük Komitəsi tərəfindən verilmiş
"Gömrük orqanlarında Xidmətə Görə" 3 cü dərəcə döş nişanı

Lisenziya və sertifikatlar:
2002. Diplomdan sonra Tibbi Akademiya təhsili. Rusiya, Sankt-Peterburq.
2022. Dövlət Təhlükəsizliyi Xidmətinin Hərbi Tibb Baş İdarəsi və Dövlət Gömrük Komitəsi Tibbi Xidmət İdarəsinin birgə təşkilatçılığı ilə "SARS-CoV-2 (COVİD-19) kompleks diaqnostikasına müasir yanaşmalar" mövzusunda həsr edilmiş Beynəlxalq Elmi Konfrans. Azərbaycan, Bakı şəhəri.
2022. Dövlət Gömrük Komitəsinin Tibbi Xidmət İdarəsinin Elmi-Təcrübi və Tədris Mərkəzinin və Mərkəzi Gömrük Hospitalının birgə təşkilatçılığı ilə "Sidik yolları infeksiyalarının diaqnostikası və müalicəsinə kompleks yanaşma" mövzusunda elmi konfrans. Azərbaycan, Bakı şəhəri.', updated_at = NOW() WHERE slug = 'ulker-memmedova';
UPDATE doctor SET bio = 'Haqqında:
2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı/ Həkim-nefroloq
2018-2022 - Rezidentura/ Azərbaycan Tibb Universiteti/ Nefrologiya
2010-2016 - Azərbaycan Tibb Universiteti/ Hərbi həkim işi', updated_at = NOW() WHERE slug = 'ulvi-cabbarov';
UPDATE doctor SET bio = 'Şöbə: Üz-Çənə Cərrahiyyəsi

İş təcrübəsi:
2012 Hamburq, Almaniya, 15-ci Beynəlxalq "DENTSPLY Friadent" simpoziumu
2013 Bazel, İsveçrə, Estetik bölgələrdə dental implant cərrahiyyəsi üzrə praktiki təcrübə
2015 ABŞ-ın Portland şəhərində Emanuel Legacy və Providence klinakalarında Prof. Eric Dierksin rəhbərliyi altında üz-çənə nahiyəsinin travmaları, gicgah çənə oynağının xəstəlikləri və cərrahiyyəsi sahəsində elmi praktiki təcrübə keçərək fəxri diplomla təltif olunmuştur.
2017-ci ildən Mərkəzi Gömrük Hospitalı, üz-çənə cərrahı, implantoloq
Nailiyyətlər və Üstünlüklər
Onlarla elmi konfranslara qatılıb poster və sözlü çıxış etmişdir
Onlarla elmi məqalələrin müəllifidir
"Dental İmplant Cerrehisinde Preoperatif və Postoperatif Anksiyete Durumunun Değerlendirilməsi" adlı kitabın və "Gömülü mandibular 3.molar cerrahisi sonrası sinir yaralanmaları insidansının değerlendirilmesi" adlı projenin müəllifidir.

Lisenziya və sertifikatlar:
2012 15 th DENTSPLY Friadent World Symposium ''''Mastering Tissue Responds Successfully'''' (Hamburg)
2013 Türk Oral ve Maksillofasiyal Cerrahi Derneği 20th. Uluslararası Kongresi Türkiyə, Antalya
2013 Advanced Course Program for Dentists from Turkey/ Prof.B.E.Pjetursson, University of Reykjavik, ITI Fellow Marc Sommer. International Instructor
2013 Straumann HQ Raffaele Peraro, Director, Global Distributors Sales, Straumann HQ, Switzerland, Villeret
2014 Türk Oral ve Maksillofasiyal Cerrahi Derneği 21th. Uluslararası Konqresi Türkiyə, Bodrum
2015 Türk Oral ve Maksillofasiyal Cerrahi Derneği 22nd. Uluslararası Konqresi Türkiyə, Bodrum
2018 Surgical Management of The Temporomandibular Joint-A Practical Approach, Kochi, Hindistan
2019 ATU-nun vəTürkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Bakı, Azərbaycan
2019 Avropanın üz-çənə cərrahları Assosiasiyasının və SORG Akademiyasının birgə təşkilatçılığı ilə keçirilən "Çənə sınıqlarının yeni cərrahi metodlarla rekonstruksiyası" mövzusunda təlim kursu. Hollandiya, Amsterdam şəhəri
Üzv olduğu təşkilatlar
American Association of Oral and Maxillofacial Surgeons (AAOMS)
European Association for Cranio-Maxillofacial Surgery (EACMFS)
Türk Oral ve Maksillofasiyal Cerrahi Derneği
Ağız ve Çene Yüz Cerrahisi Derneği
Türk Oral İmplantoloji Derneği
Osseointegrasyon Derneği', updated_at = NOW() WHERE slug = 'ulviyye-memmedova';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
İntravenoz müalicələr
İntravenoz lazer müayinələri
Tamamlayıcı tibbi tətbiqlər
İntravenoz və ozonterapiya
Xroniki xəstəliklərlə intravenoz terapiyalar
Cell-wellbeing
Antiaging treatments
Şəkərli və şəkərsiz diabet
Hamiləlikdə diabet
Artıq çəki və piylənmə
Ağır dərəcəli çəki azlığı
Qalxanabənzər vəzi xəstəlikləri
Hipofiz vəzi xəstəlikləri
Böyrəküstü vəzi xəstəlikləri
Menstrual tsiklin pozulması
Hirsutizm (qadınlarda kişi tipli tüklənmə)
Kişi və qadınlarda sonsuzluğun endokrinoloji aspektlərinin dəyərləndirilməsi
Osteoporoz və digər metabolik xarakterli sümük xəstəlikləri
Hipertoniya və ya yüksək qan təzyiqinin endokrinoloji dəyərləndirilməsi', updated_at = NOW() WHERE slug = 'ulya-quliyeva';
UPDATE doctor SET bio = 'Tibbi Genetika Uzmanı.

Fəaliyyət sahələri:
İrsi xəstəliklərin diaqnozu və xəstələrin müşahidəsi
Yeni Nəsil Sıralama - New Generation Sequencing (NGS) metodu ilə gen panellərinin analizi və şərh olunması
Sitogenetik testlər (Xromosom analizi, FISH, Molekulyar kariotipləmə- Array CGH)
Genetik xəstəlik şübhəsi olan yenidoğulmuşlar (SMA, Biotinidaz çatışmazlığı, Fenilketonuriya, Kistik Fibroz və s.)
Uşaqlarda neyro-motor inkişaf geriliyi, Autizm, Epilepsiya
Boy qısalığı və Skelet displaziyaları
Metabolik xəstəliklər
İrsi əzələ xəstəlikləri (Kardiomiopatiyalar, DuchenneBecker və s.)
Xromosom xəstəlikləri (Daun, Turner, Klinefelter sindromları və s.)
Riskli hamiləliklər (Skrininq testlərdə və fetal USG-də anomaliyalar, yuxarı ana yaşı, NİPT testində risk)
Təkrarlanan düşüklər (2 və daha çox)
Sonsuzluq və süni mayalanma sonrası uğursuzluq
45 yaşa qədər yaranan bədxassəli şişlər
Ailəsində çoxsaylı süd vəzi, yumurtalıq, uşaqlıq və bağırsaq xərçəngi olan şəxslər
Hədəfə yönəlmiş ("ağıllı dərman") müalicəsi üçün genetik testlər.

Konfranslar:
"Nörogelişimsel bozukluklar ve ya konjenital anomalileri olan olguların moleküler karyotipleme ve yeni nesil dizileme verilerinin karşılaştırmalı değerlendirilmesi" - Diplom İşi (10/2022 - 01/2024)
"Obezite hastalarında monogenik ve sendromik obezite genlerinin taranması, klinik deneyimimiz"', updated_at = NOW() WHERE slug = 'uzm-dr-arzu-quliyeva';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Baş ağrıları (miqren, gərginlik, klaster və s.)
Epilepsiya və qıcolmalar
İflic, üz iflici, insult və serebrovaskulyar xəstəliklər (damar tıxanıqlığı, qanaxma)
Unutqanlıq və demensiyalar (Alzheimer, vitamin və hormon çatışmazlığı, beyində maye təzyiqinin artması)
Əzələ xəstəlikləri (miasteniya, miopatiyalar)
Beyin infeksiyaları (ensefalit)
Başgicəllənmə (vertigo)
Onurğa beyni xəstəlikləri
Periferik sinir tutulmaları
Sinir sıxılmaları (karpal, tarsal, kubital və s.)
Hərəkət pozğunluqları (Parkinson, tremor, distoniya)
Yuxu pozğunluqları
Boyun və bel ağrıları, disk yırtıqları', updated_at = NOW() WHERE slug = 'uzm-dr-aygul-resulova';
UPDATE doctor SET bio = 'Dəvətli Cərrah Mama-Ginekoloq.

Fəaliyyət sahələri:
Normal və riskli hamiləliklərin aparılması
Təbii doğuş və qeysəriyyə əməliyyatı
Ginekoloji estetik əməliyyatların aparılması
Sonsuzluğun müalicəsi
Hormon pozğunluqlarının müalicəsi
Uşaqlıqdaxili və dərialtı implantların taxılması
Hamiləliyin sonlandırılması', updated_at = NOW() WHERE slug = 'uzm-dr-aynur-ehmedova';
UPDATE doctor SET bio = 'Bakıdan dəvətli Travmatoloq-Ortoped.', updated_at = NOW() WHERE slug = 'uzm-dr-elcin-orucov';
UPDATE doctor SET bio = 'Bakıdan dəvətli İnvaziv Kardioloq.', updated_at = NOW() WHERE slug = 'uzm-dr-fedan-hacizade';
UPDATE doctor SET bio = 'Bakıdan dəvətli Uroloq-Androloq.

Fəaliyyət sahələri:
Kişi sonsuzluğu
Cinsi zəiflik
Cinsi yolla keçən infeksiyalar
Prostat vəzi xəstəlikləri
Sidik çıxarıcı yolların daş və infeksion xəstəlikləri
Sidik qaçırmalar
Kişi sonsuzluğunun cərrahi müalicəsi (TESE)
Mikroskopik yolla varikoselektomiya
Böyrək daşlarının açıq və qapalı yolla cərrahi müalicəsi
Sidik axarı və sidik kisəsi daşlarının açıq və qapalı yolla cərrahi müalicəsi
Prostat vəzinin adenomasının açıq və qapalı yolla (TUR-P) cərrahi müalicəsi', updated_at = NOW() WHERE slug = 'uzm-dr-fuad-ismayilov';
UPDATE doctor SET bio = 'Bakıdan dəvətli Cərrah Mama-Ginekoloq.', updated_at = NOW() WHERE slug = 'uzm-dr-gulcin-abdullah';
UPDATE doctor SET bio = 'Pediatrik reanimasiya və intensiv terapiya şöbəsinin məsul şəxsi.

Şöbə: Pediatriya

Fəaliyyət sahələri:
Ağır vəziyyətdə olan uşaqların müalicəsi
Mexaniki ventilyasiya (süni tənəffüs aparatı ilə nəfəs dəstəyi)
HFNC (High Flow Nasal Cannula),yüksək axınlı burun oksigen terapiyası
Sepsis, Septik şok, Çoxsaylı orqan çatışmazlığı
Terapevtik plazma mübadiləsi
Yataq başında ağciyər ultrasəs müayinəsi (POCUS)

İş təcrübəsi:
2010-2012 Həkim, Amasya Gümüşhacıköy Devlet Hastanesi, Türkiyə Amasya
2016-2017 Çocuk Sağlığı ve Hastalıkları Uzmanı, Hakkari Devlet Hastanesi, Türkiyə Hakkari
2017-2020 Çocuk Yoğun Bakım Yan Dal Asistanı, Bakırköy Dr. Sadi Konuk Eğitim ve Araştırma Hastanesi, Türkiyə, İstanbul
2020-2023 Çocuk Yoğun Bakım Uzmanı, Acıbadem Atakent Hastanesi Türkiyə, İstanbul
2023-2024 Çocuk Yoğun Bakım Uzmanı, Adıyaman Üniversitesi Tıp Fakültesi, Türkiyə Adıyaman
2024-2025 Çocuk Yoğun Bakım Uzmanı, Bahçelievler Medical Park Hastanesi, Türkiyə, İstanbul
2025- Pediatrik reanimasiya və intensiv terapiya şöbəsinin məsul şəxsi, Mərkəzi Klinika, Azərbaycan, Bakı', updated_at = NOW() WHERE slug = 'uzm-dr-guner-ozcelik';
UPDATE doctor SET bio = 'Bakıdan dəvətli Daxili xəstəliklər uzmanı.

Fəaliyyət sahələri:
Endokrinoloji Metobolizma xəstəlikləri (Hipofiz vəzi Qalxanabənzər vəzi, böyrəküsdü vəzi və.b xəstəlikləri)
Böyrək xəstəlikləri
Qan xəstəlikləri
Mədə bağırsaq və qaraciyər xəstəlikləri
Revmatoloji xəstəliklər
Terapevtik Təcili müdaxilələr (tireotoksikoz, adrenal böhran, diyabetik ketoasidoz, hepatik ensefalopatiyalar və.s)
Onkoloji xəstəliklərin diaqnostikası
Reanimatologiya (Terapevtik sahələr üzrə) və s.', updated_at = NOW() WHERE slug = 'uzm-dr-hebib-sahratov';
UPDATE doctor SET bio = 'Daxili Xəstəliklər Uzmanı.

Fəaliyyət sahələri:
Şəkərli diabet
Qalxanavari vəz xəstəlikləri
Hipofiz və böyrəküstü vəz xəstəlikləri
Arterial Hipertenziya
Mədə-bağırsaq sistemi xəstəlikləri
Qaraciyər və öd yollarının xəstəlikləri
Hepatitlər
Ağciyər və tənəffüs sistemi xəstəlikləri
Böyrək və sidik çıxarıcı yolların xəstəlikləri
Revmatoloji və sümük-əzələ sistemi xəstəlikləri
Anemiya (Qan azlığı)
Vitamin əksiklikləri
Xroniki halsızlıq sindromu və s.
Hematoloji və onkoloji xəstəliklərin diaqnostikası', updated_at = NOW() WHERE slug = 'uzm-dr-ilham-sadirov';
UPDATE doctor SET bio = 'Fəaliyyət sahələri:
Bel və boyun yırtığı
Menisk yırtığı
Skolioz, kifoz, lordoz
Donmuş çiyin müalicəsi
İqlaterapiya
Zəli terapiyası
İdmançı zədələri
Onurğa sütunu xəstəlikləri
Onurğa yırtığı və protruziyaları
Oynaq xəstəlikləri
Nevroloji reablitasiya
Travmatoloji reablitasiya
Kinezio bantlama', updated_at = NOW() WHERE slug = 'uzm-dr-taha-alper-ciber';
UPDATE doctor SET bio = 'Haqqında:
2019 - bugünədək Sağlam Ailə tibb mərkəzi / Həkim terapevt
2019 Sertifikasita / Terapiya üzrə
2002 - 2006 Gülhane Askeri Tıp Akademisi / Daxili xəstəliklər uzmanı
1998 - 2019 Silahlı Qüvvələrin Baş Klinik Hospitalı / Qastroenterologiya bölməsi
1993 - 1994 İnternatura / F. Əfəndiyev adına 4 saylı Klinik xəstəxana / Həkim terapevt
1987 - 1993 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'uzm-dr-terlan-abbasov';
UPDATE doctor SET bio = 'Uzman uroloq-androloq.
Şöbə: Cərrahiyyə və Transplantasiya Mərkəzi', updated_at = NOW() WHERE slug = 'uzm-dr-turan-memmedeliyev';
UPDATE doctor SET bio = 'Konfranslar:
2023 - COVID-19 pandemiyasında xidmətlərə görə təşəkkür/təltif
2023/2024/2025 - "Daxili xəstəliklər üzrə vaka paylaşımları", Bursa
2024 - "Türk Romatoloji Derneği Yaz Okulu", Eskişehir
2025 - "EKQ və rentgen görüntülərinin interpretasiyası və klinik tətbiqi" (onlayn təlim)
2025 - "Yoğun Bakımda 9. E-Yeterlilik Kursu", TÜYÜD təlim proqramı
05.2025 - "Autoimmun Hepatit xəstələrinin retrospektiv araşdırılması" mövzusunda diplom işi müdafiəsi', updated_at = NOW() WHERE slug = 'uzm-dr-zehra-memmedli';
UPDATE doctor SET bio = 'Ürək-damar cərrahı.

İş təcrübəsi:
2001 - 2018 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib
2018-ci ildən bu günədək Respublika Diaqnostika Mərkəzində ürək-damar cərrahı kimi fəaliyyət göstərir', updated_at = NOW() WHERE slug = 'valeh-memmedov';
UPDATE doctor SET bio = 'Fizioterapevt-Reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
Nevroloji xəstəliklər - İnsult, kəllə və onurğa beyin travmaları, baş və onurğa beyin şişləri əməliyyatı sonrası reabilitasiya, fəqərə arası disk yırtıqları, protruziyalar, karpal və kubital sinir sindromları, mielit, osteoxondroz, nevrozlar, dağınıq skleroz, neyropatiyalar, pleksopatiyalar, fibromialgiya, nevralgiya, nevritlər, parkinson, ifliclər və s.
Ortopedik xəstəliklər - Onurğa əyrilikləri (skolioz, kifoz və lordoz), sınıq və çıxıqlar sonrası reabilitasiya, artroz, artrit, menisk yırtığı, bağ zədələnmələri, daban mahmızı, donmuş çiyin sindromu, diz və bud-çanaq oynaqların protezləşməsi sonrası reabilitasiya və s.
Uroloji xəstəliklər - müxtəlif mənşəli sidikqaçırmalar (nikturiya, gecə enurezləri və s.)
Androloji xəstəliklər - Prostatit, peyroni, erektil disfunksiya (cinsi zəiflik), vezikulit və s.
Kardioloji və pulmonoloji xəstəliklər - Müxtəlif ürək və ağciyər xəstəlikləri sonrası ağırlaşmalar zamanı reabilitasiya.

İş təcrübəsi:
2022 - Kəpəz Hospital: Təcrübəçi
2023 - Stimul Hospital: Təcrübəçi
2024 - Koreya Şərq Təbabəti Klinikası: Fizioterapevt-reabilitoloq
2024 - Yeni Klinika: Fizioterapevt-reabilitoloq.', updated_at = NOW() WHERE slug = 'vaqif-abdullayev';
UPDATE doctor SET bio = 'Haqqında:
• 2025 - bugünədək Ultralab Tibb Mərkəzi Gəncə filialı / Baş həkim/ Şüa diaqnostikası üzrə həkim • 2023-2024 - Approlab Gəncə/ Həkim radioloq • 2022 - Gəncə Memorial Hospital/ Həkim radioloq • 2017-2022 - Synergy Medical/ Şüa diaqnostikası üzrə həkim • 2015-2017 - Bərdə Müalicə Diaqnostika Mərkəzi/ Şüa diaqnostikası üzrə həkim • 2014-2015 - Naftalan müalicə sağlamlıq mərkəzi/ Həkim-rentgenoloq • 2010-2013 - Çinar hotel&spa Naftalan filialı/ Həkim-rentgenoloq • 2000-2010 - Mingəçevir Mərkəzi xəstəxana/ Həkim-rentgenoloq • 1999-2000 - İnternatura - Mingəçevir Mərkəzi xəstəxana/ Şüa diaqnostikası üzrə həkim • 1993-1999- Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'vasif-haciyev';
UPDATE doctor SET bio = 'Haqqında:
2018 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim
2016 Sertifikasiya, Şüa diaqnostika üzrə
2016 - 2018 Effekt - Digital MMC, Şüa diaqnostika üzrə həkim
2015 - 2016 Nigar Klinkası, Şüa diaqnostika üzrə həkim
2010 - 2011 Ə.Əliyev adına ADHTİ, şüa diaqnostika üzrə təkmilləşdirmə kursu
2004 - 2012 Sağlam Ailə Tibb Mərkəzi, Həkim funksional diaqnostika
2001 - 2002 İnternatura , Ə.F.Qarayev adına 2 saylı klinik uşaq xəstəxanası, Funksional diaqnostika üzrə həkim
1995 - 2001 Azərbaycan Tibb Universiteti, Həkim pediatr', updated_at = NOW() WHERE slug = 'vefa-eldar';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'veliyeva-gunay-azer';
UPDATE doctor SET bio = 'İş təcrübəsi:
Həkim, ATU-nun Onkoloji klinikası (2002-dən hal-hazıra qədər)

Təlimlər:
Gənc həkimlərin forumu (2012)
Memecerahiyyesi kursu (2015)
Memekanserinde yeni yaklaşmalar (2016)
ESMO (2016)
Onkoplastikavə mammaplastika kursu (2017)
Seviyye III Rekanstruktivmemekansericerrahisi (2017)
Süd vəzin onkoplastik və rekonstruktiv cərrahiyyəsi kursu (10.03-31.03.2018)
Breastanbul (11.10-13.10.2018)
Meme hakkında her şey - süd vəzin plastikasına aid konfrans (01.03-04.03.2018)
Meme kanserinde yeni yaklaşmalar (12.01-14.01.2019)
Moscow Breast meeting (07.02-09.02.2019)', updated_at = NOW() WHERE slug = 'veliyeva-vefa';
UPDATE doctor SET bio = 'Neyrocərrah.
Elmi dərəcə: Tibb elmləri doktoru

İş təcrübəsi:
1993 - 1996 Aparıcı özəl tibb mərkəzlərində fəaliyyət göstərib.
2003-2015 Federal Dövlət Büdcə Müəssisəsi, Prof. A.L. Polenova adına Rusiya Neyrocərrahiyyə İnstitutu, Sankt-Peterburq, Rusiya - Serebral damar cərrahiyyəsi şöbəsinin neyrocərrahı
2003-2015 Sankt-Peterburq Şəhər Büdcə Səhiyyə Təşkilatı "Mariinskaya Xəstəxanası", Sankt-Peterburq, Rusiya - Neyrocərrahiyyə şöbəsi, Neyrocərrah
2005-2019 Federal Dövət Büdcə Təşkilatı, V. A. Almazova adlna Milli Tibbi Diaqnostika Mərkəzi., Prof. A.L. Polenova adına Rusiya Neyrocərrahiyyə İnstitutu, Sankt-Peterburq, Rusiya - Serebral qan dövran patologiyası elmi-tədqiqat laboratoriyasının baş elmi işçisi
20015-2020 Sankt-Peterburq Şəhər Büdcə Səhiyyə Təşkilatı "Elizavetinskaya Xəstəxanası", Sankt-Peterburq, Rusiya - Neyrocərrah, 2 saylı Neyrocərrahiyyə şöbəsinin müdiri
2019-2021 Federal Dövlət Büdcə Təşkilatı, V. A. Almazova adlna Milli Tibbi Diaqnostika Mərkəzi., Prof. A.L. Polenova adına Rusiya Neyrocərrahiyyə İnstitutu, Sankt-Peterburq, Rusiya - Serebral qan dövran patologiyası elmi-tədqiqat laboratoriyasının aparıcı elmi işçisi
2021-2022 Sankt-Peterburq Şəhər Büdcə Səhiyyə Təşkilatı "Alexandrovskaya Xəstəxanası ", Sankt-Peterburq, Rusiya - Neyrocərrahiyyə şöbəsi, Neyrocərrah 2
Hal hazırda Respublika Diaqnostika Mərkəzində fəaliyyət göstərir
Sertifikatlar, dərəcələr
Rusiya Neyrocərrahlar Assosiasiyasının, prof. İ.S. Babçin adına Sankt-Peterburq Neyrocərrahlar Cəmiyyətinin,akademik F.A.Serbinenko adına Endovaskulyar Neyrocərrahlar Assosiasiyasının üzvü.
2011-ci ildə Sankt-Peterburq Səhiyyə Komitəsinin Attestasiya Komissiyası "Neyrocərrahiyyə" ixtisası üzrə ən yüksək ixtisas kateqoriyasına layiq görülüb.', updated_at = NOW() WHERE slug = 'vuqar-eliyev';
UPDATE doctor SET bio = 'Uroloq-cərrah.

İş təcrübəsi:
2008-2024 Akademik M.C.Cavadzadə adına Respublika Kliniki Urolojı Xəstəxana, həkim uroloq
2015-2020 MediStyle Hospitalda həkim uroloq-androloq
2020-2024 Caspian İnternational Hospital uroloq-androloq
İcra etdiyi əməliyyatlar:
Böyrək və sidik yolları daşlarının endoskopik lazer cərrahiyəsi
Laparoskopik cərrahiyə
Prostat vəzi adenomasının endoskopik cərrahiyəsi
Sidik kisəsi törəmələrinin endoskopik cərrahiyəsi
Böyrək və sidik-cinsiyyət sisteminin bəd və xoşxassəli törəmələrinin cərrahiyəsi
Böyrək-sidik yollarının anadangəlmə və qazanılmış qüsurlarının rekonstruktiv cərrahi əməliyyatları
Kişi sonsuzluğunun mikrocərrahi müalicəsi.', updated_at = NOW() WHERE slug = 'vuqar-fiqarov';
UPDATE doctor SET bio = 'Şöbə: Uşaq Cərrahiyyəsi

İş təcrübəsi:
Uşaq cərrahiyyəsi sahəsində apardığı əməliyyatların sayı 5000-i ötmüşdür.
2014-cü ildən Mərkəzi Gömrük Hospitalı, uşaq cərrahı və uşaq uroloqu
2 fevral 2023-cü il tarixindən etibarən Mərkəzi Gömrük Hospitalının Uşaq Cərrahiyyəsi şöbəsinin rəisi təyin edilib.

Lisenziya və sertifikatlar:
2011 Uşaqlarda Bronxoskopiya elmi toplantısı, Türkiyə, İstanbul
2012 Beynəlxalq Hipospadiya Workshop - lll, Türkiyə, İstanbul
2012 Türk Cərrahi Dərnəyi tərəfindən təşkil edilən Temel Cerrahi Kavramlar, Tutumlar və Beceriler mövzusunda kurs. Türkiyə, İstanbul
2013 IV. Beynəlxalq Pediatrik Uroloji (PEDURO) konqresi, Türkiyə, Konya
2015 Beynəlxalq Uşaq Cərrahiyyəsi və Uşaq Urologiyası konqresi, Türkiyə, Antalya
2016 Beynəlxalq Uşaq Cərrahiyyəsi və Uşaq Urologiyası konqresi- Kuzey Kıbrıs Türk Cümhuriyyəti
2018 36-cı Beynəlxalq Uşaq Cərrahiyyəsi konqresi. 3-cü Beynəlxalq Pediatrik Endoskopik Yaxın Şərq Bölməsi Konqresi, Türkiyə, Izmir
2019 VI Ümumdünya Uşaq Cərrahiyyəsi konqresi, Qətər, Doha
2021 Türkiyə Torakal Cərrahlar Cəmiyyətinin təşkilatçılığı ilə "Uşaqlarda döş qəfəsi deformasiyalarının cərrahi və qeyri-cərrahi - vakuum üsulu ilə müalicəsi" mövzusunda beynəlxalq konfrans. Türkiyə, İstanbul
2022 Dünya Uşaq Cərrahları Assosiasiyasının təşkilatşılığı keçirilən VII Dünya Uşaq Cərrahiyyəsi konqresində iştirak edib. Çexiya Respublikası, Praqa şəhəri.
2023 Türkiyə Uşaq Cərrahiyyəsi Dərnəyinin təşkilatçılığı ilə Türkiyə Cümhuriyyətinin 100-cü ildönümü və Türkiyə Uşaq Cərrahiyyəsi Dərnəyinin 40-cı ildönümünə həsr edilmiş 40-cı Milli Uşaq Cərrahiyyəsi Konqresi. Türkiyə, Ankara şəhəri.
2025 Avropa Uşaq Cərrahiyyəsi Cəmiyyətinin təşkil etdiyi Avropa Uşaq Cərrahiyyəsi "Board" imtahanını uğurla keçərək, beynəlxalq səviyyədə tanınan sertifikata layiq görülüb.
2026. Avropa Uşaq Urologiyası Cəmiyyətinin 36-cı Konqresində iştirak edib. Fransa, Paris şəhəri.
Üzv olduğu təşkilatlar
Türk Təbiblər Birliyi
Türkiyə Uşaq Cərrahiyyəsi Dərnəyi
Türk Hipospadiya Dərnəyi
Avropa Uşaq Cərrahiyyəsi Assosiasiyasının üzvü', updated_at = NOW() WHERE slug = 'vusal-ceferov';
UPDATE doctor SET bio = 'Haqqında:
2020 - bugünədək Sağlam Ailə Tibb Mərkəzində / Həkim - kardioloq
2015 - 2015 - Astoriya Tibb Mərkəzi / Həkim - kardioloq
2009 - 2014 - VM Endokrinologiya Diabet və Metabolizm Mərkəzi / Həkim - kardioloq
2007 - 2007 - Moskva Federal Agentliyinin Dövlət Elmi Tədqiqat Profilaktik Tibb Mərkəzi / Həkim-kardioloq
2003 - 2007- Rusiya Elmi-İstehsalat Kompleksin Kardioloji Mərkəzin A.L. Myasnikov adına Klinik Kardiologiya İnstitutu / Həkim-kardioloq
2003 - 2007 - RF SN Rusiya kardioloji elmi-istehsalat kompleksi / Kardioloq ixtisası üzrə aspirantura pilləsini bitirmiş
1995 - 2001 - Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'xana-eliyeva';
UPDATE doctor SET bio = 'Haqqında:
2004 - bugünədək Sağlam Ailə Tibb Mərkəzi
2014 Sertifikasiya, Pediatriya üzrə
2014 Ə.Əliyev adına Azərbaycan Dövlət Həkimlərin Təkmilləşdirmə İnstitutu
2002 - 2003 İnternatura. K.Y. Fərəcov adına Elmi Tədqiqat Pediatriya İnstitutu
1996 - 2002 Azərbaycan Tibb Universiteti, Pediatriya', updated_at = NOW() WHERE slug = 'xanim-ehmedova';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2022-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'xanmemmedova-seide-qiyas';
UPDATE doctor SET bio = 'Həkim-anestezioloq-reanimatoloq.
MediClub-da 2002-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'xasiyev-arif-isfendiyar';
UPDATE doctor SET bio = 'Şöbə: Anesteziologiya və Reanimasiya

İş təcrübəsi:
1997-2019 Azərbaycan Respublikası Müdafiə Nazirliyi, Baş Hərbi Klinik Hospitalın Təxirəsalınmaz Yardım və Anesteziologiya- Reanimasiya şöbəsinin həkim ordinatoru, şöbə rəisi
2013-2019 Azərbaycan Respublikası Silahlı Qüvvələrin Baş anestezioloq-reanimatoloqu
2019- cu ildən Mərkəzi Gömrük Hospitalında Reanimasiya və intensiv terapiya şöbəsində anestezioloq-reanimatoloq kimi çalışır
Nailiyyətlər və Üstünlüklər
2016-cı ilin aprel ayında Azərbaycan Respublikası Prezidenti tərəfindən "Hərbi xidmətlərə görə" medal ilə təltif olunub.
2021-ci ildə Dövlət Gömrük Komitəsi tərəfindən Fəxri Fərman ilə təltif olunub.

Lisenziya və sertifikatlar:
2017 Almaniya, Berlin şəhəri, Bundeswehrkrankenhaus Şarite klinikasının təhsil bazası, Anesteziologiya-reanimatologiya üzrə ixtisasartırma kursu
2015 Almaniya, Unna Nevroloji klinikasında nevrologiya üzrə intensiv terapiya kursu
2019 ATU-nun vəTürkiyənin Ankara Universitetinin təşəbbüsü ilə keçirilmiş "Pediatrik reanimasiya və təcili pediatrik yardım" üzrə təlim kursu, Bakı, Azərbaycan
2019 Türkiyənin Florence Nightingale Xəstəxanalar Qrupunda təkmilləşdirmə kursunda iştirak edib​​​​​​​
Üzv olduğu təşkilatlar
2016 Azərbaycan Reanimatologiya və Anesteziologiya Cəmiyyəti', updated_at = NOW() WHERE slug = 'xeyal-memmedov';
UPDATE doctor SET bio = 'Kardioloq.

İş təcrübəsi:
2020-ci ildən bu günədək Respublika Diaqnostika Mərkəzində fəaliyyət göstərir.', updated_at = NOW() WHERE slug = 'xeyale-hesenova';
UPDATE doctor SET bio = 'Şöbə: Terapiya

İş təcrübəsi:
1997-2020 Akad. Mirqasımov adına Respublika Kliniki Xəstəxanası
2020-ci ildən Mərkəzi Gömrük Hospitalında terapevt kimi çalışır.
İxtisasartırma kursları
2001 Kliniki kardiologiyada funksional diaqnostika üzrə ümumi təkmilləşmə kursu, Azərbaycan, Bakı
2008 Kliniki kardiologiya üzrə tematik təkmilləşmə kursu, Azərbaycan, Bakı
2015 Terapiya üzrə təkmilləşmə kursu, Azərbaycan, Bakı
2018 Qastroenterologiya üzrə təkmilləşmə kursu, Azərbaycan, Bakı
2018 Nefrologiya üzrə təkmilləşmə kursu, Azərbaycan, Bakı
2018 Hematologiya üzrə təkmilləşmə kursu, Azərbaycan, Bakı

Lisenziya və sertifikatlar:
2009 Beynəlxalq qastroenterologiya həftəsi, Türkiyə, Ankara
2011 XXVIII Türkiyə Qastroenterologiya həftəsi, Türkiyə, Antalya
2015 XV Beynəlxalq Kolon-Rektum Cərrahiyyə Konqresi, Türkiyə, Antalya
2018 Beynəlxalq daxili xəstəliklər konqresi, Türkiyə, Sakarya
2019 Beynəlxalq daxili xəstəliklər konqresi, Türkiyə, Antalya
2022 Türkiyənin Ankara Universitetinin tibb fakültəsinin Cebeci xəstəxanasının Ağciyər xəstəlikləri şöbəsində "JAEGER Master screen Body" cihazında aparılan müayinələr üzrə praktiki kursda iştirak edib, Türkiyyə, Ankara
2023 Ulu Öndər Heydər Əliyevin anadan olmasının 100 illiyinə həsr olunmuş "Kistoz fibroz - Standart müalicədən modulyator müalicəsinə doğru" mövzusunda elmi-praktiki konfrans. Azərbaycan, Bakı şəhəri
2024 Türk Ağciyər Sağlığı və Reanimasiya Dərnəyinin təşkilatçılığı ilə keçirilən Beynəlxalq Ağciyər Sağlığı konqresi. Türkiyə, Antalya şəhəri', updated_at = NOW() WHERE slug = 'xumar-novruzova';
UPDATE doctor SET bio = 'Haqqında:
• 2025 - bugünədək Sağlam Ailə Tibb Mərkəzi / Həkim hematoloq • 2024 Sertifikasiya / Hematologiya üzrə • 2010 - 2011 İnternatura / Mərkəzi Klinika / Həkim Hematoloq • 2004 - 2010 Azərbaycan Tibb Universiteti / Müalicə işi', updated_at = NOW() WHERE slug = 'xuraman-ceferova';
UPDATE doctor SET bio = 'İş təcrübəsi:
Həkim-interna, A.T. Abbasov adına Bakı Şəhər Onkoloji Dispanseri (1993-1994)
Baş laborant, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1994-1997)
Assistent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (1997-2015)
Dosent, Azərbaycan Tibb Universitetinin Onkologiya kafedrası (2015-hal-hazıradək)', updated_at = NOW() WHERE slug = 'yaser-hetemov';
UPDATE doctor SET bio = 'Həkim-laborant.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'yusibova-gunel-nadir';
UPDATE doctor SET bio = 'Təcili yardım xidmətinin həkimi.
MediClub-da 2020-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'yusifov-fuad-sabir';
UPDATE doctor SET bio = 'Haqqında:
2010 - bugünədək Sağlam Ailə Tibb Mərkəzi, Şüa diaqnostika üzrə həkim
2014 - bugünədək Müasir Diaqnostika Klinikası, Şüa diaqnostika üzrə həkim
2014 Sertifikasiya, Şüa diaqnostika üzrə
2010 - Qaragözova MMC-nin Tibb Mərkəzi, Şüa diaqnostika üzrə həkim
2007 - 2009 Kəlbəcər Mərkəzi Rayon Xəstəxanası, Şüa diaqnostika üzrə həkim
2006 Ə.Əliyev adına Azərbaycan Dövlət Həkimləri Təkmilləşdimə İnstitutu, Ultrasəs müayinəsi kursu
2006 - 2007 Kəlbəcər Mərkəzi Rayon Xəstəxanası, Sahə həkimi
1996 - 2003 Gülüstan Koorporativi, Həkim terapevt
1990 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya üzrə kurs
1987 Ə.Əliyev adına Həkimləri Təkmilləşdirmə İnstitutu, Terapiya üzrə kurs
1986 - 1996 N saylı Tibb Məntəqəsi, Həkim terapevt
1983 - 1986 N saylı Tibb Məntəqəsi, Həkim infeksonist / terapevt
1980 - 1981 İnternatura. Ak.Mirqasımov adına Respublika Klinik Xəstəxanası, Həkim terapevt
1974 - 1980 Azərbaycan Tibb Universiteti, Müalicə işi', updated_at = NOW() WHERE slug = 'zemfira-haciyeva';
UPDATE doctor SET bio = 'Şöbə: Patomorfologiya

İş təcrübəsi:
2015 ci ildən Mərkəzi Gömrük Hospitalında həkim-patomorfoloq kimi çalışır
2020 ci ildən Mərkəzi Gömrük Hospitalında Patomorfoloji Diaqnostika şöbəsinin rəisi təyin olunub.

Lisenziya və sertifikatlar:
2012 Gastrik karsinomlarda uygulamalı kursu , Ankara, Türkiyə
2012 CPR eğitimi, Ankara, Türkiyə
2012 Temel Nöropatoloji Kursu, İstanbul, Türkiyə
2012 24.Avrupa Patoloji Konqresi, Çexiya Respublikası, Praga
2013 5. Ulusal Sitopatoloji Konqresi, Türkiyə, Antalya
2013 23. Ulusal Patoloji konqresi, Türkiyə, İzmir
2013 Sıvı bazlı sitoloji kursu, Türkiyə, İstanbul
2014 Temel Nöropatoloji kursu, Türkiyə, İstanbul
2014 Üropatoloji kursu, Türkiyə, Ankara
2014 26.Avrupa Patoloji Konqresi, İngiltərə, London
2015 Ankara Patoloji Kış okulu, Türkiyə, Ankara
2015 "Update in soft tissue pathology, From Morfology to Molecular Diagnosis", Türkiyə, Ankara
2015 39.Avrupa Sitoloji Konqresi, İtaliya, Milan
2015 25.Ulusal Patoloji ve 6. Sitopatoloji Konqresi, Türkiyə, Bursa
2017 Patoloji kış okulu, Türkiyə, Ankara
2017 İnteraktiv sitoloji kursu, Türkiyə, İstanbul
2017 Seminar-Glial törəmələrdə molekular testlər, Gürcüstan, Batumi
2017 27.Ulusal Patoloji Konqresi, Türkiyə, Antalya
2017 Olgularla Nefropatoloji kursu, Türkiyə, Ankara
2018 II Uluslararası TURAZ Adli Bilimlər və Patoloji Konqresi, Türkiyə, İstanbul
2018 28-ci Ulusal Patoloji Konqresi, Türkiyə, Ankara
2018 8-ci Ulusal SİTOPATOLOJİ konqresi, Türkiyə, İzmir
2018 28-ci Ulusal Patoloji Konqresi, Türkiyə, Ankara
2022 XXXIV Avropa Patologiya Konqresi. İsveçrə, Basel şəhəri.
2025 Azərbaycan Klinik Laboratoriya Mütəxəssisləri İctimai Birliyinin təşkilatçılığı ilə 3-cü Beynəlxalq Azərbaycan Laborator Tibb Konqresi & Lab Expo tədbirində məruzəçi və panel sədri qismində iştirak edib. Azərbaycan, Bakı şəhəri
2026 Asiya Sitologiya Cəmiyyətləri Federasiyasının təşkilatçılığı ilə keçirilən nüfuzlu I Asiya Sitolopatologiya Konfransında Baş-beyin törəmələrinin diaqnostikasında sitologiyanın rolu" mövzusunda elmi məruzə ilə çıxış edib. Çin, Hong Kong şəhəri.
Üzv olduğu təşkilatlar
Ankara Patoloji Dərnəyi', updated_at = NOW() WHERE slug = 'zerife-yusifli';
UPDATE doctor SET bio = 'MediClub KIDS uşaq klinikasının baş həkimi, Tibb elmləri doktoru.
Həkim-pediatr.
MediClub-da 2026-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'zeynalov-bextiyar-fexreddin';
UPDATE doctor SET bio = 'Həkim-pediatr.
MediClub-da 2001-ci ildən çalışır.', updated_at = NOW() WHERE slug = 'zeynalova-rena-selim';
UPDATE doctor SET bio = 'Fizioterapevt-Reabilitoloq.
Şöbə: Fizioterapiya və Reabilitasiya

Müalicə etdiyi xəstəliklər:
İnsult sonrası reabilitasiya
Menisküs zədələrində reabilitasiya
Bel ağrıları
İmpingement sindromu
Serebral iflic
Doun sindromu
Braxial pleksus
Skolioz,kifoz,lordoz
Diz-hip endoprotezinden sonra reabilitasiya
Spina bfida
Dayaq-hərəkət sistemi xəstəlikləri
Multipl skleroz
Parkinson
Yerişin bərpası
Totikolis.

İş təcrübəsi:
2021-2022 - Türkiyə Respublikası, Medicine Hospital: Təcrübəçi fizioterapevt
2022-2023 - Baku Medical Plaza: Təcrübəçi fizioterapevt
2023-2024 - Türkiyə Respublikası, Cerrahpaşa Tibb Fakültəsi Xəstəxanası: Təcrübəçi fizioterapevt
2023-2024 - Türkiyə Respublikası, Metin Sabancı Türkiye Spastik Çocuklar Vakfı: Təcrübəçi fizioterapevt
2024 - Türkiyə Respublikası, Acıbadem Xəstəxanası: Fizioterapevt.', updated_at = NOW() WHERE slug = 'zeyneb-memmedova';
UPDATE doctor SET bio = 'Audioloq.

Fəaliyyət sahələri:
Audiometriya və Timpanometriya müayinəsi
Eşitmə cihazlarının satışı və tətbiqi
Fərdi qəlib və montaj', updated_at = NOW() WHERE slug = 'zulfiyye-abbasova';
