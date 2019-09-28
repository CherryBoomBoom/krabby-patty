"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const globby = require("globby");
const Controller_1 = __importDefault(require("../interface/Controller"));
const Service_1 = __importDefault(require("../interface/Service"));
class LoadindFood {
    constructor(option) {
        this.ingredients = {};
        this.baseDir = option.baseDir;
        this.module = option.module;
        this.app = option.app;
        this.loadIngredients();
    }
    loadIngredients() {
        let task = [];
        task.push(this.loadController.bind(this), this.loadService.bind(this), this.loadModel.bind(this));
        task.map(i => {
            i();
        });
    }
    loadToModule(exportModule, module = this.module) {
        exportModule = new Proxy(exportModule, {
            get: (target, property) => {
                if (typeof target[property] === "function") {
                    return target[property].bind(module);
                }
            }
        });
        return exportModule;
    }
    getFilepaths(folderPath) {
        let directory = path.resolve(this.baseDir, folderPath);
        return {
            directory,
            filepaths: globby.sync(["**/*.ts"], { cwd: directory })
        };
    }
    asyncCallback(callback, req) {
        return __awaiter(this, void 0, void 0, function* () {
            let ctx = Object.create(this.module);
            ctx.body = req.body;
            ctx.query = req.query;
            ctx.url = req.url;
            ctx.method = req.method;
            ctx.headers = req.headers;
            return yield callback.bind(ctx).apply();
        });
    }
    loadRouter(param, baseUrl) {
        for (let path of Object.keys(param)) {
            let { callback, method = "POST" } = param[path];
            const router = this.app.route(baseUrl + path);
            router[method.toLowerCase()]((req, res) => __awaiter(this, void 0, void 0, function* () {
                res.send(yield this.asyncCallback(callback, req));
            }));
        }
    }
    loadFile({ directory, filepath, folderPath }) {
        const fullpath = path.resolve(directory, filepath);
        if (!fs.statSync(fullpath).isFile())
            return void 0;
        let exportModule = require(fullpath);
        let moduleName = path.basename(fullpath);
        moduleName = moduleName.slice(0, moduleName.lastIndexOf("."));
        if (exportModule.__esModule) {
            exportModule =
                "default" in exportModule ? exportModule.default : exportModule;
        }
        let baseClass = Object.getPrototypeOf(exportModule);
        if (baseClass !== this[Symbol.for(folderPath)])
            return void 0;
        if (!this.ingredients[folderPath])
            this.ingredients[folderPath] = {};
        return { name: moduleName, exportModule };
    }
    loadController() {
        let controller = {};
        const folderPath = "controller";
        this[Symbol.for(folderPath)] = Controller_1.default;
        const { directory, filepaths } = this.getFilepaths(folderPath);
        for (let filepath of filepaths) {
            const MODULE = this.loadFile({ directory, filepath, folderPath });
            if (!MODULE)
                continue;
            let { name, exportModule } = MODULE;
            exportModule = new exportModule(this.module);
            let { router, baseUrl } = exportModule;
            this.loadRouter(router, baseUrl);
            exportModule = this.loadToModule(exportModule);
            controller[name] = exportModule;
        }
        Object.defineProperty(this.module, folderPath[0], { value: controller });
    }
    loadService() {
        let service = {};
        const folderPath = "service";
        this[Symbol.for(folderPath)] = Service_1.default;
        const { directory, filepaths } = this.getFilepaths(folderPath);
        for (let filepath of filepaths) {
            const MODULE = this.loadFile({ directory, filepath, folderPath });
            if (!MODULE)
                continue;
            let { name, exportModule } = MODULE;
            exportModule = new exportModule(this.module);
            exportModule = this.loadToModule(exportModule);
            service[name] = exportModule;
        }
        Object.defineProperty(this.module, folderPath[0], { value: service });
    }
    loadModel() {
        return __awaiter(this, void 0, void 0, function* () {
            const folderPath = "model";
        });
    }
}
exports.default = LoadindFood;
//# sourceMappingURL=loadFood.js.map