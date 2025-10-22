if (process.env.NODE_ENV != 'dev') require('module-alias/register');


import express from "express";
import LogUtil from "./utils/log.util";
import RoutesUtil from "./utils/routes.util";

let app = express();


const init = async () => {
	LogUtil.consinfo(`Mouting ${app.get('name')} code on /${app.get('product')}/server/v${app.get('versionShort')}`);
	LogUtil.conslog(`${app.get('versionFull')} (${app.get("versionCode")}) [RUN-${app.get('runIdentifier')}]`);
	LogUtil.conslog("");

	const steps = [
		{
			processes: [RoutesUtil.init(app)],
			messages: {
				start: "Initializing routes...",
				success: "Routes successfully configured.",
				fail: "Routes configuration failed!"
			}
		},
		{
			processes: [new Promise<void>((resolve) => app.listen(app.get('port'), () => resolve()))],
			messages: {
				start: "Listening on service port...",
				success: `API ready to receive requests on port ${app.get('port')}.`,
				fail: "API cannot listen on the configured port!"
			}
		}
	]

	let failed = false;

	for (let step of steps) {
		try {
			LogUtil.conslog("➜ ", step.messages.start);
			await Promise.all(step.processes);
			LogUtil.conssuccess("   ↳", step.messages.success);
		} catch (error: any) {
			console.error(error);
			LogUtil.conserror("   ↳", step.messages.fail);
		}
	}

	if (failed) process.exit(1);

	app.set("readiness", true);
	LogUtil.conslog("");
	LogUtil.conssuccess("➜ ", `Service marked ready. [RUN-${app.get('runIdentifier')}]`);
};

init();

export default app;