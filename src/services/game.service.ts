import { getGameById, getGames, getGamesByPlatform } from "@utils/queries/game.queries";
import DatabaseUtil from "@utils/database";


export default class GamesService {


	static async getGames(): Promise<any[]> {

		return await DatabaseUtil.query(DatabaseUtil.pool, getGames, [])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'GamesService.getGames.getGames', error: err });
			});
	}

	static async getGame(id: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getGameById, [id])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'GamesService.getGame.getGame', error: err });
			});
	}

	static async getGamesByPlatform(id: string): Promise<any[]> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getGamesByPlatform, [id])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'GamesService.getGamesByPlatform.getGamesByPlatform', error: err });
			});
	}
}
