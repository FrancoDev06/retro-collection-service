import DatabaseUtil from "@utils/database";
import { Conditions, Game, Games } from "@utils/interfaces/games.interface";
import { getGamesLimited, getGame, getGamesCount, getGamesLimitedByPlatformId, getGamesCountByPlatformId, getGamesSearch, getGamesSearchCount, getGamePrices, getGamesByPlatform } from "@utils/queries/games.queries";
import { Prices } from "@utils/interfaces/prices.interface";
import { getCartConditions, getBoxConditions, getNoticeConditions } from "@utils/queries/games.queries";

export default class GameService {


	static async getGame(id: string): Promise<Game> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGame, [id])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'GameService.getGame.getGame', error: err }));
		return result as Game;
	}

	static async getGamesLimited(limit: number, offset: number, userId: string): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesLimited, [limit, offset, userId])
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

	static async getGamesSearch(query: string, limit: number, offset: number, userId?: string): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesSearch, [query, limit, offset, userId || null])
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

	static async getGamePrices(gameId: string, platformId: string): Promise<Prices[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamePrices, [gameId, platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamePrices.getGamePrices', error: err }));
		return result as Prices[];
	}

	static async getGamesByPlatform(platformId: string): Promise<Games[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesByPlatform, [platformId])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesByPlatform.getGamesByPlatform', error: err }));
		return result as Games[];
	}

	static async getCartConditions(): Promise<Conditions[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getCartConditions, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getCartConditions.getCartConditions', error: err }));
		return result as Conditions[];
	}

	static async getBoxConditions(): Promise<Conditions[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getBoxConditions, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getBoxConditions.getBoxConditions', error: err }));
		return result as Conditions[];
	}

	static async getNoticeConditions(): Promise<Conditions[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getNoticeConditions, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getNoticeConditions.getNoticeConditions', error: err }));
		return result as Conditions[];
	}

}
