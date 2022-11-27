import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/plane.vert';
import frag from '../../glsl/plane.frag';

export default class RenderPlane {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
    constructor(length: number, num: number) {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;

        const plane = new THREE.PlaneGeometry(length - 1, 0.01, length - 1, 1);
        const positions = plane.getAttribute('position').clone();

        const nVertex = 2 * length;
        const trail = new Float32Array(nVertex);

        for (let i = 0; i < nVertex; i++) {
            const x = positions.getX(i);
            trail[i] = x + (length - 1) * 0.5;
            positions.setX(i, 0);
        }

        plane.setAttribute(
            'i_trail',
            new THREE.Float32BufferAttribute(trail, 1)
        );
        plane.setAttribute('position', positions);

        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                u_position: { value: null },
                u_velocity: { value: null },
                u_upper: { value: null },
            },
            wireframe: false,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthTest: true,
        });

        this.mesh = new THREE.InstancedMesh(plane, m, num);
        this.scene.add(this.mesh);
    }
    setPosTexture(mrt: THREE.WebGLMultipleRenderTargets) {
        this.mesh.material.uniforms.u_position.value = mrt.texture[0];
        this.mesh.material.uniforms.u_velocity.value = mrt.texture[1];
        this.mesh.material.uniforms.u_upper.value = mrt.texture[2];
    }
    update() {
        this.renderer.render(this.scene, this.camera);
    }
}
