
in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 uv = vUv;
    uv = mod(uv*30.,1.);
    oColor = vec4(uv,.0, 1.);
}