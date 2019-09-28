import BaseService from '../../interface/Service'
export default class UserService extends BaseService{
  public async getUser(){
    console.log(this.s.role.getRole());
    return true
  }

}