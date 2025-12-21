import DatabaseUtil from "@utils/database";
import PasswordService from "./password.service";
import { checkUserExists, checkUserToken, getUserByEmail, loginUser, registerUser, registerUserToken, updateUserToken ,getUserById} from "@utils/queries/user.queries";
import { UserInfoResponse } from "@utils/interfaces/user.interface";

export default class UserService {


	static async registerUserToken(userId: string, token: string): Promise<string | undefined> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, registerUserToken, [userId, token])
			.then((res) => res.rows[0]?.tokenId)
			.catch((err) => Promise.reject({ id: 'UserService.registerUserToken.registerUserToken', error: err }));

		return result;
	}

	static async checkUserExists(email: string): Promise<any> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, checkUserExists, [email])
			.then((res) => res.rows[0].exists)
			.catch((err) => Promise.reject({ id: 'UserService.checkUserByEmail.checkUserByEmail', error: err }));

		return result;
	}

	static async registerUser(username: string, email: string, password: string): Promise<{ userId: string }> {
		const hashedPassword = await PasswordService.hashPassword(password);

		const result = await DatabaseUtil.query(DatabaseUtil.pool, registerUser, [username, email, hashedPassword])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.registerUser.registerUser', error: err }));

		return result as { userId: string };
	}

	static async loginUser(email: string, password: string): Promise<UserInfoResponse> {
		const user = await DatabaseUtil.query(DatabaseUtil.pool, loginUser, [email])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.loginUser.loginUser', error: err }));

		return user as UserInfoResponse;
	}

	static async checkUserToken(userId: string): Promise<any> {
		console.log('checkUserToken', userId);
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

	static async getUserByEmail(email: string): Promise<UserInfoResponse> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserByEmail, [email])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.getUserByEmail.getUserByEmail', error: err }));
		return result as UserInfoResponse;
	}

	static async getUserById(id: string): Promise<UserInfoResponse> {
		const result = await DatabaseUtil.query(DatabaseUtil.pool, getUserById, [id])
			.then((res) => res.rows[0])
			.catch((err) => Promise.reject({ id: 'UserService.getUserById.getUserById', error: err }));
		return result as UserInfoResponse;
	}
}
