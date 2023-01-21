import "jest";
import {
  attach,
  defineComponent,
  hasComponent,
  detach,
  createEntity,
  createWorld
} from "../src";
import Types from "../src/types";

describe("Component", () => {
  it("can be created", () => {
    expect(() => defineComponent({})).not.toThrowError();
  });
  it("sees its array types fields instanciated", () => {
    const TestComponent = defineComponent({
      field: Types.i8,
    });

    expect(TestComponent.field).toBeInstanceOf(Int8Array);
  });
  it("sees its array types fields instanciated and preallocated", () => {
    const TestComponent = defineComponent(
      {
        field: Types.i8,
      },
      1_000_000
    );

    expect(TestComponent.field).toHaveLength(1_000_000);
  });
  it("can have arrays of arrays as data types", () => {
    const TestComponent = defineComponent(
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
    const world = createWorld();
    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const eid = createEntity(world);

    expect(() => attach(TestComponent, eid, world)).not.toThrowError();
  });
  it("adding to non existant entities does throw error", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });

    expect(() => attach(TestComponent, 123, world)).toThrowError();
  });
  it("can be detected on an entity", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const eid = createEntity(world);

    attach(TestComponent, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true);
  });
  it("cannot be detected on an entity if not added", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });

    const eid = createEntity(world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false);
  });
  it("can be removed", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const eid = createEntity(world);

    attach(TestComponent, eid, world);
    detach(TestComponent, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(false);
  });
  it("can add multiple components", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const eid = createEntity(world);

    attach(TestComponent, eid, world);
    attach(TestComponent2, eid, world);

    expect(hasComponent(TestComponent, eid, world)).toStrictEqual(true);
    expect(hasComponent(TestComponent2, eid, world)).toStrictEqual(true);
  });
  it("does not throw when trying to remove a non existant component", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const eid = createEntity(world);

    expect(() => detach(TestComponent, eid, world)).not.toThrowError();
  });
});
