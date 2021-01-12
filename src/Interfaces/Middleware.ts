import { Lifecycles } from '@discord-ts-app/lifecycle'

export default interface Middleware {
	readonly lifecycle: Lifecycles
	run(...params: any): Promise<void>
}
