import Controller from '../../../decorators/Controller'
import Get from '../../../decorators/Get'
import Controller from '../../../interface/Controller'
import UserModule from '../base.module'
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
@Controller('/ro')
export default class RoleController {
	readonly middleware=[testFunction3,testFunction4]
  @Get('/login')
  public login() {
    return 'hello world';
  }
	@Get({ path: '/create', middleware:[testFunction5]})
  public create() {
    // this.asadasddd
    return true
  }
}