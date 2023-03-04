import {AtomicSparseSet, i32} from "../src";

describe("AtomicSparseSet", () => {
  it("can be created", () => {
    expect(() => AtomicSparseSet(i32, 12)).not.toThrowError();
  });
  it("can insert a number", () => {
    const {insert} = AtomicSparseSet(i32, 12);
    expect(() => insert(1)).not.toThrowError();
  });
  it("can insert two times the same number", () => {
    const {insert} = AtomicSparseSet(i32, 12);
    insert(1);
    expect(() => insert(1)).not.toThrowError();
  });
  it("can verify that it has a given value", () => {
    const {insert, has} = AtomicSparseSet(i32, 12);
    insert(1);
    expect(has(1)).toStrictEqual(true);
  });
  it("can verify that it has a given value outside of its bounds", () => {
    const {insert, has, sparse} = AtomicSparseSet(i32, 12);
    insert(1);
    expect(has(Number.MAX_VALUE)).toStrictEqual(false);
  });
  it("can verify that it has not a given value", () => {
    const {insert, has, dense, sparse} = AtomicSparseSet(i32, 10);
    insert(2);
    expect(has(1)).toStrictEqual(false);
  });
  it("can safely remove an existing value", () => {
    const {remove, insert} = AtomicSparseSet(i32, 12);
    insert(1);
    insert(2);
    expect(() => remove(1)).not.toThrowError();
  });
  it("can safely try to remove a non existing value", () => {
    const {remove, insert} = AtomicSparseSet(i32, 12);
    insert(1);
    expect(() => remove(2)).not.toThrowError();
  });
  it("can remove an existing value", () => {
    const {remove, insert, has} = AtomicSparseSet(i32, 12);
    insert(2);
    remove(2);

    expect(has(2)).toStrictEqual(false);
  });
  it("can insert a number, remove it, and add others", () => {
    const {insert, remove, has} = AtomicSparseSet(i32, 12);

    insert(10);
    expect(has(10)).toStrictEqual(true);

    remove(10);
    insert(2);

    expect(has(10)).toStrictEqual(false);
    expect(has(2)).toStrictEqual(true);
  });
  it("can give the exact dense array lenght", () => {
    const {insert, count} = AtomicSparseSet(i32, 12);
    insert(1);
    insert(2);
    insert(3);
    expect(count()).toEqual(3);
  });
  it("can give the exact dense array lenght after deletions", () => {
    const {insert, count, remove} = AtomicSparseSet(i32, 12);
    insert(1);
    insert(2);
    insert(3);

    expect(count()).toEqual(3);

    remove(3);

    expect(count()).toEqual(2);
  });
});
