-- A phone number, so a message can arrive where people actually read it.
--
-- Email is what we have and it is not what gets read here. An appointment
-- confirmed at nine in the morning has to reach somebody before they set off,
-- and in Azerbaijan that means a text, not an inbox.
--
-- The number is optional and off by default. Nobody is asked for it in order
-- to use anything, and nobody is texted who did not enter one and turn it on.

ALTER TABLE users
    -- E.164 with room for spaces as typed. Ascii either way, but the column is
    -- declared explicitly because this table defaults to latin1 on the server
    -- and an implicit charset is how the last outage started.
    ADD COLUMN phone VARCHAR(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL,
    -- Separate from having a number: somebody can give one for a laboratory
    -- visit and still not want to be texted about appointments.
    ADD COLUMN sms_enabled TINYINT(1) NOT NULL DEFAULT 0;
