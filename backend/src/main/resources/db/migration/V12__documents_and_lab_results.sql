-- Documents and the values extracted from them.
--
-- Uploads currently land in public_html, which Apache serves directly, so a
-- patient's lab report is readable by anyone holding the URL and by anyone who
-- guesses one. Files move under a private root and are served only through an
-- endpoint that checks family access.
--
-- A document is not just a file. A lab report contains values that belong in
-- the record and on a chart next to the last one, so extraction produces
-- lab_result rows and the file becomes the evidence behind them.

CREATE TABLE document (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    family_member_id BIGINT       NOT NULL,
    uploaded_by_user_id BIGINT    NULL,

    title            VARCHAR(512) NULL,
    document_type    VARCHAR(32)  NOT NULL DEFAULT 'OTHER',
    -- When the document was issued, which is what the timeline orders by.
    -- Distinct from created_at: a 2019 report uploaded today belongs in 2019.
    document_date    DATE         NULL,
    provider         VARCHAR(255) NULL,

    -- Path relative to the private storage root. Never a URL: a stored URL is
    -- what made the old files publicly reachable.
    storage_key      VARCHAR(512) NOT NULL,
    original_filename VARCHAR(512) NULL,
    content_type     VARCHAR(128) NULL,
    size_bytes       BIGINT       NULL,
    checksum_sha256  CHAR(64)     NULL,
    page_count       INT          NULL,

    -- Extraction runs after upload, so the row exists before its text does.
    extraction_status VARCHAR(24) NOT NULL DEFAULT 'PENDING',
    extraction_error VARCHAR(512) NULL,
    extracted_text   LONGTEXT     NULL,

    notes            VARCHAR(1024) NULL,
    created_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at       DATETIME(6)  NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_document_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_document_user   FOREIGN KEY (uploaded_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_document_member ON document (family_member_id, document_date);
CREATE INDEX idx_document_status ON document (extraction_status);
-- Search over a person's own documents.
CREATE FULLTEXT INDEX ft_document_text ON document (title, extracted_text);

CREATE TABLE document_tag (
    document_id BIGINT      NOT NULL,
    tag         VARCHAR(64) NOT NULL,
    PRIMARY KEY (document_id, tag),
    CONSTRAINT fk_document_tag FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- One measured analyte from one report.
--
-- Kept separate from vital_readings: a vital is something a person measures
-- about themselves, a lab result comes from a laboratory with its own reference
-- range and units, and the two should not be averaged onto the same chart.
CREATE TABLE lab_result (
    id               BIGINT        NOT NULL AUTO_INCREMENT,
    family_member_id BIGINT        NOT NULL,
    document_id      BIGINT        NULL,

    analyte          VARCHAR(255)  NOT NULL,
    -- Lowercased and stripped, so "Hemoglobin", "HGB" and "Hemoglobin (HGB)"
    -- land on one chart instead of three.
    analyte_key      VARCHAR(128)  NOT NULL,
    loinc_code       VARCHAR(32)   NULL,

    value_numeric    DECIMAL(14,4) NULL,
    -- Some results are not numbers: "negative", "trace", "not detected".
    value_text       VARCHAR(255)  NULL,
    unit             VARCHAR(64)   NULL,

    -- The laboratory's own range, which varies by lab and method, so it is
    -- stored per result rather than assumed.
    reference_low    DECIMAL(14,4) NULL,
    reference_high   DECIMAL(14,4) NULL,
    reference_text   VARCHAR(128)  NULL,
    abnormal_flag    VARCHAR(16)   NULL,

    collected_at     DATETIME(6)   NULL,

    -- Extracted values are proposals until a person confirms them. Writing
    -- parsed numbers straight into a medical record would make an OCR error
    -- indistinguishable from a real result.
    confirmed        TINYINT(1)    NOT NULL DEFAULT 0,
    confirmed_by_user_id BIGINT    NULL,
    confirmed_at     DATETIME(6)   NULL,

    created_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at       DATETIME(6)   NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_lab_member   FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_lab_document FOREIGN KEY (document_id) REFERENCES document (id) ON DELETE SET NULL,
    CONSTRAINT fk_lab_confirmer FOREIGN KEY (confirmed_by_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Charting one analyte over time is the whole point, so it is the index.
CREATE INDEX idx_lab_member_analyte ON lab_result (family_member_id, analyte_key, collected_at);
CREATE INDEX idx_lab_document ON lab_result (document_id);
CREATE INDEX idx_lab_unconfirmed ON lab_result (family_member_id, confirmed);
