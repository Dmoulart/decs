import {run} from "./run/runner";
import {World} from "../src/world";
import {createEntity, removeEntity} from "../src/entity";
import {addComponent, Component, removeComponent} from "../src/component";
import {Types} from '../src/types'
import {Query, registerQuery} from "../src/query";

const world = World()

const Position = Component({
    x: Types.f32,
    y: Types.f32
}, world)

const Velocity = Component({
    x: Types.f32,
    y: Types.f32
}, world)

let count = 0

const MovementQuery = Query().all(Position, Velocity)
registerQuery(MovementQuery, world)

run('World : Add 5000 entities', () => {
    for(let i = 0; i <= 5000; i++){
        const eid = createEntity(world)
    }
})

//https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
run('World : Add/Remove 5000 Iterations', () => {
    for(let i = 0; i <= 5000; i++){
        const eid1 = createEntity(world)
        const eid2 = createEntity(world)

        addComponent(Position, eid1, world)
        Position.x[eid1] = 100
        Position.y[eid1] = 100
        addComponent(Velocity, eid1, world)
        Velocity.x[eid1] = 1.2
        Velocity.y[eid1] = 1.7

        addComponent(Position, eid2, world)
        Position.x[eid2] = 100
        Position.y[eid2] = 100
        addComponent(Velocity, eid2, world)
        Velocity.x[eid2] = 1.2
        Velocity.y[eid2] = 1.7

        //update mvmt system
        for(let i= 0; i < MovementQuery.archetypes.length; i ++){
            const arch  = MovementQuery.archetypes[i]
            for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
                const id = arch.entities.dense[j];
                Position.x[id] += Velocity.x[id];
                Position.y[id] += Velocity.y[id];
                count++
            }
        }

        removeComponent(Position, eid1, world)

        //update mvmt system
        for(let i= 0; i < MovementQuery.archetypes.length; i ++){
            const arch  = MovementQuery.archetypes[i]
            for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
                const id = arch.entities.dense[j];
                Position.x[id] += Velocity.x[id];
                Position.y[id] += Velocity.y[id];
                count++
            }
        }

        removeEntity(eid1, world)
    }
})