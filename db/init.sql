-- =====================================================================
-- Latchpoint Database Initialization (MySQL 8.0)
-- 5-Table Consolidated Schema with Roles and Audit Logging
-- =====================================================================
CREATE DATABASE IF NOT EXISTS latchpoint_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE latchpoint_db;
-- ---------------------------------------------------------------------
-- 1. Table: users (Consolidated End Users and Business Admins)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'END_USER',
    -- 'ADMIN' or 'END_USER'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_username (username),
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ---------------------------------------------------------------------
-- 2. Table: sessions (Active Authentication Tokens)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_sessions_user_id (user_id),
    INDEX idx_sessions_expires_at (expires_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ---------------------------------------------------------------------
-- 3. Table: mfa (TOTP 2FA Secret Configurations)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS mfa (
    mfa_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    secret VARCHAR(255) NOT NULL,
    -- Encrypted at rest
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_mfa_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_mfa_user_id (user_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ---------------------------------------------------------------------
-- 4. Table: authentication_handler (Audit Log & Brute-Force Detection)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS authentication_handler (
    handler_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL,
    -- 'LOGIN_SUCCESS', 'LOGIN_FAILED', 'MFA_SUCCESS', 'LOGOUT'
    ip_address VARCHAR(45) NULL,
    details TEXT NULL,
    log_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auth_handler_user FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE
    SET NULL,
        INDEX idx_auth_handler_log_time (log_time),
        INDEX idx_auth_handler_event_type (event_type),
        INDEX idx_auth_handler_user_id (user_id),
        INDEX idx_auth_handler_ip_lookup (ip_address, event_type, log_time)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- ---------------------------------------------------------------------
-- 5. Table: configurations (System-wide Security Policies)
-- ---------------------------------------------------------------------
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
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by BIGINT NULL,
    CONSTRAINT fk_config_user FOREIGN KEY (updated_by) REFERENCES users (user_id) ON DELETE
    SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- =====================================================================
-- Seed Data (Initial Admin, Demo User, & Default Configuration)
-- =====================================================================
-- 1. Initial Admin Account (username: admin / password: Admin123!)
-- BCrypt Hash: $2a$10$eA0y5cM4J6pYlWfB8N2F.OLhFkWZfPz4FvY/9L1E0wQn.R1sWwGGe
INSERT INTO users (
        user_id,
        username,
        password,
        email,
        role,
        is_active
    )
VALUES (
        1,
        'admin',
        '$2a$10$eA0y5cM4J6pYlWfB8N2F.OLhFkWZfPz4FvY/9L1E0wQn.R1sWwGGe',
        'admin@latchpoint.local',
        'ADMIN',
        TRUE
    ) ON DUPLICATE KEY
UPDATE user_id = user_id;
-- 2. Initial Demo End User (username: demo_user / password: UserPassword123!)
-- BCrypt Hash: $2a$10$7R6v7t1tOQY1n8V3QhXJueyZq8yGf1F8U9f3uB9o5B1X.e6C9Y.Gq
INSERT INTO users (
        user_id,
        username,
        password,
        email,
        role,
        is_active
    )
VALUES (
        2,
        'demo_user',
        '$2a$10$7R6v7t1tOQY1n8V3QhXJueyZq8yGf1F8U9f3uB9o5B1X.e6C9Y.Gq',
        'demo@business.local',
        'END_USER',
        TRUE
    ) ON DUPLICATE KEY
UPDATE user_id = user_id;
-- 3. Default Security Configuration
INSERT INTO configurations (
        config_id,
        password_min_length,
        require_uppercase,
        require_number,
        require_symbol,
        password_expiry_days,
        mfa_enabled,
        force_mfa,
        session_timeout_limit,
        updated_by
    )
VALUES (1, 8, TRUE, TRUE, TRUE, 90, TRUE, FALSE, 30, 1) ON DUPLICATE KEY
UPDATE config_id = config_id;