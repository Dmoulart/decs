import {World} from "./world";
import {createEntity} from "./entity";

const world = World()

const eid = createEntity(world)
console.log('1', eid)
const eid2 = createEntity(world)
console.log('2', eid2)