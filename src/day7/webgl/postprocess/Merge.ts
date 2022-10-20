import * as THREE from 'three';
import frag from '../../glsl/merge.frag';
import WebGL from '../Webgl';

export class Merge {
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
            uniforms: {
                tDiffuse: { value: null },
                opacity: { value: 1.0 },
                uImage: { value: null },
            },
            vertexShader: /* glsl */ `
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader: frag,
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }

    render(
        target: THREE.WebGLRenderTarget,
        texture1: THREE.Texture,
        texture2: THREE.Texture
    ) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.uImage.value = texture1;
        this.mesh.material.uniforms.tDiffuse.value = texture2;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
