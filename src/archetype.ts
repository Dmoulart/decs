import {SparseSet} from "./sparse-set";
import {Component} from "./component";
import {BitSet, Bitset} from "./bit-set";

export type Archetype = {
    entities: SparseSet
    componentIds: SparseSet
    edges: { add: Map<Component<any>['id'], Archetype>, remove: Map<Component<any>['id'], Archetype> }
    mask: Bitset
}

export const Archetype = (components: Component<any>[]): Archetype => {
    const componentIds = components.reduce((sset: SparseSet, component: Component<any>) => {
        sset.insert(component.id)
        return sset
    }, SparseSet())

    return {
        componentIds,
        entities: SparseSet(),
        edges: { add: new Map(), remove: new Map() },
        mask: BitSet(32)
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
            edges: { add: new Map(), remove: new Map() },
            mask: BitSet(32)
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
            edges: {add: new Map(), remove: new Map()},
            mask: BitSet(32)
        }

        from.edges.remove.set(component.id, archetype)

        return archetype
    }


}