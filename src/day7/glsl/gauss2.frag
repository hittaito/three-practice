precision highp float;

uniform sampler2D img;
uniform bool horizontal;
uniform int steps;

in vec2 vUv;

out vec4 oColor;

const float[5] w = float[](0.2270270, 0.1945945, 0.1216216, 0.0540540, 0.0162162);

ivec2 clampCoord(ivec2 coord, ivec2 size) {
    return max(min(coord, size - 1), 0);
}

void main(void) {
    ivec2 texSize = ivec2(gl_FragCoord.xy);
    ivec2 size = textureSize(img, 0);
    vec3 sum = w[0] * texelFetch(img, texSize, 0).rgb;
    for (int i = 1; i < 5; i++) {
        ivec2 offset = (horizontal ? ivec2(i, 0) : ivec2(0, i)) * steps;
        sum += w[i] * texelFetch(img, clampCoord(texSize + offset, size), 0).rgb;
        sum += w[i] * texelFetch(img, clampCoord(texSize - offset, size), 0).rgb;
  }
    oColor = vec4(sum,1.);
}