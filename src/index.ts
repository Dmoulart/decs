import {SparseSet} from "./sparse-set";

const {insert, has, count} = SparseSet()

insert(2)

insert(1)

console.log(has(2))

console.log(has(1))

console.log(has(0))

console.log(count())