import {parentPort, workerData} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-sparse-set.js";

console.log(`Thread ${workerData} initialized`);

parentPort.on("message", () => {
  try {
    // if (ts) {
    //   console.log(
    //     ` message transport - worker:${workerData} ${(
    //       performance.now() - ts
    //     ).toFixed(3)}ms`
    //   );
    // }
    parentPort.postMessage({status: 1, ts: performance.now(), id: workerData});
    // return
    // let somevar = 0;
    // // console.time(`worker ${workerData}`);
    // // const entities = reconstructAtomicSparseSet(sset);
    // // const ents = entities.dense;
    // const len = entities.length;
    // // console.log(len);
    // for (let j = 0; j < len; j++) {
    //   const ent = entities[j];
    //   somevar = ent;
    // }
    // // console.timeEnd(`worker ${workerData}`);
    // parentPort.postMessage({status: 1, ts: performance.now(), id: workerData});
  } catch (e) {
    console.error(e);
  }
});
