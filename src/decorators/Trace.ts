import baseRouter from './BaseRouter'
const method = 'TRACE'
export default function Trace(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}