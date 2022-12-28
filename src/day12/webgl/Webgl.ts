import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Debug from './Debug';
import World from './World';
import CannonDebugRenderer from './Debugger';

let webgl: WebGL | null;

export default class WebGL {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    world: World;

    physics: CANNON.World;

    dd: CannonDebugRenderer;

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
            100
        );
        this.camera.position.set(0, 6, 8);
        this.camera.lookAt(0, 0, 0);

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
        this.renderer.shadowMap.enabled = true;

        // cannon world
        this.physics = new CANNON.World();
        this.physics.gravity.set(0, -9.82, 0);
        this.dd = new CannonDebugRenderer(this.scene, this.physics);
        // console.log(dd);

        // World
        this.world = new World();

        const ctrl = new OrbitControls(this.camera, canvas);
        // ctrl.enableZoom = false;

        this.render();
    }
    render() {
        this.debug.begin();
        this.physics.step(1 / 60);
        this.dd.update();
        this.world.update();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    resize() {}
}
