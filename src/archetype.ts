import {Component} from "./component";
import {
  AtomicBitSet,
  AtomicSparseSet,
  BitSet,
  Bitset,
  SparseSet,
} from "./collections";
import {DEFAULT_WORLD_MAX_SIZE, World} from "./world";
import {
  archetypeMatchesQuery,
  registerQueryHandlersForArchetype,
} from "./query";
import {ui32} from "./types";

export type Archetype = {
  /**
   * The archetype id.
   */
  id: number;
  /**
   * The set of entities belonging to this archetype
   */
  entities: SparseSet | AtomicSparseSet<any>;
  /**
   * The adjacent archertypes in the archetype graph
   */
  edge: (Archetype | undefined)[];
  /**
   * The archetype mask based on the components ids
   */
  mask: Bitset;
};

// The next archetype id.
let nextAid = 0;

/**
 * Creates a new archetype with the specified list of components.
 * @param mask
 * @returns new archetype
 */
export const createArchetype = (mask = BitSet(2)): Archetype => {
  return {
    id: ++nextAid,
    entities: SparseSet(),
    edge: [],
    mask,
  };
};

/**
 * Creates a new archetype with the specified list of components.
 * @param mask
 * @returns new archetype
 */
export const $createArchetype = (
  mask = AtomicBitSet(2),
  size = DEFAULT_WORLD_MAX_SIZE
): Archetype => {
  return {
    id: ++nextAid,
    entities: AtomicSparseSet(ui32, size),
    edge: [],
    mask,
  };
};

/**
 * Create a new archetype by cloning another archetype and adding or removing the given
 * component.
 * It will also register itself in the archetype graph and match against world queries.
 * @todo move query matching/global arch pushing in world
 * @param base
 * @param component
 * @param world
 * @returns transformed archetype
 */
export const deriveArchetype = (
  base: Archetype,
  component: Component<any>,
  world: World
): Archetype => {
  const adjacent = base.edge[component.id];

  if (adjacent) {
    return adjacent;
  }

  const mask = base.mask.clone();
  mask.xor(component.id);

  const archetype = createArchetype(mask);

  // Register in archetype graph
  base.edge[component.id] = archetype;
  archetype.edge[component.id] = base;

  world.archetypes.push(archetype);

  for (const query of world.queries) {
    if (archetypeMatchesQuery(query, archetype)) {
      query.archetypes.push(archetype);
      registerQueryHandlersForArchetype(archetype, query, world);
    }
  }

  return archetype;
};

/**
 * Create a new archetype by cloning another archetype and adding or removing the given
 * component.
 * It will also register itself in the archetype graph and match against world queries.
 * @todo move query matching/global arch pushing in world
 * @param base
 * @param component
 * @param world
 * @returns transformed archetype
 */
export const $deriveArchetype = (
  base: Archetype,
  component: Component<any>,
  world: World
): Archetype => {
  const adjacent = base.edge[component.id];

  if (adjacent) {
    return adjacent;
  }

  const mask = base.mask.clone();
  mask.xor(component.id);

  const archetype = $createArchetype(mask, world.size);

  // Register in archetype graph
  base.edge[component.id] = archetype;
  archetype.edge[component.id] = base;

  world.archetypes.push(archetype);

  for (const query of world.queries) {
    if (archetypeMatchesQuery(query, archetype)) {
      query.archetypes.push(archetype);
      registerQueryHandlersForArchetype(archetype, query, world);
    }
  }

  return archetype;
};

/**
 * Composes an archetype from an array of components.
 * It will also register all the intermediate archetypes in the world archetype graph.
 * @param components
 * @param world
 */
export const buildArchetype = (components: Component<any>[], world: World) => {
  let archetype = world.rootArchetype;
  for (const component of components) {
    if (archetype.edge[component.id]) {
      archetype = archetype.edge[component.id]!;
    } else {
      archetype = deriveArchetype(archetype, component, world);
    }
  }
  return archetype;
};

/**
 * Composes an archetype from an array of components.
 * It will also register all the intermediate archetypes in the world archetype graph.
 * @param components
 * @param world
 */
export const $buildArchetype = (components: Component<any>[], world: World) => {
  let archetype = world.rootArchetype;
  for (const component of components) {
    if (archetype.edge[component.id]) {
      archetype = archetype.edge[component.id]!;
    } else {
      archetype = $deriveArchetype(archetype, component, world);
    }
  }
  return archetype;
};
