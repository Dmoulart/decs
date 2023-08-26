import {createEntity, Entity, existsEntity, removeEntity} from "./entity";
import {Archetype, createArchetype} from "./archetype";
import {Query, QueryHandler, registerQuery} from "./query";
import {attach, Component, detach, hasComponent} from "./component";
import {prefab, PrefabDefinition, PrefabInstanceOptions} from "./prefab";

export const DEFAULT_WORLD_MAX_SIZE = 100_000;

export type World = {
  /**
   * The removed entities
   */
  deletedEntities: Array<Entity>;
  /**
   * The size of the world, in number of entities
   */
  size: number;
  /**
   * An array with entity id as index and corresponding archetype at the given index
   */
  entitiesArchetypes: (Archetype | undefined)[];
  /**
   * The root archetype, which is the archetype corresponding to empty components
   */
  rootArchetype: Archetype;
  /**
   * The complete list of the world's archetypes
   */
  archetypes: Archetype[];
  /**
   * The registerd queries
   */
  queries: Query[];
  /**
   * The callback to execute when entities enter the query or exit the query
   */
  handlers: {enter: Array<QueryHandler[]>; exit: Array<QueryHandler[]>};
};

/**
 * Create a new world which will contain it's own archetypes and entities.
 * @param size
 * @returns new world
 */
export const createWorld = (size = DEFAULT_WORLD_MAX_SIZE): World => {
  const rootArchetype = createArchetype();

  return {
    rootArchetype,
    archetypes: [rootArchetype],
    deletedEntities: [] as Entity[],
    entitiesArchetypes: [] as Archetype[],
    queries: [] as Query[],
    handlers: {
      enter: [] as Array<QueryHandler[]>,
      exit: [] as Array<QueryHandler[]>,
    },
    size,
  };
};

export const useWorld = (world: World = createWorld()) => {
  return {
    world,
    create: (archetype?: Archetype) => createEntity(world, archetype),
    delete: (eid: Entity) => removeEntity(eid, world),
    exists: (eid: Entity) => existsEntity(eid, world),
    hasComponent: (component: Component<any>, eid: Entity) =>
      hasComponent(component, eid, world),
    prefab: <Definition extends PrefabDefinition>(
      definition: Definition,
      options?: PrefabInstanceOptions<Definition>
    ) => {
      return prefab(world, definition, options);
    },
    attach: (component: Component<any>, eid: Entity) =>
      attach(component, eid, world),
    detach: (component: Component<any>, eid: Entity) =>
      detach(component, eid, world),
    registerQuery: (query: Query) => {
      registerQuery(query, world);
    },
  };
};
