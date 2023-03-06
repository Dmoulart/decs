import {$expose} from "../src";

$expose(({$onUpdate}) => {
  $onUpdate(() => {
    console.log("hello from worker");
  });
});
