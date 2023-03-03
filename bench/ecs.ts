import {run} from "./run/runner";
import {createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {Types} from "../src/types";
import {Query, registerQuery} from "../src/query";
import {$prefab, prefab} from "../src";

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

  const update = () => {
    // update mvmt system
    for (let i = 0; i < MovementQuery.archetypes.length; i++) {
      const arch = MovementQuery.archetypes[i];
      for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
        const id = arch.entities.dense[j];
        Position.x[id] += Velocity.x[id];
        Position.y[id] += Velocity.y[id];
      }
    }
  };

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

      update();
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
//   let count = 0;
//   const MovementQuery = Query().all(Position, Velocity);
//   registerQuery(MovementQuery, world);

//   const update = () => {
//     // update mvmt system
//     for (let i = 0; i < MovementQuery.archetypes.length; i++) {
//       const arch = MovementQuery.archetypes[i];
//       for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
//         const id = arch.entities.dense[j];
//         Position.x[id] += Velocity.x[id];
//         Position.y[id] += Velocity.y[id];
//       }
//     }
//   };
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
//   run("World : Movement 100_000 Iterations", () => {
//     for (let i = 0; i < 100_000; i++) {
//       update();
//     }
//   });
// }

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

  const update = () => {
    //update mvmt system
    for (let i = 0; i < MovementQuery.archetypes.length; i++) {
      const arch = MovementQuery.archetypes[i];
      for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
        const id = arch.entities.dense[j];
        Position.x[id] += Velocity.x[id];
        Position.y[id] += Velocity.y[id];
      }
    }
  };

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

      update();

      detach(Position, eid1, world);

      //update mvmt system
      update();

      removeEntity(eid1, world);
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
//   let count = 0;
//   const MovementQuery = Query().all(Position, Velocity);
//   registerQuery(MovementQuery, world);
//   const actor = prefab(
//     world,
//     {Position, Velocity},
//     {
//       Position: {
//         x: 100,
//         y: 100,
//       },
//       Velocity: {
//         x: 1.2,
//         y: 1.7,
//       },
//     }
//   );
//   //https://github.com/ddmills/js-ecs-benchmarks/blob/master/suites/suite-add-remove.js
//   run("World : Add/Remove 5000 Iterations with prefabs", () => {
//     for (let i = 0; i <= 5000; i++) {
//       const eid1 = actor();
//       const eid2 = actor();

//       // MovementQuery.each((id) => {
//       //   Position.x[id] += Velocity.x[id];
//       //   Position.y[id] += Velocity.y[id];
//       // });
//       //update mvmt system
//       for (let i = 0; i < MovementQuery.archetypes.length; i++) {
//         const arch = MovementQuery.archetypes[i];
//         for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
//           const id = arch.entities.dense[j];
//           Position.x[id] += Velocity.x[id];
//           Position.y[id] += Velocity.y[id];
//         }
//       }

//       detach(Position, eid1, world);

//       // MovementQuery.each((id) => {
//       //   Position.x[id] += Velocity.x[id];
//       //   Position.y[id] += Velocity.y[id];
//       // });
//       //update mvmt system
//       for (let i = 0; i < MovementQuery.archetypes.length; i++) {
//         const arch = MovementQuery.archetypes[i];
//         for (let j = 0, l = arch.entities.dense.length; j < l; j++) {
//           const id = arch.entities.dense[j];
//           Position.x[id] += Velocity.x[id];
//           Position.y[id] += Velocity.y[id];
//         }
//       }

//       removeEntity(eid1, world);
//     }
//   });
// }

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

  run("World : Create 100_000 entities ", () => {
    for (let i = 0; i <= 100_000; i++) {
      const eid = createEntity(world);
      attach(Position, eid, world);
      Position.x[eid] = 100;
      Position.y[eid] = 100;
      attach(Velocity, eid, world);
      Velocity.x[eid] = 1.5;
      Velocity.y[eid] = 1.7;
    }
  });
}

// //  Create 100_000; entities and set components values
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

//   run("World : Create 100_000 entities with set functions ", () => {
//     for (let i = 0; i <= 100_000; i++) {
//       const eid = createEntity(world);

//       set(
//         eid,
//         Position,
//         {
//           x: 100,
//           y: 100,
//         },
//         world
//       );

//       set(
//         eid,
//         Velocity,
//         {
//           x: 1.5,
//           y: 1.7,
//         },
//         world
//       );
//     }
//   });
// }

//  Create 100_000; entities with new prefab api non inlined
{
  resetEntityCursor();
  let world = createWorld(100_000);
  const position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const actor = prefab(world, {position, velocity});

  run(
    "World : Create 100_000 entities with new prefab API not inlined ",
    () => {
      for (let i = 0; i < 100_000; i++) {
        try {
          actor({
            position: {
              x: 100,
              y: 100,
            },
            velocity: {
              x: 1.5,
              y: 1.7,
            },
          });
        } catch (e) {
          console.error(e);
        }
      }
    }
  );
}

//  Create 100_000; entities with new prefab api inlined
{
  resetEntityCursor();
  let world = createWorld(100_000);
  const position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const actor = $prefab(world, {position, velocity});

  run("World : Create 100_000 entities with new prefab API inlined ", () => {
    for (let i = 0; i < 100_000; i++) {
      try {
        actor({
          position: {
            x: 100,
            y: 100,
          },
          velocity: {
            x: 1.5,
            y: 1.7,
          },
        });
      } catch (e) {
        console.error(e);
      }
    }
  });
}

//  Create 100_000; entities with new prefabWithPrefab function
{
  resetEntityCursor();
  let world = createWorld(100_000);
  const position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });

  const hundred = 100;
  const someValue = {val: 1_0000_0000};
  const actor = $prefab(
    world,
    {position, velocity},
    {
      position: {
        x: hundred,
        y: hundred,
      },
      velocity: {
        x: someValue.val,
        y: 1.7,
      },
    }
  );

  run(
    "World : Create 100_000 entities with new prefabWithDefault function inlined",
    () => {
      for (let i = 0; i < 100_000; i++) {
        actor();
      }
    }
  );
  console.log(position.x[1]);
}

//  Create 100_000; entities with new prefabWithPrefab function
{
  resetEntityCursor();
  let world = createWorld(100_000);
  const position = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });
  const velocity = defineComponent({
    x: Types.f32,
    y: Types.f32,
  });

  const ten = 10;
  const someValue = {val: 1_0000_0000};

  const actor = $prefab(
    world,
    {position, velocity},
    {
      position: {
        x: ten,
        y: ten,
      },
      velocity: {
        x: someValue.val,
        y: 1.7,
      },
    }
  );

  run(
    "World : Create 100_000 entities with  prefabWithDefault function and overrided properties inlined",
    () => {
      for (let i = 0; i < 100_000; i++) {
        actor({
          position: {
            x: 100,
            y: 100,
          },
          velocity: {
            x: 1.5,
            y: 1.7,
          },
        });
      }
    }
  );
  console.log(position.x[1]);
}
