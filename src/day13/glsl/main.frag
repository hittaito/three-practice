
in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec2 uv = vUv;
    uv.x *= 8.;
    vec2 grid = fract(uv * 10.);
    oColor = vec4(grid,.0, 1.);
}