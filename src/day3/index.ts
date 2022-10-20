import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import cVert from './glsl/common.vert';
import gFrag1 from './glsl/gauss1.frag';
import gFrag2 from './glsl/gauss2.frag';

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    offScreen: THREE.WebGLRenderTarget;
    control: OrbitControls;

    gauss: GaussEffect;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            innerWidth / innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 5);
        this.camera.lookAt(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setSize(innerWidth, innerHeight);
        this.control = new OrbitControls(this.camera, this.renderer.domElement);
        document.body.appendChild(this.renderer.domElement);

        this.offScreen = new THREE.WebGLRenderTarget(innerWidth, innerHeight);

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0.8, 1, 0.1);
        this.scene.add(light);
        const amb = new THREE.AmbientLight(0x333333);
        this.scene.add(amb);

        const geom = new THREE.BoxGeometry(1, 2, 3);
        const mat = new THREE.MeshLambertMaterial({ color: 0x9922ee });
        this.scene.add(new THREE.Mesh(geom, mat));

        this.gauss = new GaussEffect();
        this.gauss.init();
        this.render();
    }
    render() {
        this.renderer.setRenderTarget(this.offScreen);
        this.renderer.render(this.scene, this.camera);

        this.gauss.render(this.renderer, this.offScreen.texture, null);

        requestAnimationFrame(() => this.render());
    }
}
class GaussEffect {
    buffers: THREE.WebGLRenderTarget[];
    camera: THREE.OrthographicCamera;
    scene1: THREE.Scene;
    scene2: THREE.Scene;

    m1: THREE.RawShaderMaterial;
    m2: THREE.RawShaderMaterial;
    init() {
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        const buffer = new THREE.WebGLRenderTarget(
            innerWidth / 4,
            innerHeight / 4
        );
        buffer.texture.type = THREE.FloatType;
        buffer.texture.minFilter = THREE.NearestFilter;
        buffer.texture.magFilter = THREE.NearestFilter;
        this.buffers = [buffer, buffer.clone()];

        this.scene1 = new THREE.Scene();
        this.scene2 = new THREE.Scene();

        const g = new THREE.PlaneGeometry(2, 2);
        this.m1 = new THREE.RawShaderMaterial({
            vertexShader: cVert,
            fragmentShader: gFrag1,
            uniforms: {
                img: { value: null },
            },
            glslVersion: THREE.GLSL3,
        });
        this.scene1.add(new THREE.Mesh(g, this.m1));

        this.m2 = new THREE.RawShaderMaterial({
            vertexShader: cVert,
            fragmentShader: gFrag2,
            uniforms: {
                img: { value: null },
                horizontal: { value: false },
                steps: { value: 1 },
            },
            glslVersion: THREE.GLSL3,
        });
        this.scene2.add(new THREE.Mesh(g, this.m2));
    }
    render(
        renderer: THREE.WebGLRenderer,
        texture: THREE.Texture,
        target: THREE.WebGLRenderTarget | null
    ) {
        renderer.setRenderTarget(this.buffers[1]);
        this.m1.uniforms.img.value = texture;
        renderer.render(this.scene1, this.camera);

        let idx = 0;
        for (let i = 0; i < 8; i++) {
            const idx = i % 2;
            renderer.setRenderTarget(this.buffers[idx]);
            this.m2.uniforms.img.value = this.buffers[1 - idx].texture;
            this.m2.uniforms.horizontal.value = idx === 0;
            renderer.render(this.scene2, this.camera);
        }

        renderer.setRenderTarget(target);
        this.m1.uniforms.img.value = this.buffers[idx].texture;
        renderer.render(this.scene1, this.camera);
    }
}

const m = new Main();
m.init();
