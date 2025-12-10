/**
 * REQUÊTE SQL : Récupère tous les états de condition disponibles pour les boîtes de jeux
 * 
 * @see CollectionService.getConditionsBoxed() - Fonction service qui utilise cette requête
 * @see GET /collection/conditions/box - Route API qui expose cette fonctionnalité
 * 
 * @returns Tous les enregistrements actifs de la table ref_condition_states où le type d'élément est 'box'
 */
export const getConditionsBoxed = `
SELECT
    *
FROM
    ref_condition_states
WHERE
    ll_element_type = 'box'
    AND flag_active = TRUE;
`;

/**
 * REQUÊTE SQL : Récupère tous les états de condition disponibles pour les cartouches de jeux
 * 
 * @see CollectionService.getConditionsCart() - Fonction service qui utilise cette requête
 * @see GET /collection/conditions/cart - Route API qui expose cette fonctionnalité
 * 
 * @returns Tous les enregistrements actifs de la table ref_condition_states où le type d'élément est 'cart'
 */
export const getConditionsCart = `
SELECT
    *
FROM
    ref_condition_states
WHERE
    ll_element_type = 'cart'
    AND flag_active = TRUE;
`;

/**
 * REQUÊTE SQL : Récupère tous les états de condition disponibles pour les notices/manuels de jeux
 * 
 * @see CollectionService.getConditionsManual() - Fonction service qui utilise cette requête
 * @see GET /collection/conditions/manual - Route API qui expose cette fonctionnalité
 * 
 * @returns Tous les enregistrements actifs de la table ref_condition_states où le type d'élément est 'manual'
 */
export const getConditionsManual = `
SELECT
	*
FROM
	ref_condition_states
WHERE
	ll_element_type = 'manual'
	AND flag_active = TRUE;
`;

/**
 * REQUÊTE SQL : Ajoute un jeu à la collection d'un utilisateur
 * 
 * @see CollectionService.addGameToCollection() - Fonction service qui utilise cette requête
 * @see POST /collection/new - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_game_id - ID du jeu
 * @param $3 ll_platform_id - ID de la plateforme
 * @param $4 ll_status - Statut du jeu (ex: 'owned', 'wanted', etc.)
 * @param $5 ll_edition - Édition du jeu
 * @param $6 ll_format - Format du jeu (ex: 'physical', 'digital')
 * @param $7 ll_notes - Notes personnelles sur le jeu
 * @param $8 nb_price_paid - Prix payé pour le jeu
 * @param $9 ts_acquired_at - Date d'acquisition
 * @param $10 flag_has_game - Indique si l'utilisateur possède le jeu lui-même
 * @param $11 flag_has_box - Indique si l'utilisateur possède la boîte
 * @param $12 flag_has_notice - Indique si l'utilisateur possède la notice
 * @param $14 ll_cart_condition_id - ID de l'état de condition de la cartouche
 * @param $15 ll_box_condition_id - ID de l'état de condition de la boîte
 * @param $16 ll_notice_condition_id - ID de l'état de condition de la notice
 * @returns L'ID de l'enregistrement créé
 */
export const addGameToCollection = `
INSERT INTO
    assoc_users_games_collections (
        ll_user_id,
        ll_game_id,
        ll_platform_id,
        ll_status,
        ll_edition,
        ll_format,
        ll_notes,
        nb_price_paid,
        ts_acquired_at,
        flag_has_game,
        flag_has_box,
        flag_has_notice,
        ll_cart_condition_id,
        ll_box_condition_id,
        ll_notice_condition_id,
    )
VALUES
    (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15
    )
RETURNING
    id;
`;

/**
 * REQUÊTE SQL : Vérifie si un jeu spécifique existe déjà dans la collection d'un utilisateur
 * 
 * @see CollectionService.checkGameExistsInCollection() - Fonction service qui utilise cette requête
 * @see POST /collection/new - Route API qui utilise cette vérification avant d'ajouter un jeu
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_game_id - ID du jeu
 * @param $3 ll_platform_id - ID de la plateforme
 * @returns Un booléen indiquant si le jeu existe (true) ou non (false) dans la collection active de l'utilisateur
 */
export const checkGameExistsInCollection = `
SELECT
    EXISTS(
        SELECT
            1
        FROM
            assoc_users_games_collections
        WHERE
            flag_active = TRUE
            AND ll_user_id = $1
            AND ll_game_id = $2
            AND ll_platform_id = $3
        ) AS exists;
`;

/**
 * REQUÊTE SQL : Vérifie si une plateforme spécifique existe déjà dans la collection d'un utilisateur
 * 
 * @see CollectionService.checkPlatformExistsInCollection() - Fonction service qui utilise cette requête
 * @see POST /collection/new - Route API qui utilise cette vérification avant d'ajouter un jeu
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_platform_id - ID de la plateforme
 * @returns Un booléen indiquant si la plateforme existe (true) ou non (false) dans la collection active de l'utilisateur
 */
export const checkPlatformExistsInCollection = `
SELECT
    EXISTS(
        SELECT
            1
        FROM
            assoc_users_platforms
        WHERE
            flag_active = TRUE
            AND ll_user_id = $1
            AND ll_platform_id = $2
        ) AS exists;
`;

/**
 * REQUÊTE SQL : Ajoute une plateforme à la collection d'un utilisateur
 * 
 * @see CollectionService.addPlatformToCollection() - Fonction service qui utilise cette requête
 * @note Cette fonctionnalité n'est pas encore exposée via une route API
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_platform_id - ID de la plateforme
 * @param $3 nb_units - Nombre d'unités de la plateforme
 * @param $4 ll_condition_id - ID de l'état de condition de la plateforme
 * @param $5 ll_purchase_source - Source d'achat de la plateforme
 * @param $6 nb_price_paid - Prix payé pour la plateforme
 * @param $7 ts_acquired_at - Date d'acquisition
 * @param $8 ll_notes - Notes personnelles sur la plateforme
 * @returns L'ID de l'enregistrement créé
 */
export const addPlatformToCollection = `
INSERT INTO
    assoc_users_platforms (
        ll_user_id,
        ll_platform_id,
        nb_units,
        ll_condition_id,
        ll_purchase_source,
        nb_price_paid,
        ts_acquired_at,
        ll_notes
    )
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING
    id;
`;






/**
 * REQUÊTE SQL : Récupère la liste des plateformes uniques présentes dans la collection de jeux d'un utilisateur
 * 
 * @see CollectionService.getPlatformList() - Fonction service commentée (non utilisée actuellement)
 * @note Cette fonctionnalité n'est pas encore exposée via une route API
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns Liste des plateformes (ID et nom) avec au moins un jeu dans la collection active de l'utilisateur
 */
export const getPlatformList = `
SELECT
    rp.id AS platform_id,
    rp.ll_name AS platform_name,
    COUNT(augc.id) AS games_count,
    COALESCE(SUM(augc.nb_price_paid), 0) AS total_value
FROM
    assoc_users_games_collections AS augc
INNER JOIN ref_platforms AS rp
    ON augc.ll_platform_id = rp.id
WHERE
    augc.flag_active = TRUE
    AND augc.ll_user_id = $1
    AND rp.flag_active = TRUE
GROUP BY
    rp.id,
    rp.ll_name
ORDER BY
    rp.ll_name ASC;


`;

/**
 * REQUÊTE SQL : Compte le nombre total de plateformes uniques dans la collection de jeux d'un utilisateur
 * 
 * @see CollectionService.getPlatformsCount() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/platforms/count - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns Le nombre total de plateformes distinctes dans la collection active de l'utilisateur
 */
export const getPlatformsCount = `
SELECT
    COUNT(DISTINCT ll_platform_id) AS total_unique_platforms
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

/**
 * REQUÊTE SQL : Compte le nombre total de jeux dans la collection d'un utilisateur
 * 
 * @see CollectionService.getGamesCount() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/games/count - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns Le nombre total de jeux dans la collection active de l'utilisateur
 */
export const getGamesCount = `
SELECT
    COUNT(*) AS total
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

/**
 * REQUÊTE SQL : Calcule la valeur totale payée pour tous les jeux de la collection d'un utilisateur
 * 
 * @see CollectionService.getGamesValue() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/games/value - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns La somme totale des prix payés pour tous les jeux dans la collection active de l'utilisateur
 */
export const getGamesValue = `
SELECT
    SUM(nb_price_paid) AS total_value_paid
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

/**
 * REQUÊTE SQL : Compte le nombre de jeux CIB (Complete In Box) dans la collection d'un utilisateur
 * Un jeu CIB doit avoir le statut 'owned' et posséder la boîte, la notice et le jeu
 * 
 * @see CollectionService.getGamesCibCount() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/games/cib - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns Le nombre total de jeux CIB (complets avec boîte, notice et jeu) dans la collection active de l'utilisateur
 */
export const getGamesCibCount = `
SELECT
    COUNT(*) AS total_cib_games FROM assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1
    AND ll_status = 'owned'
    AND flag_has_box = TRUE
    AND flag_has_notice = TRUE
    AND flag_has_game = TRUE
`;


export const getGamesCountByPlatformId = `
SELECT
    COUNT(*) AS total
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1
    AND ll_platform_id = $2;
`;

export const getGamesListByPlatformId = `
    SELECT
        rg.id,
        rg.ll_slug,
        rg.ll_title,
        rg.ll_cover_image,
        rg.ll_game_url,
        rp.ll_name AS platform_name,
        augc.ll_status,
        augc.ll_edition,
        augc.ll_format,
        augc.ll_notes,
        augc.nb_price_paid,
        augc.ts_acquired_at,
        augc.flag_has_box,
        augc.flag_has_notice,
        augc.ll_cart_condition_id,
        augc.ll_box_condition_id,
        augc.ll_notice_condition_id,
        augc.flag_has_game
    FROM
        assoc_users_games_collections AS augc
    INNER JOIN ref_platforms AS rp ON rp.id = augc.ll_platform_id
    INNER JOIN ref_games AS rg ON rg.id = augc.ll_game_id
    WHERE
        augc.flag_active = TRUE
        AND augc.ll_user_id = $1
        AND augc.ll_platform_id = $2
    ORDER BY
        rg.ll_title ASC;
`;