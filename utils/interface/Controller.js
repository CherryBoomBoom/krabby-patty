"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Application_1 = __importDefault(require("./Application"));
class Controller extends Application_1.default {
    constructor(app) {
        super(app);
        this.app.router = this.router;
        this.app.baseUrl = this.baseUrl;
    }
}
exports.default = Controller;
//# sourceMappingURL=Controller.js.map