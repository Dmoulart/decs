import {Component} from "./component";
import {BitSet, Bitset, SparseSet} from "./collections";
import {World} from "./world";

export type Archetype = {
  /**
   * The set of entities belonging to this archetype
   */
  entities: SparseSet;
  /**
   * The adjacent archertypes in the archetype graph
   */
  edges: {add: (Archetype | undefined)[]; remove: (Archetype | undefined)[]};
  /**
   * The archetype mask based on the components ids
   */
  mask: Bitset;
};

/**
 * Create a new archetype with the specified list of components.
 * @param components
 * @returns new archetype
 */
export const Archetype = (components: Component<any>[]): Archetype => {
  const mask = components.reduce((mask, {id}) => {
    mask.or(id);
    return mask;
  }, BitSet());

  return {
    entities: SparseSet(),
    edges: {add: [], remove: []},
    mask,
  };
};

/**
 * Create a new archetype by cloning another archetype and adding a component to its list and mask.
 * It will also register itself in the archetype graph.
 * @param from 
 * @param component 
 * @param world 
 * @returns augmented archetype
 */
export const augmentArchetype = (
  from: Archetype,
  component: Component<any>,
  world: World
): Archetype => {
  const augmentedArchetype = from.edges.add[component.id];

  if (augmentedArchetype) {
    return augmentedArchetype;
  } else {
    const mask = from.mask.clone();
    mask.or(component.id);

    const archetype: Archetype = {
      entities: SparseSet(),
      edges: {add: [], remove: []},
      mask,
    };

    from.edges.add[component.id] = archetype;
    archetype.edges.remove[component.id] = from;

    world.archetypes.push(archetype);

    for (const query of world.queries) {
      let addArchetype = true;
      for (const match of query.matchers) {
        if (!match(archetype)) {
          addArchetype = false;
        }
      }
      if (addArchetype) {
        query.archetypes.push(archetype);
      }
    }

    return archetype;
  }
};

/**
 * Create a new archetype by cloning another archetype and removing a component to its list and mask.
 * It will also register itself in the archetype graph.
 * @param from 
 * @param component 
 * @param world 
 * @returns augmented archetype
 */
export const diminishArchetype = (
  from: Archetype,
  component: Component<any>,
  world: World
): Archetype => {
  const diminishedArchetype = from.edges.remove[component.id];

  if (diminishedArchetype) {
    return diminishedArchetype;
  } else {
    const mask = from.mask.clone();
    mask.xor(component.id);

    const archetype: Archetype = {
      entities: SparseSet(),
      edges: {
        add: [],
        remove: [],
      },
      mask,
    };

    from.edges.remove[component.id] = archetype;
    archetype.edges.add[component.id] = from;

    world.archetypes.push(archetype);

    for (const query of world.queries) {
      let addArchetype = true;
      for (const match of query.matchers) {
        if (!match(archetype)) {
          addArchetype = false;
        }
      }
      if (addArchetype) {
        query.archetypes.push(archetype);
      }
    }

    return archetype;
  }
};
