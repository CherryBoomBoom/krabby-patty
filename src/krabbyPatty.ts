import * as path from "path";
import cleanCache from "./lib/cleanCache";
import getExpress from "./lib/getExpress";
import LoadTsHelper from './lib/loadTsHelper'

const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`;
export const GLOBAL: { app: any; option: any } = { app: void 0, option: {} };
export default function krabbyPatty(
	option: {[key:string]:any}={},
  reload: boolean = false
): void {
	let startPath = path.dirname(require.main.filename);
	if (!Object.keys(option).length) {
		option = require(path.join(startPath, "./config/config.default")).default;
	}
	GLOBAL.option = Object.assign({}, option);
	let { port = 3000, baseDir = path.dirname(require.main.filename), modulePath = path.join(baseDir, "./base.module") } = option
	baseDir = baseDir || startPath;
	modulePath = modulePath || path.join(baseDir, "./base.module")
	const successMessage = reload
    ? "\x1B[1;32mCooking krabby patty success!\x1B[0m"
		: SUCCESS_LOG + port + "\x1B[0m";
	let module = require(modulePath).default;
  let MODULE = new module();
  let app = getExpress(MODULE);
  let loadFoodPath = path.join(__dirname, "./lib/loadFood");
  cleanCache(loadFoodPath)
  let loadFood =require(loadFoodPath).default;
	const food = new loadFood({ baseDir, module: MODULE, app, reload, config: Object.assign(option, { baseDir}) });
  MODULE = food.module;
  app = food.app;
  app.module = MODULE;
  app = require("http").createServer(app);
	app.listen(port, () => console.log(successMessage));
  GLOBAL.app = app;
  new LoadTsHelper(MODULE)
}
