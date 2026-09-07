-- Doctors, clinics, and appointments people can actually book.
--
-- The existing appointments table is not a booking: it is an intake form -
-- symptoms, severity, what has been tried - with no doctor and no time. It
-- stays as that, and this is a separate thing.
--
-- Two rules shape the schema.
--
-- A listing must never imply a doctor agreed to be listed. A directory seeded
-- from public sources holds people who have not been asked, so verification
-- status is explicit and starts at UNCLAIMED. Nothing about an unclaimed entry
-- may read as endorsement.
--
-- A booking that double-books is worse than no booking, so the database refuses
-- it rather than the application remembering to check.

CREATE TABLE clinic (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,
    address         VARCHAR(512) NULL,
    district        VARCHAR(128) NULL,
    city            VARCHAR(128) NULL DEFAULT 'Baku',
    phone           VARCHAR(64)  NULL,
    -- For "nearest to me" later. Null until somebody fills it in.
    latitude        DECIMAL(10,7) NULL,
    longitude       DECIMAL(10,7) NULL,
    description     TEXT         NULL,
    active          TINYINT(1)   NOT NULL DEFAULT 1,
    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_clinic_slug (slug),
    KEY idx_clinic_city (city, district)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE doctor (
    id              BIGINT       NOT NULL AUTO_INCREMENT,

    -- Set when a doctor claims or creates their own listing. Null for an entry
    -- an administrator added, which nobody has claimed.
    user_id         BIGINT       NULL,

    full_name       VARCHAR(255) NOT NULL,
    slug            VARCHAR(255) NOT NULL,

    -- Matches medical_specialties.code, so the assistant can name a specialty
    -- and the directory can answer with the doctors in it.
    specialty_code  VARCHAR(64)  NULL,

    qualifications  VARCHAR(512) NULL,
    license_number  VARCHAR(128) NULL,
    years_experience INT         NULL,
    bio             TEXT         NULL,
    photo_url       VARCHAR(512) NULL,
    -- Comma-separated ISO codes, e.g. "az,ru,en". Which languages a doctor
    -- speaks decides who can actually be treated by them.
    languages       VARCHAR(64)  NULL,

    -- UNCLAIMED: listed from a public source, never asked, never verified.
    -- PENDING:   a person has claimed it and is awaiting review.
    -- VERIFIED:  credentials checked by us.
    -- REJECTED:  claim refused.
    -- An UNCLAIMED entry must not be presented as endorsed by anyone.
    verification    VARCHAR(16)  NOT NULL DEFAULT 'UNCLAIMED',
    verified_at     DATETIME(6)  NULL,

    -- Where the listing came from, so a seeded entry stays distinguishable
    -- from one a doctor wrote themselves.
    source          VARCHAR(255) NULL,

    consultation_fee DECIMAL(10,2) NULL,
    accepts_bookings TINYINT(1)  NOT NULL DEFAULT 0,
    active          TINYINT(1)   NOT NULL DEFAULT 1,

    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    deleted_at      DATETIME(6)  NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_doctor_slug (slug),
    UNIQUE KEY uq_doctor_user (user_id),
    KEY idx_doctor_specialty (specialty_code, active),
    KEY idx_doctor_verification (verification),
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- A doctor commonly works at more than one clinic, on different days.
CREATE TABLE doctor_clinic (
    doctor_id       BIGINT       NOT NULL,
    clinic_id       BIGINT       NOT NULL,
    PRIMARY KEY (doctor_id, clinic_id),
    CONSTRAINT fk_dc_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id) ON DELETE CASCADE,
    CONSTRAINT fk_dc_clinic FOREIGN KEY (clinic_id) REFERENCES clinic (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- The recurring weekly pattern. Exceptions live in doctor_time_off.
CREATE TABLE doctor_availability (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    doctor_id       BIGINT       NOT NULL,
    clinic_id       BIGINT       NULL,
    -- 1 = Monday, matching java.time.DayOfWeek.
    day_of_week     TINYINT      NOT NULL,
    start_time      TIME         NOT NULL,
    end_time        TIME         NOT NULL,
    slot_minutes    INT          NOT NULL DEFAULT 20,
    active          TINYINT(1)   NOT NULL DEFAULT 1,
    PRIMARY KEY (id),
    KEY idx_availability_doctor (doctor_id, day_of_week, active),
    CONSTRAINT fk_avail_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id) ON DELETE CASCADE,
    CONSTRAINT fk_avail_clinic FOREIGN KEY (clinic_id) REFERENCES clinic (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Holidays, conferences, a day off. Removes slots the weekly pattern implies.
CREATE TABLE doctor_time_off (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    doctor_id       BIGINT       NOT NULL,
    starts_at       DATETIME(6)  NOT NULL,
    ends_at         DATETIME(6)  NOT NULL,
    reason          VARCHAR(255) NULL,
    PRIMARY KEY (id),
    KEY idx_timeoff_doctor (doctor_id, starts_at, ends_at),
    CONSTRAINT fk_timeoff_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE booking (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    doctor_id       BIGINT       NOT NULL,
    clinic_id       BIGINT       NULL,

    -- Whose appointment it is, and who made it. A parent books for a child, so
    -- these are different people and both matter.
    family_member_id BIGINT      NOT NULL,
    booked_by_user_id BIGINT     NULL,

    starts_at       DATETIME(6)  NOT NULL,
    ends_at         DATETIME(6)  NOT NULL,

    -- REQUESTED, CONFIRMED, CANCELLED, COMPLETED, NO_SHOW.
    status          VARCHAR(16)  NOT NULL DEFAULT 'REQUESTED',

    reason          VARCHAR(512) NULL,
    -- What the person chose to share from their record, if anything. Sharing is
    -- a decision each time, not a setting.
    shared_record   TINYINT(1)   NOT NULL DEFAULT 0,

    cancelled_at    DATETIME(6)  NULL,
    cancellation_reason VARCHAR(255) NULL,
    reminder_sent_at DATETIME(6) NULL,

    created_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),

    -- The database refuses a double booking rather than the application
    -- remembering to check. Two people racing for the last slot is the normal
    -- case, not the rare one, and a booking that is not real is worse than no
    -- booking at all.
    --
    -- Cancelled rows are excluded by holding the slot only while it is live:
    -- the column is null unless the booking occupies the time.
    held_slot       DATETIME(6)  GENERATED ALWAYS AS (
        CASE WHEN status IN ('REQUESTED','CONFIRMED') THEN starts_at ELSE NULL END) STORED,
    UNIQUE KEY uq_booking_slot (doctor_id, held_slot),

    KEY idx_booking_member (family_member_id, starts_at),
    KEY idx_booking_doctor_time (doctor_id, starts_at),
    KEY idx_booking_reminders (status, starts_at, reminder_sent_at),

    CONSTRAINT fk_booking_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id),
    CONSTRAINT fk_booking_clinic FOREIGN KEY (clinic_id) REFERENCES clinic (id) ON DELETE SET NULL,
    CONSTRAINT fk_booking_member FOREIGN KEY (family_member_id) REFERENCES family_members (id),
    CONSTRAINT fk_booking_user FOREIGN KEY (booked_by_user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
