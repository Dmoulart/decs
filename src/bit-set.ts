export type Bitset = ReturnType<typeof BitSet>

export const BitSet = (size: number) => {
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

            if(mask[index] === undefined) throw new Error('BitSet size not sufficient')

            mask[index] |= 1 << (val % 32)
        },
        xor(value: number) {
            const index = value >>> 5

            if(mask[index] === undefined) throw new Error('BitSet size not sufficient')

            mask[index] ^= 1 << (value % 32)
            return this
        },
        clone(){
            const bitSet = BitSet(size)
            bitSet.mask.set(mask)
            return bitSet
        }
    }
}