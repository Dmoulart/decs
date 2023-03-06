import {$defineSystem} from "./system_old";
import {$createWorld} from "../../src";

const sys = $defineSystem($createWorld(), () => {
  console.log("hello");
}).then(async (sys) => {
  await sys.run();
});
// console.log(sys);
// sys.run();
