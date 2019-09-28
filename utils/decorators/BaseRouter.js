"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (target, key, descriptor, path, method) => {
    if (!target.router)
        target.router = {};
    target.router[path] = { callback: descriptor.value, functionName: key, method };
};
//# sourceMappingURL=BaseRouter.js.map