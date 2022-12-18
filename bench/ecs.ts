import {run} from "./run/runner";
import {World} from "../src/world";
import {createEntity} from "../src/entity";

const world = World()

run('World : Add 1_000_000 entities', () => {
    for(let i = 0; i <= 1_000_000; i++){
        createEntity(world)
    }
})