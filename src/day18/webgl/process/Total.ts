import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/total.frag';

export default class Total {
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;

    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    constructor() {
        const webgl = new WebGL();
        this.renderer = webgl.renderer;
        this.camera = webgl.oCamera;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMap: { value: null },
            },
            transparent: true,
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render(target: THREE.WebGLRenderTarget | null, texture: THREE.Texture) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.uMap.value = texture;
        this.renderer.render(this.mesh, this.camera);
    }
}
