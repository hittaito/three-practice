import * as THREE from 'three';
import Caustics from './process/Caustics';
import { Floor } from './models/Floor';
import SampleModel from './models/sampleModel';
import Water from './models/Water';
import { DepthViewer } from './process/DepthViewer';
import { FXAA } from './process/FXAA';
import { Viewer } from './process/Viewer';
import WebGL from './Webgl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { HeightMap } from './process/HeightMap';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    topCamera: THREE.OrthographicCamera;

    sunLight: THREE.DirectionalLight;
    topLight: THREE.DirectionalLight;

    heightMap: HeightMap;
    sample: SampleModel;
    floor: Floor;
    water: Water;
    caustics: Caustics;

    fxaa: FXAA;
    viewer: Viewer;
    depthViewer: DepthViewer;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene.final;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.target = new THREE.WebGLRenderTarget(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio)
        );
        // this.target.texture.minFilter = THREE.NearestFilter;
        // this.target.texture.magFilter = THREE.NearestFilter;
        // this.target.stencilBuffer = false;
        const WIDTH = 1024; // webgl.size.width * Math.min(2, window.devicePixelRatio)
        const HEIGHT = 1024; // webgl.size.height * Math.min(2, window.devicePixelRatio)
        this.target.depthTexture = new THREE.DepthTexture(WIDTH, HEIGHT);
        this.target.depthTexture.format = THREE.DepthFormat;
        this.target.depthTexture.type = THREE.UnsignedByteType;

        this.setUp();
    }
    setC(canvas: HTMLCanvasElement) {
        new OrbitControls(this.topCamera, canvas);
    }
    setUp() {
        // env map
        const cubeTextureLoader = new THREE.CubeTextureLoader();
        const envMap = cubeTextureLoader.load([
            '/envmap/px.jpg',
            '/envmap/nx.jpg',
            '/envmap/py.jpg',
            '/envmap/ny.jpg',
            '/envmap/pz.jpg',
            '/envmap/nz.jpg',
        ]);
        envMap.encoding = THREE.sRGBEncoding;
        this.scene.background = envMap;
        this.scene.environment = envMap;

        // axis helper
        this.scene.add(new THREE.AxesHelper(6));

        // top camera
        this.topCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.topCamera.position.set(0, 3, 0); // 順番重要
        this.topCamera.lookAt(0, 0, 0);

        // light
        const ambLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambLight);
        this.sunLight = new THREE.DirectionalLight(0xff3333, 0.4);
        this.sunLight.position.set(2, 2, 0);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera = new THREE.OrthographicCamera(
            -2,
            2,
            2,
            -2,
            0.1,
            10
        );

        this.scene.add(this.sunLight);
        const dirLightHelper = new THREE.DirectionalLightHelper(this.sunLight);
        this.scene.add(dirLightHelper);

        this.sample = new SampleModel();
        this.floor = new Floor();
        this.water = new Water();
        this.water.setCube(envMap);
        this.caustics = new Caustics(
            this.sunLight.shadow.camera.near,
            this.sunLight.shadow.camera.far
        );

        // process
        this.heightMap = new HeightMap();
        this.fxaa = new FXAA();
        this.viewer = new Viewer();
        this.depthViewer = new DepthViewer(
            this.sunLight.shadow.camera.near,
            this.sunLight.shadow.camera.far
        );
    }
    update() {
        // model update

        // water height
        this.heightMap.render();

        // render depth texture from top
        this.renderer.setRenderTarget(this.target);
        // this.water.update(this.heightMap.target.texture);
        this.sample.update();
        this.renderer.render(this.scene, this.topCamera);

        // caustics texture
        this.caustics.update(
            this.target.depthTexture,
            this.heightMap.target.texture
        );
        this.renderer.render(this.caustics.mesh, this.topCamera);

        this.renderer.setRenderTarget(null);
        // this.renderer.render(this.scene, this.camera);
        this.fxaa.render(null, this.caustics.target.texture);
        // this.viewer.render(this.target.texture);
        // this.depthViewer.render(this.target);

        // this.fxaa.render(null, this.target.depthTexture);
    }
    resize() {}
    updateMouse(x: number, y: number) {
        this.heightMap.updateMouse(x, y);
    }
}
