import * as path from "path";
import * as fs from "fs";
import cleanCache from "./lib/cleanCache";
import getExpress from "./lib/getExpress";
import LoadTsHelper from './lib/loadTsHelper'

const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`;
export const GLOBAL: { app: any; option: any } = { app: void 0, option: {} };
export default function krabbyPatty(
  option: { config?: any; module?: any } = { config: {} },
  reload: boolean = false
): void {
  let module = option.module || void 0;
  let config = option.config || {};
  let startPath = path.dirname(require.main.filename);
  const environment = process.argv[process.argv.length - 1];
  const isDev = /dev/g.test(environment);
  const baseConfig = require("./base/config.default").default;
  const baseModule = require("./base/base.module").default;
  if (!Object.keys(config).length) {
    try {
      let configPath = path.join(startPath, "./config/config.default");
			config = require(configPath).default;
    } catch (_e) {
			config = baseConfig;
    }
  }
	config.port = config.port || baseConfig.port;
	const successMessage = reload
    ? "\x1B[1;32mCooking krabby patty success!\x1B[0m"
    : SUCCESS_LOG + config.port + "\x1B[0m";
  GLOBAL.option = Object.assign({}, option);
  const baseDir = config.baseDir || startPath;
  try {
    if (!module) module = require(path.join(baseDir, "./base.module")).default;
  } catch (_e) {
    module = baseModule;
  }
  let MODULE = new module();
  let app = getExpress(MODULE);
  let loadFoodPath = path.join(__dirname, "./lib/loadFood");
  cleanCache(loadFoodPath)
  let loadFood =require(loadFoodPath).default;
  const food = new loadFood({ baseDir, module: MODULE, app, reload });
  MODULE = food.module;
  app = food.app;
  app.module = MODULE;
  app = require("http").createServer(app);
  app.listen(config.port, () => console.log(successMessage));
  GLOBAL.app = app;
  if (isDev) reloadFile(baseDir);
  new LoadTsHelper(MODULE)
}
const reloadFile = baseDir => {
  const filePaths = require.cache;
  let watcherArray: any[] = [];
	for (let filePath of Object.keys(filePaths)){
		let relativePath = path.relative(baseDir, filePath)
    if(/\.\./.test(relativePath))continue
		let itemWatcher = fs.watch(filePath, async () => {
      console.log("\x1B[1;33mReCooking...");
      await GLOBAL.app.close();
      watcherArray.map(i => i.close());
      krabbyPatty(GLOBAL.option, true);
    });
    watcherArray.push(itemWatcher);
  }
};
