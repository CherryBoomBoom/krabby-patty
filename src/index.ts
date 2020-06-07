import krabbyPattyType from './krabbyPatty'
import ModuleType from './interface/Module'
import RouterType from './decorators/Controller'
import PostType from './decorators/Post'
import GetType from './decorators/Get'

export const krabbyPatty: typeof krabbyPattyType = krabbyPattyType
export const Module: typeof ModuleType = ModuleType
export const Router: typeof RouterType = RouterType
export const Post: typeof PostType = PostType
export const Get: typeof GetType = GetType
