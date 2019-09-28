# krabby-patty
<div style="height:160px;line-height:180px;text-align:center;font-size:120px">
<a href="" target="blank">🍔</a>
</div>

  <p align="center">A frame of <a href="http://nodejs.org" target="_blank">Node.js</a> framework for min websize.</p>
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
    npm i -g krabby-patty
    krabby-patty init demo
    cd demo
    npm i
    npm run test

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
<td>c</td>
<td>当前模块的Controller</td>
</tr>
<tr>
<td>2</td>
<td>s</td>
<td>当前模块的Service</td>
</tr>
<tr>
<td>3</td>
<td>m</td>
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

- dev 自动重新重启
- config 加载依据`base.config`,dev 环境 assign`dev.config`,非 dev 环境 assign`online.config`
- 中间件的组合，中间件的加载顺序为**APPLICATION**->**MODULE**->**CONTROLLER**->**ROUTER**
- 单模块的加载和多模块的加载
