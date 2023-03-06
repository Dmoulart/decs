import {parentPort} from "worker_threads";
import {reconstructAtomicBitSet} from "../../dist/src/collections/atomics/atomic-bit-set.js";

parentPort.on("message", (bitsetParts) => {
  try {
    const bitset = reconstructAtomicBitSet(bitsetParts);
    bitset.or(5);
  } catch (e) {
    console.error(e);
  }
});
