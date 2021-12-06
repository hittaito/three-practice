import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import fSub from './glsl/sub.frag';
import vSub from './glsl/sub.vert';
import fMain from './glsl/main.frag';
import vMain from './glsl/main.vert';

const MAX = 50;

class Main {
    scene: THREE.Scene;
    scene1: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mouseTarget = {
        x: 0,
        y: 0,
        x0: 0,
        y0: 0,
        current: 0,
    };
    mainMesh: THREE.RawShaderMaterial;
    baseTarget: THREE.WebGLRenderTarget;
    meshes: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.MeshBasicMaterial>[] = [];
    init() {
        this.scene = new THREE.Scene();
        this.scene1 = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 300);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(innerWidth, innerHeight);

        new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        const img = new THREE.TextureLoader().load('/assets/brush.png');

        const g = new THREE.PlaneBufferGeometry(10, 10);
        const meshes: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.MeshBasicMaterial>[] = [];

        for (let i = 0; i < MAX; i++) {
            const m = new THREE.MeshBasicMaterial({
                map: img,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthTest: false,
                depthWrite: false,
            });
            const mesh = new THREE.Mesh(g, m);

            mesh.rotation.z = Math.PI * 2 * Math.random();
            this.scene.add(mesh);
            meshes.push(mesh);
        }
        this.meshes = meshes;
        this.mouseEvents();

        this.baseTarget = new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
        });

        const g1 = new THREE.PlaneBufferGeometry(innerWidth, innerHeight);
        const m1 = new THREE.RawShaderMaterial({
            fragmentShader: fSub,
            vertexShader: vSub,
            glslVersion: THREE.GLSL3,
            uniforms: {
                img: { value: new THREE.TextureLoader().load('/assets/img1.jpg') },
                img2: { value: null },
            },
        });
        this.scene1.add(new THREE.Mesh(g1, m1));
        this.mainMesh = m1;
        this.renderer.setRenderTarget(this.baseTarget);
        this.renderer.render(this.scene1, this.camera);

        this.render();
    }
    render() {
        this.trackMouse();
        this.renderer.setRenderTarget(this.baseTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);

        this.meshes.forEach((m) => {
            // m.position.x = this.mouseTarget.x;
            // m.position.y = this.mouseTarget.y;
            m.rotation.z += 0.01;
            m.material.opacity *= 0.98;
            m.scale.x = 1.0 * m.scale.x + 0.1;
            m.scale.y = m.scale.x;
        });
        this.mainMesh.uniforms.img2.value = this.baseTarget;
        this.renderer.render(this.scene1, this.camera);
        requestAnimationFrame(() => this.render());
    }
    mouseEvents() {
        window.addEventListener('mousemove', (event) => {
            this.mouseTarget = {
                ...this.mouseTarget,
                x: event.clientX - innerWidth / 2,
                y: innerHeight / 2 - event.clientY,
            };
        });
    }
    trackMouse() {
        if (Math.abs(this.mouseTarget.x - this.mouseTarget.x0) < 4 && Math.abs(this.mouseTarget.y - this.mouseTarget.y0) < 4) {
        } else {
            this.setNewWave(this.mouseTarget.x, this.mouseTarget.y, this.mouseTarget.current);
            this.mouseTarget.current = (this.mouseTarget.current + 1) % MAX;
            console.log(this.mouseTarget.current);
        }
        this.mouseTarget.x0 = this.mouseTarget.x;
        this.mouseTarget.y0 = this.mouseTarget.y;
    }
    setNewWave(x: number, y: number, index: number) {
        const mesh = this.meshes[index];
        mesh.material.opacity = 1;
        mesh.visible = true;
        mesh.position.x = x;
        mesh.position.y = y;
        mesh.scale.x = 1;
        mesh.scale.y = 1;
    }
}

const m = new Main();
m.init();
