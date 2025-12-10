CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE ref_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_slug VARCHAR(255) NOT NULL UNIQUE,
    ll_name VARCHAR(255) NOT NULL,
    ll_manufacturer VARCHAR(255),
    ll_url TEXT,
    ll_details JSONB,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_name VARCHAR(120) NOT NULL UNIQUE,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_code VARCHAR(10) NOT NULL UNIQUE,
    ll_label VARCHAR(60) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_condition_states (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_code VARCHAR(20) NOT NULL UNIQUE,
    ll_label VARCHAR(60) NOT NULL,
    ll_description TEXT NOT NULL,
    nb_rating INTEGER CHECK (nb_rating >= 1 AND nb_rating <= 5),
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_slug VARCHAR(255) NOT NULL UNIQUE,
    ll_title VARCHAR(255) NOT NULL,
    ll_cover_image TEXT,
    ll_game_url TEXT,
    ll_product_id VARCHAR(50),
    ll_publisher VARCHAR(255),
    ll_developer VARCHAR(255),
    ll_description TEXT,
    ts_released TIMESTAMP,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE assoc_games_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    ts_release_platform TIMESTAMP,
    ll_region_code VARCHAR(10) NOT NULL DEFAULT 'GLOBAL',
    ll_region_label VARCHAR(60),
    ll_console_url TEXT,
    ll_publisher VARCHAR(255),
    ll_developer VARCHAR(255),
    ll_esrb_rating VARCHAR(20),
    nb_player_count INTEGER,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_region_code) REFERENCES ref_regions(ll_code),
    CONSTRAINT unique_game_platform UNIQUE (ll_game_id, ll_platform_id, ll_region_code)
);

CREATE TABLE assoc_games_genres (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_genre_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_genre_id) REFERENCES ref_genres(id) ON DELETE CASCADE,
    CONSTRAINT unique_game_genre UNIQUE (ll_game_id, ll_genre_id)
);

CREATE TABLE ref_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_username VARCHAR(255) NOT NULL,
    ll_email VARCHAR(255) NOT NULL UNIQUE,
    ll_password_hash VARCHAR(255) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_user_email CHECK (ll_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

CREATE TABLE ref_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_user_id UUID NOT NULL,
    ll_token TEXT NOT NULL UNIQUE,
    ll_refresh_token TEXT UNIQUE,
    ll_token_type VARCHAR(30) NOT NULL DEFAULT 'access',
    ll_device_name VARCHAR(120),
    ts_expires_at TIMESTAMP NOT NULL,
    ts_refresh_expires_at TIMESTAMP,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    CONSTRAINT check_token_dates CHECK (
        ts_expires_at > ts_created_at
        AND (ts_refresh_expires_at IS NULL OR ts_refresh_expires_at > ts_expires_at)
    )
);

CREATE TABLE ref_market_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    ll_price_type VARCHAR(20) DEFAULT 'retail' CHECK (ll_price_type IN ('loose', 'cib', 'new', 'retail')),
    nb_price_retail NUMERIC(10,2) CHECK (nb_price_retail >= 0),
    nb_price_change NUMERIC(10,2),
    nb_price_change_percent NUMERIC(8,2),
    nb_print_run INTEGER,
    ts_collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ll_source VARCHAR(255),
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    CONSTRAINT unique_market_price UNIQUE (ll_game_id, ll_platform_id, ll_price_type, ts_collected_at)
);

CREATE TABLE assoc_users_games_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_user_id UUID NOT NULL,
    ll_game_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    ll_status VARCHAR(30) NOT NULL DEFAULT 'owned',
    ll_edition VARCHAR(120),
    ll_format VARCHAR(60),
    ll_notes TEXT,
    nb_price_paid NUMERIC(10,2) CHECK (nb_price_paid >= 0),
    ts_acquired_at TIMESTAMP,
    flag_has_box BOOLEAN DEFAULT FALSE,
    flag_has_manual BOOLEAN DEFAULT FALSE,
    -- États de condition pour chaque élément
    ll_cart_condition_id UUID,
    ll_box_condition_id UUID,
    ll_manual_condition_id UUID,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_cart_condition_id) REFERENCES ref_condition_states(id),
    FOREIGN KEY (ll_box_condition_id) REFERENCES ref_condition_states(id),
    FOREIGN KEY (ll_manual_condition_id) REFERENCES ref_condition_states(id),
    CONSTRAINT check_collection_status CHECK (
        ll_status IN ('owned', 'loaned', 'for_sale', 'digital', 'preordered')
    ),
    CONSTRAINT unique_user_collection UNIQUE (ll_user_id, ll_game_id, ll_platform_id)
);

CREATE TABLE assoc_users_games_wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_user_id UUID NOT NULL,
    ll_game_id UUID NOT NULL,
    ll_platform_id UUID NOT NULL,
    nb_price_target NUMERIC(10,2) CHECK (nb_price_target >= 0),
    ll_priority VARCHAR(30) DEFAULT 'medium',
    ll_notes TEXT,
    ll_retailer_link TEXT,
    ts_added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_user_id) REFERENCES ref_users(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_platform_id) REFERENCES ref_platforms(id) ON DELETE CASCADE,
    CONSTRAINT check_wishlist_priority CHECK (
        ll_priority IN ('low', 'medium', 'high', 'urgent')
    ),
    CONSTRAINT unique_user_wishlist UNIQUE (ll_user_id, ll_game_id, ll_platform_id)
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ref_platforms_updated_at
    BEFORE UPDATE ON ref_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_genres_updated_at
    BEFORE UPDATE ON ref_genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_regions_updated_at
    BEFORE UPDATE ON ref_regions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_condition_states_updated_at
    BEFORE UPDATE ON ref_condition_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_games_updated_at
    BEFORE UPDATE ON ref_games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_assoc_games_platforms_updated_at
    BEFORE UPDATE ON assoc_games_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_assoc_games_genres_updated_at
    BEFORE UPDATE ON assoc_games_genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_users_updated_at
    BEFORE UPDATE ON ref_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_tokens_updated_at
    BEFORE UPDATE ON ref_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_ref_market_prices_updated_at
    BEFORE UPDATE ON ref_market_prices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_assoc_users_games_collections_updated_at
    BEFORE UPDATE ON assoc_users_games_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_assoc_users_games_wishlists_updated_at
    BEFORE UPDATE ON assoc_users_games_wishlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_ref_platforms_name ON ref_platforms(ll_name);
CREATE INDEX idx_ref_platforms_active ON ref_platforms(flag_active);

CREATE INDEX idx_ref_regions_code ON ref_regions(ll_code);

CREATE INDEX idx_ref_condition_states_code ON ref_condition_states(ll_code);
CREATE INDEX idx_ref_condition_states_active ON ref_condition_states(flag_active);

CREATE INDEX idx_ref_games_title ON ref_games(ll_title);
CREATE INDEX idx_ref_games_slug ON ref_games(ll_slug);
CREATE INDEX idx_ref_games_active ON ref_games(flag_active);
CREATE INDEX idx_ref_games_publisher ON ref_games(ll_publisher);
CREATE INDEX idx_ref_games_developer ON ref_games(ll_developer);

CREATE INDEX idx_assoc_games_platforms_game ON assoc_games_platforms(ll_game_id);
CREATE INDEX idx_assoc_games_platforms_platform ON assoc_games_platforms(ll_platform_id);
CREATE INDEX idx_assoc_games_platforms_region ON assoc_games_platforms(ll_region_code);
CREATE INDEX idx_assoc_games_platforms_publisher ON assoc_games_platforms(ll_publisher);
CREATE INDEX idx_assoc_games_platforms_developer ON assoc_games_platforms(ll_developer);

CREATE INDEX idx_ref_users_email ON ref_users(ll_email);
CREATE INDEX idx_ref_users_active ON ref_users(flag_active);

CREATE INDEX idx_ref_tokens_user ON ref_tokens(ll_user_id);
CREATE INDEX idx_ref_tokens_active ON ref_tokens(flag_active);

CREATE INDEX idx_assoc_users_games_collections_user ON assoc_users_games_collections(ll_user_id);
CREATE INDEX idx_assoc_users_games_collections_platform ON assoc_users_games_collections(ll_platform_id);
CREATE INDEX idx_assoc_users_games_collections_status ON assoc_users_games_collections(ll_status);
CREATE INDEX idx_assoc_users_games_collections_cart_condition ON assoc_users_games_collections(ll_cart_condition_id);
CREATE INDEX idx_assoc_users_games_collections_box_condition ON assoc_users_games_collections(ll_box_condition_id);
CREATE INDEX idx_assoc_users_games_collections_manual_condition ON assoc_users_games_collections(ll_manual_condition_id);

CREATE INDEX idx_assoc_users_games_wishlists_user ON assoc_users_games_wishlists(ll_user_id);
CREATE INDEX idx_assoc_users_games_wishlists_platform ON assoc_users_games_wishlists(ll_platform_id);
CREATE INDEX idx_assoc_users_games_wishlists_priority ON assoc_users_games_wishlists(ll_priority);

CREATE INDEX idx_ref_market_prices_game_platform ON ref_market_prices(ll_game_id, ll_platform_id);
CREATE INDEX idx_ref_market_prices_price_type ON ref_market_prices(ll_price_type);
