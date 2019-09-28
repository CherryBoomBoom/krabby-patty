"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const getExpress_1 = __importDefault(require("./lib/getExpress"));
const path = __importStar(require("path"));
const loadFood_1 = __importDefault(require("./lib/loadFood"));
const SECCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`;
const defaultConfig = { port: 3000 };
function krabbyPatty(option = { config: defaultConfig }) {
    const config = option.config;
    const baseDir = config.baseDir || process.cwd();
    let BaseModule;
    try {
        BaseModule = option.module || require(path.join(baseDir, "./base.module.ts")).default;
    }
    catch (_e) {
        BaseModule = require('./lib/baseModule').default;
    }
    let app = getExpress_1.default();
    let baseModule = new BaseModule();
    const food = new loadFood_1.default({ baseDir, module, app });
    baseModule = food.module;
    app = food.app;
    app.module = baseModule;
    app.listen(config.port, () => {
        console.log(SECCESS_LOG + config.port + '\x1B[0m');
    });
}
exports.default = krabbyPatty;
//# sourceMappingURL=krabbyPatty.js.map