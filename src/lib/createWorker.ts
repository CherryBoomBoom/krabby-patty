import * as path from 'path'
import cluster = require('cluster')
import chokidar = require('chokidar')

const START_PATH = path.dirname(require.main.filename)

export default () => {
  if (!cluster.isMaster) return true
  let worker = cluster.fork()
  let chokidarer = chokidar.watch([START_PATH])
  chokidarer.on('change', path => {
    console.log(`${path} changed`)
    worker && worker.kill()
    worker = cluster.fork()
    worker.on('listening', () => {})
    worker.on('message', () => {})
  })
}
