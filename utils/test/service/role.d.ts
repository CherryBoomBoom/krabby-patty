import Service from '../../interface/Service';
export default class RoleService extends Service {
    getRole(): Promise<boolean>;
}
