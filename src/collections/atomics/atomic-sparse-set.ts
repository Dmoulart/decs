import {TypedArray} from "../../types";
import type {SparseSet} from "../sparse-set";

// @todo differentiate betwwen float and integer array
type IntegerTypedArray = TypedArray;

export type AtomicSparseSet<Type extends IntegerTypedArray> = Omit<
  SparseSet,
  "dense"
> & {
  dense: InstanceType<Type>;
  sparse: InstanceType<Type>;
  size: number;
  __cursor: number;
};

/**
 * Create a thread safe sparse set.
 *
 * @warning can't use 0 in this set ! 0 represents the absence of a value
 * @todo Atomics typed to bigint ?
 * @returns sparse set
 */
export const AtomicSparseSet = <Type extends IntegerTypedArray>(
  ArrayType = Int32Array,
  size: number = 10_000,
  denseArray?: Type,
  sparseArray?: Type,
  cursor = 0
): AtomicSparseSet<Type> => {
  const denseBuffer = new SharedArrayBuffer(size * ArrayType.BYTES_PER_ELEMENT);
  const dense = denseArray ?? (new ArrayType(denseBuffer) as any); // !

  const sparseBuffer = new SharedArrayBuffer(
    size * ArrayType.BYTES_PER_ELEMENT
  );
  const sparse = sparseArray ?? (new ArrayType(sparseBuffer) as any); // !

  const __cursorBuffer = new SharedArrayBuffer(ArrayType.BYTES_PER_ELEMENT);
  let __cursor = cursor;

  const insert = (num: number) => {
    Atomics.store(dense, __cursor, num);
    __cursor++;
    Atomics.store(sparse, num, __cursor);
  };

  const has = (num: number) => {
    // In case of out of bounds it will trow an invalid atomic access index
    try {
      const sparseIndex = Atomics.load(sparse, num) as unknown as number;
      return (
        (Atomics.load(dense, sparseIndex - 1) as unknown as number) === num
      );
    } catch (e) {
      // if sparse index === - 1 or is out of bounds maybe do a upper check ?
      // console.error(e);
      return false;
    }
  };

  const remove = (num: number) => {
    if (!has(num)) return;

    const last = Atomics.load(dense, __cursor - 1);
    // remove the last element
    Atomics.store(dense, __cursor - 1, 0);

    __cursor--;

    if ((last as unknown as number) === num) return;

    const i = Atomics.load(sparse, num);
    Atomics.store(dense, i as unknown as number, last);
    Atomics.store(sparse, last as unknown as number, i);
  };

  const count = () => __cursor;

  return {
    insert,
    has,
    count,
    remove,
    dense,
    sparse,
    size,
    __cursor,
  };
};

export const deconstructAtomicSparseSet = <Type extends IntegerTypedArray>({
  dense,
  sparse,
  size,
  count,
}: AtomicSparseSet<Type>): [
  AtomicSparseSet<Type>["dense"],
  AtomicSparseSet<Type>["sparse"],
  number,
  number
] => {
  return [dense, sparse, size, count()];
};

export const reconstructAtomicSparseSet = <
  Type extends InstanceType<IntegerTypedArray>
>([dense, sparse, size, __cursor]: [Type, Type, number, number]) => {
  return AtomicSparseSet(Int32Array, size, dense as any, sparse, __cursor);
};
