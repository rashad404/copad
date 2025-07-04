-- Modify the chats table to properly support UTF-8 characters
ALTER TABLE chats 
    MODIFY COLUMN title VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Make sure chat_messages.message field also supports UTF-8 properly
ALTER TABLE chat_messages 
    MODIFY COLUMN message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;