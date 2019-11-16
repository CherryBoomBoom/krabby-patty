export default class Application {
  protected app: {
    module: any
    router: { [key: string]: { method: 'POST' | 'GET'; callback: Function; functionName: string } }
    baseUrl: string
  }
  protected path: string
  constructor(app) {
    this.app = app
  }
}
