import * as THREE from 'three';
import WebGL from '../Webgl';
export class Prepare {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    constructor() {
        const webgl = new WebGL();
        this.renderer = webgl.renderer;
        this.scene = new THREE.Scene();
    }
    setGeometry(objects: THREE.BufferGeometry[]) {
        objects.forEach((o) => {
            this.scene.add(
                new THREE.Mesh(
                    o,
                    new THREE.MeshStandardMaterial({ color: 0xff0000 })
                )
            );
        });
    }
    render(target: THREE.WebGLRenderTarget, camera: THREE.OrthographicCamera) {
        this.renderer.setRenderTarget(target);
        this.renderer.render(this.scene, camera);
        this.renderer.setRenderTarget(null);
    }
}
