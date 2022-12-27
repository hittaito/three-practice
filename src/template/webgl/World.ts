import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;

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
        this.sample = new SampleModel();

        // post process
        this.fxaa = new FXAA();
    }
    update() {
        this.sample.update();
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
}
