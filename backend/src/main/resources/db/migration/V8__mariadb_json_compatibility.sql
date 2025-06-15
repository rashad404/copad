-- Migration to ensure MariaDB compatibility for JSON columns
-- Changes JSON column types to LONGTEXT for better compatibility

-- Update openai_responses table
ALTER TABLE `openai_responses` 
MODIFY COLUMN `tools_used` LONGTEXT;

-- Update conversation_files table
ALTER TABLE `conversation_files` 
MODIFY COLUMN `processing_details` LONGTEXT;

-- Update usage_metrics table
ALTER TABLE `usage_metrics` 
MODIFY COLUMN `tools_used` LONGTEXT;

-- Update batch_file_uploads table
ALTER TABLE `batch_file_uploads` 
MODIFY COLUMN `metadata` LONGTEXT;