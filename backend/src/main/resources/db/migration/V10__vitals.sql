-- Vital sign readings.
--
-- One row per measurement, never a "current weight" column. A vital only means
-- something as a series: a blood pressure of 150/95 is a different situation
-- depending on whether it is the first such reading or the fifth this month.
--
-- Units are stored explicitly alongside a canonical value. Recording 70 without
-- saying kg or lb, or a glucose of 5.5 without saying mmol/L or mg/dL, is how
-- unit confusion turns into a dosing error - mmol/L and mg/dL differ by a
-- factor of 18 for the same physiological state.

CREATE TABLE vital_readings (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    family_member_id  BIGINT        NOT NULL,

    vital_type        VARCHAR(32)   NOT NULL,

    -- The value as the canonical unit for this type, which is what all
    -- comparison, charting and reference-range checking uses.
    value_canonical   DECIMAL(12,4) NOT NULL,
    unit_canonical    VARCHAR(16)   NOT NULL,

    -- What the person actually entered, preserved so the UI can show their own
    -- units back to them and so a conversion bug stays diagnosable.
    value_entered     DECIMAL(12,4) NULL,
    unit_entered      VARCHAR(16)   NULL,

    measured_at       DATETIME(6)   NOT NULL,

    -- Where it came from. A cuff reading and a hand-typed number carry
    -- different confidence, and device data must never silently overwrite
    -- something a person entered.
    source            VARCHAR(24)   NOT NULL DEFAULT 'MANUAL',
    source_ref        VARCHAR(255)  NULL,

    -- Evaluated at write time against age- and sex-specific ranges, so a list
    -- can be filtered for abnormal results without recomputing every row.
    abnormal_flag     VARCHAR(16)   NULL,

    notes             VARCHAR(512)  NULL,
    recorded_by_user_id BIGINT      NULL,
    created_at        DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at        DATETIME(6)   NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_vitals_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_vitals_user   FOREIGN KEY (recorded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Charts and trends always read one type for one member over time.
CREATE INDEX idx_vitals_member_type_time ON vital_readings (family_member_id, vital_type, measured_at);
CREATE INDEX idx_vitals_abnormal ON vital_readings (family_member_id, abnormal_flag);

-- Seed the series from the height and weight already on medical_profiles, so
-- an existing user opens the record to their own data rather than an empty
-- chart. Zero means "never filled in" in the old schema and is skipped.
INSERT INTO vital_readings (family_member_id, vital_type, value_canonical, unit_canonical,
                            value_entered, unit_entered, measured_at, source, notes, created_at, updated_at)
SELECT fm.id, 'WEIGHT', mp.weight, 'kg', mp.weight, 'kg',
       COALESCE(fm.created_at, CURRENT_TIMESTAMP(6)), 'IMPORTED',
       'Imported from previous profile', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
FROM medical_profiles mp
JOIN users u           ON u.medical_profile_id = mp.id
JOIN family_members fm ON fm.user_id = u.id AND fm.relationship = 'SELF'
WHERE mp.weight IS NOT NULL AND mp.weight > 0;

INSERT INTO vital_readings (family_member_id, vital_type, value_canonical, unit_canonical,
                            value_entered, unit_entered, measured_at, source, notes, created_at, updated_at)
SELECT fm.id, 'HEIGHT', mp.height, 'cm', mp.height, 'cm',
       COALESCE(fm.created_at, CURRENT_TIMESTAMP(6)), 'IMPORTED',
       'Imported from previous profile', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
FROM medical_profiles mp
JOIN users u           ON u.medical_profile_id = mp.id
JOIN family_members fm ON fm.user_id = u.id AND fm.relationship = 'SELF'
WHERE mp.height IS NOT NULL AND mp.height > 0;
