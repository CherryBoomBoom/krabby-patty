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
export const Get: typeof GetType = GetType
export const Post: typeof PostType = PostType
export const Head: typeof HeadType = HeadType
export const Connect: typeof ConnectType = ConnectType
export const Options: typeof OptionsType = OptionsType
export const Put: typeof PutType = PutType
export const Trace: typeof PutType = TraceType
