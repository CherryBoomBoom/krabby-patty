export default function Router(path):any{
  return function(target){
    target.prototype.baseUrl = path
  }
}