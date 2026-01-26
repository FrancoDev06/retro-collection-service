if (process.env.NODE_ENV != 'dev') require('module-alias/register');


import express from "express";
import LogUtil from "./utils/log.util";
import RoutesUtil from "./utils/routes.util";
import pkg from "../package.json";

let app = express();

type RetroConfig = { name: string; product: string; side: string; versionShort: number; versionCode: string; port: number; };
export const getRetroConfig = (): RetroConfig => {
	return (pkg as { retro: RetroConfig }).retro;
}

app.set("port", getRetroConfig().port);
app.set("product", getRetroConfig().product);
app.set("side", getRetroConfig().side);
app.set("versionShort", getRetroConfig().versionShort);
app.set("versionCode", getRetroConfig().versionCode);
app.set("name", getRetroConfig().name);

app.set("dbPort", process.env.DATABASE_PORT);
app.set("dbHost", process.env.DATABASE_HOST);
app.set("dbName", process.env.DATABASE_NAME);
app.set("dbUser", process.env.DATABASE_USER);
app.set("dbPsswd", process.env.DATABASE_PASSWORD);
app.set("supabaseUrl", process.env.SUPABASE_URL);
app.set("supabaseAnonKey", process.env.SUPABASE_ANON_KEY);

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
