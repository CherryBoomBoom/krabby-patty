import BaseModule from '../base.module'
import IController from './controller'
import IService from './service'
import IModel from './model'

declare module '../base.module' {
	export default interface BaseModule {
		service:IService
		controller:IController
		model: IModel
	}
}