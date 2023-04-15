import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/box.vert';
import frag from '../../glsl/box.frag';

const SQRT = 20;
const COUNT = SQRT * SQRT * SQRT;

export default class Boxes {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const instance = new THREE.BoxGeometry(1, 1, 1);
        const g = new THREE.InstancedBufferGeometry();
        g.instanceCount = COUNT;
        g.index = instance.index;
        g.attributes = instance.attributes;

        // const ids = new Float32Array(COUNT);
        const params = new Float32Array(COUNT * 3);

        let i = 0;
        for (let x = 0; x < SQRT; x++) {
            for (let y = 0; y < SQRT; y++) {
                for (let z = 0; z < SQRT; z++) {
                    params[i + 0] = x;
                    params[i + 1] = y;
                    params[i + 2] = z;
                    i += 3;
                }
            }
        }

        g.setAttribute('iParam', new THREE.InstancedBufferAttribute(params, 3));

        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
            uniforms: {
                uSide: { value: SQRT },
                uTexture: { value: null },
            },
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    update(texture: THREE.Texture) {
        this.mesh.material.uniforms.uTexture.value = texture;
    }
}
