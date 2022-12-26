import {
  ComponentDefinitionField,
  NestedTypedArray,
  TypedArray,
  Types,
} from "./types";
import {World} from "./world";
import {Entity} from "./entity";
import {augmentArchetype, diminishArchetype} from "./archetype";

// The object passed into the Component factory function
export type ComponentDefinition = {
  [key: string]: ComponentDefinitionField;
};

export type Component<Def extends ComponentDefinition> = {
  id: number;
  $world: World;
} & {
  [key in keyof Def]: Def[key] extends TypedArray
    ? InstanceType<Def[key]>
    : Def[key] extends NestedTypedArray
    ? Array<InstanceType<Def[key][0]>>
    : never;
};

/**
 * Create a component store from a component definition.
 * @param def
 * @param size
 * @returns component
 */
const createComponentFields = <Definition extends ComponentDefinition>(
  def: Definition,
  size: number
): Component<Definition> => {
  const comp = {} as Component<Definition>;

  const isNestedArray = (field: unknown): field is NestedTypedArray => {
    return Array.isArray(field);
  };

  const isTypedArray = (field: unknown): field is TypedArray => {
    return typeof field === "function";
  };

  for (const field of Object.keys(def) as Array<keyof Definition>) {
    const fieldDef = def[field];

    if (isNestedArray(fieldDef)) {
      const [ArrayConstructor, arraySize] = fieldDef;

      (comp[field] as any) = new Array(size)
        .fill(0)
        .map(() => new ArrayConstructor(arraySize));
    }
    // If key is an array constructor let's initialize it with the world size
    else if (isTypedArray(fieldDef)) {
      (comp[field] as any) = new fieldDef(size);
    }
  }

  return comp;
};

/**
 * Create a new component from a component definition.
 * @param def component definition
 * @param world
 * @returns component
 */
export const Component = <Definition extends ComponentDefinition>(
  def: Definition,
  world: World
) => {
  const comp = createComponentFields(def, world.size);

  comp.$world = world;

  comp.id = ++world.nextCid;

  return comp;
};

/**
 * Add a component to the given entity.
 * @param component
 * @param eid
 * @param world
 * @returns nothing
 */
export const addComponent = (
  component: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid]!;

  if (!archetype || archetype?.mask?.has?.(component.id)) return;

  const newArchetype = augmentArchetype(archetype, component, world);

  archetype.entities.remove(eid);
  newArchetype.entities.insert(eid);

  world.entitiesArchetypes[eid] = newArchetype;
};

/**
 * Returns true if the entity possess the specified component.
 * @param comp
 * @param eid
 * @param world
 * @returns entity has the specified component
 */
export const hasComponent = (
  comp: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid];

  if (!archetype) return false;

  return archetype.mask.has(comp.id);
};

/**
 * Remove a component from the given entity.
 * @param component
 * @param eid
 * @param world
 * @returns nothing
 */
export const removeComponent = (
  component: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid]!;

  if (!archetype || !archetype.mask.has(component.id)) return;

  const newArchetype = diminishArchetype(archetype, component, world);

  archetype.entities.remove(eid);

  newArchetype.entities.insert(eid);
  world.entitiesArchetypes[eid] = newArchetype;
};
