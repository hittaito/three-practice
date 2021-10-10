
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

in vec3 position;
in vec2 uv;

out vec2 vUv;

float PI = 3.1415;

void main() {
    vUv = uv;
    vec3 pos = position;
    pos.y += sin(PI *uv.x)* .01;
    pos.z += sin(PI *uv.x)* .02;


    pos.y += sin(time * .02) * .04;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}