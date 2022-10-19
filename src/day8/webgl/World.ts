import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import SampleModel from './models/sampleModel';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    composer: EffectComposer;

    sample: SampleModel;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.composer = webgl.composer;

        this.setUp();
    }
    setUp() {
        this.sample = new SampleModel();

        // post process
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.composer.addPass(smaaPass);
    }
    update() {
        this.sample.update();
    }
    resize() {}
}
