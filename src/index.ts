import { Client } from 'discord.js'
import Env from '@discord-ts-app/env'
import { NodeEmitter } from '@discord-ts-app/lifecycle'
import Core from './Interfaces/Core'
import Event from './Interfaces/Event'
import Command from './Interfaces/Command'
import Middleware from './Interfaces/Middleware'

export default class Bot {
	private client: Client
	public events: Array<Event>
	public commands: Array<Command>
	public middlewares: Array<Middleware>
	public modules: Array<any>

	constructor(client: Client, core: Core) {
		this.client = client
		this.events = core.events
		this.commands = core.commands
		this.middlewares = core.middlewares
		this.modules = core.modules
		this.initialize()
	}

	private initialize() {
		this.events.map(({ name, run }: Event) => this.client.on(name, run))
		this.middlewares.map(({ lifecycle, run }: Middleware) => NodeEmitter.on(lifecycle, (params?: any) => run(params)))
		this.modules.forEach((module: any) => {
			const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(module))
			functions.splice(0, 1)
			functions.map((func: any) => {
				const { object } = Object.getOwnPropertyDescriptors(module[func])
				if (!object) return
				if (object.value.module == 'EVENT') this.client.on(object.value.event, (...args) => object.value.run(...args))
				if (object.value.module == 'COMMAND') this.commands.push(object.value.ctx)
				if (object.value.module == 'MIDDLEWARE') NodeEmitter.on(object.value.lifecycle, (...args) => object.value.run(...args))
			})
		})

		this.client.login(Env.get('SECRET_TOKEN'))
	}
}
