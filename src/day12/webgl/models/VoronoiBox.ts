import * as THREE from 'three';
import { Body } from 'cannon-es';
import { Delaunay, Voronoi } from 'd3-delaunay';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { threeToCannon } from 'three-to-cannon';
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

            let x = 0;
            let y = 0;
            polygon.forEach((point) => {
                tShape.lineTo(point[0], point[1]);
                x += point[0];
                y += point[1];
            });

            x /= polygon.length;
            y /= polygon.length;
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
                        position[i] - x,
                        position[i + 2],
                        position[i + 1] - y
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
            mesh.position.x += x;
            mesh.position.z += y;
            this.scene.add(mesh);

            // const shape = threeToCannon(mesh, { type: ShapeType.HULL })!.shape; // too heavy
            const shape = threeToCannon(mesh)!.shape;

            const body = new Body({ mass: 1 });
            body.addShape(shape);
            body.angularVelocity.set(3, 2, y);
            body.angularDamping = 0.8;
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
