import {CreatedComponent} from "./component";
import {SparseSet} from "./sparse-set";

export const WORLD_MAX_SIZE = 100_000;

export type World = {
  count: () => number;
  cursor: number;
  sset: SparseSet;
  size: number;
  $components: Array<CreatedComponent<any>>;
};

export const World = (size = WORLD_MAX_SIZE): World => {
  let cursor = 0;

  const sset = SparseSet();

  const world = {
    count: sset.count,
    cursor,
    sset,
    size,
    $components: [] as Array<CreatedComponent<any>>,
  };

  return world;
};
