import {Types} from "./types";
import {World} from "./world";

// The string values of the possible components data types
export type ComponentDataTypeName = keyof typeof Types;

// The possible components data types constructor
export type ComponentDataType = typeof Types[ComponentDataTypeName];

// The object passed into the Component factory function
export type ComponentDefinition = {
  [key: string]: ComponentDataType | Array<ComponentDataType>;
};

export type CreatedComponent<Def extends ComponentDefinition> = {
  $world: World;
} & {[key in keyof Def]: Def[key]};

export type Component = ReturnType<typeof Component>;

const createComponentFields = <Definition extends ComponentDefinition>(
  def: Definition,
  size: number
) => {
  const comp = {} as CreatedComponent<Definition>;

  for (const key of Object.keys(def)) {
    if (def[key] === Array) {
      console.log("is array", def[key]);
      //   createComponentFields(def[key as keyof typeof def] as any, size);
      (comp[key as keyof typeof def] as any) = new Array(size).fill(() => []);
      console.log(comp[key as keyof typeof def] as any);
    }
    // If key is an array constructor let's initialize it with the world size
    else if (typeof def[key] === "function") {
      comp[key as keyof typeof def] = new (def[key] as any)(
        size
      ) as any;
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

const c = Component(
  {
    hello: Types.f32,
  },
  World()
);
