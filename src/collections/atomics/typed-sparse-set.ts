import {TypedArray} from "../../types";
import type {SparseSet} from "../sparse-set";

export type TypedSparseSet<Type extends TypedArray> = Omit<
  SparseSet,
  "dense"
> & {
  dense: InstanceType<Type>;
};

/**
 * Create a thread safe sparse set.
 * Single threaded typed SparseSet work in progress
 * @warning can't use 0 in this set ! 0 represents absence
 * @note without lock it seems faster than our regular sparse set
 * @returns sparse set
 */
export const TypedSparseSet = <Type extends TypedArray>(
  ArrayType: Type,
  size: number
): TypedSparseSet<Type> => {
  const denseBuffer = new SharedArrayBuffer(size * ArrayType.BYTES_PER_ELEMENT);
  const dense = new ArrayType(denseBuffer) as any; // !

  const sparseBuffer = new SharedArrayBuffer(
    size * ArrayType.BYTES_PER_ELEMENT
  );
  const sparse = new ArrayType(sparseBuffer) as any; // !

  let __cursor = 0;

  const insert = (num: number) => {
    dense[__cursor] = num;
    __cursor++;
    sparse[num] = __cursor;
  };

  const has = (num: number) => dense[sparse[num]] === num;

  const remove = (num: number) => {
    if (!has(num)) return;

    const last = dense[__cursor];
    __cursor--;
    dense[__cursor] = 0;

    if (last === num) return;

    const i = sparse[num];
    dense[i] = last;
    sparse[last] = i;
  };

  const count = () => __cursor;

  return {
    insert,
    has,
    count,
    remove,
    dense,
    sparse,
  };
};
