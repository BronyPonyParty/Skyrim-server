import { utils } from '../utility/utils';
import { actorValues } from '../properties/ActorValues';
import { MP } from '../platform';
import { defaultSpawnPoint } from '../constants/constants';
import { PropertyName } from '../types/PropertyName';
declare const mp: MP;

export const spawnSystem = {
	timeToRespawn: 6000,
	spawn: (targetFormId: number) => {
		const spawnPoint = mp.get(targetFormId, 'spawnPoint');
		for (const propName of Object.keys(spawnPoint || defaultSpawnPoint)) {
			mp.set(targetFormId, propName as PropertyName, (spawnPoint || defaultSpawnPoint)[propName]);
		}
		actorValues.set(targetFormId, 'health', 'damage', 0);
		actorValues.set(targetFormId, 'magicka', 'damage', 0);
		actorValues.set(targetFormId, 'stamina', 'damage', 0);
		setTimeout(() => {
			mp.set(targetFormId, 'isDead', false);
		}, 500);
		utils.log(`${targetFormId.toString(16)} respawns`);
	},
	updateSpawnPoint: (targetFormId: number) => {
		mp.set(targetFormId, 'spawnPoint', {
			pos: mp.get(targetFormId, 'pos'),
			angle: mp.get(targetFormId, 'angle'),
			worldOrCellDesc: mp.get(targetFormId, 'worldOrCellDesc'),
		});
	},
};

export const init = () => {
	utils.hook('onDeath', (pcFormId: number) => {
		setTimeout(() => {
			spawnSystem.spawn(pcFormId);
		}, spawnSystem.timeToRespawn);
	});
};
