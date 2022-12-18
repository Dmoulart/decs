import {SparseSet} from "../src/sparse-set.js";
import {run} from "./index.js";

const sset = SparseSet()

run('Sparse Set: Insert 100_000 number', () => {
    for(let i = 0; i <= 100_000; i++){
        sset.insert(1)
    }
})