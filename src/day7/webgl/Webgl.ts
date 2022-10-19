import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import Debug from './Debug';
import World from './World';

let webgl: WebGL | null;

export default class WebGL {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;

    world: World;

    size: { width: number; height: number };
    debug: Debug;
    constructor(canvas?: HTMLCanvasElement) {
        if (webgl) {
            return webgl;
        }
        if (!canvas) return;
        webgl = this;
        this.init(canvas);
    }
    init(canvas: HTMLCanvasElement) {
        this.debug = new Debug();
        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.size.width / this.size.height,
            0.1,
            30
        );
        this.camera.position.set(0, 0, 3);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
        });
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.renderer.toneMappingExposure = 2;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // post process
        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(this.size.width, this.size.height);
        this.composer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        // const renderPass = new RenderPass(this.scene, this.camera);
        // this.composer.addPass(renderPass);

        // World
        this.world = new World();

        new OrbitControls(this.camera, canvas);

        this.render();
    }
    render() {
        this.debug.begin();
        this.world.update();
        // this.composer.render();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    resize() {
        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(this.size.width, this.size.height);
        this.renderer.setSize(this.size.width, this.size.height);
        this.world.resize(this.size.width, this.size.height);
    }
}
