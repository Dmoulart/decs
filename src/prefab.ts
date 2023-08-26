import { World } from "./world";
import { deriveArchetype } from "./archetype";
import { createEntity } from "./entity";
import {ComponentField, InferComponentDefinition, Component} from "./component";
import {ArrayFieldType, FieldType} from "./types";
// @todo: This produces a nested array but we're only interested in the second level. Get rid of this level
export type PrefabOptions<Components extends Readonly<Component<any>[]>> = Map<
  Components,
  ComponentsPrefabFields<Components>
>[0];

export type PrefabField<C extends Component<any>> = Omit<
  {
    [key in keyof C]: InferComponentDefinition<C>[key] extends infer Field
      ? Field extends FieldType
        ? ComponentField<Field>[0]
        : Field extends ArrayFieldType
        ? ComponentField<Field>[0]
        : never
      : never;
  },
  "id" | "data"
>;

export type ComponentsPrefabFields<T extends Readonly<Component<any>[]>> = {
  [K in keyof T]: PrefabField<T[K]>;
};

// Map function utility
type Map<T, U> = {[K in keyof T]: U};

/**
 * The prefab definition is an object grouping the prefab's specific set of components.
 * @example const definition: PrefabDefinition = { sprite, velocity, health }
 */
export type PrefabDefinition = Readonly<{
  [key: string]: Component<any>;
}>;
/**
 * The prefab instance options is describing the possible parameters for the given prefab definition.
 */
export type PrefabInstanceOptions<Options extends PrefabDefinition> = {
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
export const prefab = <Components extends Readonly<Component<any>[]>>(
  world: World,
  ...components: Components
) => {
  let archetype = world.rootArchetype;

  for (const component of components) {
    if (archetype.edge[component.id]) {
      archetype = archetype.edge[component.id]!;
    } else {
      archetype = deriveArchetype(archetype, component, world);
    }
  }

  return (...options: PrefabOptions<Components>) => {
    const eid = createEntity(world, archetype);

    const len = options.length
    for (let i = 0; i < len; i++) {
      const option = options[i];
      const component = components[i]
      const props = Object.keys(option)

      for (const prop of props) {
         component[prop][eid] = option[prop];
      }
    }
    return eid;
  };
};