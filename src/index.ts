import krabbyPattyType from './interface/KrabbyPatty'
import ControllerType from './decorators/Controller'
import PostType from './decorators/Post'
import GetType from './decorators/Get'
import HeadType from './decorators/Head'
import ConnectType from './decorators/Connect'
import OptionsType from './decorators/Options'
import PutType from './decorators/Put'
import TraceType from './decorators/Trace'

export const krabbyPatty: typeof krabbyPattyType = krabbyPattyType
export const Controller: typeof ControllerType = ControllerType
export const GET: typeof GetType = GetType
export const POST: typeof PostType = PostType
export const HEAD: typeof HeadType = HeadType
export const CONNECT: typeof ConnectType = ConnectType
export const OPTIONS: typeof OptionsType = OptionsType
export const PUT: typeof PutType = PutType
export const TRACE: typeof PutType = TraceType
