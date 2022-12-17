import {createWorld} from "./world";
import {createEntity} from "./entity";

const world = createWorld()

const eid = createEntity(world)
console.log('1', eid)
const eid2 = createEntity(world)
console.log('2', eid2)