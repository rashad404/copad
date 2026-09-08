-- Readings that arrive from a phone or a watch.
--
-- Vitals could already be entered by hand or read off a document. This is the
-- third way they arrive: Apple Health, Health Connect, or a file somebody
-- exports from a device that speaks neither.

-- What a family member has connected.
--
-- Per member rather than per account, because a parent syncing their own watch
-- must not have those readings land in a child's record.
CREATE TABLE health_connection (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    family_member_id BIGINT NOT NULL,
    -- APPLE_HEALTH, HEALTH_CONNECT, FILE
    provider VARCHAR(32) NOT NULL,
    -- What the person would recognise it as: "Rashad's iPhone".
    device_label VARCHAR(120) NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    -- The furthest point already taken, so the phone knows where to resume
    -- instead of resending its whole history every time.
    synced_through DATETIME(6) NULL,
    last_sync_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_health_connection_member FOREIGN KEY (family_member_id)
        REFERENCES family_members (id) ON DELETE CASCADE,
    -- One connection per provider per person. Reconnecting a phone should
    -- resume, not start a second stream of the same readings.
    UNIQUE KEY uq_health_connection (family_member_id, provider)
);

-- Which device a reading came off, where that is known.
ALTER TABLE vital_readings
    ADD COLUMN device_label VARCHAR(120) NULL AFTER source_ref;

-- Makes syncing idempotent.
--
-- source_ref has been on the table since V9 and nothing enforced it, so sending
-- the same sample twice - which is exactly what a phone does when it resumes,
-- retries, or is reinstalled - would have written it twice. Apple Health and
-- Health Connect both give every sample a stable id; this is what makes that
-- id mean something.
--
-- Manual readings have no source_ref, and MySQL allows any number of NULLs in a
-- unique index, so entering the same measurement twice by hand stays possible.
-- Somebody taking two readings a minute apart is not an error.
CREATE UNIQUE INDEX uq_vitals_source_ref
    ON vital_readings (family_member_id, source, source_ref);
