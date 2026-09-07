-- What a person actually agreed to, and when.
--
-- Health data is a special category under Azerbaijani law and consent for it
-- has to be explicit. Until now the product took none at all, while the privacy
-- policy told people they could withdraw it - a promise about something that
-- never happened.
--
-- Separate rows per purpose rather than one blanket acceptance. Holding a
-- record and sending its contents abroad for processing are different
-- decisions, and a person may reasonably accept the first and refuse the
-- second. One tick covering both would record an agreement nobody actually
-- made.
--
-- The policy version is stored with the grant. Consent is to a specific text,
-- and a text that has since been rewritten cannot show what was agreed.

CREATE TABLE consent (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    user_id         BIGINT       NOT NULL,

    -- RECORD_STORAGE, CROSS_BORDER_AI, GUARDIAN.
    consent_type    VARCHAR(32)  NOT NULL,

    -- Which member this concerns, for a guardian attestation. Null otherwise.
    family_member_id BIGINT      NULL,

    -- The version of the text agreed to.
    policy_version  VARCHAR(32)  NOT NULL,

    granted_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    -- Set rather than deleted, so a withdrawal is itself part of the record.
    withdrawn_at    DATETIME(6)  NULL,

    PRIMARY KEY (id),
    KEY idx_consent_user (user_id, consent_type, withdrawn_at),
    CONSTRAINT fk_consent_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
