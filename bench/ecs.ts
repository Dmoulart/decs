import {run} from "./run/runner";
import {createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {Types} from "../src/types";
import {Query, registerQuery} from "../src/query";

{
  resetEntityCursor()
  let world = createWorld();
  let Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let count = 0;
  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);

  //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
  run("World : Velocity 2000 Iterations", () => {
    for (let i = 0; i <= 2000; i++) {
      const eid1 = createEntity(world);

      attach(Position, eid1, world);
      Position.x[eid1] = 100;
      Position.y[eid1] = 100;
      attach(Velocity, eid1, world);
      Velocity.x[eid1] = 1.2;
      Velocity.y[eid1] = 1.7;

      // update mvmt system
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
  resetEntityCursor()
  let world = createWorld();
  let Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let count = 0;
  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);

  //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
  run("World : Add/Remove 5000 Iterations", () => {
    for (let i = 0; i <= 5000; i++) {
      const eid1 = createEntity(world);
      const eid2 = createEntity(world);

      attach(Position, eid1, world);
      Position.x[eid1] = 100;
      Position.y[eid1] = 100;
      attach(Velocity, eid1, world);
      Velocity.x[eid1] = 1.2;
      Velocity.y[eid1] = 1.7;

      attach(Position, eid2, world);
      Position.x[eid2] = 100;
      Position.y[eid2] = 100;
      attach(Velocity, eid2, world);
      Velocity.x[eid2] = 1.2;
      Velocity.y[eid2] = 1.7;

      //update mvmt system
      for (let i = 0; i < MovementQuery.archetypes.length; i++) {
        const arch = MovementQuery.archetypes[i];
        for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
          const id = arch.entities.dense[j];
          Position.x[id] += Velocity.x[id];
          Position.y[id] += Velocity.y[id];
        }
      }

      detach(Position, eid1, world);

      //update mvmt system
      for (let i = 0; i < MovementQuery.archetypes.length; i++) {
        const arch = MovementQuery.archetypes[i];
        for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
          const id = arch.entities.dense[j];
          Position.x[id] += Velocity.x[id];
          Position.y[id] += Velocity.y[id];
        }
      }

      removeEntity(eid1, world);
    }
  });
}

//  Destroy 100_000; entities
{
  resetEntityCursor()
  let world = createWorld();
  let Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  let Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });

  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);

  run("World : Destroy 100_000; entities", () => {
    for (let i = 0; i <= 100_000; i++) {
      const eid = createEntity(world);
      attach(Position, eid, world);
      Position.x[eid] = 100;
      Position.y[eid] = 100;
      attach(Velocity, eid, world);
      Velocity.x[eid] = 1.5;
      Velocity.y[eid] = 1.7;
      removeEntity(eid, world);
    }
  });
}
