import {Component, ComponentMeta} from "./component";
import {SparseSet} from "./sparse-set";

export const WORLD_MAX_SIZE = 100_000;

export type World = {
  count: () => number;
  entityCursor: number;
  bitflag: number
  sset: SparseSet;
  size: number;
  masks: Uint32Array
  // Should we use a map here ? Maybe simpler/faster alternative ?
  $components: Map<Component<any>, ComponentMeta>;
};

export const World = (size = WORLD_MAX_SIZE): World => {
  let entityCursor = 0;

  const sset = SparseSet();

  const masks = new Uint32Array(size)

  return {
    count: sset.count,
    bitflag: 1 << 0,
    masks,
    entityCursor,
    sset,
    size,
    $components: new Map()
  };
};
