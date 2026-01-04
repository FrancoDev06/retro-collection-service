export const getGamesValueCount = `
SELECT
    SUM(augc.nb_price_paid) AS "gamesValueCount"
FROM
    assoc_users_games_collections AS augc
WHERE
    augc.flag_active = TRUE
    AND augc.id_user = $1
`;

export const getGamesCount = `
SELECT
    COUNT(augc.id_user_game_collection) AS "gamesCount"
FROM
    assoc_users_games_collections AS augc
WHERE
    augc.flag_active = TRUE
    AND augc.id_user = $1
`;


export const getPlatformsCount = `
SELECT
    COUNT(augp.id_user_platform_collection) AS "platformsCount"
FROM
    assoc_users_platforms_collections AS augp
WHERE
    augp.flag_active = TRUE
    AND augp.id_user = $1
`;

export const getGamesCibCount = `
SELECT
    COUNT(augc.id_user_game_collection) AS "gamesCibCount"
FROM
    assoc_users_games_collections AS augc
WHERE
    augc.flag_active = TRUE
    AND augc.id_user = $1
    AND augc.flag_has_cart = TRUE
    AND augc.flag_has_box = TRUE
    AND augc.flag_has_notice = TRUE
`;  