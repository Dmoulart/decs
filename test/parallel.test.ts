import "jest";
import {defineComponent, f64, i8, useWorld} from "../src";
const {Worker} = require("node:worker_threads");

describe("Parallelism", () => {
  it("can mutate components", () => {
    expect(true);
    const {attach, detach, exists, hasComponent, create} = useWorld();

    const Position = defineComponent({
      x: f64,
      y: f64,
    });

    const player = create();

    attach(Position, player);

    const worker = new Worker("./worker.js");
    worker.on("message", (msg: any) => {
      console.log(msg);
    });

    worker.postMessage(Position.data);

    expect(true);
  });
});
