import express = require('express')
import bodyParser = require('body-parser')

export default (middleware = []) => {
  let app = express()
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  for (let i of middleware) app.use(i)
  return app
}
