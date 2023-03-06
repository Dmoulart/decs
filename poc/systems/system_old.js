import {$createWorld, defineComponent} from "../../src";
import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

const $tick = (timer) => {
  console.log("tick");
  Atomics.add(timer, 0, 1);
  Atomics.notify(timer, 0);
};

const $update = async (timer, worker) => {
  return new Promise((resolve) => {
    worker.once("message", ({a, type}) => {
      if (type === "finish") {
        resolve();
      }
    });

    $tick(timer);
  });
};

/**
 * @warning Inside $onUpdate the console.log is defered and will be executed when the main thread is finished !
 * @param {*} timer
 * @param {*} fn
 */
const $onUpdate = (timer, fn) => {
  //   console.log(timer);
  // Get the current timer count
  let count = Atomics.load(timer, 0);
  // listen for updates
  setInterval(() => {
    const res = Atomics.wait(timer, 0, count);
    fn();
    count = Atomics.load(timer, 0);
  }, 1);
};

export const $defineSystem = async (world, fn) => {
  if (isMainThread) {
    const timerBuffer = new SharedArrayBuffer(1024);
    const timer = new Int32Array(timerBuffer);

    const worker = new Worker("./poc/systems/system.js", {
      workerData: timer,
    });

    worker.on("error", (error) => console.error(error));
    worker.on("exit", (code) =>
      console.log(`Worker exited with code ${code}.`)
    );

    const run = async () => {
      console.log("update");
      return await $update(timer, worker);
    };
    return {
      run,
    };
  }
};

if (!isMainThread) {
  const timer = workerData;
  let count = timer[0];

  console.log("WORKER -- worker init", count);

  // parentPort.postMessage("ready");

  $onUpdate(timer, () => {
    fn();
    console.log("WORKER -- on update");
    parentPort.postMessage({a, type: "finish"});
  });
}
