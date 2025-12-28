-- ============================================
-- MIGRATION : Ajout de ll_condition dans les tables wishlists
-- Remplacement de id_condition_state par ll_condition TEXT
-- ============================================
-- Ce script permet de :
-- 1. Ajouter ll_condition TEXT dans assoc_users_games_wishlists
-- 2. Remplacer id_condition_state par ll_condition dans assoc_users_platforms_wishlists
-- 3. Supprimer les anciennes clés étrangères et index
-- ============================================

BEGIN;

-- ============================================
-- ÉTAPE 1 : Modifier assoc_users_games_wishlists
-- ============================================

-- Supprimer la clé étrangère id_condition_state si elle existe (méthode simple)
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'assoc_users_games_wishlists'::regclass
        AND contype = 'f'
        AND EXISTS (
            SELECT 1
            FROM pg_attribute
            WHERE attrelid = conrelid
            AND attnum = ANY(conkey)
            AND attname = 'id_condition_state'
        )
    LOOP
        EXECUTE format('ALTER TABLE assoc_users_games_wishlists DROP CONSTRAINT %I', constraint_record.conname);
    END LOOP;
END $$;

-- Supprimer la colonne id_condition_state si elle existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'assoc_users_games_wishlists' 
               AND column_name = 'id_condition_state') THEN
        ALTER TABLE assoc_users_games_wishlists DROP COLUMN id_condition_state;
    END IF;
END $$;

-- Ajouter la colonne ll_condition (si elle n'existe pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'assoc_users_games_wishlists' 
                   AND column_name = 'll_condition') THEN
        ALTER TABLE assoc_users_games_wishlists ADD COLUMN ll_condition TEXT;
    END IF;
END $$;

-- Supprimer l'ancien index sur id_condition_state s'il existe
DROP INDEX IF EXISTS idx_assoc_users_games_wishlists_condition;

-- ============================================
-- ÉTAPE 2 : Modifier assoc_users_platforms_wishlists
-- ============================================

-- Supprimer la clé étrangère id_condition_state si elle existe (méthode simple)
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    FOR constraint_record IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'assoc_users_platforms_wishlists'::regclass
        AND contype = 'f'
        AND EXISTS (
            SELECT 1
            FROM pg_attribute
            WHERE attrelid = conrelid
            AND attnum = ANY(conkey)
            AND attname = 'id_condition_state'
        )
    LOOP
        EXECUTE format('ALTER TABLE assoc_users_platforms_wishlists DROP CONSTRAINT %I', constraint_record.conname);
    END LOOP;
END $$;

-- Supprimer la colonne id_condition_state si elle existe
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.columns 
               WHERE table_schema = 'public' 
               AND table_name = 'assoc_users_platforms_wishlists' 
               AND column_name = 'id_condition_state') THEN
        ALTER TABLE assoc_users_platforms_wishlists DROP COLUMN id_condition_state;
    END IF;
END $$;

-- Ajouter la colonne ll_condition (si elle n'existe pas)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'assoc_users_platforms_wishlists' 
                   AND column_name = 'll_condition') THEN
        ALTER TABLE assoc_users_platforms_wishlists ADD COLUMN ll_condition TEXT;
    END IF;
END $$;

-- Supprimer l'ancien index sur id_condition_state s'il existe
DROP INDEX IF EXISTS idx_assoc_users_platforms_wishlists_condition;

COMMIT;

-- ============================================
-- VÉRIFICATIONS
-- ============================================
-- Exécutez ces requêtes pour vérifier que la migration s'est bien passée :

-- Vérifier les colonnes de assoc_users_games_wishlists
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'assoc_users_games_wishlists' 
-- AND column_name IN ('ll_condition', 'id_condition_state')
-- ORDER BY column_name;

-- Vérifier les colonnes de assoc_users_platforms_wishlists
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'assoc_users_platforms_wishlists' 
-- AND column_name IN ('ll_condition', 'id_condition_state')
-- ORDER BY column_name;

-- Vérifier qu'il n'y a plus de contraintes sur id_condition_state dans les wishlists
-- SELECT conname, conrelid::regclass 
-- FROM pg_constraint 
-- WHERE conrelid::regclass::text LIKE '%wishlists%'
-- AND contype = 'f';
