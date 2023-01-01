import * as THREE from 'three';
import * as Curve from 'three/examples/jsm/curves/CurveExtras';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';
import WebGL from '../Webgl';

const LOOP = 1500;

export default class Tube {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    mesh: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>;

    vec: {
        position: THREE.Vector3;
        tangent: THREE.Vector3;
        binormal: THREE.Vector3;
        normal: THREE.Vector3;
        target: THREE.Vector3;
    };

    curve: THREE.Curve<THREE.Vector3>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;

        const trefoil = new Curve.TrefoilKnot(); // 三つ葉形
        this.curve = trefoil;

        const geom = new THREE.TubeGeometry(this.curve, 256, 8, 32);
        const mat = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            fragmentShader: frag,
            vertexShader: vert,
            uniforms: {
                uInner: { value: null },
                uCameraPos: { value: null },
                uNear: { value: 0 },
                uFar: { value: 0 },
            },
            side: THREE.DoubleSide,
        });

        this.mesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.mesh);

        this.vec = {
            position: new THREE.Vector3(0, 0, 0),
            tangent: new THREE.Vector3(0, 0, 0),
            binormal: new THREE.Vector3(0, 0, 0),
            normal: new THREE.Vector3(0, 0, 0),
            target: new THREE.Vector3(0, 0, 0),
        };
    }
    setInner(texture: THREE.Texture) {
        this.mesh.material.uniforms.uInner.value = texture;
    }
    updateCamera(time: number) {
        // https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_extrude_splines.html
        const step = (time % LOOP) / LOOP;

        this.curve.getPointAt(step, this.vec.position);
        const geom = this.mesh.geometry;
        const pickt = step * geom.tangents.length;
        const pick = Math.floor(pickt);
        const next = (pick + 1) % geom.tangents.length;

        this.vec.binormal.subVectors(
            geom.binormals[next],
            geom.binormals[pick]
        );
        this.vec.binormal
            .multiplyScalar(pickt - pick)
            .add(geom.binormals[pick]);

        geom.parameters.path.getTangentAt(step, this.vec.tangent);
        this.vec.normal.copy(this.vec.binormal).cross(this.vec.tangent);
        this.vec.position.add(this.vec.normal.clone().multiplyScalar(-4));

        this.camera.position.copy(this.vec.position);
        geom.parameters.path.getPointAt(
            (step + 30 / geom.parameters.path.getLength()) % 1,
            this.vec.tangent
        );

        this.vec.target.copy(this.vec.position).add(this.vec.tangent);
        this.camera.matrix.lookAt(
            this.vec.position,
            this.vec.tangent,
            this.vec.normal
        );
        this.camera.quaternion.setFromRotationMatrix(this.camera.matrix);

        // update camera uniform
        this.mesh.material.uniforms.uCameraPos.value = this.camera.position;
        this.mesh.material.uniforms.uNear.value = this.camera.near;
        this.mesh.material.uniforms.uFar.value = this.camera.far;
    }
}
