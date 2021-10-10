import * as THREE from 'three';
import frag from './glsl/main.frag';
import vert from './glsl/main.vert';

// image https://pixabay.com/ja/users/jplenio-7645255/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3294681

// ref https://www.youtube.com/watch?v=ivg603bYDk8

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;

    nImage = 10;

    speed = 0;
    position = 0;
    rounded = 0;

    touch = 0;

    meshes: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.RawShaderMaterial>[] = [];
    group: THREE.Group;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 4);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(innerWidth, innerHeight);

        document.getElementById('container')?.appendChild(this.renderer.domElement);

        this.handleImages();

        this.registerEvent();

        this.render(0);
    }
    render(time: number) {
        this.position += this.speed;

        this.speed *= 0.8;

        const angle = (Math.PI * 2) / this.nImage;
        let diff = this.position % angle;
        if (diff > 0) {
            diff = diff > angle / 2 ? angle - diff : -diff;
        } else {
            diff = Math.abs(diff) > angle / 2 ? angle + diff : -diff;
        }
        this.position += diff * 0.05;
        this.position = this.treatPI(this.position);

        this.group.rotation.x = this.position;

        this.meshes.forEach((m, i) => {
            m.material.uniforms.time.value = time;
            m.material.uniformsNeedUpdate = true;

            const t = angle * i;
            const delta = Math.abs(this.position - t);
            const alpha = Math.min(delta, Math.PI * 2 - delta) / Math.PI;
            const scale = Math.max(Math.exp((-alpha * alpha) / 0.03), 0.4);
            m.material.uniforms.alpha.value = scale;
            m.scale.set(scale, scale, scale);
        });
        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => this.render(time + 1));
    }
    treatPI(x: number) {
        if (x > 2 * Math.PI) return x - 2 * Math.PI;
        if (x < 0) return x + 2 * Math.PI;
        return x;
    }
    handleImages() {
        const mat = new THREE.RawShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            side: THREE.DoubleSide,
            glslVersion: THREE.GLSL3,
            uniforms: {
                img: { value: null },
                time: { value: 0 },
                alpha: { value: 1 },
            },
        });
        const group = new THREE.Group();
        const url1 = 'https://dl.dropbox.com/s/bvpvd7798iyggz7/img3.jpg?dl=0';
        const url2 = 'https://dl.dropbox.com/s/qsavljlq56etuvd/img2.jpg?dl=0';
        for (let i = 0; i < this.nImage; i++) {
            const cMat = mat.clone();
            cMat.uniforms.img.value = new THREE.TextureLoader().load(i % 2 === 0 ? url1 : url2);
            cMat.uniformsNeedUpdate = true;
            const geo = new THREE.PlaneBufferGeometry(1.5, 1, 20, 20);
            const mesh = new THREE.Mesh(geo, cMat);

            mesh.position.y = 2 * Math.sin(2 * Math.PI * (i / this.nImage));
            mesh.position.z = 2 * Math.cos(2 * Math.PI * (i / this.nImage));
            mesh.rotation.x = -2 * Math.PI * (i / this.nImage);
            group.add(mesh);
            this.scene.add(group);
            this.meshes.push(mesh);
        }
        this.group = group;
    }
    registerEvent() {
        window.addEventListener('wheel', (e) => {
            this.speed += e.deltaY * 0.0004;
        });
        window.addEventListener('touchmove', (e) => {
            const d = e.targetTouches[0].clientY - this.touch;
            this.speed += d * 0.0004;
            this.touch = e.targetTouches[0].clientY;
        });
        window.addEventListener('resize', () => {
            this.renderer.setSize(innerWidth, innerHeight);
            this.renderer.setPixelRatio(window.devicePixelRatio);

            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        });
    }
}

const m = new Main();
m.init();
