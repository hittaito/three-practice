import * as THREE from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';
import WebGL from '../Webgl';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';

export default class Box {
    scene: THREE.Scene;

    mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        this.setUp();
    }
    setUp() {
        // const geom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        const X = 100;
        const Y = 20;
        const geoms: THREE.BoxGeometry[] = [];
        for (let i = 0; i < X; i++) {
            for (let j = 0; j < Y; j++) {
                const geom = new THREE.BoxGeometry(1, 1, 1);
                geom.translate(1.5 * (i - X / 2), -1.5, 1.5 * (j - Y / 2));

                const nVertex = geom.getAttribute('position').count;
                const iPosition = new Float32Array(nVertex * 2);
                for (let x = 0; x < nVertex; x++) {
                    iPosition[x * 2 + 0] = 1.5 * (i - X / 2);
                    iPosition[x * 2 + 1] = 1.5 * (j - Y / 2);
                }
                geom.setAttribute(
                    'iPosition',
                    new THREE.BufferAttribute(iPosition, 2)
                );
                geoms.push(geom);

                const geom2 = new THREE.BoxGeometry(1, 1, 1);
                geom2.translate(1.5 * (i - X / 2), 1.5, 1.5 * (j - Y / 2));
                geom2.setAttribute(
                    'iPosition',
                    new THREE.BufferAttribute(iPosition, 2)
                );
                geoms.push(geom2);
            }
        }
        const geom = mergeBufferGeometries(geoms);
        const material = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uSwitch: { value: 1 },
                uTime: { value: 0 },
                uColor: { value: new THREE.Vector3(0, 0, 1) },
            },
        });
        this.mesh = new THREE.Mesh(geom, material);
        this.mesh.position.x += 0.5;
        this.mesh.rotation.y += 0.0001;
        this.mesh.rotation.x += 0.0001;
        this.scene.add(this.mesh);
    }
    on() {
        this.mesh.material.uniforms.uSwitch.value = 1;
        this.mesh.visible = true;
    }
    off() {
        this.mesh.material.uniforms.uSwitch.value = 0;
        this.mesh.visible = false;
    }
    update() {
        this.mesh.material.uniforms.uTime.value += 1;
    }
}
