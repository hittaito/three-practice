import Physics from '../Physics';
import WebGL from '../Webgl';
import { I3ToC, ICTo3, vec3 } from './WorkerEvents';
import CannonDebugRenderer from './Debugger';

let mode = 0;

export default class CWorker {
    prod = false;
    lastTime: number;
    delay = (1 / 120) * 1000;
    force: vec3 | null = null;
    state: ICTo3;

    debugger: CannonDebugRenderer;
    constructor() {
        if (mode === 1) {
            this.prod = true;
            this.startWorker();
        } else {
            this.startCannon();
        }
    }
    updateForce(f: vec3 | null) {
        this.force = f;
        // console.log(f?.x, f?.y);
    }
    startCannon() {
        const webgl = new WebGL();
        const physics = new Physics();
        this.lastTime = Date.now();
        this.debugger = new CannonDebugRenderer(webgl.scene, physics.world);
        this.anime(physics);
    }
    anime(physics: Physics) {
        const diff = Math.max(0, this.delay - (Date.now() - this.lastTime));
        if (this.force !== null && physics.constraintState === null) {
            physics.start(this.force);
        } else if (this.force !== null && physics.constraintState === 'move') {
            physics.move(this.force);
            // console.log(this.force);
        } else if (this.force === null && physics.constraintState === 'move') {
            physics.end();
        } else {
            physics.end();
        }
        physics.world.step(this.delay * 0.001);
        this.state = {
            box: {
                position: physics.box.position,
                quaternion: physics.box.quaternion,
            },
        };
        this.lastTime = Date.now();
        setTimeout(() => this.anime(physics), diff);
    }
    debug() {
        if (this.debugger) {
            this.debugger.update();
        }
    }

    // // web worker
    startWorker() {
        const worker = new Worker(new URL('./Backend.ts', import.meta.url), {
            type: 'module',
        });
        this.lastTime = Date.now();
        worker.onmessage = (e: MessageEvent<ICTo3>) => {
            this.state = e.data;

            const diff = Math.max(0, this.delay - (Date.now() - this.lastTime));
            setTimeout(() => this.sendWorker(worker), diff);
        };
        this.sendWorker(worker);
    }
    sendWorker(worker: Worker) {
        console.log('send', worker);
        this.lastTime = Date.now();
        const msg: I3ToC = {
            force: this.force,
            delay: this.delay,
        };
        worker.postMessage(msg);
    }
}
