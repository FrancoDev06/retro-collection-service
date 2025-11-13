import ResponsesUtil from "@utils/responses.util";
import { Router } from "express";
import GameService from "@services/games.service";
import { Request, Response, NextFunction } from "express";
import { authMiddleware } from "@middlewares/auth.middleware";
import { Game } from "@utils/interfaces/games.interface";

const router: Router = Router();

router.post('/all', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const { limit, offset } = req.body;
		const games : Game[] = await GameService.getGames(limit, offset);
		console.log("🚀 ~ games:", games)
		if (!games) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_NOT_FOUND' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execko', data: { games } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_FAILED', error: error });
	}
});

router.get('/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const count : number = await GameService.getGamesCount();
		if (count === undefined || count === null) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { count } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_FAILED', error: error });
	}
});

router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const game : Game = await GameService.getGame(id);
		if (!game) {
			return ResponsesUtil.notFound(res, { error: 'GAME_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { game } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAME_INFO_FAILED', error: error });
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

export { router as GamesRouter };
