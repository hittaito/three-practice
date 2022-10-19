import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';

import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { LuminosityShader } from 'three/examples/jsm/shaders/LuminosityShader';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import Cone from './models/Cone';
import SampleModel from './models/sampleModel';
import WebGL from './Webgl';
import { SobelShader } from './shader/SobelShader';
import Box from './models/Box';
import { MergeShader } from './shader/MergeShader';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import Debug from './Debug';

export default class World {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    mrt: THREE.WebGLMultipleRenderTargets;

    mainComposer: EffectComposer;
    composer2: EffectComposer;

    sample: SampleModel;
    cone: Cone;
    box: Box;
    debug: Debug;
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;
        this.camera = webgl.camera;
        this.renderer = webgl.renderer;
        this.mrt = new THREE.WebGLMultipleRenderTargets(
            webgl.size.width * Math.min(2, window.devicePixelRatio),
            webgl.size.height * Math.min(2, window.devicePixelRatio),
            2
        );
        this.mainComposer = webgl.composer;
        this.composer2 = new EffectComposer(webgl.renderer);
        this.composer2.setSize(webgl.size.width, webgl.size.height);
        this.composer2.setPixelRatio(Math.min(2, window.devicePixelRatio));
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer2.addPass(renderPass);

        this.debug = webgl.debug;

        this.setUp();
    }
    setUp() {
        this.cone = new Cone();
        this.box = new Box();

        // post process
        this.mainComposer.readBuffer.texture = this.mrt.texture[0];
        this.composer2.readBuffer.texture = this.mrt.texture[0];

        // gray pass
        const grayPass = new ShaderPass(LuminosityShader);
        this.mainComposer.addPass(grayPass);
        this.composer2.addPass(grayPass);

        // create edge
        const sobelPass1 = new ShaderPass(SobelShader);
        sobelPass1.uniforms.uColor.value = new THREE.Vector3(1, 0, 0);
        sobelPass1.uniforms.resolution.value.x =
            window.innerWidth * window.devicePixelRatio;
        sobelPass1.uniforms.resolution.value.y =
            window.innerHeight * window.devicePixelRatio;
        this.mainComposer.addPass(sobelPass1);

        const sobelPass2 = new ShaderPass(SobelShader);
        sobelPass2.uniforms.uColor.value = new THREE.Vector3(0, 0, 1);
        sobelPass2.uniforms.resolution.value.x =
            window.innerWidth * window.devicePixelRatio;
        sobelPass2.uniforms.resolution.value.y =
            window.innerHeight * window.devicePixelRatio;
        this.composer2.addPass(sobelPass2);

        // merge edge plane1
        const mergePass1 = new ShaderPass(MergeShader);
        mergePass1.uniforms.uImage.value = this.mrt.texture[1];
        this.mainComposer.addPass(mergePass1);
        this.composer2.addPass(mergePass1);

        // const smaaPass = new SMAAPass(
        //     window.innerWidth * this.renderer.getPixelRatio(),
        //     window.innerHeight * this.renderer.getPixelRatio()
        // );
        // this.mainComposer.addPass(smaaPass);

        const fxaaPass = new ShaderPass(FXAAShader);
        fxaaPass.material.uniforms.resolution.value.x =
            1 / (window.innerWidth * this.renderer.getPixelRatio());
        fxaaPass.material.uniforms.resolution.value.y =
            1 / (window.innerHeight * this.renderer.getPixelRatio());
        this.mainComposer.addPass(fxaaPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,
            0,
            0
        );

        bloomPass.renderToScreen = false;
        this.mainComposer.addPass(bloomPass);
        this.composer2.addPass(bloomPass);

        const debug = this.debug.ui.addFolder('bloom');
        debug.add(bloomPass, 'threshold', 0.0, 1);
        debug.add(bloomPass, 'strength', 0.0, 10);
        debug.add(bloomPass, 'radius', 0.0, 1);

        const mergePass = new ShaderPass(MergeShader);
        mergePass.uniforms.uImage.value = this.composer2.writeBuffer.texture;
        this.composer2.renderToScreen = false;
        this.mainComposer.addPass(mergePass);

        // const fxaa =
    }
    update() {
        this.renderer.clear();
        this.renderer.setRenderTarget(this.mrt);
        this.box.update();
        this.cone.update();
        this.box.on();
        this.cone.off();
        this.renderer.render(this.scene, this.camera);
        // this.renderer.setRenderTarget(null);
        this.composer2.render();
        // this.composer2.render();
        // this.renderer.setRenderTarget(null);

        this.renderer.clear();

        this.box.off();
        this.cone.on();
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        this.mainComposer.render();
        // this.sample.update();
    }
    resize(width: number, height: number) {
        this.composer2.setSize(width, height);
    }
}
