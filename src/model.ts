import {Component, ComponentDefinition, ComponentField, InferComponentDefinition} from "./component";
import {World} from "./world";
import {transformArchetype} from "./archetype";
import {Entity} from "./entity";
import Types from "./types";

/*export type Factory<Components extends Component<any>[]> = {
    [key in keyof Components[number] ]: Components[number] extends Component<infer Definition> ? Definition : never
}*/
export type Factory<Components extends Component<any>[]> = {
    [key in keyof Components[number]]: ComponentField<InferComponentDefinition<Components[number]>[key]>
}
const c = [Component({
    x: Types.f32,
    y: Types.f32
})]
let t: Factory<typeof c>
t.x
/*t.x*/

export const Model = <Components extends Component<any>[]>(world: World, ...components: Components) => {
    let archetype = world.rootArchetype

    for(const component of components){
        if(archetype.edge[component.id]){
            archetype = archetype.edge[component.id]!
        } else {
            archetype = transformArchetype(archetype, component, world)
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
        const eid = Entity(world, archetype)
        for(let i = 0; i < options?.length; i++){
            const opt = options[i]
            for(const key of Object.keys(opt)){
                components[i][key][eid] = opt[key]
            }
        }
        return eid
    }
}