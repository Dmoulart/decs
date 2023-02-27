import {defineComponent, f64, useWorld} from "../../src";

const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("node:worker_threads");
const {attach, detach, exists, hasComponent, create} = useWorld();

const Position = defineComponent({
  x: f64,
  y: f64,
});

const player = create();

attach(Position, player);

const worker = new Worker("../worker.js");

worker.postMessage(Position.data);
