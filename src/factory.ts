/**
 *
 * ------------------------
 * Component creation factory api experimentation
 * ------------------------
 *
 */

import {
  ComponentDefinition,
  defineComponent,
  PrefabField,
  Entity,
  World,
  attach,
} from ".";
import {composeArchetype} from "./archetype";
import {createEntity, nextEid} from "./entity";

export function factory<Def extends ComponentDefinition>(
  definition: Def,
  world: World
) {
  const component = defineComponent(definition);

  function create(def: PrefabField<typeof component>) {
    function attachComponent(entity: Entity) {
      attach(component, entity, world);
      for (const prop in def) {
        component[prop][entity] = def[prop];
      }
    }
    (attachComponent as any).component = component;
    return attachComponent;
  }

  // Keep a reference to the component in the create function
  //   create.component = component;

  return [component, create] as const;
}

export const createSpawnFunction = (world: World) => {
  return (...componentsFn: Array<(entity: Entity) => void>) => {
    const eid = createEntity(world);
    for (const componentFn of componentsFn) {
      componentFn(eid);
    }
    return eid;
  };
};

// export const createSpawnFunction = (world: World) => {
//   return (...componentsFn: Array<(entity: Entity) => void>) => {
//     const components = [];

//     for (const componentFn of componentsFn) {
//       components.push((componentFn as any).component);
//     }
//     const archetype = composeArchetype(components, world);
//     const eid = createEntity(world, archetype);
//     for (const componentFn of componentsFn) {
//       componentFn(eid);
//     }
//     return eid;
//   };
// };
