import Router from '../../../decorators/Router'
import Get from '../../../decorators/Get'
import Controller from '../../../interface/Controller'
function testFunction3(req,res,next){
  console.log('中间件3');
  next()
  console.log('中间件3s');
}
function testFunction4(req,res,next){
  console.log('中间件4');
  next()
  console.log('中间件4s')
}
function testFunction5(req,res,next){
  console.log('中间件5');
  next()
  console.log('中间件5s')
}
@Router('/ro')
export default class RoleController extends Controller {
  readonly middlewares=[testFunction3,testFunction4]
  @Get('/login')
  public login() {
    return 'hello world';
  }
  @Get({path:'/create',middlewares:[testFunction5]})
  public create() {
    return true
  }
}