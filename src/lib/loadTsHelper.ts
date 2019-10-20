import { MODULE_PATH, BASE_DIR, CONTROLLER_DIR, SERVICE_DIR, INGREDIENT } from "./loadFood";
import * as path from "path";
import * as fs from "fs";
import delDir from './delDir'
import { Schema,SchemaType, } from 'mongoose'
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

export default class LoadTsHelper {
	private GLOBAL_BASE_DIR = ''
	private GLOBAL_TYPINGS_BASE_DIR = ''
	constructor(Module) {
		this.GLOBAL_BASE_DIR = this.getBaseDir(Module);
		this.GLOBAL_TYPINGS_BASE_DIR = path.join(this.GLOBAL_BASE_DIR, 'typings');
		delDir(this.GLOBAL_TYPINGS_BASE_DIR)
		fs.mkdirSync(this.GLOBAL_TYPINGS_BASE_DIR)
		this.load(Module, this.GLOBAL_TYPINGS_BASE_DIR);
	}

	private load(Module, typeBaseDir, key = "") {
		let judge = !key
		let mkTypeBaseDir = path.join(typeBaseDir, judge ? "module" : "", key);
		if (judge) fs.mkdirSync(mkTypeBaseDir)
		let baseDir = this.getBaseDir(Module);
		let modulePath = ''
		for (let i of Object.getOwnPropertySymbols(Module)) {
			if (CONTROLLER_DIR === i) this.loadModelFile(baseDir, typeBaseDir, Module[i], 'controller');
			if (SERVICE_DIR === i) this.loadModelFile(baseDir, typeBaseDir, Module[i], 'service')
			if (INGREDIENT === i) {
				for (let j of Object.keys(Module[i])) {
					let {names=[],customPrompt=()=>{}} = Module[i][j]
					this.loadModelFile(baseDir, typeBaseDir, names, j,customPrompt)	
				}
			}
			if (MODULE_PATH === i) modulePath = Module[i]
		}
		let moduleNameArray = []
		if (!!Object.keys(Module.module).length) {
			for (let i of Object.keys(Module.module)) {
				let itemTypeBaseDir = path.join(typeBaseDir, "module", i)
				fs.mkdirSync(itemTypeBaseDir)
				let itemModuleName = this.load(Module.module[i], itemTypeBaseDir, i);
				moduleNameArray.push({path:itemModuleName,key:i})
			}
		}
		this.loadModuleFile(moduleNameArray, typeBaseDir)
		this.loadModuleIndex(typeBaseDir, modulePath)
		return modulePath
	}

	private getBaseDir(Module) {
		for (let i of Object.getOwnPropertySymbols(Module)) {
			if (BASE_DIR === i) return Module[i];
		}
	}

	private loadModuleFile(
		baseDir: Array<{key:string,path:string}>,
		typeBaseDir: string,
	) {
		let modelFile = ``;
		let modelFileBody = ``;
		let itemTypeDir = path.join(typeBaseDir, 'module')
		let pathJudge = fs.existsSync(itemTypeDir)
		if (!pathJudge) fs.mkdirSync(itemTypeDir)
		let loadPath = path.join(itemTypeDir, "index.d.ts");
		for (let i of baseDir) {
			let { key: itemKey,path:itemPath} = i
			let extname = path.extname(itemPath)
			let exportFileName = itemKey.charAt(0).toUpperCase() + itemKey.slice(1).replace(/\./g,'');
			let moduleRelativePath = path.relative(itemTypeDir, itemPath).replace(/\\/g, '/')
			moduleRelativePath = moduleRelativePath.replace(extname, "");
			modelFile +=
				`import Export${exportFileName}Module from '${moduleRelativePath}'`;
			if (i !== baseDir[0]) modelFileBody += '\n'
			modelFileBody += 
				`${itemKey}: Export${exportFileName}Module`;
		}
		modelFile +=
			`
export default interface IModule {
	${modelFileBody}
}
`;
		fs.writeFileSync(loadPath, modelFile, 'utf8')
	}

	private buildMongooseSchemaInterface(
		baseDir: string,
		typeBaseDir: string,
		names: string[],
		key: string
	) {
		let modelFile = ``;
		let modelFileBody = ``;
		let itemTypeDir = path.join(typeBaseDir, key)
		fs.mkdirSync(itemTypeDir)
		let loadPath = path.join(itemTypeDir, "index.d.ts");
		for (let i of names) {
			let extname = path.extname(i)
			let fileName = i.replace(extname, "");
			let filePath = path.join(baseDir, key, i);
			let exportModule = require(filePath).default;
			let modelFileBody = ``;
			for (let i of Object.keys(exportModule)) {
				let type = exportModule[i].type
				console.log(exportModule[i]);
				console.log('type' in exportModule[i]);
				if(type === String)modelFileBody+=`\n${i}: string`
				if(type === Object)modelFileBody+=`\n${i}: any`
				if(type === Number)modelFileBody+=`\n${i}: number`
				if(type === Boolean)modelFileBody+=`\n${i}: boolean`
				if(type === Array)modelFileBody+=`\n${i}: any[]`
				if(type === Date)modelFileBody+=`\n${i}: Date`
				if(type === Buffer)modelFileBody+=`\n${i}: Buffer`
				if(type === Mixed)modelFileBody+=`\n${i}: any`
				if(type === ObjectId)modelFileBody+=`\n${i}: typeof ObjectId`
			}
		}
	}

	private loadModelFile(
		baseDir: string,
		typeBaseDir: string,
		names: string[],
		key: string,
		customPrompt?:Function
	) {
		let itemTypeDir = path.join(typeBaseDir, key)
		fs.mkdirSync(itemTypeDir)
		let loadPath = path.join(itemTypeDir, "index.d.ts");
		let modelFile
		if(customPrompt)modelFile = customPrompt.apply([baseDir,typeBaseDir,names,key])
		else modelFile = this.createModelInterface(key,baseDir,names,itemTypeDir)
		fs.writeFileSync(loadPath, modelFile, 'utf8')
		return modelFile;
	}

	private createModelInterface(key:string,baseDir:string,names:string[],itemTypeDir:string){
		let modelFile = ``;
		let modelFileBody = ``;
		let interfaceName = key.charAt(0).toUpperCase() + key.slice(1);
		for (let i of names) {
			let extname = path.extname(i)
			let fileName = i.replace(extname, "");
			let filePath = path.join(baseDir, key, i);
			let exportFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1);
			let moduleRelativePath = path.relative(itemTypeDir, filePath).replace(/\\/g, '/')
			moduleRelativePath = moduleRelativePath.replace(extname, "");
			modelFile +=
				`import Export${exportFileName} from '${moduleRelativePath}'`;
			if (i !== names[0]) modelFileBody += '\n'
			modelFileBody +=
				`	${fileName}: Export${exportFileName}`;
		}
		modelFile += '\n\n'
		modelFile +=
			`export default interface I${interfaceName} {
${modelFileBody}
}`;
return modelFile
	}
	private loadModuleIndex(typeBaseDir, modulePath) {
		let loadPath = path.join(typeBaseDir, 'index.d.ts')
		let extname = path.extname(modulePath)
		let moduleRelativePath = path.relative(typeBaseDir, modulePath).replace(/\\/g, '/')
		moduleRelativePath = moduleRelativePath.replace(extname, "");
		let modelFile =
			`import BaseModule from '${moduleRelativePath}'
import IController from './controller'
import IService from './service'

declare module '${moduleRelativePath}' {
	export default interface BaseModule {
		service:IService
		controller:IController
	}
}
`
		fs.writeFileSync(loadPath, modelFile, 'utf8')
		return modelFile
	}
}
