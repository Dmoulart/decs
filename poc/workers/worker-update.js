import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const $update = (timer) => {
  console.log("send update");
  Atomics.add(timer, 0, 1);
  Atomics.notify(timer, 0);
};

const $onUpdate = (timer, fn) => {
  // Get the current timer count
  let count = Atomics.load(timer, 0);
  // listen for updates
  setInterval(() => {
    const res = Atomics.wait(timer, 0, count);
    fn();
    count = Atomics.load(timer, 0);
  }, 1);
};

if (isMainThread) {
  const timerBuffer = new SharedArrayBuffer(1024);
  const timer = new Int32Array(timerBuffer);

  const worker = new Worker("./poc/workers/worker-update.js", {
    workerData: timer,
  });

  worker.on("message", async (msg) => {
    if (msg === "ready") {
      $update(timer);
      await sleep(1);
      $update(timer);
      await sleep(1);
      $update(timer);
    }
  });

  worker.on("error", (error) => console.error(error));
  worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));
} else {
  const timer = workerData;
  let count = timer[0];

  console.log("worker init", count);

  parentPort.postMessage("ready");

  $onUpdate(timer, () => {
    console.log("worker updated");
    // console.log("worker update");
  });
}

// import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

// const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const $update = (timer) => {
//   console.log("send update");
//   Atomics.add(timer, 0, 1);
//   Atomics.notify(timer, 0);
// };

// const $onUpdate = (timer, fn) => {
//   // Get the current timer count
//   let count = Atomics.load(timer, 0);
//   // listen for updates
//   setInterval(() => {
//     // is count still the same ? if yes sleep
//     // console.log("----Must wait ? ----", {count});
//     const res = Atomics.wait(timer, 0, count);
//     // console.log(res, "value : ", {count: Atomics.load(timer, 0)});
//     fn();
//     console.log("worker updated");
//     count = Atomics.load(timer, 0);
//   }, 16);
// };

// if (isMainThread) {
//   const timerBuffer = new SharedArrayBuffer(1024);
//   const timer = new Int32Array(timerBuffer);

//   const worker = new Worker("./poc/workers/worker-update.js", {
//     workerData: timer,
//   });

//   worker.on("message", async (msg) => {
//     if (msg === "ready") {
//       $update(timer);
//       await sleep(16);
//       $update(timer);
//       await sleep(16);
//       $update(timer);
//     }
//   });

//   worker.on("error", (error) => console.error(error));
//   worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));
// } else {
//   const timer = workerData;
//   let count = timer[0];

//   console.log("worker init", count);

//   parentPort.postMessage("ready");

//   $onUpdate(timer, () => {
//     // console.log("worker update");
//   });
// }
