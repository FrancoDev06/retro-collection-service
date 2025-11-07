import ResponsesUtil from "@utils/responses.util";
import { NextFunction, Request, Response, Router } from "express";
import UserService from "@services/user.service";
import TokenService from "@services/token.service";
import PasswordService from "@services/password.service";
import { authMiddleware } from "@middlewares/auth.middleware";
import GamesService from "@services/game.service";

const router: Router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { username, email, password , confirmPassword } = req.body;

	if (!username || !email || !password || !confirmPassword) return ResponsesUtil.invalidParameters(res);
	if (password !== confirmPassword) return ResponsesUtil.invalidParameters(res);

	const hashedPassword = await PasswordService.hashPassword(password);
	if (!hashedPassword) return ResponsesUtil.invalidParameters(res);

    const result = await UserService.createUser(username, email, hashedPassword);

	if (!result) return ResponsesUtil.invalidParameters(res);

	ResponsesUtil.handleResult(res, { info: 'execko', data: result });
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password } = req.body;

	if (!email || !password) return ResponsesUtil.invalidParameters(res);

	const userEmailExists = await UserService.userEmailExists(email);
	if (!userEmailExists || !userEmailExists.user_exists) return ResponsesUtil.unauthorizedAction(res);

	const userInfo = await UserService.getUserInfo(email);
	if (!userInfo) return ResponsesUtil.unauthorizedAction(res);

	const verifiedPassword = await PasswordService.verifyPassword(password, userInfo.ll_password);
	if (!verifiedPassword) return ResponsesUtil.unauthorizedAction(res, { message: 'Mot de passe incorrect' });

	await UserService.invalidateUserTokens(userInfo.id);

	const token = await TokenService.generateToken(userInfo.id);
	if (!token) return ResponsesUtil.invalidParameters(res);

	const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	const tokenResult = await UserService.postToken(userInfo.id, token, tokenExpiresAt);
	if (!tokenResult) return ResponsesUtil.invalidParameters(res);

	ResponsesUtil.handleResult(res, {
		info: 'execko',
		data: {
			token: token,
			tokenExpiresAt: tokenExpiresAt.toISOString()
		}
	});
});

router.post('/games', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { userId, gameId, platformId } = req.body;
	if (!userId || !gameId || !platformId) return ResponsesUtil.invalidParameters(res);

	const result = await UserService.addGameToUser(userId, gameId);
	const resultPlatform = await UserService.addPlatformToUser(userId, platformId);
	if (!result || !resultPlatform) return ResponsesUtil.invalidParameters(res);

	ResponsesUtil.handleResult(res, { info: 'execko', data: { game: result, platform: resultPlatform } });
});

router.post('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email } = req.body;
	console.log(email);
	if (!email) return ResponsesUtil.invalidParameters(res);

	const result = await UserService.getUserInfo(email);
	if (!result) return ResponsesUtil.invalidParameters(res);

	ResponsesUtil.handleResult(res, { info: 'execko', data: { user: result } });
});

router.post('/game/list', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { userId } = req.body;
	if (!userId) return ResponsesUtil.invalidParameters(res);

	const result = await UserService.getGameList(userId);
	if (!result) return ResponsesUtil.invalidParameters(res);

	ResponsesUtil.handleResult(res, { info: 'execko', data: { games: result } });
});

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

export { router as UserRouter };
