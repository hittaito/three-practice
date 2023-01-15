import * as THREE from 'three';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/simplex.frag';
import WebGL from '../Webgl';
export default class Simplex {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                uTime: { value: 0 },
                uType: { value: 0 },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render(type: number) {
        this.mesh.material.uniforms.uTime.value += 1;
        this.mesh.material.uniforms.uType.value = type;
        this.renderer.render(this.mesh, this.camera);
    }
}
