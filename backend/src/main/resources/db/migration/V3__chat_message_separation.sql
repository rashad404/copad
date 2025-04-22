-- Create the chats table
CREATE TABLE chats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    chat_id VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    guest_session_id BIGINT,
    FOREIGN KEY (guest_session_id) REFERENCES guest_sessions(id) ON DELETE CASCADE
);

-- Add index on chat_id for faster lookups
CREATE INDEX idx_chat_id ON chats(chat_id);

-- Add chat_id column to message table
ALTER TABLE message ADD COLUMN chat_id BIGINT;

-- Convert existing chat_id string to foreign key
-- This requires a data migration step that depends on your current data:
-- 1. For each unique chatId in message table, create a chat record
-- 2. Then update the chat_id column in message to point to the newly created chat

-- Temporary procedure to migrate data
DELIMITER //
CREATE PROCEDURE migrate_messages_to_chats()
BEGIN
    -- Variables
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_old_chat_id VARCHAR(255);
    DECLARE v_guest_session_id BIGINT;
    DECLARE v_new_chat_id BIGINT;
    DECLARE v_title VARCHAR(255);
    
    -- Get distinct chatId values from message table
    DECLARE chat_cursor CURSOR FOR 
        SELECT DISTINCT c.chat_id, c.guest_session_id, 
               (SELECT message FROM message 
                WHERE chat_id = c.chat_id AND guest_session_id = c.guest_session_id 
                ORDER BY timestamp ASC LIMIT 1) as title
        FROM message c
        WHERE c.chat_id IS NOT NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN chat_cursor;
    
    read_loop: LOOP
        FETCH chat_cursor INTO v_old_chat_id, v_guest_session_id, v_title;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Create new chat record
        INSERT INTO chats (chat_id, title, created_at, updated_at, guest_session_id)
        VALUES (v_old_chat_id, 
                IFNULL(v_title, 'Untitled Chat'),
                (SELECT MIN(timestamp) FROM message WHERE chat_id = v_old_chat_id),
                (SELECT MAX(timestamp) FROM message WHERE chat_id = v_old_chat_id),
                v_guest_session_id);
        
        -- Get the new chat ID
        SET v_new_chat_id = LAST_INSERT_ID();
        
        -- Update message records to point to the new chat
        UPDATE message 
        SET chat_id = v_new_chat_id 
        WHERE chat_id = v_old_chat_id AND guest_session_id = v_guest_session_id;
    END LOOP;
    
    CLOSE chat_cursor;
END //
DELIMITER ;

-- Run the migration procedure
CALL migrate_messages_to_chats();

-- Drop the temporary procedure
DROP PROCEDURE migrate_messages_to_chats;

-- Change chat_id column type to BIGINT and add foreign key constraint
ALTER TABLE message 
    MODIFY COLUMN chat_id BIGINT,
    ADD CONSTRAINT fk_message_chat 
    FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_message_chat ON message(chat_id);
CREATE INDEX idx_chat_guest_session ON chats(guest_session_id);