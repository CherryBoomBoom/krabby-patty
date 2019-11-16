import * as path from 'path'
import loadFood from './lib/loadFood'
import getExpress from './lib/getExpress'
import createWorker from './lib/createWorker'

const START_PATH = path.dirname(require.main.filename)
const BASE_CONFIG_PATH = path.join(START_PATH, './config/config.base')
const BASE_MODULE_PATH = path.join(START_PATH, './base.module')

export default function krabbyPatty(config?: { [key: string]: any }): void {
  if (!config) config = require(BASE_CONFIG_PATH).default
  const Module = require(BASE_MODULE_PATH).default
  const food = new loadFood({
    config,
    app: getExpress(Module),
    module: new Module()
  })
  let { app, module } = food
  app = require('http').createServer(app)
  app.module = module
  createWorker(app)
}
