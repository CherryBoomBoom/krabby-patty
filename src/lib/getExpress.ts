import express = require("express");
import bodyParser = require("body-parser");
export default (module) => {
  let app = express();
  let middleware = module.middleware || []
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
  for(let i of middleware)app.use(i)
  return app;
};
