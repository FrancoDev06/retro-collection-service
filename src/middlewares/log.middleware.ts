import LogUtil from "@utils/log.util";
import { Request, Response, NextFunction } from "express";
import dayjs from "dayjs";

export const logMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const start = dayjs();
	res.on('finish', () => {
		if (!req) return;

		const end = dayjs();
		const duration = end.diff(start);

		LogUtil.conslog(`[HTTP/${req.httpVersion}] (${req.route?.path}) ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
	});
	next();
};
