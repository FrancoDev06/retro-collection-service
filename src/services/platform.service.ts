import DatabaseUtil from "@utils/database";
import { getAllPlatforms, getPlatformGames } from "@utils/queries/platform.queries";
import { getPlatform } from "@utils/queries/platform.queries";

export default class PlatformService {

	static async getAllPlatforms(): Promise<any[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getAllPlatforms, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'PlatformService.getAllPlatforms.getAllPlatforms', error: err }));
		return result;
	}

    static async getPlatform(id: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatform, [id])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'PlatformService.getPlatform.getPlatform', error: err }));
        return result;
    }

    static async getPlatformGames(id: string): Promise<any> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformGames, [id])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'PlatformService.getPlatformGames.getPlatformGames', error: err }));
        return result;
    }

}