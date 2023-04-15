uniform float uTime;

in vec2 vUv;

out vec4 oColor;

// ref
// https://codepen.io/vizauz/pen/ZYaago

void main(void) {
    float time = uTime * .007;
    vec2 xy = vUv * 2. - .1;
    vec3 col = vec3(0);
    float scale = 3.;

    float p = 
        sin(distance(vec2(xy.x + time, xy.y), vec2(.4, .8)) * scale)
        + sin(distance(vec2(xy.x-time*.4, xy.y+time*.7), vec2(0)) * scale)
        + sin(distance(vec2(xy.x + .2,xy.y), vec2(-.6 * sin(time* .4), .2 )) * scale)
         + sin(distance(vec2(xy.x * 1.2,xy.y-.2), vec2(.2 * sin(time), .5 * cos(time))) * scale);
    col += vec3(.5*.5*sin(p), cos(p), cos(p)-sin(p)) + .1;

    oColor = vec4(col, length(col));
}