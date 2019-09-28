import BaseService from '../../interface/Service';
export default class RoleService extends BaseService {
    getRole(): Promise<boolean>;
}
