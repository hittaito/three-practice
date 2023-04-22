import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/boxes.vert';
import frag from '../../glsl/boxes.frag';
import shadow from '../../glsl/shadow.frag';
import { COLOR } from '../../Color';

const SIZE = 60;

export default class {
    scene: THREE.Scene;

    baseMat: THREE.ShaderMaterial;
    shadowMat: THREE.ShaderMaterial;
    mesh: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const instance = new THREE.BoxGeometry(1, 1, 10);
        const g = new THREE.InstancedBufferGeometry();
        g.instanceCount = SIZE * SIZE;
        g.index = instance.index;
        g.attributes = instance.attributes;

        const xy = new Float32Array(SIZE * SIZE * 2);
        const rnd = new Float32Array(SIZE * SIZE);
        let i = 0;
        for (let x = 0; x < SIZE; x++) {
            for (let y = 0; y < SIZE; y++) {
                xy[i * 2 + 0] = x - SIZE / 2;
                xy[i * 2 + 1] = y - SIZE / 2;
                rnd[i] = Math.random();
                i++;
            }
        }
        g.setAttribute('iXY', new THREE.InstancedBufferAttribute(xy, 2));
        g.setAttribute('iRnd', new THREE.InstancedBufferAttribute(rnd, 1));

        const m1 = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
                uLightPos: { value: null },
                uDepthMap: { value: null },
                uShadowPMat: { value: null },
                uShadowVMat: { value: null },
                uColor1: { value: COLOR.PRIMARY2 },
                uColor2: { value: COLOR.ACCENT1 },
            },
        });
        this.baseMat = m1;
        this.shadowMat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: shadow,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
            },
        });

        this.mesh = new THREE.Mesh(g, m1);

        this.scene.add(this.mesh);
    }
    update(light: THREE.DirectionalLight) {
        this.shadowMat.uniforms.uTime.value += 1;
        this.baseMat.uniforms.uTime.value += 1;
        this.baseMat.uniforms.uLightPos.value = light.position;
        this.baseMat.uniforms.uShadowPMat.value =
            light.shadow.camera.projectionMatrix;
        this.baseMat.uniforms.uShadowVMat.value =
            light.shadow.camera.matrixWorldInverse;
    }
    updateShadowMap(texture: THREE.Texture) {
        this.baseMat.uniforms.uDepthMap.value = texture;
    }
    setMat(p: 'base' | 'shadow') {
        if (p === 'base') {
            this.mesh.material = this.baseMat;
        } else {
            this.mesh.material = this.shadowMat;
        }
    }
}
