import { Controller, Router, Get } from "krabby-patty";

@Router('/')
export default class userController extends Controller{

  @Get('')
  hello(){
    return 'hello world'
  }
  @Get('service')
  helloService(){
    return this.s.user.hello()
  }
}