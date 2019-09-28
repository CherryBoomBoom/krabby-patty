import Application from './Application'
export default class Controller extends Application{
  protected baseUrl:string
  protected router:{[key:string]:{method:'POST'|'GET',callback:Function,functionName:string}}
  constructor(app){
    super(app)
    this.app.router = this.router
    this.app.baseUrl = this.baseUrl
  }
}