import "jest";
import {Component, Entity, i8, useWorld, World} from "../src";
import {exists} from "fs";


describe("World", () => {
  it("can be created", () => {
    expect(() => World()).not.toThrowError();
  });
  it("throws when world capacity exceeded", () => {
    const world = World(2);
    Entity(world);
    Entity(world);
    expect(() => Entity(world)).toThrowError();
  });
  it("can create multiple world", () => {
      const worldA = World(100_000);
      const worldB = World(100_000);
      expect(() => World(100_000)).not.toThrowError();
  });
  it("can create multiple world", () => {
      const worldA = World(100_000);
      const worldB = World(100_000);
      expect(() => World(100_000)).not.toThrowError();
  });
  it("can use world API", () => {
      const { attach, detach, exists, hasComponent, prefab } = useWorld()

      const TestComponent = Component({
          field: i8,
      });
      const TestComponent2 = Component({
          field: i8,
      });

      const actor = prefab(TestComponent)

      const player = actor({
          field: 'ok'
      })

      attach(TestComponent2, player)
      expect(hasComponent(TestComponent2, player)).toStrictEqual(true)

      detach(TestComponent2, player)
      expect(hasComponent(TestComponent2, player)).toStrictEqual(false)

      expect(exists(player)).toStrictEqual(true)
  });
});
