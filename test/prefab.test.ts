import "jest";
import {
  defineComponent,
  f32,
  Query,
  registerQuery,
  Types,
  ui8,
  createWorld,
  prefab,
  prefabWithDefault,
} from "../src";

describe("Prefab", () => {
  it("can be created", () => {
    const Position = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });
    const Velocity = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });

    const actor = prefab(createWorld(), {Position, Velocity});
    const ent = actor({
      Position: {
        x: 10,
        y: 10,
      },
      Velocity: {
        x: 10,
        y: 10,
      },
    });

    expect(
      Position.x[ent] === 10 &&
        Position.y[ent] === 10 &&
        Velocity.x[ent] === 10 &&
        Velocity.y[ent] === 10
    ).toBeTruthy();
  });
  it("can be queried", () => {
    const Position = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });
    const Velocity = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });

    const world = createWorld();
    const actor = prefab(world, {Position, Velocity});
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

    const archetypes = Query().all(Position, Velocity).from(world);

    expect(archetypes.length).toEqual(1);
    expect(archetypes[0].entities.count()).toEqual(1);
  });
  it("can register to existing query", () => {
    const Position = defineComponent({
      x: f32,
      y: f32,
    });
    const Stats = defineComponent({
      strength: ui8,
      intelligence: ui8,
    });

    const world = createWorld();
    const query = Query().all(Position, Stats);
    registerQuery(query, world);

    const actor = prefab(world, {Position, Stats});

    actor({
      Position: {
        x: 10,
        y: 10,
      },
      Stats: {
        strength: 10,
        intelligence: 10,
      },
    });

    expect(query.archetypes.length).toEqual(1);
    expect(query.archetypes[0].entities.count()).toEqual(1);
  });
  it("can be init with default values", () => {
    const Position = defineComponent({
      x: f32,
      y: f32,
    });
    const Stats = defineComponent({
      strength: ui8,
      intelligence: ui8,
    });

    const world = createWorld();
    const query = Query().all(Position, Stats);
    registerQuery(query, world);

    const actor = prefabWithDefault(
      world,
      {Position, Stats},
      {
        Position: {
          x: 10,
          y: 10,
        },
      }
    );

    const ent = actor({
      Stats: {
        strength: 10,
        intelligence: 10,
      },
    });

    expect(Position.x[ent]).toEqual(10);
    expect(Position.y[ent]).toEqual(10);
  });

  it.skip("precompile", () => {
    function precompile(funcRef: Function, ...rest: any) {
      const fun = funcRef.toString();
      const functionRegex = /function[^(]*\(([^)]*)\)\s*{([\s\S]*)}$/;

      if (!functionRegex.test(fun)) throw new Error(`Invalid function`);

      //Capture function args and body into capture groups
      const argsBody = fun.match(functionRegex)!;

      //Get argument names
      const argNames = argsBody[1].split(/\s*,\s*/g);

      //Function body
      let body = argsBody[2];

      //Replace arguments with provided values
      const argumentValues = Array.prototype.slice.call(arguments, 1);
      for (var i = 0; i < argumentValues.length; i++) {
        body = body.replace(new RegExp(argNames[i], "g"), argumentValues[i]);
      }

      const remainingArguments = argNames.slice(i);
      console.log({remainingArguments});
      console.log("body", body);

      return new Function(remainingArguments.join(","), body);
    }

    function inc(numb: number) {
      return numb+1;
    }

    const fun = precompile(inc, 1);

    console.log(fun.toString());
    expect(fun()).toEqual(2)
  });
});
