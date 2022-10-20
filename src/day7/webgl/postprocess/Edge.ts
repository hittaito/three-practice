import * as THREE from 'three';
import frag from '../../glsl/sobel.frag';
import WebGL from '../Webgl';

export class Edge {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor(color: THREE.Vector3) {
        const webgl = new WebGL();
        this.scene = new THREE.Scene();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                opacity: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                uColor: { value: color },
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
        this.mesh.material.uniforms.resolution.value.x =
            window.innerWidth * window.devicePixelRatio;
        this.mesh.material.uniforms.resolution.value.y =
            window.innerHeight * window.devicePixelRatio;
        this.scene.add(this.mesh);
    }

    render(target: THREE.WebGLRenderTarget, texture: THREE.Texture) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.tDiffuse.value = texture;
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
    }
}
