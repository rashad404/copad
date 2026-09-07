-- Structured clinical records.
--
-- MedicalProfile stored conditions, allergies and medications as four free-text
-- blobs on the user. Free text cannot be checked against a drug interaction
-- list, cannot be filtered by "active", and cannot say when something started
-- or stopped - so it can inform a conversation but never a safety check.
--
-- Everything here hangs off family_members, not users: the record belongs to a
-- person, who may have no login.

CREATE TABLE medical_conditions (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    family_member_id  BIGINT       NOT NULL,
    label             VARCHAR(255) NOT NULL,
    -- Coded where known, free text otherwise. Coding is what later allows
    -- interaction and contraindication checks; requiring it up front would
    -- just push people back to free text.
    icd10_code        VARCHAR(16)  NULL,
    status            VARCHAR(16)  NOT NULL DEFAULT 'ACTIVE',
    severity          VARCHAR(16)  NULL,
    onset_date        DATE         NULL,
    resolved_date     DATE         NULL,
    notes             TEXT         NULL,
    recorded_by_user_id BIGINT     NULL,
    created_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at        DATETIME(6)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_conditions_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_conditions_user   FOREIGN KEY (recorded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_conditions_member ON medical_conditions (family_member_id, status);

CREATE TABLE allergies (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    family_member_id  BIGINT       NOT NULL,
    allergen          VARCHAR(255) NOT NULL,
    allergen_type     VARCHAR(24)  NOT NULL DEFAULT 'OTHER',
    reaction          VARCHAR(512) NULL,
    -- Severity drives whether the assistant must warn before anything else.
    severity          VARCHAR(16)  NOT NULL DEFAULT 'UNKNOWN',
    onset_date        DATE         NULL,
    active            TINYINT(1)   NOT NULL DEFAULT 1,
    notes             TEXT         NULL,
    recorded_by_user_id BIGINT     NULL,
    created_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at        DATETIME(6)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_allergies_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_allergies_user   FOREIGN KEY (recorded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_allergies_member ON allergies (family_member_id, active);

CREATE TABLE medications (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    family_member_id  BIGINT        NOT NULL,
    name              VARCHAR(255)  NOT NULL,
    -- Filled in Phase 3, when the drug catalogue is copied across. Nullable so
    -- a medication can be recorded now and matched to a catalogue entry later.
    medicine_id       BIGINT        NULL,
    active_ingredient VARCHAR(255)  NULL,

    -- Dose is split into amount and unit rather than stored as "500mg".
    -- A string cannot be compared, summed, or checked against a maximum, and
    -- dosing errors are a leading cause of avoidable harm.
    dose_amount       DECIMAL(10,3) NULL,
    dose_unit         VARCHAR(16)   NULL,
    frequency         VARCHAR(64)   NULL,
    route             VARCHAR(24)   NULL,

    started_on        DATE          NULL,
    ended_on          DATE          NULL,
    active            TINYINT(1)    NOT NULL DEFAULT 1,
    prescriber        VARCHAR(255)  NULL,
    reason            VARCHAR(512)  NULL,
    notes             TEXT          NULL,
    recorded_by_user_id BIGINT      NULL,
    created_at        DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at        DATETIME(6)   NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_medications_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_medications_user   FOREIGN KEY (recorded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_medications_member ON medications (family_member_id, active);

CREATE TABLE immunizations (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    family_member_id  BIGINT       NOT NULL,
    vaccine           VARCHAR(255) NOT NULL,
    dose_number       INT          NULL,
    administered_on   DATE         NULL,
    provider          VARCHAR(255) NULL,
    lot_number        VARCHAR(64)  NULL,
    next_due_on       DATE         NULL,
    notes             TEXT         NULL,
    recorded_by_user_id BIGINT     NULL,
    created_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at        DATETIME(6)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_immunizations_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_immunizations_user   FOREIGN KEY (recorded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_immunizations_member ON immunizations (family_member_id, administered_on);

-- Append-only audit of clinical changes.
--
-- "Who removed the penicillin allergy, and when" must be answerable. The record
-- tables carry the current state; this carries the history, and nothing updates
-- or deletes a row here.
CREATE TABLE record_revisions (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    family_member_id BIGINT       NOT NULL,
    record_type      VARCHAR(32)  NOT NULL,
    record_id        BIGINT       NOT NULL,
    action           VARCHAR(16)  NOT NULL,
    changed_by_user_id BIGINT     NULL,
    -- JSON snapshot of the row after the change; MariaDB 10.5 has no native
    -- JSON type, so LONGTEXT with the application owning the shape.
    snapshot         LONGTEXT     NULL,
    created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_revisions_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_revisions_user   FOREIGN KEY (changed_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_revisions_member ON record_revisions (family_member_id, created_at);
CREATE INDEX idx_revisions_record ON record_revisions (record_type, record_id);

-- Carry the old free-text profile across, attached to the SELF member.
--
-- The text is not parsed into structured rows: "penicillin, maybe aspirin"
-- cannot be split into allergy records safely, and a wrong allergy record is
-- worse than none. It lands as a note the owner can convert deliberately.
INSERT INTO medical_conditions (family_member_id, label, status, notes, created_at, updated_at)
SELECT
    fm.id,
    'Imported from previous profile',
    'UNCONFIRMED',
    CONCAT_WS('\n',
        NULLIF(CONCAT('Conditions: ',  mp.conditions),  'Conditions: '),
        NULLIF(CONCAT('Allergies: ',   mp.allergies),   'Allergies: '),
        NULLIF(CONCAT('Medications: ', mp.medications), 'Medications: '),
        NULLIF(CONCAT('Lifestyle: ',   mp.lifestyle),   'Lifestyle: ')
    ),
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
FROM medical_profiles mp
JOIN users u          ON u.medical_profile_id = mp.id
JOIN family_members fm ON fm.user_id = u.id AND fm.relationship = 'SELF'
WHERE COALESCE(NULLIF(TRIM(mp.conditions), ''), NULLIF(TRIM(mp.allergies), ''),
               NULLIF(TRIM(mp.medications), ''), NULLIF(TRIM(mp.lifestyle), '')) IS NOT NULL;
