import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Particles from './models/Particle';

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    particles: Particles;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(25, innerWidth / innerHeight, 0.1, 150);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 10);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(innerWidth, innerHeight);

        new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        this.particles = new Particles(this.scene, this.renderer);

        this.render();
    }
    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
    update() {
        this.particles.update();
    }
}

const m = new Main();
m.init();
