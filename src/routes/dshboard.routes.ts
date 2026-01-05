import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import ResponsesUtil from "@utils/responses.util";
import { authMiddleware } from "@middlewares/auth.middleware";
import DashboardService from "@services/dashboard.service";

const router: Router = Router();


/**
 * ROUTE API : Récupère le total des valeurs des jeux dans la collection d'un utilisateur
 * 
 * @see DashboardService.getGamesValue() - Fonction service appelée
 * @see getGamesValue (dashboard.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /dashboard/:userId/games/value
 * @access Private (nécessite authentification)
 */
router.get('/:userId/games/value', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await DashboardService.getGamesValue(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'TOTAL_VALUE_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_TOTAL_VALUE_FAILED', error: error });
	}
});


/**
 * ROUTE API : Récupère le total des jeux dans la collection d'un utilisateur
 * 
 * @see DashboardService.getGamesCount() - Fonction service appelée
 * @see getGamesCount (dashboard.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /dashboard/:userId/games/count
 * @access Private (nécessite authentification)
 */
router.get('/:userId/games/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await DashboardService.getGamesCount(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'TOTAL_GAMES_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_TOTAL_GAMES_FAILED', error: error });
	}
});


/**
 * ROUTE API : Récupère le total des plateformes dans la collection d'un utilisateur
 * 
 * @see DashboardService.getPlatformsCount() - Fonction service appelée
 * @see getPlatformsCount (dashboard.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /dashboard/:userId/platforms/count
 * @access Private (nécessite authentification)
 */
router.get('/:userId/platforms/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		    const result = await DashboardService.getPlatformsCount(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'PLATFORM_COUNT_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_PLATFORM_COUNT_FAILED', error: error });
	}
});


/**
 * ROUTE API : Récupère le total des jeux CIB dans la collection d'un utilisateur
 * 
 * @see DashboardService.getGamesCibCount() - Fonction service appelée
 * @see getGamesCibCount (dashboard.queries.ts) - Requête SQL utilisée
 * 
 * @route GET /dashboard/:userId/games/cib/count
 * @access Private (nécessite authentification)
 */
router.get('/:userId/games/cib/count', authMiddleware, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const userId = req.params.userId;
		if (!userId) {
			return ResponsesUtil.invalidParameters(res, { error: 'MISSING_PARAMETERS' });
		}
		const result = await DashboardService.getGamesCibCount(userId);
		if (!result) {
			return ResponsesUtil.notFound(res, { error: 'GAMES_CIB_COUNT_NOT_FOUND' });
		}
		return ResponsesUtil.handleResult(res, { info: 'execok', data: { result } });
	} catch (error) {
		return ResponsesUtil.somethingWentWrong(res, { id_case: 'GET_GAMES_CIB_COUNT_FAILED', error: error });
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
export { router as DashboardRouter };