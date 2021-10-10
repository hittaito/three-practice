#version 300 es
precision highp float;

in vec2 vTexCoord;

out vec4 oColor;

void main(void) {
    oColor = vec4(vTexCoord,.0, 1.);
}