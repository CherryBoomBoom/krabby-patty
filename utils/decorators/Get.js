"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const method = 'GET';
function Get(path) {
    return function (target, key, descriptor) {
        BaseRouter_1.default(target, key, descriptor, path, method);
    };
}
exports.default = Get;
//# sourceMappingURL=Get.js.map