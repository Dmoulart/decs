import "jest";
import {defineComponent, createEntity, i8, useWorld, createWorld} from "../src";

describe("World", () => {
  it("can be created", () => {
    expect(() => createWorld()).not.toThrowError();
  });
  it("throws when world capacity exceeded", () => {
    const world = createWorld(2);
    createEntity(world);
    createEntity(world);
    expect(() => createEntity(world)).toThrowError();
  });
  it("can create multiple world", () => {
    const worldA = createWorld(100_000);
    const worldB = createWorld(100_000);
    expect(() => createWorld(100_000)).not.toThrowError();
  });
  it("can use world API", () => {
    const {attach, detach, exists, hasComponent, prefab} = useWorld();

    const TestComponent = defineComponent({
      field: i8,
    });
    const TestComponent2 = defineComponent({
      field: i8,
    });

    const actor = prefab({TestComponent});

    const player = actor({
      TestComponent: {
        field: 10,
      },
    });

    attach(TestComponent2, player);
    expect(hasComponent(TestComponent2, player)).toStrictEqual(true);

    detach(TestComponent2, player);
    expect(hasComponent(TestComponent2, player)).toStrictEqual(false);

    expect(exists(player)).toStrictEqual(true);
  });
});
