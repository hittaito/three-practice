import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';
import frag from './glsl/main.frag';
import vert from './glsl/main.vert';

const nSEGMENT = 1000;
class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 300);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });

        this.renderer.setSize(innerWidth, innerHeight);

        new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        const g = this.setGeometry();
        const m = new THREE.RawShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
        });
        const mesh = new THREE.Mesh(g, m);
        console.log(mesh);
        //mesh.setD
        THREE.TriangleStripDrawMode;
        this.scene.add(new THREE.Mesh(g, m));

        console.log('en');

        const g2 = new THREE.BoxBufferGeometry(1, 1, 1);
        const m2 = new THREE.MeshBasicMaterial({ color: 0x445643 });
        const tmp = new THREE.Mesh(g2, m2);
        console.log(BufferGeometryUtils.toTrianglesDrawMode(g2, THREE.TriangleStripDrawMode));
        // this.scene.add(new THREE.Mesh(g2, m2));

        this.render();
    }
    render() {
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
    setGeometry() {
        const nVert = 2 * nSEGMENT;
        const nIndex = 6 * (nSEGMENT - 1);

        const positions = new Array(nVert * 3);
        const signs = new Array(nVert);
        const indexes = new Uint16Array(nIndex);

        for (let i = 0; i < nSEGMENT; i++) {
            const x = 50.0 * Math.sin(0.032 * i + 0.35) * Math.sin(-0.029 * i + 4.86); // x
            const y = 50.0 * Math.sin(i * 0.041 - 1.96);
            const z = 50.0 * Math.sin(i * 0.078 - 5.21);

            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z;
            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y;
            positions[i * 6 + 5] = z;
            signs[2 * i] = 1;
            signs[2 * i + 1] = -1;
        }
        // ここ考えるのが面倒だったので丸写し
        for (let i = 0; i < nSEGMENT - 1; ++i) {
            indexes[6 * i] = 2 * i;
            indexes[6 * i + 1] = indexes[6 * i + 5] = 2 * i + 1;
            indexes[6 * i + 2] = indexes[6 * i + 4] = 2 * i + 2;
            indexes[6 * i + 3] = 2 * i + 3;
        }
        const pos = [...positions];
        const f = positions.splice(0, 3);
        const e = positions.splice(positions.length - 3, 3);
        const prevPos = [...f, ...f, ...positions];
        const nextPos = [...positions, ...e, ...e];

        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pos), 3));
        geom.setAttribute('prevPos', new THREE.BufferAttribute(new Float32Array(prevPos), 3));
        geom.setAttribute('nextPos', new THREE.BufferAttribute(new Float32Array(nextPos), 3));
        geom.setAttribute('sign', new THREE.BufferAttribute(new Float32Array(signs), 1));
        geom.setIndex(new THREE.BufferAttribute(new Uint16Array(indexes), 1));
        return geom;
    }
}

const m = new Main();
m.init();
