-- Family and member model.
--
-- Every clinical record from here on belongs to a person, not to a login. A
-- parent manages their children's health, an adult child manages a parent's,
-- and one account therefore covers several people. Hanging vitals, documents,
-- lab results and bookings off user_id would make that impossible to express
-- and would force a migration of every table later, so family_members is
-- introduced before any of them exist.
--
-- Three tables, with distinct jobs:
--   families            the household
--   family_members      a PERSON whose health is tracked; may have no login
--   family_memberships  a USER's access to a family, and at what level

CREATE TABLE families (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    name           VARCHAR(255) NOT NULL,
    owner_user_id  BIGINT       NOT NULL,
    created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at     DATETIME(6)  NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_families_owner FOREIGN KEY (owner_user_id) REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_families_owner ON families (owner_user_id);

CREATE TABLE family_members (
    id                    BIGINT       NOT NULL AUTO_INCREMENT,
    family_id             BIGINT       NOT NULL,

    -- Null for dependents: a child or elderly parent is tracked without ever
    -- having an account of their own.
    user_id               BIGINT       NULL,

    full_name             VARCHAR(255) NOT NULL,
    relationship          VARCHAR(32)  NOT NULL,
    date_of_birth         DATE         NULL,
    biological_sex        VARCHAR(16)  NULL,
    blood_type            VARCHAR(8)   NULL,
    avatar_url            VARCHAR(512) NULL,

    -- Pediatric context. Growth percentiles are meaningless without gestational
    -- age, and a preterm infant is assessed against corrected age, so these are
    -- recorded rather than derived later from date_of_birth alone.
    birth_weight_grams    INT          NULL,
    birth_length_cm       DECIMAL(5,2) NULL,
    gestational_age_weeks DECIMAL(4,1) NULL,

    created_at            DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at            DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at            DATETIME(6)  NULL,

    PRIMARY KEY (id),
    CONSTRAINT fk_family_members_family FOREIGN KEY (family_id) REFERENCES families (id),
    CONSTRAINT fk_family_members_user   FOREIGN KEY (user_id)   REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_family_members_family ON family_members (family_id);
CREATE INDEX idx_family_members_user   ON family_members (user_id);

CREATE TABLE family_memberships (
    id         BIGINT      NOT NULL AUTO_INCREMENT,
    family_id  BIGINT      NOT NULL,
    user_id    BIGINT      NOT NULL,
    role       VARCHAR(16) NOT NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    -- One role per user per family; a second grant must update, not duplicate.
    CONSTRAINT uq_family_memberships UNIQUE (family_id, user_id),
    CONSTRAINT fk_family_memberships_family FOREIGN KEY (family_id) REFERENCES families (id),
    CONSTRAINT fk_family_memberships_user   FOREIGN KEY (user_id)   REFERENCES users (id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_family_memberships_user ON family_memberships (user_id);

-- Backfill: every existing account becomes a one-person household, so no code
-- has to handle a user without a family.
INSERT INTO families (name, owner_user_id, created_at, updated_at)
SELECT
    CONCAT(COALESCE(NULLIF(TRIM(u.name), ''), 'My'), ' family'),
    u.id,
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM families f WHERE f.owner_user_id = u.id);

INSERT INTO family_members (family_id, user_id, full_name, relationship, biological_sex, created_at, updated_at)
SELECT
    f.id,
    u.id,
    COALESCE(NULLIF(TRIM(u.name), ''), u.email, CONCAT('Member ', u.id)),
    'SELF',
    -- users.gender is free text; only recognised values map across, the rest
    -- stay null rather than being guessed at.
    CASE UPPER(TRIM(COALESCE(u.gender, '')))
        WHEN 'MALE'   THEN 'MALE'
        WHEN 'M'      THEN 'MALE'
        WHEN 'FEMALE' THEN 'FEMALE'
        WHEN 'F'      THEN 'FEMALE'
        ELSE NULL
    END,
    CURRENT_TIMESTAMP(6),
    CURRENT_TIMESTAMP(6)
FROM users u
JOIN families f ON f.owner_user_id = u.id
WHERE NOT EXISTS (
    SELECT 1 FROM family_members m WHERE m.family_id = f.id AND m.relationship = 'SELF'
);

INSERT INTO family_memberships (family_id, user_id, role, created_at, updated_at)
SELECT f.id, f.owner_user_id, 'OWNER', CURRENT_TIMESTAMP(6), CURRENT_TIMESTAMP(6)
FROM families f
WHERE NOT EXISTS (
    SELECT 1 FROM family_memberships fm
    WHERE fm.family_id = f.id AND fm.user_id = f.owner_user_id
);
