import "jest";
import {
  AtomicSparseSet,
  deconstructAtomicSparseSet,
  defineComponent,
  f32,
  f64,
  i32,
  i8,
  parallel,
  reconstructAtomicSparseSet,
  useWorld,
} from "../src";
import {Worker} from "node:worker_threads";

const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

describe("Parallelism", () => {
  it("can mutate components", async () => {
    const {attach, create} = useWorld();

    const Position = defineComponent({
      x: f64,
      y: f64,
    });

    const player = create();

    attach(Position, player);
    Position.x[1] = 20;

    const worker = new Worker("./test/workers/mutate-components.js");

    worker.postMessage(Position);

    await sleep(500);
    await worker.terminate();

    expect(Position.x[1]).toEqual(40);
  });
  it("can mutate an atomic sparse set in another thread", async () => {
    const sset = AtomicSparseSet(i32, 11);
    sset.insert(10);

    const worker = new Worker("./test/workers/mutate-sparse-set.js");

    const ssetParts = deconstructAtomicSparseSet(sset);
    worker.postMessage(ssetParts);

    await sleep(2000);
    await worker.terminate();

    expect(sset.has(10)).toStrictEqual(false);
    expect(sset.has(2)).toStrictEqual(true);
    expect(sset.count()).toStrictEqual(2);
  });
  it.skip("can pass worlds", async () => {
    const {attach, detach, exists, hasComponent, create, world} = useWorld();

    const Position = defineComponent({
      x: f64,
      y: f64,
    });

    const player = create();
    attach(Position, player);

    Position.x[0] = 20;

    const worker = new Worker("./test/workers/worker.js");

    const sset = AtomicSparseSet(i32, 10_000);
    worker.postMessage({Position, sset});

    await sleep(500);
    await worker.terminate();

    expect(Position.x[0]).toEqual(40);
  });
});
