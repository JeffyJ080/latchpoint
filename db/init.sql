CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS admins (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS mfa (
    mfa_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    secret VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mfa_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS authentication_handler (
    handler_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL,
    ip_address VARCHAR(45) NULL,
    details TEXT NULL,
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_authentication_handler_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE
    SET NULL
);
CREATE TABLE IF NOT EXISTS configurations (
    config_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    password_min_length INT NOT NULL DEFAULT 8,
    require_uppercase BOOLEAN NOT NULL DEFAULT TRUE,
    require_number BOOLEAN NOT NULL DEFAULT TRUE,
    require_symbol BOOLEAN NOT NULL DEFAULT TRUE,
    password_expiry_days INT NOT NULL DEFAULT 90,
    mfa_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    force_mfa BOOLEAN NOT NULL DEFAULT FALSE,
    session_timeout_limit INT NOT NULL DEFAULT 30,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by VARCHAR(50) NOT NULL DEFAULT 'system'
);
INSERT INTO configurations (config_id)
VALUES (1) ON CONFLICT (config_id) DO NOTHING;
INSERT INTO admins (username, password_hash)
VALUES (
        'admin',
        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
    ) ON CONFLICT (username) DO NOTHING;
INSERT INTO users (username, password_hash)
VALUES (
        'demo_user',
        '$2a$10$7EqJtq98hPqEX7fNZaFWoO5uXA6N1h7Hl5T3WzoPWozQJtY6G6g6i'
    ) ON CONFLICT (username) DO NOTHING;