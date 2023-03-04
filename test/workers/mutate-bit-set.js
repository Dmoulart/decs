import {parentPort} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-bit-set.js";

parentPort.on("message", (bitsetParts) => {
  try {
    const bitset = reconstructAtomicBitset(bitsetParts);
    bitset.or(5);
  } catch (e) {
    console.error(e);
  }
});
