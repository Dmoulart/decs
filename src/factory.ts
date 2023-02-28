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
import {createEntity} from "./entity";

export function factory<Def extends ComponentDefinition>(
  definition: Def,
  world: World
) {
  const component = defineComponent(definition);

  const create = (def: Omit<PrefabField<typeof component>, "id" | "data">) => {
    return (entity: Entity) => {
      attach(component, entity, world);
      for (const prop in def) {
        component[prop][entity] = def[prop];
      }
    };
  };

  return [component, create] as const;
}

export const createSpawnFunction = (world: World) => {
  return (componentsFn: Array<(entity: Entity) => void>) => {
    const eid = createEntity(world);
    for (const componentFn of componentsFn) {
      componentFn(eid);
    }
  };
};
