// import {attach, Component, Entity, hasComponent, World} from ".";
// import {} from "../dist";
// import {PrefabDefinition, PrefabField, PrefabInstanceOptions} from "./prefab";

// type MutationDefinition = PrefabDefinition;

// export const mutation = <Definition extends MutationDefinition>(
//   definition: Definition,
//   defaultValues?: PrefabInstanceOptions<Definition>
// ) => {
//   const components = Object.values(definition);

//   // const inlineAssignation = makeInlinePrefabDefaultAssignationFunction(definition, fields);
//   return (
//     entity: Entity,
//     options: PrefabInstanceOptions<Definition>,
//     world?: World
//   ) => {
//     for (const component of components) {
//       for (const field in options) {
//         component[field][entity] = options[field];
//       }
//     }
//   };
// };

// /**
//  * The prefab instance options is describing the possible parameters for the given prefab definition.
//  */
// export type SetOptions<Comp extends Component<any>> = PrefabField<Comp>;

// export const set = <Comp extends Component<any>>(
//   entity: Entity,
//   component: Comp,
//   options: Partial<SetOptions<Comp>>,
//   world?: World
// ) => {
//   if (world && !hasComponent(component, entity, world)) {
//     attach(component, entity, world);
//   }
//   for (const field in options) {
//     component[field][entity] = options[field];
//   }
// };
