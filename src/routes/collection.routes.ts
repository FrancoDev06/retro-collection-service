import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import CollectionService from "@services/collection.service";
import { AddGameCollection } from "@utils/interfaces/collection.interface";

const router: Router = Router();


/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les boîtes de jeux
 * 
 * @see CollectionService.getConditionsBoxed() - Fonction service appelée
 * @see getConditionsBoxed (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/conditions/box
 * @access Private (nécessite authentification)
 */
router.get('/conditions/box',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result = await CollectionService.getConditionsBoxed();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_STATUS_BOXED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les cartouches de jeux
 * 
 * @see CollectionService.getConditionsCart() - Fonction service appelée
 * @see getConditionsCart (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/conditions/cart
 * @access Private (nécessite authentification)
 */
router.get('/conditions/cart',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result = await CollectionService.getConditionsCart();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_STATUS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

/**
 * ROUTE API : Récupère tous les états de condition disponibles pour les notices/manuels de jeux
 * 
 * @see CollectionService.getConditionsManual() - Fonction service appelée
 * @see getConditionsManual (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/conditions/manual
 * @access Private (nécessite authentification)
 */
router.get('/conditions/manual',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result = await CollectionService.getConditionsManual();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_STATUS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

/**
 * ROUTE API : Ajoute un jeu à la collection d'un utilisateur
 * Vérifie d'abord si le jeu et la plateforme existent déjà dans la collection
 * 
 * @see CollectionService.checkGameExistsInCollection() - Vérification de l'existence du jeu
 * @see CollectionService.checkPlatformExistsInCollection() - Vérification de l'existence de la plateforme
 * @see CollectionService.addGameToCollection() - Fonction service appelée pour ajouter le jeu
 * @see addGameToCollection (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /collection/new
 * @access Private (nécessite authentification)
 * @body {AddGameCollection} - Données du jeu à ajouter à la collection
 */
router.post('/game/new',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const addGameCollection: AddGameCollection = req.body;
		console.log("addGameCollection:", addGameCollection);

		if (!addGameCollection || !addGameCollection.gameId || !addGameCollection.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		// const gameExists = await CollectionService.checkGameExistsInCollection(addGameCollection.userId, addGameCollection.gameId , addGameCollection.platformId);


		// const platformExists = await CollectionService.checkPlatformExistsInCollection(addGameCollection.userId, addGameCollection.platformId);
		// if (platformExists) {
		// 	return ResponsesUtil.invalidParameters(res, { error: 'PLATFORM_ALREADY_IN_COLLECTION' });
		// }


		const result = await CollectionService.addGameToCollection(
			addGameCollection.userId,
			addGameCollection.gameId,
			addGameCollection.platformId,
			addGameCollection.status,
			addGameCollection.edition,
			addGameCollection.format,
			addGameCollection.notes,
			addGameCollection.pricePaid,
			addGameCollection.datePurchase,
			addGameCollection.hasGame,
			addGameCollection.hasBox,
			addGameCollection.hasNotice,
			addGameCollection.cartConditionId,
			addGameCollection.boxConditionId,
			addGameCollection.noticeConditionId,
		);

		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_GAME_TO_COLLECTION_FAILED' });
		}


		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'ADD_GAME_TO_COLLECTION_FAILED', error: error });
	}
});

// /**
//  * ROUTE API : Compte le nombre total de jeux dans la collection d'un utilisateur
//  * 
//  * @see CollectionService.geGamesCount() - Fonction service appelée
//  * @see getGamesCount (collection.queries.ts) - Requête SQL utilisée
//  * 
//  * @route GET /collection/:userId/games/count
//  * @access Private (nécessite authentification)
//  * @param {string} userId - ID de l'utilisateur
//  */
// router.get('/:userId/games/count',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const userId = req.params.userId;
// 		if (!userId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getGamesCount(userId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'GAMES_COUNT_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {	
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_FAILED', error: error });
// 	}
// });

// /**
//  * ROUTE API : Calcule la valeur totale payée pour tous les jeux de la collection d'un utilisateur
//  * 
//  * @see CollectionService.getGamesValue() - Fonction service appelée
//  * @see getGamesValue (collection.queries.ts) - Requête SQL utilisée
//  * 
//  * @route GET /collection/:userId/games/value
//  * @access Private (nécessite authentification)
//  * @param {string} userId - ID de l'utilisateur
//  */
// router.get('/:userId/games/value',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const userId = req.params.userId;
// 		if (!userId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getGamesValue(userId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'GAMES_VALUE_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_VALUE_BY_PLATFORM_FAILED', error: error });
// 	}
// });


// /**
//  * ROUTE API : Compte le nombre total de plateformes uniques dans la collection de jeux d'un utilisateur
//  * 
//  * @see CollectionService.getPlatformsCount() - Fonction service appelée
//  * @see getPlatformsCount (collection.queries.ts) - Requête SQL utilisée
//  * 
//  * @route GET /collection/:userId/platforms/count
//  * @access Private (nécessite authentification)
//  * @param {string} userId - ID de l'utilisateur
//  */
// router.get('/:userId/platforms/count',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const userId = req.params.userId;
// 		if (!userId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getPlatformsCount(userId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'PLATFORMS_COUNT_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_PLATFORMS_COUNT_FAILED', error: error });
// 	}
// });


// /**
//  * ROUTE API : Compte le nombre de jeux CIB (Complete In Box) dans la collection d'un utilisateur
//  * Un jeu CIB doit avoir le statut 'owned' et posséder la boîte, la notice et le jeu
//  * 
//  * @see CollectionService.getGamesCibCount() - Fonction service appelée
//  * @see getGamesCibCount (collection.queries.ts) - Requête SQL utilisée
//  * 
//  * @route GET /collection/:userId/games/cib
//  * @access Private (nécessite authentification)
//  * @param {string} userId - ID de l'utilisateur
//  */
// router.get('/:userId/games/cib',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const userId = req.params.userId;
// 		if (!userId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getGamesCibCount(userId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'GAMES_CIB_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_CIB_FAILED', error: error });
// 	}
// });



// router.get('/:userId/platforms/list',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {	
// 	try {
// 		const userId = req.params.userId;
// 		if (!userId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getPlatformList(userId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'PLATFORM_LIST_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORM_LIST_FAILED', error: error });
// 	}
// });

// router.get('/:userId/platforms/:platformId/games/list',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
// 	try {
// 		const userId = req.params.userId;
// 		const platformId = req.params.platformId;
// 		if (!userId || !platformId) {
// 			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_OR_PLATFORM_ID_NOT_FOUND' });
// 		}
// 		const result = await CollectionService.getGamesListByPlatformId(userId, platformId);
// 		if (!result) {
// 			return ResponsesUtil.notFound(res, { error: 'GAMES_LIST_BY_PLATFORM_NOT_FOUND' });
// 		}
// 		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
// 	} catch (error) {
// 		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_LIST_BY_PLATFORM_FAILED', error: error });
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
export { router as CollectionRouter };
