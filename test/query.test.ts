import "jest";
import {Query, registerQuery} from "../src/query";
import {World} from "../src/world";
import {addComponent, Component, removeComponent} from "../src/component";
import {Types} from "../src/types";
import {createEntity} from "../src/entity";

describe("Query", () => {
  it("can be created ", () => {
    expect(() => Query()).not.toThrowError();
  });
  it("can query complete sets of components", () => {
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

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);

    const a = Query().all(TestComponent, TestComponent2).from(world);
    expect(a.archetypes.length).toStrictEqual(1);

    const b = Query().all(TestComponent).from(world);
    expect(b.archetypes.length).toStrictEqual(2);
  });
  it("can query some components", () => {
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

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);

    const a = Query().any(TestComponent, TestComponent2).from(world);
    expect(a.archetypes.length).toStrictEqual(2);

    const b = Query().any(TestComponent).from(world);
    expect(b.archetypes.length).toStrictEqual(2);
  });
  it("can exclude some components from query", () => {
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

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);

    const query = Query().any(TestComponent).not(TestComponent2).from(world);
    expect(query.archetypes.length).toStrictEqual(1);
  });
  it("can exclude group of components from query", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i32,
    });
    const TestComponent3 = Component({
      test: Types.i32,
    });

    const eid = createEntity(world);
    addComponent(TestComponent, eid, world);
    addComponent(TestComponent2, eid, world);
    addComponent(TestComponent3, eid, world);

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);
    addComponent(TestComponent2, eid, world);

    const query = Query()
      .any(TestComponent)
      .none(TestComponent2, TestComponent3)
      .from(world);
    expect(query.archetypes.length).toStrictEqual(2);
  });
  it("can use custom matcher", () => {
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

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);

    const query = Query()
      .any(TestComponent)
      .match((arch) => arch.entities.count() > 10)
      .from(world);

    expect(query.archetypes.length).toStrictEqual(0);
  });
  it("can be added to world and update automatically", () => {
    const world = World();

    const TestComponent = Component({
      test: Types.i8,
    });
    const TestComponent2 = Component({
      test: Types.i32,
    });

    const eid = createEntity(world);
    addComponent(TestComponent2, eid, world);

    const query = Query().any(TestComponent, TestComponent2);

    registerQuery(query, world);

    expect(query.archetypes.length).toStrictEqual(1);
    expect(query.archetypes[0].entities.count()).toStrictEqual(1);

    const eid2 = createEntity(world);
    addComponent(TestComponent, eid2, world);

    expect(query.archetypes.length).toStrictEqual(2);
    expect(query.archetypes[1].entities.count()).toStrictEqual(1);

    removeComponent(TestComponent, eid2, world);
    expect(query.archetypes[1].entities.count()).toStrictEqual(0);
  });
});
