import 'jest';
import {createWorld} from "../src/world";

import {defineComponent} from "../src/component";

describe('Component', () => {
    it('can be created', () => {        
        expect(() => defineComponent({})).not.toThrowError()
    })

});
