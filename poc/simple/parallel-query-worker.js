import {$expose, reconstructAtomicSparseSet} from "../../src";

$expose(({$onUpdate}, {position, velocity, arch}) => {
  const sset = reconstructAtomicSparseSet(arch);
  const entities = sset.dense;
  const len = entities.length;

  $onUpdate(() => {
    for (let j = 0; j < len; j++) {
      const ent = entities[j];
      position.x[ent] += velocity.x[ent];
      position.y[ent] += velocity.y[ent];
    }
  });
});
