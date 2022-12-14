import * as THREE from 'three';
import frag from '../../glsl/heightMap.frag';
import vert from '../../glsl/heightMap.vert';
import mouse from '../../glsl/mouse.frag';
import WebGL from '../Webgl';

export class HeightMap {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    targets: THREE.WebGLRenderTarget[];
    readIndex = 0;
    first: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    second: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        const SIZE = 1024;
        const WIDTH = SIZE; // webgl.size.width * Math.min(2, window.devicePixelRatio)
        const HEIGHT = SIZE; // webgl.size.height * Math.min(2, window.devicePixelRatio),
        this.targets = [
            new THREE.WebGLRenderTarget(WIDTH, HEIGHT, {
                type: THREE.FloatType,
            }),
            new THREE.WebGLRenderTarget(WIDTH, HEIGHT, {
                type: THREE.FloatType,
            }),
        ];
        this.targets.forEach((target) => {
            target.texture.minFilter = THREE.NearestFilter;
            target.texture.magFilter = THREE.NearestFilter;
        });

        const geom = new THREE.PlaneGeometry(2, 2);

        const mat1 = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: mouse,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
                uHeight: { value: null },
                uMouse: {
                    value: new THREE.Vector2(webgl.mouse.x, webgl.mouse.y),
                },
            },
        });
        this.first = new THREE.Mesh(geom, mat1);

        const mat2 = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
                uHeight: { value: null },
            },
        });
        this.second = new THREE.Mesh(geom, mat2);
    }
    get target() {
        return this.targets[this.readIndex];
    }
    get invTarget() {
        return this.targets[1 - this.readIndex];
    }
    render() {
        this.renderer.setRenderTarget(this.invTarget);
        this.first.material.uniforms.uHeight.value = this.target.texture;
        this.first.material.uniforms.uTime.value += 1;
        this.renderer.render(this.first, this.camera);
        this.readIndex = 1 - this.readIndex;

        this.renderer.setRenderTarget(this.invTarget);
        this.second.material.uniforms.uHeight.value = this.target.texture;
        this.renderer.render(this.second, this.camera);
        this.readIndex = 1 - this.readIndex;
    }
    updateMouse(x: number, y: number) {
        this.first.material.uniforms.uMouse.value = new THREE.Vector2(x, y);
    }
}
