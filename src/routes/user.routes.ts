import { NextFunction, Request, Response, Router } from "express";
import UserService from "@services/user.service";
import ResponsesUtil from "@utils/responses.util";
import TokenService from "@services/token.service";
import PasswordService from "@services/password.service";
import { UserInfoResponse, UserLoginRequest, UserRegisterRequest } from "@utils/interfaces/user.interface";
import { authMiddleware } from "@middlewares/auth.middleware";

const router: Router = Router();


router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { name, email, password }: UserRegisterRequest = req.body;
	if (!name || !email || !password) {
		return ResponsesUtil.invalidParameters(res, { error: 'REGISTER_USER_MISSING_PARAMETERS' });
	}
	const existsEmail = await UserService.checkUserExists(email);
	if (existsEmail) {
		return ResponsesUtil.invalidParameters(res, { error: 'EMAIL_ALREADY_EXISTS' });
	}

	const result = await UserService.registerUser(name, email, password);
	if (!result) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'REGISTER_USER_FAILED' });
	}

	ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password }: UserLoginRequest = req.body;
	if (!email || !password) {
		return ResponsesUtil.invalidParameters(res, { error: 'LOGIN_USER_MISSING_PARAMETERS' });
	}

	const existsEmail = await UserService.checkUserExists(email);
	if (!existsEmail) {
		return ResponsesUtil.invalidParameters(res, { error: 'EMAIL_NOT_FOUND' });
	}

	const user: UserInfoResponse = await UserService.getUserByEmail(email);
	if (!user) {
		return ResponsesUtil.invalidParameters(res, { error: 'USER_INFO_NOT_FOUND' });
	}

	const verifiedPassword = await PasswordService.verifyPassword(password, user.passwordHash);
	if (!verifiedPassword) {
		return ResponsesUtil.invalidParameters(res, { error: 'INVALID_PASSWORD' });
	}

	const existsToken = await UserService.checkUserToken(user.userId);
	if (existsToken) {
		await UserService.updateUserToken(user.userId);
	}

	const token = await TokenService.generateToken(user.userId);
	if (!token) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GENERATE_TOKEN_FAILED' });
	}

	await UserService.registerUserToken(user.userId, token);

	const result = {
		user,
		token
	};

	ResponsesUtil.handleResult(res, { info: 'execok', data: result });
});

router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const token = req.headers.authorization?.split(' ')[1];

		if (!token) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'Token manquant' });
		}

		const userId = TokenService.decodeToken(token).userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'Token invalide' });
		}

		const result: UserInfoResponse = await UserService.getUserById(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'USER_INFO_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_USER_INFO_FAILED', error: error });
	}
});


router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result: UserInfoResponse = await UserService.getUserByEmail(id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'USER_INFO_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_USER_INFO_FAILED', error: error });
	}
});



/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/

export { router as UsersRouter };
