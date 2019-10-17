import * as path from "path";
import * as fs from "fs";
import globby = require("globby");
import BaseModule from "../interface/Module";
import express from "express";
import cleanCache from "../lib/cleanCache";
import getModulePath from "../lib/getModulePath";

const loadedModuleDir = [];

export const MODULE_PATH = Symbol.for('MODULE_PATH')
export const BASE_DIR = Symbol.for('BASE_DIR')
export const CONTROLLER_DIR = Symbol.for('CONTROLLER_DIR')
export const SERVICE_DIR = Symbol.for('SERVICE_DIR')
export const INGREDIENT = Symbol.for('INGREDIENT')
export default class LoadFood {
	public module: any;
	public app: any;
	private baseDir: string;
	private ingredients: {
		[key: string]: { [key: string]: any };
	} = {};

	constructor(option) {
		this.baseDir = option.baseDir;
		if (loadedModuleDir.includes(this.baseDir)) return;
		else loadedModuleDir.push(this.baseDir);
		this.module = option.module;
		this.module[BASE_DIR] = this.baseDir
		this.module[MODULE_PATH] = option.modulePath || path.join(this.baseDir,'base.module.ts')
		this.app = option.app;
		this.loadIngredients();
	}
	private loadIngredients() {
		let task: any[] = [];
		task.push(
			this.loadModel.bind(this),
			this.loadService.bind(this),
			this.loadController.bind(this),
			this.loadModule.bind(this),
		);
		if (this.module.ingredients && !!Object.keys(this.module.ingredients)) {
			this.module[INGREDIENT] = {}
			for (let i of Object.keys(this.module.ingredients)) {
				task.push(this.loadPersonalIngredient.bind(Object.assign(this, {INGREDIENT_KEY:i})))
			}
		}
		task.map(i => i());
	}
	private loadToModule(exportModule: any, module: any = this.module) {
		exportModule = new Proxy(exportModule, {
			get: (target, property) => {
				if (target[property]) return target[property];
				else return module[property];
			}
		});
		return exportModule;
	}
	private getFilePaths(folderPath: string) {
		let directory = path.resolve(this.baseDir, folderPath);
		return {
			directory,
			filePaths: globby.sync(["**/*.ts", "**/*.js"], { cwd: directory })
		};
	}
	private async asyncCallback(callback, req) {
		let ctx = Object.create(this.module);
		ctx.body = req.body;
		ctx.query = req.query;
		ctx.url = req.url;
		ctx.method = req.method;
		ctx.headers = req.headers;
		let itemPrototype = Object.assign(this.module, { query: req.query });
		return await callback.bind(itemPrototype).apply();
	}
	private loadRouter(param: any, baseUrl: string, middleware: Function[]) {
		let Router = express.Router();
		for (let i of middleware) Router.use(i);
		for (let path of Object.keys(param)) {
			let { callback, method = "POST", middleware = [] } = param[path];
			if (!!middleware.length)
				for (let i of middleware) Router.use(path, i);
			const router = Router.route(path);
			router[method.toLowerCase()](async (req, res) => {
				res.send(await this.asyncCallback(callback, req));
			});
		}
		this.app.use(baseUrl, Router);
	}
	private loadFile({ directory, filePath, folderPath }) {
		const fullPath = path.resolve(directory, filePath);
		if (!fs.statSync(fullPath).isFile()) return void 0;
		cleanCache(fullPath);
		let exportModule = require(fullPath);
		let moduleName = path.basename(fullPath);
		moduleName = moduleName.slice(0, moduleName.lastIndexOf("."));
		if (exportModule.__esModule) {
			exportModule =
				"default" in exportModule ? exportModule.default : exportModule;
		}
		let baseClass = Object.getPrototypeOf(Object.getPrototypeOf(exportModule));
		if (baseClass !== BaseModule) return void 0;
		if (!this.ingredients[folderPath]) this.ingredients[folderPath] = {};
		return { name: moduleName, exportModule };
	}
	private loadPersonalIngredient(this: LoadFood & { INGREDIENT_KEY:string}) {
		let ingredient = {}
		const folderPath = this.INGREDIENT_KEY;
		const { directory, filePaths } = this.getFilePaths(folderPath);
		this.module[INGREDIENT][this.INGREDIENT_KEY] = filePaths
		for (let filePath of filePaths) {
			const MODULE = this.loadFile({ directory, filePath, folderPath });
			if (!MODULE) continue;
			let { name, exportModule } = MODULE;
			exportModule = new exportModule(this.module);
			exportModule = this.loadToModule(exportModule);
			ingredient[name] = exportModule;
		}
		Object.defineProperty(this.module, folderPath, { value: ingredient });
	}
	private loadController() {
		let controller = {};
		const folderPath = "controller";
		const { directory, filePaths } = this.getFilePaths(folderPath);
		this.module[CONTROLLER_DIR] = filePaths
		for (let filePath of filePaths) {
			const MODULE = this.loadFile({ directory, filePath, folderPath });
			if (!MODULE) continue;
			let { name, exportModule } = MODULE;
			exportModule = new exportModule(this.module);
			let { router, baseUrl, middleware } = exportModule;
			this.loadRouter(router, baseUrl, middleware);
			exportModule = this.loadToModule(exportModule);
			controller[name] = exportModule;
		}
		Object.defineProperty(this.module, folderPath, { value: controller });
	}
	private loadService() {
		let service = {};
		const folderPath = "service";
		const { directory, filePaths } = this.getFilePaths(folderPath);
		this.module[SERVICE_DIR] = filePaths
		for (let filePath of filePaths) {
			const MODULE = this.loadFile({ directory, filePath, folderPath });
			if (!MODULE) continue;
			let { name, exportModule } = MODULE;
			exportModule = new exportModule(this.module);
			exportModule = this.loadToModule(exportModule);
			service[name] = exportModule;
		}
		Object.defineProperty(this.module, folderPath, { value: service });
	}
	private loadModel() {
		const folderPath = "model";
	}
	private loadModule() {
		let modules = this.module.modules || [];
		let loadedModule = {};
		for (let i of modules) {
			let modulePath = getModulePath(i);
			let baseDir = path.dirname(modulePath);
			let ext = path.extname(modulePath);
			let key = path
				.basename(modulePath)
				.replace(ext, "")
				.replace(".module", "");
			let itemModule = new LoadFood({
				baseDir,
				modulePath,
				module: new i(),
				app: this.app
			});
			if (itemModule.module) loadedModule[key] = itemModule.module;
		}
		if (!!Object.keys(loadedModule)) this.module.module = loadedModule;
	}
}
