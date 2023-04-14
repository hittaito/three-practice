import * as THREE from 'three';
import vert from '../../glsl/points.vert';
import frag from '../../glsl/points.frag';
import WebGL from '../Webgl';

export default class Points {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

    constructor(row = 100, column = 30) {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const instance = new THREE.BoxGeometry(0.02, 0.02, 0.02);
        const geom = new THREE.InstancedBufferGeometry();
        const count = row * column;
        geom.instanceCount = count;
        geom.index = instance.index;
        geom.attributes = instance.attributes;

        const ids = new Float32Array(count);
        for (let x = 0; x < count; x++) {
            ids[x] = x;
        }
        geom.setAttribute('iId', new THREE.InstancedBufferAttribute(ids, 1));
        console.log(geom);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
            uniforms: {
                uRow: { value: row },
                uColumn: { value: column },
                uMap: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(geom, m);
        this.scene.add(this.mesh);
    }
    update(texture: THREE.Texture) {
        this.mesh.material.uniforms.uMap.value = texture;
    }
}
