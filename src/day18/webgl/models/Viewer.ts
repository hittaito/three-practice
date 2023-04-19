import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/viewer.vert';
import frag from '../../glsl/viewer.frag';

export default class Viewer {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;

    constructor(count: number) {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.renderer = webgl.renderer;

        const instance = new THREE.CircleGeometry(0.3, 36);
        const g = new THREE.InstancedBufferGeometry();
        g.instanceCount = count;
        g.index = instance.index;
        g.attributes = instance.attributes;

        const ids = new Float32Array(count);

        for (let x = 0; x < count; x++) {
            ids[x] = x;
        }

        g.setAttribute('iId', new THREE.InstancedBufferAttribute(ids, 1));

        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMap1: { value: null },
                uMap2: { value: null },
                uResolution: { value: new THREE.Vector2(0, 0) },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    update(texture: THREE.Texture[]) {
        this.mesh.material.uniforms.uMap1.value = texture[0];
        this.mesh.material.uniforms.uMap2.value = texture[1];
    }
    resize() {
        this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth);
        this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight);
    }
}
