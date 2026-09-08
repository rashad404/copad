-- Who opened somebody's record, and when.
--
-- The booking form has asked "share my health record with this doctor" since
-- the day it shipped, the answer has been stored, and the doctor's panel has
-- shown a "record shared" badge. Nothing could actually read it. Both people
-- were told something untrue: the patient believed they had shared, the doctor
-- was shown a badge implying access they did not have.
--
-- Sharing without a record of who looked is not much better. This is the other
-- half of the promise: consent that means something, and an account of what it
-- was used for that the person who gave it can see.

CREATE TABLE record_access (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    family_member_id BIGINT NOT NULL,
    accessed_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT fk_record_access_booking FOREIGN KEY (booking_id)
        REFERENCES booking (id) ON DELETE CASCADE,
    CONSTRAINT fk_record_access_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctor (id) ON DELETE CASCADE,
    CONSTRAINT fk_record_access_member FOREIGN KEY (family_member_id)
        REFERENCES family_members (id) ON DELETE CASCADE,
    KEY idx_record_access_member (family_member_id, accessed_at),
    KEY idx_record_access_booking (booking_id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
