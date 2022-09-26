
uniform samplerCube uCubeImg;

in vec3 vReflect;
in vec3 vRefract[3];
in float vReflectionFactor;

out vec4 oColor;

void main() {

    vec4 reflectedColor = textureCube( uCubeImg, vec3( -vReflect.x, vReflect.yz ) );
    vec4 refractedColor = vec4( 1.0 );

    refractedColor.r = textureCube( uCubeImg, vec3( vRefract[0].x, vRefract[0].yz ) ).r;
    refractedColor.g = textureCube( uCubeImg, vec3( vRefract[1].x, vRefract[1].yz ) ).g;
    refractedColor.b = textureCube( uCubeImg, vec3( vRefract[2].x, vRefract[2].yz ) ).b;

    oColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );
    //  oColor = vec4(1.,0.,0.,1.);//reflectedColor;
}  