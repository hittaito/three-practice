/**
 * Full-screen textured quad shader
 */

const BasicShader = {
    uniforms: {
        tDiffuse: { value: null },
        opacity: { value: 1.0 },
        time: { value: 0 },
        scale: { value: 1 },
        progress: { value: 0 },
    },

    vertexShader: /* glsl */ `
		varying vec2 vUv;
		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

    fragmentShader: /* glsl */ `
		uniform float opacity;
		uniform sampler2D tDiffuse;
		uniform float time;
		uniform float scale;
		uniform float progress;
		varying vec2 vUv;
		void main() {
			vec2 newUV = vUv;
			vec2 p = 2. * vUv - vec2(1.);
			p += .1*cos(scale*2.*p.xy + time *.3);
			p += .3*cos(scale*3.2*p.yx + time *.11);
			p += .1*cos(scale*5.*p.yx + time *.81);
			p += .2*sin(scale*7.*p.yx + time *.21 + vec2(2., 4.));
			newUV.x = mix(vUv.x, length(p), progress);
			newUV.y = mix(vUv.y, .5, progress);
			vec4 texel = texture2D( tDiffuse, newUV );
			gl_FragColor = opacity * texel;
			//gl_FragColor = vec4(length(p), 0.,0.,1.);
		}`,
};

export { BasicShader };
