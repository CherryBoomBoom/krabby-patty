import { CONTROLLER_DIR, SERVICE_DIR, INGREDIENT } from './loadFood'
import * as path from 'path'
import * as fs from 'fs'
import delDir from '../helper/delDir'
import mkdir from '../helper/mkdir'
import KrabbyPatty from '../interface/KrabbyPatty'

export default class LoadTsHelper {
  private TYPINGS_DIR:string = ''
  private app: KrabbyPatty

  constructor(app: KrabbyPatty) {
    this.app = app
    this.TYPINGS_DIR = path.join(this.app.baseDir, '../typings')
    delDir(this.TYPINGS_DIR)
    mkdir(this.TYPINGS_DIR)
    this.load(this.TYPINGS_DIR)
  }

  private load(typeDir: string, key: string = ''): void {
    let itemTypeDir = path.join(typeDir, !key ? 'module' : '', key)
    if (!key) mkdir(itemTypeDir)
    let baseDir = this.app.baseDir
    let ingredient = {}
    for (let i of Object.getOwnPropertySymbols(this.app)) {
      if (CONTROLLER_DIR === i) this.loadModelFile(baseDir, typeDir, this.app[i], 'controller')
      if (SERVICE_DIR === i) this.loadModelFile(baseDir, typeDir, this.app[i], 'service')
      if (INGREDIENT === i) {
        for (let j of Object.keys(this.app[i])) {
          let { names = [], folderPath = '', customPrompt = () => {} } = this.app[i][j]
          this.loadModelFile(baseDir, typeDir, names, j, customPrompt)
          ingredient[j] = folderPath
        }
      }
    }
    let moduleNameArray = []
    this.loadModuleFile(moduleNameArray, typeDir)
    this.loadModuleIndex(typeDir, this.app.baseFile, ingredient)
  }

  private loadModuleFile(baseDir: Array<{ key: string; path: string }>, typeBaseDir: string): void {
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

  private loadModelFile(
    baseDir: string,
    typeBaseDir: string,
    names: string[],
    key: string,
    customPrompt?: Function
  ): void {
    let itemTypeDir = path.join(typeBaseDir, key)
    mkdir(itemTypeDir)
    let loadPath = path.join(itemTypeDir, 'index.d.ts')
    let modelFile
    if (customPrompt) modelFile = customPrompt.apply(this.app, [baseDir, names, key])
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
