// An entity is a unique identifier. 
import { World } from "./world";

export type Entity = number

export const createEntity = (world: World): Entity => {
    const eid = ++world.nextEid
    world.rootArchetype.entities.insert(eid)
    world.entitiesArchetypes[eid]= world.rootArchetype
    return eid
}

export const removeEntity = (eid: Entity, world: World) => {
    const archetype = world.entitiesArchetypes[eid]
    if(!archetype) return
    archetype.entities.remove(eid)
    world.entitiesArchetypes[eid] = undefined
}

export const hasEntity = (eid: Entity, world: World) => {
    return Boolean(world.entitiesArchetypes[eid])
}
