import "jest";
import {Component, InferComponentDefinition, Query, registerQuery, Types, World} from "../src";
import {Model} from "../src/model";

describe("Model", () => {
    it("can be created", () => {
        expect(() => Model(World())).not.toThrowError();
    });
    it("can be created", () => {
        const Position = Component({
            x: Types.f32,
            y: Types.f32,
        });
        const Velocity = Component({
            x: Types.f32,
            y: Types.f32,
        });

        const actor = Model(World(), Position, Velocity)
        const ent = actor({x: 10, y: 10}, {y: 10, x: 10})

        expect(
            Position.x[ent] === 10 && Position.y[ent] === 10 &&
            Velocity.x[ent] === 10 && Velocity.y[ent] === 10)
            .toBeTruthy()
    });
    it("can be queried", () => {
        const Position = Component({
            x: Types.f32,
            y: Types.f32,
        });
        const Velocity = Component({
            x: Types.f32,
            y: Types.f32,
        });

        const world = World()
        const actor = Model(world, Position, Velocity)

        actor({x: 10, y: 10}, {y: 10, x: 10})

        const query = Query().all(Position, Velocity).from(world)

        expect(query.archetypes.length === 1).toBeTruthy()
        expect(query.archetypes[0].entities.count() === 1).toBeTruthy()
    });
    it("can register to existing query", () => {
        const Position = Component({
            x: Types.f32,
            y: Types.f32,
        });
        const Velocity = Component({
            x: Types.f32,
            y: Types.f32,
        });

        const world = World()
        const query = Query().all(Position, Velocity)
        registerQuery(query, world)

        const actor = Model(world, Position, Velocity)
        actor({x: 10, y: 10}, {y: 10, x: 10, })

        expect(query.archetypes.length === 1).toBeTruthy()
        expect(query.archetypes[0].entities.count() === 1).toBeTruthy()
    });
});
