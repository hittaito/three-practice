import * as THREE from 'three';
import frag from '../../glsl/sobel.frag';
export const SobelShader = {
    uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        resolution: { value: new THREE.Vector2() },
        uColor: { value: new THREE.Vector3() },
    },
    vertexShader: /* glsl */ `
		out vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
    fragmentShader: frag,
    glslVersion: THREE.GLSL3,
};
