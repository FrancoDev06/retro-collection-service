import GamesService from "@services/game.service";
import PlatformService from "@services/platform.service";
import ResponsesUtil from "@utils/responses.util";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await PlatformService.getPlatforms();
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
export { router as PlatformRouter };
