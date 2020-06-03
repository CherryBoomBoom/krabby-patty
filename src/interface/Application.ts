import krabbyPatty from '../krabbyPatty'

export default class Application {
  public app: {
    module: any
    router: { [key: string]: { method: 'POST' | 'GET'; callback: Function; functionName: string } }
    baseUrl: string
	}
	public readonly middleware = []
  public path: string
  public config: {}
  constructor() {
		krabbyPatty(this)
  }
}
