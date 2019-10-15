import * as fs from "fs";

export default function delDir(p) {
	try {
		let list = fs.readdirSync(p)
		list.forEach((v, _i) => {
			let url = p + '/' + v
			let stats = fs.statSync(url)
			if (stats.isFile()) {
				fs.unlinkSync(url)
			} else {
				delDir(url)
			}
		})
		fs.rmdirSync(p)
	} catch (e) { }

}