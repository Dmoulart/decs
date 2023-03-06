import {parentPort, Worker, workerData} from "node:worker_threads";

export type System = {
  run: () => Promise<void>;
  terminate: () => Promise<number>;
};
export type ParallelTimer = Int32Array;

export const $defineSystem = async (url: string, args: any) => {
  return new Promise<System>((resolve, reject) => {
    const timerBuffer = new SharedArrayBuffer(1024);
    const timer = new Int32Array(timerBuffer);

    const worker = new Worker(url, {
      workerData: [timer, args],
    });

    worker.on("error", (error) => console.error(error));
    worker.on("exit", (code) =>
      console.log(`Worker exited with code ${code}.`)
    );

    const system: System = {
      run: async () => await $update(timer, worker),
      terminate: async () => await worker.terminate(),
    };

    worker.on("message", (message) => {
      if (message === "ready") {
        resolve(system);
      }
    });
  });
};

function $tick(timer: ParallelTimer) {
  Atomics.add(timer, 0, 1);
  Atomics.notify(timer, 0);
}

async function $update(timer: ParallelTimer, worker: Worker) {
  return new Promise<void>((resolve, reject) => {
    console.log("MAIN-- send update");

    worker.once("message", ({a, type}) => {
      if (type === "result") {
        resolve();
      }
    });

    worker.once("error", (err) => {
      err ? reject(err) : reject();
    });

    $tick(timer);
  });
}

/**
 * @warning Inside $onUpdate the console.log is defered and will be executed when the main thread is finished !
 * @param {*} timer
 * @param {*} fn
 */
function $onUpdate(timer: ParallelTimer, fn: () => void) {
  // Get the current timer count
  let count = Atomics.load(timer, 0);
  // listen for updates
  setInterval(() => {
    const res = Atomics.wait(timer, 0, count);
    fn();
    parentPort!.postMessage({type: "result"});
    count = Atomics.load(timer, 0);
    // parentPort!.postMessage({type: "result"});
  }, 1);
}

// export type $OnUpdate = typeof $onUpdate;

export type $SystemContext = {
  $onUpdate: (fn: () => void) => void;
};

export const $expose = (fn: (ctx?: $SystemContext, ...args: any) => void) => {
  const [timer, args] = workerData;
  let count = timer[0];

  console.log("WORKER -- worker init", count);

  parentPort!.postMessage("ready");

  const ctx = {
    $onUpdate: (fn: () => void) => $onUpdate(timer, fn),
  };

  fn(ctx, args);
};
