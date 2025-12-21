export const getGame = `
SELECT DISTINCT ON (rg.id_game)
	rg.id_game AS "gameId",
	rg.ll_slug AS slug,
	rg.ll_title AS title,
	rg.ll_cover_image AS "coverImage",
	rg.ll_cover_image_large AS "coverImageLarge",
	rg.ll_game_url AS "gameUrl",
	rg.ll_product_id AS "productId",
	rg.ll_publisher AS publisher,
	rg.ll_developer AS developer,
	rg.ll_description AS description,
	rg.ts_released AS released,
	(
		SELECT STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name)
		FROM assoc_games_genres AS agg
		INNER JOIN ref_genres AS rge ON rge.id_genre = agg.id_genre
		WHERE agg.id_game = rg.id_game
			AND agg.flag_active = TRUE
			AND rge.flag_active = TRUE
	) AS "genreName",
	rp.id_platform AS "platformId",
	rp.ll_name AS "platformName"
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id_game = agp.id_game
INNER JOIN ref_platforms as rp ON agp.id_platform = rp.id_platform
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND agp.id_platform = $1
	AND rg.id_game = $2
ORDER BY rg.id_game, rg.ll_title ASC;
`;

export const getGamesLimited = `
WITH user_id_param AS (
	SELECT $3::uuid AS user_uuid
)
SELECT DISTINCT ON (rg.id_game)
	rg.id_game AS "gameId",
	rg.ll_title AS title,
	rg.ll_cover_image AS "coverImage",
	rg.ll_cover_image_large AS "coverImageLarge",
	rg.ts_released AS released,
	(
		SELECT STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name)
		FROM assoc_games_genres AS agg
		INNER JOIN ref_genres AS rge ON rge.id_genre = agg.id_genre
		WHERE agg.id_game = rg.id_game
			AND agg.flag_active = TRUE
			AND rge.flag_active = TRUE
	) AS "genreName",
	rp.id_platform AS "platformId",
	rp.ll_name AS "platformName",
	CASE 
		WHEN up.user_uuid IS NOT NULL THEN (augc.id_user_game_collection IS NOT NULL)
		ELSE FALSE
	END AS inCollection,
	CASE 
		WHEN up.user_uuid IS NOT NULL THEN (augw.id_user_game_wishlist IS NOT NULL)
		ELSE FALSE
	END AS "inWishlist"
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id_game = agp.id_game
INNER JOIN ref_platforms as rp ON agp.id_platform = rp.id_platform
CROSS JOIN user_id_param up
LEFT JOIN assoc_users_games_collections AS augc ON augc.id_game = rg.id_game 
	AND augc.id_user = up.user_uuid
	AND augc.flag_active = TRUE
LEFT JOIN assoc_users_games_wishlists AS augw ON augw.id_game = rg.id_game 
	AND augw.id_user = up.user_uuid
	AND augw.flag_active = TRUE
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
ORDER BY rg.id_game, rg.ll_title ASC, rp.ll_name ASC
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
SELECT DISTINCT ON (rg.id_game)
	rg.id_game AS "gameId",
	rg.ll_title AS title,
	rg.ll_cover_image AS "coverImage",
	rg.ll_cover_image_large AS "coverImageLarge",
	rg.ts_released AS released,
	(
		SELECT STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name)
		FROM assoc_games_genres AS agg
		INNER JOIN ref_genres AS rge ON rge.id_genre = agg.id_genre
		WHERE agg.id_game = rg.id_game
			AND agg.flag_active = TRUE
			AND rge.flag_active = TRUE
	) AS "genreName",
	rp.id_platform AS "platformId",
	rp.ll_name AS "platformName"
FROM
	ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.id_game = rg.id_game
INNER JOIN ref_platforms AS rp ON agp.id_platform = rp.id_platform
WHERE rp.id_platform = $1
	AND rg.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rp.flag_active = TRUE
ORDER BY rg.id_game, rg.ll_title ASC
LIMIT $2 OFFSET $3
`;


export const getGamesCountByPlatformId = `
SELECT COUNT(*) AS count FROM assoc_games_platforms WHERE id_platform = $1 AND flag_active = TRUE;
`;

export const getGamesSearch = `
WITH user_id_param AS (
	SELECT $4::uuid AS user_uuid
)
SELECT DISTINCT ON (rg.id_game)
	rg.id_game AS "gameId",
	rg.ll_title AS title,
	rg.ll_cover_image AS "coverImage",
	rg.ll_cover_image_large AS "coverImageLarge",
	rg.ts_released AS released,
	(
		SELECT STRING_AGG(DISTINCT rge.ll_name, ', ' ORDER BY rge.ll_name)
		FROM assoc_games_genres AS agg
		INNER JOIN ref_genres AS rge ON rge.id_genre = agg.id_genre
		WHERE agg.id_game = rg.id_game
			AND agg.flag_active = TRUE
			AND rge.flag_active = TRUE
	) AS "genreName",
	rp.id_platform AS "platformId",
	rp.ll_name AS "platformName",
	CASE 
		WHEN up.user_uuid IS NOT NULL THEN (augc.id_user_game_collection IS NOT NULL)
		ELSE FALSE
	END AS inCollection,
	CASE 
		WHEN up.user_uuid IS NOT NULL THEN (augw.id_user_game_wishlist IS NOT NULL)
		ELSE FALSE
	END AS "inWishlist"
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.id_game = rg.id_game
INNER JOIN ref_platforms AS rp ON agp.id_platform = rp.id_platform
CROSS JOIN user_id_param up
LEFT JOIN assoc_users_games_collections AS augc ON augc.id_game = rg.id_game 
	AND augc.id_user = up.user_uuid
	AND augc.flag_active = TRUE
LEFT JOIN assoc_users_games_wishlists AS augw ON augw.id_game = rg.id_game 
	AND augw.id_user = up.user_uuid
	AND augw.flag_active = TRUE
WHERE
    rg.ll_title ILIKE '%' || $1 || '%'
    AND rg.flag_active = TRUE
    AND agp.flag_active = TRUE
    AND rp.flag_active = TRUE
ORDER BY
    rg.id_game, rg.ll_title ASC, rp.ll_name ASC
LIMIT $2 OFFSET $3;
`;

export const getGamesSearchCount = `
SELECT COUNT(*) AS count FROM ref_games WHERE ll_title ILIKE '%' || $1 || '%' AND flag_active = TRUE;
`;

export const getGamePrices = `
SELECT
	rmp.id_market_price AS "marketPriceId",
	rmp.id_game AS "gameId",
	rmp.id_platform AS "platformId",
	rmp.ll_price_type AS "priceType",
	rmp.nb_price_retail AS "priceRetail",
	rmp.nb_price_change AS "priceChange",
	rmp.nb_price_change_percent AS "priceChangePercent",
	rmp.nb_print_run AS "printRun",
	rmp.ts_collected_at AS "collectedAt",
	rmp.ll_source AS source
FROM
	ref_market_prices as rmp
WHERE
	rmp.id_game = $1
	AND rmp.id_platform = $2
	AND rmp.flag_active = TRUE;
`;

export const getGamesByPlatform = `
SELECT
	rg.id_game AS "gameId",
	rg.ll_title AS title,
	rp.id_platform AS "platformId",
	rp.ll_name AS "platformName"
FROM
	ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON agp.id_game = rg.id_game	
INNER JOIN ref_platforms AS rp ON agp.id_platform = rp.id_platform
WHERE rp.id_platform = $1
	AND rg.flag_active = TRUE
	AND agp.flag_active = TRUE
	AND rp.flag_active = TRUE
GROUP BY rg.id_game, rg.ll_title, rp.id_platform, rp.ll_name
ORDER BY rg.ll_title ASC;
`;

export const getCartConditions = `
SELECT
    rcs.id_condition_state AS "conditionStateId",
    rcs.ll_code AS code,
    rcs.ll_label AS label,
    rcs.ll_element_type AS "elementType",
    rcs.ll_description AS description,
    rcs.nb_rating AS rating
FROM
    ref_condition_states as rcs
WHERE rcs.ll_element_type = 'cart' AND rcs.flag_active = TRUE;
`;

export const getBoxConditions = `
SELECT
    rcs.id_condition_state AS "conditionStateId",
    rcs.ll_code AS code,
    rcs.ll_label AS label,
    rcs.ll_element_type AS "elementType",
    rcs.ll_description AS description,
    rcs.nb_rating AS rating
FROM 
	ref_condition_states as rcs 
WHERE rcs.ll_element_type = 'box' AND rcs.flag_active = TRUE
`;

export const getNoticeConditions = `
SELECT
    rcs.id_condition_state AS "conditionStateId",
    rcs.ll_code AS code,
    rcs.ll_label AS label,
    rcs.ll_element_type AS "elementType",
    rcs.ll_description AS description,
    rcs.nb_rating AS rating
FROM 
	ref_condition_states as rcs 
WHERE rcs.ll_element_type = 'manual' AND rcs.flag_active = TRUE
`;