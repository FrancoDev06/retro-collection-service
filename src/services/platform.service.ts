import DatabaseUtil from "@utils/database";
import { Platform, PlatformConditions } from "@utils/interfaces/platform.interface";
import { getPlatformConditions, getPlatformsList } from "@utils/queries/platform.queries";

export default class PlatformService {

    static async getPlatformsList(): Promise<Platform[]> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformsList, [])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'PlatformService.getPlatformsList.getPlatformsList', error: err }));
        return result as Platform[];
    }

    static async getPlatformConditions(): Promise<PlatformConditions[]> {
        const result = await DatabaseUtil.query(DatabaseUtil.pool, getPlatformConditions, [])
            .then((res) => res.rows)
            .catch((err) => Promise.reject({ id: 'PlatformService.getPlatformConditions.getPlatformConditions', error: err }));
        return result as PlatformConditions[];
    }

}