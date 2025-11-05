export const getGames = `
    SELECT id,ll_name,ll_console_name FROM ref_games
	ORDER BY ll_name ASC
`;

export const getGameById = `
    SELECT * FROM ref_games
	WHERE id = $1
`;

export const getGamesByPlatform = `
    SELECT g.id,g.ll_name,g.ll_console_name FROM ref_games as g
	INNER JOIN assoc_games_platforms as agp ON g.id = agp.ll_game_id
	WHERE agp.ll_platform_id = $1
	ORDER BY g.ll_name ASC
`;
