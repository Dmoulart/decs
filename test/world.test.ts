import 'jest';
import {World} from "../src/world";

describe('World', () => {
    it('can be created', () => {
        expect(() => World()).not.toThrowError()
    })
/*    it('can create entity', () => {
        const world = createWorld()

        expect(world.createEntity()).toBeDefined()
    })*/
});