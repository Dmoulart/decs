import {run} from "./run/runner";
import {$createWorld, createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {i32, Types, ui32} from "../src/types";
import {Query, registerQuery} from "../src/query";
import {$prefab, prefab} from "../src";

// Parallel each
{
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

  const character = $prefab(
    world,
    {position, velocity, color, sprite},
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

  const staticCharacter = $prefab(
    world,
    {position, sprite},
    {
      position: {
        x: 10,
        y: 10,
      },
    }
  );

  for (let i = 0; i < 50; i++) {
    actor();
    character();
    staticCharacter();
  }

  const player = actor();

  const query = Query().any(position, velocity, sprite, color);
  registerQuery(query, world);

  const parallelEach = query.$parallel("./test/workers/query-each.js", {
    position,
  });

  run("parallel each", async () => {
    await parallelEach();
  });
}
// Sync each
{
  const world = createWorld();

  const Vector = {x: i32, y: i32, z: i32};
  const position = defineComponent(Vector);
  const velocity = defineComponent(Vector);

  const sprite = defineComponent({
    identifier: i32,
  });
  const color = defineComponent({
    hex: ui32,
  });

  const actor = prefab(
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

  const character = prefab(
    world,
    {position, velocity, color, sprite},
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

  const staticCharacter = prefab(
    world,
    {position, sprite},
    {
      position: {
        x: 10,
        y: 10,
      },
    }
  );

  for (let i = 0; i < 50; i++) {
    actor();
    character();
    staticCharacter();
  }

  const player = actor();

  const query = Query().any(position, velocity, sprite, color);
  registerQuery(query, world);

  const archetypes = query.archetypes;
  run("sync each", async () => {
    for (let i = 0; i < archetypes.length; i++) {
      const ents = archetypes[i].entities.dense;
      const len = ents.length;
      for (let j = 0; j < len; j++) {
        const ent = ents[j];
        position.x[ent] += 15;
        position.y[ent] += 15;
      }
    }
  });
}
// {
//   resetEntityCursor();
//   let world = createWorld();
//   let Position = defineComponent({
//     x: Types.f32,
//     y: Types.f32,
//   });
//   let Velocity = defineComponent({
//     x: Types.f32,
//     y: Types.f32,
//   });
//   // globalThis.Position = Position;
//   // globalThis.Velocity = Velocity;
//   let count = 0;
//   const MovementQuery = Query().all(Position, Velocity);
//   registerQuery(MovementQuery, world);

//   //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
//   run("World : Velocity 2000 Iterations precompiled", () => {
//     const h = "hello";
//     const move = MovementQuery.$precompileEach(
//       (id) => {
//         Position.x[id] += Velocity.x[id];
//         Position.y[id] += Velocity.y[id];
//         console.log(h);
//       },
//       {Position, Velocity}
//     );

//     for (let i = 0; i <= 2000; i++) {
//       const eid1 = createEntity(world);

//       attach(Position, eid1, world);
//       Position.x[eid1] = 100;
//       Position.y[eid1] = 100;
//       attach(Velocity, eid1, world);
//       Velocity.x[eid1] = 1.2;
//       Velocity.y[eid1] = 1.7;

//       // move();

//       // // update mvmt system
//       for (let i = 0; i < MovementQuery.archetypes.length; i++) {
//         const arch = MovementQuery.archetypes[i];
//         for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
//           const id = arch.entities.dense[j];
//           Position.x[id] += Velocity.x[id];
//           Position.y[id] += Velocity.y[id];
//         }
//       }
//     }
//   });
// }

// {
//   resetEntityCursor();
//   let world = createWorld();
//   let Position = defineComponent({
//     x: Types.f32,
//     y: Types.f32,
//   });
//   let Velocity = defineComponent({
//     x: Types.f32,
//     y: Types.f32,
//   });
//   globalThis.Position = Position;
//   globalThis.Velocity = Velocity;
//   let count = {val: 0};
//   const MovementQuery = Query().all(Position, Velocity);
//   registerQuery(MovementQuery, world);
//   const move = MovementQuery.$precompileEach(
//     (id) => {
//       Position.x[id] += Velocity.x[id];
//       Position.y[id] += Velocity.y[id];
//       count.val++;
//     },
//     {count}
//   );
//   console.log({count});

//   for (let i = 0; i <= 2000; i++) {
//     const eid1 = createEntity(world);

//     attach(Position, eid1, world);
//     Position.x[eid1] = 100;
//     Position.y[eid1] = 100;
//     attach(Velocity, eid1, world);
//     Velocity.x[eid1] = 1.2;
//     Velocity.y[eid1] = 1.7;
//   }
//   //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
//   run("World : Movement 100_000 Iterations precompiled", () => {
//     for (let i = 0; i < 100_000; i++) {
//       try {
//         move();
//       } catch (e) {
//         console.error(e);
//       }
//     }
//   });
// }
