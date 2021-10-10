
precision highp float;

#define INSIDE 32.
#define OUTSIDE 32.

uniform sampler2D img1;
uniform sampler2D img2;


in vec2 vUv;

out vec4 outColor;

void main() {
    float inside = texture(img1, vUv).z;
    float outside = texture(img2, vUv).z;

    float dist =  (clamp(inside / INSIDE, .0, 1.) - clamp(outside / OUTSIDE, .0, 1.)) ;

    outColor = vec4(clamp(dist, 0.,1.));
}