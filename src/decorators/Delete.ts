import baseRouter from './BaseRouter'
const method = 'DELETE'
export default function Delete(option:string | {path:string,middleware?:Function[]}):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,option,method)
  }
}