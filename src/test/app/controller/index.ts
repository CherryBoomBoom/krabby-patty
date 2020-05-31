import Router from '../../../decorators/Router'
import Get from '../../../decorators/Get'
import BaseModule from '../base.module'

@Router('/')
export default class RoleController extends BaseModule {
  @Get('')
  async [Symbol()](r, res) {
	  res.setHeader('Content-Type', 'text/html');
	  res.sendfile(`  
	 `)
  }

}