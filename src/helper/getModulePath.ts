export default module => {
  for (let i of Object.keys(require.cache)) {
    let itemModule = require.cache[i].exports.default
    if (itemModule === module) return i
  }
}
