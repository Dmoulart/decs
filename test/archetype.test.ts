import "jest";
import {World} from "../src/world";

import {Component} from "../src/component";
import Types from "../src/types";
import {Archetype, transformArchetype} from "../src/archetype";
import {makeComponentsMask} from "../src/query";

describe("Archetype", () => {
  it("can be created without component", () => {
    expect(() => Archetype()).not.toThrowError();
  });
  it("can be created with component", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });

    const archetype = Archetype(makeComponentsMask(TestComponent));

    expect(archetype.mask.has(TestComponent.id)).toBeTruthy();
  });
  it("can be augmented", () => {
    const world = World();

    const TestComponent1 = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i8,
    });

    const archetype = Archetype(makeComponentsMask(TestComponent1));

    const augmentedArchetype = transformArchetype(
      archetype,
      TestComponent2,
      world
    );

    expect(augmentedArchetype.mask.has(TestComponent1.id)).toBeTruthy();
    expect(augmentedArchetype.mask.has(TestComponent2.id)).toBeTruthy();
  });
  it("can be diminished", () => {
    const world = World();

    const TestComponent1 = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i8,
    });

    const archetype = Archetype(
      makeComponentsMask(TestComponent1, TestComponent2)
    );
    const diminishedArchetype = transformArchetype(
      archetype,
      TestComponent2,
      world
    );

    expect(diminishedArchetype.mask.has(TestComponent1.id)).toBeTruthy();
    expect(diminishedArchetype.mask.has(TestComponent2.id)).toBeFalsy();
  });
  it("can cache augmented archetype", () => {
    const world = World();

    const TestComponent1 = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i8,
    });

    const archetype = Archetype(makeComponentsMask(TestComponent1));

    const augmented = transformArchetype(archetype, TestComponent2, world);

    expect(archetype.edge[TestComponent2.id]).toBeTruthy();

    const augmentedCached = transformArchetype(archetype, TestComponent2, world);
    expect(augmentedCached).toStrictEqual(augmented);
  });
  it("can cache diminished archetype", () => {
    const world = World();

    const TestComponent1 = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i8,
    });

    const archetype = Archetype(makeComponentsMask(TestComponent1, TestComponent2));
    const diminished = transformArchetype(archetype, TestComponent2, world);

    expect(archetype.edge[TestComponent2.id]).toBeTruthy();

    const diminishedCached = transformArchetype(
      archetype,
      TestComponent2,
      world
    );
    expect(diminishedCached).toStrictEqual(diminished);
  });
});
