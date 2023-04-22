#include <packing>

out vec4 outColor;

void main(){
    //  https://github.com/mrdoob/three.js/blob/master/src/renderers/shaders/ShaderChunk/packing.glsl.js
    outColor = packDepthToRGBA(gl_FragCoord.z);
}