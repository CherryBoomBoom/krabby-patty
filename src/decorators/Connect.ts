import baseRouter from './BaseRouter'
const method = 'CONNECT'
export default function Connect(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}