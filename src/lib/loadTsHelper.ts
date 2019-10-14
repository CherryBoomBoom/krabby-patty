import { BASE_DIR, CONTROLLER_DIR, SERVICE_DIR } from "./loadFood";
import * as path from "path";
import * as fs from "fs";

export default class LoadTsHelper{
	private GLOBAL_BASE_DIR = ''
	private GLOBAL_TYPINGS_BASE_DIR = ''
	constructor(Module){
		this.GLOBAL_BASE_DIR = this.getBaseDir(Module);
		this.GLOBAL_TYPINGS_BASE_DIR = path.join(this.GLOBAL_BASE_DIR, 'typings');
		fs.rmdirSync(this.GLOBAL_TYPINGS_BASE_DIR)
		this.load(Module, this.GLOBAL_TYPINGS_BASE_DIR);
	}

	private load(Module, typeBaseDir, dir = "") {
		typeBaseDir = path.join(typeBaseDir, dir ? "module" : "", dir);
		let baseDir = this.getBaseDir(Module);
		for (let i of Object.getOwnPropertySymbols(Module)) {
			if (CONTROLLER_DIR === i) this.loadModelFile(baseDir, typeBaseDir, Module[i],'controller');
			if (SERVICE_DIR === i) this.loadModelFile(baseDir,typeBaseDir,Module[i],'service')
		}
		if (!!Object.keys(Module.module).length) {
			for (let i of Object.keys(Module.module)) {
				this.load(Module.module[i], typeBaseDir, i);
			}
		}
	}

	private getBaseDir(Module) {
		for (let i of Object.getOwnPropertySymbols(Module)) {
			if (BASE_DIR === i) return Module[i];
		}
	}

	private loadModelFile(
		baseDir: string,
		typeBaseDir: string,
		Names: string[],
		key: string
	) {
		let modelFile = ``;
		let modelFileBody = ``;
		let loadPath = path.join(typeBaseDir, key, "index.d.ts");
		let interfaceName = key.charAt(0).toUpperCase() + key.slice(1);
		for (let i of Names) {
			let fileName = i.replace(path.extname(i), "");
			let filePath = path.join(baseDir, key, i);
			let exportFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
			modelFile += `
			import Export${exportFileName} from ${path.relative(loadPath, filePath)}
			`;
			modelFileBody += `
			
				${fileName}: Export${exportFileName}
		`;
		}
		modelFile += `
	
		export default interface I${interfaceName} {
			${modelFileBody}
		}
		`;
		console.log(modelFile);
		return modelFile;
	}
}
