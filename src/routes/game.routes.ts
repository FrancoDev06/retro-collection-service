import GamesService from "@services/game.service";
import { authMiddleware } from "@middlewares/auth.middleware";
import ResponsesUtil from "@utils/responses.util";
import { NextFunction, Request, Response, Router } from "express";

const router: Router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const result = await GamesService.getGames();
    console.log("🚀 ~ result:", result)
	ResponsesUtil.handleResult(res, { info: 'execko', data: result });
});

router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const id = req.params.id;
	if (!id) return ResponsesUtil.invalidParameters(res);

    const result = await GamesService.getGame(id);
    console.log("🚀 ~ result:", result)
	ResponsesUtil.handleResult(res, { info: 'execko', data: result });
});

router.get('/platform/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = req.params.id;
    if (!id) return ResponsesUtil.invalidParameters(res);
    const result = await GamesService.getGamesByPlatform(id);
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
export { router as GamesRouter };
