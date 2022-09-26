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
    readonly viewHeight = 4;
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
        console.log(this.debug);

        this.size = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        // scene
        this.scene = new THREE.Scene();

        // camera
        const fov = 60;

        const distance =
            this.viewHeight / 2 / Math.tan(((fov / 2) * Math.PI) / 180);
        this.camera = new THREE.PerspectiveCamera(
            fov,
            this.size.width / this.size.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, distance);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // post process
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // World
        this.world = new World();

        // new OrbitControls(this.camera, canvas);

        this.render();
    }
    render() {
        this.debug.begin();
        this.world.update();
        this.composer.render();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    mouseMove(x: number, y: number) {
        const ratio = this.size.width / this.size.height;
        const unit = this.viewHeight / 2;
        this.world.mouseMove(ratio * unit * x, unit * y);
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
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    }
}
