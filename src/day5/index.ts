import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import frag from './glsl/noise.frag';
import vert from './glsl/noise.vert';
import * as dat from 'lil-gui';
import WebFont from 'webfontloader';
const gui = new dat.GUI();

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    noise: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    glass: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;

    orthCamera: THREE.OrthographicCamera;
    scene2: THREE.Scene;
    offscreen: THREE.WebGLRenderTarget;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 3);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearAlpha(0);

        this.scene2 = new THREE.Scene();
        this.orthCamera = new THREE.OrthographicCamera(-1, 1, 1, -1);
        this.orthCamera.position.set(0, 0, 1);
        this.offscreen = new THREE.WebGLRenderTarget(256, 256);

        new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        // load texture
        const loader = new THREE.TextureLoader();
        const t = loader.load('/assets/night_window.png');

        // object

        // custom noise
        const geom = new THREE.PlaneBufferGeometry(2, 2);
        const mat = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                time: { value: 0 },
            },
        });
        this.noise = new THREE.Mesh(geom, mat);
        this.scene2.add(this.noise);

        // back image

        const texture = new TextTexture();
        texture.loadfont().then(() => {
            const planebuff = new THREE.PlaneBufferGeometry(1, 1); //4, 2.3
            texture.update('壱');
            const basic = new THREE.MeshBasicMaterial({
                map: texture.texture,
            });
            const plane = new THREE.Mesh(planebuff, basic);
            plane.position.z -= 0;
            this.scene.add(plane);
        });

        // glass
        const g = new THREE.PlaneBufferGeometry(1, 1, 64, 64);
        const mm = new THREE.MeshBasicMaterial({});
        const m = new THREE.MeshPhysicalMaterial({
            roughness: 0.0,
            reflectivity: 0.6,
            transmission: 1,
            displacementScale: 2,
        });

        gui.add(m, 'roughness', 0, 1, 0.001);
        gui.add(m, 'reflectivity', 0, 1, 0.001);
        gui.add(m, 'thickness', 0, 5, 0.001);
        gui.add(m, 'displacementScale', 0, 5, 0.001);

        m.thickness = 2;
        const o = new THREE.Mesh(g, m);
        o.position.z += 2.5;
        this.scene.add(o);
        this.glass = o as any;

        this.render();
    }
    render() {
        this.renderer.setRenderTarget(this.offscreen);
        this.noise.material.uniforms.time.value += 1;
        this.renderer.render(this.scene2, this.orthCamera);

        this.glass.material.displacementMap = this.offscreen.texture;
        // this.glass.material.map = this.offscreen.texture;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}
const SIZE = 512 * 2;
class TextTexture {
    context: CanvasRenderingContext2D;
    texture: THREE.CanvasTexture;

    _text: string = '';
    get text() {
        return this._text;
    }
    set text(t: string) {
        this._text = t;
        if (this.context) {
            this.update(t);
        }
    }
    constructor() {
        this.init();
    }
    init() {
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context.fillStyle = '#329827';
        this.context.fillRect(0, 0, SIZE, SIZE);
        this.texture = new THREE.CanvasTexture(canvas);
    }
    update(text: string) {
        const fontSize = SIZE / Math.ceil(Math.sqrt(text.length));

        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, SIZE, SIZE);
        this.context.font = `bold ${fontSize * 0.8}px \'Noto Sans JP\'`;
        this.context.textAlign = 'center';
        this.context.fillStyle = '#ffffff';
        text.split('').forEach((c, i) => {
            const x = (i % (SIZE / fontSize)) * fontSize + fontSize / 2;
            const y = Math.floor(i / (SIZE / fontSize)) * fontSize + fontSize * 0.9;
            this.context.fillText(c, x, y, fontSize);
        });
        this.texture.needsUpdate = true;
    }
    loadfont() {
        return new Promise((resolve) => {
            WebFont.load({
                google: {
                    families: ['Noto+Sans+JP:700'],
                },
                active: () => resolve(null),
            });
        });
    }
}

const m = new Main();
m.init();
