/**
 * The possible types for components entries.
 */
export const Types = Object.freeze({
  i8: Int8Array,
  ui8: Uint8Array,

  i16: Int32Array,
  ui16: Uint16Array,

  i32: Int32Array,
  ui32: Uint32Array,

  f32: Float32Array,
  f64: Float64Array,

  eid: Uint32Array,
});

// The JS typed arrays types we'll use as component fields definitions
export type TypedArrays = typeof Types;
export type TypedArray = TypedArrays[keyof TypedArrays];

// The nested arrays fields will be defined like in bitEcs : a typed array constructor and the length of the array
export type NestedTypedArray = [TypedArray, number];

// A component definition field will consists in simple numeric arrays or nested arrays.
export type ComponentDefinitionField = TypedArray | NestedTypedArray;

export default Types;
