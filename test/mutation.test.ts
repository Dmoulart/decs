// import "jest";
// import {
//   defineComponent,
//   f32,
//   Query,
//   registerQuery,
//   Types,
//   ui8,
//   createWorld,
//   prefab,
//   mutation,
//   createEntity,
//   attach,
//   set,
// } from "../src";

// describe("Mutation", () => {
//   it("set", () => {
//     const world = createWorld();

//     const Health = defineComponent({
//       points: Types.ui8,
//     });
//     const Stats = defineComponent({
//       constitution: Types.ui8,
//     });

//     const ent = createEntity(world);

//     set(
//       ent,
//       Health,
//       {
//         points: 10,
//       },
//       world
//     );

//     expect(Health.points[ent]).toEqual(10);
//   });
//   it.skip("test", () => {
//     const world = createWorld();

//     const Health = defineComponent({
//       points: Types.ui8,
//     });
//     const Stats = defineComponent({
//       constitution: Types.ui8,
//     });

//     const hit = mutation({Health, Stats});

//     const ent = createEntity(world);

//     attach(Health, ent, world);
//     attach(Stats, ent, world);

//     Health.points[ent] = 12;
//     Stats.constitution[ent] = 10;

//     hit(ent, {
//       Health: {
//         points: -2,
//       },
//     });

//     expect(Health.points[ent]).toEqual(2);
//     expect(Stats.constitution[ent]).toEqual(9);
//   });
// });
