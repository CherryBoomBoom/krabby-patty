import * as path from 'path'
import app = require('./../demo/app')
import * as fs from 'fs'
import globby = require('globby')
import express from 'express'
import cleanCache from '../helper/cleanCache'
import getModulePath from '../helper/getModulePath'
import KrabbyPatty from '../interface/KrabbyPatty'

export const INGREDIENT = Symbol.for('INGREDIENT')
export const SERVICE_DIR = Symbol.for('SERVICE_DIR')
export const CONTROLLER_DIR = Symbol.for('CONTROLLER_DIR')
export const CONTROLLER = Symbol.for('CONTROLLER')
export const SERVICE = Symbol.for('SERVICE')
export const FOOD_TYPE = Symbol.for('FOOD_TYPE')

export default class LoadFood {
	public app: KrabbyPatty
	private ingredients: { [key: string]: any } = {}

  constructor(app: KrabbyPatty) {
    this.app = app
    this.load()
  }

  private load() {
    this.loadService()
    this.loadController()
		this.loadIngredients()
		

  }

  private loadIngredients() {
    if (this.app.ingredients && !!Object.keys(this.app.ingredients)) {
      for (let i of Object.keys(this.app.ingredients)) {
        let { loadDir = '', processed = null, customPrompt = null } = this.app.ingredients[i]
        this.loadPersonalIngredient(i, loadDir, processed, customPrompt)
      }
    }
  }

  private loadPersonalIngredient(
    ingredientKey: string,
    loadDir: string,
    processed: Function,
    customPrompt: Function
  ): void {
    let ingredient = {}
    const { directory, filePaths } = this.getFilePaths(loadDir)
    this.app[INGREDIENT][ingredientKey] = {
      folderPath: loadDir,
      names: filePaths,
      customPrompt
    }
    for (let filePath of filePaths) {
      const E_MODEL = this.loadFile(directory, filePath, loadDir)
      if (!E_MODEL) continue
      let { name, exportModule } = E_MODEL
      let extname = path.extname(name)
      let fileName = name.replace(extname, '')
      if (processed) exportModule = processed.apply(this.app, [fileName, exportModule])
      exportModule = this.loadToModule(exportModule)
      if (!exportModule) continue
      ingredient[name] = exportModule
    }
    Object.defineProperty(this.app, loadDir, { value: ingredient })
  }

  private loadService(): void {
    let service = {}
    const folderPath = 'service'
    const { directory, filePaths } = this.getFilePaths(folderPath)
    this.app[SERVICE_DIR] = filePaths

    for (let filePath of filePaths) {
      const E_MODEL = this.loadFile(directory, filePath, folderPath)
      if (!E_MODEL) continue
      let { name, exportModule } = E_MODEL
      exportModule = new exportModule()
      exportModule = this.loadToModule(exportModule)
      service[name] = exportModule
    }
    Object.defineProperty(this.app, folderPath, { value: service })
  }

  private loadController(): void {
    let controller = {}
    const folderPath = 'controller'
    const { directory, filePaths } = this.getFilePaths(folderPath)
    this.app[CONTROLLER_DIR] = filePaths
    for (let filePath of filePaths) {
      const E_MODEL = this.loadFile(directory, filePath, folderPath)
      if (!E_MODEL) continue
      let { name, exportModule } = E_MODEL
      exportModule = new exportModule()
      let { router, baseUrl, middleware } = exportModule
      this.loadRouter(router, baseUrl, middleware)
      exportModule = this.loadToModule(exportModule)
      controller[name] = exportModule
    }
    Object.defineProperty(this.app, folderPath, { value: controller })
  }

  private loadRouter(param: any, baseUrl: string, middleware: Function[]):void {
    let Router = express.Router()
    for (let i of middleware) Router.use(i)
    for (let path of Object.keys(param)) {
      let { callback, method = 'GET', middleware = [] } = param[path]
      if (!!middleware.length) for (let i of middleware) Router.use(path, i)
      const router = Router.route(path)
      router[method.toLowerCase()](async (req, res) => {
        res.json(await this.asyncCallback(callback, req))
      })
    }
    this.app.exp.use(baseUrl, Router)
  }

  private async asyncCallback(callback, req):Promise<any> {
    let ctx = Object.create(this.app)
    ctx.body = req.body
    ctx.query = req.query
    ctx.url = req.url
    ctx.method = req.method
    ctx.headers = req.headers
    ctx.files = req.files
    return await callback.bind(ctx).apply()
  }

  private getFilePaths(folderPath: string): { directory: string; filePaths: string[] } {
    let directory = path.resolve(this.app.baseDir, folderPath)
    return {
      directory,
      filePaths: globby.sync(['**/*.ts', '**/*.js'], { cwd: directory })
    }
  }

  private loadFile(directory, filePath, folderPath) {
    const fullPath = path.resolve(directory, filePath)
    if (!fs.statSync(fullPath).isFile()) return void 0
    cleanCache(fullPath)
    let exportModule = require(fullPath)
    let moduleName = path.basename(fullPath)
    moduleName = moduleName.slice(0, moduleName.lastIndexOf('.'))
    if (exportModule.__esModule) {
      exportModule = 'default' in exportModule ? exportModule.default : exportModule
    }
    return { name: moduleName, exportModule }
  }

  private loadToModule(exportModule: Function): Function {
    if (!exportModule) return
    exportModule = new Proxy(exportModule, {
      get: (target, property) => {
        if (target[property]) return target[property]
        else return this.app[property]
      }
    })
    return exportModule
	}
	
	private getModuleInfo(data = {service:[],controller:[]}){
		let filePaths = globby.sync(['**/*.ts', '**/*.js'], { cwd: this.app.baseDir })

	}
}
