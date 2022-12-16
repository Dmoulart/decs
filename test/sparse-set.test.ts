import  'jest';
import {SparseSet} from "../src/sparse-set";


describe('Sparse set', () => {
    it('can be created', () => {
        expect(() => SparseSet()).not.toThrowError()
    })
});