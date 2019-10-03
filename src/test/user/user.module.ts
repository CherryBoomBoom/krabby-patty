import Module from '../../interface/Module'
function testFunction(req,res,next){
  console.log('中间件11');
  next()
  console.log('中间件11s');
}
function testFunction2(req,res,next){
  console.log('中间件22');
  next()
  console.log('中间件22s');
}
export default class BaseModule extends Module{
  readonly middlewares = [testFunction,testFunction2]
}