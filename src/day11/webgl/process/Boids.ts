import WebGL from '../Webgl';
import * as THREE from 'three';
import initVert from '../../glsl/init.vert';
import initFrag from '../../glsl/init.frag';
import updateVert from '../../glsl/update.vert';
import updateFrag from '../../glsl/update.frag';
import { FloatType } from 'three';

export class Boids {
    targets: THREE.WebGLMultipleRenderTargets[];
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
    flag = 0;
    constructor(count: number) {
        const SIZE = Math.sqrt(count);
        const webgl = new WebGL();
        const debug = webgl.debug;
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        this.targets = [
            new THREE.WebGLMultipleRenderTargets(SIZE, SIZE, 2, {
                type: THREE.FloatType,
            }),
            new THREE.WebGLMultipleRenderTargets(SIZE, SIZE, 2, {
                type: FloatType,
            }),
        ];
        const geom = new THREE.PlaneGeometry(2, 2);
        const initMat = new THREE.ShaderMaterial({
            vertexShader: initVert,
            fragmentShader: initFrag,
            glslVersion: THREE.GLSL3,
        });
        const init = new THREE.Mesh(geom, initMat);
        this.renderer.setRenderTarget(this.writeBuffer);
        this.renderer.render(init, this.camera);
        this.flag = 1 - this.flag;

        // update
        const updateMat = new THREE.ShaderMaterial({
            vertexShader: updateVert,
            fragmentShader: updateFrag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uTime: { value: 0 },
                uPosition: { value: null },
                uVelocity: { value: null },
                uSeparate: { value: 0.2 },
                uAlign: { value: 0.2 },
                uCohens: { value: 0.2 },
                uForce: { value: 0.2 },
            },
        });
        this.mesh = new THREE.Mesh(geom, updateMat);

        if (debug.ui) {
            debug.ui
                .add(updateMat.uniforms.uTime, 'value', 0, 100, 0.1)
                .name('test');
            debug.ui
                .add(updateMat.uniforms.uSeparate, 'value', 0, 2, 0.001)
                .name('separate');
            debug.ui
                .add(updateMat.uniforms.uAlign, 'value', 0, 2, 0.001)
                .name('align');
            debug.ui
                .add(updateMat.uniforms.uCohens, 'value', 0, 2, 0.001)
                .name('cohens');
            debug.ui
                .add(updateMat.uniforms.uForce, 'value', 0, 3, 0.001)
                .name('force');
        }
    }
    get readBuffer() {
        return this.targets[this.flag];
    }
    get writeBuffer() {
        return this.targets[1 - this.flag];
    }

    render() {
        this.renderer.setRenderTarget(this.writeBuffer);
        // this.mesh.material.uniforms.uTime.value += 1;
        this.mesh.material.uniforms.uPosition.value =
            this.readBuffer.texture[0];
        this.mesh.material.uniforms.uVelocity.value =
            this.readBuffer.texture[1];
        this.renderer.render(this.mesh, this.camera);
        this.flag = 1 - this.flag;
        this.renderer.setRenderTarget(null);
    }
}
