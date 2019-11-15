import * as path from "path";
import cleanCache from "./lib/cleanCache";
import getExpress from "./lib/getExpress";
import LoadTsHelper from './lib/loadTsHelper'
import cluster = require('cluster');
import chokidar = require('chokidar');

const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`;
export const GLOBAL: { app: any; option: any } = { app: void 0, option: {} };
export default function krabbyPatty(
	option: { [key: string]: any } = {}
): void {
	let startPath = path.dirname(require.main.filename);
	if (!Object.keys(option).length) {
		option = require(path.join(startPath, "./config/config.default")).default;
	}
	GLOBAL.option = Object.assign({}, option);
	let { port = 3000, baseDir = path.dirname(require.main.filename), modulePath = path.join(baseDir, "./base.module") } = option
	baseDir = baseDir || startPath;
	modulePath = modulePath || path.join(baseDir, "./base.module")
	let module = require(modulePath).default;
	let MODULE = new module();
	let app = getExpress(MODULE);
	let loadFoodPath = path.join(__dirname, "./lib/loadFood");
	cleanCache(loadFoodPath)
	let loadFood = require(loadFoodPath).default;
	const food = new loadFood({ baseDir, module: MODULE, app,  config: Object.assign(option, { baseDir }) });
	MODULE = food.module;
	app = food.app;
	app.module = MODULE;
	app = require("http").createServer(app);
	createWorker(app, port, startPath)
}

function createWorker(app, port, startPath) {

	const watchConfig = {
		dir: [startPath],
		options: {}
	};
	if (cluster.isMaster) {
		let worker = cluster.fork();
		chokidar.watch(watchConfig.dir, watchConfig.options).on('change', path => {
			console.log(`${path} changed`);
			worker && worker.kill();
			worker = cluster.fork()
			worker.on('listening', (address) => {
				console.log(`[master] listening: worker ${worker.id}, pid:${worker.process.pid} ,Address:${address.address} :${address.port}`);
			});
			worker.on('message', msg => {
				console.log(`msg: ${msg} from worker#${worker.id}`);
			});
		});
	} else {
		app.listen(port, () => console.log(SUCCESS_LOG + port + "\x1B[0m"))
		new LoadTsHelper(app.module)
	}
}
