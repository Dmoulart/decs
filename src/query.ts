import {BitSet} from "./collections/bit-set";
import {Component} from "./component";
import {World} from "./world";
import {Archetype} from "./archetype";

const makeComponentsMask = (...components: Component<any>[]) => components.reduce((mask, comp) => {
        mask.or(comp.id)
        return mask
    }, BitSet(32))

export type Matcher = (archetype: Archetype) => boolean

export type Query = ReturnType<typeof Query>

export const Query = () => {
    const mask = BitSet(32)
    const archetypes: Archetype[] = []
    const matchers: Array<Matcher> = []

    return {
        mask,
        matchers,
        archetypes,
        all(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => arch.mask.contains(mask))
            return this
        },
        any(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => arch.mask.intersects(mask))
            return this
        },
        not(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => !arch.mask.intersects(mask))
            return this
        },
        none(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => !arch.mask.contains(mask))
            return this
        },
        match(matcher: Matcher) {
            matchers.push(matcher)
            return this
        },
        from(world: World){
            archloop: for(const archetype of world.archetypes){
                for(const match of matchers){
                    if(!match(archetype)) continue archloop
                }
                archetypes.push(archetype)
            }
            return this
        },
    }
}

export const registerQuery = (query: Query, world: World) => {
    world.queries.push(query.from(world))
}