import DatabaseUtil from "@utils/database";

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
		const { data, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.select('nb_price_paid')
			.eq('id_user', userId)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'DashboardService.getGamesValue.getGamesValue', error };
		}

		const gamesValueCount = data.reduce((sum: number, item: any) => sum + (item.nb_price_paid || 0), 0);
		return gamesValueCount;
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
		const { count, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.select('*', { count: 'exact', head: true })
			.eq('id_user', userId)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'DashboardService.getGamesCount.getGamesCountCount', error };
		}

		return count || 0;
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
		const { count, error } = await DatabaseUtil.supabase
			.from('assoc_users_platforms_collections')
			.select('*', { count: 'exact', head: true })
			.eq('id_user', userId)
			.eq('flag_active', true);

		if (error) {
			throw { id: 'DashboardService.getPlatformsCount.getPlatformsCount', error };
		}

		return count || 0;
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
		const { count, error } = await DatabaseUtil.supabase
			.from('assoc_users_games_collections')
			.select('*', { count: 'exact', head: true })
			.eq('id_user', userId)
			.eq('flag_active', true)
			.eq('flag_has_cart', true)
			.eq('flag_has_box', true)
			.eq('flag_has_notice', true);

		if (error) {
			throw { id: 'DashboardService.getGamesCibCount.getGamesCibCount', error };
		}

		return count || 0;
	}

}