import {$exposeSystem, reconstructAtomicSparseSet} from "../../src";

$exposeSystem(({$onUpdate}, {position, velocity, arch}) => {
  const sset = reconstructAtomicSparseSet(arch);
  const entities = sset.dense;
  const len = sset.count();

  $onUpdate(() => {
    for (let j = 0; j < len; j++) {
      const ent = entities[j];
      position.x[ent] += velocity.x[ent];
      position.y[ent] += velocity.y[ent];
    }
  });
});
