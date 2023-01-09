import * as THREE from 'three';
import WebGL from '../Webgl';
import frag from '../../glsl/heightMap.frag';
import vert from '../../glsl/plane.vert';

export default class HeightMap {
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    target: THREE.WebGLRenderTarget;

    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.renderer = webgl.renderer;
        this.camera = webgl.oCamera;

        this.target = new THREE.WebGLRenderTarget(
            webgl.size.width,
            webgl.size.height,
            { type: THREE.FloatType }
        );

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            fragmentShader: frag,
            vertexShader: vert,
            uniforms: {
                uTime: { value: 0 },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    get texture() {
        return this.target.texture;
    }
    render() {
        this.mesh.material.uniforms.uTime.value += 1;
        this.renderer.setRenderTarget(this.target);
        this.renderer.render(this.mesh, this.camera);
    }
}
