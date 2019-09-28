import getExpress from "./lib/getExpress";
import * as path from "path";
import loadFood from "./lib/loadFood";

const SECCESS_LOG=`\n🍔  Server run at \x1B[1;32mhttp://localhost:`

export default function krabbyPatty(option:{config?:any,module?:any} = {}) {
  const config = option.config;
  const baseDir = config.baseDir || process.cwd();
  const BaseModule =
    option.module || require(path.join(baseDir, "./base.module.ts")).default;
  let app = getExpress();
  let baseModule = new BaseModule();
  const food = new loadFood({ baseDir, module, app });
  baseModule = food.module;
  app = food.app;
  app.module = baseModule;
  app.listen(config.port, () => {
    console.log(SECCESS_LOG+config.port+'\x1B[0m');
  });
}
