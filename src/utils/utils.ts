import { MP } from '../platform/mp';

declare var global: any;
declare var mp: MP;

export const utils = {
	log: (...args: any) => {
		console.log.call(console, '[GM]', ...args);
	},
	isActor: (formId: number) => {
		return mp.get(formId, 'type') === 'MpActor';
	},
	hook: (eventName: string, callback: (...args: any[]) => void) => {
		if (!global.knownEvents.includes(eventName)) {
			global.knownEvents.push(eventName);
		}
		const prev = mp[eventName];
		mp[eventName] = (...args: any) => {
			try {
				const prevRes = prev ? prev(...args) : undefined;
				const callbackRes = callback(...args);
				return callbackRes !== undefined ? callbackRes : prevRes;
			} catch (e) {
				utils.log(`'${eventName}' threw an error: ${e}`);
				if (e['stack']) {
					utils.log(e['stack']);
				}
				return undefined;
			}
		};
	},
};