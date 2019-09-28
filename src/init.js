#!/usr/bin/env node

let child = require('child_process');
const task = process.argv[process.argv.length - 2]
const param = process.argv[process.argv.length - 1]
if (task === 'init' && !!param) {
    const teskDir = process.cwd()
    const localDir = __dirname
    child.exec(`cp -r ${localDir}/demo ${teskDir}/${param}`, function(err, sto) {
        if (!err) console.log(`\x1B[1;32mdemo build success!\x1B[0m`)
    })
}