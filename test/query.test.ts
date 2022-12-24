
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
   it("can query sets of components", () => {
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


});

