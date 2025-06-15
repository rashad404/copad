-- Cleanup script to fix MariaDB compatibility
-- This script checks for existence before dropping/altering

-- Only drop and recreate tables that have JSON columns
-- Check and drop only if they exist
DROP TABLE IF EXISTS `openai_responses`;
DROP TABLE IF EXISTS `conversation_files`;
DROP TABLE IF EXISTS `usage_metrics`;
DROP TABLE IF EXISTS `batch_file_uploads`;

-- Recreate with LONGTEXT
CREATE TABLE IF NOT EXISTS `openai_responses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `response_id` VARCHAR(255) NOT NULL UNIQUE,
    `conversation_id` VARCHAR(255) NOT NULL,
    `chat_message_id` BIGINT,
    `previous_response_id` VARCHAR(255),
    `model` VARCHAR(50),
    `tools_used` LONGTEXT,
    `completion_tokens` INT DEFAULT 0,
    `prompt_tokens` INT DEFAULT 0,
    `total_tokens` INT DEFAULT 0,
    `response_time_ms` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_conversation_id` (`conversation_id`),
    INDEX `idx_response_id` (`response_id`),
    CONSTRAINT `fk_openai_response_message` FOREIGN KEY (`chat_message_id`) REFERENCES `chat_messages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `conversation_files` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `conversation_id` VARCHAR(255) NOT NULL,
    `file_attachment_id` BIGINT NOT NULL,
    `openai_file_id` VARCHAR(255),
    `category` VARCHAR(50),
    `status` VARCHAR(50) DEFAULT 'pending',
    `processing_details` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_conversation_files_conversation` (`conversation_id`),
    CONSTRAINT `fk_conversation_file_attachment` FOREIGN KEY (`file_attachment_id`) REFERENCES `file_attachments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `usage_metrics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT,
    `guest_session_id` BIGINT,
    `conversation_id` VARCHAR(255),
    `response_id` VARCHAR(255),
    `model` VARCHAR(50),
    `prompt_tokens` INT DEFAULT 0,
    `completion_tokens` INT DEFAULT 0,
    `total_tokens` INT DEFAULT 0,
    `tools_used` LONGTEXT,
    `prompt_cost` DECIMAL(10, 6) DEFAULT 0,
    `completion_cost` DECIMAL(10, 6) DEFAULT 0,
    `total_cost` DECIMAL(10, 6) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_usage_user` (`user_id`),
    INDEX `idx_usage_guest` (`guest_session_id`),
    INDEX `idx_usage_conversation` (`conversation_id`),
    INDEX `idx_usage_created` (`created_at`),
    CONSTRAINT `fk_usage_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_usage_guest` FOREIGN KEY (`guest_session_id`) REFERENCES `guest_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `batch_file_uploads` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `batch_id` VARCHAR(255) NOT NULL UNIQUE,
    `chat_id` VARCHAR(255) NOT NULL,
    `conversation_id` VARCHAR(255),
    `user_id` BIGINT,
    `guest_session_id` BIGINT,
    `category` VARCHAR(50) DEFAULT 'general',
    `status` VARCHAR(50) DEFAULT 'pending',
    `total_files` INT DEFAULT 0,
    `processed_files` INT DEFAULT 0,
    `failed_files` INT DEFAULT 0,
    `metadata` LONGTEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `completed_at` TIMESTAMP NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_batch_id` (`batch_id`),
    INDEX `idx_batch_chat` (`chat_id`),
    INDEX `idx_batch_user` (`user_id`),
    INDEX `idx_batch_guest` (`guest_session_id`),
    CONSTRAINT `fk_batch_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_batch_guest` FOREIGN KEY (`guest_session_id`) REFERENCES `guest_sessions` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;