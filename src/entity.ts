// An entity is a unique identifier. 
import { World } from "./world";

export type Entity = number

export const createEntity = (world: World): Entity => {
    const eid = ++world.nextEid
    world.rootArchetype.entities.insert(eid)
    world.entitiesArchetypes.set(eid, world.rootArchetype)
    return eid
}

export const removeEntity = (eid: Entity, world: World) => {
    const archetype = world.entitiesArchetypes.get(eid)
    if(!archetype) return
    archetype.entities.remove(eid)
    world.entitiesArchetypes.delete(eid)
}

export const hasEntity = (eid: Entity, world: World) => {
    return world.entitiesArchetypes.has(eid)
}
