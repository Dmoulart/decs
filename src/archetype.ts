import {Component} from "./component";
import {BitSet, Bitset, SparseSet} from "./collections";
import {World} from "./world";
import {archetypeMatchesQuery, makeComponentsMask} from "./query";
import Types from "./types";
import {Entity} from "./entity";

export type Archetype = {
  /**
   * The set of entities belonging to this archetype
   */
  entities: SparseSet;
  /**
   * The adjacent archertypes in the archetype graph
   */
  edge: (Archetype | undefined)[];
  /**
   * The archetype mask based on the components ids
   */
  mask: Bitset;
};

/**
 * Creates a new archetype with the specified list of components.
 * @param mask
 * @returns new archetype
 */
export const Archetype = (mask = BitSet(2)): Archetype => {
  return {
    entities: SparseSet(),
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

  const archetype: Archetype = {
    entities: SparseSet(),
    edge: [],
    mask,
  };

  // Register in archetype graph
  base.edge[component.id] = archetype;
  archetype.edge[component.id] = base;

  world.archetypes.push(archetype);

  for (const query of world.queries) {
    if (archetypeMatchesQuery(query, archetype)) {
      query.archetypes.push(archetype);
    }
  }

  return archetype;
};
