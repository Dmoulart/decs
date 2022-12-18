// An entity is a unique identifier. 
import { World } from "./world";

export type Entity = number

export const createEntity = (world: World): Entity => {
    const eid = ++world.entityCursor
    world.sset.insert(eid)
    return eid
}

export const removeEntity = (eid: Entity, world: World) => {
    return world.sset.remove(eid)
}

export const hasEntity = (eid: Entity, world: World) => {
    return world.sset.has(eid)
}
