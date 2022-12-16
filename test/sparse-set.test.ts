import  'jest';
import {SparseSet} from "../src/sparse-set";


describe('Sparse set', () => {
    it('can be created', () => {
        expect(() => SparseSet()).not.toThrowError()
    })
    it('can insert', () => {
        const sset = SparseSet()

        expect(() => sset.insert(1)).not.toThrowError()
    })
});