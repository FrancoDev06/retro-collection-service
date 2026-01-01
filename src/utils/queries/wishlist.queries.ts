export const addGameToWishlist = `
INSERT INTO
    assoc_users_games_wishlists (id_user, id_game, id_platform, nb_price_target, ll_notes, ts_added_at, id_priority, ll_condition)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id_user_game_wishlist AS id;
`;


export const getGamesFromWishlist = `
SELECT 
    augw.id_user AS "userId",
    augw.id_game AS "gameId",
    rg.ll_title AS "title",
    rg.ll_cover_image AS "coverImage",
    rg.ll_cover_image_large AS "coverImageLarge",
    rg.ll_game_url AS "gameUrl",
    rp.ll_name AS "platformName",
    rr.ll_label AS "regionLabel",
    augw.nb_price_target AS "priceTarget",
    augw.ll_notes AS "notes",
    augw.ts_added_at AS "addedAt",
    augw.id_priority AS "priorityId",
    rprio.ll_label AS "priorityLabel",
    augw.ll_condition AS "condition"
FROM assoc_users_games_wishlists AS augw
INNER JOIN ref_priorities AS rprio ON rprio.id_priority = augw.id_priority
INNER JOIN ref_games AS rg  ON rg.id_game = augw.id_game
INNER JOIN ref_platforms AS rp ON rp.id_platform = augw.id_platform
INNER JOIN ref_regions AS rr on rr.id_region = rp.id_region

WHERE augw.flag_active = TRUE
    AND augw.id_user = $1
    AND augw.id_platform = $2
ORDER BY rprio.nb_order ASC, rg.ll_title ASC, rp.ll_name ASC;
`;

export const deleteGameFromWishlist = `
UPDATE assoc_users_games_wishlists
SET flag_active = FALSE
WHERE id_user = $1
AND id_game = $2
AND id_platform = $3
AND flag_active = TRUE
RETURNING id_user_game_wishlist AS id;
`;

export const getWishlistPlatforms = `
SELECT
    rp.id_platform AS "platformId",
    rp.ll_name AS "platformName",
    COALESCE(SUM(augw.nb_price_target), 0) AS "totalValue",
    COUNT(augw.id_user_game_wishlist) AS "gamesCount"
FROM
    assoc_users_games_wishlists AS augw
INNER JOIN ref_platforms AS rp
    ON augw.id_platform = rp.id_platform
WHERE
    augw.flag_active = TRUE
    AND augw.id_user = $1
    AND rp.flag_active = TRUE
GROUP BY
    rp.id_platform,
    rp.ll_name
ORDER BY
    rp.ll_name ASC;
`;

export const getWishlistPlatformGame = `
SELECT
    augw.id_user_game_wishlist AS "wishlistId",
    rg.id_game AS "gameId",
    rg.ll_title AS title,
    rg.ll_cover_image AS "coverImage",
    rg.ll_cover_image_large AS "coverImageLarge",
    rg.ll_game_url AS "gameUrl",
    rp.id_platform AS "platformId",
    rp.ll_name AS "platformName",
    augw.nb_price_target AS "priceTarget",
    augw.ll_priority AS priority,
    augw.ll_notes AS notes,
    augw.ts_added_at AS addedAt
FROM
    assoc_users_games_wishlists AS augw
INNER JOIN ref_games AS rg ON rg.id_game = augw.id_game
INNER JOIN ref_platforms AS rp ON rp.id_platform = augw.id_platform
WHERE augw.flag_active = TRUE
AND augw.id_user = $1
AND augw.id_game = $2
AND augw.id_platform = $3;
`;

export const getPriorities = `
SELECT
    id_priority AS "priorityId",
    ll_code AS "code",
    ll_label AS "label",
    nb_order AS "order",
    ll_description AS "description"
FROM ref_priorities
ORDER BY nb_order ASC;
`;

export const getGamesList = `
    SELECT
        augw.id_user AS "userId",
        augw.id_game AS "gameId",
        augw.id_platform AS "platformId",
        augw.nb_price_target AS "priceTarget",
        augw.ll_notes AS "notes",
        augw.ts_added_at AS "addedAt",
        augw.flag_active AS "active",
        augw.ll_condition AS "condition",
        augw.id_priority AS "priority",
        rprio.ll_label AS "priorityLabel",
        rprio.ll_description AS "priorityDescription",
        rprio.nb_order AS "priorityOrder",
        rg.ll_cover_image_large AS "coverImageLarge",
        rg.ll_title AS "title",
        rg.ll_game_url AS "gameUrl",
        rg.id_region AS "regionId",
        rr.ll_code AS "regionCode",
        rr.ll_label AS "regionLabel",
        rp.ll_name AS "platformName"
    FROM
        assoc_users_games_wishlists AS augw
    INNER JOIN ref_games AS rg ON rg.id_game = augw.id_game
    INNER JOIN ref_platforms AS rp ON rp.id_platform = augw.id_platform
    LEFT JOIN ref_regions AS rr ON rr.id_region = rg.id_region
    LEFT JOIN ref_priorities AS rprio ON rprio.id_priority = augw.id_priority
    WHERE
        augw.flag_active = TRUE
        AND augw.id_user = $1
    ORDER BY
        rprio.nb_order ASC, rg.ll_title ASC, rp.ll_name ASC;
`;

export const addPlatformToWishlist = `
INSERT INTO
    assoc_users_platforms_wishlists (id_user, id_platform, nb_price_target, ll_notes, ts_added_at, id_priority, ll_condition)
VALUES
    ($1, $2, $3, $4, $5, $6, $7)
RETURNING id_user_platform_wishlist AS id;
`;

export const getPlatformsFromWishlist = `

SELECT
    augp.id_user_platform_wishlist AS "wishlistId",
    augp.id_platform AS "platformId",
    augp.id_priority AS "priorityId",
    rprio.ll_label AS "priorityLabel",
    augp.ll_condition AS "condition",
    rp.ll_name AS "platformName",
    rr.ll_label AS "regionLabel",
    rr.ll_code AS "regionCode",
    augp.nb_price_target AS "priceTarget",
    augp.ll_notes AS "notes",
    augp.ts_added_at AS "addedAt"
FROM
    assoc_users_platforms_wishlists AS augp
    INNER JOIN ref_platforms AS rp ON rp.id_platform = augp.id_platform
    INNER JOIN ref_priorities AS rprio ON rprio.id_priority = augp.id_priority
    LEFT JOIN ref_regions AS rr ON rr.id_region = rp.id_region
WHERE
    augp.flag_active = TRUE
    AND augp.id_user = $1
ORDER BY
    rprio.nb_order ASC,
    rp.ll_name ASC,
    rr.ll_label ASC;
`;