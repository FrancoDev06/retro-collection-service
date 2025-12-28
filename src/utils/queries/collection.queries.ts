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
        id_user,
        id_game,
        id_platform,
        ll_notes,
        nb_price_paid,
        ts_acquired_at,
        flag_has_cart,
        flag_has_box,
        flag_has_notice,
        id_cart_condition,
        id_box_condition,
        id_notice_condition
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
    id_user_game_collection AS id;
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
    id_user = $1
    AND id_game = $2
    AND id_platform = $3
    AND flag_active = TRUE
RETURNING
    id_user_game_collection AS id;
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
    rp.id_platform AS "platformId",
    rp.ll_name AS "platformName",
    COUNT(augc.id_user_game_collection) AS "gamesCount",
    COALESCE(SUM(augc.nb_price_paid), 0) AS "totalValue"
FROM
    assoc_users_games_collections AS augc
INNER JOIN ref_platforms AS rp
    ON augc.id_platform = rp.id_platform
WHERE
    augc.flag_active = TRUE
    AND augc.id_user = $1
    AND rp.flag_active = TRUE
GROUP BY
    rp.id_platform,
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
        rg.id_game AS "gameId",
        rg.ll_title AS title,
        rg.ll_cover_image AS "coverImage",
        rg.ll_cover_image_large AS "coverImageLarge",
        rg.ll_game_url AS "gameUrl",
        rp.ll_name AS "platformName",
        rg.ll_product_id AS "productId",
        rg.ll_publisher AS publisher,
        rg.ll_developer AS developer,
        rg.ll_description AS description,
        augc.ll_notes AS notes,
        augc.nb_price_paid AS "pricePaid",
        augc.ts_acquired_at AS "acquiredAt",
        augc.flag_has_box AS "hasBox",
        augc.flag_has_notice AS "hasNotice",
        augc.id_cart_condition AS "cartConditionId",
        rcs_cart.ll_code AS "cartConditionCode",
        rcs_cart.ll_label AS "cartConditionLabel",
        rcs_cart.ll_description AS "cartConditionDescription",
        rcs_cart.nb_rating AS "cartConditionRating",
        augc.id_box_condition AS "boxConditionId",
        rcs_box.ll_code AS "boxConditionCode",
        rcs_box.ll_label AS "boxConditionLabel",
        rcs_box.ll_description AS "boxConditionDescription",
        rcs_box.nb_rating AS "boxConditionRating",
        augc.id_notice_condition AS "noticeConditionId",
        rcs_notice.ll_code AS "noticeConditionCode",
        rcs_notice.ll_label AS "noticeConditionLabel",
        rcs_notice.ll_description AS "noticeConditionDescription",
        rcs_notice.nb_rating AS "noticeConditionRating",
        augc.flag_has_cart AS "hasCart"
    FROM
        assoc_users_games_collections AS augc
    INNER JOIN ref_platforms AS rp ON rp.id_platform = augc.id_platform
    INNER JOIN ref_games AS rg ON rg.id_game = augc.id_game
    LEFT JOIN ref_condition_states AS rcs_cart ON rcs_cart.id_condition_state = augc.id_cart_condition
    LEFT JOIN ref_condition_states AS rcs_box ON rcs_box.id_condition_state = augc.id_box_condition
    LEFT JOIN ref_condition_states AS rcs_notice ON rcs_notice.id_condition_state = augc.id_notice_condition
    WHERE
        augc.flag_active = TRUE
        AND augc.id_user = $1
        AND augc.id_platform = $2
    ORDER BY
        rg.ll_title ASC;
`;


/**
 * REQUÊTE SQL : Récupère la liste des plateformes dans la collection d'un utilisateur
 * 
 * @see CollectionService.getCollectionPlatformList() - Fonction service qui utilise cette requête
 * @see GET /collection/:userId/platforms/list - Route API qui expose cette fonctionnalité
 * 
 * @param $1 ll_user_id - ID de l'utilisateur
 * @returns La liste des plateformes dans la collection active de l'utilisateur
 */
export const getCollectionPlatformList = `
    SELECT
        augp.id_user AS "userId",
        augp.id_platform AS "platformId",
        rp.ll_name AS "platformName",
        augp.nb_units AS "units",
        augp.id_condition_state AS "conditionStateId",
        augp.ll_purchase_source AS "purchaseSource",
        augp.nb_price_paid AS "pricePaid",
        augp.ts_acquired_at AS "acquiredAt",
        augp.ll_notes AS "notes"
    FROM
        assoc_users_platforms_collections AS augp
    INNER JOIN ref_platforms AS rp ON rp.id_platform = augp.id_platform
    WHERE
        augp.flag_active = TRUE
        AND augp.id_user = $1
    ORDER BY
        augp.ts_acquired_at ASC;
`;

export const getCollectionPlatformListOwned = `
SELECT
    augp.id_user AS "userId",
    augp.id_platform AS "platformId",
    rp.ll_name AS "platformName",
    augp.nb_units AS "units",
    rcs.ll_label AS "conditionStateLabel",
    rcs.ll_description AS "conditionStateDescription",
    rcs.nb_rating AS "conditionStateRating",
    augp.ll_purchase_source AS "purchaseSource",
    augp.nb_price_paid AS "pricePaid",
    augp.ts_acquired_at AS "acquiredAt",
    augp.ll_notes AS "notes"
FROM
    assoc_users_platforms_collections AS augp
    INNER JOIN ref_platforms AS rp ON rp.id_platform = augp.id_platform
    INNER JOIN ref_condition_states AS rcs ON rcs.id_condition_state = augp.id_condition_state
WHERE
    augp.flag_active = TRUE
    AND augp.id_user = $1
ORDER BY
    rp.ll_name ASC;
`;

export const addPlatformToCollection = `
INSERT INTO
    assoc_users_platforms_collections (
        id_user,
        id_platform,
        nb_units,
        id_condition_state,
        ll_purchase_source,
        nb_price_paid,
        ts_acquired_at,
        ll_notes
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
        $8
    )
RETURNING
    id_user_platform_collection AS id;
`;