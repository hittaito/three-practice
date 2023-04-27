import * as THREE from 'three';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';
import WebGL from '../Webgl';
export default class SampleModel {
    scene: THREE.Scene;

    geom: THREE.BoxGeometry;
    mat: THREE.ShaderMaterial;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        this.setUp();
    }
    setUp() {
        this.geom = new THREE.BoxGeometry(1, 1, 1);
        this.mat = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
        });
        this.mesh = new THREE.Mesh(this.geom, this.mat);
        this.scene.add(this.mesh);
    }
    update(
        position: { x: number; y: number; z: number },
        quaternion: { x: number; y: number; z: number; w: number }
    ) {
        this.mesh.position.x = position.x;
        this.mesh.position.y = position.y;
        this.mesh.position.z = position.z;
        this.mesh.quaternion.x = quaternion.x;
        this.mesh.quaternion.y = quaternion.y;
        this.mesh.quaternion.z = quaternion.z;
        this.mesh.quaternion.w = quaternion.w;
        // this.mesh.rotation.y += 0.01;
    }
}
