import makeAsynchronous from "make-asynchronous";
import {
  $createWorld,
  defineComponent,
  $prefab,
  Query,
  i32,
  ui32,
  registerQuery,
} from "../../dist";

const sys = makeAsynchronous((entities, position, ts) => {
  console.log(performance.now());
  const len = entities.length;
  for (let j = 0; j < len; j++) {
    const ent = entities[j];
    position.x[ent] += 15;
    position.y[ent] += 15;
  }
  return performance.now();
});

(async function () {
  const world = $createWorld();
  const Vector = {x: i32, y: i32, z: i32};
  const position = defineComponent(Vector);
  const velocity = defineComponent(Vector);

  const sprite = defineComponent({
    identifier: i32,
  });
  const color = defineComponent({
    hex: ui32,
  });

  const actor = $prefab(
    world,
    {position, velocity},
    {
      position: {
        x: 10,
        y: 10,
      },
      velocity: {
        x: 10,
      },
    }
  );

  for (let i = 0; i < 50; i++) {
    actor();
  }

  const e = actor();

  const query = Query().any(position, velocity, sprite, color);
  registerQuery(query, world);

  const ts = await sys(query.archetypes[1].entities.dense, position);

  console.log(`time to call : ${(performance.now() - ts).toFixed()}ms`);
  console.log(position.x[e]);
})();
