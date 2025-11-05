import DatabaseUtil from "@utils/database";
import { createUser, getUsers } from "@utils/queries/user.queries";

export default class UsersService {

	static async getUsers(): Promise<any[]> {
		return await DatabaseUtil.query(DatabaseUtil.pool, getUsers, [])
			.then((res) => {
				return res.rows;
			})
			.catch((err) => {
				return Promise.reject({ id: 'UsersService.getUsers.getUsers', error: err });
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
}

