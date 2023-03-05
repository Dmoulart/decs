import {run, runAsync} from "./run/runner";
import {$createWorld, createWorld} from "../src/world";
import {createEntity, removeEntity, resetEntityCursor} from "../src/entity";
import {attach, defineComponent, detach} from "../src/component";
import {i32, Types, ui32} from "../src/types";
import {Query, registerQuery} from "../src/query";
import {$prefab, prefab} from "../src";
import {rmSync, writeFileSync} from "fs";

// Parallel each
{
  try {
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

    for (let i = 0; i < 10_000; i++) {
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

    runAsync("parallel each", async () => {
      return await parallelEach().catch(console.error);
    }).then(() => {
      rmSync("./async-report.json");
      writeFileSync("./async-report.json", JSON.stringify(position));
    });
  } catch (e) {
    console.error(e);
  }
}
