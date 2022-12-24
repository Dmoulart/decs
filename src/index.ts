import {World} from "./world";
import {createEntity} from "./entity";
import {addComponent, Component} from "./component";
import Types from "./types";
import {Query} from "./query";

const world = World()

const Position = Component({
    x: Types.f32,
    y: Types.f32,
}, world)

const Health = Component({
    points: Types.i32
}, world)


for(let i = 0; i < 1_000_000; i ++){
    // -> Archetype : [Position]
    const eid = createEntity(world)
    addComponent(Position, eid, world)

    // -> Archetype : [Position, Health]
    const eid2 = createEntity(world)
    addComponent(Position, eid2, world)
    addComponent(Health, eid2, world)
}

// -> Donne moi tous les archetypes qui correspondent
// -> Match : [Position] , [Position, Health]
const query  = Query().all(Position).from(world)


for(let i = 0; i < query.archetypes.length; i++){

}





/*
const Position = Component({
    x: Types.i32,
    y: Types.i32,
    matrix: [Types.f64, 5]
}, world)

const eid = createEntity(world)

addComponent(Position, eid, world)

Position.x[eid] = 100
Position.y[eid] = 100


*/
