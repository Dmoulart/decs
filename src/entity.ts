import { World } from "./world";

/**
 * An entity is basically just an identifier, an unsigned integer.
 */
export type Entity = number;

/**
 * Creates an entity, add it in the given world and returns it.
 * @param world
 * @param archetype
 * @returns new entity's id
 */
export const Entity = (world: World, archetype = world.rootArchetype): Entity => {
  const eid = world.deletedEntities.length
    ? world.deletedEntities.shift()!
    : ++world.nextEid;

  // We start creating entities id from 1
  if (eid > world.size) {
    // todo: resize world automatically ?
    throw new ExceededWorldCapacityError(
      `World maximum capacity of ${world.size} exceeded`
    );
  }

  archetype.entities.insert(eid);
  world.entitiesArchetypes[eid] = archetype;
  return eid;
};

/**
 * Remove an entity from the given world.
 * @param eid entity id
 * @param world
 * @throws NonExistantEntityError
 * @returns nothing
 */
export const removeEntity = (eid: Entity, world: World) => {
  const archetype = world.entitiesArchetypes[eid];
  if (!archetype) {
    throw new NonExistantEntityError(
      `Trying to remove a non existant entity with id : ${eid}`
    );
  }
  archetype.entities.remove(eid);
  world.entitiesArchetypes[eid] = undefined;
  world.deletedEntities.push(eid);
};

/**
 * Returns true if the world has the given entity.
 * @param eid
 * @param world
 * @throws NonExistantEntityError
 * @returns world has the given entity
 */
export const hasEntity = (eid: Entity, world: World) => {
  return Boolean(world.entitiesArchetypes[eid]);
};

export class NonExistantEntityError extends Error {}
export class ExceededWorldCapacityError extends Error {}
