import baseRouter from './BaseRouter'
const method = 'GET'
export default function Get(path):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,path,method)
  }
}