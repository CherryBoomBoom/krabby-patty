import * as path from "path";
import { Schema } from 'mongoose'
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed

export default function mongooseTsHelper(baseDir: string,
	names: string[],
	key: string) {
	let modelFile = ``;
	let modelPathToInterface = {}
	for (let i of names) {
		let extname = path.extname(i)
		let fileName = i.replace(extname, "");
		let filePath = path.join(baseDir, key, i);
		let exportModule = require(filePath).default;
		let modelFileBody = ``;
		for (let j of Object.keys(exportModule)) {
			let type = exportModule[j].type
			if (type === String) modelFileBody += `\n	${j}: string`
			if (type === Object) modelFileBody += `\n	${j}: any`
			if (type === Number) modelFileBody += `\n	${j}: number`
			if (type === Boolean) modelFileBody += `\n	${j}: boolean`
			if (type === Array) modelFileBody += `\n	${j}: any[]`
			if (type === Date) modelFileBody += `\n	${j}: Date`
			if (type === Buffer) modelFileBody += `\n	${j}: Buffer`
			if (type === Mixed) modelFileBody += `\n	${j}: any`
			if (type === ObjectId) modelFileBody += `\n	${j}: typeof Schema.Types.ObjectId`
		}
		modelPathToInterface[fileName] = modelFileBody
	}
	modelFile = `\nimport { Schema, Document,Model } from 'mongoose'\n`
	for (let i of Object.keys(modelPathToInterface)) {
		let exportFileName = i.charAt(0).toUpperCase() + i.slice(1);
		modelFile += `\ninterface I${exportFileName}Model extends Document {${modelPathToInterface[i]}\n}`
	}
	modelFile += `
export default interface IModel {`
	for (let i of Object.keys(modelPathToInterface)) {
		let exportFileName = i.charAt(0).toUpperCase() + i.slice(1);
		modelFile += `\n	${exportFileName}: Model<I${exportFileName}Model>`
	}
	modelFile += `
}`
	return modelFile
}