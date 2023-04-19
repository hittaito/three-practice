import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/generator.frag';

export default class Generator {
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;

    private targets: THREE.WebGLMultipleRenderTargets[];
    private active = 0;

    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    get textures() {
        return this.targets[this.active].texture;
    }
    get invTarget() {
        return this.targets[1 - this.active];
    }
    constructor(count: number) {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        const target = new THREE.WebGLMultipleRenderTargets(count, 1, 2, {
            type: THREE.FloatType,
        });
        this.targets = [target, target.clone()];
        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMouse: { value: new THREE.Vector2(0, 0) },
                uResolution: { value: new THREE.Vector2(0, 0) },
                uPrev: { value: new THREE.Vector2(1, 0) },
                uTime: { value: 0 },
                uMap1: { value: null },
                uMap2: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    generate() {
        this.mesh.material.uniforms.uTime.value += Math.random() * 100;
        this.mesh.material.uniforms.uMap1.value =
            this.targets[1 - this.active].texture[0];
        this.mesh.material.uniforms.uMap2.value =
            this.targets[1 - this.active].texture[1];

        this.renderer.setRenderTarget(this.targets[this.active]);
        this.renderer.render(this.mesh, this.camera);

        this.active = 1 - this.active;
    }
    update(event: MouseEvent) {
        this.mesh.material.uniforms.uPrev.value.setX(
            this.mesh.material.uniforms.uMouse.value.x
        );
        this.mesh.material.uniforms.uPrev.value.setY(
            this.mesh.material.uniforms.uMouse.value.y
        );
        this.mesh.material.uniforms.uMouse.value.setX(event.clientX);
        this.mesh.material.uniforms.uMouse.value.setY(
            window.innerHeight - event.clientY
        );
    }
    resize() {
        this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth);
        this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight);
    }
    inv() {
        this.active = 1 - this.active;
    }
}
