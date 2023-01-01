import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/inner.vert';
import frag from '../../glsl/mix.frag';

export default class Mix {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.renderer = webgl.renderer;
        this.camera = webgl.oCamera;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            glslVersion: THREE.GLSL3,
            vertexShader: vert,
            fragmentShader: frag,
            uniforms: {
                uColor: { value: null },
                uDepth: { value: null },
                uBokeh: { value: null },
                uEdge: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render(textures: {
        color: THREE.Texture;
        depth: THREE.Texture;
        bokeh: THREE.Texture;
        edge: THREE.Texture;
    }) {
        this.mesh.material.uniforms.uColor.value = textures.color;
        this.mesh.material.uniforms.uDepth.value = textures.depth;
        this.mesh.material.uniforms.uBokeh.value = textures.bokeh;
        this.mesh.material.uniforms.uEdge.value = textures.edge;
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.mesh, this.camera);
    }
}
