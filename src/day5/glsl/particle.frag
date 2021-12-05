uniform sampler2D uMaskTexture;
uniform vec3 uColor;

void main() {
    vec4 fboColor = texture2D(uMaskTexture, gl_PointCoord);
    gl_FragColor = vec4(uColor, fboColor.r);//vec4(1.,0.,0.,1.);
}