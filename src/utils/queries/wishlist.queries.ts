export const addGameToWishlist = `
INSERT INTO
    assoc_users_games_wishlists (ll_user_id, ll_game_id, ll_platform_id, ll_notes, nb_price_target, ll_priority, ll_retailer_link)
VALUES
    ($1, $2, $3, $4, $5, $6, $7)
RETURNING id;
`;

export const checkGameExistsInWishlist = `
SELECT
    EXISTS(
        SELECT
            1
        FROM
            assoc_users_games_wishlists
        WHERE
            flag_active = TRUE
            AND ll_user_id = $1
            AND ll_game_id = $2
            AND ll_platform_id = $3
        ) AS exists;
`;

export const getGamesFromWishlist = `
SELECT 
    augw.id,
    rg.id as game_id,
    rg.ll_title as title,
    rg.ll_cover_image as cover_image,
    rg.ll_cover_image_large as cover_image_large,
    rg.ll_game_url as game_url,
    rp.id as platform_id,
    rp.ll_name as platform_name,
    augw.nb_price_target as price_target,
    augw.ll_priority as priority,
    augw.ll_notes as notes,
    augw.ll_retailer_link as retailer_link,
    augw.ts_added_at as added_at
FROM assoc_users_games_wishlists AS augw
INNER JOIN ref_games AS rg ON rg.id = augw.ll_game_id
INNER JOIN ref_platforms AS rp ON rp.id = augw.ll_platform_id
WHERE augw.flag_active = TRUE
AND ll_user_id = $1
AND ll_platform_id = $2
ORDER BY augw.ll_priority ASC, rg.ll_title ASC, rp.ll_name ASC;
`;

export const deleteGameFromWishlist = `
UPDATE assoc_users_games_wishlists
SET flag_active = FALSE
WHERE ll_user_id = $1
AND ll_game_id = $2
AND ll_platform_id = $3
AND flag_active = TRUE
RETURNING id;
`;

export const getWishlistPlatforms= `
SELECT
    rp.id AS platform_id,
    rp.ll_name AS platform_name,
    COALESCE(SUM(augw.nb_price_target), 0) AS total_value
FROM
    assoc_users_games_wishlists AS augw
INNER JOIN ref_platforms AS rp
    ON augw.ll_platform_id = rp.id
WHERE
    augw.flag_active = TRUE
    AND augw.ll_user_id = $1
    AND rp.flag_active = TRUE
GROUP BY
    rp.id,
    rp.ll_name
ORDER BY
    rp.ll_name ASC;
`;

export const getWishlistPlatformGame = `
SELECT
    augw.id,
    rg.id as game_id,
    rg.ll_title as title,
    rg.ll_cover_image as cover_image,
    rg.ll_cover_image_large as cover_image_large,
    rg.ll_game_url as game_url,
    rp.id as platform_id,
    rp.ll_name as platform_name,
    augw.nb_price_target as price_target,
    augw.ll_priority as priority,
    augw.ll_notes as notes,
    augw.ll_retailer_link as retailer_link,
    augw.ts_added_at as added_at
FROM
    assoc_users_games_wishlists AS augw
INNER JOIN ref_games AS rg ON rg.id = augw.ll_game_id
INNER JOIN ref_platforms AS rp ON rp.id = augw.ll_platform_id
WHERE augw.flag_active = TRUE
AND augw.ll_user_id = $1
AND augw.ll_game_id = $2
AND augw.ll_platform_id = $3;
`;