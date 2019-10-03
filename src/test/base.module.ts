import Module from '../interface/Module'
function testFunction(req,res,next){
  console.log('中间件1');
  next()
  console.log('中间件1s');
}
function testFunction2(req,res,next){
  console.log('中间件2');
  next()
  console.log('中间件2s');
}
export default class BaseModule extends Module{
  readonly middlewares = [testFunction,testFunction2]
  readonly tt="ss"
}