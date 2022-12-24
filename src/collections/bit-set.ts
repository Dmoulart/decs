export type Bitset = {
    mask: Uint32Array
    has: (val:number) => boolean
    or: (val:number) => void
    xor: (val:number) => void
    contains: (set: Bitset) => boolean
    clone: () => Bitset
}

export const BitSet = (size: number) => {
    // Must we handle size ourselves or just let the array live ?
    let mask = new Uint32Array(size)

    return {
        mask,
        has(val: number){
            const index = val >>> 5

            if(!mask[index]) return false

            return Boolean(mask[index] & 1 << (val % 32))
        },
        or(val: number){
            const index = val >>> 5

            /*if(mask[index] === undefined) throw new Error('BitSet size not sufficient')*/

            mask[index] |= 1 << (val % 32)
        },
        xor(value: number) {
            const index = value >>> 5

            /*if(mask[index] === undefined) throw new Error('BitSet size not sufficient')*/

            mask[index] ^= 1 << (value % 32)
        },
        contains(other: Bitset){
            for(let i = 0; i < mask.length; i++){
                const thisMask = mask[i]
                const otherMask = other.mask[i]
                if((thisMask & otherMask) !== otherMask){
                    return false
                }
            }
            return true
        },
        clone(){
            const bitSet = BitSet(size)
            bitSet.mask.set(mask)
            return bitSet
        }
    }
}