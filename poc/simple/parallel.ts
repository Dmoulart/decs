import {writeFileSync} from "node:fs";
import {
  $createWorld,
  $defineSystem,
  $prefab,
  defineComponent,
  i32,
} from "../../src";

(async function () {
  const world = $createWorld(101_000);

  const position = defineComponent({
    x: i32,
    y: i32,
  });
  const velocity = defineComponent({
    x: i32,
    y: i32,
  });

  const actor = $prefab(world, {position, velocity});

  for (let i = 0; i < 10_000; i++) {
    actor();
  }

  const system = await $defineSystem("./poc/simple/parallel-worker.js", {
    position,
    velocity,
  });
  console.time("sys");
  for (let i = 0; i < 100_000; i++) {
    position.x[i] += 15;
    position.y[i] += 15;
  }
  console.timeEnd("sys");

  console.time("parallel");
  await system.run();
  console.timeEnd("parallel");

  writeFileSync("report.json", JSON.stringify(position));
  await system.terminate();
})();
