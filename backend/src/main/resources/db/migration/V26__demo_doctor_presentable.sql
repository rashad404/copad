-- Make the demo listing look like a real profile.
--
-- V25 created it as "Test Hekim (azdoc daxili test)", which is honest but
-- useless for showing somebody how the product works - the first thing they
-- read is that none of it is real. It now reads as an ordinary profile.
--
-- What does not change is that it stays unlisted: it never appears in search,
-- the sitemap, or the specialty counts the assistant is given, so nobody can
-- arrive at it by browsing. It is reachable only by its own link, which is
-- what makes a presentable demo listing acceptable rather than a fabricated
-- doctor sitting in a public directory.
--
-- The name is invented and deliberately matches none of the seeded Liv Bona
-- Dea doctors. There is no photograph, because a real person's face is the one
-- part of this that could not be invented.

UPDATE clinic SET
    name = 'azdoc Klinikası',
    address = 'Nizami küçəsi 203, Bakı',
    district = 'Nəsimi',
    city = 'Bakı',
    phone = '+994 12 000 00 00',
    description = 'azdoc nümunə klinikası.',
    updated_at = NOW()
WHERE slug = 'azdoc-test-clinic';

UPDATE doctor SET
    full_name = 'Dr. Səbinə Kərimli',
    slug = 'dr-sebine-kerimli',
    specialty_code = 'general-practice',
    qualifications = 'Azərbaycan Tibb Universiteti - Müalicə işi fakültəsi (2009-2015) | Azərbaycan Tibb Universiteti Tədris Terapevtik Klinikası - Həkim-rezident (2015-2018)',
    years_experience = 11,
    bio = 'Fəaliyyət sahələri: Ümumi müalicə və profilaktik müayinə, Yüksək qan təzyiqi və şəkər xəstəliyinin izlənməsi, Mövsümi infeksiyalar, Analiz nəticələrinin izahı, Uzunmüddətli xəstəliklərin idarə olunması.',
    languages = 'az,ru,en',
    consultation_fee = 50.00,
    updated_at = NOW()
WHERE slug = 'azdoc-test-hekim';
