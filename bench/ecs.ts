import {run} from "./run/runner";
import {createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {Types} from "../src/types";
import {Query, registerQuery} from "../src/query";
import {Prefab, prefab} from "../src";
import {createSpawnFunction, factory} from "../src/factory";

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

//  Create 100_000; entities with components
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

  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);
  const move = (eid: number) => {
    Position.x[eid] += Velocity.x[eid];
    Position.y[eid] += Velocity.y[eid];
  };
  run("World : Create 10_000 entities ", () => {
    for (let i = 0; i <= 10_000; i++) {
      const eid = createEntity(world);
      attach(Position, eid, world);
      Position.x[eid] = 100;
      Position.y[eid] = 100;
      attach(Velocity, eid, world);
      Velocity.x[eid] = 1.5;
      Velocity.y[eid] = 1.7;
    }

    // for (let j = 0; j < 1000; j++) {
    //   MovementQuery.each(move);
    // }
  });
}

//  Create 100_000; entities with prefabs
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

  const actor = prefab(world, Position, Velocity);

  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);
  const move = (eid: number) => {
    Position.x[eid] += Velocity.x[eid];
    Position.y[eid] += Velocity.y[eid];
  };
  run("World : Create 10_000 entities with prefabs ", () => {
    for (let i = 0; i <= 10_000; i++) {
      actor(
        {
          x: 100,
          y: 100,
        },
        {
          x: 1.5,
          y: 1.7,
        }
      );
    }

    // for (let j = 0; j < 1000; j++) {
    //   MovementQuery.each(move);
    // }
  });
}

//  Create 100_000; entities with factory api
{
  resetEntityCursor();
  let world = createWorld();
  let [Position, position] = factory(
    {
      x: Types.f32,
      y: Types.f32,
    },
    world
  );
  let [Velocity, velocity] = factory(
    {
      x: Types.f32,
      y: Types.f32,
    },
    world
  );

  const actor = [
    position({
      x: 100,
      y: 100,
    }),
    velocity({
      x: 1.5,
      y: 1.7,
    }),
  ];

  const Spawn = createSpawnFunction(world);

  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);
  const move = (eid: number) => {
    Position.x[eid] += Velocity.x[eid];
    Position.y[eid] += Velocity.y[eid];
  };
  run("World : Create 10_000 entities with factory API ", () => {
    for (let i = 0; i < 10_000; i++) {
      // make(...actor);
      try {
        Spawn(
          position({
            x: 100,
            y: 100,
          }),
          velocity({
            x: 1.5,
            y: 1.7,
          })
        );
      } catch (e) {
        console.error(e);
      }
    }

    // for (let j = 0; j < 1000; j++) {
    //   MovementQuery.each(move);
    // }
  });
  console.log(world.entitiesArchetypes.length);
}

//  Create 100_000; entities with new prefab api
{
  resetEntityCursor();
  let world = createWorld();
  const Position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const Velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const actor = Prefab(world, {Position, Velocity});
  const MovementQuery = Query().all(Position, Velocity);
  registerQuery(MovementQuery, world);
  const move = (eid: number) => {
    Position.x[eid] += Velocity.x[eid];
    Position.y[eid] += Velocity.y[eid];
  };
  run("World : Create 10_000 entities with new prefab API ", () => {
    for (let i = 0; i < 10_000; i++) {
      // make(...actor);
      try {
        actor({
          Position: {
            x: 10,
            y: 10,
          },
          Velocity: {
            x: 10,
            y: 10,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }

    // for (let j = 0; j < 1000; j++) {
    //   MovementQuery.each(move);
    // }
  });
  console.log(world.entitiesArchetypes.length);
}
