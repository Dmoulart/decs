import "jest";
import {World} from "../src/world";

import {
  addComponent,
  Component,
  hasComponent,
  removeComponent,
} from "../src/component";
import Types from "../src/types";
import {createEntity} from "../src/entity";

describe("Component", () => {
  it("can be created", () => {
    const world = World();
    expect(() => Component({})).not.toThrowError();
  });
  it("sees its array types fields instanciated", () => {
    const TestComponent = Component({
      field: Types.i8,
    });

    expect(TestComponent.field).toBeInstanceOf(Int8Array);
  });
  it("sees its array types fields instanciated and preallocated", () => {
    const TestComponent = Component(
      {
        field: Types.i8,
      },
      1_000_000
    );

    expect(TestComponent.field).toHaveLength(1_000_000);
  });
  it("can have arrays of arrays as data types", () => {
    const TestComponent = Component(
      {
        nested: [Types.i8, 5],
      },
      1_000_000
    );

    expect(TestComponent.nested).toBeInstanceOf(Array);
    expect(TestComponent.nested).toHaveLength(1_000_000);
    expect(TestComponent.nested[0]).toHaveLength(5);
  });
  it("can be added to entities without throwing error", () => {
    const world = World();
    const TestComponent = Component({
      test: Types.i8,
    });
    const eid = createEntity(world);

    expect(() => addComponent(TestComponent, eid, world)).not.toThrowError();
  });
  it("adding to non existant entities does throw error", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });

    expect(() => addComponent(TestComponent, 123, world)).toThrowError();
  });
  it("can be detected on an entity", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const eid = createEntity(world);

    addComponent(TestComponent, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true);
  });
  it("cannot be detected on an entity if not added", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });

    const eid = createEntity(world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false);
  });
  it("can be removed", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const eid = createEntity(world);

    addComponent(TestComponent, eid, world);
    removeComponent(TestComponent, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false);
  });
  it("can add multiple components", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i32,
    });

    const eid = createEntity(world);

    addComponent(TestComponent, eid, world);
    addComponent(TestComponent2, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true);
    expect(hasComponent(TestComponent2, eid, world)).toStrictEqual(true);
  });
  it("does not throw when trying to remove a non existant component", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const eid = createEntity(world);

    expect(() => removeComponent(TestComponent, eid, world)).not.toThrowError();
  });
});
