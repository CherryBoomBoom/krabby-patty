export default(target, key, descriptor,option:string | {path:string,middleware?:Function[]},method:string)=>{
  let [middleware,path] = typeof option === 'string'?[[],option]:[option.middleware,option.path]
  if(!target.router)target.router = {}
    target.router[path] = {callback:descriptor.value,functionName:key,method,middleware}
}