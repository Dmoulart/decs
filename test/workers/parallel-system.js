import {$expose} from "../../dist/src//parallel/parallel.js";
$expose(({$onUpdate}, {position, propToMutate}) => {
  $onUpdate(() => {
    if (propToMutate === "x") {
      position.x[10] = 20;
    } else {
      position.y[10] = 20;
    }
  });
});
