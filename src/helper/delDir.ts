import * as fs from 'fs'

export default function delDir(p) {
  if (!fs.existsSync(p)) return
  const list = fs.readdirSync(p)
  list.map(v => {
    let url = `${p}/${v}`
    let stats = fs.statSync(url)
    if (stats.isFile()) fs.unlinkSync(url)
    else delDir(url)
  })
  if (!list.length) fs.rmdirSync(p)
}
