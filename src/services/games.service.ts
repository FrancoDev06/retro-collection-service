import DatabaseUtil from "@utils/database";
import { Game, Games } from "@utils/interfaces/games.interface";
import { getGames, getGamesLimited, getGame, getGamesCount, getGamesLimitedByPlatformId, getGamesCountByPlatformId, getGamesSearch, getGamesSearchCount } from "@utils/queries/games.queries";

export default class GameService {

	static async getGames(): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGames, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGames.getGames', error: err }));
		return result as Games[];
	}	

	static async getGame(id: string): Promise<Game> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGame, [id])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'GameService.getGame.getGame', error: err }));
		return result as Game;
	}

	static async getGamesLimited(limit: number, offset: number): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesLimited, [limit, offset])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesLimited.getGamesLimited', error: err }));
		return result as Games[];
	}

	static async getGamesCount(): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCount, [])
			.then((res) => res.rows[0].count)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesCount.getGamesCount', error: err }));
		return result;
	}

	static async getGamesLimitedByPlatformId(id: string, limit: number, offset: number): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesLimitedByPlatformId, [id, limit, offset])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesLimitedByPlatformId.getGamesLimitedByPlatformId', error: err }));
		return result as Games[];
	}

	static async getGamesCountByPlatformId(id: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCountByPlatformId, [id])
			.then((res) => res.rows[0].count)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesCountByPlatformId.getGamesCountByPlatformId', error: err }));
		return result;
	}

	static async getGamesSearch(query: string, limit: number, offset: number): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesSearch, [query, limit, offset])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesSearch.getGamesSearch', error: err }));
		return result as Games[];
	}

	static async getGamesSearchCount(searchTerm: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesSearchCount, [searchTerm])
			.then((res) => res.rows[0].count)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesSearchCount.getGamesSearchCount', error: err }));
		return result;
	}

}
