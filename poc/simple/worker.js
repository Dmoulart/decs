import {$expose} from "../../src";

$expose(({$onUpdate}, {position, velocity}) => {
  $onUpdate(() => {
    for (let i = 0; i < 100_000; i++) {
      position.x[i] += 15;
      position.y[i] += 15;
    }
  });
});
