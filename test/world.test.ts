import 'jest';
import {createWorld} from "../src/world";
import {createEntity} from "../src/entity";

describe('World', () => {
    it('can be created', () => {
        expect(() => createWorld()).not.toThrowError()
    })
    it('can create a new entity', () => {
        const world = createWorld()
        const eid = createEntity(world)
        expect(eid).toStrictEqual(1)
    })
    it('can keep track of the entities count', () => {
        const world = createWorld()

        createEntity(world)
        createEntity(world)

        expect(world.count()).toStrictEqual(2)
    })
    it('can verify an entity exists', () => {
        const world = createWorld()

        const eid = createEntity(world)

        expect(world.has(eid)).toStrictEqual(true)
    })
    it('can remove an entity', () => {
        const world = createWorld()

        const eid = createEntity(world)
        world.remove(eid)

        expect(world.has(eid)).toStrictEqual(false)
    })
});