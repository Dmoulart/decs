import "jest";
import Types from "../src/types";
import {createArchetype, deriveArchetype} from "../src/archetype";
import {makeComponentsMask, defineComponent, createWorld } from "../src";

describe("Archetype", () => {
  it("can be created without component", () => {
    expect(() => createArchetype()).not.toThrowError();
  });
  it("can be created with component", () => {
    const TestComponent = defineComponent({
      test: Types.i8,
    });

    const archetype = createArchetype(makeComponentsMask(TestComponent));

    expect(archetype.mask.has(TestComponent.id)).toBeTruthy();
  });
  it("can be augmented", () => {
    const world = createWorld();

    const TestComponent1 = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i8,
    });

    const archetype = createArchetype(makeComponentsMask(TestComponent1));

    const augmentedArchetype = deriveArchetype(
      archetype,
      TestComponent2,
      world
    );

    expect(augmentedArchetype.mask.has(TestComponent1.id)).toBeTruthy();
    expect(augmentedArchetype.mask.has(TestComponent2.id)).toBeTruthy();
  });
  it("can be diminished", () => {
    const world = createWorld();

    const TestComponent1 = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i8,
    });

    const archetype = createArchetype(
      makeComponentsMask(TestComponent1, TestComponent2)
    );
    const diminishedArchetype = deriveArchetype(
      archetype,
      TestComponent2,
      world
    );

    expect(diminishedArchetype.mask.has(TestComponent1.id)).toBeTruthy();
    expect(diminishedArchetype.mask.has(TestComponent2.id)).toBeFalsy();
  });
  it("can cache augmented archetype", () => {
    const world = createWorld();

    const TestComponent1 = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i8,
    });

    const archetype = createArchetype(makeComponentsMask(TestComponent1));

    const augmented = deriveArchetype(archetype, TestComponent2, world);

    expect(archetype.edge[TestComponent2.id]).toBeTruthy();

    const augmentedCached = deriveArchetype(archetype, TestComponent2, world);
    expect(augmentedCached).toStrictEqual(augmented);
  });
  it("can cache diminished archetype", () => {
    const world = createWorld();

    const TestComponent1 = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i8,
    });

    const archetype = createArchetype(makeComponentsMask(TestComponent1, TestComponent2));
    const diminished = deriveArchetype(archetype, TestComponent2, world);

    expect(archetype.edge[TestComponent2.id]).toBeTruthy();

    const diminishedCached = deriveArchetype(
      archetype,
      TestComponent2,
      world
    );
    expect(diminishedCached).toStrictEqual(diminished);
  });
});
