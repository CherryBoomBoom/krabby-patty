import {FOOD_TYPE,CONTROLLER} from '../lib/LoadFood'

export default function Controller(path):any{
  return function(target){
    target.prototype.baseUrl = path
    target.prototype[FOOD_TYPE] = CONTROLLER
  }
}