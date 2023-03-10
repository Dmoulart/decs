export const i8 = Int8Array
export const ui8 = Uint8Array

export const i16 = Int16Array
export const ui16 = Uint16Array

export const i32 = Int32Array
export const ui32 = Uint32Array

export const f32 = Float32Array
export const f64 = Float64Array

export const eid = Uint32Array

/**
 * The possible types for components entries.
 */
export const Types = Object.freeze({
  i8,
  ui8,
  i16,
  ui16,
  i32,
  ui32,
  f32,
  f64,
  eid,
});

// The JS typed arrays types we'll use as component fields definitions
export type TypedArrays = typeof Types;
export type TypedArray = TypedArrays[keyof TypedArrays];

// The nested arrays fields will be defined like in bitECS : a typed array constructor and the length of the array
export type NestedTypedArray = [TypedArray, number];

export default Types;
