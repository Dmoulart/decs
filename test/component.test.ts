import "jest";
import {World} from "../src/world";

import {Component} from "../src/component";
import Types from "../src/types";

describe("Component", () => {
  it("can be created", () => {
    const world = World();
    expect(() => Component({}, world)).not.toThrowError();
  });
  it("is attached to world when created", () => {
    const world = World();
    const TestComponent = Component({}, world);

    expect(TestComponent.$world).toStrictEqual(world);
  });
  it("sees its array types fields instanciated", () => {
    const world = World();
    const TestComponent = Component(
      {
        field: Types.i8,
      },
      world
    );

    expect(TestComponent.field).toBeInstanceOf(Int8Array);
  });
  it("sees its array types fields instanciated and preallocated", () => {
    const world = World(1_000_000);
    const TestComponent = Component(
      {
        field: Types.i8,
      },
      world
    );

    expect(TestComponent.field).toHaveLength(1_000_000);
  });
  //   it("can have standard arrays for string and typed arrays for numbers", () => {
  //     const world = World();
  //     const TestComponent = Component(
  //       {
  //         number: Types.i8,
  //         string: Types.string,
  //       },
  //       world
  //     );

  //     expect(TestComponent.number).toBeInstanceOf(Types.i8);
  //     expect(TestComponent.string).toBeInstanceOf(Array);
  //   });
  it("can have arrays of arrays as data types", () => {
    const world = World(1_000_000);
    const TestComponent = Component(
      {
        nested: [Types.i8, 5],
      },
      world
    );

    expect(TestComponent.nested).toBeInstanceOf(Array);
    expect(TestComponent.nested).toHaveLength(1_000_000);
    expect((TestComponent.nested)[0]).toHaveLength(0);
  });
});
