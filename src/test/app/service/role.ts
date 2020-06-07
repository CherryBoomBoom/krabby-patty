import BaseModule from '../base.module'
import Service from '../../../decorators/Service'

@Service()
export default class RoleService {
  public async getRole() {
    return true
  }
  public async getsadRole() {
    return true
  }

  public async S_User() {
    return true
  }
}