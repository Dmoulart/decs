import {run} from "./run/runner";
import {createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {Types} from "../src/types";
import {Query, registerQuery} from "../src/query";
import {prefab, prefabWithDefault, set} from "../src";

{
  resetEntityCursor();
  let world = createWorld();
  let Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  // globalThis.Position = Position;
  // globalThis.Velocity = Velocity;
  let count = 0;
  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);

  //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
  run("World : Velocity 2000 Iterations precompiled", () => {
    const h = "hello";
    const move = MovementQuery.$precompileEach(
      (id) => {
        Position.x[id] += Velocity.x[id];
        Position.y[id] += Velocity.y[id];
        console.log(h);
      },
      {Position, Velocity}
    );

    for (let i = 0; i <= 2000; i++) {
      const eid1 = createEntity(world);

      attach(Position, eid1, world);
      Position.x[eid1] = 100;
      Position.y[eid1] = 100;
      attach(Velocity, eid1, world);
      Velocity.x[eid1] = 1.2;
      Velocity.y[eid1] = 1.7;

      // move();

      // // update mvmt system
      for (let i = 0; i < MovementQuery.archetypes.length; i++) {
        const arch = MovementQuery.archetypes[i];
        for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
          const id = arch.entities.dense[j];
          Position.x[id] += Velocity.x[id];
          Position.y[id] += Velocity.y[id];
        }
      }
    }
  });
}

{
  resetEntityCursor();
  let world = createWorld();
  let Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  globalThis.Position = Position;
  globalThis.Velocity = Velocity;
  let count = {val: 0};
  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);
  const move = MovementQuery.$precompileEach(
    (id) => {
      Position.x[id] += Velocity.x[id];
      Position.y[id] += Velocity.y[id];
      count.val++;
    },
    {count}
  );
  console.log({count});

  for (let i = 0; i <= 2000; i++) {
    const eid1 = createEntity(world);

    attach(Position, eid1, world);
    Position.x[eid1] = 100;
    Position.y[eid1] = 100;
    attach(Velocity, eid1, world);
    Velocity.x[eid1] = 1.2;
    Velocity.y[eid1] = 1.7;
  }
  //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
  run("World : Movement 100_000 Iterations precompiled", () => {
    for (let i = 0; i < 100_000; i++) {
      try {
        move();
      } catch (e) {
        console.error(e);
      }
    }
  });
}
