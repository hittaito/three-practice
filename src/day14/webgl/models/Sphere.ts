import * as THREE from 'three';
import WebGL from '../Webgl';

export default class Sphere {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene2;

        const g = new THREE.SphereGeometry(1, 64, 64);
        const m = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            // reflectivity: 0.95,
            reflectivity: 0,
            metalness: 0.1,
            roughness: 0.1,
            opacity: 0.9,
            // premultipliedAlpha: true,
            transparent: true,
            ior: 2.333,
            displacementScale: 0.1,
            vertexColors: true,
        });
        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    setBackground(background: THREE.CubeTexture) {
        background.mapping = THREE.CubeRefractionMapping;
        this.mesh.material.envMap = background;
    }
    setHeightMap(map: THREE.Texture) {
        this.mesh.material.displacementMap = map;
    }
}
