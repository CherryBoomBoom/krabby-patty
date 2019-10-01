export default(target, key, descriptor,option:string | {path:string,middlewares?:Function[]},method:string)=>{
  let [middlewares,path] = typeof option === 'string'?[[],option]:[option.middlewares,option.path]
  if(!target.router)target.router = {}
    target.router[path] = {callback:descriptor.value,functionName:key,method,middlewares}
}