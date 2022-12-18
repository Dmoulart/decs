import {run} from "./run/runner";
import {World} from "../src/world";
import {createEntity, removeEntity} from "../src/entity";
import {addComponent, Component, removeComponent} from "../src/component";
import {Types} from '../src/types'

const world = World()

const Position = Component({
    x: Types.f32,
    y: Types.f32
}, world)

const Velocity = Component({
    x: Types.f32,
    y: Types.f32
}, world)

run('World : Add 1_000_000 entities', () => {
    for(let i = 0; i <= 1_000_000; i++){
        const eid = createEntity(world)
    }
})
//https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
run('World : Add/Remove 5000 Iterations', () => {
    for(let i = 0; i <= 5000; i++){
        const eid1 = createEntity(world)
        const eid2 = createEntity(world)

        addComponent(Position, eid1, world)
        addComponent(Velocity, eid1, world)

        addComponent(Position, eid2, world)
        addComponent(Velocity, eid2, world)

        //update mvmt system

        removeComponent(Position, eid1, world)

        //update mvmt system

        removeEntity(eid1, world)
    }
})