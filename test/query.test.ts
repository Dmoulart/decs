
import "jest";
import {Query} from "../src/query";
import {World} from '../src/world'
import {addComponent, Component} from '../src/component'
import {Types} from '../src/types'
import {createEntity} from "../src/entity";

describe("Query", () => {
   it("can be created ", () => {
        expect(() => Query()).not.toThrowError();
   });
   it("can query complete sets of components", () => {
       const world = World()

       const TestComponent = Component({
           test: Types.i8
       }, world)
       const TestComponent2 = Component({
           test: Types.i32
       }, world)

       const eid = createEntity(world)
       addComponent(TestComponent, eid, world)
       addComponent(TestComponent2, eid, world)

       const eid2 = createEntity(world)
       addComponent(TestComponent, eid2, world)

       const a = Query().all(TestComponent, TestComponent2).from(world)
       expect(a.archetypes.length).toStrictEqual(1);

       const b = Query().all(TestComponent).from(world)
       expect(b.archetypes.length).toStrictEqual(2);
   });
   it("can query some components", () => {
       const world = World()

       const TestComponent = Component({
           test: Types.i8
       }, world)
       const TestComponent2 = Component({
           test: Types.i32
       }, world)

       const eid = createEntity(world)
       addComponent(TestComponent, eid, world)
       addComponent(TestComponent2, eid, world)

       const eid2 = createEntity(world)
       addComponent(TestComponent, eid2, world)

       const a = Query().any(TestComponent, TestComponent2).from(world)
       expect(a.archetypes.length).toStrictEqual(2);

       const b = Query().any(TestComponent).from(world)
       expect(b.archetypes.length).toStrictEqual(2);
   });
   it("can exclude some components from query", () => {
       const world = World()

       const TestComponent = Component({
           test: Types.i8
       }, world)
       const TestComponent2 = Component({
           test: Types.i32
       }, world)

       const eid = createEntity(world)
       addComponent(TestComponent, eid, world)
       addComponent(TestComponent2, eid, world)

       const eid2 = createEntity(world)
       addComponent(TestComponent, eid2, world)

       const a = Query().any(TestComponent).not(TestComponent2).from(world)
       expect(a.archetypes.length).toStrictEqual(1);
   });
   it("can exclude group of components from query", () => {
       const world = World()

       const TestComponent = Component({
           test: Types.i8
       }, world)
       const TestComponent2 = Component({
           test: Types.i32
       }, world)
       const TestComponent3 = Component({
           test: Types.i32
       }, world)

       const eid = createEntity(world)
       addComponent(TestComponent, eid, world)
       addComponent(TestComponent2, eid, world)
       addComponent(TestComponent3, eid, world)

       const eid2 = createEntity(world)
       addComponent(TestComponent, eid2, world)
       addComponent(TestComponent2, eid, world)

       const a = Query().any(TestComponent).none(TestComponent2, TestComponent3).from(world)
       expect(a.archetypes.length).toStrictEqual(2);
   });


});

