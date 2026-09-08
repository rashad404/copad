-- A reading is not identified by its source record alone.
--
-- V29 made syncing idempotent by keying on the id the device gives a sample,
-- (family_member_id, source, source_ref). That is right for a watch reporting a
-- pulse and wrong for Android: Health Connect puts both values of a blood
-- pressure in one record with one id, and a heart rate record holds a whole
-- series of timestamped samples under one id.
--
-- So one source record legitimately produces several readings, and the old key
-- called them duplicates and dropped all but the first - a systolic stored and
-- its diastolic silently discarded, which is worse than storing neither.
--
-- The identity of a reading is the record it came from, what was measured, and
-- when. Re-syncing the same sample still collides on all five columns and is
-- still refused, so nothing about idempotency is given up; what changes is that
-- two different readings out of one record are no longer mistaken for one.
--
-- Manual readings have no source_ref and MySQL allows any number of NULLs in a
-- unique index, so entering the same measurement twice by hand stays possible.

ALTER TABLE vital_readings DROP INDEX uq_vitals_source_ref;

CREATE UNIQUE INDEX uq_vitals_sample
    ON vital_readings (family_member_id, source, source_ref, vital_type, measured_at);
