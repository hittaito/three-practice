precision highp float;

uniform sampler2D img;

in vec2 vUv;
out vec4 oColor;

void main(void) {
    vec4 col = texture(img, vUv);
    oColor = vec4(vec3(col.x),1.);//col;
}