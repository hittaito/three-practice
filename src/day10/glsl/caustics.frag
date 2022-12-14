uniform sampler2D uHeightMap;

in vec2 vUv;
in vec3 vPosition;
in vec3 vNormal;
in vec3 vNew;
in vec3 vOld;
in float vWaterDepth;
in float vDepth;

out vec4 oColor;

void main(void) {
  float intensity = 0.;

  // if (vDepth > vWaterDepth) {
    float old = length(dFdx(vOld)) * length(dFdy(vOld));
    float new = length(dFdx(vNew)) * length(dFdy(vNew));

    float ratio;
    if (new == 0.) {
      ratio = 2.0 + 20.;
    } else {
      ratio = old/new;
    }
    intensity = ratio;
  // }

    oColor = vec4(vec3(intensity * .01), 1.);
    // oColor = vec4(vUv, .0,1.);// 
}