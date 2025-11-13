CREATE TABLE ref_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	ll_slug VARCHAR(255) NOT NULL UNIQUE,
	ll_name VARCHAR(255) NOT NULL,
	ll_name_original VARCHAR(255) NOT NULL,
	ll_description TEXT,
	ll_background_image TEXT,
	ll_background_image_additional TEXT,
	nb_rating INT NOT NULL DEFAULT 0,
	ts_released TIMESTAMP NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_name VARCHAR(255) NOT NULL,
    ll_constructor TEXT,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_name VARCHAR(255) NOT NULL,
    ll_email VARCHAR(255) NOT NULL UNIQUE,
    ll_password VARCHAR(255) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_name VARCHAR(255) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_token TEXT NOT NULL UNIQUE,
    ll_user_id UUID NOT NULL,
    ts_expires_at TIMESTAMP NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    CONSTRAINT check_expires_after_created CHECK (ts_expires_at > ts_created_at)
);

CREATE TABLE assoc_games_developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_developer_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_developer_id) REFERENCES ref_developers(id) ON DELETE CASCADE,
    CONSTRAINT unique_game_developer UNIQUE (ll_game_id, ll_developer_id)
);

CREATE TABLE assoc_games_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    CONSTRAINT unique_game_platform UNIQUE (ll_game_id, ll_platform_id)
);

CREATE TABLE assoc_users_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_user_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_platform UNIQUE (ll_user_id, ll_platform_id)
);

CREATE TABLE assoc_users_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_user_id UUID NOT NULL,
    ll_game_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_game UNIQUE (ll_user_id, ll_game_id)
);

CREATE INDEX idx_ref_games_ll_name ON ref_games(ll_name);
CREATE INDEX idx_ref_games_flag_active ON ref_games(flag_active);
CREATE INDEX idx_ref_games_ts_released ON ref_games(ts_released);
CREATE INDEX idx_ref_games_ll_console_name ON ref_games(ll_console_name);

CREATE INDEX idx_ref_platforms_ll_name ON ref_platforms(ll_name);
CREATE INDEX idx_ref_platforms_flag_active ON ref_platforms(flag_active);

CREATE INDEX idx_ref_users_flag_active ON ref_users(flag_active);
CREATE INDEX idx_ref_users_ll_name ON ref_users(ll_name);

CREATE INDEX idx_ref_developers_ll_name ON ref_developers(ll_name);
CREATE INDEX idx_ref_developers_flag_active ON ref_developers(flag_active);

CREATE INDEX idx_ref_tokens_ll_token ON ref_tokens(ll_token);
CREATE INDEX idx_ref_tokens_ll_user_id ON ref_tokens(ll_user_id);
CREATE INDEX idx_ref_tokens_ts_expires_at ON ref_tokens(ts_expires_at);
CREATE INDEX idx_ref_tokens_composite ON ref_tokens(ll_user_id, flag_active, ts_expires_at);

CREATE INDEX idx_assoc_games_developers_game_id ON assoc_games_developers(ll_game_id);
CREATE INDEX idx_assoc_games_developers_developer_id ON assoc_games_developers(ll_developer_id);

CREATE INDEX idx_assoc_games_platforms_game_id ON assoc_games_platforms(ll_game_id);
CREATE INDEX idx_assoc_games_platforms_platform_id ON assoc_games_platforms(ll_platform_id);

CREATE INDEX idx_assoc_users_platforms_user_id ON assoc_users_platforms(ll_user_id);
CREATE INDEX idx_assoc_users_platforms_platform_id ON assoc_users_platforms(ll_platform_id);

CREATE INDEX idx_assoc_users_games_user_id ON assoc_users_games(ll_user_id);
CREATE INDEX idx_assoc_users_games_game_id ON assoc_users_games(ll_game_id);

CREATE INDEX idx_assoc_games_platforms_composite ON assoc_games_platforms(ll_platform_id, ll_game_id);
CREATE INDEX idx_assoc_users_games_composite ON assoc_users_games(ll_user_id, ll_game_id);
CREATE INDEX idx_ref_games_composite ON ref_games(flag_active, ll_name);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ref_games_updated_at
    BEFORE UPDATE ON ref_games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_platforms_updated_at
    BEFORE UPDATE ON ref_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_developers_updated_at
    BEFORE UPDATE ON ref_developers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_users_updated_at
    BEFORE UPDATE ON ref_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ref_tokens_updated_at
    BEFORE UPDATE ON ref_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assoc_games_developers_updated_at
    BEFORE UPDATE ON assoc_games_developers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assoc_games_platforms_updated_at
    BEFORE UPDATE ON assoc_games_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assoc_users_platforms_updated_at
    BEFORE UPDATE ON assoc_users_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assoc_users_games_updated_at
    BEFORE UPDATE ON assoc_users_games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
