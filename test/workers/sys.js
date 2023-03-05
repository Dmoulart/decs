import {parentPort, workerData} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-sparse-set.js";

console.log(`System thread ${workerData} initialized`);

