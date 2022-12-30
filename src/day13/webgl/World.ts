import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import Tube from './models/Tube';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    tube: Tube;

    fxaa: FXAA;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.target = new THREE.WebGLRenderTarget(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio)
        );

        this.setUp();
    }
    setUp() {
        // light
        const amb = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(amb);

        const dir = new THREE.DirectionalLight(0x2244ee, 1);
        this.scene.add(dir);
        this.sample = new SampleModel();
        this.tube = new Tube();

        // post process
        this.fxaa = new FXAA();
    }
    update(time: number) {
        this.sample.update();
        this.tube.updateCamera(time);
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
}
