export type SparseSet = {
  /**
   * Insert a new number in the set.
   * @param num
   * @returns nothing
   */
  insert: (num: number) => void;
  /**
   * Check if the given number is already in the set.
   * @param num
   * @returns number is already in the set
   */
  has: (num: number) => boolean;
  /**
   * Get the number of elements in the set.
   * @returns number of elements in the set
   */
  count: () => number;
  /**
   * Remove a number from the set.
   * @param num
   * @returns nothing
   */
  remove: (num: number) => void;
  /**
   * The elements contained in the set
   */
  dense: number[];
};

/**
 * Create a new sparse set.
 * @returns sparse set
 */
export const SparseSet = () => {
  const dense: number[] = [];
  const sparse: number[] = [];

  const insert = (num: number) => (sparse[num] = dense.push(num) - 1);

  const has = (num: number) => !!dense[sparse[num]];

  const remove = (num: number) => {
    if (!has(num)) return;

    const last = dense.pop()!;

    if (last === num) return;

    const i = sparse[num];
    dense[i] = last;
    sparse[last] = i;
  };

  const count = () => dense.length;

  return {
    insert,
    has,
    count,
    remove,
    dense,
  };
};
