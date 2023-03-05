import {Worker, isMainThread, parentPort, workerData} from "worker_threads";

if (isMainThread) {
  const worker = new Worker("./test/workers/worker-2.js", {
    workerData: performance.now(),
  });
  worker.on("message", (msg) => console.log(`Worker message received: ${msg}`));
  worker.on("error", (err) => console.error(error));
  worker.on("exit", (code) => console.log(`Worker exited with code ${code}.`));
} else {
  const ts = workerData;
  const now = performance.now();
  parentPort.postMessage(`Post message at \"${(now - ts).toFixed(3)}ms\".`);
}
