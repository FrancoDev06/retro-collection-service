import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";

const router: Router = Router();

/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/
export { router as WishlistRouter };
