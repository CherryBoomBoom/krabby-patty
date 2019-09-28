import baseRouter from './BaseRouter'
const method = 'POST'
export default function Post(path):any{
  return function(target, key, descriptor){
    baseRouter(target, key, descriptor,path,method)
  }
}