import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/init.frag';

export default class InitPlane {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    renderer: THREE.WebGLRenderer;
    param: { length: number; num: number };
    constructor(length: number, num: number) {
        const webgl = new WebGL();
        this.scene = new THREE.Scene();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        this.param = { length, num };
        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    render(target: THREE.WebGLMultipleRenderTargets) {
        this.renderer.setRenderTarget(target);
        this.renderer.setSize(this.param.length, this.param.num);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        // this.renderer.setSize(
        //     innerWidth * this.renderer.getPixelRatio(),
        //     innerHeight * this.renderer.getPixelRatio()
        // );
    }
}
