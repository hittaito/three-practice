import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';
import Boxes from './models/Boxes';
import Plasma from './process/Plasma';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    boxes: Boxes;
    plasma: Plasma;

    fxaa: FXAA;
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
        // model
        this.boxes = new Boxes();

        // process
        this.plasma = new Plasma();

        // post process
        this.fxaa = new FXAA();
    }
    update() {
        this.plasma.render();

        this.boxes.update(this.plasma.texture);
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
}
