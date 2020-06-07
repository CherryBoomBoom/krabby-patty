import baseRouter from './BaseRouter'
const method = 'Put'
export default function Put(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}