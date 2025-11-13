import { NextFunction, Request, Response, Router } from "express";
import UserService from "@services/user.service";
import ResponsesUtil from "@utils/responses.util";
import TokenService from "@services/token.service";
import PasswordService from "@services/password.service";
import { UserInfoResponse, UserLoginRequest, UserRegisterRequest } from "@utils/interfaces/user.interface";

const router: Router = Router();


router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { username, email, password } : UserRegisterRequest = req.body;
	if (!username || !email || !password) {
		return ResponsesUtil.invalidParameters(res, { error: 'REGISTER_USER_MISSING_PARAMETERS' });
	}
	const existsEmail = await UserService.checkUserExists(email);
	if (existsEmail) {
		return ResponsesUtil.invalidParameters(res, { error: 'EMAIL_ALREADY_EXISTS' });
	}

	const result = await UserService.registerUser(username, email, password);
	if (!result) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'REGISTER_USER_FAILED' });
	}

	ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
});

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { email, password } : UserLoginRequest = req.body;
	if (!email || !password) {
		return ResponsesUtil.invalidParameters(res, { error: 'LOGIN_USER_MISSING_PARAMETERS' });
	}

	const existsEmail = await UserService.checkUserExists(email);
	if (!existsEmail) {
		return ResponsesUtil.invalidParameters(res, { error: 'EMAIL_NOT_FOUND' });
	}

	const userInfo : UserInfoResponse = await UserService.getUserInfo(email);
	if (!userInfo) {
		return ResponsesUtil.invalidParameters(res, { error: 'USER_INFO_NOT_FOUND' });
	}

	const verifiedPassword = await PasswordService.verifyPassword(password, userInfo.ll_password_hash);
	if (!verifiedPassword) {
		return ResponsesUtil.invalidParameters(res, { error: 'INVALID_PASSWORD' });
	}

	const existsToken = await UserService.checkUserToken(userInfo.id);
	if (existsToken) {
		await UserService.updateUserToken(userInfo.id);
	}

	const token = await TokenService.generateToken(userInfo.id);
	if (!token) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GENERATE_TOKEN_FAILED' });
	}

	await UserService.registerUserToken(userInfo.id, token);

	ResponsesUtil.handleResult(res, { info: 'execko', data: { userInfo, token } });
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
