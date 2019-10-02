import Router from '../../decorators/Router'
import Get from '../../decorators/Get'
import Controller from '../../interface/Controller'
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
@Router('/user')
export default class RoleController extends Controller {
  readonly middlewares=[testFunction3]
  @Get('/login')
  public login() {
    return 'hello world';
  }
  @Get({path:'/create',middlewares:[testFunction4]})
  public create() {
    return this.s.role.getRole()
  }
}