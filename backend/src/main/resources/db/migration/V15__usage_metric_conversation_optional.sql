-- Usage rows from the plain chat endpoint have no Responses API conversation.
--
-- conversation_id was NOT NULL because every row used to come from the
-- Responses API, which always has one. The main chat path does not, and the
-- constraint was silently rejecting its usage rows - which is part of why that
-- path recorded no cost at all.
--
-- It stays populated where there is something to populate it with: the guest
-- chat passes its chat id, so cost can still be attributed to a conversation.

ALTER TABLE usage_metrics MODIFY COLUMN conversation_id VARCHAR(255) NULL;
