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
SELECT *
FROM assoc_users_games_wishlists
WHERE ll_user_id = $1
AND flag_active = TRUE;
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

export const getGamesFromWishlistByPlatformId = `
SELECT *
FROM assoc_users_games_wishlists
WHERE ll_user_id = $1
AND ll_platform_id = $2
AND flag_active = TRUE;
`;