-- Make every table able to hold Azerbaijani.
--
-- Found by trying to insert a laboratory called "Sağlam Ailə" and being told
-- the value was invalid. On production these tables are latin1, which cannot
-- represent ə, ğ, ş or ı at all; locally MySQL defaults to utf8mb4, so the same
-- insert worked and the problem was invisible until it reached the server.
--
-- The reach of it is worse than the laboratory. users.name is latin1, so
-- somebody registering as "Səbinə" is refused - in a product whose whole
-- audience writes their name that way. V4 converted the columns that mattered
-- in 2025, which is why chat_messages.message is already utf8mb4 and chat has
-- worked; every table created since inherited the server default again.
--
-- No data is at risk. These columns could only ever have held latin1 bytes, and
-- there are none outside ASCII in any of them - checked before writing this.
--
-- Deliberately schema only. The seed that exposed this lives in its own
-- migration, so a failure loading data can never again leave half-applied
-- column changes behind: MySQL does not roll DDL back, and that is what turned
-- one bad insert into a restart loop.

-- Foreign keys are switched off for the conversion.
--
-- conversations.conversation_id is a varchar and is referenced by other tables.
-- Converting one side leaves the two charsets briefly mismatched, and the
-- server refuses with "incompatible" rather than converting both. They all end
-- up utf8mb4 together, so the constraint holds again the moment this is done.
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE appointments CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE batch_file_uploads CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE blog_post CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE blog_post_tags CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE chats CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE chat_messages CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE conversations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE conversation_files CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE file_attachment CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE guest_sessions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE health_connection CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_order CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_order_item CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE lab_test CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE medical_profiles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE medical_specialties CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE notification CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE tag CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE usage_metrics CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE user_roles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- What the laboratory columns were for.
--
-- Where a price came from and when it was read: prices drift, and a stale one
-- here is a worse error than a stale biography.
ALTER TABLE lab
    ADD COLUMN source VARCHAR(120) NULL AFTER description,
    ADD COLUMN prices_read_at DATETIME(6) NULL AFTER source;

-- The laboratory's own grouping. Seven hundred tests in one flat list cannot be
-- browsed, and three different tests are all called "Qlükoza".
ALTER TABLE lab_test
    ADD COLUMN category_az VARCHAR(120) NULL AFTER name_ru,
    ADD COLUMN category_en VARCHAR(120) NULL AFTER category_az;
