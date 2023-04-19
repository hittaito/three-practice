import * as THREE from 'three';
import WebGL from '../Webgl';
import vert from '../../glsl/main.vert';
import frag from '../../glsl/updater.frag';

export default class Updater {
    private camera: THREE.OrthographicCamera;
    private renderer: THREE.WebGLRenderer;

    private mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

    constructor(count: number) {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;

        const g = new THREE.PlaneGeometry(2, 2);
        const m = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMouse: { value: new THREE.Vector2(0, 0) },
                uResolution: { value: new THREE.Vector2(0, 0) },
                uPrev: { value: new THREE.Vector2(1, 0) },
                uTime: { value: 0 },
                uMap1: { value: null },
                uMap2: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(g, m);
    }
    render(
        textures: THREE.Texture[],
        targets: THREE.WebGLMultipleRenderTargets
    ) {
        this.mesh.material.uniforms.uTime.value += 1;
        this.mesh.material.uniforms.uMap1.value = textures[0];
        this.mesh.material.uniforms.uMap2.value = textures[1];

        this.renderer.setRenderTarget(targets);
        this.renderer.render(this.mesh, this.camera);
    }
    update(event: MouseEvent) {
        this.mesh.material.uniforms.uPrev.value.setX(
            this.mesh.material.uniforms.uMouse.value.x
        );
        this.mesh.material.uniforms.uPrev.value.setY(
            this.mesh.material.uniforms.uMouse.value.y
        );
        this.mesh.material.uniforms.uMouse.value.setX(event.clientX);
        this.mesh.material.uniforms.uMouse.value.setY(
            window.innerHeight - event.clientY
        );
    }
    resize() {
        this.mesh.material.uniforms.uResolution.value.setX(window.innerWidth);
        this.mesh.material.uniforms.uResolution.value.setY(window.innerHeight);
    }
}
