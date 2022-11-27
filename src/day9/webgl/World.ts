import * as THREE from 'three';
import InitPlane from './models/InitPlane';
import RenderPlane from './models/RenderPlane';
import SampleModel from './models/sampleModel';
import UpdatePlane from './models/UpdatePlane';
import { View } from './postprocess/View';
import WebGL from './Webgl';

const LENGTH = 300;
const NUM = 100;

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    mrts: THREE.WebGLMultipleRenderTargets[];

    initPlane: InitPlane;
    updatePlane: UpdatePlane;
    renderPlane: RenderPlane;
    sample: SampleModel;

    view: View;

    step = 0;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;

        this.setUp();
    }
    setUp() {
        this.mrts = [
            new THREE.WebGLMultipleRenderTargets(LENGTH, NUM, 3, {
                type: THREE.FloatType,
            }),
            new THREE.WebGLMultipleRenderTargets(LENGTH, NUM, 3, {
                type: THREE.FloatType,
            }),
        ];

        // this.sample = new SampleModel();
        this.initPlane = new InitPlane(LENGTH, NUM);
        this.updatePlane = new UpdatePlane(LENGTH, NUM);
        this.renderPlane = new RenderPlane(LENGTH, NUM);

        this.view = new View();

        this.initPlane.render(this.mrts[0]);
        this.initPlane.render(this.mrts[1]);
    }
    update() {
        const step = this.step % 2;
        this.renderer.clear();
        // this.renderPlane.setPosTexture(this.mrts[0].texture[0]);
        this.updatePlane.update(this.mrts[1 - step], this.mrts[step]);
        this.renderPlane.setPosTexture(this.mrts[1 - step]);
        // this.view.render(this.mrts[1 - step].texture[0]);
        this.renderer.render(this.scene, this.camera);
        this.step++;
    }
    resize() {}
}
