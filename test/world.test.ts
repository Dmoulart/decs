import 'jest';
import {World} from "../src/world";

describe('World', () => {
    it('can be created', () => {
        expect(() => World()).not.toThrowError()
    })
});