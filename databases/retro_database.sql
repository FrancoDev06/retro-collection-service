-- ============================================
-- Script de création de la base de données Retro Collection
-- ============================================

-- Tables de référence
-- ============================================

CREATE TABLE ref_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	ll_slug VARCHAR(255) NOT NULL UNIQUE,
	ll_name VARCHAR(255) NOT NULL,
	ll_name_original VARCHAR(255) NOT NULL,
	ll_description TEXT,
	ll_background_image TEXT,
	ll_background_image_additional TEXT,
	nb_rating INT NOT NULL DEFAULT 0,
	ll_console_name VARCHAR(255) NOT NULL,
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
    ll_email VARCHAR(255) NOT NULL UNIQUE, -- ✅ AMÉLIORATION: Email unique
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


-- Tables d'association
-- ============================================


CREATE TABLE assoc_games_developers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ll_game_id UUID NOT NULL,
    ll_developer_id UUID NOT NULL,
    ts_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ts_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	flag_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (ll_game_id) REFERENCES ref_games(id) ON DELETE CASCADE,
    FOREIGN KEY (ll_developer_id) REFERENCES ref_developers(id) ON DELETE CASCADE,
    CONSTRAINT unique_game_developer UNIQUE (ll_game_id, ll_developer_id) -- ✅ AMÉLIORATION: Évite les doublons
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
    CONSTRAINT unique_game_platform UNIQUE (ll_game_id, ll_platform_id) -- ✅ AMÉLIORATION: Évite les doublons
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
    CONSTRAINT unique_user_platform UNIQUE (ll_user_id, ll_platform_id) -- ✅ AMÉLIORATION: Évite les doublons
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
    CONSTRAINT unique_user_game UNIQUE (ll_user_id, ll_game_id) -- ✅ AMÉLIORATION: Évite les doublons
);

-- ============================================
-- Index pour améliorer les performances
-- ============================================

-- Index sur les tables de référence
-- Index pour ref_games
CREATE INDEX idx_ref_games_ll_name ON ref_games(ll_name); -- ✅ Optimise ORDER BY ll_name
CREATE INDEX idx_ref_games_flag_active ON ref_games(flag_active); -- ✅ Optimise les filtres sur les actifs/inactifs
CREATE INDEX idx_ref_games_ts_released ON ref_games(ts_released); -- ✅ Optimise les tris par date de sortie
CREATE INDEX idx_ref_games_ll_console_name ON ref_games(ll_console_name); -- ✅ Optimise les recherches par console

-- Index pour ref_platforms
CREATE INDEX idx_ref_platforms_ll_name ON ref_platforms(ll_name); -- ✅ Optimise ORDER BY ll_name
CREATE INDEX idx_ref_platforms_flag_active ON ref_platforms(flag_active); -- ✅ Optimise les filtres sur les actifs/inactifs

-- Index pour ref_users
CREATE INDEX idx_ref_users_flag_active ON ref_users(flag_active); -- ✅ Optimise les filtres sur les actifs/inactifs
-- Note: ll_email a déjà un index unique, pas besoin d'en créer un autre

-- Index pour ref_developers
CREATE INDEX idx_ref_developers_ll_name ON ref_developers(ll_name); -- ✅ Optimise les recherches par nom
CREATE INDEX idx_ref_developers_flag_active ON ref_developers(flag_active); -- ✅ Optimise les filtres sur les actifs/inactifs

-- Index sur les tables d'association (pour optimiser les JOIN)
-- Index pour assoc_games_developers
CREATE INDEX idx_assoc_games_developers_game_id ON assoc_games_developers(ll_game_id); -- ✅ Optimise les JOIN par jeu
CREATE INDEX idx_assoc_games_developers_developer_id ON assoc_games_developers(ll_developer_id); -- ✅ Optimise les JOIN par développeur

-- Index pour assoc_games_platforms
CREATE INDEX idx_assoc_games_platforms_game_id ON assoc_games_platforms(ll_game_id); -- ✅ Optimise les JOIN par jeu
CREATE INDEX idx_assoc_games_platforms_platform_id ON assoc_games_platforms(ll_platform_id); -- ✅ Optimise les JOIN par plateforme (utilisé dans getGamesByPlatform)

-- Index pour assoc_users_platforms
CREATE INDEX idx_assoc_users_platforms_user_id ON assoc_users_platforms(ll_user_id); -- ✅ Optimise les JOIN par utilisateur
CREATE INDEX idx_assoc_users_platforms_platform_id ON assoc_users_platforms(ll_platform_id); -- ✅ Optimise les JOIN par plateforme

-- Index pour assoc_users_games
CREATE INDEX idx_assoc_users_games_user_id ON assoc_users_games(ll_user_id); -- ✅ Optimise les JOIN par utilisateur
CREATE INDEX idx_assoc_users_games_game_id ON assoc_users_games(ll_game_id); -- ✅ Optimise les JOIN par jeu

-- Index composites pour optimiser les requêtes fréquentes
CREATE INDEX idx_assoc_games_platforms_composite ON assoc_games_platforms(ll_platform_id, ll_game_id); -- ✅ Optimise getGamesByPlatform
CREATE INDEX idx_assoc_users_games_composite ON assoc_users_games(ll_user_id, ll_game_id); -- ✅ Optimise les recherches de jeux par utilisateur


-- ============================================
-- Trigger pour mettre à jour automatiquement ts_updated_at
-- ============================================

-- Fonction pour mettre à jour ts_updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ts_updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers sur toutes les tables avec ts_updated_at
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

-- Triggers pour les tables d'association
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


