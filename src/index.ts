import { Client } from 'discord.js'
import Env from '@discord-ts-app/env'
import Ignitor from '@discord-ts-app/ignitor'
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
		this.modules.forEach((module: any) => {
			const functions = Object.getOwnPropertyNames(Object.getPrototypeOf(module))
			functions.splice(0, 1)
			functions.map((func: any) => {
				const { object } = Object.getOwnPropertyDescriptors(module[func])
				if (!object) return
				if (object.value.module == 'EVENT') {
					this.client.on(object.value.event, (...args) => object.value.run(...args))
					this.events.push(Object.create({ name: object.value.event, run: object.value.run }))
				}
				if (object.value.module == 'COMMAND') this.commands.push(object.value.ctx)
				if (object.value.module == 'MIDDLEWARE') this.middlewares.push(Object.create({ lifecycle: object.value.lifecycle, run: object.value.run }))
			})
		})
		this.middlewares.forEach(({ lifecycle, run }: Middleware) => NodeEmitter.on(lifecycle, async (params?: any) => await run(params)))

		this.client.login(Env.get('SECRET_TOKEN'))
	}
}
