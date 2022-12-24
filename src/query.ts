import {BitSet} from "./collections/bit-set";
import {Component} from "./component";
import {World} from "./world";
import {Archetype} from "./archetype";

const makeComponentsMask = (...components: Component<any>[]) => components.reduce((mask, comp) => {
        mask.or(comp.id)
        return mask
    }, BitSet(32))

export const Query = () => {
    const mask = BitSet(32)
    const archetypes: Archetype[] = []
    const matchers: Array<(archetype: Archetype) => boolean> = []

    return {
        mask,
        archetypes,
        all(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => arch.mask.contains(mask))
            return this
        },
        some(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => arch.mask.intersects(mask))
            return this
        },
        not(...components: Component<any>[]) {
            const mask = makeComponentsMask(...components)
            matchers.push((arch) => !arch.mask.intersects(mask))
            return this
        },
        from(world: World){
            for(const archetype of world.archetypes){
                for(const match of matchers){
                    if(match(archetype)){
                        archetypes.push(archetype)
                        break
                    }
                }
            }
            return this
        }

    }
}
