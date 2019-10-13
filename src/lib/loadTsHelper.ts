import { BASE_DIR, CONTROLLER_DIR, SERVICE_DIR } from "./loadFood";
import * as path from "path";
import * as fs from "fs";

let GLOABL_BASE_DIR = "";
export default Moduel => {
  for (let i of Object.getOwnPropertySymbols(Moduel))
    if (BASE_DIR.description === i.description) GLOABL_BASE_DIR = Moduel[i];
  GLOABL_BASE_DIR = path.join(GLOABL_BASE_DIR, "typings");
  load(Moduel, GLOABL_BASE_DIR);
};

function load(Moduel, baseDir, dir = '') {
  let itemBaseDir = path.join(baseDir,dir?'module':'',dir);
  console.log(itemBaseDir);
  for (let i of Object.getOwnPropertySymbols(Moduel)) {
    if (CONTROLLER_DIR.description === i.description) getControler(Moduel[i]);
    if (SERVICE_DIR.description === i.description) getService(Moduel[i]);
  }
  if (!!Object.keys(Moduel.module).length) {
    for (let i of Object.keys(Moduel.module)) {
      load(Moduel.module[i], itemBaseDir, i);
    }
  }
}
function getControler(itemBaseDir:string,controllerNames:string[]) {
  console.log(1, controllerNames);
}
function getService(itemBaseDir:string,serviceNames:string[]) {
  console.log(2, serviceNames);
  let modelFile = ``
  for(let i of serviceNames){
    let fileName = i.replace(path.extname(i),'')
    let filePath = path.join(itemBaseDir,i)
    modelFile+=
    `
    import export${fileName} from ${filePath}
    `
  }
  modelFile+=
  `
  
  export default interface IService{
    a:string,
    b:string,
    c:string,
  }
  `
}
declare global {
  interface Symbol {
    description: string;
  }
}
