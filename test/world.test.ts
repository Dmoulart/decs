import "jest";
import {Entity, World} from "../src";


describe("World", () => {
  it("can be created", () => {
    expect(() => World()).not.toThrowError();
  });
  it("throws when world capacity exceeded", () => {
    const world = World(2);
    Entity(world);
    Entity(world);
    expect(() => Entity(world)).toThrowError();
  });
});
