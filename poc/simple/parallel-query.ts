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
  const world = $createWorld(200_000);

  const Vec2 = {x: i32, y: i32};
  const Color = {hex: ui32};

  const position = defineComponent(Vec2);
  const velocity = defineComponent(Vec2);
  const color = defineComponent(Color);

  const actor = $prefab(world, {position, velocity});

  const ui = $prefab(world, {position, color});

  const light = $prefab(world, {velocity, color});

  for (let i = 0; i < 60_000; i++) {
    actor({
      velocity: {
        x: 25,
        y: 25,
      },
    });
    ui({
      position: {
        x: 7,
        y: 7,
      },
    });
    light({
      velocity: {
        x: 3,
        y: 3,
      },
    });
  }

  const result = any(position, velocity).from(world);
  console.log(result.map((arch) => arch.entities.count()));

  const [, archActor, archUi, , archLight] = result;

  const archUiPacked = deconstructAtomicSparseSet(archUi.entities as any);
  const archActorPacked = deconstructAtomicSparseSet(archActor.entities as any);
  const archLightPacked = deconstructAtomicSparseSet(archLight.entities as any);

  console.time("define psystem");
  const [uiSystem, actorSystem, lightSystem] = await Promise.all([
    $defineSystem("./poc/simple/parallel-query-worker.js", {
      position,
      velocity,
      arch: archUiPacked,
    }),
    $defineSystem("./poc/simple/parallel-query-worker.js", {
      position,
      velocity,
      arch: archActorPacked,
    }),
    $defineSystem("./poc/simple/parallel-query-worker.js", {
      position,
      velocity,
      arch: archLightPacked,
    }),
  ]);
  console.timeEnd("define psystem");

  console.time("parallel");
  await Promise.all([uiSystem.run(), actorSystem.run(), lightSystem.run()]);
  console.timeEnd("parallel");

  console.time("sync");
  for (let i = 0; i < result.length; i++) {
    const ents = result[i].entities.dense;
    const len = result[i].entities.count();

    for (let j = 0; j < len; j++) {
      const ent = ents[j];
      position.x[ent] += velocity.x[ent];
      position.y[ent] += velocity.y[ent];
    }
  }
  console.timeEnd("sync");

  await Promise.all([
    uiSystem.terminate(),
    actorSystem.terminate(),
    lightSystem.terminate(),
  ]);
})();
