uniform vec2 uMouse;
uniform float uTime;
uniform float uType;

in vec2 vUv;

out vec4 outColor;

float random(vec2 uv) {
    return fract(sin(uv.x* 2134.+uv.y*732. + 4928. ) * 3202. );
}
float noise(vec2 uv) {
    vec2 gv = fract(uv);
    vec2 id = floor(uv);
    gv = gv*gv*(3. - 2.*gv);

    float n1 = random(id+vec2(0,0));
    float n2 = random(id+vec2(1,0));
    float n3 = random(id+vec2(0,1));
    float n4 = random(id+vec2(1,1));
    float x1 = mix(n1,n2,gv.x);
    float x2 = mix(n3,n4,gv.x);
    return mix(x1,x2,gv.y);
}

//	<https://www.shadertoy.com/view/4dS3Wd>
//	By Morgan McGuire @morgan3d, http://graphicscodex.com
float hash(float n) { return fract(sin(n) * 1e4); }
float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }
float noise(vec3 x) {
	const vec3 step = vec3(110, 241, 171);

	vec3 i = floor(x);
	vec3 f = fract(x);
  float n = dot(i, step);

	vec3 u = f * f * (3.0 - 2.0 * f);
	return mix(mix(mix( hash(n + dot(step, vec3(0, 0, 0))), hash(n + dot(step, vec3(1, 0, 0))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 0))), hash(n + dot(step, vec3(1, 1, 0))), u.x), u.y),
               mix(mix( hash(n + dot(step, vec3(0, 0, 1))), hash(n + dot(step, vec3(1, 0, 1))), u.x),
                   mix( hash(n + dot(step, vec3(0, 1, 1))), hash(n + dot(step, vec3(1, 1, 1))), u.x), u.y), u.z);
}

#define OCTAVES 6
float fbm (in vec3 x) {
    float value = 0.0;
    float amplitude = .5;
    float frequency = 0.;
    for (int i = 0; i < OCTAVES; i++) {
        value += amplitude * noise(x);
        x *= 2.;
        amplitude *= .5;
    }
    return value;
}
// http://www.iquilezles.org/www/articles/warp/warp.htm
float pattern(vec3 p) {
  vec3 q, r;
  q.x = fbm( p + vec3(0.0,0.0,0.0) );
  q.y = fbm( p + vec3(5.2,1.3,2.8) );

  r.x = fbm( p + 4.0*q + vec3(1.7,9.2,2.1) );
  r.y = fbm( p + 4.0*q + vec3(8.3,2.8,7.1) );

  return fbm( p + 4.0*r );
}

void main() {
  vec2 uv = vUv * 20.;
  float time = uTime * .005;
  float n = 0.;
  if(uType==0.) n = noise(vec3(uv, time));
  if(uType==1.) n = fbm(vec3(uv*.5, time*.5));
  if(uType==2.) n = pattern(vec3(uv*.2, time*.1));
  outColor = vec4(vec3(n), 1.);
}