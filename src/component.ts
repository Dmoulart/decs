import {ComponentDefinitionField, NestedTypedArray, TypedArray, Types} from "./types";
import {World} from "./world";

// The object passed into the Component factory function
export type ComponentDefinition = {
  [key: string]: ComponentDefinitionField;
};

export type CreatedComponent<Def extends ComponentDefinition> = {
    $world: World;
} & {
    [key in keyof Def]: Def[key] extends TypedArray
    ? InstanceType<Def[key]>
    : Def[key] extends NestedTypedArray
    ? Array<InstanceType<Def[key][0]>>
    : never;
};

/*let c: CreatedComponent<{
    c: typeof Types.eid
    e: [typeof Types.eid, 1]
}>
c.*/

export type Component = ReturnType<typeof Component>;

const isNestedArray = (field: unknown): field is NestedTypedArray => {
  return Array.isArray(field);
};

const isTypedArray = (field: unknown): field is TypedArray => {
  return typeof field === "function";
};

const createComponentFields = <Definition extends ComponentDefinition>(
  def: Definition,
  size: number
) => {
  const comp = {} as CreatedComponent<Definition>;

  for (const key of Object.keys(def) as Array<keyof Definition>) {
    const fieldDef = def[key];
    const fieldComp = comp[key]

    if (isNestedArray(fieldDef)) {
      const [ArrayConstructor, arraySize] = fieldDef;

      comp[key] = new Array<TypedArray>(size).map(
        () => new ArrayConstructor(arraySize)
      );
    }
    // If key is an array constructor let's initialize it with the world size
    else if (isTypedArray(fieldDef)) {
      comp[key] = new fieldDef(size);
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
  world.$components.push(comp);

  return comp;
};
