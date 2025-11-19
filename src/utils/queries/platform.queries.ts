export const getAllPlatforms = `
SELECT * FROM ref_platforms WHERE flag_active = TRUE
`;

export const getPlatform = `
SELECT * FROM ref_platforms WHERE id = $1 AND flag_active = TRUE
`;

export const getPlatformGames = `
SELECT
	rg.id,
	rg.ll_slug,
	rg.ll_title,
	rg.ll_cover_image,
	rg.ll_game_url,
	rg.ll_product_id
FROM ref_games AS rg
	INNER JOIN assoc_games_platforms AS agp ON agp.ll_game_id = rg.id
	INNER JOIN ref_platforms AS rp ON rp.id = agp.ll_platform_id
WHERE rg.flag_active = TRUE
	AND rp.id = $1
	AND rp.flag_active = TRUE
	AND agp.flag_active = TRUE
`;