import {World} from "./world";
import {createEntity} from "./entity";
import {addComponent, Component} from "./component";
import Types from "./types";

const world = World()

const Position = Component({
    x: Types.i32,
    y: Types.i32,
    matrix: [Types.f64, 5]
}, world)

const eid = createEntity(world)

addComponent(Position, eid, world)

Position.x[eid] = 100
Position.y[eid] = 100


