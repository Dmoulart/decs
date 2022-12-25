import "jest";
import {World} from "../src/world";

import {Component} from "../src/component";
import Types from "../src/types";
import {Archetype, augmentArchetype, diminishArchetype} from "../src/archetype";

describe("Archetype", () => {
  it("can be created without component", () => {
      expect(() => Archetype([])).not.toThrowError();
  });
  it("can be created with component", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)

      const archetype = Archetype([TestComponent])

      expect(archetype.mask.has(TestComponent.id)).toBeTruthy()
  });
  it("can be augmented", () => {
      const world = World();

      const TestComponent1 = Component({
          test: Types.i8
      }, world)
      const TestComponent2 = Component({
          test: Types.i8
      }, world)

      const archetype = Archetype([TestComponent1])

      const augmentedArchetype = augmentArchetype(archetype, TestComponent2, world)

      expect(augmentedArchetype.mask.has(TestComponent1.id)).toBeTruthy()
      expect(augmentedArchetype.mask.has(TestComponent2.id)).toBeTruthy()
  });
  it("can be diminished", () => {
      const world = World();

      const TestComponent1 = Component({
          test: Types.i8
      }, world)
      const TestComponent2 = Component({
          test: Types.i8
      }, world)

      const archetype = Archetype([TestComponent1, TestComponent2])
      const diminishedArchetype = diminishArchetype(archetype, TestComponent2, world)

      expect(diminishedArchetype.mask.has(TestComponent1.id)).toBeTruthy()
      expect(diminishedArchetype.mask.has(TestComponent2.id)).toBeFalsy()
  });
  it("can cache augmented archetype", () => {
      const world = World();

      const TestComponent1 = Component({
          test: Types.i8
      }, world)
      const TestComponent2 = Component({
          test: Types.i8
      }, world)

      const archetype = Archetype([TestComponent1])

      const augmented =  augmentArchetype(archetype, TestComponent2, world)

      expect(archetype.edges.add[TestComponent2.id]).toBeTruthy()

      const augmentedCached = augmentArchetype(archetype, TestComponent2, world)
      expect(augmentedCached).toStrictEqual(augmented)
  });
  it("can cache diminished archetype", () => {
      const world = World();

      const TestComponent1 = Component({
          test: Types.i8
      }, world)
      const TestComponent2 = Component({
          test: Types.i8
      }, world)

      const archetype = Archetype([TestComponent1, TestComponent2])
      const diminished = diminishArchetype(archetype, TestComponent2, world)

      expect(archetype.edges.remove[TestComponent2.id]).toBeTruthy()

      const diminishedCached = diminishArchetype(archetype, TestComponent2, world)
      expect(diminishedCached).toStrictEqual(diminished)
  });
});

