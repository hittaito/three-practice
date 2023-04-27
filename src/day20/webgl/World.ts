import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';
import Floor from './models/Floor';
import { vec3 } from './physics/WorkerEvents';
import CWorker from './physics/CWorker';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    floor: Floor;

    fxaa: FXAA;

    lastTime: number;
    delay = (1 / 120) * 1000;
    force: vec3 | null = null;
    worker: CWorker;

    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.target = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );

        this.setUp();
    }
    setUp() {
        // light
        const amb = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(amb);
        // model
        this.sample = new SampleModel();
        this.floor = new Floor();

        // post process
        this.fxaa = new FXAA();
        this.worker = new CWorker();
    }
    update() {
        if (!this.worker.state) return;

        this.sample.update(
            this.worker.state.box.position,
            this.worker.state.box.quaternion
        );
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);
        this.worker.debug();

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
    mouseUpdate(mouse: vec3 | null) {
        if (mouse !== null) {
            console.log(Math.atan(mouse.y / mouse.x));
        }
        this.worker.updateForce(mouse);
    }
}
