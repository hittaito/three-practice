import * as THREE from 'three';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import WebGL from '../Webgl';

export class FXAA {
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
            ...FXAAShader,
        });

        this.mesh = new THREE.Mesh(g, m);
        this.mesh.material.uniforms.resolution.value.x =
            1 / (window.innerWidth * this.renderer.getPixelRatio());
        this.mesh.material.uniforms.resolution.value.y =
            1 / (window.innerHeight * this.renderer.getPixelRatio());

        this.scene.add(this.mesh);
    }
    render(target: THREE.WebGLRenderTarget | null, texture: THREE.Texture) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.tDiffuse.value = texture;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
