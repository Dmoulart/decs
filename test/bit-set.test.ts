import 'jest';
import {BitSet} from "../src/collections/bit-set";

describe('BitSet', () => {
    it('can be created', () => {
        expect(() => BitSet(32)).not.toThrowError()
    })
    it('can set value and retrieve it', () => {
        const set = BitSet(32)
        set.or(5)
        expect(set.has(5)).toBeTruthy()
        expect(set.has(6)).toBeFalsy()
    })
    it('can flip value', () => {
        const set = BitSet(32)
        set.or(5)
        set.xor(5)
        expect(set.has(5)).toBeFalsy()
    })
    it('can test if a set is contained', () => {
        const set = BitSet(32)
        set.or(5)
        set.or(6)

        const other = BitSet(32)
        other.or(5)

        expect(set.contains(other)).toBeTruthy()
    })
});

