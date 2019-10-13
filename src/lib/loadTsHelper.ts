import { BASE_DIR, CONTROLLER_DIR, SERVICE_DIR } from "./loadFood";
import * as path from "path";

let GLOABL_BASE_DIR = "";
export default Moduel => {
  for (let i of Object.getOwnPropertySymbols(Moduel))
    if (BASE_DIR.description === i.description) GLOABL_BASE_DIR = Moduel[i];
  GLOABL_BASE_DIR = path.join(GLOABL_BASE_DIR, "typings");
  load(Moduel, GLOABL_BASE_DIR);
};

function load(Moduel, baseDir, dir = "") {
  let itemBaseDir = path.join(baseDir, dir);
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
function getControler(controllerNames) {
  console.log(1, controllerNames);
}
function getService(serviceNames) {
  console.log(2, serviceNames);
}
declare global {
  interface Symbol {
    description: string;
  }
}
