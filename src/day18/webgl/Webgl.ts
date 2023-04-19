import * as THREE from 'three';
import Debug from './Debug';
import World from './World';

let webgl: WebGL | null;

export default class WebGL {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    world: World;

    size: { width: number; height: number };
    debug: Debug;
    constructor(container?: HTMLDivElement) {
        if (webgl) {
            return webgl;
        }
        if (!container) return;
        webgl = this;
        this.init(container);
    }
    init(container: HTMLDivElement) {
        this.debug = new Debug();
        this.size = {
            width: window.innerWidth * Math.min(2, window.devicePixelRatio),
            height: window.innerHeight * Math.min(2, window.devicePixelRatio),
        };

        // scene
        this.scene = new THREE.Scene();

        // camera
        const r = this.size.width / this.size.height;
        this.camera = new THREE.OrthographicCamera(-r, r, 1, -1, 1, 10);
        this.camera.position.set(0, 0, 3);

        this.oCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.oCamera.position.set(0, 0, 10);
        this.oCamera.lookAt(0, 0, 0);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        console.log(this.renderer);
        container.appendChild(this.renderer.domElement);
        // World
        this.world = new World();

        this.render();
    }
    render() {
        this.debug.begin();
        this.world.update();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    resize() {
        this.size = {
            width: window.innerWidth * Math.min(2, window.devicePixelRatio),
            height: window.innerHeight * Math.min(2, window.devicePixelRatio),
        };
        this.renderer.setSize(this.size.width, this.size.height);
        this.world.resize();
    }
}
