-- Somewhere to keep what a doctor sends when they claim a listing.
--
-- It was being dropped: the claim moved the listing to PENDING and kept the
-- account that asked, but the evidence - a diploma number, a place of work, a
-- contact - went nowhere a reviewer could read it, and into the public bio
-- when the listing had none. A reviewer asked to decide a claim had nothing to
-- decide it on, and a patient could read somebody's licence number.
--
-- Private. Only the admin list reads it; nothing public selects it.
--
-- Schema only. Declared utf8mb4 explicitly, because this table is not
-- guaranteed to default to it on the server and evidence is written in
-- Azerbaijani.

ALTER TABLE doctor
    ADD COLUMN claim_evidence TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    ADD COLUMN claimed_at DATETIME(6) NULL;
