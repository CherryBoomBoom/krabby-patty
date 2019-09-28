"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Router(path) {
    return function (target) {
        target.prototype.baseUrl = path;
    };
}
exports.default = Router;
//# sourceMappingURL=Router.js.map