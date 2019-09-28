import Service from '../../interface/Service'
export default class RoleService extends Service {
  public async getRole() {
    console.log('success');
    return true
  }
}