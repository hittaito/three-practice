uniform sampler2D uHeight;
uniform vec2 uMouse;

in vec2 vUv;
out vec4 outColor;

void main() {
  vec4 height = texture(uHeight, vUv);

  float strength = smoothstep(.95, 1.,1. - length(uMouse - vUv)*3.);

  height.r += strength * 1.;
  outColor = vec4(height);
}