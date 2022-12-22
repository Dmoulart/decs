import "jest";
import {World} from "../src/world";

import {addComponent, Component, hasComponent, removeComponent} from "../src/component";
import Types from "../src/types";
import {createEntity} from "../src/entity";

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
    expect(TestComponent.nested[0]).toHaveLength(5);
  });
  it("can be added to entities without throwing error", () => {
      const world = World();
      const TestComponent = Component({
        test: Types.i8
      }, world)
      const eid = createEntity(world)

      expect(() => addComponent(TestComponent, eid, world)).not.toThrowError()
  });
  it("cannot be added to non existant entities", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)

      expect(() => addComponent(TestComponent, 123, world)).toThrowError()
  });
  it("can be detected on an entity", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)
      const eid = createEntity(world)

      addComponent(TestComponent, eid, world)

      expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true)
  });
  it("cannot be detected on an entity if not added", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)

      const eid = createEntity(world)

      expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false)
  });
  it("can be removed", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)
      const eid = createEntity(world)

      addComponent(TestComponent, eid, world)
      removeComponent(TestComponent, eid, world)

      expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false)
  });
  it("can add multiple components", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)
      const TestComponent2 = Component({
          test: Types.i32
      }, world)

      const eid = createEntity(world)

      addComponent(TestComponent, eid, world)
      addComponent(TestComponent2, eid, world)

      expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true)
      expect(hasComponent(TestComponent2, eid, world)).toStrictEqual(true)
  });
  it("don't throw when trying to remove component which does not exists", () => {
      const world = World();

      const TestComponent = Component({
          test: Types.i8
      }, world)
      const eid = createEntity(world)

      expect(() => removeComponent(TestComponent, eid, world)).not.toThrowError()
  });
});

