import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Debug from './Debug';
import World from './World';
import CannonDebugRenderer from './Debugger';

let webgl: WebGL | null;

export default class WebGL {
    scene1: THREE.Scene;
    scene2: THREE.Scene;
    scene3: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    oCamera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    world: World;

    physics: CANNON.World;
    doPhysics = false;

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
            width: window.innerWidth * Math.min(2, devicePixelRatio),
            height: window.innerHeight * Math.min(2, devicePixelRatio),
        };

        // scene
        this.scene1 = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        this.scene3 = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.size.width / this.size.height,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        this.oCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        this.oCamera.position.set(0, 0, 3);
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
        this.physics.gravity.set(0, -0, 0);
        // this.dd = new CannonDebugRenderer(this.scene, this.physics);
        // console.log(dd);

        // World
        this.world = new World();

        const ctrl = new OrbitControls(this.camera, canvas);
        ctrl.enableZoom = false;
        const angle1 = (Math.PI / 3) * 2;
        const angle2 = Math.PI / 3;

        ctrl.maxPolarAngle = angle1;
        ctrl.minPolarAngle = angle2;
        ctrl.maxAzimuthAngle = (Math.PI / 180) * 15;
        ctrl.minAzimuthAngle = (Math.PI / 180) * -15;

        this.render();
    }
    render() {
        this.debug.begin();
        if (this.doPhysics) {
            this.physics.step(1 / 60);
        }

        this.world.update();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    onClick(x: number, y: number) {
        this.doPhysics = !this.doPhysics;
        this.world.onClick(this.doPhysics, x, y);
    }
    resize() {}
}
