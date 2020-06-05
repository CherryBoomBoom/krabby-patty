import * as path from 'path'
import loadFood from './lib/loadFood'
import loadConfig from './lib/loadConfig'
import loadTsHelper from './lib/loadTsHelper'
import getExpress from './lib/getExpress'
import createWorker from './lib/createWorker'
import Application from './interface/Application'

const START_PATH = path.dirname(require.main.filename)
const BASE_CONFIG = require(path.join(START_PATH, 'config/config.base')).default
const PROD_CONFIG = require(path.join(START_PATH, 'config/config.prod')).default
const DEV_CONFIG = require(path.join(START_PATH, 'config/config.dev')).default
const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`

export default function krabbyPatty(Module:Application): void {
  const IS_DEV = process.argv.includes('--dev')
	const CONFIG = Object.assign(BASE_CONFIG, IS_DEV ? DEV_CONFIG : PROD_CONFIG)

	Module.config = CONFIG

	if (IS_DEV && CONFIG.hotDeploy && !createWorker()) return

  let app = getExpress(Module.middleware)
  let MODULE = new loadConfig(Module).module
  MODULE.app = app

  MODULE = loadFood(MODULE)
  MODULE.app = require('http').createServer(MODULE.app)
  MODULE.app.listen(CONFIG.port, () => console.info(`${SUCCESS_LOG}${CONFIG.port}\x1B[0m`))
  new loadTsHelper(MODULE)
}
