import * as THREE from 'three';
import * as webfont from 'webfontloader';
import mFrag from './glsl/main.frag';
import mVert from './glsl/main.vert';
import tFrag1 from './glsl/text1.frag';
import tFrag2 from './glsl/text2.frag';
import tFrag3 from './glsl/text3.frag';

// ref https://qiita.com/uctakeoff/items/387f2271befb81734d18

const SIZE = 512 * 2;

class Main {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;

    sdf: SDFTexture;
    t: THREE.CanvasTexture;

    panel: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.RawShaderMaterial>;

    renderer: THREE.WebGLRenderer;
    init() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
        this.renderer = new THREE.WebGLRenderer({ alpha: false });
        this.renderer.setSize(innerWidth, innerHeight);
        document.body.appendChild(this.renderer.domElement);

        const texture = new TextTexture();
        texture.loadfont().then(() => {
            this.setUp(texture);
        });

        setInterval(() => {
            const n = Math.floor(Math.random() * 10) + 4;
            const str = 'あいうえおかきくけこさしすせそ漢字カッコイイ';
            const text = Array.from(Array(n))
                .map(() => str[Math.floor(Math.random() * str.length)])
                .join('');
            texture.update(text);
        }, 1000);
    }
    setUp(texture: TextTexture) {
        texture.text = 'あいうえおかきくけこさしすせそた';

        this.sdf = new SDFTexture();
        this.sdf.init(texture.texture);
        const geom = new THREE.PlaneBufferGeometry(10, 10);
        const mat = new THREE.RawShaderMaterial({
            fragmentShader: mFrag,
            vertexShader: mVert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                img: { value: this.sdf.target.texture },
            },
        });
        this.panel = new THREE.Mesh(geom, mat);
        this.scene.add(this.panel);

        this.render();
    }
    render() {
        this.sdf.update(this.renderer);

        this.panel.material.uniforms.img.value = this.sdf.target.texture;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.render());
    }
}
class SDFTexture {
    scene1: THREE.Scene;
    scene2: THREE.Scene;
    scene3: THREE.Scene;

    mesh1: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.RawShaderMaterial>;
    mesh2: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.RawShaderMaterial>;
    mesh3: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.RawShaderMaterial>;
    camera: THREE.OrthographicCamera;

    t: THREE.CanvasTexture;

    mrts: THREE.WebGLMultipleRenderTargets[];
    target: THREE.WebGLRenderTarget;
    init(texture: THREE.CanvasTexture) {
        this.t = texture;
        this.scene1 = new THREE.Scene();
        this.scene2 = new THREE.Scene();
        this.scene3 = new THREE.Scene();

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10);
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);

        this.mrts = [new THREE.WebGLMultipleRenderTargets(SIZE, SIZE, 2), new THREE.WebGLMultipleRenderTargets(SIZE, SIZE, 2)];
        this.mrts.forEach((target) => {
            target.texture.forEach((texture) => {
                texture.minFilter = THREE.NearestFilter;
                texture.magFilter = THREE.NearestFilter;
                texture.type = THREE.FloatType;
            });
        });
        this.target = new THREE.WebGLRenderTarget(SIZE, SIZE);

        const geom = new THREE.PlaneBufferGeometry(2, 2);
        const mat1 = new THREE.RawShaderMaterial({
            fragmentShader: tFrag1,
            vertexShader: mVert,
            uniforms: {
                img: { value: texture },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh1 = new THREE.Mesh(geom, mat1);
        this.scene1.add(this.mesh1);

        const mat2 = new THREE.RawShaderMaterial({
            fragmentShader: tFrag2,
            vertexShader: mVert,
            uniforms: {
                img1: { value: null },
                img2: { value: null },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh2 = new THREE.Mesh(geom, mat2);
        this.scene2.add(this.mesh2);

        const mat3 = new THREE.RawShaderMaterial({
            fragmentShader: tFrag3,
            vertexShader: mVert,
            uniforms: {
                img1: { value: null },
                img2: { value: null },
            },
            glslVersion: THREE.GLSL3,
        });
        this.mesh3 = new THREE.Mesh(geom, mat3);
        this.scene3.add(this.mesh3);
    }

    update(renderer: THREE.WebGLRenderer) {
        renderer.setSize(SIZE, SIZE);
        renderer.setRenderTarget(this.mrts[0]);
        renderer.render(this.scene1, this.camera);

        let idx = 0;
        for (let i = 0; i < 12; i++) {
            idx = i % 2;
            renderer.setRenderTarget(this.mrts[1 - idx]);
            this.mesh2.material.uniforms.img1.value = this.mrts[idx].texture[0];
            this.mesh2.material.uniforms.img2.value = this.mrts[idx].texture[1];
            renderer.render(this.scene2, this.camera);
        }

        renderer.setRenderTarget(this.target);
        this.mesh3.material.uniforms.img1.value = this.mrts[1 - idx].texture[0];
        this.mesh3.material.uniforms.img2.value = this.mrts[1 - idx].texture[1];
        renderer.render(this.scene3, this.camera);

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setRenderTarget(null);
    }
}
class TextTexture {
    context: CanvasRenderingContext2D;
    texture: THREE.CanvasTexture;

    _text: string = '';
    get text() {
        return this._text;
    }
    set text(t: string) {
        this._text = t;
        if (this.context) {
            this.update(t);
        }
    }
    constructor() {
        this.init();
    }
    init() {
        const canvas = document.createElement('canvas');
        canvas.width = SIZE;
        canvas.height = SIZE;
        this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.context.fillStyle = '#329827';
        this.context.fillRect(0, 0, SIZE, SIZE);
        this.texture = new THREE.CanvasTexture(canvas);
    }
    update(text: string) {
        const fontSize = SIZE / Math.ceil(Math.sqrt(text.length));

        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, SIZE, SIZE);
        this.context.font = `bold ${fontSize * 0.8}px \'Noto Sans JP\'`;
        this.context.textAlign = 'center';
        this.context.fillStyle = '#ffffff';
        text.split('').forEach((c, i) => {
            const x = (i % (SIZE / fontSize)) * fontSize + fontSize / 2;
            const y = Math.floor(i / (SIZE / fontSize)) * fontSize + fontSize * 0.9;
            this.context.fillText(c, x, y, fontSize);
        });
        this.texture.needsUpdate = true;
    }
    loadfont() {
        return new Promise((resolve) => {
            webfont.load({
                google: {
                    families: ['Noto+Sans+JP:700'],
                },
                active: () => resolve(null),
            });
        });
    }
}

const m = new Main();
m.init();
