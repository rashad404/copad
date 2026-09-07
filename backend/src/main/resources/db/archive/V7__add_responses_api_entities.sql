-- Migration script for OpenAI Responses API integration
-- Adds tables for conversation state management, response tracking, and usage metrics

-- Note: chat_id in chats table may not be unique, so we'll use it as a reference without FK constraint

-- 1. Create conversations table to track OpenAI conversation state
CREATE TABLE IF NOT EXISTS `conversations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(255) NOT NULL UNIQUE,
    `chat_id` VARCHAR(255) NOT NULL,
    `user_id` BIGINT,
    `guest_session_id` BIGINT,
    `last_openai_response_id` VARCHAR(255),
    `model` VARCHAR(50) NOT NULL DEFAULT 'gpt-4o-mini',
    `specialty_code` VARCHAR(50),
    `language` VARCHAR(10) DEFAULT 'en',
    `status` VARCHAR(20) NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    `expires_at` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_chat_id` (`chat_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_guest_session_id` (`guest_session_id`),
    KEY `idx_expires_at` (`expires_at`),
    KEY `idx_status` (`status`),
    -- Note: chat_id references chats.chat_id but no FK due to potential non-unique values
    CONSTRAINT `fk_conversation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_conversation_guest` FOREIGN KEY (`guest_session_id`) REFERENCES `guest_sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Create openai_responses table to store response metadata
CREATE TABLE IF NOT EXISTS `openai_responses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `response_id` VARCHAR(255) NOT NULL UNIQUE,
    `conversation_id` VARCHAR(255) NOT NULL,
    `chat_message_id` BIGINT NOT NULL,
    `previous_response_id` VARCHAR(255),
    `model` VARCHAR(50) NOT NULL,
    `tools_used` LONGTEXT,
    `completion_tokens` INT DEFAULT 0,
    `prompt_tokens` INT DEFAULT 0,
    `total_tokens` INT DEFAULT 0,
    `response_time_ms` INT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_response_id` (`response_id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_chat_message_id` (`chat_message_id`),
    KEY `idx_previous_response_id` (`previous_response_id`),
    CONSTRAINT `fk_response_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`),
    CONSTRAINT `fk_response_message` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_messages` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create conversation_files table for file attachments in conversations
CREATE TABLE IF NOT EXISTS `conversation_files` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(255) NOT NULL,
    `file_attachment_id` BIGINT NOT NULL,
    `openai_file_id` VARCHAR(255),
    `category` VARCHAR(50) NOT NULL DEFAULT 'general',
    `status` VARCHAR(20) NOT NULL DEFAULT 'uploaded',
    `processing_details` LONGTEXT,
    `uploaded_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `processed_at` DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_file_attachment_id` (`file_attachment_id`),
    KEY `idx_openai_file_id` (`openai_file_id`),
    KEY `idx_category` (`category`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_conv_file_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`),
    CONSTRAINT `fk_conv_file_attachment` FOREIGN KEY (`file_attachment_id`) REFERENCES `file_attachment` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Create usage_metrics table for token usage and cost tracking
CREATE TABLE IF NOT EXISTS `usage_metrics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(255) NOT NULL,
    `response_id` VARCHAR(255),
    `user_id` BIGINT,
    `guest_session_id` BIGINT,
    `model` VARCHAR(50) NOT NULL,
    `input_tokens` INT NOT NULL DEFAULT 0,
    `output_tokens` INT NOT NULL DEFAULT 0,
    `total_tokens` INT NOT NULL DEFAULT 0,
    `input_cost` DECIMAL(10,6) DEFAULT 0,
    `output_cost` DECIMAL(10,6) DEFAULT 0,
    `total_cost` DECIMAL(10,6) DEFAULT 0,
    `tools_cost` DECIMAL(10,6) DEFAULT 0,
    `tools_used` LONGTEXT,
    `api_type` VARCHAR(20) NOT NULL DEFAULT 'responses',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_response_id` (`response_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_guest_session_id` (`guest_session_id`),
    KEY `idx_api_type` (`api_type`),
    KEY `idx_created_at` (`created_at`),
    CONSTRAINT `fk_usage_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`),
    CONSTRAINT `fk_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_usage_guest` FOREIGN KEY (`guest_session_id`) REFERENCES `guest_sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Create batch_file_uploads table for multi-file upload tracking
CREATE TABLE IF NOT EXISTS `batch_file_uploads` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `batch_id` VARCHAR(255) NOT NULL UNIQUE,
    `conversation_id` VARCHAR(255),
    `chat_id` VARCHAR(255),
    `user_id` BIGINT,
    `guest_session_id` BIGINT,
    `total_files` INT NOT NULL DEFAULT 0,
    `processed_files` INT NOT NULL DEFAULT 0,
    `failed_files` INT NOT NULL DEFAULT 0,
    `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
    `category` VARCHAR(50),
    `metadata` LONGTEXT,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `completed_at` DATETIME,
    PRIMARY KEY (`id`),
    KEY `idx_batch_id` (`batch_id`),
    KEY `idx_conversation_id` (`conversation_id`),
    KEY `idx_chat_id` (`chat_id`),
    KEY `idx_status` (`status`),
    CONSTRAINT `fk_batch_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`),
    -- Note: chat_id references chats.chat_id but no FK due to potential non-unique values
    CONSTRAINT `fk_batch_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_batch_guest` FOREIGN KEY (`guest_session_id`) REFERENCES `guest_sessions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Add new columns to existing tables for Responses API integration
ALTER TABLE `chat_messages`
    ADD COLUMN `openai_response_id` VARCHAR(255) AFTER `timestamp`,
    ADD KEY `idx_openai_response_id` (`openai_response_id`);

ALTER TABLE `file_attachment`
    ADD COLUMN `openai_file_id` VARCHAR(255) AFTER `extracted_text`,
    ADD COLUMN `batch_id` VARCHAR(255) AFTER `openai_file_id`,
    ADD KEY `idx_openai_file_id` (`openai_file_id`),
    ADD KEY `idx_batch_id` (`batch_id`);

-- 7. Create indexes for performance optimization
CREATE INDEX `idx_conv_expiry_status` ON `conversations` (`expires_at`, `status`);
CREATE INDEX `idx_usage_date_user` ON `usage_metrics` (`created_at`, `user_id`);
CREATE INDEX `idx_usage_date_guest` ON `usage_metrics` (`created_at`, `guest_session_id`);

-- 8. Create stored procedure for conversation cleanup (30-day retention)
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS `cleanup_expired_conversations`()
BEGIN
    UPDATE `conversations` 
    SET `status` = 'expired' 
    WHERE `expires_at` < NOW() AND `status` = 'active';
END$$
DELIMITER ;

-- 9. Create event to run cleanup daily
CREATE EVENT IF NOT EXISTS `daily_conversation_cleanup`
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY + INTERVAL 2 HOUR)
DO CALL cleanup_expired_conversations();