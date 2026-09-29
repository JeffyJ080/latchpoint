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