import * as THREE from 'three';
import { Instance } from './models/Instance';
import SampleModel from './models/sampleModel';
import { Boids } from './process/Boids';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';

const COUNT = 100;
const HISTORY = 10;

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    instance: Instance;

    boids: Boids;
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
        // model
        // this.sample = new SampleModel();
        this.instance = new Instance(COUNT, HISTORY);

        // light
        const light = new THREE.DirectionalLight(0x00ff00, 1);
        light.position.y = 3;
        this.scene.add(light);
        // process
        this.boids = new Boids(COUNT, HISTORY);
        this.fxaa = new FXAA();
    }
    update() {
        // this.sample.update();
        // this.renderer.setRenderTarget(this.target);
        // this.renderer.render(this.scene, this.camera);
        this.boids.render();
        this.instance.update(this.boids.readBuffer);
        this.renderer.render(this.scene, this.camera);

        // this.fxaa.render(null, this.boids.readBuffer.texture[0]);
    }
    resize() {}
    onMouse(x: number, y: number) {
        this.boids.onMouse(x, y);
    }
}
