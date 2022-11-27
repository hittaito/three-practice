
in vec3 v_color;

out vec4 oColor;

void main(void) {
    oColor = vec4(v_color, .3);
}