uniform sampler2D uFBOTexture;
uniform float uSize;
attribute vec2 fboUV;
// varying vec2 vUv;

void main() {
    //vUv = uv;
    vec4 fboColor = texture2D(uFBOTexture, fboUV);
    vec4 modelPostion = modelMatrix * vec4(fboColor.xyz,1.);
    vec4 viewPosition = viewMatrix * modelPostion;
    gl_Position = projectionMatrix * viewPosition;
    float lifeSize = min((1. - fboColor.a) * 10., fboColor.a * 2.);
    lifeSize = clamp(lifeSize, .0, 1.);
    gl_PointSize = uSize * lifeSize;
    gl_PointSize *= (1. / -viewPosition.z);
}