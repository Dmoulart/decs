import {parentPort} from "worker_threads";

parentPort.on("message", (Position) => {
  Position.x[1] *= 2;
});
