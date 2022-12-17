import {Types} from "./types";
import {World} from "./world";

// The string values of the possible components data types
export type ComponentDataTypeName = keyof typeof Types;

// The possible components data types constructor
export type ComponentDataTypeCtor = typeof Types[ComponentDataTypeName];

// The object passed into the Component factory function
export type ComponentDefinition = {
  [key: string]: ComponentDataTypeCtor;
};

type CreatedComponent<Def extends ComponentDefinition> = {
  $world: World;
} & {[key in keyof Def]: InstanceType<Def[key]>};

export type Component = ReturnType<typeof Component>;

const createComponentFields = <Definition extends ComponentDefinition>(
  def: Definition,
  size: number
) => {
  const comp = {} as CreatedComponent<Definition>;

  for (const [key, val] of Object.entries(def)) {
    // If key is an array constructor let's initialize it with the world size
    if (typeof val === "function") {
      comp[key as keyof typeof def] = new val(size) as any;
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

  return comp;
};

const c = Component(
  {
    hello: Types.f32,
  },
  World()
);
