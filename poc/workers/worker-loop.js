import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const $tick = (timer) => {
  Atomics.add(timer, 0, 1);
  Atomics.notify(timer, 0);
};

const $createLoop = (timer) => {
  return (fn) => {
    setInterval(() => {
      $tick(timer);
      fn();
    }, 16);
  };
};

const $onTick = (timer, fn) => {
  setInterval(() => {
    Atomics.wait(timer, 0);
    fn();
  }, 16);
};

if (isMainThread) {
  const timerBuffer = new SharedArrayBuffer(1024);
  const timer = new Int32Array(timerBuffer);

  const worker = new Worker("./poc/workers/worker-loop.js", {
    workerData: timer,
  });

  worker.on("message", (msg) => console.log(`Worker message received: ${msg}`));
  worker.on("error", (error) => console.error(error));
  worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));

  const $loop = $createLoop(timer);

  $loop(() => {
    console.log("main thread tick", {count: timer[0]});
  });
} else {
  const timer = workerData;
  let count = timer[0];

  console.log("worker init", count);

  $onTick(timer, () => {
    console.log("other thread finishes the work");
  });
}
