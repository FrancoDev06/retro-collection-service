import cors from "cors";
import helmet from "helmet";
import { Express, Router, Request, Response, NextFunction, json, text, urlencoded } from "express";

import ResponsesUtil from "@utils/responses.util";
import { logMiddleware } from "@middlewares/log.middleware";
import RootRouter from "@routes/root.routes";
import { UsersRouter } from "@routes/user.routes";
// import { GamesRouter } from "@routes/games.routes";
// import { CollectionRouter } from "@routes/collection.routes";
// import { WishlistRouter } from "@routes/wishlist.routes";
// import { PlatformRouter } from "@routes/platform.routes";
// import { DashboardRouter } from "@routes/dshboard.routes";


export default class RoutesUtil {


	static async init(instance: Express): Promise<void> {
		const version = instance.get('versionShort');
		const product = instance.get('product');
		const side = instance.get('side');

		instance.use(cors());
		instance.use(json());
		instance.use(text());
		instance.use(helmet());
		instance.use(urlencoded({ extended: true }));
		instance.use(logMiddleware);


		const add = (path: string, router: Router) => instance.use(`/${product}/${side}/v${version}/${path}`, router);

		add('', RootRouter);
		add('users', UsersRouter);
		// add('games', GamesRouter);
		// add('collection', CollectionRouter);
		// add('wishlist', WishlistRouter);
		// add('platforms', PlatformRouter);
		// add('dashboard', DashboardRouter);

		instance.use((error: any, __: Request, res: Response, ___: NextFunction) => ResponsesUtil.somethingWentWrong(res, error instanceof SyntaxError ? { id_case: 'MISFORMED_JSON_BODY' } : {}));
		instance.use((_: Request, res: Response, __: NextFunction) => ResponsesUtil.notFound(res));
	}
}
