import {isUint32Array} from "util/types";
import {Bitset} from "../bit-set";

export type AtomicBitSet = Bitset;

type AtomicBitSetBricks = AtomicBitSet["mask"];

const isBitSetReconstruction = (
  options: number | Uint32Array
): options is Uint32Array => {
  return isUint32Array(options);
};

/**
 * Create a new thread safe bitset.
 * It allows to make bitwise operations without the size limitations of a 32 integer.
 * @param size
 * @returns bitset
 */
export function AtomicBitSet(size?: number): AtomicBitSet;
export function AtomicBitSet(mask: Uint32Array): AtomicBitSet;
export function AtomicBitSet(
  sizeOrMask: number | Uint32Array = 4
): AtomicBitSet {
  let buffer: SharedArrayBuffer;
  let mask: Uint32Array;
  let size: number;

  if (isBitSetReconstruction(sizeOrMask)) {
    mask = sizeOrMask;
    size = mask.length;
  } else {
    size = sizeOrMask;
    buffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * size);
    mask = new Uint32Array(buffer);
  }

  const resize = () => {
    buffer = new SharedArrayBuffer(Uint32Array.BYTES_PER_ELEMENT * (size + 2)); // ?? grow factor
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
    },
    xor(val: number) {
      const index = val >>> 5;

      Atomics.xor(mask, index, 1 << (val & 31));
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
      const clone = AtomicBitSet(size as number);
      clone.mask.set(mask);
      return clone;
    },
  };
}

export const deconstructAtomicBitSet = ({
  mask,
}: AtomicBitSet): AtomicBitSetBricks => mask;

export const reconstructAtomicBitSet = (mask: AtomicBitSetBricks) =>
  AtomicBitSet(mask);
