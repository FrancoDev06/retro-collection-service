import ResponsesUtil from "@utils/responses.util";
import { Router } from "express";
import GameService from "@services/games.service";
import { Request, Response, NextFunction } from "express";
import { Game, Games } from "@utils/interfaces/games.interface";

const router: Router = Router();


/**
 * ROUTE API : Récupère la liste des jeux
 * 
 * @see GameService.getGames() - Fonction service appelée
 * @see getGames (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games
 * @access Private (nécessite authentification)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const games : Games[] = await GameService.getGames();
		if (!games) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_NOT_FOUND' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { games } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux limitée
 * 
 * @see GameService.getGamesLimited() - Fonction service appelée
 * @see getGamesLimited (games.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /games/limited
 * @access Private (nécessite authentification)
 */
router.post('/limited', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { limit, offset } = req.body;
		const gamesLimited : Games[] = await GameService.getGamesLimited(limit, offset);
		if (!gamesLimited) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_LIMITED_NOT_FOUND' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { gamesLimited } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_LIMITED_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère le nombre total de jeux
 * 
 * @see GameService.getGamesCount() - Fonction service appelée
 * @see getGamesCount (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/count
 * @access Private (nécessite authentification)
 */
router.get('/count',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const count : number = await GameService.getGamesCount();
		if (count === undefined || count === null) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { count } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux limitée par l'ID de la plateforme
 * 
 * @see GameService.getGamesLimitedByPlatformId() - Fonction service appelée
 * @see getGamesLimitedByPlatformId (games.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /games/platform/:id/limited
 * @access Private (nécessite authentification)
 */
router.post('/platform/:id/limited',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const { limit, offset } = req.body;
		const gamesPlatformsLimited: Games[] = await GameService.getGamesLimitedByPlatformId (id, limit, offset);
		if (!gamesPlatformsLimited) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_PLATFORMS_LIMITED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { gamesPlatformsLimited } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_PLATFORMS_LIMITED_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère le nombre total de jeux par plateforme
 * 
 * @see GameService.getGamesCountByPlatformId() - Fonction service appelée
 * @see getGamesCountByPlatformId (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/platform/:id/limited/count
 * @access Private (nécessite authentification)
 */
router.get('/platform/:id/limited/count',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const count: number = await GameService.getGamesCountByPlatformId(id);
		if (!count) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_BY_PLATFORM_ID_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { count } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_BY_PLATFORM_ID_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux par recherche
 * 
 * @see GameService.getGamesSearch() - Fonction service appelée
 * @see getGamesSearch (games.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /games/search
 * @access Private (nécessite authentification)
 */
router.post('/search', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const { limit, offset , searchTerm } = req.body;
		console.log(limit, offset, searchTerm);
		const gamesSearch: Games[] = await GameService.getGamesSearch(searchTerm, limit, offset);
		if (!gamesSearch) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_SEARCH_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { gamesSearch } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_SEARCH_FAILED', error: error });
	}
}); 

/**
 * ROUTE API : Récupère le nombre total de jeux par recherche
 * 
 * @see GameService.getGamesSearchCount() - Fonction service appelée
 * @see getGamesSearchCount (games.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /games/search/count
 * @access Private (nécessite authentification)
 */
router.post('/search/count', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { searchTerm } = req.body;
		const count: number = await GameService.getGamesSearchCount(searchTerm);
		if (!count) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_SEARCH_COUNT_NOT_FOUND' });
		}
	return ResponsesUtil.handleResult(res, { info: 'execok', data: { count } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_SEARCH_COUNT_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère un jeu par son ID
 * 
 * @see GameService.getGame() - Fonction service appelée
 * @see getGame (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/:id
 * @access Private (nécessite authentification)
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const game : Game = await GameService.getGame(id);
		if (!game) {
			return ResponsesUtil.notFound(res, { error: 'GAME_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { game } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAME_FAILED', error: error });
	}
});

// router.get('/:id',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const { id } = req.params;
// 		const game : Game = await GameService.getGame(id);
// 		if (!game) {
// 			return ResponsesUtil.notFound(res, { error: 'GAME_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { game } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAME_INFO_FAILED', error: error });
// 	}
// });




// router.get('/platform/:id/count',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const { id } = req.params;
// 		const count: number = await GameService.getGamePlatformsCount(id);
// 		if (!count) {
// 			return ResponsesUtil.notFound(res, { error: 'GAME_PLATFORMS_COUNT_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { count } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAME_PLATFORMS_COUNT_FAILED', error: error });
// 	}
// });

/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/

export { router as GamesRouter };
