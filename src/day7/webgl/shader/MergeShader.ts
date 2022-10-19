import * as THREE from 'three';
import frag from '../../glsl/merge.frag';
export const MergeShader = {
    uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        uImage: { value: null },
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
