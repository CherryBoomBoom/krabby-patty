"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const krabbyPatty_1 = __importDefault(require("./krabbyPatty"));
const Controller_1 = __importDefault(require("./interface/Controller"));
const Service_1 = __importDefault(require("./interface/Service"));
const Module_1 = __importDefault(require("./interface/Module"));
const Router_1 = __importDefault(require("./decorators/Router"));
const Post_1 = __importDefault(require("./decorators/Post"));
const Get_1 = __importDefault(require("./decorators/Get"));
exports.krabbyPatty = krabbyPatty_1.default;
exports.Controller = Controller_1.default;
exports.Service = Service_1.default;
exports.Module = Module_1.default;
exports.Router = Router_1.default;
exports.Post = Post_1.default;
exports.Get = Get_1.default;
//# sourceMappingURL=index.js.map