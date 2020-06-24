import Service from '../../../decorators/Service'

@Service()
export default class RoleService {
  public async getRole() {
    return "getRole"
  }
  public async getsadRole() {
    // @ts-ignore
    console.log(this.body);
  }

  public async S_User() {
    return true
  }
}