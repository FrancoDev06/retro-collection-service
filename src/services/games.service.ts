import DatabaseUtil from "@utils/database";
import { getGames, getGame, getGamesCount, getGamePlatforms } from "@utils/queries/games.queries";

export default class GameService {

	static async getGames(limit: number, offset: number | undefined): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGames, [limit, offset || 0])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGames.getGames', error: err }));
		return result;
	}
	

	static async getGame(id: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGame, [id])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGame.getGame', error: err }));
		return result;
	}

	static async getGamesCount(): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCount, [])
			.then((res) => res.rows[0].count)
			.catch((err) => Promise.reject({ id: 'GameService.getGamesCount.getGamesCount', error: err }));
		return result;
	}

	static async getGamePlatforms(id: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamePlatforms, [id])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'GameService.getGamePlatforms.getGamePlatforms', error: err }));
		return result;
	}

}
