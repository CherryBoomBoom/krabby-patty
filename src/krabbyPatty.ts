import getExpress from "./lib/getExpress";
import * as path from "path";
import loadFood from "./lib/loadFood";
import * as fs from "fs";
import globby = require("globby");

const SECCESS_LOG=`\n🍔  Server run at \x1B[1;32mhttp://localhost:`
const defaultConfig = {port:3000}
export const GLOBAL:{app:any,option:any} = {app:void 0,option:{}}
export default function krabbyPatty(option:{config?:any,module?:any} = {config:defaultConfig},reload:boolean=false) {
  const config = option.config;
  GLOBAL.option = Object.assign({},option)
  const baseDir = config.baseDir || process.cwd();
  let BaseModule
  try{
    BaseModule = option.module || require(path.join(baseDir, "./base.module.ts")).default;
  }catch(_e){
    BaseModule = require('./lib/baseModule').default;
  }
  let baseModule = new BaseModule();
  let app = getExpress(baseModule);
  const food = new loadFood({ baseDir, module:baseModule, app });
  baseModule = food.module;
  app = food.app;
  app.module = baseModule;
  app = require('http').createServer(app);
  app.listen(config.port, () => {
    !reload?console.log(SECCESS_LOG+config.port+'\x1B[0m'):console.log('\x1B[1;32mCooking krabby patty success!\x1B[0m')
  });
  GLOBAL.app = app
  reloadFile(baseDir)
}
const reloadFile = (baseDir)=>{
  const filepaths = globby.sync(["**/*.ts"], { cwd: baseDir })
  for(let i of filepaths){
    let directory = path.resolve(baseDir, i);
    let startTime = Date.now()
    fs.watch(directory,()=>{
      if(Date.now()>startTime+500){
        console.log('\x1B[1;33mReCooking...')
        startTime = Date.now()
        GLOBAL.app.close()
        delete GLOBAL.app
        krabbyPatty(GLOBAL.option,true)
      }
    })
  }
}