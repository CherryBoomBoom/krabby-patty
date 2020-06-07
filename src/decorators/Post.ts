import baseRouter from './BaseRouter'
const method = 'POST'
export default function Post(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}