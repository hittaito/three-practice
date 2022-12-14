uniform samplerCube uCube;

in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;

out vec4 oColor;

void main(void) {
    vec3 n = vNormal;
    vec3 pos = vPosition;

    vec3 eye = normalize(pos - cameraPosition);
    vec3 refracted = normalize(refract(eye, n, .7));

    vec4 envColor = texture(uCube, refracted);

    oColor = vec4(envColor.xyz, 1.);
}