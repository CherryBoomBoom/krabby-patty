import krabbyPattyType from './krabbyPatty';
import ControllerType from './interface/Controller'
import ServiceType from './interface/Service'
import ModuleType from './interface/Module'
import RouterType from './decorators/Router'
import PostType from './decorators/Post'
import GetType from './decorators/Get'

export const krabbyPatty:typeof krabbyPattyType = krabbyPattyType
export const Controller:typeof ControllerType = ControllerType
export const Service:typeof ServiceType = ServiceType
export const Module:typeof ModuleType = ModuleType
export const Router:typeof RouterType = RouterType
export const Post:typeof PostType = PostType
export const Get:typeof GetType = GetType
