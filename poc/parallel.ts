import {$defineSystem} from "../src";

(async function () {
  const system = await $defineSystem("./poc/worker.js");
  await system.run();
  await system.terminate();
})();
