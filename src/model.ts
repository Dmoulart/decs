import {Component, ComponentField, InferComponentDefinition} from "./component";
import {World} from "./world";
import {transformArchetype} from "./archetype";
import {Entity} from "./entity";
import Types, {NestedTypedArray, TypedArray} from "./types";

// export type FactoryB<Components extends Component<any>[]> = {
//   [key in keyof Components[number]]: InferComponentDefinition<
//     Components[number]
//   >[key] extends infer Field
//     ? Field extends TypedArray
//       ? ComponentField<Field>[0]
//       : Field extends NestedTypedArray
//       ? ComponentField<Field>[0]
//       : never
//     : never;
// };
export type FactoryFields<C extends Component<any>> = {
  [key in keyof C]: InferComponentDefinition<C>[key] extends infer Field
    ? Field extends TypedArray
      ? ComponentField<Field>[0]
      : Field extends NestedTypedArray
      ? ComponentField<Field>[0]
      : never
    : never;
};
// // How to loop ?
// export type Factory<Components extends Readonly<Component<any>[]>> = [
//   Components[0] extends undefined ? never : FactoryFields<Components[0]>,
//   Components[1] extends undefined ? never : FactoryFields<Components[1]>,
//   Components[2] extends undefined ? never : FactoryFields<Components[2]>,
//   Components[3] extends undefined ? never : FactoryFields<Components[3]>
// ];

// How to loop ?
// export type Factory<Components extends Readonly<Component<any>[]>> = [
//   FactoryFields<Components[0]>,

// ];
// export type Factory<Components extends Readonly<Component<any>[]>> = [
//   FactoryFields<Components[0]>
// ];

export type Factory<Components extends Readonly<Readonly<Component<any>>[]>> = FactoryFields<Components[number]>[]

const c1 = Component({
  x: Types.i32,
  y: Types.f32,
  z: [Types.f32, 4],
}) 

const c2 = Component({
  test: Types.f64,
});

const f = [c1, c2] as const; // necessary

let t: Factory<typeof f>;
t.0
// t;


export const Model = <Components extends Component<any>[]>(
  world: World,
  ...components: Components
) => {
  let archetype = world.rootArchetype;

  for (const component of components) {
    if (archetype.edge[component.id]) {
      archetype = archetype.edge[component.id]!;
    } else {
      archetype = transformArchetype(archetype, component, world);
    }
  }

  /*
    type ComponentInstance = Omit<Components[number], 'id'>
    type Options = {
        [key in keyof Partial<ComponentInstance>]: InstanceType<ComponentInstance[key]>
    }[]
*/

  /*
   type ComponentDefinition<Comp> = Comp extends Component<infer Definition> ? Definition: never
    let: ComponentInstance<>
    type Options = {
        [key in keyof Partial<ComponentInstance>]: InstanceType<ComponentInstance[key]>
    }[]
*/

  return (...options: Options) => {
    const eid = Entity(world, archetype);
    for (let i = 0; i < options?.length; i++) {
      const opt = options[i];
      for (const key of Object.keys(opt)) {
        components[i][key][eid] = opt[key];
      }
    }
    return eid;
  };
};
