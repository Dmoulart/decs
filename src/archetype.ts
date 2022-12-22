import {SparseSet} from "./sparse-set";
import {Component} from "./component";

export type Archetype = {
    entities: SparseSet
    componentIds: SparseSet
    edges: {add: Map<Component<any>['id'], Archetype>, remove: Map<Component<any>['id'], Archetype>}
}

export const createArchetype = (components: Component<any>[]): Archetype => {
    const componentIds = components.reduce((sset: SparseSet, component: Component<any>) => {
        sset.insert(component.id)
        return sset
    }, SparseSet())
    return {
        componentIds,
        entities: SparseSet(),
        edges: {add: new Map(), remove: new Map()}
    }
}

export const augmentArchetype = (from: Archetype, component: Component<any>): Archetype => {
    const augmentedArchetype = from.edges.add.get(component.id)

    if(augmentedArchetype){
        return augmentedArchetype
    }
    else{
        const componentIds = from.componentIds.dense.reduce((sset, id) => {
            sset.insert(id)
            return sset
        }, SparseSet())

        componentIds.insert(component.id)

        const archetype = {
            componentIds,
            entities: SparseSet(),
            edges: {add: new Map(), remove: new Map()}
        }

        from.edges.add.set(component.id, archetype)

        return archetype
    }


}

export const diminishArchetype = (from: Archetype, component: Component<any>): Archetype => {
    const diminishedArchetype = from.edges.remove.get(component.id)

    if(diminishedArchetype){
        return diminishedArchetype
    }
    else{
        const componentIds = from.componentIds.dense.reduce((sset, id) => {
            sset.insert(id)
            return sset
        }, SparseSet())

        componentIds.remove(component.id)

        const archetype =  {
            componentIds,
            entities: SparseSet(),
            edges: {add: new Map(), remove: new Map()}
        }

        from.edges.remove.set(component.id, archetype)

        return archetype
    }


}