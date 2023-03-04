import {Bitset} from "../bit-set";

export type AtomicBitset = Bitset;
/**
 * Create a new thread safe bitset.
 * It allows to make bitwise operations without the size limitations of a 32 integer.
 * @param size
 * @returns bitset
 */
export const AtomicBitSet = (size = 4): AtomicBitset => {
  let buffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * size);
  let mask = new Uint32Array(buffer);

  const resize = () => {
    buffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * (size + 1)); // ?? grow factor
    const newMask = new Uint32Array(buffer);
    newMask.set(mask);
    mask = newMask;
  };

  return {
    mask,
    has(val: number) {
      const index = val >>> 5;

      if (index > size) {
        resize();
        return false;
      }

      return Boolean(Atomics.load(mask, index) & (1 << (val & 31)));
    },
    or(val: number) {
      const index = val >>> 5;

      if (index > size) {
        resize();
      }
      Atomics.or(mask, index, 1 << (val & 31));
      // mask[index] |= 1 << (val & 31);
    },
    xor(val: number) {
      const index = val >>> 5;

      Atomics.xor(mask, index, 1 << (val & 31));
      // mask[index] ^= 1 << (val & 31);
    },
    contains(other: Bitset) {
      const len = Math.min(mask.length, other.mask.length);
      for (let i = 0; i < len; i++) {
        const thisMask = Atomics.load(mask, i);
        const otherMask = Atomics.load(other.mask, i);
        if ((thisMask & otherMask) !== otherMask) {
          return false;
        }
      }
      return true;
    },
    intersects(other: Bitset) {
      const len = Math.min(mask.length, other.mask.length);
      for (let i = 0; i < len; i++) {
        const thisMask = Atomics.load(mask, i);
        const otherMask = Atomics.load(other.mask, i);
        if ((thisMask & otherMask) > 0) {
          return true;
        }
      }
      return false;
    },
    clone() {
      const clone = AtomicBitSet(size);
      clone.mask.set(mask);
      return clone;
    },
    toString() {
      return mask.join("");
    },
  };
};
