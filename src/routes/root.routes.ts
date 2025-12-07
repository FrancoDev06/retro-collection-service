

import ResponsesUtil from "@utils/responses.util";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();


router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	return ResponsesUtil.handleResult(res, {
		info: `execok`,
		additional: `🌩️ « RetroCollection by RoyDev »`
	});
});



/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/
export default router;
