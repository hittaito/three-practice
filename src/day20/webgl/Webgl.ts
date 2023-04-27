import * as THREE from 'three';
import { gsap, Power4 } from 'gsap';
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
    mouse: {
        state: 'move' | 'remove' | 'complete';
        origin: { x: number; y: number };
        prev: { x: number; y: number };
    } = { state: 'complete', origin: { x: 0, y: 0 }, prev: { x: 0, y: 0 } };
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
            2000
        );
        this.camera.position.set(0, 20, 10);
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

        // World
        this.world = new World();

        // new OrbitControls(this.camera, canvas);

        this.render();
        this.setMouseEvent(canvas);
    }
    render() {
        this.debug.begin();
        this.world.update();
        this.debug.end();
        requestAnimationFrame(() => this.render());
    }
    resize() {}
    setMouseEvent(canvas: HTMLCanvasElement) {
        canvas.addEventListener('mousedown', this.mousedown.bind(this));
        canvas.addEventListener('mousemove', this.mousemove.bind(this));
        canvas.addEventListener('mouseup', this.mouseup.bind(this));
    }
    mousedown(e: MouseEvent) {
        if (this.mouse.state === 'complete')
            this.mouse = {
                state: 'move',
                origin: {
                    x: e.x / window.innerWidth,
                    y: e.y / window.innerHeight,
                },
                prev: {
                    x: e.x / window.innerWidth,
                    y: e.y / window.innerHeight,
                },
            };
    }
    mousemove(e: MouseEvent) {
        if (this.mouse.state !== 'move') return;

        const r = innerHeight / innerWidth;

        this.world.mouseUpdate({
            x: this.mouse.prev.x - this.mouse.origin.x,
            y: (this.mouse.prev.y - this.mouse.origin.y) * r,
            z: 0,
        });
        this.mouse.prev = {
            x: e.x / window.innerWidth,
            y: e.y / window.innerHeight,
        };
    }
    mouseup() {
        this.mouse.state = 'remove';
        const t = { t: 1 };
        gsap.to(t, {
            t: 0,
            duration: 0.1,
            ease: Power4.easeIn,
            onUpdate: (v) => {
                this.world.mouseUpdate({
                    x: this.mouse.prev.x - this.mouse.origin.x,
                    y: this.mouse.prev.y - this.mouse.origin.y,
                    z: 0,
                });
            },
            onComplete: () => {
                this.mouse.state = 'complete';
                this.world.mouseUpdate(null);
            },
        });
    }
}
