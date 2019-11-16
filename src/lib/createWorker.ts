import * as path from 'path'
import cluster = require('cluster')
import chokidar = require('chokidar')
import loadTsHelper from './loadTsHelper'

const SUCCESS_LOG = `\n🍔  Server run at \x1B[1;32mhttp://localhost:`
const START_PATH = path.dirname(require.main.filename)

export default app => {
  if (cluster.isMaster) {
    let worker = cluster.fork()
    let chokidarer = chokidar.watch([START_PATH])
    chokidarer.on('change', path => {
      console.log(`${path} changed`)
      worker && worker.kill()
      worker = cluster.fork()
      worker.on('listening', () => {})
      worker.on('message', () => {})
    })
  } else {
    let { port = 3000, module } = app || {}
    app.listen(port, () => console.log(SUCCESS_LOG + port + '\x1B[0m'))
    new loadTsHelper(module)
  }
}
