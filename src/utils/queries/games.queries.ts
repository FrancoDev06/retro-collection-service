export const getGames = `
SELECT
	rg.id,
	rg.ll_title as title,
	rg.ll_cover_image as cover_image,
	rg.ll_cover_image_large as cover_image_large,
	rg.ts_released as released,
	STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name) as genre_name,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id = agp.ll_game_id
INNER JOIN ref_platforms as rp ON agp.ll_platform_id = rp.id
INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rge.flag_active = TRUE
	AND agg.flag_active = TRUE
GROUP BY rg.id, rg.ll_title, rg.ll_cover_image, rg.ll_cover_image_large, rg.ts_released, rp.id, rp.ll_name
ORDER BY rg.ll_title ASC;
`;

export const getGame = `
SELECT
	rg.id,
	rg.ll_slug as slug,
	rg.ll_title as title,
	rg.ll_cover_image as cover_image,
	rg.ll_cover_image_large as cover_image_large,
	rg.ll_game_url as game_url,
	rg.ll_product_id as product_id,
	rg.ll_publisher as publisher,
	rg.ll_developer as developer,
	rg.ll_description as description,
	rg.ts_released as released,
	STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name) as genre_name,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id = agp.ll_game_id
INNER JOIN ref_platforms as rp ON agp.ll_platform_id = rp.id
INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rge.flag_active = TRUE
	AND agg.flag_active = TRUE
	AND rg.id = $1
GROUP BY rg.id, rg.ll_title, rg.ll_cover_image, rg.ll_cover_image_large, rg.ts_released, rp.id, rp.ll_name
ORDER BY rg.ll_title ASC;
`;

export const getGamesLimited = `
SELECT
	rg.id,
	rg.ll_title as title,
	rg.ll_cover_image as cover_image,
	rg.ll_cover_image_large as cover_image_large,
	rg.ts_released as released,
	STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name) as genre_name,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id = agp.ll_game_id
INNER JOIN ref_platforms as rp ON agp.ll_platform_id = rp.id
INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rge.flag_active = TRUE
	AND agg.flag_active = TRUE
GROUP BY rg.id, rg.ll_title, rg.ll_cover_image, rg.ll_cover_image_large, rg.ts_released, rp.id, rp.ll_name
ORDER BY rg.ll_title ASC
LIMIT $1 OFFSET $2;
`;



export const getGamesCount = `
SELECT
    COUNT(*) AS count
FROM
    ref_games AS rg
WHERE
    rg.flag_active = TRUE;
`;


export const getGamesLimitedByPlatformId = `
SELECT
	rg.id,
	rg.ll_title as title,
	rg.ll_cover_image as cover_image,
	rg.ll_cover_image_large as cover_image_large,
	rg.ts_released as released,
	STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name) as genre_name,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
	ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.ll_game_id = rg.id
INNER JOIN ref_platforms AS rp ON agp.ll_platform_id = rp.id
INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE rp.id = $1
	AND rg.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agg.flag_active = TRUE
	AND rge.flag_active = TRUE
GROUP BY rg.id, rg.ll_title, rg.ll_cover_image, rg.ll_cover_image_large, rg.ts_released, rp.id, rp.ll_name
ORDER BY rg.ll_title ASC
LIMIT $2 OFFSET $3
`;


export const getGamesCountByPlatformId = `
SELECT COUNT(*) AS count FROM assoc_games_platforms WHERE ll_platform_id = $1 AND flag_active = TRUE;
`;

export const getGamesSearch = `
SELECT
	rg.id,
	rg.ll_title as title,
	rg.ll_cover_image as cover_image,
	rg.ll_cover_image_large as cover_image_large,
	rg.ts_released as released,
	STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name) as genre_name,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.ll_game_id = rg.id
INNER JOIN ref_platforms AS rp ON agp.ll_platform_id = rp.id
INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE
    rg.ll_title ILIKE '%' || $1 || '%'
    AND rg.flag_active = TRUE
    AND agp.flag_active = TRUE
    AND rp.flag_active = TRUE
    AND agg.flag_active = TRUE
    AND rge.flag_active = TRUE
GROUP BY rg.id, rg.ll_title, rg.ll_cover_image, rg.ll_cover_image_large, rg.ts_released, rp.id, rp.ll_name
ORDER BY
    rg.ll_title ASC
LIMIT $2 OFFSET $3;
`;

export const getGamesSearchCount = `
SELECT COUNT(*) AS count FROM ref_games WHERE ll_title ILIKE '%' || $1 || '%' AND flag_active = TRUE;
`;

export const getGamePrices = `
SELECT
	rmp.id,
	rmp.ll_game_id as game_id,
	rmp.ll_platform_id as platform_id,
	rmp.ll_price_type as price_type,
	rmp.nb_price_retail as price_retail,
	rmp.nb_price_change as price_change,
	rmp.nb_price_change_percent as price_change_percent,
	rmp.nb_print_run as print_run,
	rmp.ts_collected_at as collected_at,
	rmp.ll_source as source
FROM
	ref_market_prices as rmp
WHERE
	rmp.ll_game_id = $1
	AND rmp.ll_platform_id = $2
	AND rmp.flag_active = TRUE;
`;

export const getGamesByPlatform = `
SELECT
	rg.id,
	rg.ll_title as title,
	rp.id as platform_id,
	rp.ll_name as platform_name
FROM
	ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.ll_game_id = rg.id	
INNER JOIN ref_platforms AS rp ON agp.ll_platform_id = rp.id
WHERE rp.id = $1
	AND rg.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rp.flag_active = TRUE
GROUP BY rg.id, rg.ll_title, rp.id, rp.ll_name
ORDER BY rg.ll_title ASC;
`;

export const getConditionsGames = `
SELECT
    rcs.id,
    rcs.ll_code as code,
    rcs.ll_label as label,
    rcs.ll_element_type as element_type,
    rcs.ll_description as description,
    rcs.nb_rating as rating
FROM
    ref_condition_states as rcs
WHERE rcs.ll_element_type = 'cart' AND rcs.flag_active = TRUE;
`;

export const getConditionsBoxed = `
SELECT
    rcs.id,
    rcs.ll_code as code,
    rcs.ll_label as label,
    rcs.ll_element_type as element_type,
    rcs.ll_description as description,
    rcs.nb_rating as rating
FROM 
	ref_condition_states as rcs 
WHERE rcs.ll_element_type = 'box' AND rcs.flag_active = TRUE
`;

export const getConditionsManual = `
SELECT
    rcs.id,
    rcs.ll_code as code,
    rcs.ll_label as label,
    rcs.ll_element_type as element_type,
    rcs.ll_description as description,
    rcs.nb_rating as rating
FROM 
	ref_condition_states as rcs 
WHERE rcs.ll_element_type = 'manual' AND rcs.flag_active = TRUE
`;