import {AtomicBitSet} from "../src";

describe("AtomicBitSet", () => {
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
