export const getGames = `
SELECT
	rg.id,
	rg.ll_slug,
	rg.ll_title,
	rg.ll_cover_image,
	rg.ll_game_url,
	rg.ll_product_id,
	json_agg(
		json_build_object(
			'name', rp.ll_name,
			'slug', rp.ll_slug,
			'id', rp.id
		) ORDER BY rp.ll_name
	) AS platforms
FROM
    ref_games AS rg
INNER JOIN assoc_games_platforms AS agp ON rg.id = agp.ll_game_id
INNER JOIN ref_platforms as rp ON agp.ll_platform_id = rp.id
WHERE rg.flag_active = TRUE
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE

GROUP BY rg.id, rg.ll_slug, rg.ll_title, rg.ll_cover_image, rg.ll_game_url, rg.ll_product_id
ORDER BY rg.ll_title ASC
LIMIT $1 OFFSET $2
`;



export const getGamesCount = `
SELECT COUNT(*) AS count FROM ref_games WHERE flag_active = TRUE;
`;

export const getGame = `
SELECT
	rg.id,
    rg.ll_title,
    rg.ll_cover_image,
    rg.ll_publisher,
    rg.ll_developer,
    rg.ll_description,
    agp.ll_region_label,
    agp.ll_region_code,
    rg.ts_released,
    rp.ll_name,
    rp.ll_manufacturer,
    rge.ll_name as genre_name
FROM
    ref_games AS rg
	INNER JOIN assoc_games_platforms AS agp ON agp.ll_game_id = rg.id
	INNER JOIN ref_platforms AS rp ON rp.id = agp.ll_platform_id
	INNER JOIN assoc_games_genres AS agg ON agg.ll_game_id = rg.id
	INNER JOIN ref_genres AS rge ON rge.id = agg.ll_genre_id
WHERE
    rg.id = $1
`;
