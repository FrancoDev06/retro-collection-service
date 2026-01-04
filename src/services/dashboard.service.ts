import DatabaseUtil from "@utils/database";
import { getGamesValueCount, getGamesCount, getPlatformsCount, getGamesCibCount } from "@utils/queries/dashboard.queries";

export default class DashboardService {

	/**
	 * FONCTION SERVICE : Récupère le total des valeurs dans la collection d'un utilisateur
	 * 
	 * @see getGamesValue (dashboard.queries.ts) - Requête SQL utilisée
	 * @see GET /dashboard/:userId/games/value - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @returns Le total des valeurs dans la collection d'un utilisateur
	 */
    static async getGamesValue(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesValueCount, [userId])
			.then((res) => res.rows[0].gamesValueCount)
			.catch((err) => Promise.reject({ id: 'DashboardService.getGamesValue.getGamesValue', error: err }));
		return result as number;
	}

	/**
	 * FONCTION SERVICE : Récupère le total des jeux dans la collection d'un utilisateur
	 * 
	 * @see getGamesCount (dashboard.queries.ts) - Requête SQL utilisée
	 * @see GET /dashboard/:userId/games/count - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @returns Le total des jeux dans la collection d'un utilisateur
	 */
	static async getGamesCount(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCount, [userId])
			.then((res) => res.rows[0].gamesCount)
			.catch((err) => Promise.reject({ id: 'DashboardService.getGamesCount.getGamesCountCount', error: err }));
		return result as number;
	}

	/**
	 * FONCTION SERVICE : Récupère le total des plateformes dans la collection d'un utilisateur
	 * 
	 * @see getPlatformsCount (dashboard.queries.ts) - Requête SQL utilisée
	 * @see GET /dashboard/:userId/platforms/count - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @returns Le total des plateformes dans la collection d'un utilisateur
	 */
	static async getPlatformsCount(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformsCount, [userId])
			.then((res) => res.rows[0].platformsCount)
			.catch((err) => Promise.reject({ id: 'DashboardService.getPlatformsCount.getPlatformsCount', error: err }));
		return result as number;
	}

	/**
	 * FONCTION SERVICE : Récupère le total des jeux CIB dans la collection d'un utilisateur
	 * 
	 * @see getGamesCibCount (dashboard.queries.ts) - Requête SQL utilisée
	 * @see GET /dashboard/:userId/games/cib/count - Route API qui expose cette fonctionnalité
	 * 
	 * @param userId - ID de l'utilisateur
	 * @returns Le total des jeux CIB dans la collection d'un utilisateur
	 */
	static async getGamesCibCount(userId: string): Promise<number> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getGamesCibCount, [userId])
			.then((res) => res.rows[0].gamesCibCount)
			.catch((err) => Promise.reject({ id: 'DashboardService.getGamesCibCount.getGamesCibCount', error: err }));
		return result as number;
	}

}