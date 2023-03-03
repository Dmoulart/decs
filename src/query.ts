import {BitSet} from "./collections";
import {Component} from "./component";
import {World} from "./world";
import {Archetype} from "./archetype";
import {Entity} from "./entity";

/**
 * A matcher represents the conditional expression used for every query operators.
 */
export type Matcher = (archetype: Archetype) => boolean;

export type QueryHandler = (entities: Array<Entity>) => void;

export type Query = {
  /**
   * The archetypes matching the query.
   */
  archetypes: Archetype[];
  /**
   * The query matchers.
   */
  matchers: Array<Matcher>;
  /**
   * The world this query is attached to.
   */
  world: World | null;
  /**
   * The callback to execute when entities enter the query or exit the query.
   */
  handlers: {enter: Array<QueryHandler>; exit: Array<QueryHandler>};
  /**
   * Get all archetypes that have the given set of components.
   * @param components
   * @returns query
   */
  all: (...components: Component<any>[]) => Query;
  /**
   * Get all archetypes that contains at leaast one of the given components.
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
   * Returns matching archetypes.
   * @returns
   */
  from: (world: World) => Archetype[];

  /**
   * Execute the given function for each entities.
   * It is slower than a classic for loop.
   * @param fn
   * @returns nothing
   */
  each: (fn: (eid: Entity, index: number) => void) => void;

  /**
   * Execute the given function for each entities.
   * It is slower than a classic for loop.
   * @param fn
   * @returns nothing
   */
  $precompileEach: (
    fn: (eid: Entity, index: number) => void,
    vars?: Record<string, any>
  ) => () => void;
};

/**
 * Create a mask from a list of components.
 * @param components
 * @returns mask
 */
export const makeComponentsMask = (...components: Component<any>[]) =>
  components.reduce((mask, comp) => {
    mask.or(comp.id);
    return mask;
  }, BitSet());

/**
 * Query a list of archetypes.
 * @returns query object
 */
export const Query = (): Query => {
  const archetypes: Archetype[] = [];
  const matchers: Array<Matcher> = [];
  const handlers = {enter: [], exit: []};
  let world: World | null = null;

  return {
    matchers,
    archetypes,
    world,
    handlers,
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
    from(target: World) {
      archloop: for (const archetype of target.archetypes) {
        for (const match of matchers) {
          if (!match(archetype)) continue archloop;
        }
        archetypes.push(archetype);
      }
      return archetypes;
    },
    each(fn: (eid: Entity, index: number) => void) {
      for (let i = 0; i < archetypes.length; i++) {
        const ents = archetypes[i].entities.dense;
        const len = ents.length;
        for (let j = 0; j < len; j++) {
          fn(ents[j], j);
        }
      }
    },
    $precompileEach(
      fn: (eid: Entity, index: number) => void,
      vars?: Record<string, any>
    ) {
      const varsDeclarations = vars
        ? Object.entries(vars)
            .map(([identifier, object]) => {
              return `let ${identifier} = vars.${identifier};`;
            })
            .join("")
        : "";
      // console.log(varsDeclarations);
      const fnString = fn.toString();
      const fnBody = fnString.substring(
        fnString.indexOf("{") + 1,
        fnString.lastIndexOf("}")
      );
      const precompiledIterator = new Function(
        "archetypes",
        "vars",
        `
        ${varsDeclarations}
        for (let i = 0; i < archetypes.length; i++) {
          const ents = archetypes[i].entities.dense;
          const len = ents.length;
          for (let j = 0; j < len; j++) {
            const id = ents[j];
            ${fnBody}
          }
        }
      `
      );

      // console.log(precompiledIterator.toString());

      // const precompiledIterator = new Function(
      //   "archetypes",
      //   `
      //   ${fn.toString()}

      //   for (let i = 0; i < archetypes.length; i++) {
      //     const ents = archetypes[i].entities.dense;
      //     const len = ents.length;
      //     for (let j = 0; j < len; j++) {
      //       const id = ents[j];
      //       func(id);
      //     }
      //   }
      // `
      // );
      console.log(precompiledIterator.toString());
      return () => precompiledIterator(archetypes, vars);
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
  // Throw an error if query is already registered
  if (query.world) {
    throw new AlreadyRegisteredQueryError(
      "Trying to register an already registered query."
    );
  }
  query.world = world;

  // Execute the query, register the results in the query.
  query.archetypes = query.from(world);
  world.queries.push(query);

  // Register the handlers
  if (query.handlers.enter.length > 0) {
    query.handlers.enter.forEach((handler) =>
      registerEnterQueryHandler(handler, query, world)
    );
  }
  if (query.handlers.exit.length > 0) {
    query.handlers.exit.forEach((handler) =>
      registerExitQueryHandler(handler, query, world)
    );
  }
};

/**
 * Unregister the query from the given world.
 * The query results will be automatically updated when new archetypes are created.
 * @param query the query to register
 * @param world
 */
export const removeQuery = (query: Query, world: World) => {
  if (query.world !== world) {
    throw new RemoveQueryError(
      "Trying to remove a query from a world it not belongs to."
    );
  }
  query.world = null;

  const index = world.queries.indexOf(query);
  if (index === -1) return;
  world.queries.splice(index);

  // Delete the enter handlers
  if (query.handlers.enter.length > 0) {
    for (const archetype of query.archetypes) {
      for (const handler of query.handlers.enter) {
        const index = world.handlers.enter[archetype.id].indexOf(handler);
        if (index === -1) continue;
        world.handlers.enter[archetype.id].splice(index);
      }
    }
  }

  // Delete the exit handlers
  if (query.handlers.exit.length > 0) {
    for (const archetype of query.archetypes) {
      for (const handler of query.handlers.exit) {
        const index = world.handlers.exit[archetype.id].indexOf(handler);
        if (index === -1) continue;
        world.handlers.exit[archetype.id].splice(index);
      }
    }
  }

  query.archetypes = [];
};

/**
 * Returns true if an archetype is matched by a given query.
 * @param query
 * @param archetype
 * @returns true if archetype components match query
 */
export const archetypeMatchesQuery = (
  query: Query,
  archetype: Archetype
): boolean => {
  for (const match of query.matchers) {
    if (!match(archetype)) {
      return false;
    }
  }
  return true;
};

/**
 * Attach to the given archetypes a set of enter and exit query callbacks.
 * @param archetype
 * @param query
 * @param world
 */
export const registerQueryHandlersForArchetype = (
  archetype: Archetype,
  query: Query,
  world: World
) => {
  if (query.handlers.enter.length > 0) {
    // @todo: jest not letting us use the ??= operator
    if (!world.handlers.enter[archetype.id]) {
      world.handlers.enter[archetype.id] = [];
    }
    world.handlers.enter[archetype.id].push(...query.handlers.enter);
  }
  if (query.handlers.exit.length > 0) {
    // @todo: jest not letting us use the ??= operator
    if (!world.handlers.exit[archetype.id]) {
      world.handlers.exit[archetype.id] = [];
    }
    world.handlers.exit[archetype.id].push(...query.handlers.exit);
  }
};

/**
 * Register the enter query callbacks of the given query for the given world.
 * @param handler the callback function
 * @param query
 * @param world
 */
export const registerEnterQueryHandler = (
  handler: QueryHandler,
  query: Query,
  world: World
) => {
  for (const archetype of query.archetypes) {
    // @todo: jest not letting us use the ??= operator
    if (!world.handlers.enter[archetype.id]) {
      world.handlers.enter[archetype.id] = [];
    }
    world.handlers.enter[archetype.id].push(handler);
  }
};

/**
 * Register the exit query callbacks of the given query for the given world.
 * @param handler the callback function
 * @param query
 * @param world
 */
export const registerExitQueryHandler = (
  handler: QueryHandler,
  query: Query,
  world: World
) => {
  for (const archetype of query.archetypes) {
    // @todo: jest not letting us use the ??= operator
    if (!world.handlers.exit[archetype.id]) {
      world.handlers.exit[archetype.id] = [];
    }
    world.handlers.exit[archetype.id].push(handler);
  }
};

/**
 * Generates a factory function that will be used to create callbacks that will execute when one or multiple entities
 * start to match the given query.
 * @param query
 */
export const onEnterQuery = (query: Query) => {
  return (fn: QueryHandler) => {
    query.handlers.enter.push(fn);
    // If query is not tied to any world, the registration of the handlers will take
    // place during the registration of the query
    if (query.world) {
      registerEnterQueryHandler(fn, query, query.world);
    }
  };
};

/**
 * Generates a factory function that will be used to create callbacks that will execute when one or multiple entities
 * no longer match the given query.
 * @param query
 */
export const onExitQuery = (query: Query) => {
  return (fn: QueryHandler) => {
    query.handlers.exit.push(fn);
    // If query is not tied to any world, the registration of the handlers will take
    // place during the registration of the query
    if (query.world) {
      registerExitQueryHandler(fn, query, query.world);
    }
  };
};

export const all = (...components: Component<any>[]) => {
  return Query().all(...components);
};

export const any = (...components: Component<any>[]) => {
  return Query().any(...components);
};

export const not = (...components: Component<any>[]) => {
  return Query().not(...components);
};

export const none = (...components: Component<any>[]) => {
  return Query().none(...components);
};

export const match = (matcher: Matcher) => {
  return Query().match(matcher);
};

export class AlreadyRegisteredQueryError extends Error {}
export class RemoveQueryError extends Error {}
