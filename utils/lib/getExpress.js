"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyparser = require("body-parser");
exports.default = () => {
    let app = express();
    app.use(bodyparser.urlencoded({ extended: true }));
    app.use(bodyparser.json());
    return app;
};
//# sourceMappingURL=getExpress.js.map