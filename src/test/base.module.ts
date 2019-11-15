import Module from "../interface/Module";
import userModule from "./user/base.module";
import mongooseTsHelper from '../definition/mongooseTsHelper'
import mongooseModel from '../definition/mongooseModel'

function testFunction(req, res, next) {
	console.log("中间件1");
	next();
	console.log("中间件1s");
}
function testFunction2(req, res, next) {
	console.log("中间件2");
	next();
	console.log("中间件2s");
}
export default class BaseModule extends Module {
	readonly middleware = [testFunction, testFunction2];
	// readonly modules = [userModule];
	// readonly ingredients = {
		// model: {
		// 	loadDir: "model", // 模型使用的文件夹名称 必填
		// 	processed: mongooseModel, // 加工处理后的数据将加载在module上 可选
		// 	customPrompt: mongooseTsHelper // 自定义声明文件，将直接生成index.d.ts 可选
		// }
	// };
	readonly tt = "ss"; // 自定义装载的变量
}
