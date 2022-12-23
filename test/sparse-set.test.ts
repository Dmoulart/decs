import 'jest';
import {SparseSet} from "../src/sparse-set";

describe('SparseSet', () => {
    it('can be created', () => {
        expect(() => SparseSet()).not.toThrowError()
    })
    it('can insert a number', () => {
        const { insert } = SparseSet()
        expect(() => insert(1)).not.toThrowError()
    })
    it('can insert two times the same number', () => {
        const { insert } = SparseSet()
        insert(1)
        expect(() => insert(1)).not.toThrowError()
    })
    it('it can verify that it has a given value', () => {
        const {insert, has} = SparseSet()
        insert(1)
        expect(has(1)).toStrictEqual(true)
    })
    it('it can verify that it has not a given value', () => {
        const {insert, has} = SparseSet()
        insert(2)
        expect(has(1)).toStrictEqual(false)
    })
    it('it can safely remove an existing value', () => {
        const {remove, insert} = SparseSet()
        insert(1)
        insert(2)
        expect(() => remove(1)).not.toThrowError()
    })
    it('it can safely try to remove a non existing value', () => {
        const {remove, insert} = SparseSet()
        insert(1)
        expect(() => remove(2)).not.toThrowError()
    })
    it('it can remove an existing value', () => {
        const {remove, insert, has} = SparseSet()
        insert(2)
        remove(2)
        expect(has(2)).toStrictEqual(false)
    })
    it('it can give the exact dense array lenght', () => {
        const {insert, count} = SparseSet()
        insert(1)
        insert(2)
        insert(3)
        expect(count()).toEqual(3)
    })
});

