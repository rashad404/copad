-- Where a lab value came from.
--
-- Extraction reads a report and a person confirms it. A photographed report has
-- no text layer, so nothing can be read from it at all, and until now such a
-- result could not be entered by hand - which is most reports here.
--
-- Manual entry closes that gap, but the two are not equally certain and the
-- record must not blur them. Existing rows all came from extraction.

ALTER TABLE lab_result
    ADD COLUMN source VARCHAR(16) NOT NULL DEFAULT 'EXTRACTED' AFTER confirmed;

CREATE INDEX idx_lab_result_source ON lab_result (family_member_id, source);
