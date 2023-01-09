import * as THREE from 'three';
import vert from '../../glsl/voronoi.vert';
import frag from '../../glsl/voronoi.frag';
import gsap from 'gsap';
import { Body } from 'cannon-es';
import { Delaunay, Voronoi } from 'd3-delaunay';
import { ShapeType, threeToCannon } from 'three-to-cannon';
import WebGL from '../Webgl';
const WIDTH = 2;
const HEIGHT = 2;
const POINTs = 100;
export default class VoronoiBox {
    scene: THREE.Scene;

    items: {
        mesh: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>;
        body: Body;
        origin: {
            position: THREE.Vector3;
            quaternion: THREE.Quaternion;
        };
    }[] = [];
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene3;

        const points: ArrayLike<Delaunay.Point> = [...new Array(POINTs)].map(
            () => [Math.random() * WIDTH, Math.random() * HEIGHT]
        );
        const delaunay = Delaunay.from(points);
        const voronoi = delaunay.voronoi([0, 0, WIDTH, HEIGHT]);

        let i = 0;
        const polygons: [number, number][][] = [];
        while (true) {
            const polygon = voronoi.cellPolygon(i);
            if (polygon[0][0] == null) break;
            i++;
            polygons.push(polygon);
        }

        const mat = new THREE.ShaderMaterial({
            vertexShader: vert,
            fragmentShader: frag,
            glslVersion: THREE.GLSL3,
            uniforms: {
                uMap: { value: null },
                uMatrix: { value: null },
                uOpacity: { value: 1 },
            },
            side: THREE.DoubleSide,
            opacity: 0,
            transparent: true,
            wireframe: false,
        });

        polygons.forEach((polygon) => {
            polygon.shift()!;

            const gInfo = this.makeGeom(polygon);
            const mesh = new THREE.Mesh(gInfo.geom, mat);
            mesh.position.x += gInfo.x - WIDTH / 2;
            mesh.position.y += gInfo.y - HEIGHT / 2;
            this.scene.add(mesh);

            const shape = threeToCannon(mesh, { type: ShapeType.HULL })!.shape; // warning too heavy
            // const shape = threeToCannon(mesh)!.shape;

            const body = new Body({ mass: 1 });
            body.addShape(shape);
            body.angularVelocity.set(3, 2, gInfo.y);
            body.angularDamping = 0.8;
            webgl.physics.addBody(body);
            this.items.push({
                mesh: mesh,
                body,
                origin: {
                    position: mesh.position.clone(),
                    quaternion: mesh.quaternion.clone(),
                },
            });
        });
        this.apply();
    }
    setTexture(texture: THREE.Texture) {
        this.items.forEach((item) => {
            item.mesh.material.uniforms.uMap.value = texture;
        });
    }
    update() {
        this.items.forEach((item) => {
            item.mesh.position.set(
                item.body.position.x,
                item.body.position.y,
                item.body.position.z
            );
            item.mesh.quaternion.set(
                item.body.quaternion.x,
                item.body.quaternion.y,
                item.body.quaternion.z,
                item.body.quaternion.w
            );
        });
    }
    reset() {
        this.items.forEach((item) => {
            item.mesh.position.set(
                item.origin.position.x,
                item.origin.position.y,
                item.origin.position.z
            );
            item.mesh.quaternion.set(
                item.origin.quaternion.x,
                item.origin.quaternion.y,
                item.origin.quaternion.z,
                item.origin.quaternion.w
            );
            item.body.velocity.setZero();
            item.body.position.set(
                item.mesh.position.x,
                item.mesh.position.y,
                item.mesh.position.z
            );
            item.body.quaternion.set(
                item.mesh.quaternion.x,
                item.mesh.quaternion.y,
                item.mesh.quaternion.z,
                item.mesh.quaternion.w
            );
        });
    }
    start(x: number, y: number) {
        this.items.forEach((item) => {
            item.body.velocity.setZero();
            const pos = item.mesh.position;
            console.log(pos.x - x, pos.y - y);
            const m = 100;

            item.body.angularDamping = 1;
            item.body.angularVelocity.set((pos.x - x) * m, (pos.y - y) * m, 0);
        });
    }
    apply() {
        this.items.forEach((item) => {
            item.body.position.set(
                item.mesh.position.x,
                item.mesh.position.y,
                item.mesh.position.z
            );
            item.body.quaternion.set(
                item.mesh.quaternion.x,
                item.mesh.quaternion.y,
                item.mesh.quaternion.z,
                item.mesh.quaternion.w
            );
        });
    }
    makeGeom(points: number[][]) {
        const geom = new THREE.BufferGeometry();
        const pos: number[] = [];
        const uv: number[] = [];
        const index: number[] = [];
        const THICKNESS = 0.01;

        const num = points.length;

        // gravity point
        const sum = points.reduce((p, c) => [p[0] + c[0], p[1] + c[1]], [0, 0]);
        const x = sum[0] / num;
        const y = sum[1] / num;

        // backside
        points.forEach((p) => {
            pos.push(p[0] - x, p[1] - y, -THICKNESS);
            uv.push(p[0] / WIDTH, p[1] / HEIGHT);
        });
        //frontside
        points.forEach((p) => {
            pos.push(p[0] - x, p[1] - y, THICKNESS);
            uv.push(p[0] / WIDTH, p[1] / HEIGHT);
        });

        // back
        for (let i = 1; i < num - 1; i++) {
            index.push(0, i, i + 1);
        }
        //front
        for (let i = 1; i < num - 1; i++) {
            index.push(0 + num, i + num, num + i + 1);
        }
        // side
        for (let i = 0; i < num; i++) {
            const a = i;
            const b = (i + 1) % num;
            index.push(a, b, a + num);
            index.push(b, b + num, a + num);
        }
        geom.setAttribute(
            'position',
            new THREE.BufferAttribute(new Float32Array(pos), 3)
        );
        geom.setAttribute(
            'uv',
            new THREE.BufferAttribute(new Float32Array(uv), 2)
        );
        geom.setIndex(index);
        return { geom, x, y };
    }

    // debug
    renderVoronoi(voronoi: Voronoi<Delaunay.Point>) {
        const canvas = document.createElement('canvas')!;
        document.body.appendChild(canvas);
        canvas.style.backgroundColor = '#ccc';
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        const ctx = canvas.getContext('2d')!;
        ctx.beginPath();
        voronoi.render(ctx);
        ctx.lineWidth = 0.25;
        ctx.strokeStyle = '#ff0000';
        ctx.fillStyle = '#ffff33';
        ctx.stroke();
    }
}
