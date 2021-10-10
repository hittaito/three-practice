precision highp float;

uniform sampler2D img;
uniform float alpha;

in vec2 vUv;
out vec4 oColor;

void main(void) {
    vec4 col = texture(img, vUv);
    float a = max(alpha, .1);
    oColor = vec4(col.xyz, a);
}