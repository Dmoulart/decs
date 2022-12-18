// An entity is a unique identifier. 
import { World } from "./world";

export type Entity = number

export const createEntity = (world: World): Entity => {
    const eid = ++world.entityCursor
    world.entities.insert(eid)
    return eid
}

export const removeEntity = (eid: Entity, world: World) => {
    return world.entities.remove(eid)
}

export const hasEntity = (eid: Entity, world: World) => {
    return world.entities.has(eid)
}
