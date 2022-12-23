import {SparseSet} from "./collections/sparse-set";
import {Component} from "./component";
import {BitSet, Bitset} from "./collections/bit-set";
import {World} from "./world";

export type Archetype = {
    entities: SparseSet
    edges: { add: Map<Component<any>['id'], Archetype>, remove: Map<Component<any>['id'], Archetype> }
    mask: Bitset
    world: World
}

export const Archetype = (components: Component<any>[], world: World): Archetype => {
    const mask = components.reduce((mask, {id}) => {
           mask.or(id)
           return mask
    }, BitSet(32))

    const archetype = {
        entities: SparseSet(),
        edges: { add: new Map(), remove: new Map() },
        mask,
        world
    }

    world.archetypes.push(archetype)

    return archetype
}

export const augmentArchetype = (from: Archetype, component: Component<any>): Archetype => {
    const augmentedArchetype = from.edges.add.get(component.id)

    if(augmentedArchetype){
        return augmentedArchetype
    }
    else{
        const mask = from.mask.clone()
        mask.or(component.id)

        const archetype = {
            entities: SparseSet(),
            edges: { add: new Map(), remove: new Map() },
            mask,
            world: from.world
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
        const mask = from.mask.clone()
        mask.xor(component.id)

        const archetype =  {
            entities: SparseSet(),
            edges: {
                add: new Map(),
                remove: new Map()
            },
            mask,
            world: from.world
        }

        from.edges.remove.set(component.id, archetype)

        return archetype
    }
}