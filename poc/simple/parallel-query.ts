import {writeFileSync} from "node:fs";
import {
  $createWorld,
  $defineSystem,
  $prefab,
  all,
  any,
  deconstructAtomicSparseSet,
  defineComponent,
  i32,
  ui32,
} from "../../src";

(async function () {
  const world = $createWorld(101_000);

  const Vec2 = {x: i32, y: i32};
  const Color = {hex: ui32};

  const position = defineComponent(Vec2);
  const velocity = defineComponent(Vec2);
  const color = defineComponent(Color);

  const actor = $prefab(world, {position, velocity});

  const ui = $prefab(world, {position, color});

  for (let i = 0; i < 10_000; i++) {
    actor();
    ui();
  }

  const result = any(position, velocity).from(world);
  console.log(result.map((arch) => arch.entities.count()));

  const [, archActor, archUi] = result;

  const archUiPacked = deconstructAtomicSparseSet(archUi.entities as any);
  const archActorPacked = deconstructAtomicSparseSet(archActor.entities as any);
  const uiSystem = await $defineSystem(
    "./poc/simple/parallel-query-worker.js",
    {
      position,
      velocity,
      arch: archUiPacked,
    }
  );
  const actorSystem = await $defineSystem(
    "./poc/simple/parallel-query-worker.js",
    {
      position,
      velocity,
      arch: archActorPacked,
    }
  );
  const actor2System = await $defineSystem(
    "./poc/simple/parallel-query-worker.js",
    {
      position,
      velocity,
      arch: archActorPacked,
    }
  );

  console.time("parallel");
  await Promise.all([uiSystem.run(), actorSystem.run()]);
  console.timeEnd("parallel");

  console.time("sync");
  for (let i = 0; i < result.length; i++) {
    const ents = result[i].entities.dense;
    const len = ents.length;
    for (let j = 0; j < len; j++) {
      const ent = ents[j];
      position.x[ent] += velocity.x[ent];
      position.y[ent] += velocity.y[ent];
    }
  }
  console.timeEnd("sync");

  await Promise.all([uiSystem.terminate(), actorSystem.terminate()]);

  // console.time("sys");
  // const ents = archActor.entities.dense;
  // const len = ents.length;
  // for (let j = 0; j < len; j++) {
  //   const ent = ents[j];
  //   position.x[ent] += velocity.x[ent];
  //   position.y[ent] += velocity.y[ent];
  // }
  // console.timeEnd("sys");

  // console.time("parallel");
  // await system.run();
  // console.timeEnd("parallel");

  // // writeFileSync("report.json", JSON.stringify(position));
  // await system.terminate();
})();
