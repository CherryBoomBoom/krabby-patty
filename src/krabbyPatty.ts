import * as path from 'path'
import loadFood from './lib/loadFood'
import loadConfig from './lib/loadConfig'
import loadTsHelper from './lib/loadTsHelper'
import getExpress from './lib/getExpress'
import createWorker from './lib/createWorker'

const START_PATH = path.dirname(require.main.filename)
const BASE_CONFIG_PATH = path.join(START_PATH, './config/config.base')
const DEV_CONFIG_PATH = path.join(START_PATH, './config/config.dev')
const BASE_MODULE_PATH = path.join(START_PATH, './base.module')
const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`

export default function krabbyPatty(): void {
  let dev = process.argv.includes('--dev')
  if (!createWorker()) return
  let config = require(BASE_CONFIG_PATH).default
  let devConfig = require(DEV_CONFIG_PATH).default
  if(dev)config = Object.assign(config,devConfig)
  const Module = require(BASE_MODULE_PATH).default
  const port = config.port || 3000
  let app = getExpress(Module)
  let module = new loadConfig(new Module(),config).module
  app = new loadFood({ config, app, module }).getApp()
  app = require('http').createServer(app)
  app.listen(port, () => console.log(`${SUCCESS_LOG}${port}\x1B[0m`))
  new loadTsHelper(module)
}
