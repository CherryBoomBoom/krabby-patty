import BaseModule from '../interface/Module'
import Module from '../../src/decorators/Module'
const error={
  USER_NO_EXIST:'USER_NO_EXIST'
}
@Module({error})
export default class UserModule extends BaseModule{

}