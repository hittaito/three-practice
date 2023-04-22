import * as THREE from 'three';

import WebGL from '../Webgl';
export default class SampleModel {
    scene: THREE.Scene;

    geom: THREE.BoxGeometry;
    mat: THREE.MeshLambertMaterial;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshLambertMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        this.setUp();
    }
    setUp() {
        this.geom = new THREE.BoxGeometry(1, 1);
        // this.mat = new THREE.ShaderMaterial({
        //     fragmentShader: frag,
        //     vertexShader: vert,
        //     glslVersion: THREE.GLSL3,
        // });
        this.mat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geom, this.mat);
        this.scene.add(this.mesh);
    }
    update() {
        this.mesh.rotation.y += 0.01;
    }
}
