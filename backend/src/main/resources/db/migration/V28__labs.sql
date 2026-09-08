-- Ordering a test, rather than only reading one afterwards.
--
-- Lab results have been in the record since V9, but only ever as something a
-- person uploaded after the fact. This is the other half: which laboratories
-- exist, what they offer, and an order somebody actually places - including at
-- home, which is how a great deal of testing is done here.
--
-- Deliberately not modelled: a payment. Nothing in this product can take money
-- yet, and an order that pretends to be paid would be a worse lie than one that
-- plainly is not.

CREATE TABLE lab (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    city VARCHAR(120) NULL,
    district VARCHAR(120) NULL,
    address VARCHAR(255) NULL,
    phone VARCHAR(64) NULL,
    description TEXT NULL,
    -- Whether they will come to the person rather than the other way round.
    home_collection BOOLEAN NOT NULL DEFAULT FALSE,
    home_collection_fee DECIMAL(10,2) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    deleted_at DATETIME(6) NULL,
    UNIQUE KEY uq_lab_slug (slug),
    KEY idx_lab_city (city)
);

-- What a laboratory offers.
--
-- Priced per lab rather than centrally, because the same test costs different
-- amounts in different places and comparing them is the point.
CREATE TABLE lab_test (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_id BIGINT NOT NULL,
    code VARCHAR(64) NOT NULL,
    name_az VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NULL,
    name_ru VARCHAR(255) NULL,
    -- Ties an ordered test to the analyte it produces, so a result can be
    -- recognised when it arrives instead of being re-keyed by hand.
    analyte_key VARCHAR(120) NULL,
    loinc_code VARCHAR(32) NULL,
    sample_type VARCHAR(64) NULL,
    price DECIMAL(10,2) NULL,
    turnaround_hours INT NULL,
    -- Fasting and the like. Shown before ordering, not after.
    preparation_az TEXT NULL,
    preparation_en TEXT NULL,
    preparation_ru TEXT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_lab_test_lab FOREIGN KEY (lab_id) REFERENCES lab (id) ON DELETE CASCADE,
    UNIQUE KEY uq_lab_test (lab_id, code),
    KEY idx_lab_test_analyte (analyte_key)
);

-- An order belongs to a family member, like every other clinical record here.
CREATE TABLE lab_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_id BIGINT NOT NULL,
    family_member_id BIGINT NOT NULL,
    ordered_by_user_id BIGINT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'REQUESTED',
    -- HOME or LAB. Where the sample is taken.
    collection VARCHAR(16) NOT NULL DEFAULT 'LAB',
    -- Only for home collection, and only what is needed to arrive.
    address VARCHAR(255) NULL,
    contact_phone VARCHAR(64) NULL,
    preferred_at DATETIME(6) NULL,
    -- Copied at the time of ordering: a price that changes later must not
    -- silently change what somebody agreed to.
    total_price DECIMAL(10,2) NULL,
    note VARCHAR(512) NULL,
    cancelled_at DATETIME(6) NULL,
    cancellation_reason VARCHAR(255) NULL,
    completed_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_lab_order_lab FOREIGN KEY (lab_id) REFERENCES lab (id),
    CONSTRAINT fk_lab_order_member FOREIGN KEY (family_member_id)
        REFERENCES family_members (id) ON DELETE CASCADE,
    KEY idx_lab_order_member (family_member_id, created_at),
    KEY idx_lab_order_status (status)
);

CREATE TABLE lab_order_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_order_id BIGINT NOT NULL,
    lab_test_id BIGINT NOT NULL,
    -- The name and price as they stood when ordered, so the order still reads
    -- correctly after a laboratory renames or reprices a test.
    name_at_order VARCHAR(255) NOT NULL,
    price_at_order DECIMAL(10,2) NULL,
    -- Set when a result for this test lands in the record.
    lab_result_id BIGINT NULL,
    CONSTRAINT fk_lab_order_item_order FOREIGN KEY (lab_order_id)
        REFERENCES lab_order (id) ON DELETE CASCADE,
    CONSTRAINT fk_lab_order_item_test FOREIGN KEY (lab_test_id) REFERENCES lab_test (id),
    CONSTRAINT fk_lab_order_item_result FOREIGN KEY (lab_result_id)
        REFERENCES lab_result (id) ON DELETE SET NULL,
    UNIQUE KEY uq_lab_order_item (lab_order_id, lab_test_id)
);
