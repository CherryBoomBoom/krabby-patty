import express = require("express");
import bodyparser = require("body-parser");
export default (module) => {
  let app = express();
  let middlewares = module.middlewares || []
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
  for(let i of middlewares)app.use(i)
  return app;
};
