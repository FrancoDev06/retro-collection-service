import ResponsesUtil from "@utils/responses.util";
import { Router } from "express";
import GameService from "@services/games.service";
import { Request, Response, NextFunction } from "express";
import { Game, Games, Conditions } from "@utils/interfaces/games.interface";
import { Prices } from "@utils/interfaces/prices.interface";
import { authMiddleware } from "@middlewares/auth.middleware";

const router: Router = Router();


/**
 * ROUTE API : Récupère la liste des jeux limitée
 * 
 * @see GameService.getGamesLimited() - Fonction service appelée
 * @see getGamesLimited (games.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /games/limited
 * @access Private (nécessite authentification)
 */
router.post('/limited', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { limit, offset } = req.body;
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'User ID manquant' });
		}
		const result : Games[] = await GameService.getGamesLimited(limit, offset, userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_LIMITED_NOT_FOUND' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
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
router.get('/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result : number = await GameService.getGamesCount();
		if (result === undefined || result === null) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux par plateforme
 * 
 * @see GameService.getGamesByPlatform() - Fonction service appelée
 * @see getGamesByPlatform (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/platform/:id
 * @access Private (nécessite authentification)
 */
router.get('/platform/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result: Games[] = await GameService.getGamesByPlatform (id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_BY_PLATFORM_ID_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_PLATFORMS_LIMITED_FAILED', error: error });
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
router.post('/platform/:id/limited', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const { limit, offset } = req.body;
		const result: Games[] = await GameService.getGamesLimitedByPlatformId (id, limit, offset);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_PLATFORMS_LIMITED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
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
router.get('/platform/:id/limited/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result: number = await GameService.getGamesCountByPlatformId(id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_BY_PLATFORM_ID_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
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
router.post('/search', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const { limit, offset , searchTerm } = req.body;
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { message: 'User ID manquant' });
		}
		const result: Games[] = await GameService.getGamesSearch(searchTerm, limit, offset, userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_SEARCH_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
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
router.post('/search/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { searchTerm } = req.body;
		const result: number = await GameService.getGamesSearchCount(searchTerm);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_SEARCH_COUNT_NOT_FOUND' });
		}
	return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_SEARCH_COUNT_FAILED', error: error });
	}
});

router.post('/prices', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { gameId, platformId } = req.body;
		const result: Prices[] = await GameService.getGamePrices(gameId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'PRICES_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PRICES_FAILED', error: error });
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
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const result : Game = await GameService.getGame(id);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAME_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les jeux
 * 
 * @see GameService.getConditionsCart() - Fonction service appelée
 * @see getConditionsCart (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/conditions/cart
 * @access Private (nécessite authentification)
 */
router.get('/conditions/cart', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result: Conditions[] = await GameService.getCartConditions();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'CONDITIONS_CART_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_CONDITIONS_CART_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les cartouches de jeux
 * 
 * @see GameService.getConditionsGames() - Fonction service appelée
 * @see getConditionsGames (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/conditions/box
 * @access Private (nécessite authentification)
 */
router.get('/conditions/box', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result: Conditions[] = await GameService.getBoxConditions();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'CONDITIONS_BOX_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_CONDITIONS_BOX_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les notices/manuels de jeux
 * 
 * @see GameService.getConditionsGames() - Fonction service appelée
 * @see getConditionsGames (games.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /games/conditions/manual
 * @access Private (nécessite authentification)
 */


router.get('/conditions/notice', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result: Conditions[] = await GameService.getNoticeConditions();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'CONDITIONS_MANUAL_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_CONDITIONS_MANUAL_FAILED', error: error });
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
