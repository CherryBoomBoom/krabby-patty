import * as path from 'path'
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

export default function loadFood(option) {
  let { baseDir = START_PATH, app, Module } = option
		
  if (loadedModuleDir.includes(baseDir)) return
  else loadedModuleDir.push(baseDir)
  
  Module[BASE_DIR] = baseDir
  this.app = app
  this.module = Module
  loadIngredients()
}

function loadIngredients() {
  let task: any[] = []

  task.push(loadService.bind(this), loadController.bind(this))
  // 不向下加载子模块
  task.push(loadModule.bind(this))
  // 加载自定义食材到application
  if (this.module.ingredients && !!Object.keys(this.module.ingredients)) {
    this.module[INGREDIENT] = {}
    for (let i of Object.keys(this.module.ingredients)) {
      let {
        loadDir: LOAD_DIR = '',
        processed: PROCESSED = null,
        customPrompt: CUSTOM_PROMPT = null
      } = this.module.ingredients[i]
      task.push(
        this.loadPersonalIngredient.bind(
          Object.assign(this, {
            INGREDIENT_KEY: i,
            LOAD_DIR,
            PROCESSED,
            CUSTOM_PROMPT
          })
        )
      )
    }
  }
  task.map(i => i())
}
function loadToModule(exportModule: any, module: any = this.module) {
  if (!exportModule) return
  exportModule = new Proxy(exportModule, {
    get: (target, property) => {
      if (target[property]) return target[property]
      else return module[property]
    }
  })
  return exportModule
}
function getFilePaths(folderPath: string) {
  let directory = path.resolve(this.module[BASE_DIR], folderPath)
  return {
    directory,
    filePaths: globby.sync(['**/*.ts', '**/*.js'], { cwd: directory })
  }
}
async function asyncCallback(callback, req,res) {
  let ctx = Object.create(this.module)
  ctx.body = req.body
  ctx.query = req.query
  ctx.url = req.url
  ctx.method = req.method
  ctx.headers = req.headers
  let itemPrototype = Object.assign(this.module, { query: req.query })
  return await callback.apply(itemPrototype,[req,res])
}
function loadRouter(param: any, baseUrl: string, middleware: Function[]) {
  let Router = express.Router()
  for (let i of middleware) Router.use(i)
  for (let path of Object.keys(param)) {
    let { callback, method = 'POST', middleware = [] } = param[path]
    if (!!middleware.length) for (let i of middleware) Router.use(path, i)
    const router = Router.route(path)
    router[method.toLowerCase()](async (req, res) => {
      res.send(await this.asyncCallback(callback, req,res))
    })
  }
  this.app.use(baseUrl, Router)
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
  if (!this.ingredients[folderPath]) this.ingredients[folderPath] = {}
  return { name: moduleName, exportModule }
}
function loadPersonalIngredient() {
  let ingredient = {}
  const folderPath = this.LOAD_DIR
  const { directory, filePaths } = this.getFilePaths(folderPath)
  this.module[INGREDIENT][this.INGREDIENT_KEY] = {
    folderPath,
    names: filePaths,
    customPrompt: this.CUSTOM_PROMPT
  }
  for (let filePath of filePaths) {
    const MODULE = this.loadFile({ directory, filePath, folderPath })
    if (!MODULE) continue
    let { name, exportModule } = MODULE
    let extname = path.extname(name)
    let fileName = name.replace(extname, '')
    if (this.PROCESSED) exportModule = this.PROCESSED.apply(this.module, [fileName, exportModule])
    exportModule = this.loadToModule(exportModule)
    if (!exportModule) continue
    ingredient[name] = exportModule
  }
  Object.defineProperty(this.module, folderPath, { value: ingredient })
}
function loadController() {
  let controller = {}
  const folderPath = 'controller'
  const { directory, filePaths } = this.getFilePaths(folderPath)
  this.module[CONTROLLER_DIR] = filePaths
  for (let filePath of filePaths) {
    const MODULE = this.loadFile({ directory, filePath, folderPath })
    if (!MODULE) continue
    let { name, exportModule } = MODULE
    exportModule = new exportModule(this.module)
    let { router, baseUrl, middleware } = exportModule
    this.loadRouter(router, baseUrl, middleware)
    exportModule = this.loadToModule(exportModule)
    controller[name] = exportModule
  }
  Object.defineProperty(this.module, folderPath, { value: controller })
}
function loadService(module) {
  let service = {}
  const folderPath = 'service'
  const { directory, filePaths } = getFilePaths(folderPath)
  module[SERVICE_DIR] = filePaths
  for (let filePath of filePaths) {
    const MODULE = loadFile({ directory, filePath, folderPath })
    if (!MODULE) continue
    let { name, exportModule } = MODULE
    exportModule = new exportModule(this.module)
    exportModule = loadToModule(exportModule)
    service[name] = exportModule
  }
  Object.defineProperty(module, folderPath, { value: service })
  return modulef
}
function loadModule() {
  let modules = this.module.modules || []
  let loadedModule = {}
  for (let i of modules) {
    let modulePath = getModulePath(i)
    let baseDir = path.dirname(modulePath)
    let ext = path.extname(modulePath)
    let key = path
      .basename(modulePath)
      .replace(ext, '')
      .replace('.module', '')
    let itemModule = new loadFood({
      baseDir,
      modulePath,
      module: new i(),
      app: this.app
    })
    if (itemModule.module) loadedModule[key] = itemModule.module
  }
  if (!!Object.keys(loadedModule)) this.module.module = loadedModule
}
