import {Archetype} from "./archetype";
import {Query} from "./query";

export const WORLD_MAX_SIZE = 100_000;

export type World = {
  /**
   * The next entity id
   */
  nextEid: number;
  /**
   * The next component id
   */
  nextCid: number;
  /**
   * The size of the world, in number of entities
   */
  size: number;
  /**
   * An array with entity id as index and corresponding archetype at the given index
   */
  entitiesArchetypes: (Archetype | undefined)[];
  /**
   * The root archetype, which is the archetype corresponding to empty components
   */
  rootArchetype: Archetype;
  /**
   * The complete list of the world's archetypes
   */
  archetypes: Archetype[];
  /**
   * The registerd queries
   */
  queries: Query[];
};

/**
 * Create a new world which will contain it's own archetypes and entities.
 * @param size
 * @returns new world
 */
export const World = (size = WORLD_MAX_SIZE): World => {
  const world = {
    nextEid: 0,
    nextCid: 0,
    entitiesArchetypes: [] as Archetype[],
    archetypes: [] as Archetype[],
    queries: [] as Query[],
    size,
  } as World;

  world.rootArchetype = Archetype([]);
  world.archetypes.push(world.rootArchetype);

  return world;
};
