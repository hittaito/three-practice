uniform sampler2D uTexture;

in vec2 vUv;
in float vId;

out vec4 oColor;

void main(void) {
    vec3 col = texture(uTexture, 1. - vUv).xyz;
    oColor = vec4(col, 1.);
}