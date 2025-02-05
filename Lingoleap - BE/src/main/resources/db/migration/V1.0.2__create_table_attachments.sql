CREATE TABLE IF NOT EXISTS attachments (
    file_name VARCHAR(255) PRIMARY KEY,
    file_type VARCHAR(255),
    data OID
);