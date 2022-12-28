import * as THREE from 'three';
import { Body, Trimesh } from 'cannon-es';
import { Delaunay, Voronoi } from 'd3-delaunay';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import WebGL from '../Webgl';
const WIDTH = 3;
const HEIGHT = 3;
export default class VoronoiBox {
    scene: THREE.Scene;

    items: {
        mesh: THREE.Mesh;
        body: Body;
    }[] = [];
    constructor() {
        const webgl = new WebGL();
        this.scene = webgl.scene;

        const points: ArrayLike<Delaunay.Point> = [...new Array(30)].map(() => [
            Math.random() * WIDTH,
            Math.random() * HEIGHT,
        ]);
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

        polygons.forEach((polygon) => {
            const tShape = new THREE.Shape();
            const first = polygon.shift()!;
            tShape.moveTo(first[0], first[1]);

            polygon.forEach((point) => {
                tShape.lineTo(point[0], point[1]);
            });
            const excludeGeom = new THREE.ExtrudeGeometry(tShape, {
                steps: 1,
                depth: 0.1,
                bevelEnabled: false,
            });
            const position = excludeGeom.getAttribute('position').array;
            const points: THREE.Vector3[] = [];
            for (let i = 0; i < position.length; i += 3) {
                points.push(
                    new THREE.Vector3(
                        position[i],
                        position[i + 1],
                        position[i + 2]
                    )
                );
            }
            const geom = new ConvexGeometry(points);
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(
                    Math.random(),
                    Math.random(),
                    Math.random()
                ),
                wireframe: false,
            });
            const mesh = new THREE.Mesh(geom, mat);
            // mesh.rotateX(-Math.PI * 0.5);
            this.scene.add(mesh);

            console.log(geom);
            const shape = this.CreateTrimesh(geom);

            const body = new Body({ mass: 1 });
            body.addShape(shape);
            webgl.physics.addBody(body);
            this.items.push({ mesh, body });
        });
        this.apply();
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
    CreateTrimesh(geometry: THREE.BufferGeometry): Trimesh {
        let vertices;
        if (geometry.index === null) {
            vertices = geometry.attributes.position.array as number[];
        } else {
            vertices = geometry.clone().toNonIndexed().attributes.position
                .array as number[];
        }
        const indices = Object.keys(vertices).map(Number);
        return new Trimesh(vertices, indices);
    }

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
