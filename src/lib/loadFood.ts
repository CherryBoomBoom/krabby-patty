import * as path from "path";
import * as fs from "fs";
import globby = require("globby");
import BaseController from "../interface/Controller";
import BaseService from "../interface/Service";
import express = require("express");
import cleanCache from "../lib/cleanCache";
import getModulePath from "../lib/getModulePath";

const loadedModuleDir = [];
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
    this.app = option.app;
    this.loadIngredients();
  }
  private loadIngredients() {
    let task: any[] = [];
    task.push(
      this.loadModel.bind(this),
      this.loadService.bind(this),
      this.loadController.bind(this),
      this.loadModule.bind(this)
    );
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
  private getFilepaths(folderPath: string) {
    let directory = path.resolve(this.baseDir, folderPath);
    return {
      directory,
      filepaths: globby.sync(["**/*.ts"], { cwd: directory })
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
  private loadRouter(param: any, baseUrl: string, middlewares: Function[]) {
    let Router = express.Router();
    for (let i of middlewares) Router.use(i);
    for (let path of Object.keys(param)) {
      let { callback, method = "POST", middlewares = [] } = param[path];
      if (!!middlewares.length)
        for (let middleware of middlewares) Router.use(path, middleware);
      const router = Router.route(path);
      router[method.toLowerCase()](async (req, res) => {
        res.send(await this.asyncCallback(callback, req));
      });
    }
    this.app.use(baseUrl, Router);
  }
  private loadFile({ directory, filepath, folderPath }) {
    const fullpath = path.resolve(directory, filepath);
    if (!fs.statSync(fullpath).isFile()) return void 0;
    cleanCache(fullpath);
    let exportModule = require(fullpath);
    let moduleName = path.basename(fullpath);
    moduleName = moduleName.slice(0, moduleName.lastIndexOf("."));
    if (exportModule.__esModule) {
      exportModule =
        "default" in exportModule ? exportModule.default : exportModule;
    }
    let baseClass = Object.getPrototypeOf(exportModule);
    if (baseClass !== this[Symbol.for(folderPath)]) return void 0;
    if (!this.ingredients[folderPath]) this.ingredients[folderPath] = {};
    return { name: moduleName, exportModule };
  }
  private loadController() {
    let controller = {};
    const folderPath = "controller";
    this[Symbol.for(folderPath)] = BaseController;
    const { directory, filepaths } = this.getFilepaths(folderPath);
    for (let filepath of filepaths) {
      const MODULE = this.loadFile({ directory, filepath, folderPath });
      if (!MODULE) continue;
      let { name, exportModule } = MODULE;
      exportModule = new exportModule(this.module);
      let { router, baseUrl, middlewares } = exportModule;
      this.loadRouter(router, baseUrl, middlewares);
      exportModule = this.loadToModule(exportModule);
      controller[name] = exportModule;
    }
    Object.defineProperty(this.module, folderPath[0], { value: controller });
  }
  private loadService() {
    let service = {};
    const folderPath = "service";
    this[Symbol.for(folderPath)] = BaseService;
    const { directory, filepaths } = this.getFilepaths(folderPath);
    for (let filepath of filepaths) {
      const MODULE = this.loadFile({ directory, filepath, folderPath });
      if (!MODULE) continue;
      let { name, exportModule } = MODULE;
      exportModule = new exportModule(this.module);
      exportModule = this.loadToModule(exportModule);
      service[name] = exportModule;
    }
    Object.defineProperty(this.module, folderPath[0], { value: service });
  }
  private async loadModel() {
    const folderPath = "model";
  }
  private async loadModule() {
    let modules = this.module.modules || [];
    let loadedModule = {};
    for (let i of modules) {
      let modulePath = getModulePath(i);
      let baseDir = path.dirname(modulePath);
      let ext = path.extname(modulePath);
      let key = path.basename(modulePath).replace(ext, "").replace('.module','');
      let itemModule = new LoadFood({
        baseDir,
        module: new i(),
        app: this.app
      });
      if (itemModule.module) loadedModule[key] = itemModule.module;
    }
    console.log(loadedModule);
    if (!!Object.keys(loadedModule)) this.module.module = loadedModule;
  }
}
