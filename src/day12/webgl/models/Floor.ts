import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import WebGL from '../Webgl';

export default class Floor {
    constructor() {
        const webgl = new WebGL();
        const scene = webgl.scene;
        const physics = webgl.physics;

        const geom = new THREE.PlaneGeometry(100, 100);
        const mat = new THREE.MeshPhysicalMaterial({});
        const mesh = new THREE.Mesh(geom, mat);
        mesh.receiveShadow = true;
        mesh.rotateX(-Math.PI * 0.5);
        mesh.position.y = -3;
        scene.add(mesh);

        const shape = new CANNON.Plane();

        const body = new CANNON.Body({ mass: 0 });
        body.addShape(shape);
        physics.addBody(body);

        body.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
        body.quaternion.set(
            mesh.quaternion.x,
            mesh.quaternion.y,
            mesh.quaternion.z,
            mesh.quaternion.w
        );
    }
}
