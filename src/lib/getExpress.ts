import express = require('express')
import bodyParser = require('body-parser')
const multipart = require('connect-multiparty');

export default (middleware = []) => {
  let app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  const multipartMiddleware = multipart();
  app.use(multipartMiddleware)
  for (let i of middleware) app.use(i)
  return app
}
