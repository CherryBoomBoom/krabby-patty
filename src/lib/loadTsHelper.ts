import { MODULE_PATH, BASE_DIR, CONTROLLER_DIR, SERVICE_DIR, INGREDIENT } from './loadFood'
import * as path from 'path'
import * as fs from 'fs'
import delDir from '../helper/delDir'
import mkdir from '../helper/mkdir'

export default class LoadTsHelper {
  private GLOBAL_BASE_DIR = ''
  private TYPINGS_DIR = ''
  private Module: any

  constructor(Module) {
    this.Module = Module
    this.GLOBAL_BASE_DIR = Module[BASE_DIR]
    this.TYPINGS_DIR = path.join(this.GLOBAL_BASE_DIR, '../typings')
    delDir(this.TYPINGS_DIR)
    mkdir(this.TYPINGS_DIR)
    this.load(Module, this.TYPINGS_DIR)
  }

  private load(Module, typeDir, key = '') {
    let itemTypeDir = path.join(typeDir, !key ? 'module' : '', key)
    if (!key) mkdir(itemTypeDir)
    let baseDir = Module[BASE_DIR]
    let modulePath = ''
    let ingredient = {}
    for (let i of Object.getOwnPropertySymbols(Module)) {
      if (CONTROLLER_DIR === i) this.loadModelFile(baseDir, typeDir, Module[i], 'controller')
      if (SERVICE_DIR === i) this.loadModelFile(baseDir, typeDir, Module[i], 'service')
      if (INGREDIENT === i) {
        for (let j of Object.keys(Module[i])) {
          let { names = [], folderPath = '', customPrompt = () => {} } = Module[i][j]
          this.loadModelFile(baseDir, typeDir, names, j, customPrompt)
          ingredient[j] = folderPath
        }
      }
      if (MODULE_PATH === i) modulePath = Module[i]
    }
    let moduleNameArray = []
    // if (!!Object.keys(Module.module).length) {
    //   for (let i of Object.keys(Module.module)) {
    //     let subTypeDir = path.join(typeDir, 'module', i)
    //     mkdir(subTypeDir)
    //     let itemModuleName = this.load(Module.module[i], subTypeDir, i)
    //     moduleNameArray.push({ path: itemModuleName, key: i })
    //   }
    // }
    this.loadModuleFile(moduleNameArray, typeDir)
    this.loadModuleIndex(typeDir, modulePath, ingredient)
    return modulePath
  }

  private loadModuleFile(baseDir: Array<{ key: string; path: string }>, typeBaseDir: string) {
    let modelFile = ``
    let modelFileBody = ``
    let itemTypeDir = path.join(typeBaseDir, 'module')
    mkdir(itemTypeDir)
    let loadPath = path.join(itemTypeDir, 'index.d.ts')
    for (let i of baseDir) {
      let { key: itemKey, path: itemPath } = i
      let extname = path.extname(itemPath)
      let exportFileName = itemKey.charAt(0).toUpperCase() + itemKey.slice(1).replace(/\./g, '')
      let moduleRelativePath = path.relative(itemTypeDir, itemPath).replace(/\\/g, '/')
      moduleRelativePath = moduleRelativePath.replace(extname, '')
      modelFile += `import Export${exportFileName}Module from '${moduleRelativePath}'`
      if (i !== baseDir[0]) modelFileBody += '\n'
      modelFileBody += `${itemKey}: Export${exportFileName}Module`
    }
    modelFile += `
export default interface IModule {
	${modelFileBody}
}
`
    fs.writeFileSync(loadPath, modelFile, 'utf8')
  }

  private loadModelFile(baseDir: string, typeBaseDir: string, names: string[], key: string, customPrompt?: Function) {
    let itemTypeDir = path.join(typeBaseDir, key)
    mkdir(itemTypeDir)
    let loadPath = path.join(itemTypeDir, 'index.d.ts')
    let modelFile
    if (customPrompt) modelFile = customPrompt.apply(this.Module, [baseDir, names, key])
    else modelFile = this.createModelInterface(key, baseDir, names, itemTypeDir)
    fs.writeFileSync(loadPath, modelFile, 'utf8')
    return modelFile
  }

  private createModelInterface(key: string, baseDir: string, names: string[], itemTypeDir: string) {
    let modelFile = ``
    let modelFileBody = ``
    let interfaceName = key.charAt(0).toUpperCase() + key.slice(1)
    for (let i of names) {
      let extname = path.extname(i)
      let fileName = i.replace(extname, '')
      let filePath = path.join(baseDir, key, i)
      let exportFileName = fileName.charAt(0).toUpperCase() + fileName.slice(1)
      let moduleRelativePath = path.relative(itemTypeDir, filePath).replace(/\\/g, '/')
      moduleRelativePath = moduleRelativePath.replace(extname, '')
      modelFile += `import Export${exportFileName} from '${moduleRelativePath}'`
      if (i !== names[0]) modelFileBody += '\n'
      modelFileBody += `	${fileName}: Export${exportFileName}`
    }
    modelFile += '\n\n'
    modelFile += `export default interface I${interfaceName} {
${modelFileBody}
}`
    return modelFile
  }
  private loadModuleIndex(typeBaseDir: string, modulePath: string, ingredient: { [key: string]: string }) {
    let loadPath = path.join(typeBaseDir, 'index.d.ts')
    let extname = path.extname(modulePath)
    let moduleRelativePath = path.relative(typeBaseDir, modulePath).replace(/\\/g, '/')
    moduleRelativePath = moduleRelativePath.replace(extname, '')
    let modelFile = `import BaseModule from '${moduleRelativePath}'
import IController from './controller'
import IService from './service'`
    for (let i of Object.keys(ingredient)) {
      let exportFileName = i.charAt(0).toUpperCase() + i.slice(1)
      modelFile += `\nimport I${exportFileName} from './${ingredient[i]}'`
    }

    modelFile += `\n
declare module '${moduleRelativePath}' {
	export default interface BaseModule {
		service:IService
		controller:IController`
    for (let i of Object.keys(ingredient)) {
      let exportFileName = i.charAt(0).toUpperCase() + i.slice(1)
      modelFile += `\n		${i}: I${exportFileName}`
    }
    modelFile += `\n	}\n}`
    fs.writeFileSync(loadPath, modelFile, 'utf8')
    return modelFile
  }
}
