import {Bitset, BitSet} from "./collections";
import {Component} from "./component";
import {World} from "./world";
import {Archetype} from "./archetype";
import {Entity} from "../dist";

/**
 * Create a mask from a list of components.
 * @param components
 * @returns mask
 */
const makeComponentsMask = (...components: Component<any>[]) =>
  components.reduce((mask, comp) => {
    mask.or(comp.id);
    return mask;
  }, BitSet());

/**
 * A matcher represents the conditional expression used for every query operators.
 */
export type Matcher = (archetype: Archetype) => boolean;

export type Query = {
  /**
   * The archetypes matching the query
   */
  archetypes: Archetype[];
  /**
   * The query matchers
   */
  matchers: Array<Matcher>;
  /**
   * Get all archetypes that have the given set of components.
   * @param components
   * @returns query
   */
  all: (...components: Component<any>[]) => Query;
  /**
   * Get all archetypes that contains at leaast one of the given components
   * @param components
   * @returns query
   */
  any: (...components: Component<any>[]) => Query;
  /**
   * Get all archetypes that doesn't contain at least one of the given components.
   * @param components
   * @returns query
   */
  not: (...components: Component<any>[]) => Query;
  /**
   * Get all archetypes that doesn't contain the given set of components.
   * @param components
   * @returns query
   */
  none: (...components: Component<any>[]) => Query;
  /**
   * Get all archetypes that match the given condition.
   * @param matcher
   * @returns query
   */
  match: (matcher: Matcher) => Query;
  /**
   * Execute the given query with the given world.
   * This allows to execute the query outside of the system or world. We can therefore make one time
   * queries. If you wish to use a query regularly you should register the query with the register query method.
   * It will update automatically the query results when any archetypes is created.
   * @param world
   * @returns
   */
  from: (world: World) => Query;

  /**
   * Execute the given function for each entities.
   * It is slower than a classic for loop.
   * @param fn
   * @returns nothing
   */
  forEachEntity: (fn: (eid: Entity) => void) => void;
};
/**
 * Query a list of archetypes.
 * @returns query object
 */
export const Query = (): Query => {
  const archetypes: Archetype[] = [];
  const matchers: Array<Matcher> = [];

  return {
    matchers,
    archetypes,
    all(...components: Component<any>[]) {
      const mask = makeComponentsMask(...components);
      matchers.push((arch) => arch.mask.contains(mask));
      return this;
    },
    any(...components: Component<any>[]) {
      const mask = makeComponentsMask(...components);
      matchers.push((arch) => arch.mask.intersects(mask));
      return this;
    },
    not(...components: Component<any>[]) {
      const mask = makeComponentsMask(...components);
      matchers.push((arch) => !arch.mask.intersects(mask));
      return this;
    },
    none(...components: Component<any>[]) {
      const mask = makeComponentsMask(...components);
      matchers.push((arch) => !arch.mask.contains(mask));
      return this;
    },
    match(matcher: Matcher) {
      matchers.push(matcher);
      return this;
    },
    from(world: World) {
      archloop: for (const archetype of world.archetypes) {
        for (const match of matchers) {
          if (!match(archetype)) continue archloop;
        }
        archetypes.push(archetype);
      }
      return this;
    },
    forEachEntity(fn: (eid: Entity) => void) {
      for (let i = 0; i < archetypes.length; i++) {
        const ents = archetypes[i].entities.dense;
        const len = ents.length;
        for (let j = 0; j < len; j++) {
          fn(ents[j]);
        }
      }
    },
  };
};

/**
 * Register a query in the given world.
 * The query results will be automatically updated when new archetypes are created.
 * @param query the query to register
 * @param world
 */
export const registerQuery = (query: Query, world: World) => {
  world.queries.push(query.from(world));
};
