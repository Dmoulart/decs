// An entity is a unique identifier. 
import { World } from "./world";

export type Entity = number

export const createEntity = (world: World): Entity => {
    const eid = world.count() + 1
    world.sset.insert(eid)
    return eid
}















/*
export const entityExists = (world: ReturnType<typeof createWorld>, eid: Entity) => {
    return world.sset.has(eid)
}

export const removeEntity = (world: ReturnType<typeof createWorld>, eid: Entity) => {
    return world.sset.remove(eid)
}

export const entitiesCount = (world: ReturnType<typeof createWorld>) => {
    return world.sset.count()
}*/
