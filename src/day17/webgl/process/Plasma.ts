import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/plasma.frag';

export default class Plasma {
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.OrthographicCamera;
    private target: THREE.WebGLRenderTarget;
    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    get texture() {
        return this.target.texture;
    }
    constructor() {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        this.target = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height
        );
        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render() {
        this.mesh.material.uniforms.uTime.value += 1;
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.mesh, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
