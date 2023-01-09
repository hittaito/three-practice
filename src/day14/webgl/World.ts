import * as THREE from 'three';
import Background from './models/Background';
import Panels from './models/Panels';
import Sphere from './models/Sphere';
import VoronoiBox from './models/VoronoiBox';
import { FXAA } from './process/FXAA';
import HeightMap from './process/HeightMap';
import WebGL from './Webgl';

export default class World {
    scene1: THREE.Scene;
    scene2: THREE.Scene;
    scene3: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    target1: THREE.WebGLRenderTarget;
    target2: THREE.WebGLRenderTarget;
    target3: THREE.WebGLRenderTarget;

    heightMap: HeightMap;
    panels: Panels;
    voronoi: VoronoiBox;
    background: Background;
    sphere: Sphere;

    fxaa: FXAA;
    constructor() {
        const webgl = new WebGL();
        this.scene1 = webgl.scene1;
        this.scene2 = webgl.scene2;
        this.scene3 = webgl.scene3;
        this.camera = webgl.camera;
        this.oCamera = webgl.oCamera;
        this.renderer = webgl.renderer;
        this.target1 = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );
        this.target2 = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );
        this.target3 = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );

        this.setUp();
    }
    setUp() {
        // scene1
        this.panels = new Panels();

        // scene2
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const envMap = cubeTextureLoader.load([
            '../envmap/px.jpg',
            '../envmap/nx.jpg',
            '../envmap/py.jpg',
            '../envmap/ny.jpg',
            '../envmap/pz.jpg',
            '../envmap/nz.jpg',
        ]);
        envMap.encoding = THREE.sRGBEncoding;
        this.scene2.background = envMap;
        this.scene2.environment = envMap;
        this.sphere = new Sphere();
        this.sphere.setBackground(envMap);
        this.heightMap = new HeightMap();

        // scene3
        this.voronoi = new VoronoiBox();
        this.background = new Background();

        // post process
        this.fxaa = new FXAA();
    }
    update() {
        // scene2
        this.heightMap.render();
        this.sphere.setHeightMap(this.heightMap.texture);
        this.renderer.setRenderTarget(this.target2);
        this.renderer.render(this.scene2, this.camera);

        // scene1
        this.renderer.setRenderTarget(this.target1);
        this.panels.setTexture(this.target2.texture);
        this.renderer.render(this.scene1, this.camera);

        // scene3
        this.voronoi.update();
        this.renderer.setRenderTarget(this.target3);
        this.voronoi.setTexture(this.target1.texture);
        this.background.setTexture(this.target2.texture);
        this.renderer.render(this.scene3, this.oCamera);

        this.fxaa.render(null, this.target3.texture);
    }
    onClick(b: boolean, x: number, y: number) {
        if (!b) {
            this.voronoi.reset();
        } else {
            console.log(x, y);
            this.voronoi.start(x, y);
        }
    }
    resize() {}
}
