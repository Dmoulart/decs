import "jest";
import {createEntity, existsEntity, nextEid, removeEntity, createWorld} from "../src";

describe("Entity", () => {
  it("can create a new entity", () => {
    const world = createWorld();
    const eid = createEntity(world);

    expect(eid).toStrictEqual(1);
  });
  it("can keep track of the entities count, starting from 1", () => {
    const world = createWorld();

    createEntity(world);
    createEntity(world);

    expect(nextEid).toStrictEqual(3);
  });
  it("recycle deleted entities", () => {
    const world = createWorld();

    createEntity(world);

    const eidToRemove = createEntity(world);
    removeEntity(eidToRemove, world);

    const eid = createEntity(world);

    expect(eid).toStrictEqual(eidToRemove);
  });
  it("can verify an entity exists", () => {
    const world = createWorld();

    const eid = createEntity(world);

    expect(existsEntity(eid, world)).toStrictEqual(true);
  });
  it("can remove an entity", () => {
    const world = createWorld();

    const eid = createEntity(world);
    removeEntity(eid, world);

    expect(existsEntity(eid, world)).toStrictEqual(false);
  });
  it("throws an error when trying to remove a non existant entity", () => {
    const world = createWorld();
    expect(() => removeEntity(123, world)).toThrow();
  });
});
