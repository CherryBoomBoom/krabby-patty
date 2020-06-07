export default function Controller(path):any{
  return function(target){
    target.prototype.baseUrl = path
  }
}