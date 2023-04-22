import * as THREE from 'three';
import SampleModel from './models/sampleModel';
import { FXAA } from './process/FXAA';
import WebGL from './Webgl';
import Boxes from './models/Boxes';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;

    viewer: ShadowMapViewer;

    light: THREE.DirectionalLight;

    sample: SampleModel;
    boxes: Boxes;

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
        // light
        const ambLight = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(20, 25, 70);
        this.scene.add(dirLight);
        const size = 140;
        dirLight.shadow.camera = new THREE.OrthographicCamera(
            -size / 2,
            size / 2,
            size / 2,
            -size / 2,
            1,
            120
        );
        dirLight.shadow.camera.position.copy(dirLight.position);
        dirLight.shadow.camera.lookAt(this.scene.position);
        this.scene.add(dirLight.shadow.camera);
        // const lightHelper = new THREE.CameraHelper(dirLight.shadow.camera);
        // this.scene.add(lightHelper);

        dirLight.shadow.mapSize.set(2048, 2048);
        dirLight.shadow.map = new THREE.WebGLRenderTarget(2048, 2048, {
            format: THREE.RGBAFormat,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
        });
        this.light = dirLight;
        this.viewer = new ShadowMapViewer(dirLight);
        this.viewer.size.set(300, 300);

        // model
        // this.sample = new SampleModel();
        // this.sample.mesh.scale.multiplyScalar(10);
        // this.sample.mesh.position.z += 15;
        this.boxes = new Boxes();

        // post process
        this.fxaa = new FXAA();
    }
    update() {
        this.boxes.update(this.light);
        this.boxes.setMat('shadow');
        this.renderer.setRenderTarget(this.light.shadow.map);
        this.renderer.render(this.scene, this.light.shadow.camera);

        // this.renderer.setRenderTarget(null);
        // this.viewer.render(this.renderer);

        this.boxes.setMat('base');
        this.boxes.updateShadowMap(this.light.shadow.map.texture);
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.scene, this.camera);

        this.fxaa.render(null, this.target.texture);
    }
    resize() {}
}
