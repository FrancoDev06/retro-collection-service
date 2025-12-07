import DatabaseUtil from "@utils/database";
import { Platform, Platforms } from "@utils/interfaces/platform.interface";
import { getPlatform, getPlatforms } from "@utils/queries/platform.queries";

export default class PlatformService {

	static async getPlatforms(): Promise<Platforms[]> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatforms, [])
			.then((res) => res.rows)
			.catch((err) => Promise.reject({ id: 'PlatformService.getPlatforms.getPlatforms', error: err }));
		return result as Platforms[];
	}

    static async getPlatform(id: string): Promise<Platform> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatform, [id])
            .then((res) => res.rows[0])
            .catch((err) => Promise.reject({ id: 'PlatformService.getPlatform.getPlatform', error: err }));
        return result as Platform;
    }

}