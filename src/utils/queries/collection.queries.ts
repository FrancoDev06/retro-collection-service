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
 * @param $4 ll_notes - Notes personnelles sur le jeu
 * @param $5 nb_price_paid - Prix payé pour le jeu
 * @param $6 ts_acquired_at - Date d'acquisition
 * @param $7 flag_has_cart - Indique si l'utilisateur possède le jeu lui-même
 * @param $8 flag_has_box - Indique si l'utilisateur possède la boîte
 * @param $9 flag_has_notice - Indique si l'utilisateur possède la notice
 * @param $10 ll_cart_condition_id - ID de l'état de condition de la cartouche
 * @param $11 ll_box_condition_id - ID de l'état de condition de la boîte
 * @param $12 ll_notice_condition_id - ID de l'état de condition de la notice
 * @returns L'ID de l'enregistrement créé
 */
export const addGameToCollection = `
INSERT INTO
    assoc_users_games_collections (
        ll_user_id,
        ll_game_id,
        ll_platform_id,
        ll_notes,
        nb_price_paid,
        ts_acquired_at,
        flag_has_cart,
        flag_has_box,
        flag_has_notice,
        ll_cart_condition_id,
        ll_box_condition_id,
        ll_notice_condition_id
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
        $12
    )
RETURNING
    id;
`;

/**
 * REQUÊTE SQL : Supprime un jeu de la collection d'un utilisateur
 * 
 * @see CollectionService.deleteGameFromCollection() - Fonction service qui utilise cette requête
 * @see POST /collection/:userId/game/delete - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_game_id - ID du jeu
 * @param $3 ll_platform_id - ID de la plateforme
 * @returns L'ID de l'enregistrement supprimé
 */
export const deleteGameFromCollection = `
UPDATE
    assoc_users_games_collections
SET
    flag_active = FALSE
WHERE
    ll_user_id = $1
    AND ll_game_id = $2
    AND ll_platform_id = $3
    AND flag_active = TRUE
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
 * REQUÊTE SQL : Récupère la liste des jeux dans la collection d'un utilisateur pour une plateforme spécifique
 * 
 * @see CollectionService.getGamesListByPlatformId() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/platforms/:platformId/games/list - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @param $2 ll_platform_id - ID de la plateforme
 * @returns La liste des jeux dans la collection active de l'utilisateur pour la plateforme spécifique
 */
export const getGamesListByPlatformId = `
    SELECT
        rg.id,
        rg.ll_title as title,
        rg.ll_cover_image as cover_image,
        rg.ll_cover_image_large as cover_image_large,
        rg.ll_game_url as game_url,
        rp.ll_name as platform_name,
        rg.ll_product_id as product_id,
        rg.ll_publisher as publisher,
        rg.ll_developer as developer,
        rg.ll_description as description,
        augc.ll_notes as notes,
        augc.nb_price_paid as price_paid,
        augc.ts_acquired_at as acquired_at,
        augc.flag_has_box as has_box,
        augc.flag_has_notice as has_notice,
        augc.ll_cart_condition_id as cart_condition_id,
        augc.ll_box_condition_id as box_condition_id,
        augc.ll_notice_condition_id as notice_condition_id,
        augc.flag_has_cart as has_cart
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