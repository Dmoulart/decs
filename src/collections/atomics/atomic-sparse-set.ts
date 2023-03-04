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
  __cursor: InstanceType<Type>;
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
  cursor?: Type
): AtomicSparseSet<Type> => {
  const denseBuffer = new SharedArrayBuffer(size * ArrayType.BYTES_PER_ELEMENT);
  const dense = denseArray ?? (new ArrayType(denseBuffer) as any); // !

  const sparseBuffer = new SharedArrayBuffer(
    size * ArrayType.BYTES_PER_ELEMENT
  );
  const sparse = sparseArray ?? (new ArrayType(sparseBuffer) as any); // !

  const __cursorBuffer = new SharedArrayBuffer(ArrayType.BYTES_PER_ELEMENT);
  const __cursor = cursor ?? (new ArrayType(__cursorBuffer) as any);

  const insert = (num: number) => {
    // Get the current count
    let tempCount = Atomics.load(__cursor, 0) as unknown as number;

    Atomics.store(dense, tempCount, num);

    // incrementCount();
    // It's way faster without calling the method incrementCount() why .. ?
    // Returns the count before the increment. It could be useful if another threaded operations has happened
    // since the  first tempcount assignation ?
    Atomics.add(__cursor, 0, 1);

    Atomics.store(sparse, num, tempCount + 1);
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

    const last = Atomics.load(dense, count() - 1);
    // remove the last element
    Atomics.store(dense, count() - 1, 0);

    decrementCount();

    if ((last as unknown as number) === num) return;

    const i = Atomics.load(sparse, num);
    Atomics.store(dense, i as unknown as number, last);
    Atomics.store(sparse, last as unknown as number, i);
  };

  const count = () => Atomics.load(__cursor, 0) as unknown as number;

  const incrementCount = () => Atomics.add(__cursor, 0, 1);

  const decrementCount = () => Atomics.sub(__cursor, 0, 1);

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

type AtomicSparseSetBricks<Type extends IntegerTypedArray> = [
  AtomicSparseSet<Type>["dense"],
  AtomicSparseSet<Type>["sparse"],
  AtomicSparseSet<Type>["size"],
  AtomicSparseSet<Type>["__cursor"]
];

export const deconstructAtomicSparseSet = <Type extends IntegerTypedArray>({
  dense,
  sparse,
  size,
  __cursor,
}: AtomicSparseSet<Type>): AtomicSparseSetBricks<Type> => {
  return [dense, sparse, size, __cursor];
};

export const reconstructAtomicSparseSet = <Type extends IntegerTypedArray>([
  dense,
  sparse,
  size,
  __cursor,
]: AtomicSparseSetBricks<Type>) => {
  return AtomicSparseSet(Int32Array, size, dense as any, sparse, __cursor);
};
