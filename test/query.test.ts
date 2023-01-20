import "jest";
import {Query, registerQuery, World, attach, detach, Component, Entity, onEnterQuery, onExitQuery} from "../src";
import { Types } from "../src/types";

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

        const eid = Entity(world);
        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);

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

        const eid = Entity(world);
        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);

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

        const eid = Entity(world);
        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);

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

        const eid = Entity(world);
        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);
        attach(TestComponent3, eid, world);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);
        attach(TestComponent2, eid, world);

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

        const eid = Entity(world);
        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);

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

        const eid = Entity(world);
        attach(TestComponent2, eid, world);

        const query = Query().any(TestComponent, TestComponent2);

        registerQuery(query, world);

        expect(query.archetypes.length).toStrictEqual(1);
        expect(query.archetypes[0].entities.count()).toStrictEqual(1);

        const eid2 = Entity(world);
        attach(TestComponent, eid2, world);

        expect(query.archetypes.length).toStrictEqual(2);
        expect(query.archetypes[1].entities.count()).toStrictEqual(1);

        detach(TestComponent, eid2, world);
        expect(query.archetypes[1].entities.count()).toStrictEqual(0);
    });
    it("can track whenever entities enter the query", () => {
        const world = World();

        const TestComponent = Component({
            test: Types.i8,
        });
        const TestComponent2 = Component({
            test: Types.i32,
        });

        const query =  Query().all(TestComponent, TestComponent2);
        registerQuery(query, world)

        let added = 0;

        const onEnter = onEnterQuery(query)
        onEnter((entities: Array<Entity>) => {
            added += entities.length
        })

        const eid = Entity(world);

        attach(TestComponent, eid, world);
        expect(added).toStrictEqual(0)

        attach(TestComponent2, eid, world);
        expect(added).toStrictEqual(1)
    });
    it("can track whenever entities exit the query", () => {
        const world = World();

        const TestComponent = Component({
            test: Types.i8,
        });
        const TestComponent2 = Component({
            test: Types.i32,
        });

        const query =  Query().all(TestComponent, TestComponent2);
        registerQuery(query, world)

        const eid = Entity(world);

        attach(TestComponent, eid, world);
        attach(TestComponent2, eid, world);

        let removed = 0;

        const onExit = onExitQuery(query)
        onExit((entities: Array<Entity>) => {
            removed += entities.length
        })

        expect(removed).toStrictEqual(0)

        detach(TestComponent2, eid, world);
        expect(removed).toStrictEqual(1)
    });
});
