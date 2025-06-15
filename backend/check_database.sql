-- Check if chats table already exists
SHOW TABLES LIKE 'chats';

-- Check flyway schema history
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;

-- If needed, you can manually remove the failed migration:
-- DELETE FROM flyway_schema_history WHERE version = '3';