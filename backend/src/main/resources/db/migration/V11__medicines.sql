-- Azerbaijani drug catalogue, copied from bugun.az.
--
-- Copied rather than fetched over an API: it is our data on both sides, it
-- changes monthly, and a network hop between two of our own products would add
-- a failure mode to a lookup that has to work while someone is mid-conversation
-- about their medication. A scheduled sync keeps it current; bugun.az's scraper
-- stays the source of truth.
--
-- What the source actually contains, measured before this was written:
--   10,738 medicines, all with an active ingredient
--   16,106 price rows
--    6,615 with an ATC code (62%)
--       85 with interaction or contraindication text (0.8%)
--
-- That last number is why there is no interaction-checking feature here. A
-- safety check that silently never fires is worse than none, so interactions
-- are handled as advisory model output instead, and this table carries only
-- what is actually populated.

CREATE TABLE medicine (
    id                  BIGINT       NOT NULL AUTO_INCREMENT,
    source_id           BIGINT       NULL,
    name                VARCHAR(512) NOT NULL,
    slug                VARCHAR(512) NOT NULL,

    -- Free text as published, e.g. "Ibuprofen - 200 mg/5 ml", and often several
    -- ingredients in one string. Parsed into medicine_ingredient below, because
    -- matching an allergy against this raw text would miss most of the time.
    active_ingredient   TEXT         NULL,

    atc_code            VARCHAR(64)  NULL,
    manufacturer        TEXT         NULL,
    release_form        TEXT         NULL,
    prescription_status TEXT         NULL,
    medicine_type       VARCHAR(255) NULL,
    registration_number VARCHAR(255) NULL,
    registration_date   DATE         NULL,
    expiry_date         DATE         NULL,

    description_az      TEXT         NULL,
    usage_az            TEXT         NULL,
    side_effects_az     TEXT         NULL,
    contraindications_az TEXT        NULL,
    interactions_az     TEXT         NULL,
    storage_az          TEXT         NULL,

    synced_at           DATETIME(6)  NULL,
    created_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at          DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    UNIQUE KEY uq_medicine_slug (slug)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_medicine_name ON medicine (name(191));
CREATE INDEX idx_medicine_atc  ON medicine (atc_code);
CREATE INDEX idx_medicine_source ON medicine (source_id);
-- Search is by name and ingredient, in a language with its own diacritics, so
-- a LIKE scan over 10k rows is not enough.
CREATE FULLTEXT INDEX ft_medicine_search ON medicine (name, active_ingredient);

-- One row per ingredient per product, normalised out of the free-text field.
--
-- This is what makes the allergy check work: "Penisilin" has to match a product
-- whose ingredient string reads "Amoxicillin trihydrate - 500 mg (eq. to
-- Amoxicillin 500 mg)", which no amount of LIKE on the raw column will do
-- reliably.
CREATE TABLE medicine_ingredient (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    medicine_id  BIGINT       NOT NULL,
    -- Lowercased, punctuation and dosage stripped, for matching.
    normalised   VARCHAR(255) NOT NULL,
    -- As it appeared, for display.
    raw          VARCHAR(512) NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_medicine_ingredient FOREIGN KEY (medicine_id) REFERENCES medicine (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_ingredient_normalised ON medicine_ingredient (normalised);
CREATE INDEX idx_ingredient_medicine ON medicine_ingredient (medicine_id);

CREATE TABLE medicine_price (
    id                BIGINT        NOT NULL AUTO_INCREMENT,
    medicine_id       BIGINT        NULL,
    source_id         BIGINT        NULL,
    trade_name        VARCHAR(512)  NOT NULL,
    active_ingredient VARCHAR(512)  NULL,
    dosage            VARCHAR(255)  NULL,
    form              VARCHAR(255)  NULL,
    packaging         VARCHAR(255)  NULL,
    pack_quantity     VARCHAR(64)   NULL,
    manufacturer      VARCHAR(512)  NULL,
    wholesale_price   DECIMAL(10,2) NULL,
    retail_price      DECIMAL(10,2) NULL,
    effective_date    VARCHAR(64)   NULL,
    synced_at         DATETIME(6)   NULL,
    created_at        DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_medicine_price FOREIGN KEY (medicine_id) REFERENCES medicine (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_price_medicine ON medicine_price (medicine_id);
CREATE INDEX idx_price_trade_name ON medicine_price (trade_name(191));
CREATE INDEX idx_price_retail ON medicine_price (retail_price);

-- medications.medicine_id was added in V9 with no target table; now it has one.
ALTER TABLE medications
    ADD CONSTRAINT fk_medications_medicine FOREIGN KEY (medicine_id) REFERENCES medicine (id);
