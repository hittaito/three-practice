import * as THREE from 'three';
import WebGL from '../Webgl';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';

const COUNT = 800;

export default class Panels {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene1;

        const instance = new THREE.PlaneGeometry(1, 1);
        const geom = new THREE.InstancedBufferGeometry();
        geom.instanceCount = COUNT;
        geom.index = instance.index;
        geom.attributes = instance.attributes;

        const id = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
            id[i] = i;
        }
        geom.setAttribute('id', new THREE.InstancedBufferAttribute(id, 1));
        const mat = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
            uniforms: {
                uTexture: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.mesh);
    }
    setTexture(texture: THREE.Texture) {
        this.mesh.material.uniforms.uTexture.value = texture;
    }
}
