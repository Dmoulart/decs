import {i32, TypedArray} from "../../types";
import type {SparseSet} from "../sparse-set";

type TypedArrayExceptI8 = Exclude<TypedArray, Int8ArrayConstructor>;
export type AtomicSparseSet<Type extends TypedArrayExceptI8> = Omit<
  SparseSet,
  "dense"
> & {
  dense: InstanceType<Type>;
  sparse: InstanceType<Type>;
};

/**
 * Create a thread safe sparse set.
 * @todo Atomics typed to bigint ???
 * @warning can't use 0 in this set ! 0 represents absence
 * @note without lock it seems faster than our regular sparse set
 * @returns sparse set
 */
export const AtomicSparseSet = <Type extends TypedArrayExceptI8>(
  ArrayType: Type,
  size: number
): AtomicSparseSet<Type> => {
  const denseBuffer = new SharedArrayBuffer(size * ArrayType.BYTES_PER_ELEMENT);
  const dense = new ArrayType(denseBuffer) as any; // !

  const sparseBuffer = new SharedArrayBuffer(
    size * ArrayType.BYTES_PER_ELEMENT
  );
  const sparse = new ArrayType(sparseBuffer) as any; // !

  let __cursor = 1;

  const insert = (num: number) => {
    __cursor++;
    Atomics.store(dense, __cursor, num);
    Atomics.store(sparse, num, __cursor);
  };

  const has = (num: number) => {
    // In case of out of bounds it will trow an invalid atomic access index
    try {
      const sparseIndex = Atomics.load(sparse, num) as unknown as number;
      return !!Atomics.load(dense, sparseIndex);
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
  };
};
