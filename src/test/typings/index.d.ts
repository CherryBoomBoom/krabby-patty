import BaseModule from '../base.module'
import IController from './controller'
import IService from './service'

declare module '../base.module' {
	export default interface BaseModule {
		service:IService
		controller:IController
	}
}
