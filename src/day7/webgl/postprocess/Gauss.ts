import * as THREE from 'three';
import WebGL from '../Webgl';
import frag1 from '../../glsl/gauss1.frag';
import frag2 from '../../glsl/gauss2.frag';

export class Gauss {
    scene1: THREE.Scene;
    scene2: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    textures: THREE.WebGLRenderTarget[];
    mesh1: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    mesh2: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene1 = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        // 縮小バッファ
        const buffer = new THREE.WebGLRenderTarget(
            (webgl.size.width * Math.min(2, window.devicePixelRatio)) / 4,
            (webgl.size.height * Math.min(2, window.devicePixelRatio)) / 4
        );
        buffer.texture.type = THREE.FloatType;
        buffer.texture.minFilter = THREE.NearestFilter;
        buffer.texture.magFilter = THREE.NearestFilter;
        this.textures = [buffer, buffer.clone()];

        const g = new THREE.PlaneGeometry(2, 2);

        const m1 = new THREE.ShaderMaterial({
            vertexShader: /* glsl */ `
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader: frag1,
            uniforms: {
                tDiffuse: { value: null },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh1 = new THREE.Mesh(g, m1);
        this.scene1.add(this.mesh1);

        const m2 = new THREE.ShaderMaterial({
            vertexShader: /* glsl */ `
                out vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                }`,
            fragmentShader: frag2,
            uniforms: {
                img: { value: null },
                horizontal: { value: false },
                steps: { value: 1 },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh2 = new THREE.Mesh(g, m2);
        this.scene2.add(this.mesh2);
    }
    render(target: THREE.WebGLRenderTarget, texture: THREE.Texture) {
        this.renderer.setRenderTarget(this.textures[0]);
        this.mesh1.material.uniforms.tDiffuse.value = texture;
        this.renderer.render(this.scene1, this.camera);

        for (let i = 0; i < 8; i++) {
            const idx = i % 2;
            this.renderer.setRenderTarget(this.textures[1 - idx]);
            this.mesh2.material.uniforms.img.value = this.textures[idx].texture;
            this.mesh2.material.uniforms.horizontal.value = idx === 1;
            this.renderer.render(this.scene2, this.camera);
        }

        this.renderer.setRenderTarget(target);
        this.mesh1.material.uniforms.tDiffuse.value = this.textures[0].texture;
        this.renderer.render(this.scene1, this.camera);
    }
}
