import ResponsesUtil from "@utils/responses.util";
import { NextFunction, Request, Response, Router } from "express";
import UserService from "@services/user.service";
const router: Router = Router();

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { username, email, password , confirmPassword } = req.body;
	console.log("🚀 ~ req.body:", req.body)
	if (!username || !email || !password || !confirmPassword) return ResponsesUtil.invalidParameters(res);
	if (password !== confirmPassword) return ResponsesUtil.invalidParameters(res, { id_case: 'PASSWORD_MISMATCH' });

    const result = await UserService.createUser(username, email, password);
    console.log("🚀 ~ result:", result)
	ResponsesUtil.handleResult(res, { info: 'execko', data: result });
});

/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/
export { router as UserRouter };
