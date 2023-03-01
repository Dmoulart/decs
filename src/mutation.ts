import {Component, Entity, hasComponent} from ".";
import {} from "../dist";
import {PrefabDefinition, PrefabField, PrefabInstanceOptions} from "./prefab";

type MutationDefinition = PrefabDefinition;

export const mutation = <Definition extends MutationDefinition>(
  definition: Definition,
  fields: PrefabInstanceOptions<Definition>
) => {
  return (eid: Entity) => {};
};

/**
 * The prefab instance options is describing the possible parameters for the given prefab definition.
 */
export type SetOptions<Comp extends Component<any>> = PrefabField<Comp>;

export const set = <Comp extends Component<any>>(
  component: Comp,
  options: SetOptions<Comp>,
  entity: Entity
) => {
  for (const field in options) {
    component[field][entity] = options[field];
  }
};
