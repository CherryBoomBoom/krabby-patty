import * as fs from 'fs'

export default path => {
  if (!fs.existsSync(path)) fs.mkdirSync(path)
}
