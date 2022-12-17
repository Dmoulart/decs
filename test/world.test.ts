import 'jest';
import {createWorld} from "../src/world";

describe('World', () => {
    it('can be created', () => {
        expect(() => createWorld()).not.toThrowError()
    })
/*    it('can create entity', () => {
        const world = createWorld()

        expect(world.createEntity()).toBeDefined()
    })*/
});