import "jest";
import {
  $createWorld,
  $defineSystem,
  $prefab,
  AtomicBitSet,
  AtomicSparseSet,
  deconstructAtomicBitSet,
  deconstructAtomicSparseSet,
  defineComponent,
  f32,
  f64,
  i32,
  i8,
  Query,
  reconstructAtomicSparseSet,
  registerQuery,
  ui32,
  useWorld,
} from "../src";
import {Worker} from "node:worker_threads";
import {rmSync, writeFileSync} from "node:fs";

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
    expect(sset.has(3)).toStrictEqual(true);
  });
  it("can mutate an atomic sparse set in another thread and still get the right count", async () => {
    const sset = AtomicSparseSet(i32, 11);
    sset.insert(10);

    const worker = new Worker("./test/workers/mutate-sparse-set.js");

    const ssetParts = deconstructAtomicSparseSet(sset);
    worker.postMessage(ssetParts);

    await sleep(2000);
    await worker.terminate();

    expect(sset.has(10)).toStrictEqual(false);
    expect(sset.has(2)).toStrictEqual(true);
    expect(sset.has(3)).toStrictEqual(true);
    expect(sset.count()).toStrictEqual(2);
  });
  it("can mutate a bit set in another thread", async () => {
    const bitset = AtomicBitSet();

    const worker = new Worker("./test/workers/mutate-bit-set.js");
    const bitsetParts = deconstructAtomicBitSet(bitset);
    worker.postMessage(bitsetParts);

    await sleep(2000);
    await worker.terminate();

    expect(bitset.has(1)).toStrictEqual(false);
    expect(bitset.has(5)).toStrictEqual(true);
  });
  it("can run multiple systems in parallel", async () => {
    const position = defineComponent({
      x: i32,
      y: i32,
    });

    const systemA = await $defineSystem("./test/workers/parallel-system.js", {
      position,
      propToMutate: "x",
    });
    const systemB = await $defineSystem("./test/workers/parallel-system.js", {
      position,
      propToMutate: "y",
    });

    await Promise.all([systemA.run(), systemB.run()]);
    await Promise.all([systemA.terminate(), systemB.terminate()]);
    expect(position.x[10]).toStrictEqual(20);
    expect(position.y[10]).toStrictEqual(20);
  });

  // it("can fire parallel query each functions", async () => {
  //   const world = $createWorld();

  //   const Vector = {x: i32, y: i32, z: i32};
  //   const position = defineComponent(Vector);
  //   const velocity = defineComponent(Vector);

  //   const sprite = defineComponent({
  //     identifier: i32,
  //   });
  //   const color = defineComponent({
  //     hex: ui32,
  //   });

  //   const actor = $prefab(
  //     world,
  //     {position, velocity},
  //     {
  //       position: {
  //         x: 10,
  //         y: 10,
  //       },
  //       velocity: {
  //         x: 10,
  //       },
  //     }
  //   );

  //   const character = $prefab(
  //     world,
  //     {position, velocity, color, sprite},
  //     {
  //       position: {
  //         x: 10,
  //         y: 10,
  //       },
  //       velocity: {
  //         x: 10,
  //       },
  //     }
  //   );

  //   const staticCharacter = $prefab(
  //     world,
  //     {position, sprite},
  //     {
  //       position: {
  //         x: 10,
  //         y: 10,
  //       },
  //     }
  //   );

  //   for (let i = 0; i < 50; i++) {
  //     actor();
  //     character();
  //     staticCharacter();
  //   }

  //   const player = actor();

  //   const query = Query().any(position, velocity, sprite, color);
  //   registerQuery(query, world);

  //   const parallelEach = query.$parallel("./test/workers/query-each.js", {
  //     position,
  //   });

  //   await parallelEach();

  //   rmSync("./report.json");
  //   writeFileSync("./report.json", JSON.stringify(position));

  //   expect(position.x[player]).toStrictEqual(25);
  //   expect(position.y[player]).toStrictEqual(25);
  // });

  it.skip("can pass worlds", async () => {
    const {attach, create} = useWorld();

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
