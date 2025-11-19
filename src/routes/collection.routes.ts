import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import CollectionService from "@services/collection.service";
import { AddGameCollection } from "@utils/interfaces/collection.interface";

const router: Router = Router();

router.post('/add', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const addGameCollection: AddGameCollection = req.body;
		console.log("addGameCollection:", addGameCollection);

		if (!addGameCollection || !addGameCollection.gameId || !addGameCollection.platformId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}


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
			addGameCollection.hasBox,
			addGameCollection.hasNotice,
			addGameCollection.hasInserts,
			addGameCollection.cartConditionId,
			addGameCollection.boxConditionId,
			addGameCollection.noticeConditionId,
			addGameCollection.insertsConditionId,
			addGameCollection.hasGame,
		);

		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'ADD_GAME_TO_COLLECTION_FAILED', error: error });
	}
});

router.get('/status-box', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const result = await CollectionService.getGamesStatusBoxed();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_STATUS_BOXED_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

router.get('/status-cart', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result = await CollectionService.getGameStatusCart();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_STATUS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

router.get('/status-manual', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result = await CollectionService.getGameStatusManual();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_STATUS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

router.get('/status-inserts', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {

		const result = await CollectionService.getGameStatusInserts();
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAME_STATUS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_STATUS_BOXED_FAILED', error: error });
	}
});

router.get('/platforms', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await CollectionService.getUserPlatformsCollection(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_PLATFORMS_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_PLATFORMS_FAILED', error: error });
	}
});

router.get('/platforms-count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await CollectionService.getUserPlatformsCollectionCount(userId);
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_PLATFORMS_COUNT_FAILED', error: error });
	}
});

router.get('/games-count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await CollectionService.getUserGamesCount(userId);
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {	
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_COUNT_FAILED', error: error });
	}
});

router.get('/games-value', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await CollectionService.getUserGamesValue(userId);
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_VALUE_BY_PLATFORM_FAILED', error: error });
	}
});

router.get('/games-cib', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = (req as any).user?.userId;
		if (!userId) {
			return ResponsesUtil.unauthorizedAction(res, { error: 'USER_ID_NOT_FOUND' });
		}
		const result = await CollectionService.getUserGamesCib(userId);
		return ResponsesUtil.handleResult(res, { info: 'execko', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_CIB_FAILED', error: error });
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
