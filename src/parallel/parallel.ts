import {Query} from "../query";
import {Worker} from "node:worker_threads";
import {deconstructAtomicSparseSet} from "../collections";

export const parallel = (fn: (...args: any) => void) => {};

export const $defineSystem = (query: Query, url: string) => {
  const workers: Array<Worker> = [];

  const archetypes = query.archetypes.slice(0, 2);

  const initialize = () => {
    console.log("system initialization");
    archetypes.forEach((_, i) => {
      const worker = new Worker(url, {
        workerData: i,
      });

      workers.push(worker);
    });
  };

  const transfer = (args: any) => {
    workers.forEach((worker, i) => {
      worker.postMessage(args);
    });
  };

  const run = async (args: any) => {
    return new Promise<void>((resolve, reject) => {
      let terminations = 0;

      function done({status, ts, id}: any) {
        // console.log(
        //   `message transport duration for worker ${id} : `,
        //   `${(performance.now() - ts).toFixed(3)}ms`
        // );
        if (status === 1) {
          console.log(`worker ${id} done`);
          ++terminations;
          console.timeEnd("run-worker:" + id);
          if (terminations === workers.length) {
            console.log("ALL WORKERS DONE");
            resolve();
          }
        }
      }

      workers.forEach((worker, i) => {
        worker.on("message", done);
        console.time("run-worker:" + i);

        worker.postMessage({
          sset: deconstructAtomicSparseSet(archetypes[i].entities as any),
          ...args,
        });
      });
    });
  };

  const lightRun = async (args?: any) => {
    return new Promise<void>((resolve, reject) => {
      let terminations = 0;

      function done({status, ts, id}: any) {
        if (status === 1) {
          console.log(`worker ${id} done`);
          ++terminations;
          console.timeEnd("run-worker:" + id);
          if (terminations === workers.length) {
            console.log("ALL WORKERS DONE");
            resolve();
          }
        }
      }

      workers.forEach((worker, i) => {
        worker.on("message", done);
        console.time("run-worker:" + i);
        // const entities = archetypes[i].entities.dense;
        worker.postMessage(1);
      });
    });
  };

  const terminate = async () => {
    return await Promise.all(workers.map((worker, i) => worker.terminate()));
  };
  return {
    workers,
    initialize,
    run,
    lightRun,
    terminate,
  };
};

// import {isNode} from "./runtimes";

// // worker = new Worker(makeDataUrl(content), { type: "module" });
// const makeBlob = (content: any) =>
//   new globalThis.Blob([content], {type: "text/javascript"});

// const makeDataUrl = (content: any) => {
//   const data = globalThis.Buffer.from(content).toString();
//   return `data:text/javascript;${data}`;
// };

// const makeContent = (fn: (...args: any[]) => void) => {
//   return `
// 	globalThis.onmessage = async ({data: arguments_}) => {
// 		try {
// 			const output = await (${fn.toString()})(...arguments_);
// 			globalThis.postMessage({output});
// 		} catch (error) {
// 			globalThis.postMessage({error});
// 		}
// 	};
// 	`;
// };

// export const parallel = (fn: (...args: any[]) => void) => {
//   let url: string;
//   let worker: Worker;
//   const content = makeContent(fn);

//   const cleanup = () => {
//     if (url) {
//       URL.revokeObjectURL(url);
//     }

//     worker?.terminate();
//   };

//   if (isNode) {
//     const {Worker} = require("worker_threads");
//     worker = new Worker(makeDataUrl(content), {type: "module"});
//   } else {
//     url = URL.createObjectURL(makeBlob(content));
//     worker = new Worker(url, {type: "module"});
//   }
//   return [
//     (...args: any[]) => {
//       worker.postMessage(args);
//     },
//     cleanup,
//   ];

//   //   return {
//   //     worker,
//   //     cleanup,
//   //   };
// };
