// listen for messages from the main thread
onmessage = function (event) {
  // get the shared array buffer from the message
  const sharedBuffer = event.data;

  // create a view of the shared buffer
  const sharedArray = new Int32Array(sharedBuffer);

  // modify the shared array buffer by doubling its value
  sharedArray[0] *= 2;

  // post the modified shared array buffer back to the main thread
  postMessage(sharedBuffer);
};
