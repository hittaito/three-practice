import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';
import Generator from './process/Generator';
import Viewer from './models/Viewer';
import Updater from './process/Updater';
import Total from './process/Total';
import Bokeh from './process/Bokeh';

const COUNT = 300;

export default class World {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;

    generator: Generator;
    updater: Updater;
    viewer: Viewer;

    bokeh: Bokeh;
    total: Total;
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
        this.setUpEvent();
    }
    setUp() {
        // process
        this.generator = new Generator(COUNT);
        this.updater = new Updater(COUNT);
        this.viewer = new Viewer(COUNT);

        // post process
        this.bokeh = new Bokeh();
        this.total = new Total();
        this.fxaa = new FXAA();
        this.generator.generate();
    }
    update() {
        this.generator.inv();
        this.updater.render(this.generator.textures, this.generator.invTarget);

        // this.generator.generate();
        this.viewer.update(this.generator.textures);
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.bokeh.render(this.target.texture);
        this.total.render(null, this.bokeh.texture);

        // this.fxaa.render(null, this.target.texture);
    }
    resize() {
        this.generator.resize();
        this.viewer.resize();
    }
    setUpEvent() {
        const canvas = document.querySelector('canvas');
        if (!canvas) return;
        canvas.addEventListener('mousemove', (event) => {
            this.generator.update(event);
        });
        this.resize();

        setInterval(() => {
            if (Math.random() > 0.4) {
                this.generator.generate();
            }
        }, 110);
    }
}
