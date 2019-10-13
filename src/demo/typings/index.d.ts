// declare class BaseModule{
//   s:{a:string,b:string}
// }

import BaseModule from "../base.module";
// export interface  BaseModule {
//     asdasd:'sadsd'
// }

declare module "../base.module" {
  export default interface BaseModule {
    // add(x, y);
    vvv:string
    sss:string
  }
}
