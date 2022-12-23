import 'jest';
import {BitSet} from "../src/bit-set";

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
});

