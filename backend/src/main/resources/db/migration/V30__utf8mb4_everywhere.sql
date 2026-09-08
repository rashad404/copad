-- Let the laboratory tables hold Azerbaijani.
--
-- Found by inserting a laboratory called "Saglam Aile" and being told the value
-- was invalid: on production these tables are latin1, which has no way to
-- represent e-schwa, g-breve, s-cedilla or dotless i. Locally MySQL defaults to
-- utf8mb4, so the same insert worked and the problem only appeared on the
-- server.
--
-- Scoped to the tables created since V20, which are the ones this seed needs
-- and are all empty. Two earlier attempts tried to convert the whole database
-- at once and failed on the server both times: MariaDB will not alter a column
-- a foreign key points at, even with foreign key checks off, and the generated
-- constraint names differ between databases so they cannot be dropped by name.
-- The rest of the conversion is worth doing and is worth doing on its own,
-- where it can be tested without a data load riding on it.
--
-- None of these tables has a text-typed foreign key, which is what makes a
-- plain conversion safe here.
--
-- Schema only. MySQL does not roll back DDL, so when the columns and the data
-- were one migration a rejected insert left the columns behind and every
-- restart then failed on "duplicate column".

ALTER TABLE lab CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_test CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_order CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_order_item CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE notification CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE health_connection CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Where a price came from and when it was read: prices drift, and a stale one
-- is a worse error here than a stale biography.
ALTER TABLE lab
    ADD COLUMN source VARCHAR(120) NULL AFTER description,
    ADD COLUMN prices_read_at DATETIME(6) NULL AFTER source;

-- The laboratory's own grouping. Seven hundred tests in one flat list cannot be
-- browsed, and three different tests are all called "Qlukoza".
ALTER TABLE lab_test
    ADD COLUMN category_az VARCHAR(120) NULL AFTER name_ru,
    ADD COLUMN category_en VARCHAR(120) NULL AFTER category_az;
