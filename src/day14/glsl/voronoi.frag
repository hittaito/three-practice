uniform sampler2D uMap;
uniform float uOpacity;

in vec2 vUv;

out vec4 oColor;

void main(void) {
    vec3 col = texture(uMap, vUv).xyz;
    oColor = vec4(col, uOpacity);
}