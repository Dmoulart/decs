import {workerData, parentPort} from "worker_threads";
// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"

// const PositionDataX = workerData;
// console.log("In Worker : before", PositionDataX[0]);
// PositionDataX[0] = 100;

parentPort.postMessage("ok");

parentPort.on("message", ({Position}) => {
  Position.x[0] *= 2;
  parentPort.postMessage({});
});

// // listen for messages from the main thread
// onmessage = function (event) {
//   console.log("hello");
//   // get the shared array buffer from the message
//   const sharedBuffer = event.data;

//   // create a view of the shared buffer
//   const sharedArray = new Int32Array(sharedBuffer);

//   // modify the shared array buffer by doubling its value
//   sharedArray[0] *= 2;

//   // post the modified shared array buffer back to the main thread
//   postMessage(sharedBuffer);
// };
