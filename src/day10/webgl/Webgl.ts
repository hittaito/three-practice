import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Debug from './Debug';
import World from './World';

let webgl: WebGL | null;

export default class WebGL {
    scene: {
        topView: THREE.Scene;
        final: THREE.Scene;
    };
    camera: THREE.PerspectiveCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    world: World;

    size: { width: number; height: number };
    currentMouse = { x: 0.5, y: 0.5 };
    mouse = { x: 0.5, y: 0.5 };
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
        this.scene = {
            topView: new THREE.Scene(),
            final: new THREE.Scene(),
        };

        // camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.size.width / this.size.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 4);
        this.camera.lookAt(0, 0, 0);

        this.oCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.oCamera.position.set(0, 0, 10);
        this.oCamera.lookAt(0, 0, 0);

        // renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
        });
        this.renderer.shadowMap.enabled = true;
        this.renderer.setSize(this.size.width, this.size.height);
        this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // World
        this.world = new World();

        new OrbitControls(this.camera, canvas);
        // this.world.setC(canvas);

        this.render();
    }
    render() {
        this.debug.begin();
        this.updateMouse();
        this.world.update();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    resize() {}
    updateMouse() {
        const diff = {
            x: this.currentMouse.x - this.mouse.x,
            y: this.currentMouse.y - this.mouse.y,
        };
        this.mouse = {
            x: this.mouse.x + diff.x * 0.1,
            y: this.mouse.y + diff.y * 0.1,
        };
        this.world.updateMouse(this.mouse.x, this.mouse.y);
    }
}
