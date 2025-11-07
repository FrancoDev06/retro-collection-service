import DatabaseUtil from "@utils/database";
import { userEmailExists, createUser, postToken, getTokenByValue, invalidateToken, invalidateUserTokens, addGameToUser, addPlatformToUser, getUserInfo , getUserGameList} from "@utils/queries/user.queries";




export default class UsersService {

	static async userEmailExists(email: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, userEmailExists, [email])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.authenticateUser.authenticateUser', error: err });
			});
	}

	static async getUserInfo(email: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getUserInfo, [email])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.getUserByEmail.getUserByEmail', error: err });
			});
	}
	static async createUser(name: string, email: string, password: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, createUser, [name, email, password])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.createUser.createUser', error: err });
			});
	}

	static async postToken(userId: string, token: string, expiresAt: Date): Promise<any> {
		const expiresAtString = expiresAt.toISOString();
		return await DatabaseUtil.query(DatabaseUtil.pool, postToken, [token, userId, expiresAtString])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.postToken.postToken', error: err });
			});
	}

	static async getTokenByValue(token: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getTokenByValue, [token])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.getTokenByValue.getTokenByValue', error: err });
			});
	}

	static async invalidateToken(tokenId: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, invalidateToken, [tokenId])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.invalidateToken.invalidateToken', error: err });
			});
	}

	static async invalidateUserTokens(userId: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, invalidateUserTokens, [userId])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.invalidateUserTokens.invalidateUserTokens', error: err });
			});
	}

	static async addGameToUser(userId: string, gameId: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, addGameToUser, [userId, gameId])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.addGameToUser.addGameToUser', error: err });
			});
	}

	static async addPlatformToUser(userId: string, platformId: string): Promise<any> {
		return await DatabaseUtil.query(DatabaseUtil.pool, addPlatformToUser, [userId, platformId])
			.then((res) => {
				return res.rows[0];
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.addPlatformToUser.addPlatformToUser', error: err });
			});
	}

	static async getGameList(userId: string): Promise<any[]> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getUserGameList, [userId])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'GamesService.getGameList.getGameList', error: err });
			});
	}
}
