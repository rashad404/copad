-- Emergency fix for MariaDB JSON compatibility issue in production
-- Run this script on your production database to fix the JSON column errors

-- Check if columns exist and modify them
-- Using IF EXISTS to make the script idempotent

-- Fix openai_responses table
SET @dbname = DATABASE();
SET @tablename = 'openai_responses';
SET @columnname = 'tools_used';
SET @preparedStatement = CONCAT('SELECT COUNT(*) INTO @columnExists FROM information_schema.columns WHERE table_schema = \'', @dbname, '\' AND table_name = \'', @tablename, '\' AND column_name = \'', @columnname, '\' AND data_type = \'json\'');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = IF(@columnExists > 0, 
    CONCAT('ALTER TABLE `', @tablename, '` MODIFY COLUMN `', @columnname, '` LONGTEXT'), 
    'SELECT \'Column already updated or does not exist\' AS status');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Fix conversation_files table
SET @tablename = 'conversation_files';
SET @columnname = 'processing_details';
SET @preparedStatement = CONCAT('SELECT COUNT(*) INTO @columnExists FROM information_schema.columns WHERE table_schema = \'', @dbname, '\' AND table_name = \'', @tablename, '\' AND column_name = \'', @columnname, '\' AND data_type = \'json\'');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = IF(@columnExists > 0, 
    CONCAT('ALTER TABLE `', @tablename, '` MODIFY COLUMN `', @columnname, '` LONGTEXT'), 
    'SELECT \'Column already updated or does not exist\' AS status');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Fix usage_metrics table
SET @tablename = 'usage_metrics';
SET @columnname = 'tools_used';
SET @preparedStatement = CONCAT('SELECT COUNT(*) INTO @columnExists FROM information_schema.columns WHERE table_schema = \'', @dbname, '\' AND table_name = \'', @tablename, '\' AND column_name = \'', @columnname, '\' AND data_type = \'json\'');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = IF(@columnExists > 0, 
    CONCAT('ALTER TABLE `', @tablename, '` MODIFY COLUMN `', @columnname, '` LONGTEXT'), 
    'SELECT \'Column already updated or does not exist\' AS status');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Fix batch_file_uploads table
SET @tablename = 'batch_file_uploads';
SET @columnname = 'metadata';
SET @preparedStatement = CONCAT('SELECT COUNT(*) INTO @columnExists FROM information_schema.columns WHERE table_schema = \'', @dbname, '\' AND table_name = \'', @tablename, '\' AND column_name = \'', @columnname, '\' AND data_type = \'json\'');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @preparedStatement = IF(@columnExists > 0, 
    CONCAT('ALTER TABLE `', @tablename, '` MODIFY COLUMN `', @columnname, '` LONGTEXT'), 
    'SELECT \'Column already updated or does not exist\' AS status');
PREPARE stmt FROM @preparedStatement;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Show results
SELECT 'MariaDB JSON compatibility fix completed' AS status;