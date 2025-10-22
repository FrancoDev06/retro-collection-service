

import ResponsesUtil from "@utils/responses.util";
import { RouteRouter } from "@utils/router.util";

const router: RouteRouter = new RouteRouter("Root");


router.register(`ALL`,  `/`, async ({ res }): Promise<void> => {
	return ResponsesUtil.handleResult(res, {
		info: `execok`,
		additional: `🌩️ « Krypton-safe by design. » - Lifeaz Cloud Team - https://lifeaz.co`
	});
});


/**
 *  Export
 */

const exported = router.wrap();
export { exported as RootRouter };
