import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';
import { View } from './process/View';
import Perlin from './process/Perlin';
import Points from './models/Points';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    points: Points;
    noise: Perlin;

    view: View;
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
        // this.sample = new SampleModel();
        this.points = new Points();
        this.noise = new Perlin();
        // post process
        this.view = new View();
        this.fxaa = new FXAA();
    }
    update() {
        this.noise.render();

        this.points.update(this.noise.texture);
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
        // this.view.render(this.target.texture);
    }
    resize() {}
}
