import { BASE_DIR, CONTROLLER_DIR, SERVICE_DIR } from "./loadFood";
import * as path from "path";
import * as fs from "fs";

let GLOBAL_BASE_DIR = "";
// let GLOBAL_TYPINGS_BASE_DIR = "";
export default Module => {
	for (let i of Object.getOwnPropertySymbols(Module)) {
		if (BASE_DIR === i) GLOBAL_BASE_DIR = Module[i];	
	}
	// GLOBAL_TYPINGS_BASE_DIR = path.join(GLOBAL_BASE_DIR, "typings");
	load(Module, GLOBAL_BASE_DIR);
};

function load(Module, baseDir, dir = '') {
	let itemBaseDir = path.join(baseDir, dir ? 'module' : '', dir);
	for (let i of Object.getOwnPropertySymbols(Module)) {
		if (CONTROLLER_DIR === i) getController(itemBaseDir, Module[i]);
		if (SERVICE_DIR === i) getService(itemBaseDir, Module[i]);
	}
	if (!!Object.keys(Module.module).length) {
		for (let i of Object.keys(Module.module)) {
			load(Module.module[i], itemBaseDir, i);
		}
	}
}
function getController(itemBaseDir: string, controllerNames: string[]) {
	console.log(1, controllerNames);
}
function getService(itemBaseDir: string, serviceNames: string[]) {
	console.log(2, serviceNames, itemBaseDir);
	let modelFile = ``
	for (let i of serviceNames) {
		let fileName = i.replace(path.extname(i), '')
		let filePath = path.join(itemBaseDir, i)
		modelFile +=
			`
    import export${fileName} from ${path.relative(filePath, GLOBAL_BASE_DIR)}
    `
	}
	modelFile +=
		`
  
  export default interface IService{
    a:string,
    b:string,
    c:string,
  }
  `
}
// declare global {
// 	interface Symbol {
// 		description: string;
// 	}
// }
