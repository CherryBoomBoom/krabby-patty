export default (module)=> {
  let path = require.resolve(module);
  require.cache[path] = void 0;
 }