import 'jest';
import {createWorld} from "../src/world";
import {createEntity, hasEntity, removeEntity} from "../src/entity";

describe('Entity', () => {
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
    it('can keep track of the entities count when removing entities', () => {
        const world = createWorld()

        createEntity(world)

        const eidToRemove = createEntity(world)
        removeEntity(eidToRemove, world)

        const eid = createEntity(world)

        expect(eid).toStrictEqual(3)
    })
    it('can verify an entity exists', () => {
        const world = createWorld()

        const eid = createEntity(world)

        expect(hasEntity(eid, world)).toStrictEqual(true)
    })
    it('can remove an entity', () => {
        const world = createWorld()

        const eid = createEntity(world)
        removeEntity(eid, world)

        expect(hasEntity(eid, world)).toStrictEqual(false)
    })
});