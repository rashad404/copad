-- A person who declines at sign-up has never granted consent.
-- withdrawn_at records that refusal; granted_at must remain absent.
ALTER TABLE consent MODIFY granted_at DATETIME(6) NULL DEFAULT NULL;
