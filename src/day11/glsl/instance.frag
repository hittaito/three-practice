// https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderLib/meshphysical.glsl.js
uniform vec3 diffuse;
uniform vec3 emissive;

out vec4 outColor;

#include <common>

#include <bsdfs>
#include <lights_pars_begin>
#include <lights_lambert_pars_fragment>

void main() {
  // float opacity = 1.;
  // #include <clipping_planes_fragment>
	// vec4 diffuseColor = vec4( diffuse, opacity );
  // ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
  // vec3 totalEmissiveRadiance = emissive;
  // #include <logdepthbuf_fragment>
	// #include <map_fragment>
	// #include <color_fragment>
  // #include <specularmap_fragment>
  // #include <lights_lambert_fragment>

  // // modulation
	// #include <aomap_fragment>
	// vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	// vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	// #include <transmission_fragment>

  // vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	// #ifdef USE_SHEEN
	// 	// Sheen energy compensation approximation calculation can be found at the end of
	// 	// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing
	// 	float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
	// 	outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;
	// #endif
	// #ifdef USE_CLEARCOAT
	// 	float dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );
	// 	vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
	// 	outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;
	// #endif

  // outColor = vec4( outgoingLight, diffuseColor.a );
  outColor = vec4(1, 0,0,1);
}