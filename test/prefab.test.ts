import "jest";
import { defineComponent, f32, Query, registerQuery, Types, ui8, createWorld, prefab } from "../src";

describe("Prefab", () => {
  it("can be created without throwing", () => {
    expect(() => prefab(createWorld())).not.toThrowError();
  });
  it("can be created", () => {
    const Position = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });
    const Velocity = defineComponent({
      x: Types.f32,
      y: Types.f32,
    });

    const actor = prefab(createWorld(), Position, Velocity);
    const ent = actor({x: 10, y: 10}, {y: 10, x: 10});

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
    const actor = prefab(world, Position, Velocity);

    actor({x: 10, y: 10}, {y: 10, x: 10});

    const archetypes = Query().all(Position, Velocity).from(world);

    expect(archetypes.length === 1).toBeTruthy();
    expect(archetypes[0].entities.count() === 1).toBeTruthy();
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

    const actor = prefab(world, Position, Stats);
    actor({x: 10, y: 10}, {strength: 10, intelligence: 10});

    expect(query.archetypes.length === 1).toBeTruthy();
    expect(query.archetypes[0].entities.count() === 1).toBeTruthy();
  });
});
