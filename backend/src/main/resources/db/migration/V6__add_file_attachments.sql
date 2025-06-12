-- Create the file_attachment table
CREATE TABLE file_attachment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_id VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    extracted_text TEXT,
    message_id BIGINT,
    session_id VARCHAR(255),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES guest_sessions(session_id) ON DELETE CASCADE
);

-- Add index for faster lookup
CREATE INDEX idx_file_attachment_file_id ON file_attachment(file_id);
CREATE INDEX idx_file_attachment_message_id ON file_attachment(message_id);
CREATE INDEX idx_file_attachment_session_id ON file_attachment(session_id);