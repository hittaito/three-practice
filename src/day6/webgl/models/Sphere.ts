import WebGL from '../Webgl';
import * as THREE from 'three';
import frag from '../../glsl/main.frag';
import vert from '../../glsl/main.vert';
import Debug from '../Debug';

export default class Sphere {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.SphereGeometry, THREE.ShaderMaterial>;
    target: { x: number; y: number } = { x: 0, y: 0 };
    debug: Debug;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        console.log(webgl.debug);

        this.debug = webgl.debug;
        this.setUp();
    }
    setUp() {
        const geom = new THREE.SphereGeometry(0.7, 32, 32);
        const mat = new THREE.ShaderMaterial({
            fragmentShader: frag,
            vertexShader: vert,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uCubeImg: { value: null },
                uRefractionRatio: { value: 1.05 },
                uFresnelBias: { value: 0 },
                uFresnelScale: { value: 0.7 },
                uFresnelPower: { value: 1 },
            },
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.scene.add(this.mesh);

        console.log(this.debug);

        if (this.debug.status === 'ON') {
            console.log('on');

            const folder = this.debug.ui.addFolder('fresnel');
            folder
                .add(mat.uniforms.uRefractionRatio, 'value', 1, 1.1, 0.0001)
                .name('refractionRatio');
            folder
                .add(mat.uniforms.uFresnelBias, 'value', 0, 4, 0.001)
                .name('fresnelBias');
            folder
                .add(mat.uniforms.uFresnelScale, 'value', 0, 2, 0.001)
                .name('fresnelScale');
            folder
                .add(mat.uniforms.uFresnelPower, 'value', 0, 5, 0.001)
                .name('fresnelPower');
        }
    }
    setImage(img: THREE.CubeTexture) {
        this.mesh.material.uniforms.uCubeImg.value = img;
    }
    update() {
        const currentX = this.mesh.position.x;
        const currentY = this.mesh.position.y;
        this.mesh.position.x += (this.target.x - currentX) * 0.1;
        this.mesh.position.y += (this.target.y - currentY) * 0.1;
    }
    moveSphere(x: number, y: number) {
        this.target.x = x;
        this.target.y = y;
    }
}
