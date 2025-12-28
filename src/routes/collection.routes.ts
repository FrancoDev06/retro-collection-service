import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import CollectionService from "@services/collection.service";
import { AddGameCollection, AddPlatformCollection, CollectionPlatform } from "@utils/interfaces/collection.interface";

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
 * @route POST /collection/add/game
 * @access Private (nécessite authentification)
 * @body {AddGameCollection} - Données du jeu à ajouter à la collection
 */
router.post('/add/game',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const addGameCollection: AddGameCollection = req.body;
		console.log('addGameCollection:', addGameCollection);

		if (!addGameCollection || !addGameCollection.gameId || !addGameCollection.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
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
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_GAME_TO_COLLECTION_FAILED' });
		}

		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { error: 'ADD_GAME_TO_COLLECTION_FAILED', details: error });
	}
});

/**
 * ROUTE API : Supprime un jeu de la collection d'un utilisateur
 * 
 * @see CollectionService.deleteGameFromCollection() - Fonction service appelée
 * @see deleteGameFromCollection (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route POST /collection/game/delete
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
		const result = await CollectionService.deleteGameFromCollection(userId, gameId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'DELETE_GAME_FROM_COLLECTION_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'DELETE_GAME_FROM_COLLECTION_FAILED', error: error });
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
		const result = await CollectionService.getPlatformList(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'PLATFORM_LIST_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
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
		const result = await CollectionService.getGamesListByPlatformId(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_LIST_BY_PLATFORM_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_LIST_BY_PLATFORM_FAILED', error: error });
	}
});


/**
 * ROUTE API : Récupère la liste des plateformes dans la collection d'un utilisateur
 * 
 * @see CollectionService.getCollectionPlatformListOwned() - Fonction service appelée
 * @see getCollectionPlatformListOwned (collection.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /collection/:userId/platforms/owned
 * @access Private (nécessite authentification)
 * @param {string} userId - ID de l'utilisateur
 */
router.get('/:userId/platforms/owned', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result : CollectionPlatform[] = await CollectionService.getCollectionPlatformListOwned(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'COLLECTION_PLATFORM_LIST_OWNED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_PLATFORM_LIST_OWNED_FAILED', error: error });
	}
});

router.post('/add/platform', async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	try {
		const addPlatformCollection: AddPlatformCollection = req.body;
		console.log('addPlatformCollection:', addPlatformCollection);
		const result = await CollectionService.addPlatformToCollection(
			addPlatformCollection.userId,
			addPlatformCollection.platformId,
			addPlatformCollection.units,
			addPlatformCollection.conditionStateId,
			addPlatformCollection.purchaseSource,
			addPlatformCollection.pricePaid,
			addPlatformCollection.acquiredAt,
			addPlatformCollection.notes,
		);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'ADD_PLATFORM_TO_COLLECTION_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'ADD_PLATFORM_TO_COLLECTION_FAILED', error: error });
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
export { router as CollectionRouter };
