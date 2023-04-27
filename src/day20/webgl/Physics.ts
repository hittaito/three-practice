import * as CANNON from 'cannon-es';
import { vec3 } from './physics/WorkerEvents';

const POWER = 3;

export default class Physics {
    world: CANNON.World;

    box: CANNON.Body;
    cursor: CANNON.Body;
    constraint: CANNON.PointToPointConstraint;
    constraintState: 'move' | null = null;
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        // floor
        const plane = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(plane);
        groundBody.quaternion.setFromAxisAngle(
            new CANNON.Vec3(1, 0, 0),
            -Math.PI / 2
        );

        this.world.addBody(groundBody);

        // wall
        const dist = 8;
        const wallShape = new CANNON.Plane();
        const wallBody1 = new CANNON.Body({ mass: 0 });
        wallBody1.addShape(wallShape);
        wallBody1.position.z -= dist;
        this.world.addBody(wallBody1);
        const wallBody2 = new CANNON.Body({ mass: 0 });
        wallBody2.addShape(wallShape);
        wallBody2.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            Math.PI
        );
        wallBody2.position.z = dist;
        this.world.addBody(wallBody2);
        const wallBody3 = new CANNON.Body({ mass: 0 });
        wallBody3.addShape(wallShape);
        wallBody3.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            Math.PI / 2
        );
        wallBody3.position.x -= dist;
        this.world.addBody(wallBody3);
        const wallBody4 = new CANNON.Body({ mass: 0 });
        wallBody4.addShape(wallShape);
        wallBody4.quaternion.setFromAxisAngle(
            new CANNON.Vec3(0, 1, 0),
            -Math.PI / 2
        );
        wallBody4.position.x = dist;
        this.world.addBody(wallBody4);

        // box
        const box = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
        const boxBody = new CANNON.Body({ mass: 1 });
        boxBody.addShape(box);
        boxBody.position.y = 10;
        boxBody.angularDamping = 0.1;
        this.world.addBody(boxBody);
        this.box = boxBody;

        const cursorShape = new CANNON.Sphere(0.1);
        const cursor = new CANNON.Body({ mass: 1 });
        cursor.addShape(cursorShape);
        this.cursor = cursor;
        this.constraint = new CANNON.PointToPointConstraint(
            this.box,
            new CANNON.Vec3(0, 0, 0),
            this.cursor,
            new CANNON.Vec3(0, 0, 0),
            3
        );
        // this.world.addBody(this.cursor);
    }
    update() {}
    start(force: vec3) {
        this.cursor.position.set(
            this.box.position.x + force.x * POWER,
            1.5,
            this.box.position.y + force.y * POWER
        );
        this.constraint.bodyB = this.cursor;

        this.constraintState = 'move';
        this.world.addConstraint(this.constraint);
    }
    move(force: vec3) {
        this.cursor.position.set(
            this.box.position.x + force.x * POWER,
            1.5,
            this.box.position.y + force.y * POWER
        );
        console.log();
        this.constraint.bodyB = this.cursor;
        console.log(
            this.box.position.x + force.x * POWER,
            this.box.position.y + force.y * POWER,
            force
        );
    }
    end() {
        this.world.removeConstraint(this.constraint);
        this.constraintState = null;
    }
}
