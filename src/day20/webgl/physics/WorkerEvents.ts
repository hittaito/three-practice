export interface I3ToC {
    delay: number;
    force: vec3 | null;
}

export interface ICTo3 {
    box: {
        position: vec3;
        quaternion: vec4;
    };
}
export interface vec3 {
    x: number;
    y: number;
    z: number;
}
export interface vec4 {
    x: number;
    y: number;
    z: number;
    w: number;
}
