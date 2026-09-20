-- What patients say about a doctor.
--
-- Three kinds of reviewer, and the difference between them is the whole point.
--
--   GUEST      somebody who typed a name and a comment. Worth least, and the
--              easiest to fake, so it is held for a person to read first.
--   REGISTERED an account. Still not proof of a visit, but a real address
--              behind it, and one review per account per doctor.
--   VERIFIED   somebody who actually attended an appointment booked here. The
--              only kind that cannot be invented, and the reason this is worth
--              building rather than copying from the sites full of fake stars.
--
-- The doctor is never asked to approve what is written about them, and a
-- review is never edited: it is published, or refused with a reason.
--
-- Schema only.

CREATE TABLE doctor_review (
    id               BIGINT NOT NULL AUTO_INCREMENT,
    doctor_id        BIGINT NOT NULL,

    -- 1 to 5. Checked in the application as well; MariaDB honours CHECK, but
    -- the rule belongs where the message to the person is written.
    rating           TINYINT NOT NULL,
    comment          TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,

    -- Shown with the review. A guest types it; an account's own name is used.
    author_name      VARCHAR(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,

    -- Null for a guest.
    user_id          BIGINT NULL,
    -- The attendance this review is evidence of, for a verified one.
    booking_id       BIGINT NULL,

    -- GUEST, REGISTERED, VERIFIED. Decided by the server, never sent by the
    -- browser: it is the only thing on the page a reader is asked to trust.
    trust            VARCHAR(16) NOT NULL DEFAULT 'GUEST',
    -- PENDING, PUBLISHED, REJECTED.
    status           VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    -- Why it was refused. For the moderator's own record, not shown publicly.
    moderation_note  VARCHAR(255) NULL,

    -- Not the address itself: enough to spot ten reviews from one machine,
    -- not enough to say who wrote which review about which doctor.
    reporter_hash    CHAR(64) NULL,

    created_at       DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    published_at     DATETIME(6) NULL,

    PRIMARY KEY (id),
    -- One review per account per doctor. Guests are bounded by rate limit
    -- instead, since there is nothing stable to key on.
    UNIQUE KEY uq_review_user_doctor (doctor_id, user_id),
    -- An attended appointment is evidence for exactly one review.
    UNIQUE KEY uq_review_booking (booking_id),
    KEY idx_review_doctor_status (doctor_id, status, created_at),
    KEY idx_review_moderation (status, created_at),
    CONSTRAINT fk_review_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctor (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_review_booking FOREIGN KEY (booking_id)
        REFERENCES booking (id) ON DELETE SET NULL,
    CONSTRAINT ck_review_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Kept on the doctor so the directory can show a rating without counting
-- rows for every one of eight hundred cards. Recomputed from the reviews
-- whenever one is published or withdrawn, never incremented blindly.
ALTER TABLE doctor
    ADD COLUMN review_count INT NOT NULL DEFAULT 0,
    ADD COLUMN rating_total INT NOT NULL DEFAULT 0;
