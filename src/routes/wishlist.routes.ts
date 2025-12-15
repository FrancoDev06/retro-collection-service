import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { AddGameWishlist } from "@utils/interfaces/wishlist.interface";
import WishlistService from "@services/wishlist.service";

const router: Router = Router();


/**
 * ROUTE API : Ajoute un jeu à la wishlist d'un utilisateur
 * 
 * @see WishlistService.addGameToWishlist() - Fonction service appelée
 * @see addGameToWishlist (wishlist.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /wishlist/new
 * @access Private (nécessite authentification)
 * @body {AddGameWishlist} - Données du jeu à ajouter à la wishlist
 */

router.post('/new', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		
		const addGameWishlist: AddGameWishlist = req.body;
		if (!addGameWishlist || !addGameWishlist.gameId || !addGameWishlist.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		const gameExists = await WishlistService.checkGameExistsInWishlist(addGameWishlist.userId, addGameWishlist.gameId , addGameWishlist.platformId);
		if (gameExists) {
			return ResponsesUtil.invalidParameters(res, { error: 'GAME_ALREADY_IN_WISHLIST' });
		}

		const result = await WishlistService.addGameToWishlist(
			addGameWishlist.userId,
			addGameWishlist.gameId,
			addGameWishlist.platformId,
			addGameWishlist.notes,
			addGameWishlist.priceTarget,
			addGameWishlist.priority,
			addGameWishlist.retailerLink,
		);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_GAME_TO_WISHLIST_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'ADD_GAME_TO_WISHLIST_FAILED', details: error as string });
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

router.get('/:userId/games/list', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}

		const result = await WishlistService.getGamesFromWishlist(userId);
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

router.post('/game/delete', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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


router.get('/:userId/platform/:platformId/list', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const platformId = req.params.platformId;
		if (!userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await WishlistService.getGamesFromWishlistByPlatformId(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_GAMES_FROM_WISHLIST_BY_PLATFORM_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'GET_GAMES_FROM_WISHLIST_BY_PLATFORM_FAILED', details: error as string });
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
