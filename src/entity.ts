import {World} from "./world";

/**
 * An entity is basically just an identifier, an unsigned integer.
 */
export type Entity = number;

/**
 * Create an entity for the given world.
 * @param world
 * @returns new entity's id
 */
export const createEntity = (world: World): Entity => {
  const eid = ++world.nextEid;
  world.rootArchetype.entities.insert(eid);
  world.entitiesArchetypes[eid] = world.rootArchetype;
  return eid;
};

/**
 * Remove an entity from the given world.
 * @param eid entity id
 * @param world
 * @returns nothing
 */
export const removeEntity = (eid: Entity, world: World) => {
  const archetype = world.entitiesArchetypes[eid];
  if (!archetype) return;
  archetype.entities.remove(eid);
  world.entitiesArchetypes[eid] = undefined;
};

/**
 * Returns true if the world has the given entity
 * @param eid
 * @param world
 * @returns world has the given entity
 */
export const hasEntity = (eid: Entity, world: World) => {
  return Boolean(world.entitiesArchetypes[eid]);
};
