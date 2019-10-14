import baseRouter from './BaseRouter'
const method = 'GET'
export default function Get(option: string | { path: string, middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}