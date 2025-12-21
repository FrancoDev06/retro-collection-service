CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES DE RÉFÉRENCE
-- ============================================

CREATE TABLE ref_regions (
    id_region UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_code VARCHAR(10) NOT NULL UNIQUE,
    ll_label VARCHAR(60) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_platforms (
    id_platform UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_slug VARCHAR(255) NOT NULL UNIQUE,
    ll_name VARCHAR(255) NOT NULL,
    ll_manufacturer VARCHAR(255),
    ll_url TEXT,
    ll_details JSONB,
    id_region UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_region) REFERENCES ref_regions(id_region) ON DELETE CASCADE,
    CONSTRAINT unique_platform_region UNIQUE (ll_slug, id_region)
);

CREATE TABLE ref_genres (
    id_genre UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_name VARCHAR(120) NOT NULL UNIQUE,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE ref_condition_states (
    id_condition_state UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_code VARCHAR(20) NOT NULL,
    ll_label VARCHAR(60) NOT NULL,
    ll_element_type VARCHAR(20) NOT NULL CHECK (ll_element_type IN ('cart', 'manual', 'box', 'console')),
    ll_description TEXT NOT NULL,
    nb_rating INTEGER CHECK (nb_rating >= 0 AND nb_rating <= 5),
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT unique_condition_element UNIQUE (ll_code, ll_element_type)
);

CREATE TABLE ref_games (
    id_game UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_slug VARCHAR(255) NOT NULL UNIQUE,
    ll_title VARCHAR(255) NOT NULL,
    ll_cover_image TEXT,
    ll_cover_image_large TEXT,
    ll_game_url TEXT,
    ll_product_id VARCHAR(50),
    ll_publisher VARCHAR(255),
    ll_developer VARCHAR(255),
    ll_description TEXT,
    ts_released TIMESTAMP,
    id_region UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_region) REFERENCES ref_regions(id_region) ON DELETE CASCADE,
    CONSTRAINT unique_game_region UNIQUE (ll_slug, id_region)
);

CREATE TABLE ref_users (
    id_user UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_username VARCHAR(255) NOT NULL,
    ll_email VARCHAR(255) NOT NULL UNIQUE,
    ll_password_hash VARCHAR(255) NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_user_email CHECK (ll_email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$')
);

-- ============================================
-- TABLES D'ASSOCIATION
-- ============================================

CREATE TABLE assoc_games_platforms (
    id_game_platform UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_game UUID NOT NULL,
    id_platform UUID NOT NULL,
    ts_release_platform TIMESTAMP,
    ll_console_url TEXT,
    ll_publisher VARCHAR(255),
    ll_developer VARCHAR(255),
    ll_esrb_rating VARCHAR(20),
    nb_player_count INTEGER,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_game) REFERENCES ref_games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_platform) REFERENCES ref_platforms(id_platform) ON DELETE CASCADE,
    CONSTRAINT unique_game_platform UNIQUE (id_game, id_platform)
);

CREATE TABLE assoc_games_genres (
    id_game_genre UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_game UUID NOT NULL,
    id_genre UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_game) REFERENCES ref_games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_genre) REFERENCES ref_genres(id_genre) ON DELETE CASCADE,
    CONSTRAINT unique_game_genre UNIQUE (id_game, id_genre)
);

CREATE TABLE ref_tokens (
    id_token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    ll_token TEXT NOT NULL UNIQUE,
    ll_refresh_token TEXT UNIQUE,
    ll_token_type VARCHAR(30) NOT NULL DEFAULT 'access',
    ll_device_name VARCHAR(120),
    ts_expires_at TIMESTAMP NOT NULL,
    ts_refresh_expires_at TIMESTAMP,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_user) REFERENCES ref_users(id_user) ON DELETE CASCADE,
    CONSTRAINT check_token_dates CHECK (
        ts_expires_at > ts_created_at
        AND (ts_refresh_expires_at IS NULL OR ts_refresh_expires_at > ts_expires_at)
    )
);

CREATE TABLE ref_market_prices (
    id_market_price UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_game UUID NOT NULL,
    id_platform UUID NOT NULL,
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
    FOREIGN KEY (id_game) REFERENCES ref_games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_platform) REFERENCES ref_platforms(id_platform) ON DELETE CASCADE,
    CONSTRAINT unique_market_price UNIQUE (id_game, id_platform, ll_price_type, ts_collected_at)
);

CREATE TABLE assoc_users_games_collections (
    id_user_game_collection UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    id_game UUID NOT NULL,
    id_platform UUID NOT NULL,
    ll_notes TEXT,
    nb_price_paid NUMERIC(10,2) CHECK (nb_price_paid >= 0),
    ts_acquired_at TIMESTAMP,
    -- Flags pour indiquer la présence des éléments
    flag_has_cart BOOLEAN DEFAULT FALSE,
    flag_has_box BOOLEAN DEFAULT FALSE,
    flag_has_notice BOOLEAN DEFAULT FALSE,
    -- États de condition pour chaque élément (référence vers ref_condition_states)
    id_cart_condition UUID,
    id_box_condition UUID,
    id_notice_condition UUID,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_user) REFERENCES ref_users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_game) REFERENCES ref_games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_platform) REFERENCES ref_platforms(id_platform) ON DELETE CASCADE,
    FOREIGN KEY (id_cart_condition) REFERENCES ref_condition_states(id_condition_state),
    FOREIGN KEY (id_box_condition) REFERENCES ref_condition_states(id_condition_state),
    FOREIGN KEY (id_notice_condition) REFERENCES ref_condition_states(id_condition_state)
);

CREATE TABLE assoc_users_platforms (
    id_user_platform UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    id_platform UUID NOT NULL,
    nb_units INTEGER NOT NULL DEFAULT 1 CHECK (nb_units > 0),
    id_condition_state UUID,
    ll_purchase_source VARCHAR(120),
    nb_price_paid NUMERIC(10,2) CHECK (nb_price_paid >= 0),
    ts_acquired_at TIMESTAMP,
    ll_notes TEXT,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_user) REFERENCES ref_users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_platform) REFERENCES ref_platforms(id_platform) ON DELETE CASCADE,
    FOREIGN KEY (id_condition_state) REFERENCES ref_condition_states(id_condition_state),
    CONSTRAINT unique_user_platform UNIQUE (id_user, id_platform, ts_acquired_at, id_condition_state)
);

CREATE TABLE assoc_users_games_wishlists (
    id_user_game_wishlist UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_user UUID NOT NULL,
    id_game UUID NOT NULL,
    id_platform UUID NOT NULL,
    nb_price_target NUMERIC(10,2) CHECK (nb_price_target >= 0),
    ll_priority VARCHAR(30) DEFAULT 'medium',
    ll_notes TEXT,
    ll_retailer_link TEXT,
    ts_added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_user) REFERENCES ref_users(id_user) ON DELETE CASCADE,
    FOREIGN KEY (id_game) REFERENCES ref_games(id_game) ON DELETE CASCADE,
    FOREIGN KEY (id_platform) REFERENCES ref_platforms(id_platform) ON DELETE CASCADE,
    CONSTRAINT check_wishlist_priority CHECK (
        ll_priority IN ('low', 'medium', 'high', 'urgent')
    ),
    CONSTRAINT unique_user_wishlist UNIQUE (id_user, id_game, id_platform)
);

-- ============================================
-- FONCTIONS ET TRIGGERS
-- ============================================

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

CREATE TRIGGER trg_assoc_users_platforms_updated_at
    BEFORE UPDATE ON assoc_users_platforms
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INDEX
-- ============================================

-- Index pour ref_platforms
CREATE INDEX idx_ref_platforms_name ON ref_platforms(ll_name);
CREATE INDEX idx_ref_platforms_active ON ref_platforms(flag_active);
CREATE INDEX idx_ref_platforms_region ON ref_platforms(id_region);

-- Index pour ref_regions
CREATE INDEX idx_ref_regions_code ON ref_regions(ll_code);

-- Index pour ref_condition_states
CREATE INDEX idx_ref_condition_states_code ON ref_condition_states(ll_code);
CREATE INDEX idx_ref_condition_states_element_type ON ref_condition_states(ll_element_type);
CREATE INDEX idx_ref_condition_states_active ON ref_condition_states(flag_active);
CREATE INDEX idx_ref_condition_states_code_element ON ref_condition_states(ll_code, ll_element_type);

-- Index pour ref_games
CREATE INDEX idx_ref_games_title ON ref_games(ll_title);
CREATE INDEX idx_ref_games_slug ON ref_games(ll_slug);
CREATE INDEX idx_ref_games_active ON ref_games(flag_active);
CREATE INDEX idx_ref_games_publisher ON ref_games(ll_publisher);
CREATE INDEX idx_ref_games_developer ON ref_games(ll_developer);
CREATE INDEX idx_ref_games_region ON ref_games(id_region);

-- Index pour assoc_games_platforms
CREATE INDEX idx_assoc_games_platforms_game ON assoc_games_platforms(id_game);
CREATE INDEX idx_assoc_games_platforms_platform ON assoc_games_platforms(id_platform);
CREATE INDEX idx_assoc_games_platforms_publisher ON assoc_games_platforms(ll_publisher);
CREATE INDEX idx_assoc_games_platforms_developer ON assoc_games_platforms(ll_developer);

-- Index pour ref_users
CREATE INDEX idx_ref_users_email ON ref_users(ll_email);
CREATE INDEX idx_ref_users_active ON ref_users(flag_active);

-- Index pour ref_tokens
CREATE INDEX idx_ref_tokens_user ON ref_tokens(id_user);
CREATE INDEX idx_ref_tokens_active ON ref_tokens(flag_active);

-- Index pour assoc_users_games_collections
CREATE INDEX idx_assoc_users_games_collections_user ON assoc_users_games_collections(id_user);
CREATE INDEX idx_assoc_users_games_collections_platform ON assoc_users_games_collections(id_platform);
CREATE INDEX idx_assoc_users_games_collections_cart_condition ON assoc_users_games_collections(id_cart_condition);
CREATE INDEX idx_assoc_users_games_collections_box_condition ON assoc_users_games_collections(id_box_condition);
CREATE INDEX idx_assoc_users_games_collections_notice_condition ON assoc_users_games_collections(id_notice_condition);

-- Index pour assoc_users_games_wishlists
CREATE INDEX idx_assoc_users_games_wishlists_user ON assoc_users_games_wishlists(id_user);
CREATE INDEX idx_assoc_users_games_wishlists_platform ON assoc_users_games_wishlists(id_platform);
CREATE INDEX idx_assoc_users_games_wishlists_priority ON assoc_users_games_wishlists(ll_priority);

-- Index pour assoc_users_platforms
CREATE INDEX idx_assoc_users_platforms_user ON assoc_users_platforms(id_user);
CREATE INDEX idx_assoc_users_platforms_platform ON assoc_users_platforms(id_platform);
CREATE INDEX idx_assoc_users_platforms_condition ON assoc_users_platforms(id_condition_state);

-- Index pour ref_market_prices
CREATE INDEX idx_ref_market_prices_game_platform ON ref_market_prices(id_game, id_platform);
CREATE INDEX idx_ref_market_prices_price_type ON ref_market_prices(ll_price_type);

-- ============================================
-- DONNÉES DE RÉFÉRENCE
-- ============================================



-- Insérer les états de condition pour chaque type d'élément
-- Note: Ces insertions sont idempotentes grâce à ON CONFLICT

-- États pour les cartouches
INSERT INTO ref_condition_states
(ll_code, ll_label, ll_element_type, ll_description, nb_rating, flag_active)
VALUES
    ('mint', 'Mint', 'cart',
     'État neuf ou scellé, aucun défaut visible',
     5, TRUE),

    ('near_mint', 'Near Mint', 'cart',
     'Presque parfait, très légères traces d''utilisation',
     4, TRUE),

    ('very_good', 'Very Good', 'cart',
     'Utilisé mais très bien conservé',
     3, TRUE),

    ('good', 'Good', 'cart',
     'Usure visible mais cartouche complète et fonctionnelle',
     2, TRUE),

    ('acceptable', 'Acceptable', 'cart',
     'Usure importante mais jeu fonctionnel',
     1, TRUE),

    ('poor', 'Poor', 'cart',
     'Objet fortement endommagé ou non fonctionnel',
     0, TRUE)
ON CONFLICT (ll_code, ll_element_type) DO NOTHING;

-- États pour les boîtes
INSERT INTO ref_condition_states
(ll_code, ll_label, ll_element_type, ll_description, nb_rating, flag_active)
VALUES
    ('mint', 'Mint', 'box',
     'Boîte neuve ou scellée, aucun défaut visible',
     5, TRUE),

    ('near_mint', 'Near Mint', 'box',
     'Presque parfaite, très légères marques',
     4, TRUE),

    ('very_good', 'Very Good', 'box',
     'Boîte bien conservée avec usure légère',
     3, TRUE),

    ('good', 'Good', 'box',
     'Usure visible mais boîte complète',
     2, TRUE),

    ('acceptable', 'Acceptable', 'box',
     'Usure importante, structure encore intacte',
     1, TRUE),

    ('poor', 'Poor', 'box',
     'Boîte très endommagée ou inutilisable',
     0, TRUE)
ON CONFLICT (ll_code, ll_element_type) DO NOTHING;


-- États pour les notices
INSERT INTO ref_condition_states
(ll_code, ll_label, ll_element_type, ll_description, nb_rating, flag_active)
VALUES
    ('mint', 'Mint', 'manual',
     'Notice neuve, aucune trace d''utilisation',
     5, TRUE),

    ('near_mint', 'Near Mint', 'manual',
     'Notice presque parfaite, très légères traces',
     4, TRUE),

    ('very_good', 'Very Good', 'manual',
     'Notice bien conservée avec légère usure',
     3, TRUE),

    ('good', 'Good', 'manual',
     'Notice complète avec usure visible',
     2, TRUE),

    ('acceptable', 'Acceptable', 'manual',
     'Notice très usée mais lisible',
     1, TRUE),

    ('poor', 'Poor', 'manual',
     'Notice fortement endommagée ou inutilisable',
     0, TRUE)
ON CONFLICT (ll_code, ll_element_type) DO NOTHING;

-- États pour les consoles
INSERT INTO ref_condition_states
(ll_code, ll_label, ll_element_type, ll_description, nb_rating, flag_active)
VALUES
    ('mint', 'Mint', 'console',
     'Console neuve ou scellée, aucun défaut visible, tous les accessoires présents',
     5, TRUE),

    ('near_mint', 'Near Mint', 'console',
     'Console presque parfaite, très légères traces d''utilisation',
     4, TRUE),

    ('very_good', 'Very Good', 'console',
     'Console bien conservée avec usure légère, fonctionne parfaitement',
     3, TRUE),

    ('good', 'Good', 'console',
     'Usure visible mais console complète et fonctionnelle',
     2, TRUE),

    ('acceptable', 'Acceptable', 'console',
     'Usure importante mais console encore fonctionnelle, certains défauts cosmétiques',
     1, TRUE),

    ('poor', 'Poor', 'console',
     'Console fortement endommagée ou non fonctionnelle',
     0, TRUE)
ON CONFLICT (ll_code, ll_element_type) DO NOTHING;

INSERT INTO ref_regions (ll_code, ll_label, flag_active)
VALUES
    ('JP', 'Japan', TRUE),
    ('US', 'North America', TRUE),
    ('EU', 'Europe', TRUE)
ON CONFLICT (ll_code) DO NOTHING;

