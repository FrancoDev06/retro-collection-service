import crypto from "crypto";

export default class PasswordService {

	static async hashPassword(password: string): Promise<string> {
		return await crypto.createHash('sha256').update(password).digest('hex');
	}

	static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
		console.log('verifyPassword', password, hashedPassword);
		return await crypto.createHash('sha256').update(password).digest('hex') === hashedPassword;
	}
}
