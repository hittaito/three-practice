import * as THREE from 'three';
import WebGL from '../Webgl';

export class Viewer {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;

    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = new THREE.Scene();
        this.camera = webgl.oCamera;

        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: /* glsl */ `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }`,
            fragmentShader: /* glsl */ `
			#include <packing>

			varying vec2 vUv;
			uniform sampler2D tDepth;

			void main() {
				float depth = unpackRGBAToDepth( texture2D( tDepth, vUv ) );
                if(depth > 0.6){
                    depth = 2.5 * (1.0 - depth);
                }else if(depth >= 0.4){
                    depth = 1.0;
                }else{
                    depth *= 2.5;
                }
                depth = depth * depth * depth;
				gl_FragColor.rgb =  vec3( depth ) ;
				gl_FragColor.a = 1.0;
			}`,
            uniforms: {
                tDiffuse: { value: null },
                tDepth: { value: null },
            },
        });

        this.mesh = new THREE.Mesh(g, m);
        this.scene.add(this.mesh);
    }
    render(target: THREE.Texture) {
        this.renderer.setRenderTarget(null);
        this.mesh.material.uniforms.tDepth.value = target;
        this.renderer.render(this.scene, this.camera);
    }
}
