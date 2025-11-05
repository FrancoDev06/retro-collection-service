import DatabaseUtil from "@utils/database";
import { getPlatforms } from "@utils/queries/platform.queries";

export default class PlatformService {

	static async getPlatforms(): Promise<any[]> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getPlatforms, [])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'PlatformService.getPlatforms.getPlatforms', error: err });
			});
	}

}
