export default function Module(member:{error:{[key:string]:string}}):any{
  return function(target){
    target.prototype.error = member.error
  }
}