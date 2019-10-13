import {  Router, Get } from "krabby-patty";
import BaseModule from "../base.module";

@Router('/')
export default class userController extends BaseModule{

  @Get('')
  hello(){
    return 'hello world'
  }
  @Get('service')
  helloService(){
    this.vvv
    return this.s.user.hello()
  }
}