import {parentPort} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/src/collections/atomics/atomic-sparse-set.js";

parentPort.on("message", (ssetParts) => {
  try {
    const sset = reconstructAtomicSparseSet(ssetParts);
    sset.remove(10);

    sset.insert(2);
    sset.insert(3);
  } catch (e) {
    console.error(e);
  }
});
