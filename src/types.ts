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

  string: Array,

  //   array: [],
});

export default Types;
