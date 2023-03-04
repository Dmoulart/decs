import {parentPort} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-sparse-set.js";

// const {
//   reconstructAtomicSparseSet,
// } = require("../../dist/collections/atomics/atomic-sparse-set.js");

parentPort.on("message", (ssetParts) => {
  const sset = reconstructAtomicSparseSet(ssetParts);
  sset.remove(10);
  sset.insert(2);
  sset.insert(3);
});
