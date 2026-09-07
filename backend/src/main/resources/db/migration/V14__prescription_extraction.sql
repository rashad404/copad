-- Medications read out of an uploaded prescription.
--
-- Same rule as lab results: a parsed medication is a proposal, not a record.
-- Text extraction misreads a dose as readily as it reads one, and a wrong dose
-- in a medication list is exactly the kind of error that gets acted on, so a
-- person confirms each row before it counts.
--
-- Rows created by hand are confirmed on creation, so existing medications are
-- backfilled as confirmed rather than suddenly appearing unreviewed.

ALTER TABLE medications
    ADD COLUMN confirmed           TINYINT(1)  NOT NULL DEFAULT 1 AFTER active,
    ADD COLUMN confirmed_by_user_id BIGINT     NULL     AFTER confirmed,
    ADD COLUMN confirmed_at        DATETIME(6) NULL     AFTER confirmed_by_user_id,
    -- Where it came from, so a person reviewing a proposal can open the
    -- prescription it was read from.
    ADD COLUMN source_document_id  BIGINT      NULL     AFTER confirmed_at;

ALTER TABLE medications
    ADD CONSTRAINT fk_medications_source_document
        FOREIGN KEY (source_document_id) REFERENCES document (id) ON DELETE SET NULL;

CREATE INDEX idx_medications_unconfirmed
    ON medications (family_member_id, confirmed, deleted_at);
