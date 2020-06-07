import Controller from '../../../../decorators/Controller'
import Get from '../../../../decorators/Get'
import BaseModule from '../../base.module'
import KrabbyPatty from '../../../../interface/KrabbyPatty';
import app from '../../app'

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
@Controller('/ss')
export default class ssController {
	readonly middleware=[testFunction3]
  @Get('/login')
  async [Symbol()]() {
		// console.log(this.service.role.getRole());
		// return await this.model.User.find({});
    return {a:55}
  }
	@Get({ path: '/create', middleware:[testFunction4]})
	async [Symbol()]() {
    // return await this.service.role.getRole()
  }
}