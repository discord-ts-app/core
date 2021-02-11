export default interface Middleware {
	readonly lifecycle: 'messageReceived' | 'commandReceived' | 'createDiscordClient' | 'starting' | 'commandLoaded' | 'eventLoaded' | 'middlewareLoaded'
	run(...params: any): Promise<void>
}
