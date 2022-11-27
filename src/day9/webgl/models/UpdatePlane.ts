import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/update.frag';

export default class UpdatePlane {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    time = 0;

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
            uniforms: {
                u_position: { value: null },
                u_velocity: { value: null },
                u_upper: { value: null },
                u_time: { value: 0 },
            },
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    update(
        target: THREE.WebGLMultipleRenderTargets,
        input: THREE.WebGLMultipleRenderTargets
    ) {
        this.time++;

        this.renderer.setRenderTarget(target);
        this.renderer.setSize(this.param.length, this.param.num);
        this.mesh.material.uniforms.u_position.value = input.texture[0];
        this.mesh.material.uniforms.u_velocity.value = input.texture[1];
        this.mesh.material.uniforms.u_upper.value = input.texture[2];
        this.mesh.material.uniforms.u_time.value = this.time;

        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        this.renderer.setSize(
            innerWidth * this.renderer.getPixelRatio(),
            innerHeight * this.renderer.getPixelRatio()
        );
    }
}
