export const getGamesStatusBoxed = `
SELECT
    *
FROM
    ref_condition_states
WHERE
    ll_element_type = 'box'
    AND flag_active = TRUE;
`;

export const getGameStatusCart = `
SELECT
    *
FROM
    ref_condition_states
WHERE
    ll_element_type = 'cart'
    AND flag_active = TRUE;
`;

export const getGameStatusManual = `
SELECT
	*
FROM
	ref_condition_states
WHERE
	ll_element_type = 'manual'
	AND flag_active = TRUE;
`;

export const getGameStatusInserts = `
SELECT
    *
FROM
    ref_condition_states
WHERE
    ll_element_type = 'inserts'
    AND flag_active = TRUE;
`;

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
        flag_has_box,
        flag_has_notice,
        flag_has_inserts,
        ll_cart_condition_id,
        ll_box_condition_id,
        ll_notice_condition_id,
        ll_inserts_condition_id,
        flag_has_game
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
        $15,
        $16,
        $17
    )
RETURNING
    id;
`;

export const getUserPlatformsCollection = `
SELECT
    augc.ll_platform_id,
    rp.ll_name
FROM
    assoc_users_games_collections AS augc
INNER JOIN ref_platforms AS rp
    ON augc.ll_platform_id = rp.id
WHERE
    augc.flag_active = TRUE
    AND augc.ll_user_id = $1
GROUP BY
    augc.ll_platform_id,
    rp.ll_name


`;

export const getUserPlatformsCollectionCount = `
SELECT
    COUNT(DISTINCT ll_platform_id) AS total_unique_platforms
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

export const getUserGamesCount = `
SELECT
    COUNT(*) AS total
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

export const getUserGamesValue = `
SELECT
    SUM(nb_price_paid) AS total
FROM
    assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1;
`;

export const getUserGamesCib = `
SELECT
    SUM(nb_price_paid) AS total FROM assoc_users_games_collections
WHERE
    flag_active = TRUE
    AND ll_user_id = $1
    AND ll_price_type = 'cib';
`;