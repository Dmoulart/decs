import "jest";
import {AtomicBitSet, defineComponent, f64, i32, i8, useWorld} from "../src";
import {AtomicSparseSet} from "../src";

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("Atomics", () => {
  it("can be created", () => {
    expect(() => AtomicSparseSet(i32, 10_000)).not.toThrowError();
  });
  it("can insert a number", () => {
    const {insert} = AtomicSparseSet(i32, 10_000);
    expect(() => insert(1)).not.toThrowError();
  });
  it("can insert two times the same number", () => {
    const {insert} = AtomicSparseSet(i32, 10_000);
    insert(1);
    expect(() => insert(1)).not.toThrowError();
  });
  it("it can verify that it has a given value", () => {
    const {insert, has} = AtomicSparseSet(i32, 10_000);
    insert(1);
    expect(has(1)).toStrictEqual(true);
  });
  it("it can verify that it has a given value outside of its bounds", () => {
    const {insert, has, sparse} = AtomicSparseSet(i32, 10_000);
    insert(1);
    expect(has(Number.MAX_VALUE)).toStrictEqual(false);
  });
  it("it can verify that it has not a given value", () => {
    const {insert, has, dense, sparse} = AtomicSparseSet(i32, 10);
    insert(2);
    expect(has(1)).toStrictEqual(false);
  });
  it("it can safely remove an existing value", () => {
    const {remove, insert} = AtomicSparseSet(i32, 10_000);
    insert(1);
    insert(2);
    expect(() => remove(1)).not.toThrowError();
  });
  it("it can safely try to remove a non existing value", () => {
    const {remove, insert} = AtomicSparseSet(i32, 10_000);
    insert(1);
    expect(() => remove(2)).not.toThrowError();
  });
  it("it can remove an existing value", () => {
    const {remove, insert, has} = AtomicSparseSet(i32, 10_000);
    insert(2);
    remove(2);
    expect(has(2)).toStrictEqual(false);
  });
  it("it can give the exact dense array lenght", () => {
    const {insert, count} = AtomicSparseSet(i32, 10_000);
    insert(1);
    insert(2);
    insert(3);
    expect(count()).toEqual(3);
  });

  it("can be created", () => {
    expect(() => AtomicBitSet()).not.toThrowError();
  });
  it("can set value and retrieve it", () => {
    const set = AtomicBitSet();
    set.or(5);
    expect(set.has(5)).toBeTruthy();
    expect(set.has(6)).toBeFalsy();
  });
  it("can flip value", () => {
    const set = AtomicBitSet();
    set.or(5);
    set.xor(5);
    expect(set.has(5)).toBeFalsy();
  });
  it("can test if a set is contained", () => {
    const set = AtomicBitSet();
    set.or(5);
    set.or(6);

    const other = AtomicBitSet();
    other.or(5);

    expect(set.contains(other)).toBeTruthy();
    expect(other.contains(set)).toBeFalsy();
  });
});
