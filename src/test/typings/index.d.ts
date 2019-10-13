// declare class BaseModule{
//   s:{a:string,b:string}
// }

import BaseModule from "../base.module";
// export interface  BaseModule {
//     asdasd:'sadsd'
// }
export default interface IService{
  a:string,
  b:string,
  c:string,
}
declare module "../base.module" {
  export default interface BaseModule {
    // add(x, y);
    service:service
    v:string
  }
}
