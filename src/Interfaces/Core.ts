import Command from './Command'
import Event from './Event'
import Middleware from './Middleware'

export default interface Core {
	events: Array<Event>
	commands: Array<Command>
	middlewares: Array<Middleware>
	modules: Array<any>
}
