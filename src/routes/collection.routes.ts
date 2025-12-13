import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import CollectionService from "@services/collection.service";
import { AddGameCollection } from "@utils/interfaces/collection.interface";

const router: Router = Router();


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
router.post('/new',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const addGameCollection: AddGameCollection = req.body;
		console.log('addGameCollection:', addGameCollection);

		if (!addGameCollection || !addGameCollection.gameId || !addGameCollection.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}

		const gameExists = await CollectionService.checkGameExistsInCollection(addGameCollection.userId, addGameCollection.gameId , addGameCollection.platformId);
		console.log('gameExists:', gameExists);
		
		if (gameExists) {
			return ResponsesUtil.invalidParameters(res, { error: 'GAME_ALREADY_IN_COLLECTION' });
		}

		const result = await CollectionService.addGameToCollection(
			addGameCollection.userId,
			addGameCollection.gameId,
			addGameCollection.platformId,
			addGameCollection.notes,
			addGameCollection.pricePaid,
			addGameCollection.datePurchase,
			addGameCollection.hasCart,
			addGameCollection.hasBox,
			addGameCollection.hasNotice,
			addGameCollection.cartConditionId,
			addGameCollection.boxConditionId,
			addGameCollection.noticeConditionId,
		);
		console.log('result:', result);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_GAME_TO_COLLECTION_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'ADD_GAME_TO_COLLECTION_FAILED', details: error });
	}
});

/**
 * ROUTE API : Récupère la liste des plateformes dans la collection d'un utilisateur
 * 
 * @see CollectionService.getPlatformList() - Fonction service appelée
 * @see getPlatformList (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/:userId/platforms/list
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 */
router.get('/:userId/platforms/list',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {	
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const platformsList = await CollectionService.getPlatformList(userId);
		if (!platformsList) {
			return ResponsesUtil.notFound(res, { error: 'PLATFORM_LIST_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { platformsList } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORM_LIST_FAILED', error: error });
	}
});


/**
 * ROUTE API : Récupère la liste des jeux dans la collection d'un utilisateur pour une plateforme spécifique
 * 
 * @see CollectionService.getGamesListByPlatformId() - Fonction service appelée
 * @see getGamesListByPlatformId (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/:userId/platforms/:platformId/games/list
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 * @param {string} platformId - ID de la plateforme
 */
router.get('/:userId/platform/:platformId/games/list',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const platformId = req.params.platformId;
		if (!userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_OR_PLATFORM_ID_NOT_FOUND' });
		}
		const gamesList = await CollectionService.getGamesListByPlatformId(userId, platformId);
		if (!gamesList) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_LIST_BY_PLATFORM_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { gamesList } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_LIST_BY_PLATFORM_FAILED', error: error });
	}
});

router.post('/:userId/collection/game/delete', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const gameId = req.body.gameId;
		const platformId = req.body.platformId;
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'DELETE_GAME_FROM_COLLECTION_FAILED', error: error });
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







/***************************************************************
* NOT ALLOWED METHODS HANDLING
***************************************************************/

router.all('/actives', async (req: Request, res: Response, next: NextFunction): Promise<void> => ResponsesUtil.methodNotAllowed(res));

/**************************************************************/

/*
	Export
*/
export { router as CollectionRouter };
