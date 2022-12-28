export type Bitset = {
  /**
   * The bitset mask
   */
  mask: Uint32Array;
  /**
   * Check if the bitset contains the given value
   * @param val
   * @returns true if the set has the given value
   */
  has: (val: number) => boolean;
  /**
   * Set the given value.
   * @param val
   * @returns nothing
   */
  or: (val: number) => void;
  /**
   * Unset the given value
   * @param val
   * @returns nothing
   */
  xor: (val: number) => void;
  /**
   * Returns true if the bitset contains all the values of another bitset
   * @param set
   * @returns
   */
  contains: (set: Bitset) => boolean;
  /**
   * Returns true if the bitset contains any value of another bitset
   * @param set
   * @returns
   */
  intersects: (set: Bitset) => boolean;
  /**
   * Clone the bitset.
   * @returns cloned bitset
   */
  clone: () => Bitset;
  /**
   * Returns a string representation of the bitset
   * @returns string representation
   */
  toString: () => string;
};

/**
 * Create a new bitset.
 * It allows to make bitwise operations without the size limitations of a 32 integer.
 * @param size
 * @returns bitset
 */
export const BitSet = (size = 4): Bitset => {
  let mask = new Uint32Array(size);

  const resize = () => {
    const newMask = new Uint32Array(size + 1);
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

      return Boolean(mask[index] & (1 << (val & 31)));
    },
    or(val: number) {
      const index = val >>> 5;

      if (index > size) {
        resize();
      }

      mask[index] |= 1 << (val & 31);
    },
    xor(val: number) {
      const index = val >>> 5;

      mask[index] ^= 1 << (val & 31);
    },
    contains(other: Bitset) {
      const len = Math.min(mask.length, other.mask.length);
      for (let i = 0; i < len; i++) {
        const thisMask = mask[i];
        const otherMask = other.mask[i];
        if ((thisMask & otherMask) !== otherMask) {
          return false;
        }
      }
      return true;
    },
    intersects(other: Bitset) {
      const len = Math.min(mask.length, other.mask.length);
      for (let i = 0; i < len; i++) {
        const thisMask = mask[i];
        const otherMask = other.mask[i];
        if ((thisMask & otherMask) > 0) {
          return true;
        }
      }
      return false;
    },
    clone() {
      const clone = BitSet(size);
      clone.mask.set(mask);
      return clone;
    },
    toString() {
      return mask.join("");
    },
  };
};
