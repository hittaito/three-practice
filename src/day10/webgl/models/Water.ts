import * as THREE from 'three';
import frag from '../../glsl/water.frag';
import vert from '../../glsl/water.vert';
import WebGL from '../Webgl';
export default class Water {
    scene: THREE.Scene;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const geom = new THREE.PlaneGeometry(2, 2, 512, 512);
        const mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            side: THREE.DoubleSide,
            uniforms: {
                uHeightMap: { value: null },
                uCube: { value: null },
            },
        });
        this.mesh = new THREE.Mesh(geom, mat);
        this.mesh.rotateX(-Math.PI * 0.5);
        this.scene.add(this.mesh);
    }
    setCube(texture: THREE.CubeTexture) {
        this.mesh.material.uniforms.uCube.value = texture;
    }
    update(texture: THREE.Texture) {
        this.mesh.material.uniforms.uHeightMap.value = texture;
    }
}
