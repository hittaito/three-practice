import * as THREE from 'three';
import WebGL from '../Webgl';
import { Color } from '../Color';

export default class Floor {
    scene: THREE.Scene;
    mesh: THREE.Mesh;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const g = new THREE.PlaneGeometry(100, 100);
        const m = new THREE.MeshPhysicalMaterial({ color: Color.type3 });
        this.mesh = new THREE.Mesh(g, m);
        this.mesh.receiveShadow = true;
        this.mesh.rotateX(-Math.PI * 0.5);
        this.scene.add(this.mesh);
    }
}
