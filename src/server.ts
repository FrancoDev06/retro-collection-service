if (process.env.NODE_ENV != 'dev') require('module-alias/register');


import express from "express";
import LogUtil from "./utils/log.util";
import RoutesUtil from "./utils/routes.util";
import DatabaseUtil from "@utils/database";


let app = express();


app.set("dbPort", 5432);
app.set("dbHost", process.env.DATABASE_HOST);
app.set("dbName", process.env.DATABASE_NAME);
app.set("dbUser", process.env.DATABASE_USER);
app.set("dbPsswd", process.env.DATABASE_PASSWORD);
app.set("port", process.env.PORT);
app.set("version", process.env.VERSION);
app.set("name", process.env.NAME);
app.set("product", process.env.PRODUCT);
app.set("side", process.env.SIDE);
app.set("versionShort", process.env.VERSION_SHORT);

app.set("jwtSecret", process.env.JWT_SECRET);

const init = async () => {
	LogUtil.consinfo(`Mouting ${app.get('name')} code on /${app.get('product')}/${app.get('side')}/v${app.get('versionShort')}`);
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
		},
		{
			processes: [DatabaseUtil.init(app)],
			messages: {
				start: "Initializing database(s) connection(s)...",
				success: "Database(s) successfully configured.",
				fail: "Database(s) configuration failed!"
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
	LogUtil.conssuccess("➜ ", `Service marked ready. [RUN-${app.get('port')}]`);
};

init();

export default app;
