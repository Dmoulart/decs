import {parentPort} from "worker_threads";
import {reconstructAtomicSparseSet} from "../../dist/collections/atomics/atomic-sparse-set.js";

parentPort.on("message", ({sset, position}) => {
  try {
    const entities = reconstructAtomicSparseSet(sset);
    const ents = entities.dense;
    const len = ents.length;
    for (let j = 0; j < len; j++) {
      const ent = ents[j];
      position.x[ent] += 15;
      position.y[ent] += 15;
    }
    parentPort.postMessage("done");
  } catch (e) {
    console.error(e);
  }
});
