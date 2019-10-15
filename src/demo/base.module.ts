import Module from '../interface/Module'
import userModule from './user/base.module'
// let userModule = require.resolve('./user/base.module')
function testFunction(req, res, next) {
	console.log('中间件1');
	next()
	console.log('中间件1s');
}
function testFunction2(req, res, next) {
	console.log('中间件2');
	next()
	console.log('中间件2s');
}
const error={
  USER_NO_EXIST:'USER_NO_EXIST'
}
export default class BaseModule extends Module{
	readonly middleware = [testFunction, testFunction2]
	readonly modules = [userModule]
}