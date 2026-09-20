-- How many times a listing has been opened.
--
-- The directory is past eight hundred doctors and the drug catalogue holds ten
-- thousand products. Nobody can tell which of them anybody actually reads, so
-- there is no way to know which clinics are worth approaching, which drugs
-- deserve better data, or whether a page is worth the trouble of keeping.
--
-- A counter on the row rather than a table of events: the question is "how
-- many", not "who", and a health site should not be building a log of which
-- person read which drug page.
--
-- Schema only.

ALTER TABLE doctor
    ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;

ALTER TABLE medicine
    ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0;
