import * as THREE from 'three';
import Celler from './process/Celler';
import { FXAA } from './process/FXAA';
import Perlin from './process/Perlin';
import Simplex from './process/Simplex';
import Value from './process/Value';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    simplex: Simplex;
    value: Value;
    cell: Celler;
    perlin: Perlin; // classic perlin

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
        this.simplex = new Simplex();
        this.value = new Value();
        this.cell = new Celler();
        this.perlin = new Perlin();
        // post process
        this.fxaa = new FXAA();
    }
    update() {
        const W = window.innerWidth / 4;
        const H = window.innerHeight / 4;
        // simplex
        this.renderer.setScissor(W * 0, H * 3, W, H);
        this.simplex.render(0);
        this.renderer.setScissor(W * 1, H * 3, W, H);
        this.simplex.render(1);
        this.renderer.setScissor(W * 2, H * 3, W, H);
        this.simplex.render(2);
        this.renderer.setScissor(W * 3, H * 3, W, H);
        this.simplex.render(3);

        this.renderer.setScissor(W * 0, H * 2, W, H);
        this.value.render(0);
        this.renderer.setScissor(W * 1, H * 2, W, H);
        this.value.render(1);
        this.renderer.setScissor(W * 2, H * 2, W, H);
        this.value.render(2);

        this.renderer.setScissor(W * 0, H * 1, W, H);
        this.perlin.render(0);
        this.renderer.setScissor(W * 1, H * 1, W, H);
        this.perlin.render(1);
        this.renderer.setScissor(W * 2, H * 1, W, H);
        this.perlin.render(2);

        this.renderer.setScissor(W * 0, H * 0, W, H);
        this.cell.render(0);
        this.renderer.setScissor(W * 1, H * 0, W, H);
        this.cell.render(1);
        this.renderer.setScissor(W * 2, H * 0, W, H);
        this.cell.render(2);
        this.renderer.setScissor(W * 3, H * 0, W, H);
        this.cell.render(3);
    }
    resize() {}
}
