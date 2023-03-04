import {
  AtomicBitSet,
  deconstructAtomicBitSet,
  reconstructAtomicBitSet,
} from "../src";

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
  it("can be deconstructed and reconstructed", () => {
    const set = AtomicBitSet();
    set.or(1);
    set.or(2);
    set.or(3);
    const reconstructed = reconstructAtomicBitSet(deconstructAtomicBitSet(set));

    expect(reconstructed.has(1)).toStrictEqual(true);
    expect(reconstructed.has(2)).toStrictEqual(true);
    expect(reconstructed.has(3)).toStrictEqual(true);
    expect(reconstructed.has(4)).toStrictEqual(false);
  });
});
