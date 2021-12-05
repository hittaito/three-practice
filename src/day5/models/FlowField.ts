import * as THREE from 'three';
import vert from '../glsl/flowField.vert';
import frag from '../glsl/flowField.frag';
import gui from './gui';

export default class FlowField {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    geometry: THREE.PlaneGeometry;
    material: THREE.ShaderMaterial;
    mesh: THREE.Mesh;
    debug: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    baseTexture: THREE.DataTexture;
    texture: THREE.Texture;
    coordiname: {
        data: Float32Array;
        attribute: THREE.BufferAttribute;
    };
    environment: {
        camera: THREE.OrthographicCamera;
        scene: THREE.Scene;
    };
    renderTargets: THREE.WebGLRenderTarget[];
    primary = 0;
    count: number;
    width = 256;
    height = 4096;
    constructor(count: number, renderer: THREE.WebGLRenderer, scene: THREE.Scene) {
        this.scene = scene;
        this.renderer = renderer;

        this.count = count;
        this.height = Math.ceil(this.count / this.width);

        gui.addFolder('FlowField');

        this.setBaseTexture();
        this.setRendererTarget();
        this.setEnvironment();
        this.setMaterial();
        this.setGeometry();
        this.setPlane();
        this.setDebugPlane();
        this.setCoordinate();
        this.render();
    }
    setBaseTexture() {
        const size = this.width * this.height;
        const data = new Float32Array(size * 4);
        const color = new THREE.Color(0xffffff);
        for (let i = 0; i < size; i++) {
            data[i * 4] = Math.random() - 0.5;
            data[i * 4 + 1] = Math.random() - 0.5;
            data[i * 4 + 2] = Math.random() - 0.5;
            data[i * 4 + 3] = Math.random();
        }
        this.baseTexture = new THREE.DataTexture(data, this.width, this.height, THREE.RGBAFormat, THREE.FloatType);
        this.baseTexture.minFilter = THREE.NearestFilter;
        this.baseTexture.magFilter = THREE.NearestFilter;
        this.baseTexture.generateMipmaps = false;
        console.log(this.baseTexture);
    }
    setRendererTarget() {
        this.renderTargets = [
            new THREE.WebGLRenderTarget(innerWidth, innerHeight, {
                magFilter: THREE.NearestFilter,
                minFilter: THREE.NearestFilter,
                generateMipmaps: false,
                format: THREE.RGBAFormat,
                type: THREE.FloatType,
                depthBuffer: false,
                stencilBuffer: false,
            }),
        ];
        this.renderTargets.push(this.renderTargets[0].clone());
    }
    setEnvironment() {
        this.environment = {
            scene: new THREE.Scene(),
            camera: new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10),
        };
        this.environment.camera.position.z = 1;
    }
    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    }
    setMaterial() {
        const color = new THREE.Color();

        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            transparent: false,
            fragmentShader: frag,
            uniforms: {
                uBaseTexture: { value: this.baseTexture },
                uTexture: { value: this.baseTexture },
                uTime: { value: 0 },
                uPerlinFrequency: { value: 0.63 },
                uPerlinMultiplier: { value: 0.039 },
                uTimeFrequency: { value: 0.001 },
                uDelta: { value: 16 },
                uDecaySpeed: { value: 0.00141 },
                uColor: { value: color },
            },
        });

        gui.add(this.material.uniforms.uPerlinFrequency, 'value', 0, 5, 0.001).name('frequency');
        gui.add(this.material.uniforms.uPerlinMultiplier, 'value', 0, 0.1, 0.001).name('multipier');
        gui.add(this.material.uniforms.uTimeFrequency, 'value', 0, 0.01, 0.0001).name('time-frequency');
        gui.add(this.material.uniforms.uDecaySpeed, 'value', 0, 0.001, 0.00001).name('delta');
    }
    setPlane() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.environment.scene.add(this.mesh);
    }
    setDebugPlane() {
        const g = new THREE.PlaneGeometry(1, this.height / this.width, 1, 1);
        const m = new THREE.MeshBasicMaterial({ transparent: true });
        this.debug = new THREE.Mesh(g, m);
        this.scene.add(this.debug);
    }
    setCoordinate() {
        const coordinate = new Float32Array(this.count * 2);
        const halfX = 1 / this.width / 2;
        const halfY = 1 / this.height / 2;
        for (let i = 0; i < this.count; i++) {
            const x = (i % this.width) / this.width + halfX;
            const y = Math.floor(i / this.width) / this.height;
            coordinate[i * 2] = x;
            coordinate[i * 2 + 1] = y;
            // console.log(x);
        }
        this.coordiname = {
            data: coordinate,
            attribute: new THREE.BufferAttribute(coordinate, 2),
        };
    }
    render() {
        this.renderer.setRenderTarget(this.renderTargets[this.primary]);
        this.renderer.render(this.environment.scene, this.environment.camera);
        this.renderer.setRenderTarget(null);

        this.primary = 1 - this.primary;
        this.debug.material.map = this.renderTargets[1 - this.primary].texture;
        this.texture = this.renderTargets[1 - this.primary].texture;
    }
    update() {
        this.material.uniforms.uTime.value += 3;
        this.material.uniforms.uTexture.value = this.renderTargets[1 - this.primary].texture;
        this.render();
    }
}
