import * as path from 'path'
import * as fs from 'fs'
import LoadFood from '../lib/LoadFood'
import LoadConfig from '../lib/LoadConfig'
import loadTsHelper from '../lib/loadTsHelper'
import getExpress from '../lib/getExpress'
import createWorker from '../lib/createWorker'

const START_File = require.main.filename
const START_PATH = path.dirname(START_File)
const COM_CONFIG_DIR = path.join(__dirname, '../config/config.base')
const BASE_CONFIG_DIR = path.join(START_PATH, 'config/config.base')
const PROD_CONFIG_DIR = path.join(START_PATH, 'config/config.prod')
const DEV_CONFIG_DIR = path.join(START_PATH, 'config/config.dev')
const COM_CONFIG = require(COM_CONFIG_DIR).default
const BASE_CONFIG = fs.existsSync(BASE_CONFIG_DIR) ? require(BASE_CONFIG_DIR).default : {}
const PROD_CONFIG = fs.existsSync(PROD_CONFIG_DIR) ? require(PROD_CONFIG_DIR).default : {}
const DEV_CONFIG = fs.existsSync(DEV_CONFIG_DIR) ? require(DEV_CONFIG_DIR).default : {}
const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`

export default class KrabbyPatty {
  public readonly baseDir: string = START_PATH
  public readonly baseFile: string = START_File
  public readonly middleware = []

  public app: {
    module: any
    router: { [key: string]: { method: 'POST' | 'GET'; callback: Function; functionName: string } }
    baseUrl: string
  }
  public exp: any
  public path: string
  public config: { [key: string]: any }
  public ingredients: { [key: string]: any }

  constructor() {
    const IS_DEV = process.argv.includes('--dev')
		const CONFIG = Object.assign(BASE_CONFIG, IS_DEV ? DEV_CONFIG : PROD_CONFIG,COM_CONFIG)
    let app: KrabbyPatty = this

    this.config = CONFIG

    if (IS_DEV && CONFIG.hotDeploy && !createWorker()) return
    
    let exp = getExpress(this.middleware)
    app = new LoadConfig(this).app
    app.exp = exp

    app = new LoadFood(this).app
    app.exp = require('http').createServer(app.exp)
    app.exp.listen(CONFIG.port, () => console.info(`${SUCCESS_LOG}${CONFIG.port}\x1B[0m`))
    new loadTsHelper(app)
  }
}
