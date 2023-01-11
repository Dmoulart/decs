import {Component, ComponentField, InferComponentDefinition} from "./component";
import {World} from "./world";
import {deriveArchetype} from "./archetype";
import {Entity} from "./entity";
import {NestedTypedArray, TypedArray} from "./types";

// This produces a nested array but we're only interested in the second level. I don't know how to get rid of this level yet
export type Factory<Components extends Readonly<Component<any>[]>> = Map<
  Components,
  ComponentsFactoryFields<Components>
>[0];

export type FactoryFields<C extends Component<any>> = {
  [key in keyof C]: InferComponentDefinition<C>[key] extends infer Field
    ? Field extends TypedArray
      ? ComponentField<Field>[0]
      : Field extends NestedTypedArray
      ? ComponentField<Field>[0]
      : never
    : never;
};

type ComponentsFactoryFields<T extends Readonly<Component<any>[]>> = {
  [K in keyof T]: Omit<FactoryFields<T[K]>, "id">;
};

// Map function utility
type Map<T, U> = {[K in keyof T]: U};


export const Model = <Components extends Readonly<Component<any>[]>>(
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

  return (...options: Factory<Components>) => {
    const eid = Entity(world, archetype);

    const len = options.length
    for (let i = 0; i < len; i++) {
      const opt = options[i];
      const component = components[i]
      for (const key of Object.keys(opt)) {
        component[key][eid] = opt[key];
      }
    }
    return eid;
  };
};
