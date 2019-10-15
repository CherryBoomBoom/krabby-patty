import {  Router, Get } from "krabby-patty";
import BaseModule from "../base.module";

function testFunction3(req, res, next) {
	console.log('中间件3');
	next()
	console.log('中间件3s');
}
function testFunction4(req, res, next) {
	console.log('中间件4');
	next()
	console.log('中间件4s')
}

@Router('/')
export default class userController extends BaseModule{

  @Get('')
  hello(){
    return 'hello world'
  }
  @Get('service')
  helloService(){
    this.vvv
    return this.service.user.hello()
	}
	
	readonly middleware = [testFunction3]
	@Get('/login')
	async [Symbol()]() {
		return 'hello world';
	}
	@Get({ path: '/create', middleware: [testFunction4] })
	async [Symbol()]() {
		return await this.service.user.hello()
	}
}