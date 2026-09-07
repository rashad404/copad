-- Chat attachments move out of the web root.
--
-- file_path points inside public_html, which Apache serves directly: every
-- photo and report a person attached to a chat was readable by anyone with the
-- URL. storage_key points into the private root instead.
--
-- Both columns exist together on purpose. The rows are filled in by moving the
-- files, which happens after this migration, and a row with no key still
-- resolves against the old location until its file has been moved.

ALTER TABLE file_attachment
    ADD COLUMN storage_key VARCHAR(255) NULL AFTER file_path;

CREATE INDEX idx_file_attachment_storage_key ON file_attachment (storage_key);
