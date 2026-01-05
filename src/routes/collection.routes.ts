import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import CollectionService from "@services/collection.service";
import { CollectionGameOwned, AddGameCollection, AddPlatformCollection, CollectionPlatformOwnedInfo, CollectionPlatformsGamesOwned, CollectionPlatformsList, CollectionPlatformsManufacturerOwned } from "@utils/interfaces/collection.interface";
const router: Router = Router();


router.get('/:userId/platforms/owned', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {	
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result : CollectionPlatformsList[] = await CollectionService.getCollectionPlatformsList(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'COLLECTION_PLATFORMS_LIST_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_PLATFORMS_LIST_FAILED', error: error });
	}
});

router.get('/:userId/platform/:platformId/owned/info', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const platformId = req.params.platformId;
		if (!userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result : CollectionPlatformOwnedInfo[] = await CollectionService.getCollectionPlatformOwnedInfo(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'COLLECTION_PLATFORM_OWNED_INFO_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_PLATFORM_OWNED_INFO_FAILED', error: error });
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

 

router.get('/:userId/platforms/games/owned', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result : CollectionPlatformsGamesOwned[] = await CollectionService.getCollectionPlatformsGamesOwned(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'COLLECTION_PLATFORMS_GAMES_LIST_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_PLATFORMS_GAMES_LIST_FAILED', error: error });
	}
});

router.get('/:userId/platform/:platformId/games/owned',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		const platformId = req.params.platformId;
		if (!userId || !platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'USER_ID_OR_PLATFORM_ID_NOT_FOUND' });
		}
		const result : CollectionGameOwned[] = await CollectionService.getCollectionGamesOwned(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'COLLECTION_GAMES_OWNED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_GAMES_OWNED_FAILED', error: error });
	}
});

router.post('/add/game',  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const addGameCollection: AddGameCollection = req.body;

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

router.post('/:userId/game/delete', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		console.log('req.body:', req.body);
		const userId = req.params.userId;
		const idUserGameCollection = req.body.idUserGameCollection;
		if (!idUserGameCollection || !userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await CollectionService.deleteGameFromCollection(userId, idUserGameCollection);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'DELETE_GAME_FROM_COLLECTION_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'DELETE_GAME_FROM_COLLECTION_FAILED', error: error });
	}
});

router.post('/:userId/platform/delete', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		console.log('req.body:', req.body);
		const userId = req.params.userId;
		console.log('userId:', userId);
		const platformId = req.body.platformId;
		if (!platformId || !userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await CollectionService.deletePlatformFromCollection(userId, platformId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'DELETE_PLATFORM_FROM_COLLECTION_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'DELETE_PLATFORM_FROM_COLLECTION_FAILED', error: error });
	}
});

router.get('/:userId/platforms/manufacturer/owned', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {

	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result : CollectionPlatformsManufacturerOwned[] = await CollectionService.getCollectionPlatformsManufacturerOwned(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GET_COLLECTION_PLATFORMS_MANUFACTURER_OWNED_FAILED' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_COLLECTION_PLATFORMS_MANUFACTURER_OWNED_FAILED', error: error });
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
