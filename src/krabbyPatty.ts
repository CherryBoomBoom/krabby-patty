import getExpress from "./lib/getExpress";
import * as path from "path";
import loadFood from "./lib/loadFood";

const SECCESS_LOG=`\n🍔  Server run at \x1B[1;32mhttp://localhost:`
const defaultConfig = {port:3000}

export default function krabbyPatty(option:{config?:any,module?:any} = {config:defaultConfig}) {
  const config = option.config;
  const baseDir = config.baseDir || process.cwd();
  let BaseModule
  try{
    BaseModule = option.module || require(path.join(baseDir, "./base.module.ts")).default;
  }catch(_e){
    BaseModule = require('./lib/baseModule').default;
  }
  let baseModule = new BaseModule();
  let app = getExpress(baseModule);
  const food = new loadFood({ baseDir, module, app });
  baseModule = food.module;
  app = food.app;
  app.module = baseModule;
  app.listen(config.port, () => {
    console.log(SECCESS_LOG+config.port+'\x1B[0m');
  });
}
