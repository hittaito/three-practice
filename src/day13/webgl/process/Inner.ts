import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/inner.vert';
import frag from '../../glsl/inner.frag';
export default class Inner {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;

    target: THREE.WebGLRenderTarget;

    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        const size = webgl.size;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                uTime: { value: 0 },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh = new THREE.Mesh(g, m);

        this.target = new THREE.WebGLRenderTarget(size.width, size.height);
    }
    render(time: number) {
        this.mesh.material.uniforms.uTime.value = time;
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.mesh, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
