import Router from '../../decorators/Router'
import Get from '../../decorators/Get'
import Controller from '../../interface/Controller'
@Router('/user')
export default class RoleController extends Controller {
  @Get('/login')
  public login() {
    return 'hello world'
  }
  @Get('/create')
  public create() {
    return this.s.role.getRole()
  }
}