"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Module(member) {
    return function (target) {
        target.prototype.error = member.error;
    };
}
exports.default = Module;
//# sourceMappingURL=Module.js.map