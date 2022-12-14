import * as THREE from 'three';
import frag from '../../glsl/caustics.frag';
import vert from '../../glsl/caustics.vert';
import WebGL from '../Webgl';

export default class Caustics {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    target: THREE.WebGLRenderTarget;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor(near: number, far: number) {
        const webgl = new WebGL();
        this.renderer = webgl.renderer;
        this.camera = webgl.oCamera;
        const WIDTH = 1024; // webgl.size.width * Math.min(2, window.devicePixelRatio);
        const HEIGHT = 1024; // webgl.size.height * Math.min(2, window.devicePixelRatio);
        this.target = new THREE.WebGLRenderTarget(WIDTH * 2, HEIGHT * 2, {
            type: THREE.FloatType,
        });
        const geom = new THREE.PlaneGeometry(2, 2, WIDTH, HEIGHT);
        const mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uEnvMap: { value: null },
                uHeightMap: { value: null },
                uTime: { value: 0 },
                cameraNear: { value: near },
                cameraFar: { value: far },
            },
            transparent: true,
        });
        // mat.extensions.derivatives = true;
        // mat.blendEquation = THREE.AddEquation;
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.rotateX(-Math.PI * 0.5);
    }

    update(depthMap: THREE.Texture, heightMap: THREE.Texture) {
        // this.mesh.material.uniforms.uTime.value += 0.01;
        this.mesh.material.uniforms.uEnvMap.value = depthMap;
        this.mesh.material.uniforms.uHeightMap.value = heightMap;
        this.renderer.setRenderTarget(this.target);
    }
}
