import Events from '../Enums/Events'

export default interface Event {
	readonly name: string
	type: Events
	run(...params: any): Promise<void>
}
