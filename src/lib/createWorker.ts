import * as path from 'path'
import cluster = require('cluster')
import chokidar = require('chokidar')

const START_PATH = path.dirname(require.main.filename)

/**
 * 子进程创建热更新
 */
export default () => {
  if (!cluster.isMaster) return true
	let worker = cluster.fork()
	
  const CHOKIDAR = chokidar.watch([START_PATH])
  CHOKIDAR.on('change', path => {
    console.info(`${path} changed`)
    worker && worker.kill()
    worker = cluster.fork()
    worker.on('listening', () => {})
    worker.on('message', () => {})
  })
}
