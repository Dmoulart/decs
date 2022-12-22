import {Component, ComponentMetaData} from "./component";
import {SparseSet} from "./sparse-set";
import {Archetype, createArchetype} from "./archetype";
import {Entity} from "./entity";

export const WORLD_MAX_SIZE = 100_000;

export type World = {
  nextEid: number;
  nextCid: number;
  bitflag: number
  entities: SparseSet;
  size: number;
  masks: Uint32Array
  // Should we use a map here ? Maybe simpler/faster alternative ?
  components: Map<Component<any>, ComponentMetaData>;
  entitiesArchetypes: Map<Entity, Archetype>

  rootArchetype: Archetype
};

export const World = (size = WORLD_MAX_SIZE): World => {
  return {
    nextEid: 0,
      nextCid: 0,
    entities:SparseSet(),
    entitiesArchetypes: new Map(),
    rootArchetype: createArchetype([]),
    masks: new Uint32Array(size),
    bitflag: 1 << 0,
    components: new Map(),
    size
  };
};
