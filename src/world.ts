import {Entity, hasEntity, removeEntity} from "./entity";
import { Archetype } from "./archetype";
import { Query, QueryHandler } from "./query";
import {attach, Component, detach, hasComponent} from "./component";
import {prefab} from "./prefab";

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
  handlers: { enter: Array<QueryHandler[]>, exit: Array<QueryHandler[]> }
};

/**
 * Create a new world which will contain it's own archetypes and entities.
 * @param size
 * @returns new world
 */
export const World = (size = DEFAULT_WORLD_MAX_SIZE): World => {
  const rootArchetype = Archetype()

  return {
    rootArchetype,
    archetypes: [rootArchetype],
    deletedEntities: [] as Entity[],
    entitiesArchetypes: [] as Archetype[],
    queries: [] as Query[],
    handlers: {
        enter: [] as Array<QueryHandler[]>,
        exit: [] as Array<QueryHandler[]>
    },
    size,
  }
};

export const useWorld = (world: World = World()) => {
    return {
        world,
        create: (archetype?: Archetype) => Entity(world, archetype),
        delete: (eid: Entity) => removeEntity(eid, world),
        exists: (eid: Entity) => hasEntity(eid, world),
        hasComponent: (component: Component<any>, eid: Entity) => hasComponent(component, eid, world),
        prefab: (...components: Component<any>[]) => prefab(world, ...components),
        attach: (component: Component<any>, eid: Entity) => attach(component, eid, world),
        detach: (component: Component<any>, eid: Entity) => detach(component, eid, world),
    }
}