export const addGameToWishlist = `
INSERT INTO
    assoc_users_games_wishlists (id_user, id_game, id_platform, nb_price_target, ll_notes, ts_added_at, id_priority, ll_condition)
VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id_user_game_wishlist AS id;
`;


export const getGamesFromWishlist = `
SELECT 
    augw.id_user_game_wishlist AS "wishlistId",
    rg.id_game AS "gameId",
    rg.ll_title AS title,
    rg.ll_cover_image AS "coverImage",
    rg.ll_cover_image_large AS "coverImageLarge",
    rg.ll_game_url AS "gameUrl",
    rp.id_platform AS "platformId",
    rp.ll_name AS platformName,
    augw.nb_price_target AS "priceTarget",
    augw.ll_priority AS priority,
    augw.ll_notes AS notes,
    augw.ts_added_at AS addedAt
FROM assoc_users_games_wishlists AS augw
INNER JOIN ref_games AS rg ON rg.id_game = augw.id_game
INNER JOIN ref_platforms AS rp ON rp.id_platform = augw.id_platform
WHERE augw.flag_active = TRUE
AND augw.id_user = $1
AND augw.id_platform = $2
ORDER BY augw.ll_priority ASC, rg.ll_title ASC, rp.ll_name ASC;
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