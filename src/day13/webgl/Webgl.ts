import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Debug from './Debug';
import World from './World';

let webgl: WebGL | null;

export default class WebGL {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    world: World;

    size: { width: number; height: number };
    resizeFn: Array<(width: number, height: number) => void> = [];
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
            width: window.innerWidth * Math.min(2, window.devicePixelRatio),
            height: window.innerHeight * Math.min(2, window.devicePixelRatio),
        };

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.size.width / this.size.height,
            0.1,
            80
        );
        this.camera.position.set(0, 0, 3);

        this.oCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.oCamera.position.set(0, 0, 10);
        this.oCamera.lookAt(0, 0, 0);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // World
        this.world = new World();

        new OrbitControls(this.camera, canvas);

        this.render(0);
    }
    render(time: number) {
        this.debug.begin();
        this.world.update(time);
        this.debug.end();
        requestAnimationFrame(() => this.render(time + 1));
    }
    resize() {
        this.size = {
            width: window.innerWidth * Math.min(2, window.devicePixelRatio),
            height: window.innerHeight * Math.min(2, window.devicePixelRatio),
        };
        this.camera.aspect = this.size.width / this.size.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.resizeFn.forEach((fn) => fn(this.size.width, this.size.height));
    }
}
