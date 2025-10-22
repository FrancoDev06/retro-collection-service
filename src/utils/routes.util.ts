import cors from "cors";
import helmet from "helmet";
import { Express, Router, Request, Response, NextFunction, json, text, urlencoded } from "express";

import ResponsesUtil from "@utils/responses.util";
import { logMiddleware } from "@middlewares/log.middleware";
import { RootRouter } from "@routes/root.routes";


export default class RoutesUtil {


	static async init(instance: Express): Promise<void> {
		const version = 'v1';
		const product = 'retro-collection';
		const side = 'api';

		instance.use(cors());
		instance.use(json());
		instance.use(text());
		instance.use(helmet());
		instance.use(urlencoded({ extended: true }));
		instance.use(logMiddleware);


		const add = (path: string, router: Router) => instance.use(`/${product}/${side}/v${version}/${path}`, router);

		add('', RootRouter);

		instance.use((error: any, __: Request, res: Response, ___: NextFunction) => ResponsesUtil.somethingWentWrong(res, error instanceof SyntaxError ? { id_case: 'MISFORMED_JSON_BODY' } : {}));
		instance.use((_: Request, res: Response, __: NextFunction) => ResponsesUtil.notFound(res));
	}
}
