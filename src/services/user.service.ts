import DatabaseUtil from "@utils/database";
import PasswordService from "./password.service";
import { UserInfoResponse } from "@utils/interfaces/user.interface";

export default class UserService {


	static async registerUserToken(userId: string, token: string): Promise<string | undefined> {
		// Calculer la date d'expiration (1 heure à partir de maintenant)
		const expiresAt = new Date();
		expiresAt.setHours(expiresAt.getHours() + 1);

		const { data, error } = await DatabaseUtil.supabase
			.from('ref_tokens')
			.insert({
				id_user: userId,
				ll_token: token,
				ts_expires_at: expiresAt.toISOString(),
				flag_active: true
			})
			.select('id_token')
			.single();

		if (error) {
			throw new Error(`UserService.registerUserToken.registerUserToken: ${error.message}`);
		}

		return data?.id_token;
	}

	static async checkUserExists(email: string): Promise<boolean> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_users')
			.select('id_user')
			.eq('ll_email', email)
			.eq('flag_active', true)
			.limit(1);

		if (error) {
			throw { id: 'UserService.checkUserByEmail.checkUserByEmail', error };
		}

		return (data && data.length > 0);
	}

	static async registerUser(username: string, email: string, password: string): Promise<{ userId: string }> {
		const hashedPassword = await PasswordService.hashPassword(password);

		const { data, error } = await DatabaseUtil.supabase
			.from('ref_users')
			.insert({
				ll_username: username,
				ll_email: email,
				ll_password_hash: hashedPassword,
				flag_active: true
			})
			.select('id_user')
			.single();

		if (error) {
			throw { id: 'UserService.registerUser.registerUser', error };
		}

		return { userId: data.id_user };
	}

	static async checkUserToken(userId: string): Promise<boolean> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_tokens')
			.select('id_token')
			.eq('id_user', userId)
			.eq('flag_active', true)
			.limit(1);

		if (error) {
			throw { id: 'UserService.checkUserToken.checkUserToken', error };
		}

		return (data && data.length > 0);
	}

	static async updateUserToken(userId: string): Promise<number> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_tokens')
			.update({ flag_active: false })
			.eq('id_user', userId)
			.eq('flag_active', true)
			.select('id_token');

		if (error) {
			throw { id: 'UserService.updateUserToken.updateUserToken', error };
		}

		return data?.length || 0;
	}

	static async getUserByEmail(email: string): Promise<UserInfoResponse> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_users')
			.select('id_user, ll_username, ll_email, ll_password_hash')
			.eq('ll_email', email)
			.eq('flag_active', true)
			.single();

		if (error) {
			throw { id: 'UserService.getUserByEmail.getUserByEmail', error };
		}

		return {
			userId: data.id_user,
			username: data.ll_username,
			email: data.ll_email,
			passwordHash: data.ll_password_hash
		} as UserInfoResponse;
	}

	static async getUserById(id: string): Promise<UserInfoResponse> {
		const { data, error } = await DatabaseUtil.supabase
			.from('ref_users')
			.select('id_user, ll_username, ll_email, ll_password_hash')
			.eq('id_user', id)
			.eq('flag_active', true)
			.single();

		if (error) {
			throw { id: 'UserService.getUserById.getUserById', error };
		}

		return {
			userId: data.id_user,
			username: data.ll_username,
			email: data.ll_email,
			passwordHash: data.ll_password_hash
		} as UserInfoResponse;
	}
}
