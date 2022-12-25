import * as THREE from 'three';
import { ShaderMaterial } from 'three';
import vert from '../../glsl/instance.vert';
import frag from '../../glsl/instance.frag';
import WebGL from '../Webgl';

export class Instance {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
    constructor(count: number) {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        const instGeom = new THREE.ConeGeometry(0.5, 2, 16);
        const geom = new THREE.InstancedBufferGeometry();
        geom.instanceCount = count;
        geom.index = instGeom.index;
        geom.attributes = instGeom.attributes;

        const SIZE = Math.sqrt(count);

        const idArray = new Float32Array(count * 2);
        let id = 0;
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                idArray[id * 2 + 0] = x;
                idArray[id * 2 + 1] = y;
                id++;
            }
        }
        geom.setAttribute('id', new THREE.InstancedBufferAttribute(idArray, 2));

        const mat = new ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uPosition: { value: null },
                uVelocity: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.mesh);
    }
    update(target: THREE.WebGLMultipleRenderTargets) {
        this.mesh.material.uniforms.uPosition.value = target.texture[0];
        this.mesh.material.uniforms.uVelocity.value = target.texture[1];
    }
}
