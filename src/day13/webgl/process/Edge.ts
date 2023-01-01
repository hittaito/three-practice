import * as THREE from 'three';
import vert from '../../glsl/inner.vert';
import frag from '../../glsl/sobel.frag';
import WebGL from '../Webgl';

export class Edge {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                opacity: { value: 1.0 },
                resolution: { value: new THREE.Vector2() },
                uColor: { value: new THREE.Color(0x00ff00) },
            },
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
        });

        this.mesh = new THREE.Mesh(g, m);
        this.mesh.material.uniforms.resolution.value.x = webgl.size.width;
        this.mesh.material.uniforms.resolution.value.y = webgl.size.height;

        webgl.resizeFn.push(this.resize.bind(this));
    }

    render(target: THREE.WebGLRenderTarget | null, texture: THREE.Texture) {
        this.renderer.setRenderTarget(target);
        this.mesh.material.uniforms.tDiffuse.value = texture;
        this.renderer.render(this.mesh, this.camera);
        this.renderer.setRenderTarget(null);
    }
    resize(width: number, height: number) {
        this.mesh.material.uniforms.resolution.value.x = width;
        this.mesh.material.uniforms.resolution.value.y = height;
    }
}
