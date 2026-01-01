import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { AddGameWishlist, AddPlatformWishlist } from "@utils/interfaces/wishlist.interface";
import WishlistService from "@services/wishlist.service";
import { authMiddleware } from "@middlewares/auth.middleware";

const router: Router = Router();


/**
 * ROUTE API : Ajoute un jeu à la wishlist d'un utilisateur
 * 
 * @see WishlistService.addGameToWishlist() - Fonction service appelée
 * @see addGameToWishlist (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /wishlist/add/game
 * @access Private (nécessite authentification)
 * @body {AddGameWishlist} - Données du jeu à ajouter à la wishlist
 */

router.post('/add/game', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		
		const addGameWishlist: AddGameWishlist = req.body.addGameWishlist || req.body;
		console.log('addGameWishlist:', addGameWishlist);
		if (!addGameWishlist.userId || !addGameWishlist.gameId || !addGameWishlist.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		const result = await WishlistService.addGameToWishlist(
			addGameWishlist.userId,
			addGameWishlist.gameId,
			addGameWishlist.platformId,
			addGameWishlist.priceTarget,
			addGameWishlist.notes || '',
			addGameWishlist.addedAt,
			addGameWishlist.priorityId || addGameWishlist.priority || '',
			addGameWishlist.condition
		);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_GAME_TO_WISHLIST_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'ADD_GAME_TO_WISHLIST_FAILED', details: error as string });
	}
});


router.post('/add/platform', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		
		const addPlatformWishlist: AddPlatformWishlist = req.body.addPlatformWishlist || req.body;
		console.log('addPlatformWishlist:', addPlatformWishlist);
		if (!addPlatformWishlist.userId || !addPlatformWishlist.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		const result = await WishlistService.addPlatformToWishlist(
			addPlatformWishlist.userId,
			addPlatformWishlist.platformId,
			addPlatformWishlist.priceTarget,
			addPlatformWishlist.notes || '',
			addPlatformWishlist.addedAt,
			addPlatformWishlist.priorityId || '',
			addPlatformWishlist.condition || ''
		);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_PLATFORM_TO_WISHLIST_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'ADD_PLATFORM_TO_WISHLIST_FAILED', details: error as string });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux de la wishlist d'un utilisateur
 * 
 * @see WishlistService.getGamesFromWishlist() - Fonction service appelée
 * @see getGamesFromWishlist (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /wishlist/:userId/games/list
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 */

router.get('/:userId/platform/:platformId/games/list', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const platformId = req.params.platformId;
		if (!userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}

		const result = await WishlistService.getGamesFromWishlist(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_GAMES_FROM_WISHLIST_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_GAMES_FROM_WISHLIST_FAILED', details: error as string });
	}
});


/**
 * ROUTE API : Supprime un jeu de la wishlist d'un utilisateur
 * 
 * @see WishlistService.deleteGameFromWishlist() - Fonction service appelée
 * @see deleteGameFromWishlist (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /wishlist/game/delete
 * @access Private (nécessite authentification)
 * @body {string} gameId - ID du jeu
 * @body {string} userId - ID de l'utilisateur
 * @body {string} platformId - ID de la plateforme
 */	

router.post('/game/delete', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { gameId, userId, platformId } = req.body;
		if (!gameId || !userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		const result = await WishlistService.deleteGameFromWishlist(userId, gameId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'DELETE_GAME_FROM_WISHLIST_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'DELETE_GAME_FROM_WISHLIST_FAILED', details: error as string });
	}
});

/**
 * ROUTE API : Récupère la liste des plateformes de la wishlist d'un utilisateur
 * 
 * @see WishlistService.getWishlistPlatforms() - Fonction service appelée
 * @see getWishlistPlatforms (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /wishlist/:userId/platforms/list
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 */
router.get('/:userId/platforms/list', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await WishlistService.getWishlistPlatforms(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_WISHLIST_PLATFORMS_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_GAMES_FROM_WISHLIST_BY_PLATFORM_FAILED', details: error as string });
	}	
});

router.get('/:userId/platform/:platformId/game/:gameId', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const gameId = req.params.gameId;
		const platformId = req.params.platformId;
		if (!userId || !gameId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await WishlistService.getWishlistPlatformGame(userId, gameId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_GAMES_FROM_WISHLIST_BY_PLATFORM_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	}
	catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_GAMES_FROM_WISHLIST_BY_PLATFORM_FAILED', details: error as string });
	}
});

router.get('/priorities', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result = await WishlistService.getPriorities();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_PRIORITIES_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_PRIORITIES_FAILED', details: error as string });
	}
});

/**
 * ROUTE API : Récupère la liste des jeux dans la wishlist d'un utilisateur
 * 
 * @see WishlistService.getGamesList() - Fonction service appelée
 * @see getGamesList (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /wishlist/:userId/games/list
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 */
router.get('/:userId/games/list', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await WishlistService.getGamesList(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_LIST_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_LIST_FAILED', error: error });
	}
});


router.get('/:userId/platforms/wish', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await WishlistService.getPlatformsFromWishlist(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_WISHLIST_PLATFORMS_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_WISHLIST_PLATFORMS_FAILED', details: error as string });
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
export { router as WishlistRouter };
