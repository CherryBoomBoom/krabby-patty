import express = require("express");
import bodyparser = require("body-parser");
export default () => {
  let app = express();
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  return app;
};
