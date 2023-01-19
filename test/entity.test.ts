import "jest";
import { Entity, hasEntity, removeEntity, World } from "../src";

describe("Entity", () => {
  it("can create a new entity", () => {
    const world = World();
    const eid = Entity(world);

    expect(eid).toStrictEqual(1);
  });
  it("can keep track of the entities count", () => {
    const world = World();

    Entity(world);
    Entity(world);

    expect(world.nextEid).toStrictEqual(2);
  });
  it("recycle deleted entities", () => {
    const world = World();

    Entity(world);

    const eidToRemove = Entity(world);
    removeEntity(eidToRemove, world);

    const eid = Entity(world);

    expect(eid).toStrictEqual(eidToRemove);
  });
  it("can verify an entity exists", () => {
    const world = World();

    const eid = Entity(world);

    expect(hasEntity(eid, world)).toStrictEqual(true);
  });
  it("can remove an entity", () => {
    const world = World();

    const eid = Entity(world);
    removeEntity(eid, world);

    expect(hasEntity(eid, world)).toStrictEqual(false);
  });
  it("throws an error when trying to remove a non existant entity", () => {
    const world = World();
    expect(() => removeEntity(123, world)).toThrow();
  });
});
