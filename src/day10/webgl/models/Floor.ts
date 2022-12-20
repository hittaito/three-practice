import * as THREE from 'three';
import WebGL from '../Webgl';

export class Floor {
    topView: THREE.Scene;
    finalView: THREE.Scene;
    geom: THREE.PlaneGeometry;
    mesh: THREE.Mesh;
    constructor() {
        const webgl = new WebGL();

        this.topView = webgl.scene.topView;
        this.finalView = webgl.scene.final;
        this.geom = new THREE.PlaneGeometry(2, 2);
        const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        this.mesh = new THREE.Mesh(this.geom, mat);
        this.mesh.rotateX(-Math.PI * 0.5);
        this.mesh.position.y = -1;
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
        console.log(this.topView);

        this.topView.add(this.mesh);

        this.finalView.add(this.mesh);
        //
    }
}
