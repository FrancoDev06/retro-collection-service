import { Game, Platform } from "@utils/interfaces/games.interface";
import { NextFunction, Request, Response, Router } from "express";
import PlatformService from "@services/platform.service";
import ResponsesUtil from "@utils/responses.util";

const router: Router = Router();

router.get('/all', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
	const result: Platform[] = await PlatformService.getAllPlatforms();
	if (!result) {
		return ResponsesUtil.notFound(res, { error: 'ALL_PLATFORMS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORMS_FAILED', error: error });
	}
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result: Platform = await PlatformService.getPlatform(id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'SINGLE_PLATFORM_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORM_FAILED', error: error });
	}
});

router.get('/games/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result: Game[] = await PlatformService.getPlatformGames(id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'PLATFORM_GAMES_NOT_FOUND' });
		}
	return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORM_GAMES_FAILED', error: error });
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

export { router as PlatformRouter };