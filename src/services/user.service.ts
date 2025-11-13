import DatabaseUtil from "@utils/database";
import PasswordService from "./password.service";
import { checkUserExists, checkUserToken, getUserInfo, loginUser, registerUser, registerUserToken, updateUserToken } from "@utils/queries/user.queries";

export default class UserService {


	static async registerUserToken(userId: string, token: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, registerUserToken, [userId, token])
			.then((res) => res.rows[0]?.id)
			.catch((err) => Promise.reject({ id: 'UserService.registerUserToken.registerUserToken', error: err }));

		return result;
	}

	static async checkUserExists(email: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, checkUserExists, [email])
			.then((res) => res.rows[0].exists)
			.catch((err) => Promise.reject({ id: 'UserService.checkUserByEmail.checkUserByEmail', error: err }));

		return result;
	}

	static async getUserInfo(email: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserInfo, [email])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.getUserInfo.getUserInfo', error: err }));
		return result;
	}

	static async registerUser(username: string, email: string, password: string): Promise<any> {
		const hashedPassword = await PasswordService.hashPassword(password);

		const result = await DatabaseUtil.query(DatabaseUtil.pool, registerUser, [username, email, hashedPassword])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.registerUser.registerUser', error: err }));

		return result;
	}

	static async loginUser(email: string, password: string): Promise<any> {
		const user = await DatabaseUtil.query(DatabaseUtil.pool, loginUser, [email])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.loginUser.loginUser', error: err }));

		return user;
	}

	static async checkUserToken(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, checkUserToken, [userId])
			.then((res) => res.rows[0].exists)
			.catch((err) => Promise.reject({ id: 'UserService.checkUserToken.checkUserToken', error: err }));

		return result;
	}

	static async updateUserToken(userId: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, updateUserToken, [userId])
			.then((res) => res.rowCount)
			.catch((err) => Promise.reject({ id: 'UserService.updateUserToken.updateUserToken', error: err }));

		return result;
	}
}
