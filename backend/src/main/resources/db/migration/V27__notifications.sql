-- Telling people what happened.
--
-- An appointment could be requested, confirmed or declined and nobody was
-- told: it existed only for somebody who happened to open the page again. A
-- booking system that cannot reach the person who booked is not finished.

-- The language somebody reads in, so a message arrives in it. Set from the
-- interface they were using; null means we have not seen them choose, and
-- Azerbaijani is the right assumption here.
ALTER TABLE users
    ADD COLUMN preferred_language VARCHAR(8) NULL AFTER email,
    ADD COLUMN notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER preferred_language;

-- An outbox rather than sending inline.
--
-- Sending happens after the transaction commits, so a mail server that is slow
-- or down cannot roll back somebody's appointment, and a message that failed
-- can be tried again instead of being lost. It also makes "was this person
-- told?" a question with an answer.
--
-- It holds no clinical content: what the appointment was for is the patient's
-- own account of their symptoms and has no business being duplicated here, or
-- put in an email. Only the kind of message and what it refers to.
CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    channel VARCHAR(16) NOT NULL,
    kind VARCHAR(48) NOT NULL,
    booking_id BIGINT NULL,
    language VARCHAR(8) NOT NULL DEFAULT 'az',
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING',
    attempts INT NOT NULL DEFAULT 0,
    -- The exception class only. A provider error can quote the recipient back
    -- at us, and that does not belong in a table we read casually.
    last_error VARCHAR(64) NULL,
    scheduled_for DATETIME(6) NOT NULL,
    sent_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_notification_booking FOREIGN KEY (booking_id) REFERENCES booking (id) ON DELETE CASCADE,
    KEY idx_notification_due (status, scheduled_for),
    -- One message of a kind per booking per person. A retry must not become a
    -- second email, and a reminder job that runs twice must not send twice.
    UNIQUE KEY uq_notification_once (user_id, kind, booking_id)
);
