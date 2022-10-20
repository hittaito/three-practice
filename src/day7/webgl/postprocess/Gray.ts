import * as THREE from 'three';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
import WebGL from '../Webgl';

export class Gray {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = new THREE.Scene();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            ...LuminosityShader,
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    render(target: THREE.WebGLRenderTarget, texture: THREE.Texture) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.tDiffuse.value = texture;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
