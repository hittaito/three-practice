import { I3ToC, ICTo3 } from './WorkerEvents';
import Physics from '../Physics';
let physics: Physics;

console.log('tet');

self.onmessage = (e: MessageEvent<I3ToC>) => {
    if (!physics) {
        physics = new Physics();
    }

    if (e.data.force !== null && physics.constraintState === null) {
        physics.start(e.data.force);
    } else if (e.data.force !== null && physics.constraintState === 'move') {
        physics.move(e.data.force);
    } else if (e.data.force === null && physics.constraintState === 'move') {
        physics.end();
    } else {
        physics.end();
    }
    physics.world.step(e.data.delay * 0.001);
    const msg: ICTo3 = {
        box: {
            position: physics.box.position,
            quaternion: physics.box.quaternion,
        },
    };
    self.postMessage(msg);
};
