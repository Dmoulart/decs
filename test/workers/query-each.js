import {parentPort, workerData} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-sparse-set.js";

parentPort.on("message", ({sset, position, ts}) => {
  try {
    if (ts) {
      console.log(
        ` message transport - worker:${workerData} ${(
          performance.now() - ts
        ).toFixed(3)}ms`
      );
    }
    // console.time(`worker ${workerData}`);
    const entities = reconstructAtomicSparseSet(sset);
    const ents = entities.dense;
    const len = entities.count();
    // console.log(len);
    for (let j = 0; j < len; j++) {
      const ent = ents[j];
      position.x[ent] += 15;
      position.y[ent] += 15;
    }
    // console.timeEnd(`worker ${workerData}`);
    parentPort.postMessage({status: 1, ts: performance.now(), id: workerData});
  } catch (e) {
    console.error(e);
  }
});
