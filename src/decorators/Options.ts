import baseRouter from './BaseRouter'
const method = 'OPTIONS'
export default function Options(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}