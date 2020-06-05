import * as path from 'path'
import app = require("./../demo/app")
import * as fs from 'fs'
import globby = require('globby')
import express from 'express'
import cleanCache from '../helper/cleanCache'
import getModulePath from '../helper/getModulePath'

const loadedModuleDir = []
const START_PATH = path.dirname(require.main.filename)

export const MODULE_PATH = Symbol.for('MODULE_PATH')
export const BASE_DIR = Symbol.for('BASE_DIR')
export const CONTROLLER_DIR = Symbol.for('CONTROLLER_DIR')
export const SERVICE_DIR = Symbol.for('SERVICE_DIR')
export const INGREDIENT = Symbol.for('INGREDIENT')

export default function loadFood(MODULE) {
		
  if (loadedModuleDir.includes(START_PATH)) return
  else loadedModuleDir.push(START_PATH)
  MODULE[BASE_DIR] = START_PATH
  MODULE = loadIngredients(MODULE)
  return MODULE
}

function loadIngredients(MODULE) {
  MODULE = loadService(MODULE)
  MODULE = loadController(MODULE)
  // 不向下加载子模块
  // task.push(()=>loadModule(MODULE))
  // 加载自定义食材到application
  if (MODULE.ingredients && !!Object.keys(MODULE.ingredients)) {
    MODULE[INGREDIENT] = {}
    for (let i of Object.keys(MODULE.ingredients)) {
      let {
        loadDir: LOAD_DIR = '',
        processed: PROCESSED = null,
        customPrompt: CUSTOM_PROMPT = null
      } = MODULE.ingredients[i]
      MODULE = loadPersonalIngredient(MODULE,PROCESSED,CUSTOM_PROMPT,LOAD_DIR)
    }
  }

  return MODULE
}
function loadToModule(exportModule: any, MODULE: any) {
  if (!exportModule) return
  exportModule = new Proxy(exportModule, {
    get: (target, property) => {
      if (target[property]) return target[property]
      else return MODULE[property]
    }
  })
  return exportModule
}
function getFilePaths(folderPath: string,MODULE:any) {
  let directory = path.resolve(MODULE[BASE_DIR], folderPath)
  return {
    directory,
    filePaths: globby.sync(['**/*.ts', '**/*.js'], { cwd: directory })
  }
}
async function asyncCallback(MODULE,callback, req,res) {
  let ctx = Object.create(MODULE)
  ctx.body = req.body
  ctx.query = req.query
  ctx.url = req.url
  ctx.method = req.method
  ctx.headers = req.headers
  let itemPrototype = Object.assign(MODULE, { query: req.query })
  return await callback.apply(itemPrototype,[req,res])
}
function loadRouter(MODULE:any,param: any, baseUrl: string, middleware: Function[]) {
  let Router = express.Router()
  for (let i of middleware) Router.use(i)
  for (let path of Object.keys(param)) {
    let { callback, method = 'POST', middleware = [] } = param[path]
    if (!!middleware.length) for (let i of middleware) Router.use(path, i)
    const router = Router.route(path)
    router[method.toLowerCase()](async (req, res) => {
      res.send(await asyncCallback(MODULE,callback, req,res))
    })
  }
  MODULE.app.use(baseUrl, Router)
}
function loadFile({ directory, filePath, folderPath }) {
  const fullPath = path.resolve(directory, filePath)
  if (!fs.statSync(fullPath).isFile()) return void 0
  cleanCache(fullPath)
  let exportModule = require(fullPath)
  let moduleName = path.basename(fullPath)
  moduleName = moduleName.slice(0, moduleName.lastIndexOf('.'))
  if (exportModule.__esModule) {
    exportModule = 'default' in exportModule ? exportModule.default : exportModule
  }
  // if (!ingredients[folderPath]) ingredients[folderPath] = {}
  return { name: moduleName, exportModule }
}
function loadPersonalIngredient(MODULE,PROCESSED,CUSTOM_PROMPT,LOAD_DIR) {
  let ingredient = {}
  const folderPath = LOAD_DIR
  const { directory, filePaths } = getFilePaths(folderPath,MODULE)
  // MODULE[INGREDIENT][INGREDIENT_KEY] = {
  //   folderPath,
  //   names: filePaths,
  //   customPrompt: CUSTOM_PROMPT
  // }
  for (let filePath of filePaths) {
    const E_MODEL = loadFile({ directory, filePath, folderPath })
    if (!E_MODEL) continue
    let { name, exportModule } = E_MODEL
    let extname = path.extname(name)
    let fileName = name.replace(extname, '')
    if (PROCESSED) exportModule = PROCESSED.apply(MODULE, [fileName, exportModule])
    exportModule = loadToModule(exportModule,MODULE)
    if (!exportModule) continue
    ingredient[name] = exportModule
  }
  Object.defineProperty(MODULE, folderPath, { value: ingredient })
  return MODULE
}
function loadController(MODULE) {
  let controller = {}
  const folderPath = 'controller'
  const { directory, filePaths } = getFilePaths(folderPath,MODULE)
  MODULE[CONTROLLER_DIR] = filePaths
  for (let filePath of filePaths) {
    const E_MODEL = loadFile({ directory, filePath, folderPath })
    if (!E_MODEL) continue
    let { name, exportModule } = E_MODEL
    exportModule = new exportModule()
    let { router, baseUrl, middleware } = exportModule
    loadRouter(MODULE,router, baseUrl, middleware)
    exportModule = loadToModule(exportModule,MODULE)
    controller[name] = exportModule
  }
  Object.defineProperty(MODULE, folderPath, { value: controller })
  return MODULE
}
function loadService(MODULE) {
  let service = {}
  const folderPath = 'service'
  const { directory, filePaths } = getFilePaths(folderPath,MODULE)
  MODULE[SERVICE_DIR] = filePaths
  for (let filePath of filePaths) {
    const E_MODEL = loadFile({ directory, filePath, folderPath })
    if (!E_MODEL) continue
    let { name, exportModule } = E_MODEL
    exportModule = new exportModule()
    exportModule = loadToModule(exportModule,MODULE)
    service[name] = exportModule
  }
  Object.defineProperty(MODULE, folderPath, { value: service })
  return MODULE
}
function loadModule(MODULE) {
  let modules = MODULE.modules || []
  let loadedModule = {}
  for (let i of modules) {
    let modulePath = getModulePath(i)
    let baseDir = path.dirname(modulePath)
    let ext = path.extname(modulePath)
    let key = path
      .basename(modulePath)
      .replace(ext, '')
      .replace('.MODULE', '')
    let itemModule = loadFood({
      baseDir,
      modulePath,
      MODULE: new i(),
      app: MODULE.app
    })
    if (itemModule.MODULE) loadedModule[key] = itemModule.MODULE
  }
  if (!!Object.keys(loadedModule)) MODULE.MODULE = loadedModule
  return MODULE
}
