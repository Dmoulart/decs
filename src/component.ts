import {NestedTypedArray, TypedArray} from "./types";
import {createWorld, World} from "./world";
import {createEntity, NonExistantEntityError} from "./entity";
import {DEFAULT_WORLD_MAX_SIZE} from "./world";
import {deriveArchetype} from "./archetype";
import {Entity} from "./entity";

export type Component<Definition extends ComponentDefinition> = {
  id: number;
} & {
  [key in keyof Definition]: ComponentField<Definition[key]>;
} & {
  data: {[key in keyof Definition]: SharedArrayBuffer};
};

// A component field is a typed array or an array of typed array.
export type ComponentField<Type extends ComponentDefinitionField> =
  Type extends TypedArray
    ? InstanceType<Type>
    : Type extends NestedTypedArray
    ? Array<InstanceType<Type[0]>>
    : never;

// The component schema.
// It describes the object passed into the Component factory function.
export type ComponentDefinition = Readonly<{
  [key: string]: ComponentDefinitionField;
}>;

// A component definition field will consists in simple numeric arrays or nested arrays.
export type ComponentDefinitionField = TypedArray | NestedTypedArray;

// Get the component definition from a component type.
export type InferComponentDefinition<Comp extends Component<any>> =
  Comp extends Component<infer Definition> ? Definition : never;

// The next component id.
// Components are not created in a particular world context but can be shared between worlds.
let nextCid = 0;

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
  const comp = {data: {}} as Component<Definition>;

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

      (comp[field] as any) = new Array(size).fill(0).map(() => {
        //@todo shared array buffer
        return new ArrayConstructor(arraySize);
      });
    }
    // If key is an array constructor let's initialize it with the world size
    else if (isTypedArray(fieldDef)) {
      const buffer = new SharedArrayBuffer(size * fieldDef.BYTES_PER_ELEMENT);
      (comp[field] as any) = new fieldDef(buffer);

      comp.data[field] = buffer;
    }
  }

  return comp;
};

/**
 * Create a new component from a component definition.
 * @param def component definition
 * @param size the size of the component store. It should equal to the size of the world.
 * @returns component
 */
export const defineComponent = <Definition extends ComponentDefinition>(
  def: Definition,
  size = DEFAULT_WORLD_MAX_SIZE
) => {
  const comp = createComponentFields(def, size);

  comp.id = ++nextCid;

  return comp;
};

/**
 * Add a component to the given entity.
 * @param component
 * @param eid
 * @param world
 * @throws NonExistantEntityError
 * @returns nothing
 */
export const attach = (
  component: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid]!;

  if (!archetype) {
    throw new NonExistantEntityError(
      `Trying to add component to a non existant entity with id : ${eid}`
    );
  }

  if (archetype.mask.has(component.id)) return;

  const newArchetype = deriveArchetype(archetype, component, world);

  archetype.entities.remove(eid);
  newArchetype.entities.insert(eid);

  if (world.handlers.enter[newArchetype.id]?.length) {
    const handlers = world.handlers.enter[newArchetype.id];
    const entity = [eid];
    for (const fn of handlers) {
      fn(entity);
    }
  }

  world.entitiesArchetypes[eid] = newArchetype;
};

/**
 * Remove a component from the given entity.
 * @param component
 * @param eid
 * @param world
 * @throws NonExistantEntityError
 * @returns nothing
 */
export const detach = (
  component: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid];

  if (!archetype) {
    throw new NonExistantEntityError(
      `Trying to remove component from a non existant entity with id :${eid}`
    );
  }

  if (!archetype.mask.has(component.id)) return;

  const newArchetype = deriveArchetype(archetype, component, world);

  archetype.entities.remove(eid);
  newArchetype.entities.insert(eid);

  if (world.handlers.exit[archetype.id]?.length) {
    const handlers = world.handlers.exit[archetype.id];
    const entity = [eid];
    for (const fn of handlers) {
      fn(entity);
    }
  }

  world.entitiesArchetypes[eid] = newArchetype;
};

/**
 * Returns true if the entity possess the specified component.
 * @param comp
 * @param eid
 * @param world
 * @throws NonExistantEntityError
 * @returns entity has the specified component
 */
export const hasComponent = (
  comp: Component<any>,
  eid: Entity,
  world: World
) => {
  const archetype = world.entitiesArchetypes[eid];

  if (!archetype) {
    throw new NonExistantEntityError(
      `Trying to check component existence of a non existant entity with id : ${eid}`
    );
  }

  return archetype.mask.has(comp.id);
};
