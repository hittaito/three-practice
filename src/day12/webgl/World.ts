import * as THREE from 'three';
import Floor from './models/Floor';
import SampleModel from './models/sampleModel';
import VoronoiBox from './models/VoronoiBox';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    sample: SampleModel;
    boxes: SampleModel[] = [];
    floor: Floor;
    voronoi: VoronoiBox;

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
        // light
        const amb = new THREE.AmbientLight(0x222222);
        this.scene.add(amb);
        const dir = new THREE.DirectionalLight(0xffffff, 0.5);
        dir.castShadow = true;
        const SIZE = 1024;
        dir.shadow.mapSize.width = SIZE;
        dir.shadow.mapSize.height = SIZE;
        dir.position.set(1, 3, 1);
        this.scene.add(dir);
        const dirHelper = new THREE.DirectionalLightHelper(dir);
        this.scene.add(dirHelper);

        // models
        this.voronoi = new VoronoiBox();
        this.floor = new Floor();
        // for (let x = 0; x < 5; x++) {
        //     for (let y = 0; y < 5; y++) {
        //         const b = new SampleModel();
        //         b.setPosition(x * 1.1 - 2, y * 1.1 - 2);
        //         this.boxes.push(b);
        //     }
        // }
        // post process
        this.fxaa = new FXAA();
    }
    update() {
        // this.boxes.forEach((b) => b.update());
        this.voronoi.update();
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
}
