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
    constructor(count: number, history: number) {
        const webgl = new WebGL();
        const debug = webgl.debug;
        this.camera = webgl.oCamera;
        this.renderer = webgl.renderer;
        this.targets = [
            new THREE.WebGLMultipleRenderTargets(count, history, 2, {
                type: THREE.FloatType,
            }),
            new THREE.WebGLMultipleRenderTargets(count, history, 2, {
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
                uLimit: { value: 0.6 },
                uPosition: { value: null },
                uVelocity: { value: null },
                uSeparate: { value: 0.3 },
                uArea: { value: 0.05 },
                uSepareteForce: { value: 0.2 },
                uCohesionForce: { value: 0.2 },
                uAlignForce: { value: 0.8 },
            },
        });
        this.mesh = new THREE.Mesh(geom, updateMat);

        if (debug.ui) {
            debug.ui
                .add(updateMat.uniforms.uLimit, 'value', 0, 3, 0.01)
                .name('limit');
            debug.ui
                .add(updateMat.uniforms.uSeparate, 'value', 0, 2, 0.001)
                .name('separateArea');
            debug.ui
                .add(updateMat.uniforms.uArea, 'value', 0, 2, 0.001)
                .name('area');
            debug.ui
                .add(updateMat.uniforms.uSepareteForce, 'value', 0, 2, 0.001)
                .name('separate');
            debug.ui
                .add(updateMat.uniforms.uCohesionForce, 'value', 0, 3, 0.001)
                .name('chohesion');
            debug.ui
                .add(updateMat.uniforms.uAlignForce, 'value', 0, 3, 0.001)
                .name('align');
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
