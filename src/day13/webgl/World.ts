import * as THREE from 'three';
import Tube from './models/Tube';
import { Edge } from './process/Edge';
import { FXAA } from './process/FXAA';
import { Gauss } from './process/Gauss';
import Inner from './process/Inner';
import Mix from './process/Mix';
import { Viewer } from './process/Viewer';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    targets: THREE.WebGLMultipleRenderTargets;
    target: THREE.WebGLRenderTarget[] = [];

    tube: Tube;

    inner: Inner;
    fxaa: FXAA;
    gauss: Gauss;
    edge: Edge;
    mix: Mix;
    viewer: Viewer; // depth debug
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.targets = new THREE.WebGLMultipleRenderTargets(
            webgl.size.width,
            webgl.size.height,
            2
        );
        this.target.push(
            new THREE.WebGLRenderTarget(webgl.size.width, webgl.size.height)
        );
        this.target.push(
            new THREE.WebGLRenderTarget(webgl.size.width, webgl.size.height)
        );

        this.setUp();
        webgl.resizeFn.push(this.resize.bind(this));
    }
    setUp() {
        // light
        const amb = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(amb);

        const dir = new THREE.DirectionalLight(0x2244ee, 1);
        this.scene.add(dir);

        // model
        this.tube = new Tube();

        // process
        this.inner = new Inner();
        this.fxaa = new FXAA();
        this.gauss = new Gauss();
        this.edge = new Edge();
        this.mix = new Mix();
        this.viewer = new Viewer();
    }
    update(time: number) {
        // inner texture
        this.inner.render(time);

        // scene rendering
        this.tube.setInner(this.inner.target.texture);
        this.tube.updateCamera(time);
        this.renderer.setRenderTarget(this.targets);
        this.renderer.render(this.scene, this.camera);

        // post process
        this.edge.render(this.target[0], this.targets.texture[0]);
        this.gauss.render(this.target[1], this.target[0].texture);
        this.gauss.render(this.target[0], this.targets.texture[0]);
        this.mix.render({
            color: this.targets.texture[0],
            depth: this.targets.texture[1],
            bokeh: this.target[0].texture,
            edge: this.target[1].texture,
        });

        // this.fxaa.render(null, this.inner.target.texture);
        // this.viewer.render(this.target.texture[1]);
    }
    resize(width: number, height: number) {
        this.targets.setSize(width, height);
        this.target.forEach((t) => {
            t.setSize(width, height);
        });
    }
}
