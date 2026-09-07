-- What remains after someone asks for their data to be deleted.
--
-- Clinical records are soft-deleted everywhere else, deliberately: "who removed
-- the penicillin allergy, and when" has to stay answerable. But a person asking
-- to be deleted must actually be deleted, or the promise is a lie.
--
-- So deletion is real - rows and files both - and this table keeps only the
-- fact that it happened. No name, no email, no clinical content: a pseudonymous
-- id, a time, and how many of each kind of record went. Enough to answer "was
-- this deleted and when", never enough to reconstruct what was deleted.

CREATE TABLE deletion_record (
    id              BIGINT       NOT NULL AUTO_INCREMENT,

    -- MEMBER or ACCOUNT.
    subject_type    VARCHAR(16)  NOT NULL,
    -- The former family_members.id or users.id. Kept as a plain number with no
    -- foreign key, because the row it referred to no longer exists.
    subject_ref     BIGINT       NOT NULL,

    -- Who asked. Also a plain number: deleting an account deletes the user who
    -- requested it.
    requested_by    BIGINT       NULL,

    -- Counts only, as JSON. "3 allergies, 2 documents" - never which.
    removed_counts  TEXT         NULL,

    deleted_at      DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (id),
    KEY idx_deletion_subject (subject_type, subject_ref)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
