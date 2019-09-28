import Router from '../../decorators/Router'
import Get from '../../decorators/Get'
import BaseController from '../../interface/Controller'
@Router('/user')
export default class UserController extends BaseController{
  @Get('/login')
  public login(){
    //@ts-ignore
    console.log(this.query);
    return 'hello world'
  }
  @Get('/create')
  public create(){

  }
}