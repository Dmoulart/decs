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
  edge: (Archetype | undefined)[];
  /**
   * The archetype mask based on the components ids
   */
  mask: Bitset;
};

/**
 * Creates a new archetype with the specified list of components.
 * @param components
 * @returns new archetype
 */
export const Archetype = (mask: Bitset = BitSet(2)): Archetype => {
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
export const transformArchetype = (
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

  base.edge[component.id] = archetype;
  archetype.edge[component.id] = base;

  world.archetypes.push(archetype);

  queryloop: for (const query of world.queries) {
    let addArchetype = true;
    for (const match of query.matchers) {
      if (!match(archetype)) {
        addArchetype = false;
        continue queryloop;
      }
    }
    if (addArchetype) {
      query.archetypes.push(archetype);
    }
  }

  return archetype;
};

// /**
//  * Create a new archetype by cloning another archetype and adding a component to its list and mask.
//  * It will also register itself in the archetype graph.
//  * @param from
//  * @param component
//  * @param world
//  * @returns augmented archetype
//  */
// export const augmentArchetype = (
//   from: Archetype,
//   component: Component<any>,
//   world: World
// ): Archetype => {
//   const augmentedArchetype = from.edges.add[component.id];

//   if (augmentedArchetype) {
//     return augmentedArchetype;
//   } else {
//     const mask = from.mask.clone();
//     mask.or(component.id);

//     const archetype: Archetype = {
//       entities: SparseSet(),
//       edges: {add: [], remove: []},
//       mask,
//     };

//     from.edges.add[component.id] = archetype;
//     archetype.edges.remove[component.id] = from;

//     world.archetypes.push(archetype);

//     for (const query of world.queries) {
//       let addArchetype = true;
//       for (const match of query.matchers) {
//         if (!match(archetype)) {
//           addArchetype = false;
//         }
//       }
//       if (addArchetype) {
//         query.archetypes.push(archetype);
//       }
//     }

//     return archetype;
//   }
// };

// /**
//  * Create a new archetype by cloning another archetype and removing a component to its list and mask.
//  * It will also register itself in the archetype graph.
//  * @param from
//  * @param component
//  * @param world
//  * @returns augmented archetype
//  */
// export const diminishArchetype = (
//   from: Archetype,
//   component: Component<any>,
//   world: World
// ): Archetype => {
//   const diminishedArchetype = from.edges.remove[component.id];

//   if (diminishedArchetype) {
//     return diminishedArchetype;
//   } else {
//     const mask = from.mask.clone();
//     mask.xor(component.id);

//     const archetype: Archetype = {
//       entities: SparseSet(),
//       edges: {
//         add: [],
//         remove: [],
//       },
//       mask,
//     };

//     from.edges.remove[component.id] = archetype;
//     archetype.edges.add[component.id] = from;

//     world.archetypes.push(archetype);

//     for (const query of world.queries) {
//       let addArchetype = true;
//       for (const match of query.matchers) {
//         if (!match(archetype)) {
//           addArchetype = false;
//         }
//       }
//       if (addArchetype) {
//         query.archetypes.push(archetype);
//       }
//     }

//     return archetype;
//   }
// };
