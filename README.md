# 蟹黄堡Web框架
<p align="center">
<a href="" target="blank"><img src="https://i2.tiimg.com/700479/5ae4ce384fd00748.png"></a>
</p>

  <p align="center">A frame of <a href="http://nodejs.org" target="_blank">Node.js</a> framework for min website.</p>
    <p align="center">
<a href="https://www.npmjs.com/~cherryboom" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/krabby-patty" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
</p>

## 设计理念

- 有标准入口，可指定工作目录
- 模块内快速引用，所有需要的属性加载在 this 上
- 嵌套模块，嵌套中间件
- 以标准目录树作为装载依据

## 快速开始
### 脚手架
    npm i -g krabby-patty
    krabby-patty init demo
    cd demo
    npm i
    npm run test
### 标准入口
    //app.ts
    import {krabbyPatty} from "krabby—patty";
    krabbyPatty()

    //base.module.ts
    import {Module} from 'krabby—patty
    export default class BaseModule extends Module{
      readonly middleware = []
      readonly modules = []
    }

    //controller/demo.ts
    import {Controller,Router,Get} from 'krabby—patty
		import BaseModule from "../base.module";
    @Router('')
    export default class DemoController extends BaseModule{
      readonly middleware=[testFunction3]
      @Get('/')
      public demo(){
      }
      @Get('/service')
      public getService(){
        return this.s.demo.demo()
      }
      @Get({path:'/service',middleware:[]})
      public mid(){
        return
      }
    }

    //service/demo.ts
    import {Service} from 'krabby—patty'
		import BaseModule from "../base.module";
    export default class DemoService extends BaseModule{
      public async demo(){
        console.log('成功');
        return 'ok'
      }

}

## 组件

> Application

<table style="width:100%">
<tbody>
<tr>
<td>#</td>
<td>name</td>
<td>label</td>
</tr>
<tr>
<td>1</td>
<td>error</td>
<td>全局错误索引</td>
</tr>
<tr>
<td>2</td>
<td>module</td>
<td>全局的Module</td>
</tr>
<tr>
<td>3</td>
<td>helper</td>
<td>全局的Helper</td>
</tr>
</tbody>
</table>


> Helper - `extends Application`

> Module - `extends Application`

<table style="width:100%">
<tbody>
<tr>
<td>#</td>
<td>name</td>
<td>label</td>
</tr>
<tr>
<td>1</td>
<td>controller</td>
<td>当前模块的Controller</td>
</tr>
<tr>
<td>2</td>
<td>service</td>
<td>当前模块的Service</td>
</tr>
<tr>
<td>3</td>
<td>model</td>
<td>当前模块的model</td>
</tr>
</tbody>
</table>

> Controller - `extends Module`
<table style="width:100%">
<tbody>
<tr>
<td>#</td>
<td>name</td>
<td>label</td>
</tr>
<tr>
<td>1</td>
<td>body</td>
<td>请求的 body </td>
</tr>
<tr>
<td>2</td>
<td>query</td>
<td>请求的 query</td>
</tr>
<tr>
<td>3</td>
<td>file</td>
<td>请求的 form 表单的文件</td>
</tr>
</tbody>
</table>

> Service - `extends Module`

## TODO

- orm加载 内置组件
- 仅加载的模块修改时重启
- 全局错误的抛出测试
- 规范生成api文档，及错误日志，做错误日志上报
- 考虑做多线程
- 考虑开发独立的参数校验模块

## 说明
- .d.ts放在项目目录下的typings下,dev模式下自动重启生产对应声明文件，可直接this.service食用
- 中间件执行顺序为base.module-item.module-controller-router,其中module可无限嵌套
- module嵌套在启动目录的base.module起,根据引用模块加载子module
- 启动时可不输入任何参数默认启动端口3000，base.module不存在则视为不需要base.module中间件，当前目录为项目目录，不向下嵌套
