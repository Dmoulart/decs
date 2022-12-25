export type Bitset = {
    mask: Uint32Array
    has: (val:number) => boolean
    or: (val:number) => void
    xor: (val:number) => void
    contains: (set: Bitset) => boolean
    intersects: (set: Bitset) => boolean
    clone: () => Bitset
    toString: () => string
}

export const BitSet = (size = 4): Bitset => {
    // Must we handle size ourselves or just let the array live ?
    let mask = new Uint32Array(size)

    const resize = () => {
        const newMask = new Uint32Array(size + 1)
        newMask.set(mask)
        mask = newMask
    }

    return {
        mask,
        has(val: number){
            const index = val >>> 5

            if(index > size){
                resize()
                return false
            }

            return Boolean(mask[index] & 1 << (val % 32))
        },
        or(val: number){
            const index = val >>> 5

            if(index > size){
                resize()
            }

            mask[index] |= 1 << (val % 32)
        },
        xor(val: number) {
            const index = val >>> 5

            mask[index] ^= 1 << (val % 32)
        },
        contains(other: Bitset){
            const len = Math.min(mask.length, other.mask.length)
            for(let i = 0; i < len; i++){
                const thisMask = mask[i]
                const otherMask = other.mask[i]
                if((thisMask & otherMask) !== otherMask){
                    return false
                }
            }
            return true
        },
        intersects(other: Bitset){
            const len = Math.min(mask.length, other.mask.length)
            for(let i = 0; i < len; i++){
                const thisMask = mask[i]
                const otherMask = other.mask[i]
                if((thisMask & otherMask) > 0){
                    return true
                }
            }
            return false
        },
        clone(){
            const clone = BitSet(size)
            clone.mask.set(mask)
            return clone
        },
        toString() {
            return mask.join('')
        }
    }
}