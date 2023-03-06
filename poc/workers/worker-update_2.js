import {Worker, isMainThread, parentPort, workerData} from "worker_threads";
import {defineComponent} from "../../dist/component";

if (isMainThread) {
  const timerBuffer = new SharedArrayBuffer(1024);
  const timer = new Int32Array(timerBuffer);

  const position = defineComponent(
    {
      x: Int32Array,
      y: Int32Array,
    },
    2_000_000
  );

  const worker = new Worker("./poc/workers/worker-update_2.js", {
    workerData: [timer, position],
  });

  worker.on("message", async (msg) => {
    if (msg === "ready") {
      await $update(timer, worker, position);
      console.log("MAIN -- update finished");
      // If you remove the await the result should be equal to 0
      console.log(
        "position.x[1_500_000] should be equal to 1_500_000 : [result]=",
        position.x[1_500_000]
      );
    }
  });

  worker.on("error", (error) => console.error(error));
  worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));
} else {
  const [timer, position] = workerData;
  let count = timer[0];

  console.log("WORKER -- worker init", count);

  parentPort.postMessage("ready");

  $onUpdate(timer, () => {
    let a = 100 * 200;
    for (let i = 0; i <= 1_500_000; i++) {
      a += i;
      position.x[i] = i;
    }

    parentPort.postMessage({a, type: "result"});
  });
}

/**
 *
 * -----Main Threads methods --------------------------------
 *
 */

function $tick(timer) {
  Atomics.add(timer, 0, 1);
  Atomics.notify(timer, 0);
}

async function $update(timer, worker, position) {
  return new Promise((resolve) => {
    console.log("MAIN-- send update");

    worker.once("message", ({a, type}) => {
      if (type === "result") {
        resolve();
      }
    });

    worker.once("error", (err) => {
      reject(err);
    });

    $tick(timer);
  });
}

/**
 *
 * -----Worker methods --------------------------------
 *
 */
/**
 * @warning Inside $onUpdate the console.log is defered and will be executed when the main thread is finished !
 * @param {*} timer
 * @param {*} fn
 */
function $onUpdate(timer, fn) {
  // Get the current timer count
  let count = Atomics.load(timer, 0);
  // listen for updates
  setInterval(() => {
    const res = Atomics.wait(timer, 0, count);
    fn();
    count = Atomics.load(timer, 0);
  }, 1);
}
