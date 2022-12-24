import {BitSet} from "./collections/bit-set";
import {Component} from "./component";
import {World} from "./world";
import {Archetype} from "./archetype";

export const Query = () => {
    const mask = BitSet(32)
    const archetypes: Archetype[] = []
    const matchers: Array<(archetype: Archetype) => boolean> = []

    return {
        mask,
        archetypes,
        all(...components: Component<any>[]) {
            components.forEach(({id}) => mask.or(id))
            matchers.push((arch) => arch.mask.contains(mask))
            return this
        },
        not(...components: Component<any>[]) {
            components.forEach(({id}) => mask.xor(id))
            matchers.push((arch) => mask.contains(arch.mask))
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
