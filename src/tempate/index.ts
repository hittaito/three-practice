import * as THREE from 'three';

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.Renderer;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(innerWidth, innerHeight);

        document.body.appendChild(this.renderer.domElement);

        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}

const m = new Main();
m.init();
