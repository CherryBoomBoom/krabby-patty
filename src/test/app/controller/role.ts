import Router from '../../../decorators/Router'
import Get from '../../../decorators/Get'
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
	readonly middleware=[testFunction3]
  @Get('/login')
  async [Symbol()]() {
    // return await this.model.User.find({});
    return true
  }
	@Get({ path: '/create', middleware:[testFunction4]})
	async [Symbol()]() {
    // return await this.service.role.getRole()
  }
}