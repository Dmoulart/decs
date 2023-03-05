import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

const now = performance.now;

if (isMainThread) {
  const worker = new Worker("./test/workers/worker.js", {workerData: "hello"});

  worker.on("message", (msg) => {
    console.log(`Worker message received: ${msg}`);
  });
  console.time("post msg");
  worker.postMessage(now());
  console.timeEnd("post msg");
} else {
  const data = workerData;

  console.log("Thread initialized: ");

  parentPort.on("message", (ts) => {
    const duration = (now() - ts).toFixed(3) + "ms";
    console.log(`time to send message: ${duration}`);
  });
}
