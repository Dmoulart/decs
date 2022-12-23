import {Archetype} from "./archetype";
import {Entity} from "./entity";

export const WORLD_MAX_SIZE = 100_000;

export type World = {
  nextEid: number;
  nextCid: number;
  size: number;
  entitiesArchetypes: Map<Entity, Archetype>
  rootArchetype: Archetype
};

export const World = (size = WORLD_MAX_SIZE): World => {
  return {
    nextEid: 0,
    nextCid: 0,
    entitiesArchetypes: new Map(),
    rootArchetype: Archetype([]),
    size
  };
};
