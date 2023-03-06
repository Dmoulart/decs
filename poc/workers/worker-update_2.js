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

  onWorkerReady(worker, async () => {
    console.log("WORKER1-- START !");
    console.time("update");
    await $update(timer, worker);
    console.timeEnd("update");
    // console.log("WORKER1 -- update finished");
    // If you remove the await the result should be equal to 0
    console.log(
      "position.x[1_500_000] should be equal to 1_500_000 : [result]=",
      position.x[1_500_000]
    );
  });

  // const worker2 = new Worker("./poc/workers/worker-update_2.js", {
  //   workerData: [timer, position],
  // });

  // onWorkerReady(worker2, async () => {
  //   console.log("WORKER2-- START !");
  //   console.time("update2");
  //   await$update(timer, worker2).then(() => console.log("worker 2 DONE !"));
  //   console.timeEnd("update2");
  //   // console.log("WORKER2 -- update finished");
  //   // If you remove the await the result should be equal to 0
  //   console.log(
  //     "position.x[1_500_000] should be equal to 1_500_000 : [result]=",
  //     position.x[1_500_000]
  //   );
  // });

  worker.on("error", (error) => console.error(error));
  worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));
} else {
  const [timer, position] = workerData;
  let count = timer[0];

  console.log("WORKER -- worker init", count);

  parentPort.postMessage("ready");

  $onUpdate(timer, () => {
    for (let i = 0; i <= 1_500_000; i++) {
      position.x[i] = i;
    }

    parentPort.postMessage({type: "result"});
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

async function $update(timer, worker) {
  return new Promise((resolve, reject) => {
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

function onWorkerReady(worker, fn) {
  worker.on("message", async (msg) => {
    if (msg === "ready") {
      await fn();
    }
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
