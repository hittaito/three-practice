import * as THREE from 'three';
import FlowField from './FlowField';
import vert from '../glsl/particle.vert';
import frag from '../glsl/particle.frag';
import gui from './gui';

export default class Particles {
    scene: THREE.Scene;
    geometry: THREE.BufferGeometry;
    material: THREE.ShaderMaterial;
    points: THREE.Points;
    flowField: FlowField;
    positions: Float32Array;
    count = 3000;
    constructor(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.scene = scene;
        this.setPositions();
        this.setFlowField(scene, renderer);
        this.setGeometry();
        this.setMaterial();
        this.setPoints();
    }
    setPositions() {
        this.geometry = new THREE.BufferGeometry();
        const position = new Float32Array(this.count * 3);
        for (let i = 0; i < this.count; i++) {
            const angle = Math.random() * Math.PI * 2;
            position[i * 3 + 0] = Math.sin(angle);
            position[i * 3 + 1] = Math.cos(angle);
            position[i * 3 + 2] = 0;
        }
        this.positions = position;
    }
    setFlowField(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
        this.flowField = new FlowField(this.positions, renderer, scene);
    }
    setGeometry() {
        const sizes = new Float32Array(this.count);
        for (let i = 0; i < this.count; i++) {
            sizes[i] = 0.2 + Math.random() * 0.8;
        }
        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        this.geometry.setAttribute('fboUV', this.flowField.coordiname.attribute);
    }
    setMaterial() {
        const loader = new THREE.TextureLoader();
        const img = loader.load('/assets/particleMask.png');
        console.log(img);

        const color = new THREE.Color();
        this.material = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            uniforms: {
                uFBOTexture: { value: this.flowField.texture },
                uColor: { value: color },
                uSize: { value: 32 },
                uMaskTexture: { value: img },
            },
        });
        gui.addFolder('Particles');
        gui.add(this.material.uniforms.uSize, 'value', 0.1, 100).name('size');
        gui.addColor({ color: color.getHex() }, 'color').onChange((c) => color.setHex(c));
    }
    setPoints() {
        this.points = new THREE.Points(this.geometry, this.material);
        this.scene.add(this.points);
    }
    update() {
        this.flowField.update();
        this.material.uniforms.uFBOTexture.value = this.flowField.texture;
    }
}
