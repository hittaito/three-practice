import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/bokeh.frag';

export default class Bokeh {
    renderer: THREE.WebGLRenderer;
    targets: THREE.WebGLRenderTarget[];
    camera: THREE.OrthographicCamera;
    active = 0;

    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    get texture() {
        return this.targets[this.active].texture;
    }
    constructor() {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        const target = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );
        this.targets = [target, target.clone()];

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMap: { value: null },
                uStep: { value: 0 },
                uHorizon: { value: false },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render(texture: THREE.Texture) {
        this.mesh.material.uniforms.uMap.value = texture;

        for (let i = 0; i < 8; i++) {
            this.mesh.material.uniforms.uStep.value = Math.floor(i / 2) + 1;
            this.renderer.setRenderTarget(this.targets[1 - this.active]);
            this.mesh.material.uniforms.uHorizon.value = this.active === 0;
            this.renderer.render(this.mesh, this.camera);

            this.active = 1 - this.active;
            this.mesh.material.uniforms.uMap.value =
                this.targets[this.active].texture;
        }
    }
}
