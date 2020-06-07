import baseRouter from './BaseRouter'
const method = 'HEAD'
export default function Head(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}