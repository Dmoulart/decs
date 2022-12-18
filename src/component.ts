import {ComponentDefinitionField, NestedTypedArray, TypedArray, Types} from "./types";
import {World} from "./world";
import {Entity, hasEntity} from "./entity";

// The object passed into the Component factory function
export type ComponentDefinition = {
  [key: string]: ComponentDefinitionField;
};

export type Component<Def extends ComponentDefinition> = {
    /*id: number;*/
    $world: World;
} & {
    [key in keyof Def]: Def[key] extends TypedArray
    ? InstanceType<Def[key]>
    : Def[key] extends NestedTypedArray
    ? Array<InstanceType<Def[key][0]>>
    : never;
};

export type ComponentMeta = { bitflag: number }

/*
let c: Component<{
    c: typeof Types.f32
    e: [typeof Types.eid, 1]
}>
*/

const isNestedArray = (field: unknown): field is NestedTypedArray => {
  return Array.isArray(field);
};

const isTypedArray = (field: unknown): field is TypedArray => {
  return typeof field === "function";
};

const createComponentFields = <Definition extends ComponentDefinition>(
  def: Definition,
  size: number
): Component<Definition> => {
  const comp = {} as Component<Definition>;

  for (const field of Object.keys(def) as Array<keyof Definition>) {
    const fieldDef = def[field];

    if (isNestedArray(fieldDef)) {
      const [ArrayConstructor, arraySize] = fieldDef;

      (comp[field] as any) = new Array(size).fill(0).map(() => new ArrayConstructor(arraySize));
    }
    // If key is an array constructor let's initialize it with the world size
    else if (isTypedArray(fieldDef)) {
      (comp[field] as any) = new fieldDef(size);
    }
  }

  return comp;
};

export const Component = <Definition extends ComponentDefinition>(
  def: Definition,
  world: World
) => {
  const comp = createComponentFields(def, world.size);

  comp.$world = world;

  world.$components.set(comp, {
      bitflag: world.bitflag
  });

  // Increment world bitmask
  // @TODO: Find a way to bypass the limit of 32 components
  world.bitflag *= 2

  return comp;
};


export const addComponent = (comp: Component<any>, eid: Entity, world: World) => {
    if(!hasEntity(eid, world))  throw new Error('Trying to add component on a non existant entity')

    const {bitflag} = world.$components.get(comp) as ComponentMeta
    world.masks[eid] |= bitflag
}

export const hasComponent = (comp: Component<any>, eid: Entity, world: World) => {
    if(!hasEntity(eid, world))  throw new Error('Trying to check component existence on a non existant entity')

    const {bitflag} = world.$components.get(comp) as ComponentMeta
    return (world.masks[eid] & bitflag) === bitflag
}

export const removeComponent = (comp: Component<any>, eid: Entity, world: World) => {
    if(!hasEntity(eid, world))  throw new Error('Trying to remove component on a non existant entity')

    const {bitflag} = world.$components.get(comp) as ComponentMeta
    
    return world.masks[eid] &= ~bitflag
}