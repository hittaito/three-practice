import * as THREE from 'three';
import frag from './glsl/main.frag';
import vert from './glsl/main.vert';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { BasicShader } from './webgl/basicShader';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';

const urls = ['/assets/img1.jpg', '/assets/img2.jpg', '/assets/img3.jpg'];

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    composer: EffectComposer;
    effect: ShaderPass;
    params: {
        progress: number;
        scale: number;
    };
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.position.set(0, 0, 3);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(innerWidth, innerHeight);
        new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        const loader = new THREE.TextureLoader();

        const geom = new THREE.PlaneBufferGeometry(1.9 / 2, 1 / 2);
        const mat = new THREE.RawShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                img: { value: null },
            },
        });
        urls.forEach((u, i) => {
            const t = loader.load(u);
            const m = mat.clone();
            m.uniforms.img.value = t;
            const mesh = new THREE.Mesh(geom, m);
            this.scene.add(mesh);
            mesh.position.x = i - 1;
            mesh.position.y = -1;
        });

        const t = new THREE.Texture();
        this.initPost();

        const gui = new GUI();
        this.params = { progress: 0, scale: 1 };
        gui.add(this.params, 'progress', 0, 1);
        gui.add(this.params, 'scale', 0, 10);
        this.render();
    }
    render() {
        //this.renderer.render(this.scene, this.camera);
        this.effect.uniforms.time.value += 0.1;
        this.effect.uniforms.progress.value = this.params.progress;
        this.effect.uniforms.scale.value = this.params.scale;

        this.composer.render();
        requestAnimationFrame(() => this.render());
    }
    initPost() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.effect = new ShaderPass(BasicShader);
        this.composer.addPass(this.effect);
    }
}

const m = new Main();
m.init();
