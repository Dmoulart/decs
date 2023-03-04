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
};

/**
 * Create a thread safe sparse set.
 * @todo Atomics typed to bigint ???
 * @warning can't use 0 in this set ! 0 represents absence
 * @note without lock it seems faster than our regular sparse set
 * @returns sparse set
 */
export const AtomicSparseSet = <Type extends IntegerTypedArray>(
  ArrayType = Int32Array,
  size: number = 10_000,
  denseArray?: Type,
  sparseArray?: Type
): AtomicSparseSet<Type> => {
  const denseBuffer = new SharedArrayBuffer(size * ArrayType.BYTES_PER_ELEMENT);
  const dense = denseArray ?? (new ArrayType(denseBuffer) as any); // !

  const sparseBuffer = new SharedArrayBuffer(
    size * ArrayType.BYTES_PER_ELEMENT
  );
  const sparse = sparseArray ?? (new ArrayType(sparseBuffer) as any); // !

  let __cursor = 0;

  const insert = (num: number) => {
    Atomics.store(dense, __cursor, num);
    __cursor++;
    Atomics.store(sparse, num, __cursor);
  };

  const has = (num: number) => {
    // In case of out of bounds it will trow an invalid atomic access index
    try {
      const sparseIndex = Atomics.load(sparse, num) as unknown as number;
      console.log({sparseIndex});
      return !!Atomics.load(dense, sparseIndex - 1);
    } catch (e) {
      return false;
    }
  };

  const remove = (num: number) => {
    if (!has(num)) return;

    const last = Atomics.load(dense, __cursor);
    Atomics.store(dense, __cursor, 0);
    __cursor--;

    if ((last as unknown as number) === num) return;

    const i = Atomics.load(sparse, num);
    Atomics.store(dense, i as unknown as number, last);
    Atomics.store(sparse, last as unknown as number, i);
  };

  const count = () => __cursor - 1;

  return {
    insert,
    has,
    count,
    remove,
    dense,
    sparse,
    size,
  };
};

export const deconstructAtomicSparseSet = <Type extends IntegerTypedArray>({
  dense,
  sparse,
  size,
}: AtomicSparseSet<Type>): [
  AtomicSparseSet<Type>["dense"],
  AtomicSparseSet<Type>["sparse"],
  number
] => {
  return [dense, sparse, size];
};

export const reconstructAtomicSparseSet = <
  Type extends InstanceType<IntegerTypedArray>
>([dense, sparse, size]: [Type, Type, number]) => {
  return AtomicSparseSet(Int32Array, size, dense as any, sparse);
};
