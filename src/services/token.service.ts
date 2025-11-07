import jwt from "jsonwebtoken";
import app from "src/server";

export default class TokenService {

	static async generateToken(userId: string | number): Promise<string> {
		return await jwt.sign({ userId }, app.get("jwtSecret") || 'your-secret-key', { expiresIn: '7d' });
	}

	static async verifyToken(token: string): Promise<any> {
		try {
			return await jwt.verify(token, app.get("jwtSecret") || 'your-secret-key');
		} catch (error) {
			return null;
		}
	}

	static decodeToken(token: string): any {
		return jwt.decode(token);
	}
}
