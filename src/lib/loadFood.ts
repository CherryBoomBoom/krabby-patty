import * as path from "path";
import * as fs from "fs";
import globby = require("globby");
import BaseController from "../interface/Controller";
import BaseService from "../interface/Service";

export default class LoadindFood {
  public module: any;
  public app: any;
  private readonly baseDir: string;
  private readonly ingredients: {
    [key: string]: { [key: string]: any };
  } = {};
  constructor(option) {
    this.baseDir = option.baseDir;
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
    );
    task.map(i => {
      i();
    });
  }
  private loadServiceToModule(exportModule: any, module: any = this.module){
    exportModule = new Proxy(exportModule, {
      get: (target, property) => {
        if (typeof target[property] === "function") {
          return target[property].bind(Object.assign(module,target));
        }
      }
    });
    return exportModule;
  }
  private loadToModule(exportModule: any, module: any = this.module) {
    exportModule = new Proxy(exportModule, {
      get: (target, property) => {
        if (typeof target[property] === "function") {
          Object.setPrototypeOf(target,module)
          return target[property];
        }
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
    let itemPrototype = Object.assign(this.module,{query:req.query})
    return await callback.bind(itemPrototype).apply();
  }
  private loadRouter(param: any, baseUrl: string) {
    for (let path of Object.keys(param)) {
      let { callback, method = "POST" } = param[path];
      const router = this.app.route(baseUrl + path);
      router[method.toLowerCase()](async (req, res) => {
        res.send(await this.asyncCallback(callback, req));
      });
    }
  }
  private loadFile({ directory, filepath, folderPath }) {
    const fullpath = path.resolve(directory, filepath);
    if (!fs.statSync(fullpath).isFile()) return void 0;
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
      let { router, baseUrl } = exportModule;
      this.loadRouter(router, baseUrl);
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
      exportModule = this.loadServiceToModule(exportModule);
      service[name] = exportModule;
    }
    Object.defineProperty(this.module, folderPath[0], { value: service });
  }
  private async loadModel() {
    const folderPath = "model";
  }
}
