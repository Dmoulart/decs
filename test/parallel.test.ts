import "jest";
import {defineComponent, f64, i8, useWorld} from "../src";
import {Worker} from "node:worker_threads";
// const {Worker} = require("node:worker_threads");
const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("Parallelism", () => {
  it("can mutate components", async () => {
    expect(true);
    const {attach, detach, exists, hasComponent, create} = useWorld();

    const Position = defineComponent({
      x: f64,
      y: f64,
    });

    const player = create();

    attach(Position, player);
    Position.x[0] = 20;

    // console.log("before", Position.x[0]);

    const worker = new Worker("./worker.js");
    // let messageFromWorker = "";
    // worker.on("message", (msg: any) => {
    //   messageFromWorker = msg;
    // });
    worker.postMessage({Position});

    await sleep(500);
    await worker.terminate();

    // console.log("after", Position.x[0]);

    expect(Position.x[0]).toEqual(40);
  });
});
