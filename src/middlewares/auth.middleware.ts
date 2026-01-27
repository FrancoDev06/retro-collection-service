import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import TokenService from "@services/token.service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'Token manquant' });
		}

		const parts = authHeader.split(' ');
		if (parts.length !== 2 || parts[0] !== 'Bearer') {
			return ResponsesUtil.unauthorizedAction(res, { message: 'Format de token invalide. Utilisez: Bearer <token>' });
		}

		const token = parts[1];
		const decoded = await TokenService.verifyToken(token);

		if (!decoded) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'Token invalide ou expiré' });
		}

		(req as any).user = { userId: decoded.userId };
		next();
	} catch (error) {
		return ResponsesUtil.unauthorizedAction(res, { message: 'Erreur lors de la vérification du token' });
	}
};

