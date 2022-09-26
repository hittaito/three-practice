import * as THREE from 'three';
import WebGL from '../Webgl';
import frag from '../../glsl/box.frag';
import vert from '../../glsl/box.vert';

export default class Box {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        this.setUp();
    }
    setUp() {
        const geom = new THREE.SphereGeometry(4, 32, 32);
        const mat = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.mesh);
    }
    update() {}
}
