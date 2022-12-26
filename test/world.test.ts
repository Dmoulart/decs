import "jest";
import {createEntity} from "../src/entity";
import {World} from "../src/world";

describe("World", () => {
  it("can be created", () => {
    expect(() => World()).not.toThrowError();
  });
  it("throws when world capacity exceeded", () => {
    const world = World(2);
    createEntity(world);
    createEntity(world);
    expect(() => createEntity(world)).toThrowError();
  });
});
