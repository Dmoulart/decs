import {ComponentField, InferComponentDefinition, Component} from "./component";
import {World} from "./world";
import {composeArchetype, deriveArchetype} from "./archetype";
import {createEntity} from "./entity";
import {NestedTypedArray, TypedArray} from "./types";
import {createWorld, defineComponent} from ".";

// @todo: This produces a nested array but we're only interested in the second level. Get rid of this level
export type PrefabOptions<Components extends Readonly<Component<any>[]>> = Map<
  Components,
  ComponentsPrefabFields<Components>
>[0];

export type PrefabField<C extends Component<any>> = Omit<
  {
    [key in keyof C]: InferComponentDefinition<C>[key] extends infer Field
      ? Field extends TypedArray
        ? ComponentField<Field>[0]
        : Field extends NestedTypedArray
        ? ComponentField<Field>[0]
        : never
      : never;
  },
  "id" | "data"
>;

type ComponentsPrefabFields<T extends Readonly<Component<any>[]>> = {
  [K in keyof T]: PrefabField<T[K]>;
};

// Map function utility
type Map<T, U> = {[K in keyof T]: U};

/**
 * Creates a factory function to generate entities of a certain type by using
 * objects to initialize its components values.
 * @param world
 * @param components
 * @returns entity factory function
 */
export const prefab = <Components extends Component<any>[]>(
  world: World,
  ...components: Components
) => {
  const archetype = composeArchetype(components, world);

  return (...options: PrefabOptions<Components>) => {
    const eid = createEntity(world, archetype);

    const len = options.length;
    for (let i = 0; i < len; i++) {
      const option = options[i];
      const component = components[i];

      for (const prop in option) {
        component[prop][eid] = option[prop];
      }
    }

    return eid;
  };
};

/**
 * New prefab API
 */

type PrefabDefinition = {
  [key: string]: Component<any>;
};

type PrefabInstanceOptions<Options extends PrefabDefinition> = {
  [ComponentName in keyof Options]?: Partial<
    PrefabField<Options[ComponentName]>
  >;
};
/**
 * Creates a factory function to generate entities of a certain type by using
 * objects to initialize its components values.
 * @param world
 * @param components
 * @returns entity factory function
 */
export const Prefab = <Definition extends Readonly<PrefabDefinition>>(
  world: World,
  definition: Definition
) => {
  const components = Object.values(definition);
  const archetype = composeArchetype(components, world);

  return (options: PrefabInstanceOptions<Definition>) => {
    const eid = createEntity(world, archetype);
    for (const componentName in options) {
      const component = definition[componentName];
      const props = options[componentName];
      for (const prop in props) {
        component[prop][eid] = props![prop];
      }
    }
    return eid;
  };
};
