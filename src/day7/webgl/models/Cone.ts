import * as THREE from 'three';
import WebGL from '../Webgl';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';

export default class Cone {
    scene: THREE.Scene;

    mesh: THREE.Mesh<THREE.ConeGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        this.setUp();
    }
    setUp() {
        const geom = new THREE.ConeGeometry(0.3, 1, 4);
        const material = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uSwitch: { value: 1 },
                uTime: { value: 0 },
                uColor: { value: new THREE.Vector3(1, 0, 0) },
            },
        });
        this.mesh = new THREE.Mesh(geom, material);

        this.scene.add(this.mesh);
    }
    on() {
        this.mesh.material.uniforms.uSwitch.value = 1;
    }
    off() {
        this.mesh.material.uniforms.uSwitch.value = 0;
    }
    update() {
        this.mesh.material.uniforms.uTime.value += 1;
    }
}
