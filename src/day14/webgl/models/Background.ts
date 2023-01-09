import * as THREE from 'three';
import WebGL from '../Webgl';
export default class Background {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene3;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.MeshBasicMaterial({ map: null });
        this.mesh = new THREE.Mesh(g, m);
        this.mesh.position.z = -1;
        this.scene.add(this.mesh);
    }
    setTexture(texture: THREE.Texture) {
        this.mesh.material.map = texture;
    }
}
