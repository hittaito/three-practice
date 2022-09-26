import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import Box from './models/Box';
import SampleModel from './models/sampleModel';
import Sphere from './models/Sphere';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    cubeCamera: THREE.CubeCamera;

    composer: EffectComposer;

    sample: SampleModel;
    box: Box;
    sphere: Sphere;
    aa: THREE.Mesh;
    angle = 0;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.composer = webgl.composer;

        this.setUp();
    }
    setUp() {
        // this.sample = new SampleModel();
        this.box = new Box();
        this.sphere = new Sphere();

        const g = new THREE.ConeGeometry(1, 2);
        const m = new THREE.MeshBasicMaterial({ color: 'skyblue' });
        this.aa = new THREE.Mesh(g, m);
        this.aa.position.z += 3;
        this.scene.add(this.aa);

        // offscreen render
        const cubeTarget = new THREE.WebGLCubeRenderTarget(512 * 2, {
            format: THREE.RGBAFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipMapLinearFilter,
            encoding: THREE.sRGBEncoding,
        });
        this.cubeCamera = new THREE.CubeCamera(0.1, 10, cubeTarget);

        // post process
        const smaaPass = new SMAAPass(
            window.innerWidth * this.renderer.getPixelRatio(),
            window.innerHeight * this.renderer.getPixelRatio()
        );
        this.composer.addPass(smaaPass);

        this.sphere.setImage(cubeTarget.texture);
    }
    update() {
        this.angle += 0.01;
        this.aa.position.z = Math.cos(this.angle) * 4;
        this.aa.position.x = Math.sin(this.angle) * 4;
        this.sphere.update();
        this.sphere.mesh.visible = false;
        this.cubeCamera.position.x = this.sphere.mesh.position.x;
        this.cubeCamera.position.y = this.sphere.mesh.position.y;
        this.cubeCamera.update(this.renderer, this.scene);
        this.sphere.mesh.visible = true;
        // this.sample.update();
    }
    mouseMove(x: number, y: number) {
        this.sphere.moveSphere(x, y);
    }
    resize() {}
}
