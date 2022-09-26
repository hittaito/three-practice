
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

in vec3 position;
in vec3 prevPos;
in vec3 nextPos;
in float sign;

void main() {
    vec4 wPos = modelMatrix * vec4(position, 1.);
    vec4 pwPos = modelMatrix * vec4(prevPos, 1.);
    vec4 nwPos = modelMatrix * vec4(nextPos, 1.);

    vec3 prevDir = wPos.xyz - pwPos.xyz;
    prevDir = length(prevDir) > 1e-8 ? normalize(prevDir) : vec3(0.);
    vec3 nextDir = nwPos.xyz - wPos.xyz;
    nextDir = length(nextDir) > 1e-8 ? normalize(nextDir) : vec3(0.);

    vec3 posDir = prevDir + nextDir;
    vec3 viewDir = cameraPosition - wPos.xyz;
    vec3 norm = cross(viewDir, posDir);
    norm = length(norm) > 1e-8 ? normalize(norm) : vec3(0.);
    wPos.xyz += .5 * sign * norm;

    gl_Position = projectionMatrix * viewMatrix * wPos;
}