import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';
import WebGL from '../Webgl';
export default class SampleModel {
    scene: THREE.Scene;
    physics: CANNON.World;

    geom: THREE.BoxGeometry;
    mat: THREE.ShaderMaterial;
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.ShaderMaterial>;

    body: CANNON.Body;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.physics = webgl.physics;

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
        this.mesh.castShadow = true;

        this.scene.add(this.mesh);

        const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        this.body = new CANNON.Body({
            mass: 1,
        });
        this.body.angularVelocity.set(1, 2, 3);
        this.body.angularDamping = 0.5;
        this.body.addShape(shape);
        this.physics.addBody(this.body);
    }
    setPosition(x: number, y: number) {
        this.mesh.position.set(x, 3, y);
        this.body.position.set(x, 3, y);
    }
    update() {
        this.mesh.position.set(
            this.body.position.x,
            this.body.position.y,
            this.body.position.z
        );
        this.mesh.quaternion.set(
            this.body.quaternion.x,
            this.body.quaternion.y,
            this.body.quaternion.z,
            this.body.quaternion.w
        );
        this.mesh.rotation.y += 0.01;
    }
}
