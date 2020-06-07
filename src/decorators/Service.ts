import {FOOD_TYPE,SERVICE} from '../lib/LoadFood'

export default function Service():any{
  return function(target){
    target.prototype[FOOD_TYPE] = SERVICE
  }
}