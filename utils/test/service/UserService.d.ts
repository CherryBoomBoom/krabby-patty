import BaseService from '../../interface/Service';
export default class UserService extends BaseService {
    getUser(): Promise<boolean>;
}
