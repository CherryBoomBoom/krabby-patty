import Router from '../../decorators/Router'
import Get from '../../decorators/Get'
import BaseModule from '../base.module'
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
export default class RoleController extends BaseModule {
  readonly middlewares=[testFunction3]
  @Get('/login')
  async [Symbol()]() {
    return 'hello world';
  }
  @Get({path:'/create',middlewares:[testFunction4]})
  async [Symbol()]() {
    this.v
    return await this.s.role.getRole()
  }
}