import Application from './Application'
export default class Service extends Application {
  protected body: { [key: string]: any }
  protected query: { [key: string]: any }
  protected header: { [key: string]: any }
}
