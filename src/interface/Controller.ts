import Application from './Application'
export default class Controller extends Application{
  protected baseUrl:string
  protected router:{[key:string]:{method:'POST'|'GET',callback:Function,functionName:string}}
  protected body:{[key:string]:any}
  protected query:{[key:string]:any}
  protected header:{[key:string]:any}
  constructor(app){
    super(app)
    this.app.router = this.router
    this.app.baseUrl = this.baseUrl
  }
}