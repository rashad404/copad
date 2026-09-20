-- Baku is spelled two ways in the clinic table, and the city filter is exact.
--
-- V22 wrote the Liv Bona Dea clinic's city as "Baki", in plain ASCII, before
-- anything filtered on it. Every clinic seeded since writes "Bakı". The public
-- search compares with LOWER(c.city) = LOWER(:city), and the database's
-- collation does not treat the dotless i as the same letter, so the two
-- spellings are two different cities.
--
-- What that does to a patient: choosing Baku in the directory returns 207
-- doctors and silently omits the 112 at Liv Bona Dea, who are in Baku. Nothing
-- reports an error - the filter simply answers with less than the truth, which
-- is the failure mode this directory can least afford.
--
-- Azerbaijani is the language of the directory, so "Bakı" is the spelling that
-- stays, and the address is corrected with it.

UPDATE clinic
SET city = 'Bakı',
    address = 'Ziya Bünyadov prospekti 2091, Bakı',
    updated_at = NOW()
WHERE slug = 'liv-bona-dea-hospital'
  AND city = 'Baki';
