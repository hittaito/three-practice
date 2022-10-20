import * as THREE from 'three';
import Cone from './models/Cone';
import SampleModel from './models/sampleModel';
import WebGL from './Webgl';
import Box from './models/Box';
import Debug from './Debug';
import { Gray } from './postprocess/Gray';
import { View } from './postprocess/View';
import { Edge } from './postprocess/Edge';
import { Merge } from './postprocess/Merge';
import { FXAA } from './postprocess/FXAA';
import { Gauss } from './postprocess/Gauss';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mrt: THREE.WebGLMultipleRenderTargets;

    target1: THREE.WebGLRenderTarget;
    target2: THREE.WebGLRenderTarget;
    target3: THREE.WebGLRenderTarget;

    // postprocess
    view: View;
    gray: Gray;
    edge1: Edge;
    edge2: Edge;
    merge: Merge;
    fxaa: FXAA;
    gauss: Gauss;

    sample: SampleModel;
    cone: Cone;
    box: Box;
    debug: Debug;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.mrt = new THREE.WebGLMultipleRenderTargets(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio),
            2
        );
        this.target1 = new THREE.WebGLRenderTarget(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio)
        );
        this.target2 = new THREE.WebGLRenderTarget(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio)
        );
        this.target3 = new THREE.WebGLRenderTarget(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio)
        );

        this.debug = webgl.debug;

        this.setUp();
    }
    setUp() {
        this.cone = new Cone();
        this.box = new Box();

        this.view = new View();
        this.gray = new Gray();
        this.edge1 = new Edge(new THREE.Vector3(0, 0, 1));
        this.edge2 = new Edge(new THREE.Vector3(1, 0, 0));
        this.merge = new Merge();
        this.fxaa = new FXAA();
        this.gauss = new Gauss();
    }
    update() {
        this.renderer.clear();
        this.renderer.setRenderTarget(this.mrt);
        this.box.update();
        this.cone.update();
        this.box.on();
        this.cone.off();
        this.renderer.render(this.scene, this.camera); // render scene

        this.gray.render(this.target1, this.mrt.texture[0]);
        this.edge1.render(this.target2, this.target1.texture);
        this.merge.render(
            this.target1,
            this.mrt.texture[1],
            this.target2.texture
        );
        this.fxaa.render(this.target3, this.target1.texture);

        // second draw
        this.renderer.clear();
        this.renderer.setRenderTarget(this.mrt);
        this.box.off();
        this.cone.on();
        this.renderer.render(this.scene, this.camera); // render scene

        this.gray.render(this.target1, this.mrt.texture[0]);
        this.edge2.render(this.target2, this.target1.texture);
        this.merge.render(
            this.target1,
            this.mrt.texture[1],
            this.target2.texture
        );
        this.fxaa.render(this.target2, this.target1.texture);

        this.merge.render(
            this.target1,
            this.target2.texture,
            this.target3.texture
        );
        this.view.render(this.target1.texture);
        this.gauss.render(this.target2, this.target1.texture);

        this.merge.render(
            this.target3,
            this.target1.texture,
            this.target2.texture
        );

        this.view.render(this.target3.texture);
    }
    resize(width: number, height: number) {
        console.log(width, height);
    }
}
