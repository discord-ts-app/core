import { Message } from 'discord.js'

export default interface Command {
	readonly name: string
	readonly description: string
	readonly tag: string
	readonly alias?: Array<string>
	readonly roles?: Array<string>
	run(message: Message, args: Array<string>): Promise<void>
}
