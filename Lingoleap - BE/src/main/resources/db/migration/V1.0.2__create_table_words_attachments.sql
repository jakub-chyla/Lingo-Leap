create TABLE IF NOT EXISTS words (
    id BIGSERIAL PRIMARY KEY,
    polish VARCHAR(255),
    english VARCHAR(255)
);

create TABLE IF NOT EXISTS attachments (
    file_name VARCHAR(255) PRIMARY KEY,
    word_id BIGSERIAL,
    file_type VARCHAR(255),
    language VARCHAR(50) NOT NULL,
    data OID
);