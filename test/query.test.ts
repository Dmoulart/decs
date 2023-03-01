import "jest";
import {
  Query,
  registerQuery,
  createWorld,
  attach,
  detach,
  defineComponent,
  createEntity,
  onEnterQuery,
  onExitQuery,
  AlreadyRegisteredQueryError,
  removeQuery,
  RemoveQueryError,
  Entity,
} from "../src";
import {Types} from "../src/types";

describe("Query", () => {
  it("can be created ", () => {
    expect(() => Query()).not.toThrowError();
  });
  it("can query complete sets of components", () => {
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

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);

    const archetypesA = Query().all(TestComponent, TestComponent2).from(world);
    expect(archetypesA.length).toStrictEqual(1);

    const archetypesB = Query().all(TestComponent).from(world);
    expect(archetypesB.length).toStrictEqual(2);
  });
  it("can query some components", () => {
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

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);

    const archetypesA = Query().any(TestComponent, TestComponent2).from(world);
    expect(archetypesA.length).toStrictEqual(2);

    const archetypesB = Query().any(TestComponent).from(world);
    expect(archetypesB.length).toStrictEqual(2);
  });
  it("can exclude some components from query", () => {
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

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);

    const archetypes = Query()
      .any(TestComponent)
      .not(TestComponent2)
      .from(world);
    expect(archetypes.length).toStrictEqual(1);
  });
  it("can exclude group of components from query", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });
    const TestComponent3 = defineComponent({
      test: Types.i32,
    });

    const eid = createEntity(world);
    attach(TestComponent, eid, world);
    attach(TestComponent2, eid, world);
    attach(TestComponent3, eid, world);

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);
    attach(TestComponent2, eid, world);

    const archetypes = Query()
      .any(TestComponent)
      .none(TestComponent2, TestComponent3)
      .from(world);
    expect(archetypes.length).toStrictEqual(2);
  });
  it("can use custom matcher", () => {
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

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);

    const archetypes = Query()
      .any(TestComponent)
      .match((arch) => arch.entities.count() > 10)
      .from(world);

    expect(archetypes.length).toStrictEqual(0);
  });
  it("can be added to world and update automatically", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const eid = createEntity(world);
    attach(TestComponent2, eid, world);

    const query = Query().any(TestComponent, TestComponent2);

    registerQuery(query, world);

    expect(query.archetypes.length).toStrictEqual(1);
    expect(query.archetypes[0].entities.count()).toStrictEqual(1);

    const eid2 = createEntity(world);
    attach(TestComponent, eid2, world);

    expect(query.archetypes.length).toStrictEqual(2);
    expect(query.archetypes[1].entities.count()).toStrictEqual(1);

    detach(TestComponent, eid2, world);
    expect(query.archetypes[1].entities.count()).toStrictEqual(0);
  });
  it("can track whenever entities enter the query", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const query = Query().all(TestComponent, TestComponent2);
    registerQuery(query, world);

    let added = 0;

    const onEnter = onEnterQuery(query);
    onEnter((entities: Array<Entity>) => {
      added += entities.length;
    });

    const eid = createEntity(world);

    attach(TestComponent, eid, world);
    expect(added).toStrictEqual(0);

    attach(TestComponent2, eid, world);
    expect(added).toStrictEqual(1);
  });
  it("can track whenever entities exit the query", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const query = Query().all(TestComponent, TestComponent2);
    registerQuery(query, world);

    const eid = createEntity(world);

    attach(TestComponent, eid, world);
    attach(TestComponent2, eid, world);

    let removed = 0;

    const onExit = onExitQuery(query);
    onExit((entities: Array<Entity>) => {
      removed += entities.length;
    });

    expect(removed).toStrictEqual(0);

    detach(TestComponent2, eid, world);
    expect(removed).toStrictEqual(1);
  });
  it("can track whenever entities enter the query even if handlers have been defined before the query has been registered", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const query = Query().all(TestComponent, TestComponent2);

    let added = 0;

    const onEnter = onEnterQuery(query);
    onEnter((entities: Array<Entity>) => {
      added += entities.length;
    });

    const eid = createEntity(world);
    registerQuery(query, world);

    attach(TestComponent, eid, world);
    expect(added).toStrictEqual(0);

    attach(TestComponent2, eid, world);
    expect(added).toStrictEqual(1);
  });
  it("can track whenever entities exit the query even if handlers have been defined before the query has been registered", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const query = Query().all(TestComponent, TestComponent2);

    const eid = createEntity(world);

    attach(TestComponent, eid, world);
    attach(TestComponent2, eid, world);

    let removed = 0;

    const onExit = onExitQuery(query);
    onExit((entities: Array<Entity>) => {
      removed += entities.length;
    });
    registerQuery(query, world);

    expect(removed).toStrictEqual(0);

    detach(TestComponent2, eid, world);
    expect(removed).toStrictEqual(1);
  });
  it("can cannot be registered to multiple worlds", () => {
    const worldA = createWorld();
    const worldB = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });
    const TestComponent2 = defineComponent({
      test: Types.i32,
    });

    const query = Query().all(TestComponent, TestComponent2);
    registerQuery(query, worldA);

    expect(() => registerQuery(query, worldB)).toThrowError(
      AlreadyRegisteredQueryError
    );
  });
  it("can be removed", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });

    const query = Query().all(TestComponent);
    registerQuery(query, world);
    removeQuery(query, world);

    expect(world.queries).not.toContain(query);
  });
  it("throw an error when trying to remove a query from the wrong world", () => {
    const world = createWorld();
    const worldB = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });

    const query = Query().all(TestComponent);
    registerQuery(query, world);

    expect(() => removeQuery(query, worldB)).toThrowError(RemoveQueryError);
  });
  it("clears its query handlers when query is removed from world", () => {
    const world = createWorld();

    const TestComponent = defineComponent({
      test: Types.i8,
    });

    const query = Query().all(TestComponent);
    registerQuery(query, world);

    const onEnter = onEnterQuery(query);
    const enterHandler = () => {};
    onEnter(enterHandler);

    const onExit = onExitQuery(query);
    const exitHandler = () => {};
    onExit(exitHandler);

    const eid = createEntity(world);
    attach(TestComponent, eid, world);

    removeQuery(query, world);

    const arch = world.entitiesArchetypes[eid]!;

    expect(
      world.handlers.enter[arch.id].some((fn) => fn === enterHandler)
    ).toBeFalsy();
    expect(
      world.handlers.exit[arch.id].some((fn) => fn === exitHandler)
    ).toBeFalsy();
  });
});
